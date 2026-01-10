
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
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })

        if (error) throw error
        return data as ServiceRequest[]
    },

    async getRequestById(id: string) {
        const { data, error } = await supabase
            .from('service_requests')
            .select(`
                *,
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
    }
}
