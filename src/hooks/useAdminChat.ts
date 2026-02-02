import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChatService } from '@/services/chat.service';
import type { ChatRoom, Message, MessageType } from '@/types/chat';
import { supabase } from '@/lib/supabase';
import useAuth from './useAuth';

export function useAdminChat() {
    const { user } = useAuth();
    const currentUserId = user?.id;

    const [searchParams, setSearchParams] = useSearchParams();
    const roomIdParam = searchParams.get('room');

    const [rooms, setRooms] = useState<ChatRoom[]>([]);
    const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [messageText, setMessageText] = useState('');
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'unread'>('all');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, scrollToBottom]);


    const loadRooms = useCallback(async () => {
        try {
            setLoading(true);
            const data = await ChatService.getChatRooms();
            setRooms(data);
        } catch (error) {
            console.error("Failed to load rooms:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    // Initial load
    useEffect(() => {
        loadRooms();
    }, [loadRooms]);

    // Room subscription - handle updates to room metadata (like last_message_at)
    useEffect(() => {
        const sub = supabase
            .channel('chat_rooms_list')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'chat_rooms' }, () => {
                // When rooms change, we can just refresh the list or update the specific room
                // For now, refreshing the list is fine as it's not frequent
                loadRooms();
            })
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
                const newMsg = payload.new as Message;
                setRooms(prev => prev.map(room => {
                    if (room.id === newMsg.chat_room_id) {
                        return {
                            ...room,
                            last_message: newMsg,
                            unread_count: (newMsg.sender_id !== currentUserId) ? (room.unread_count || 0) + 1 : (room.unread_count || 0),
                            updated_at: newMsg.created_at
                        };
                    }
                    return room;
                }));
            })
            .subscribe();

        return () => { sub.unsubscribe(); };
    }, [loadRooms, currentUserId]);

    // Handle deep linking
    useEffect(() => {
        if (roomIdParam && rooms.length > 0 && !selectedRoom) {
            const room = rooms.find(r => r.id === roomIdParam);
            if (room) setSelectedRoom(room);
        }
    }, [roomIdParam, rooms, selectedRoom]);

    const handleSelectRoom = (room: ChatRoom | null) => {
        setSelectedRoom(room);
        if (roomIdParam) {
            setSearchParams(params => {
                params.delete('room');
                return params;
            });
        }
    };

    // Load messages when room changes
    useEffect(() => {
        if (!selectedRoom) {
            setMessages([]);
            return;
        }

        const loadMessages = async () => {
            try {
                const data = await ChatService.getRoomMessages(selectedRoom.id);
                setMessages(data);

                // Optimistically clear unread count for this room
                setRooms(prev => prev.map(r => r.id === selectedRoom.id ? { ...r, unread_count: 0 } : r));
                await ChatService.markAsRead(selectedRoom.id);
            } catch (error) {
                console.error("Failed to load messages:", error);
            }
        };

        loadMessages();

        const sub = ChatService.subscribeToMessages(selectedRoom.id, (newMsg) => {
            setMessages(prev => {
                if (prev.some(m => m.id === newMsg.id)) return prev;
                return [...prev, newMsg];
            });

            // If we are in the room, mark as read immediately
            if (newMsg.sender_id !== currentUserId) {
                ChatService.markAsRead(selectedRoom.id);
                setRooms(prev => prev.map(r => r.id === selectedRoom.id ? { ...r, unread_count: 0 } : r));
            }
        });

        return () => { sub.unsubscribe(); };
    }, [selectedRoom?.id, currentUserId]); // Only depend on selectedRoom ID and currentUserId


    const sendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!messageText.trim() || !selectedRoom) return;

        try {
            const text = messageText.trim();
            setMessageText(''); // Optimistic clear for input field
            const sentMsg = await ChatService.sendMessage(selectedRoom.id, selectedRoom.request_id, text);

            // Append to messages list immediately
            setMessages(prev => {
                const exists = prev.some(m => m.id === sentMsg.id);
                if (exists) return prev;
                return [...prev, sentMsg];
            });

            // Refresh rooms list to show new message preview in sidebar
            loadRooms();
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    };

    const filteredRooms = rooms.filter(room => {
        if (filter === 'unread') return room.unread_count && room.unread_count > 0;
        return true;
    });


    const sendMedia = async (file: File | Blob, type: MessageType) => {
        if (!selectedRoom) return;

        try {
            const ext = type === 'IMAGE' ? (file as File).name.split('.').pop() : 'webm';
            const fileName = `${selectedRoom.id}/${Date.now()}.${ext}`;
            const publicUrl = await ChatService.uploadMedia(file, fileName);

            const sentMsg = await ChatService.sendMessage(
                selectedRoom.id,
                selectedRoom.request_id,
                '',
                type,
                publicUrl
            );

            setMessages(prev => {
                const exists = prev.some(m => m.id === sentMsg.id);
                if (exists) return prev;
                return [...prev, sentMsg];
            });

            loadRooms();
        } catch (error) {
            console.error("Failed to send media message:", error);
            throw error;
        }
    };

    return {
        rooms: filteredRooms,
        selectedRoom,
        setSelectedRoom: handleSelectRoom,
        messages,
        messageText,
        setMessageText,
        loading,
        filter,
        setFilter,
        sendMessage,
        sendMedia,
        messagesEndRef
    };
}
