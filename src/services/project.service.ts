// src/services/project.service.ts
import { supabase } from '@/lib/supabase'

export const ProjectService = {
    /**
     * Increment view_count for a project by 1.
     * Fire-and-forget: errors are logged but not thrown.
     */
    async incrementViewCount(projectId: string): Promise<void> {
        const { error } = await supabase.rpc('increment_project_view_count', {
            project_id: projectId,
        })
        if (error) {
            console.warn('Failed to increment view count:', error.message)
        }
    },

    /**
     * Get total like count for a project.
     */
    async getLikesCount(projectId: string): Promise<number> {
        const { count, error } = await supabase
            .from('likes')
            .select('*', { count: 'exact', head: true })
            .eq('project_id', projectId)

        if (error) throw error
        return count ?? 0
    },

    /**
     * Check if the current authenticated user has liked a project.
     * Returns false if not authenticated.
     */
    async hasUserLiked(projectId: string, userId: string): Promise<boolean> {
        const { data, error } = await supabase
            .from('likes')
            .select('user_id')
            .eq('project_id', projectId)
            .eq('user_id', userId)
            .maybeSingle()

        if (error) throw error
        return data !== null
    },

    /**
     * Toggle like for the current user on a project.
     * Returns the new liked state (true = now liked, false = unliked).
     */
    async toggleLike(projectId: string, userId: string): Promise<boolean> {
        const alreadyLiked = await ProjectService.hasUserLiked(projectId, userId)

        if (alreadyLiked) {
            const { error } = await supabase
                .from('likes')
                .delete()
                .eq('project_id', projectId)
                .eq('user_id', userId)
            if (error) throw error
            return false
        } else {
            const { error } = await supabase
                .from('likes')
                .insert({ project_id: projectId, user_id: userId })
            if (error) throw error
            return true
        }
    },
}
