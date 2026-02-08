
import { EmailInput, Input, PhoneInput } from "@/components/ui/Input";
import { images, SocialMediaPhoneFields, SocialMediaUrlFields } from "@/constants";
import { companyNameTitle } from "@/constants/company";
import { SiteSettingsService } from "@/services/site-settings.service";
import { useEffect, useState, useCallback } from "react";

// Custom debounce function to avoid lodash dependency
function debounce<T extends (...args: any[]) => any>(func: T, wait: number) {
    let timeout: ReturnType<typeof setTimeout>;
    return (...args: Parameters<T>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

export default function Settings() {
    const [dataSaved, setDataSaved] = useState(false);
    const [loading, setLoading] = useState(false);
    const [settings, setSettings] = useState<Record<string, string>>({});
    const [initializing, setInitializing] = useState(true);

    useEffect(() => {
        async function loadSettings() {
            try {
                const data = await SiteSettingsService.getAll();
                setSettings(data);
            } catch (error) {
                console.error("Failed to load settings:", error);
            } finally {
                setInitializing(false);
            }
        }
        loadSettings();
    }, []);

    const debouncedSave = useCallback(
        debounce(async (key: string, value: string) => {
            setLoading(true);
            try {
                await SiteSettingsService.update(key, value);
                setDataSaved(true);
                setTimeout(() => setDataSaved(false), 2000);
            } catch (error) {
                console.error("Failed to save setting:", error);
            } finally {
                setLoading(false);
            }
        }, 1000),
        []
    );

    const handleChange = (key: string, value: string) => {
        setSettings(prev => ({ ...prev, [key]: value }));
        debouncedSave(key, value);
    };

    if (initializing) {
        return <div className="p-10 text-center text-muted">Loading settings...</div>;
    }

    return (
        <main>
            <section className="h-hero min-h-hero content-container relative w-full">
                <div className="flex max-md:flex-col md:justify-between md:items-end gap-2 w-full h-fit mb-4">
                    <h1 className="font-semibold text-lg md:text-2xl"> Settings & Contacts </h1>

                    {loading
                        ? <span className="font-medium text-xs text-foreground/75 animate-pulse"> Saving Data... </span>
                        :
                        dataSaved
                            ? <span className="font-medium text-xs text-success pulse"> ✓ Data-Saved </span>
                            : <span className="font-medium text-xs text-muted/75"> Auto-Save enabled </span>
                    }
                </div>

                <div className="flex max-md:flex-col gap-4 w-full">
                    <div className="flex flex-col gap-2 md:gap-4 w-full h-full md:p-4 md:bg-surface rounded-xl">
                        <form className="flex flex-col gap-4">
                            <div className="flex flex-col items-center gap-2 w-full max-md:p-4 max-md:bg-surface rounded-xl">
                                <div className="group/item relative w-fit h-25 md:h-40 p-1 md:p-2 aspect-square border border-muted/15 rounded-full bg-background overflow-hidden text-center content-center">
                                    {/* Image upload logic could be added here */}
                                    <img src={images[7]} alt="Avatar" className="w-full h-full object-cover rounded-full" />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <span className="font-semibold text-foreground"> {settings['company_name'] || companyNameTitle} </span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-4 h-full md:bg-surface rounded-xl">
                                <div className="flex flex-col gap-2">
                                    <label className="font-medium text-xs text-muted mx-1"> Email Addresses </label>
                                    <div className="flex flex-col gap-2">
                                        <EmailInput
                                            id="primary_email"
                                            placeholder="hello@example.com"
                                            value={settings['primary_email'] || ''}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('primary_email', e.target.value)}
                                        />
                                        <EmailInput
                                            id="admin_email"
                                            placeholder="admin@example.com"
                                            value={settings['admin_email'] || ''}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('admin_email', e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="font-medium text-xs text-muted mx-1"> Phone numbers </label>
                                    <div className="flex flex-col gap-2">
                                        <PhoneInput
                                            id="primary_phone"
                                            placeholder="+213123456789"
                                            value={settings['primary_phone'] || ''}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('primary_phone', e.target.value)}
                                        />
                                        <PhoneInput
                                            id="whatsapp"
                                            placeholder="WhatsApp Number"
                                            value={settings['whatsapp'] || ''}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('whatsapp', e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="font-medium text-xs text-muted mx-1"> Location </label>
                                    <div className="flex flex-col gap-2">
                                        <Input
                                            id="google_maps_url"
                                            type="url"
                                            placeholder="Google Maps Location URL"
                                            value={settings['google_maps_url'] || ''}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('google_maps_url', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="flex flex-col gap-2 md:gap-4 w-full md:p-4 md:bg-surface rounded-xl">
                    <h2 className="font-medium text-sm"> Social Media </h2>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            {SocialMediaUrlFields.map((social) => (
                                <Input
                                    key={social.id}
                                    id={social.id}
                                    type="url"
                                    placeholder={social.placeholder}
                                    className="content-center pl-10"
                                    value={settings[social.label.toLowerCase()] || ''}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(social.label.toLowerCase(), e.target.value)}
                                >
                                    <span className="absolute px-1.5 left-0.5 md:left-1"> {social.icon} </span>
                                </Input>
                            ))}

                            {SocialMediaPhoneFields.map((social) => (
                                <Input
                                    key={social.id}
                                    id={social.id}
                                    type="tel"
                                    placeholder={social.placeholder}
                                    className="content-center pl-10"
                                    value={settings[social.label.toLowerCase()] || ''}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(social.label.toLowerCase(), e.target.value)}
                                >
                                    <span className="absolute px-1.5 left-0.5 md:left-1"> {social.icon} </span>
                                </Input>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </main >
    )
}
