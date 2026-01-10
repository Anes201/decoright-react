
import { supabase } from "@/lib/supabase";
import type { Database, Enums } from "@/types/database.types";

type Message = Database['public']['Tables']['messages']['Row'];

export const ChatService = {
    /**
     * Send a message
     */
    async sendMessage({
        requestId,
        content,
        file,
        messageType
    }: {
        requestId: string,
        content?: string,
        file?: File,
        messageType: Enums<'message_type_enum'>
    }) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Not authenticated");

        // 1. Get or Create Chat Room
        let { data: room, error: roomError } = await supabase
            .from('chat_rooms')
            .select('*')
            .eq('request_id', requestId)
            .maybeSingle();

        if (roomError) throw roomError;

        if (!room) {
            const { data: newRoom, error: createError } = await supabase
                .from('chat_rooms')
                .insert({ request_id: requestId, is_active: true })
                .select()
                .single();

            if (createError) throw createError;
            room = newRoom;
        }

        let mediaUrl: string | null = null;

        // 2. Upload file if exists
        if (file) {
            const fileName = `${requestId}/${Date.now()}_${file.name}`;
            const { error: uploadError } = await supabase.storage
                .from('request-attachments')
                .upload(fileName, file);

            if (uploadError) throw uploadError;

            const { data: publicUrlData } = supabase.storage
                .from('request-attachments')
                .getPublicUrl(fileName);

            mediaUrl = publicUrlData.publicUrl;
        }

        // 3. Insert Message
        const { data, error } = await supabase
            .from('messages')
            .insert({
                chat_room_id: room!.id,
                sender_id: user.id,
                content: content || '',
                message_type: messageType,
                media_url: mediaUrl,
                sent_at: new Date().toISOString(),
                is_read: false
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Get messages for a request
     */
    async getMessages(requestId: string) {
        // Step 1: Get room ID
        const { data: room } = await supabase
            .from('chat_rooms')
            .select('id')
            .eq('request_id', requestId)
            .maybeSingle();

        if (!room) return [];

        const { data, error } = await supabase
            .from('messages')
            .select('*, profiles(full_name, role)') // Adjusted to match profiles schema
            .eq('chat_room_id', room.id)
            .order('sent_at', { ascending: true });

        if (error) throw error;
        return data;
    },

    /**
     * Subscribe to new messages
     */
    subscribeToRequestChat(requestId: string, onMessage: (msg: Message) => void) {
        return supabase
            .channel(`request-chat-${requestId}`)
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'messages' },
                (payload) => {
                    onMessage(payload.new as Message);
                }
            )
            .subscribe();
    }
};
