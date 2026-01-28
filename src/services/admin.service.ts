import { supabase } from '@/lib/supabase'
import type { Database } from '@/types/database.types'

export type UserProfile = Database['public']['Tables']['profiles']['Row']
export type ServiceRequest = Database['public']['Tables']['service_requests']['Row']
export type AdminActivity = Database['public']['Tables']['admin_activities']['Row']

export const AdminService = {
    async getMorningCoffeeStats() {
        // Active Requests: Submitted, Under Review, Waiting for Client Info, Approved, In Progress
        const { count: activeRequests } = await supabase
            .from('service_requests')
            .select('*', { count: 'exact', head: true })
            .in('status', ['Submitted', 'Under Review', 'Waiting for Client Info', 'Approved', 'In Progress']);

        // Pending Review: Specifically 'Submitted'
        const { count: pendingReview } = await supabase
            .from('service_requests')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'Submitted');

        // Unread Messages
        const { count: msgCount, error: msgError } = await supabase
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .eq('is_read', false);

        if (msgError) {
            console.error("Error fetching unread messages:", msgError);
        }

        return {
            activeRequests: activeRequests || 0,
            pendingReview: pendingReview || 0,
            unreadMessages: msgCount || 0,
        }
    },

    async getDashboardStats() {
        const { count: totalRequests } = await supabase
            .from('service_requests')
            .select('*', { count: 'exact', head: true })

        const { count: completedRequests } = await supabase
            .from('service_requests')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'Completed')

        const { count: totalUsers } = await supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true })
            .eq('role', 'customer')

        const completionRate = totalRequests && totalRequests > 0
            ? Math.round(((completedRequests || 0) / totalRequests) * 100)
            : 0

        return {
            totalRequests: totalRequests || 0,
            completedRequests: completedRequests || 0,
            completionRate: `${completionRate}%`,
            totalUsers: totalUsers || 0,
        }
    },

    async getRequestsByMonth() {
        // Since we can't do complex grouping in Supabase client easily without RPC,
        // we'll fetch the last 12 months of requests and group them in JS for current scale.
        const { data, error } = await supabase
            .from('service_requests')
            .select('created_at, status')
            .order('created_at', { ascending: true })

        if (error) throw error

        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        const currentYear = new Date().getFullYear()

        const chartData = months.map((month, index) => {
            const monthRequests = data.filter(req => {
                const date = new Date(req.created_at!)
                return date.getMonth() === index && date.getFullYear() === currentYear
            })

            return {
                date: `${month} ${currentYear.toString().slice(-2)}`,
                Requests: monthRequests.length,
                Complete: monthRequests.filter(req => req.status === 'Completed').length
            }
        })

        return chartData
    },

    async getTopServices() {
        const { data, error } = await supabase
            .from('service_requests')
            .select('service_type')

        if (error) throw error

        const counts: Record<string, number> = {}
        data.forEach(req => {
            counts[req.service_type] = (counts[req.service_type] || 0) + 1
        })

        return Object.entries(counts)
            .map(([service_type, value]) => ({ service_type, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 5)
    },

    async getUsersActivity() {
        const { data, error } = await supabase
            .from('admin_activities')
            .select(`
                *,
                profiles:admin_id (
                    full_name,
                    role
                )
            `)
            .order('created_at', { ascending: false })
            .limit(10)

        if (error) throw error
        return data
    },

    async getAllUsers() {
        // Fetch profiles with request counts
        // Note: We use chat_rooms as reference for joins usually, but here we join service_requests directly
        const { data, error } = await supabase
            .from('profiles')
            .select(`
                *,
                service_requests (count)
            `)
            .order('created_at', { ascending: false })

        if (error) throw error

        // Map the count to a top level property for easier consumption if needed,
        // or just return as is matching the expanded type.
        // We'll trust the component to handle the nested { count } object or map it here.
        // Let's map it to keep the UI clean.
        return data.map((user: any) => ({
            ...user,
            total_requests: user.service_requests?.[0]?.count || 0
        })) as (UserProfile & { total_requests: number })[]
    },

    async updateUserProfile(id: string, updates: Partial<UserProfile>) {
        const { data, error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', id)
            .select()
            .single()

        if (error) throw error
        return data
    },

    async getRequestsByUser(userId: string) {
        const { data, error } = await supabase
            .from('service_requests')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })

        if (error) throw error
        return data as ServiceRequest[]
    },

    async getAllServiceRequests() {
        const { data, error } = await supabase
            .from('service_requests')
            .select(`
                *,
                profiles:user_id (
                    full_name,
                    phone
                ),
                chat_room:chat_rooms (
                    id
                )
            `)
            .order('created_at', { ascending: false })

        if (error) throw error
        return data
    },

    async updateRequestStatus(id: string, status: string) {
        const { data, error } = await supabase
            .from('service_requests')
            .update({ status })
            .eq('id', id)
            .select()
            .single()

        if (error) throw error
        return data
    },

    async getSettings() {
        const { data, error } = await supabase
            .from('site_settings')
            .select('*')

        if (error) throw error

        const settings: Record<string, string> = {}
        data.forEach(s => {
            if (s.key && s.value) settings[s.key] = s.value
        })
        return settings
    },

    async updateSetting(key: string, value: string) {
        const { data, error } = await supabase
            .from('site_settings')
            .upsert({ key, value }, { onConflict: 'key' })
            .select()
            .single()

        if (error) throw error
        return data
    },

    async createProject(project: Database['public']['Tables']['projects']['Insert']) {
        const { data, error } = await supabase
            .from('projects')
            .insert(project)
            .select()
            .single()

        if (error) throw error
        return data
    },

    async uploadProjectImage(file: File) {
        const fileExt = file.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const filePath = `project-images/${fileName}`

        const { error: uploadError } = await supabase.storage
            .from('projects')
            .upload(filePath, file)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
            .from('projects')
            .getPublicUrl(filePath)

        return publicUrl
    }
}
