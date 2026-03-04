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
    },

    async uploadLogo(file: File): Promise<string> {
        const ext = file.name.split('.').pop()
        const path = `logo/logo.${ext}`

        // Upsert: overwrite any existing logo file
        const { error: uploadError } = await supabase.storage
            .from('site-assets')
            .upload(path, file, { upsert: true, contentType: file.type })

        if (uploadError) throw uploadError

        const { data: urlData } = supabase.storage
            .from('site-assets')
            .getPublicUrl(path)

        const publicUrl = urlData.publicUrl

        // Persist the URL in site_settings so all clients pick it up
        await SiteSettingsService.update('logo_url', publicUrl)

        return publicUrl
    }
}
