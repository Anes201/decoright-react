import { useState, useEffect } from 'react';
import { SiteSettingsService } from '@/services/site-settings.service';
import {
    companyNameTitle,
    supportMailAddress,
    phoneNumber,
    googleMapLocationUrl
} from '@/constants/company';

export function useSiteSettings() {
    const [settings, setSettings] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const data = await SiteSettingsService.getAll();
                setSettings(data);
            } catch (error) {
                console.error('Failed to load site settings:', error);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    const getSetting = (key: string, defaultValue: string = '') => {
        return settings[key] || defaultValue;
    };

    return {
        settings,
        loading,
        getSetting,
        // Helper getters with defaults from constants
        companyName: getSetting('company_name', companyNameTitle),
        primaryEmail: getSetting('primary_email', supportMailAddress),
        primaryPhone: getSetting('primary_phone', phoneNumber),
        googleMapsUrl: getSetting('google_maps_url', googleMapLocationUrl),
        whatsapp: getSetting('whatsapp', settings['whatsapp'] || ''),
        facebook: getSetting('facebook', ''),
        instagram: getSetting('instagram', ''),
        tiktok: getSetting('tiktok', ''),
        youtube: getSetting('youtube', ''),
    };
}
