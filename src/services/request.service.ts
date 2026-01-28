
import { supabase } from '@/lib/supabase'
import type { Database, Enums } from '@/types/database.types'

type ServiceRequest = Database['public']['Tables']['service_requests']['Row']
type CreateRequestInput = Database['public']['Tables']['service_requests']['Insert']

export const RequestService = {
    async createRequest(input: Omit<CreateRequestInput, 'user_id' | 'status' | 'request_code'>) {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error("Authentication required")

        // Generate a simple request code if not provided
        const requestCode = `REQ-${Math.floor(1000 + Math.random() * 9000)}`

        const { data, error } = await supabase
            .from('service_requests')
            .insert({
                ...input,
                user_id: user.id,
                status: 'Submitted',
                request_code: requestCode
            })
            .select()
            .single()

        if (error) throw error
        return data
    },

    async getMyRequests() {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error("Authentication required")

        const { data, error } = await supabase
            .from('service_requests')
            .select(`
                *,
                service_types (
                    name,
                    display_name_en,
                    display_name_ar
                ),
                space_types (
                    name,
                    display_name_en,
                    display_name_ar
                )
            `)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })

        if (error) throw error
        return data as any[]
    },

    async getRequestById(id: string) {
        const { data, error } = await supabase
            .from('service_requests')
            .select(`
                *,
                service_types (
                    name,
                    display_name_en,
                    display_name_ar
                ),
                space_types (
                    name,
                    display_name_en,
                    display_name_ar
                ),
                profiles (
                    full_name,
                    role
                )
            `)
            .eq('id', id)
            .single()

        if (error) throw error
        return data
    },

    async updateStatus(id: string, status: Enums<'request_status'>) {
        const { data, error } = await supabase
            .from('service_requests')
            .update({ status })
            .eq('id', id)
            .select()
            .single()

        if (error) throw error
        return data
    },

    async uploadAttachment(file: File) {
        const fileExt = file.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const filePath = `attachments/${fileName}`

        const { error: uploadError } = await supabase.storage
            .from('request-attachments')
            .upload(filePath, file)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
            .from('request-attachments')
            .getPublicUrl(filePath)

        return publicUrl
    },

    async addRequestAttachments(requestId: string, attachments: { name: string, url: string, size: number, type: string }[]) {
        const rows = attachments.map(att => {
            let fileType: Database["public"]["Enums"]["file_type_enum"] = 'DOCUMENT';
            if (att.type.startsWith('image/')) fileType = 'IMAGE';
            else if (att.type === 'application/pdf') fileType = 'PDF';

            return {
                request_id: requestId,
                file_name: att.name,
                file_url: att.url,
                file_type: fileType
            };
        })

        const { error } = await supabase
            .from('request_attachments')
            .insert(rows)

        if (error) throw error
    }
}
