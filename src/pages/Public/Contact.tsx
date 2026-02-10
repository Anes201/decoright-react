
import { useState, useEffect } from "react"
import { ICONS } from "@/icons";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { AdminService } from "@/services/admin.service";
import { useTranslation } from "react-i18next";

export function ContactCard({ children }: any) {
    return (
        <li className="flex flex-col justify-between gap-8 w-full p-4 sm:p-6 border border-muted/25 bg-surface/75 rounded-lg cursor-pointer hover:bg-emphasis/75 active:bg-emphasis/75"> {children} </li>
    )
}

export function ContactCardList() {
    const {
        primaryPhone,
        primaryEmail,
        googleMapsUrl
    } = useSiteSettings();

    const { t } = useTranslation();

    return (
        <ul className="grid grid-cols-[repeat(auto-fit,minmax(12rem,1fr))] justify-center gap-4 w-full">
            <ContactCard>
                {/* Card Icon */}
                <div className="p-2 ring-1 ring-muted/15 rounded-lg w-fit bg-surface">
                    {ICONS.phone({ className: 'size-6' })}
                </div>

                <a href={`tel:${primaryPhone}`} className="space-y-3">
                    <div>
                        <h3 className="font-semibold text-primary text-lg"> {t('contact.cards.call_us.title')} </h3>
                        <p className="text-2xs md:text-xs text-muted"> {t('contact.cards.call_us.description')} </p>
                    </div>

                    <span className="font-medium text-xs text-foreground hover:underline active:underline"> {primaryPhone} </span>
                </a>

            </ContactCard>

            <ContactCard>
                {/* Card Icon */}
                <div className="p-2 ring-1 ring-muted/15 rounded-lg w-fit bg-surface">
                    {ICONS.envelope({ className: 'size-6' })}
                </div>

                <a href={`mailto:${primaryEmail}`} className="space-y-3">
                    <div>
                        <h3 className="font-semibold text-primary text-lg"> {t('contact.cards.mail_support.title')} </h3>
                        <p className="text-2xs md:text-xs text-muted"> {t('contact.cards.mail_support.description')} </p>
                    </div>

                    <span className="font-medium text-xs text-foreground hover:underline active:underline"> {primaryEmail} </span>
                </a>
            </ContactCard>

            <ContactCard>
                {/* Card Icon */}
                <div className="p-2 ring-1 ring-muted/15 rounded-lg w-fit bg-surface">
                    {ICONS.mapPin({ className: 'size-6' })}
                </div>

                <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" className="space-y-3">
                    <div>
                        <h3 className="font-semibold text-primary text-lg"> {t('contact.cards.visit_us.title')} </h3>
                        <p className="text-2xs md:text-xs text-muted"> {t('contact.cards.visit_us.description')} </p>
                    </div>

                    <span className="font-medium text-xs text-foreground hover:underline active:underline"> {t('contact.cards.visit_us.cta')} </span>
                </a>
            </ContactCard>
        </ul>
    )
}

export default function Contact() {
    const [settings, setSettings] = useState<Record<string, string>>({});

    useEffect(() => {
        async function fetchSettings() {
            try {
                const data = await AdminService.getSettings();
                setSettings(data);
            } catch (error) {
                console.error("Failed to fetch site settings:", error);
            }
        }
        fetchSettings();
    }, []);

    const { t, i18n } = useTranslation();
    const lang = i18n.language.startsWith('ar') ? '_ar' : i18n.language.startsWith('fr') ? '_fr' : '';

    const pageTitle = settings[`contact_page_title${lang}`] || settings.contact_page_title || t('contact.title');
    const pageDescription = settings[`contact_page_description${lang}`] || settings.contact_page_description || t('contact.description');

    return (
        <main>
            <section className="h-hero min-h-hero content-container relative flex flex-col items-center justify-center space-y-8">


                {/* Section Header */}
                <div className="flex flex-col gap-2 md:gap-4 w-full text-center">
                    <h1 className="font-semibold text-xl sm:text-2xl md:text-4xl">
                        {pageTitle}
                    </h1>
                    <p className="text-2xs sm:text-xs md:text-sm text-muted/75">
                        {pageDescription}
                    </p>
                </div>

                <ContactCardList />

            </section>
        </main>
    )
}