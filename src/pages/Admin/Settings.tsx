
import Spinner from "@/components/common/Spinner";
import { PButton } from "@/components/ui/Button";
import { SCTALink } from "@/components/ui/CTA";
import { EmailInput, Input, PhoneInput } from "@/components/ui/Input";
import { SocialMediaPhoneFields, SocialMediaUrlFields } from "@/constants";
import { Folder } from "@/icons";
import { SiteSettingsService } from "@/services/site-settings.service";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";


export default function Settings() {
    const [loading, setLoading] = useState(false);
    const [settings, setSettings] = useState<Record<string, string>>({});
    const [initializing, setInitializing] = useState(true);
    const navigate = useNavigate();

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

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            const savePromises = Object.entries(settings).map(([key, value]) =>
                SiteSettingsService.update(key, value)
            );
            await Promise.all(savePromises);
            // Optionally show a success message
            toast.success("Settings saved successfully!");
        } catch (error) {
            console.error("Failed to save settings:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (key: string, value: string) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    if (initializing) {
        return <div className="p-10 text-center text-muted">Loading settings...</div>;
    }

    return (
        <main className="w-full">
            <section className="relative flex flex-col w-full px-4 md:px-8 py-6 space-y-6 mb-20">
                <div className="flex max-md:flex-col md:justify-between md:items-end gap-2 w-full h-fit">
                    <h1 className="font-semibold text-lg md:text-2xl"> Settings & Contacts </h1>
                </div>

                <div className="flex max-md:flex-col gap-4 w-full">
                    <div className="flex flex-col gap-2 md:gap-4 w-full h-full">
                        <form className="flex flex-col gap-4">

                            <div className="flex flex-col gap-4 h-full">
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

                <div className="flex flex-col gap-2 md:gap-4 w-full">
                    <h2 className="font-medium text-sm"> Social Media </h2>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            {SocialMediaUrlFields.map((social: any) => (
                                <Input
                                    key={social.id}
                                    id={social.id}
                                    type="url"
                                    placeholder={social.placeholder}
                                    className="content-center pl-10"
                                    value={settings[social.key] || ''}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(social.key, e.target.value)}
                                >
                                    <span className="absolute px-1.5 left-0.5 md:left-1"> {social.icon ? <social.icon /> : <Folder />} </span>
                                </Input>
                            ))}

                            {SocialMediaPhoneFields.map((social: any) => (
                                <Input
                                    key={social.id}
                                    id={social.id}
                                    type="tel"
                                    placeholder={social.placeholder}
                                    className="content-center pl-10"
                                    value={settings[social.key] || ''}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(social.key, e.target.value)}
                                >
                                    <span className="absolute px-1.5 left-0.5 md:left-1"> {social.icon ? <social.icon /> : <Folder />} </span>
                                </Input>
                            ))}
                        </div>
                    </div>
                    <div>

                    </div>
                </div>
                <div className="flex gap-4">
                    <PButton type="button" disabled={loading} className="min-w-[120px]"
                    onClick={handleSubmit}>
                        <Spinner status={loading} size="sm"> Save Changes </Spinner>
                    </PButton>

                    <SCTALink to={handleGoBack}> Cancel </SCTALink>
                </div>
            </section>
        </main >
    )
}
