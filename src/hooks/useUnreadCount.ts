import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import useAuth from '@/hooks/useAuth';

/**
 * Returns true when the current user has at least one unread message
 * (i.e. a message sent by someone else that is not yet marked is_read).
 * Stays live via a Realtime INSERT subscription on the messages table.
 */
export function useUnreadCount(): boolean {
    const { user } = useAuth();
    const [hasUnread, setHasUnread] = useState(false);

    useEffect(() => {
        if (!user) {
            setHasUnread(false);
            return;
        }

        // Initial fetch
        const fetchUnread = async () => {
            const { count } = await supabase
                .from('messages')
                .select('id', { count: 'exact', head: true })
                .eq('is_read', false)
                .neq('sender_id', user.id);

            setHasUnread((count ?? 0) > 0);
        };

        fetchUnread();

        // Live subscription — re-check on every new message or read update
        const channel = supabase
            .channel('navbar_unread_watch')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, fetchUnread)
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'messages' }, fetchUnread)
            .subscribe();

        return () => { channel.unsubscribe(); };
    }, [user?.id]);

    return hasUnread;
}
