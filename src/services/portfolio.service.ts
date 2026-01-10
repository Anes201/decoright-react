
import { supabase } from '@/lib/supabase'
import type { Database } from '@/types/database.types'

type PortfolioItem = Database['public']['Tables']['portfolio_items']['Row']

export const PortfolioService = {
    async getProjects() {
        // Map to internal portfolio_items table
        const { data, error } = await supabase
            .from('portfolio_items')
            .select('*')
            .eq('is_public_guest', true) // Default visibility filter
            .order('created_at', { ascending: false })

        if (error) throw error
        return data as PortfolioItem[]
    },

    async getProjectDetails(id: string) {
        const { data, error } = await supabase
            .from('portfolio_items')
            .select('*')
            .eq('id', id)
            .single()

        if (error) throw error
        return data as PortfolioItem
    }
}
