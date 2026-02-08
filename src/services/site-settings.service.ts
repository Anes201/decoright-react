import { supabase } from '@/lib/supabase'

export interface SiteSetting {
    id: string
    key: string
    value: string
    description: string | null
    updated_at: string | null
}

export const SiteSettingsService = {
    async getAll() {
        const { data, error } = await supabase
            .from('site_settings')
            .select('*')

        if (error) throw error

        const settings: Record<string, string> = {}
        data.forEach(s => {
            if (s.key && s.value !== null) settings[s.key] = s.value
        })
        return settings
    },

    async update(key: string, value: string) {
        const { data, error } = await supabase
            .from('site_settings')
            .upsert({ key, value }, { onConflict: 'key' })
            .select()
            .single()

        if (error) throw error
        return data
    }
}
