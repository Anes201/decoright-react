import { createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import useAuth from '@/hooks/useAuth';
import type { ChatRoom, Message, MessageType } from '@/types/chat';

interface ChatContextType {
    rooms: ChatRoom[];
    selectedRoom: ChatRoom | null;
    setSelectedRoom: (room: ChatRoom | null) => void;
    messages: Message[];
    messageText: string;
    setMessageText: (text: string) => void;
    loadingRooms: boolean;
    loadingMessages: boolean;
    filter: 'all' | 'unread';
    setFilter: (filter: 'all' | 'unread') => void;
    sendMessage: (e?: React.FormEvent) => Promise<void>;
    sendMedia: (file: File | Blob, type: MessageType) => Promise<void>;
    deleteMessage: (messageId: string) => Promise<void>;
    roomIdFromUrl: string | undefined;
}

const ChatContext = createContext<ChatContextType | null>(null);

export function ChatProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const { id: roomIdFromUrl } = useParams<{ id: string }>();


    const [rooms, setRooms] = useState<ChatRoom[]>([]);
    const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [messageText, setMessageText] = useState('');
    const [filter, setFilter] = useState<'all' | 'unread'>('all');
    const [loadingRooms, setLoadingRooms] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(false);

    // Refs to prevent stale closures and track current state
    const selectedRoomRef = useRef<ChatRoom | null>(null);
    const loadRoomsCalledRef = useRef(false);

    // Sync ref with state
    useEffect(() => {
        selectedRoomRef.current = selectedRoom;
    }, [selectedRoom]);

    // Optimized room fetching - single query approach
    const loadRooms = useCallback(async () => {
        if (!user || loadRoomsCalledRef.current) return;
        loadRoomsCalledRef.current = true;

        try {
            setLoadingRooms(true);

            // Fetch rooms with service request info
            const { data: roomsData, error: roomsError } = await supabase
                .from('chat_rooms')
                .select(`
                    *,
                    service_requests (
                        id,
                        request_code,
                        service_type_id,
                        status,
                        service_types (
                            name,
                            display_name_en
                        ),
                        profiles:user_id (
                            id,
                            full_name
                        )
                    )
                `)
                .eq('is_active', true)
                .order('updated_at', { ascending: false });

            if (roomsError) throw roomsError;

            // Batch fetch last messages for all rooms in a single query
            const roomIds = (roomsData || []).map(r => r.id);
            const lastMessagesMap: Record<string, Message> = {};
            const unreadCountsMap: Record<string, number> = {};

            if (roomIds.length > 0) {
                // Get last message per room using a subquery approach
                // We'll fetch recent messages and group client-side for simplicity
                const { data: recentMessages } = await supabase
                    .from('messages')
                    .select('*')
                    .in('chat_room_id', roomIds)
                    .order('created_at', { ascending: false })
                    .limit(roomIds.length * 2); // Get enough to have at least 1 per room

                if (recentMessages) {
                    // Group by chat_room_id, keep only the latest
                    for (const msg of recentMessages) {
                        const roomId = msg.chat_room_id;
                        if (roomId && !lastMessagesMap[roomId]) {
                            lastMessagesMap[roomId] = msg as Message;
                        }
                    }
                }

                // Get unread counts in a single query using RPC or a smarter approach
                // For now, we'll skip individual unread counts to prevent N+1
                // and use realtime to update unread counts incrementally
            }

            const enrichedRooms = (roomsData || []).map(room => ({
                ...room,
                last_message: lastMessagesMap[room.id] || null,
                unread_count: unreadCountsMap[room.id] || 0
            })) as ChatRoom[];

            setRooms(enrichedRooms);
        } catch (error) {
            console.error("Failed to load rooms:", error);
        } finally {
            setLoadingRooms(false);
            loadRoomsCalledRef.current = false;
        }
    }, [user]);

    // Initial load - only once per mount
    useEffect(() => {
        if (user) {
            loadRooms();
        }
    }, [user]); // Intentionally not including loadRooms to prevent loops

    // Room subscription - lightweight updates only
    useEffect(() => {
        if (!user) return;

        const channel = supabase
            .channel('chat_rooms_realtime')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'chat_rooms' }, (payload) => {
                // Handle room updates without full refetch
                if (payload.eventType === 'UPDATE') {
                    setRooms(prev => prev.map(room =>
                        room.id === payload.new.id ? { ...room, ...payload.new } : room
                    ));
                } else if (payload.eventType === 'INSERT') {
                    // Only refetch for new rooms (rare event)
                    loadRooms();
                } else if (payload.eventType === 'DELETE') {
                    // Better to refetch rooms to ensure correct unread counts and last messages
                    loadRoomsCalledRef.current = false;
                    loadRooms();
                }
            })
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
                const newMsg = payload.new as Message;

                // Update last_message in rooms list without full refetch
                setRooms(prev => prev.map(room => {
                    if (room.id === newMsg.chat_room_id) {
                        const isFromOther = newMsg.sender_id !== user.id;
                        return {
                            ...room,
                            last_message: newMsg,
                            unread_count: isFromOther && selectedRoomRef.current?.id !== room.id
                                ? (room.unread_count || 0) + 1
                                : room.unread_count,
                            updated_at: newMsg.created_at
                        };
                    }
                    return room;
                }));
            })
            .subscribe();

        return () => { channel.unsubscribe(); };
    }, [user, loadRooms]);

    // Handle URL-based room selection
    useEffect(() => {
        if (roomIdFromUrl && rooms.length > 0) {
            // Find by room ID OR by the associated request ID
            const room = rooms.find(r =>
                r.id === roomIdFromUrl ||
                r.service_requests?.id === roomIdFromUrl
            );

            if (room && selectedRoom?.id !== room.id) {
                setSelectedRoom(room);
            }
        }
    }, [roomIdFromUrl, rooms]); // Intentionally not including selectedRoom to prevent loops

    // Load messages when room changes
    useEffect(() => {
        if (!selectedRoom) {
            setMessages([]);
            return;
        }

        let cancelled = false;

        const loadMessages = async () => {
            setLoadingMessages(true);
            try {
                const { data, error } = await supabase
                    .from('messages')
                    .select('*')
                    .eq('chat_room_id', selectedRoom.id)
                    .order('created_at', { ascending: true });

                if (error) throw error;
                if (!cancelled) {
                    setMessages(data as Message[]);
                }

                // Mark as read
                await supabase
                    .from('messages')
                    .update({ is_read: true })
                    .eq('chat_room_id', selectedRoom.id)
                    .eq('is_read', false);

                // Update local unread count
                setRooms(prev => prev.map(r =>
                    r.id === selectedRoom.id ? { ...r, unread_count: 0 } : r
                ));
            } catch (error) {
                console.error("Failed to load messages:", error);
            } finally {
                if (!cancelled) {
                    setLoadingMessages(false);
                }
            }
        };

        loadMessages();

        // Subscribe to new messages for this room only
        const channel = supabase
            .channel(`room_messages_${selectedRoom.id}`)
            .on('postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    filter: `chat_room_id=eq.${selectedRoom.id}`
                },
                (payload) => {
                    const newMsg = payload.new as Message;
                    setMessages(prev => {
                        if (prev.some(m => m.id === newMsg.id)) return prev;
                        return [...prev, newMsg];
                    });

                    // Mark as read immediately if we're in the room
                    if (newMsg.sender_id !== user?.id) {
                        supabase
                            .from('messages')
                            .update({ is_read: true })
                            .eq('id', newMsg.id);
                    }
                }
            )
            .on('postgres_changes',
                {
                    event: 'DELETE',
                    schema: 'public',
                    table: 'messages',
                    filter: `chat_room_id=eq.${selectedRoom.id}`
                },
                (payload) => {
                    const deletedId = payload.old.id;
                    setMessages(prev => prev.filter(m => m.id !== deletedId));
                }
            )
            .subscribe();

        return () => {
            cancelled = true;
            channel.unsubscribe();
        };
    }, [selectedRoom?.id, user?.id]); // Only depend on IDs, not full objects

    // Clear message text on room change
    useEffect(() => {
        setMessageText('');
    }, [selectedRoom?.id]);

    const sendMessage = useCallback(async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!messageText.trim() || !selectedRoom || !user) return;

        const text = messageText.trim();
        setMessageText(''); // Optimistic clear

        try {
            const { data, error } = await supabase
                .from('messages')
                .insert({
                    chat_room_id: selectedRoom.id,
                    request_id: selectedRoom.service_requests.id,
                    sender_id: user.id,
                    content: text,
                    message_type: 'TEXT',
                    is_read: true
                } as any)
                .select()
                .single();

            if (error) throw error;

            // Append optimistically (subscription will dedupe)
            setMessages(prev => {
                if (prev.some(m => m.id === data.id)) return prev;
                return [...prev, data as Message];
            });

            // Update room's updated_at
            await supabase
                .from('chat_rooms')
                .update({ updated_at: new Date().toISOString() })
                .eq('id', selectedRoom.id);
        } catch (error) {
            console.error("Failed to send message:", error);
            setMessageText(text); // Restore on error
        }
    }, [messageText, selectedRoom, user]);

    const sendMedia = useCallback(async (file: File | Blob, type: MessageType) => {
        if (!selectedRoom || !user) return;

        try {
            const ext = type === 'IMAGE' ? (file as File).name?.split('.').pop() || 'jpg' : 'webm';
            const fileName = `${selectedRoom.id}/${Date.now()}.${ext}`;

            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('request-attachments')
                .upload(fileName, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('request-attachments')
                .getPublicUrl(uploadData.path);

            const { data, error } = await supabase
                .from('messages')
                .insert({
                    chat_room_id: selectedRoom.id,
                    request_id: selectedRoom.service_requests.id,
                    sender_id: user.id,
                    content: '',
                    message_type: type,
                    media_url: publicUrl,
                    is_read: true
                } as any)
                .select()
                .single();

            if (error) throw error;

            setMessages(prev => {
                if (prev.some(m => m.id === data.id)) return prev;
                return [...prev, data as Message];
            });

            await supabase
                .from('chat_rooms')
                .update({ updated_at: new Date().toISOString() })
                .eq('id', selectedRoom.id);
        } catch (error) {
            console.error("Failed to send media:", error);
            throw error;
        }
    }, [selectedRoom, user]);

    const filteredRooms = rooms.filter(room => {
        if (filter === 'unread') return room.unread_count && room.unread_count > 0;
        return true;
    });

    const deleteMessage = useCallback(async (messageId: string) => {
        try {
            // Optimistic update
            setMessages(prev => prev.filter(m => m.id !== messageId));

            const { data: message } = await supabase
                .from('messages')
                .select('*')
                .eq('id', messageId)
                .single();

            if (message?.media_url) {
                const urlParts = message.media_url.split('/request-attachments/');
                if (urlParts.length > 1) {
                    await supabase.storage
                        .from('request-attachments')
                        .remove([urlParts[1]]);
                }
            }

            const { error } = await supabase
                .from('messages')
                .delete()
                .eq('id', messageId);

            if (error) throw error;
        } catch (error) {
            console.error("Failed to delete message:", error);
        }
    }, []);

    return (
        <ChatContext.Provider value={{
            rooms: filteredRooms,
            selectedRoom,
            setSelectedRoom,
            messages,
            messageText,
            setMessageText,
            loadingRooms,
            loadingMessages,
            filter,
            setFilter,
            sendMessage,
            sendMedia,
            deleteMessage,
            roomIdFromUrl
        }}>
            {children}
        </ChatContext.Provider>
    );
}

export function useChatContext() {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error('useChatContext must be used within a ChatProvider');
    }
    return context;
}
