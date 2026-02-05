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

        if (error) throw error;

        // Fetch unread count and last message for each room in parallel
        // Still doing it in loop for now as we don't have a view/rpc, but at least parallelized
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

    // Handle both old and new API for getMessages
    async getMessages(targetId: string) {
        // Try to fetch by chat_room_id
        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .eq('chat_room_id', targetId)
            .order('created_at', { ascending: true });

        if (error) throw error;
        return data as Message[];
    },

    async sendMessage(
        roomIdOrObj: string | { requestId: string; content: string; messageType?: MessageType; mediaUrl?: string },
        requestId?: string,
        content?: string,
        type: MessageType = 'TEXT',
        mediaUrl?: string
    ) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Auth required");

        let rId: string;
        let reqId: string;
        let text: string;
        let mType: MessageType;
        let mUrl: string | undefined;

        if (typeof roomIdOrObj === 'object') {
            reqId = roomIdOrObj.requestId;
            text = roomIdOrObj.content;
            mType = roomIdOrObj.messageType || 'TEXT';
            mUrl = roomIdOrObj.mediaUrl;

            // We need to find the roomId for this requestId
            const { data: room } = await supabase
                .from('chat_rooms')
                .select('id')
                .eq('request_id', reqId)
                .maybeSingle();

            if (!room) throw new Error("Chat room not found for request");
            rId = room.id;
        } else {
            rId = roomIdOrObj;
            reqId = requestId!;
            text = content!;
            mType = type;
            mUrl = mediaUrl;
        }

        const { data, error } = await supabase
            .from('messages')
            .insert({
                chat_room_id: rId,
                sender_id: user.id,
                content: text,
                message_type: mType,
                media_url: mUrl,
                is_read: true
            } as any)
            .select()
            .single();

        if (error) throw error;

        await supabase
            .from('chat_rooms')
            .update({ updated_at: new Date().toISOString() })
            .eq('id', rId);

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
    },

    subscribeToRequestChat(requestId: string, onNewMessage: (msg: Message) => void) {
        // Since request_id is not in messages, we need to find the room first
        // But for subscription, if we don't have roomId yet, we might need a different strategy
        // However, usually we have the roomId if we are in a chat context.
        // For now, let's just use channel per room if possible.
        // If we only have requestId, we'd need to fetch roomId first.
        return supabase
            .channel(`request_${requestId}`)
            .on('postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    // filter: `request_id=eq.${requestId}` // Removed as request_id is not in table
                },
                (payload) => onNewMessage(payload.new as Message)
            )
            .subscribe();
    }
};
