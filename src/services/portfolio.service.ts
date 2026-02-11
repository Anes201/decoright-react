import { supabase } from '@/lib/supabase'
import type { Database } from '@/types/database.types'

type GalleryItem = Database['public']['Tables']['gallery_items']['Row']

export const PortfolioService = {
    async getProjects() {
        // Map to internal gallery_items table
        const { data, error } = await supabase
            .from('gallery_items')
            .select('*')
            .eq('visibility', 'PUBLIC') // Publicly visible items
            .order('created_at', { ascending: false })

        if (error) throw error
        return data as GalleryItem[]
    },

    async getProjectDetails(id: string) {
        const { data, error } = await supabase
            .from('gallery_items')
            .select('*')
            .eq('id', id)
            .single()

        if (error) throw error
        return data as GalleryItem
    }
}
