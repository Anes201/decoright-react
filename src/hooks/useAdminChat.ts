import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChatService } from '@/services/chat.service';
import type { ChatRoom, Message, MessageType } from '@/types/chat';
import { supabase } from '@/lib/supabase';

export function useAdminChat() {
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
            const data = await ChatService.getChatRooms();
            setRooms(data);
        } catch (error) {
            console.error("Failed to load rooms:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadRooms().then(() => {
            // Subscription handled inside loadRooms or by its own effect
        });
        const sub = ChatService.subscribeToRooms(loadRooms);
        return () => { sub.unsubscribe(); };
    }, [loadRooms]);

    // Handle deep linking when rooms are loaded
    useEffect(() => {
        if (roomIdParam && rooms.length > 0 && !selectedRoom) {
            const room = rooms.find(r => r.id === roomIdParam);
            if (room) setSelectedRoom(room);
        }
    }, [roomIdParam, rooms, selectedRoom]);

    const handleSelectRoom = (room: ChatRoom | null) => {
        setSelectedRoom(room);
        // Clear the URL parameter when manual selection happens to avoid stickiness
        if (roomIdParam) {
            setSearchParams(params => {
                params.delete('room');
                return params;
            });
        }
    };

    useEffect(() => {
        if (!selectedRoom) {
            setMessages([]);
            return;
        }

        // Clear messages immediately when room changes for seamless feel
        setMessages([]);

        const loadMessages = async () => {
            try {
                const data = await ChatService.getRoomMessages(selectedRoom.id);
                setMessages(data);
                await ChatService.markAsRead(selectedRoom.id);
                loadRooms(); // Refresh unread counts
            } catch (error) {
                console.error("Failed to load messages:", error);
            }
        };

        loadMessages();

        const sub = ChatService.subscribeToMessages(selectedRoom.id, (newMsg) => {
            setMessages(prev => {
                const exists = prev.some(m => m.id === newMsg.id);
                if (exists) return prev;
                return [...prev, newMsg];
            });

            // If message is from client, mark as read
            const clientId = selectedRoom.service_requests.profiles.id;
            if (newMsg.sender_id === clientId) {
                ChatService.markAsRead(selectedRoom.id);
                loadRooms();
            }
        });

        return () => { sub.unsubscribe(); };
    }, [selectedRoom, loadRooms]);


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
