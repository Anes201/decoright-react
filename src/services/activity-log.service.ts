
import { supabase } from '@/lib/supabase'

export type ActivityEventType = 
    | 'REQUEST_DELETED' 
    | 'ROLE_CHANGED' 
    | 'REQUEST_STATUS_CHANGED' 
    | 'USER_REGISTERED'
    | 'ADMIN_ACTION';

interface LogEventInput {
    event_type: ActivityEventType;
    actor_id?: string;
    target_user_id?: string;
    target_request_id?: string;
    metadata?: Record<string, any>;
}

export const ActivityLogService = {
    async logEvent(input: LogEventInput) {
        try {
            // If actor_id is not provided, try to get current user
            let actorId = input.actor_id;
            if (!actorId) {
                const { data: { user } } = await supabase.auth.getUser();
                actorId = user?.id;
            }

            if (!actorId) return; // Silent fail for logs if no actor

            const { error } = await supabase
                .from('activity_logs')
                .insert({
                    event_type: input.event_type,
                    actor_id: actorId,
                    target_user_id: input.target_user_id,
                    target_request_id: input.target_request_id,
                    metadata: input.metadata || {}
                });

            if (error) console.error('Failed to log activity:', error);
        } catch (err) {
            console.error('Activity log error:', err);
        }
    },

    async getLogs(limit = 100) {
        const { data, error } = await supabase
            .from('activity_logs')
            .select(`
                *,
                actor:actor_id (
                    full_name,
                    role
                ),
                target_user:target_user_id (
                    full_name,
                    role
                )
            `)
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) throw error;
        return data;
    }
}
