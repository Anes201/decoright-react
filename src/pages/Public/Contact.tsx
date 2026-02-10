
import { useState, useEffect } from "react"
import { ICONS } from "@/icons";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { AdminService } from "@/services/admin.service";

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

    return (
        <ul className="grid grid-cols-[repeat(auto-fit,minmax(12rem,1fr))] justify-center gap-4 w-full">
            <ContactCard>
                {/* Card Icon */}
                <div className="p-2 ring-1 ring-muted/15 rounded-lg w-fit bg-surface">
                    {ICONS.phone({ className: 'size-6' })}
                </div>

                <a href={`tel:${primaryPhone}`} className="space-y-3">
                    <div>
                        <h3 className="font-semibold text-primary text-lg"> Call Us </h3>
                        <p className="text-2xs md:text-xs text-muted"> Have a quick question? Give us a call or send a text. </p>
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
                        <h3 className="font-semibold text-primary text-lg"> Mail & Support </h3>
                        <p className="text-2xs md:text-xs text-muted"> Email us for detailed inquiries and project proposals. </p>
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
                        <h3 className="font-semibold text-primary text-lg"> Visit Us </h3>
                        <p className="text-2xs md:text-xs text-muted"> Come visit our office to discuss your project in person. </p>
                    </div>

                    <span className="font-medium text-xs text-foreground hover:underline active:underline"> View on Google Maps </span>
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

    const pageTitle = settings.contact_page_title || "Get in Touch";
    const pageDescription = settings.contact_page_description || "We'd love to hear from you. Whether you have a question about our services, pricing, or anything else, our team is ready to answer all your questions.";

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