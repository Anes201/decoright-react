import { supabase } from '@/lib/supabase'
import type { Database } from '@/types/database.types'
import { compressImage } from '@/utils/image.utils'

export type UserProfile = Database['public']['Tables']['profiles']['Row'] & { email?: string }
export type ServiceRequest = Database['public']['Tables']['service_requests']['Row']
export type AdminActivity = Database['public']['Tables']['admin_activities']['Row']
export type GalleryItem = Database['public']['Tables']['gallery_items']['Row']
export type GalleryItemInsert = Database['public']['Tables']['gallery_items']['Insert']
export type GalleryItemUpdate = Database['public']['Tables']['gallery_items']['Update']
export type FAQ = any // Database['public']['Tables']['faqs']['Row']
export type FAQInsert = any // Database['public']['Tables']['faqs']['Insert']
export type FAQUpdate = any // Database['public']['Tables']['faqs']['Update']

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

    async getDashboardStats(timeframe: '30d' | '90d' | 'lifetime' = '30d') {
        let query = supabase.from('service_requests').select('*', { count: 'exact', head: true });
        let userQuery = supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'customer');

        if (timeframe !== 'lifetime') {
            const days = timeframe === '30d' ? 30 : 90;
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - days);
            query = query.gte('created_at', startDate.toISOString());
            userQuery = userQuery.gte('created_at', startDate.toISOString());
        }

        const { count: totalRequests } = await query;

        const completedQuery = timeframe !== 'lifetime'
            ? query.eq('status', 'Completed')
            : supabase.from('service_requests').select('*', { count: 'exact', head: true }).eq('status', 'Completed');

        const { count: completedRequests } = await completedQuery;
        const { count: totalUsers } = await userQuery;

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

    async getRequestsByMonth(timeframe: '30d' | '90d' | 'lifetime' = '30d') {
        let query = supabase
            .from('service_requests')
            .select('created_at, status')
            .order('created_at', { ascending: true })

        if (timeframe !== 'lifetime') {
            const days = timeframe === '30d' ? 30 : 90;
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - days);
            query = query.gte('created_at', startDate.toISOString());
        }

        const { data, error } = await query;

        if (error) throw error

        if (timeframe === '30d' || timeframe === '90d') {
            const daysCount = timeframe === '30d' ? 30 : 90;
            const days = Array.from({ length: daysCount }, (_, i) => {
                const d = new Date();
                d.setDate(d.getDate() - (daysCount - 1 - i));
                return d.toISOString().split('T')[0];
            });

            return days.map(day => {
                const dayDate = new Date(day);
                const dayRequests = (data || []).filter(req => req.created_at?.startsWith(day));
                return {
                    date: dayDate.toLocaleDateString('en-US', { day: '2-digit', month: 'short' }),
                    Requests: dayRequests.length,
                    Complete: dayRequests.filter(req => req.status === 'Completed').length
                };
            });
        }

        // Lifetime: Group by month across all years
        const monthsMap = new Map();
        (data || []).forEach(req => {
            const d = new Date(req.created_at!);
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            if (!monthsMap.has(key)) {
                monthsMap.set(key, { Requests: 0, Complete: 0 });
            }
            const stats = monthsMap.get(key);
            stats.Requests++;
            if (req.status === 'Completed') stats.Complete++;
        });

        const sortedKeys = Array.from(monthsMap.keys()).sort();
        return sortedKeys.map(key => {
            const [year, month] = key.split('-');
            const d = new Date(parseInt(year), parseInt(month) - 1);
            return {
                date: d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
                Requests: monthsMap.get(key).Requests,
                Complete: monthsMap.get(key).Complete
            };
        });
    },

    async getTopServices(timeframe: '30d' | '90d' | 'lifetime' = '30d') {
        let query = supabase
            .from('service_requests')
            .select('service_type_id, created_at, service_types(name, display_name_en)')

        if (timeframe !== 'lifetime') {
            const days = timeframe === '30d' ? 30 : 90;
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - days);
            query = query.gte('created_at', startDate.toISOString());
        }

        const { data, error } = await query

        if (error) throw error

        const counts: Record<string, { name: string, count: number }> = {}
        data.forEach((req: any) => {
            const serviceTypeName = req.service_types?.display_name_en || 'Unknown'
            if (!counts[serviceTypeName]) {
                counts[serviceTypeName] = { name: serviceTypeName, count: 0 }
            }
            counts[serviceTypeName].count++
        })

        return Object.values(counts)
            .map(({ name, count }) => ({ service_type: name, value: count }))
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
            .select(`
                *,
                service_types (
                    name,
                    display_name_en
                ),
                space_types (
                    name,
                    display_name_en
                )
            `)
            .eq('user_id', userId)
            .order('created_at', { ascending: false })

        if (error) throw error
        return data || []
    },

    async getAllServiceRequests() {
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

    async updateRequestStatus(id: string, status: Database['public']['Enums']['request_status']) {
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

    async getProjects(options?: { visibility?: Database['public']['Enums']['project_visibility'][], limit?: number, slug?: string }) {
        let query = supabase
            .from('projects')
            .select(`
                *,
                service_types(display_name_en, display_name_ar, display_name_fr),
                space_types(display_name_en, display_name_ar, display_name_fr),
                project_images(*)
            `)
            .order('created_at', { ascending: false })

        if (options?.visibility) {
            query = query.in('visibility', options.visibility)
        }

        if (options?.slug) {
            query = query.eq('slug', options.slug)
        }

        if (options?.limit) {
            query = query.limit(options.limit)
        }

        const { data, error } = await query

        if (error) throw error
        return data
    },

    async createProject(project: Database['public']['Tables']['projects']['Insert']) {
        const payload = {
            ...project,
            visibility: project.visibility?.toUpperCase() as any,
            slug: project.slug || project.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
        }

        const { data, error } = await supabase
            .from('projects')
            .insert(payload)
            .select()
            .single()

        if (error) throw error
        return data
    },

    async updateProject(id: string, updates: Partial<Database['public']['Tables']['projects']['Update']>) {
        const { data, error } = await supabase
            .from('projects')
            .update(updates)
            .eq('id', id)
            .select()
            .single()

        if (error) throw error
        return data
    },

    async deleteProject(id: string) {
        const { error } = await supabase
            .from('projects')
            .delete()
            .eq('id', id)

        if (error) throw error
    },

    async addProjectImages(projectId: string, imageUrls: string[], overwrite: boolean = false) {
        if (overwrite) {
            const { error: deleteError } = await supabase
                .from('project_images')
                .delete()
                .eq('project_id', projectId)

            if (deleteError) throw deleteError
        }

        const images = imageUrls.map((url, index) => ({
            project_id: projectId,
            image_url: url,
            is_cover: index === 0,
            sort_order: index
        }))

        const { error } = await supabase
            .from('project_images')
            .insert(images)

        if (error) throw error
    },

    async uploadProjectImage(file: File) {
        const compressedBlob = await compressImage(file, 0.7)
        const compressedFile = new File([compressedBlob], file.name, { type: 'image/jpeg' })

        const fileExt = 'jpg'
        const fileName = `${Math.random()}.${fileExt}`
        const filePath = `project-images/${fileName}`

        const { error: uploadError } = await supabase.storage
            .from('projects')
            .upload(filePath, compressedFile)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
            .from('projects')
            .getPublicUrl(filePath)

        return publicUrl
    },

    // Gallery Methods
    async getGalleryItems(options?: { visibility?: Database['public']['Enums']['project_visibility'][], limit?: number }) {
        let query = supabase
            .from('gallery_items')
            .select('*')
            .order('created_at', { ascending: false })

        if (options?.visibility) {
            query = query.in('visibility', options.visibility)
        }

        if (options?.limit) {
            query = query.limit(options.limit)
        }

        const { data, error } = await query
        if (error) throw error
        return data as GalleryItem[]
    },

    async getGalleryItem(id: string) {
        const { data, error } = await supabase
            .from('gallery_items')
            .select('*')
            .eq('id', id)
            .single()

        if (error) throw error
        return data as GalleryItem
    },

    async createGalleryItem(item: GalleryItemInsert) {
        const payload = {
            ...item,
            visibility: item.visibility?.toUpperCase() as any
        }
        const { data, error } = await supabase
            .from('gallery_items')
            .insert(payload)
            .select()
            .single()

        if (error) throw error
        return data as GalleryItem
    },

    async updateGalleryItem(id: string, updates: GalleryItemUpdate) {
        const payload = {
            ...updates,
            visibility: updates.visibility?.toUpperCase() as any
        }
        const { data, error } = await supabase
            .from('gallery_items')
            .update(payload)
            .eq('id', id)
            .select()
            .single()

        if (error) throw error
        return data as GalleryItem
    },

    async deleteGalleryItem(id: string) {
        const { error } = await supabase
            .from('gallery_items')
            .delete()
            .eq('id', id)

        if (error) throw error
    },

    async deleteServiceRequest(id: string) {
        const { error } = await supabase
            .from('service_requests')
            .delete()
            .eq('id', id)

        if (error) throw error
    },

    // FAQ Methods
    async getFAQs(options?: { is_active?: boolean }) {
        let query = supabase
            .from('faqs')
            .select('*')
            .order('display_order', { ascending: true })

        if (options?.is_active !== undefined) {
            query = query.eq('is_active', options.is_active)
        }

        const { data, error } = await query
        if (error) throw error
        return data as FAQ[]
    },

    async createFAQ(faq: FAQInsert) {
        const { data, error } = await supabase
            .from('faqs')
            .insert(faq)
            .select()
            .single()

        if (error) throw error
        return data as FAQ
    },

    async updateFAQ(id: string, updates: FAQUpdate) {
        const { data, error } = await supabase
            .from('faqs')
            .update(updates)
            .eq('id', id)
            .select()
            .single()

        if (error) throw error
        return data as FAQ
    },

    async deleteFAQ(id: string) {
        const { error } = await supabase
            .from('faqs')
            .delete()
            .eq('id', id)

        if (error) throw error
    }
}
