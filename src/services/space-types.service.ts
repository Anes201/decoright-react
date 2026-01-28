import { supabase } from '@/lib/supabase'
import type { Database } from '@/types/database.types'

export type SpaceType = Database['public']['Tables']['space_types']['Row']
export type SpaceTypeInsert = Database['public']['Tables']['space_types']['Insert']
export type SpaceTypeUpdate = Database['public']['Tables']['space_types']['Update']

export const SpaceTypesService = {
    async getAll() {
        const { data, error } = await supabase
            .from('space_types')
            .select('*')
            .order('name', { ascending: true })

        if (error) throw error
        return data as SpaceType[]
    },

    async getActive() {
        const { data, error } = await supabase
            .from('space_types')
            .select('*')
            .eq('is_active', true)
            .order('name', { ascending: true })

        if (error) throw error
        return data as SpaceType[]
    },

    async getById(id: string) {
        const { data, error } = await supabase
            .from('space_types')
            .select('*')
            .eq('id', id)
            .single()

        if (error) throw error
        return data as SpaceType
    },

    async create(spaceType: SpaceTypeInsert) {
        const { data, error } = await supabase
            .from('space_types')
            .insert(spaceType)
            .select()
            .single()

        if (error) throw error
        return data as SpaceType
    },

    async update(id: string, spaceType: SpaceTypeUpdate) {
        const { data, error } = await supabase
            .from('space_types')
            .update(spaceType)
            .eq('id', id)
            .select()
            .single()

        if (error) throw error
        return data as SpaceType
    },

    async toggleActive(id: string, isActive: boolean) {
        const { data, error } = await supabase
            .from('space_types')
            .update({ is_active: isActive })
            .eq('id', id)
            .select()
            .single()

        if (error) throw error
        return data as SpaceType
    },

    async delete(id: string) {
        const { error } = await supabase
            .from('space_types')
            .delete()
            .eq('id', id)

        if (error) throw error
    }
}
