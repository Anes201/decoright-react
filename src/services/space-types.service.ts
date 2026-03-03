import { supabase } from '@/lib/supabase'
import type { Database } from '@/types/database.types'
import { compressImage } from '@/utils/image.utils'

export type SpaceType = Database['public']['Tables']['space_types']['Row']
export type SpaceTypeInsert = Database['public']['Tables']['space_types']['Insert']
export type SpaceTypeUpdate = Database['public']['Tables']['space_types']['Update']
export type SpaceTypeImage = Database['public']['Tables']['space_type_images']['Row']

export type SpaceTypeWithImages = SpaceType & {
    space_type_images: SpaceTypeImage[]
}

export const SpaceTypesService = {
    async getAll() {
        const { data, error } = await supabase
            .from('space_types')
            .select('*, space_type_images(id, image_url, sort_order, uploaded_at)')
            .order('name', { ascending: true })

        if (error) throw error
        return (data ?? []) as SpaceTypeWithImages[]
    },

    async getActive() {
        const { data, error } = await supabase
            .from('space_types')
            .select('*, space_type_images(id, image_url, sort_order, uploaded_at)')
            .eq('is_active', true)
            .order('name', { ascending: true })

        if (error) throw error
        return (data ?? []) as SpaceTypeWithImages[]
    },

    async getById(id: string) {
        const { data, error } = await supabase
            .from('space_types')
            .select('*, space_type_images(id, image_url, sort_order, uploaded_at)')
            .eq('id', id)
            .single()

        if (error) throw error
        return data as SpaceTypeWithImages
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
    },

    async uploadImage(file: File): Promise<string> {
        const compressedBlob = await compressImage(file, 0.7)
        const compressedFile = new File([compressedBlob], file.name, { type: 'image/jpeg' })
        const filePath = `space-type-images/${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`

        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('projects')
            .upload(filePath, compressedFile)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
            .from('projects')
            .getPublicUrl(uploadData.path)

        return publicUrl
    },

    async setImages(spaceTypeId: string, imageUrls: string[]): Promise<void> {
        // Delete all existing images for this space type
        const { error: deleteError } = await supabase
            .from('space_type_images')
            .delete()
            .eq('space_type_id', spaceTypeId)

        if (deleteError) throw deleteError

        if (imageUrls.length === 0) return

        const rows = imageUrls.map((url, index) => ({
            space_type_id: spaceTypeId,
            image_url: url,
            sort_order: index,
        }))

        const { error: insertError } = await supabase
            .from('space_type_images')
            .insert(rows)

        if (insertError) throw insertError
    },
}

