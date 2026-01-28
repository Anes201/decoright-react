import { supabase } from '@/lib/supabase';
import type { ChatRoom, Message, MessageType } from '@/types/chat';

export const ChatService = {
    async getChatRooms() {
        const { data, error } = await supabase
            .from('chat_rooms')
            .select(`
                *,
                service_requests (
                    id,
                    request_code,
                    service_type,
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
    },

    async getRoomMessages(roomId: string) {
        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .eq('chat_room_id', roomId)
            .order('created_at', { ascending: true });

        if (error) throw error;
        return data as Message[];
    },

    async sendMessage(roomId: string, requestId: string, content: string, type: MessageType = 'TEXT', mediaUrl?: string) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Auth required");

        const { data, error } = await supabase
            .from('messages')
            .insert({
                request_id: requestId,
                chat_room_id: roomId,
                sender_id: user.id,
                content: content,
                message_type: type,
                media_url: mediaUrl,
                is_read: true // Admin's own messages are "read"
            })
            .select()
            .single();

        if (error) throw error;

        // Update chat room's updated_at
        await supabase
            .from('chat_rooms')
            .update({ updated_at: new Date().toISOString() })
            .eq('id', roomId);

        return data as Message;
    },

    async markAsRead(roomId: string) {
        const { error } = await supabase
            .from('messages')
            .update({ is_read: true })
            .eq('chat_room_id', roomId)
            .eq('is_read', false);

        if (error) throw error;
    },

    async uploadMedia(file: File | Blob, path: string) {
        const { data, error } = await supabase.storage
            .from('request-attachments')
            .upload(path, file);

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
            .from('request-attachments')
            .getPublicUrl(data.path);

        return publicUrl;
    },

    subscribeToRooms(onUpdate: () => void) {
        return supabase
            .channel('chat_rooms_changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'chat_rooms' }, onUpdate)
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, onUpdate)
            .subscribe();
    },

    subscribeToMessages(roomId: string, onNewMessage: (msg: Message) => void) {
        return supabase
            .channel(`room_${roomId}`)
            .on('postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    filter: `chat_room_id=eq.${roomId}`
                },
                (payload) => onNewMessage(payload.new as Message)
            )
            .subscribe();
    }
};
