
import type { ChatRoom, Message, MessageType } from '@/types/chat';
import { useState, useEffect, useCallback } from 'react';
import { ChatService } from '@/services/chat.service';
import { supabase } from '@/lib/supabase';
import useAuth from './useAuth';
import { useParams } from 'react-router-dom';

export function useChat() {

    const { user } = useAuth();
    const { id: roomIdFromUrl } = useParams<{ id: string }>();

    const [rooms, setRooms] = useState<ChatRoom[]>([]);
    const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [messageText, setMessageText] = useState('');
    const [filter, setFilter] = useState<'all' | 'unread'>('all');

    const [loadingRooms, setLoadingRooms] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(false);

    // Changes made here
    async function getChatRooms() {
        if (!user) return;
        const { data, error } = await supabase
            .from('chat_rooms')
            .select(`
                *,
                service_requests (
                    id,
                    request_code,
                    service_type_id,
                    status,
                    profiles:user_id (
                        id,
                        full_name
                    )
                )
            `)
            .eq('is_active', true)
            .order('updated_at', { ascending: false });

        if (error) throw error;

        // Fetch unread count and last message for each room
        const roomsWithMeta = await Promise.all((data as any[]).map(async (room) => {
            const { data: lastMsg } = await supabase
                .from('messages')
                .select('*')
                .eq('chat_room_id', room.id)
                .order('created_at', { ascending: false })
                .limit(1)
                .maybeSingle();

            const { count } = await supabase
                .from('messages')
                .select('*', { count: 'exact', head: true })
                .eq('chat_room_id', room.id)
                .eq('is_read', false);

            return {
                ...room,
                last_message: lastMsg,
                unread_count: count || 0
            };
        }));

        return roomsWithMeta as ChatRoom[];
    }

    const loadRooms = useCallback(async () => {
        try {
            const data = await getChatRooms();
            setRooms(data ?? []);
        } catch (error) {
            console.error("Failed to load rooms:", error);
        } finally {
            setLoadingRooms(false);
        }
    }, []);

    useEffect(() => {
        loadRooms().then(() => {
            // Subscription handled inside loadRooms or by its own effect
        });
        const sub = ChatService.subscribeToRooms(loadRooms);
        return () => { sub.unsubscribe(); };
    }, [loadRooms]);

    // Fetch all requests for the current user
    useEffect(() => {
        const fetchRequests = async () => {
        try {
            // const data = await RequestService.getMyRequests();
            // setRequests(data);

            // If there's an ID in the URL, set it as selected

            if (roomIdFromUrl) {
            const room = rooms.find(r => r.id === roomIdFromUrl);
            // const found = data.find(r => r.id === requestIdFromUrl);
            if (room) setSelectedRoom(room);
            }
        } catch (err) {
            console.error("Error fetching requests:", err);
        } finally {
            // setRequestsLoading(false);
        }
        };

        if (user) {
            fetchRequests();
        }
    }, [user, roomIdFromUrl]);

    useEffect(() => {
        if (!selectedRoom) {
            setMessages([]);
            return;
        }

        // Clear messages immediately when room changes for seamless feel
        setMessages([]);

        const loadMessages = async () => {

            setLoadingMessages(true)
            try {
                const data = await ChatService.getRoomMessages(selectedRoom.id);
                setMessages(data);
                await ChatService.markAsRead(selectedRoom.id);
                loadRooms(); // Refresh unread counts
            } catch (error) {
                console.error("Failed to load messages:", error);
            } finally {
                setLoadingMessages(false)
            }
        };

        loadMessages();

        const sub = ChatService.subscribeToMessages(selectedRoom.id, (newMsg) => {
            setMessages(prev => {
                const exists = prev.some(m => m.id === newMsg.id);
                if (exists) return prev;
                return [...prev, newMsg];
            });

            console.log(newMsg.content, 'NEW MESSAGE')

            // If message is from client, mark as read
            const clientId = selectedRoom.service_requests.profiles.id;
            if (newMsg.sender_id === clientId) {
                ChatService.markAsRead(selectedRoom.id);
                loadRooms();
            }
        });

        return () => { sub.unsubscribe(); };
    }, [selectedRoom, loadRooms]);

    // Clear text input on select chatroom
    useEffect(()=> {
        if(!roomIdFromUrl) return;
        setMessageText('');
    }, [roomIdFromUrl])


    const sendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault();
        console.log(selectedRoom)
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
        setSelectedRoom,
        messages,
        messageText,
        setMessageText,
        loadRooms,
        loadingRooms,
        loadingMessages,
        filter,
        setFilter,
        sendMessage,
        sendMedia,
        roomIdFromUrl,
    };
}