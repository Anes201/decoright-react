import { useState, useEffect } from "react"
import { SectionHeader } from "@/components/ui/SectionHeader"
import { AdminService } from "@/services/admin.service"
import { useTranslation } from "react-i18next"
import { Hero } from "@/components/layout/Landing"
import { LazySection } from "@/components/common/LazySection"
import { ChevronDown } from "lucide-react"

export default function Landing() {
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

    const getSetting = (key: string, tKey: string) => {
        // 1. Try localized setting from DB
        // 2. If not English, try local translation file
        // 3. Fallback to English setting from DB
        // 4. Ultimate fallback to local English translation
        return settings[`${key}${lang}`] || (lang ? t(tKey) : settings[key]) || settings[key] || t(tKey);
    };

    const servicesTitle = getSetting('home_services_section_title', 'landing.sections.services.title');
    const servicesDescription = getSetting('home_services_section_description', 'landing.sections.services.description');
    const spaceTypesTitle = getSetting('home_space_types_section_title', 'landing.sections.space_types.title');
    const spaceTypesDescription = getSetting('home_space_types_section_description', 'landing.sections.space_types.description');
    const projectsTitle = getSetting('home_projects_section_title', 'landing.sections.projects.title');
    const projectsDescription = getSetting('home_projects_section_description', 'landing.sections.projects.description');
    const faqTitle = getSetting('home_faq_title', 'landing.sections.faq.title');
    const faqDescription = getSetting('home_faq_description', 'landing.sections.faq.description');

    return (
        <>
            <main className="bg-linear-0 from-transparent to-primary/4 overflow-y-clip">
                <Hero settings={settings} />
            </main>

            <section className="content-container relative flex flex-col gap-10 w-full py-16 md:py-24 px-4 sm:px-6 md:px-8 max-lg:overflow-x-clip">

                <hr className="absolute top-0 left-0 w-full h-full border-0 border-x border-muted/25 -z-10" />
                <hr className="absolute -top-2 -start-1 w-2.25 h-fit aspect-square border border-muted/25 rounded-full bg-emphasis shadow-xs -z-10" />
                <hr className="absolute -top-2 -end-1 w-2.25 h-fit aspect-square border border-muted/25 rounded-full bg-emphasis shadow-xs -z-10" />

                {/* Section Header */}
                <SectionHeader
                    title={servicesTitle}
                    desc={servicesDescription}
                />

                {/* Service Cards */}
                <LazySection
                    loader={() => import("@components/layout/Services")}
                    placeholder={
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="h-75 bg-gray-100 animate-pulse rounded-lg" />
                            ))}
                        </div>
                    }
                />

            </section>

            <section className="content-container relative flex flex-col gap-10 w-full py-16 md:py-24 px-4 sm:px-6 md:px-8">

                <div className="absolute top-0 left-0 w-full h-full border-x border-muted/25 pointer-events-none" />

                {/* Section Header */}
                <SectionHeader
                    title={spaceTypesTitle}
                    desc={spaceTypesDescription}
                />

                {/* Space Types Cards */}
                <LazySection
                    loader={() => import("@components/layout/SpaceTypesSection")}
                    placeholder={
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="aspect-[4/3] bg-surface animate-pulse rounded-xl ring-1 ring-muted/15" />
                            ))}
                        </div>
                    }
                />

            </section>

            <section className="content-container relative flex flex-col gap-10 w-full py-16 md:py-24 px-4 sm:px-6 md:px-8">

                <div className="absolute top-0 left-0 w-full h-full border-x border-muted/25 pointer-events-none" />

                {/* Section Header */}
                <SectionHeader
                    title={projectsTitle}
                    desc={projectsDescription}
                />

                {/* Showcase Cards */}
                <LazySection
                    loader={() => import("@components/layout/Showcase")}
                    placeholder={
                        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="h-40 bg-surface animate-pulse rounded-lg" />
                            ))}
                        </div>
                    }
                />

            </section>

            <section className="content-container relative flex flex-col gap-10 w-full py-16 md:py-24 px-4 sm:px-6 md:px-8 max-lg:overflow-x-clip">

                <hr className="absolute top-0 left-0 w-full h-full border-0 border-x border-muted/25 -z-10" />
                <hr className="absolute -bottom-2 -start-1 w-2.25 h-fit aspect-square border border-muted/25 rounded-full bg-emphasis shadow-xs -z-10" />
                <hr className="absolute -bottom-2 -end-1 w-2.25 h-fit aspect-square border border-muted/25 rounded-full bg-emphasis shadow-xs -z-10" />


                {/* Section Header */}
                <SectionHeader
                    title={faqTitle}
                    desc={faqDescription}
                />

                {/* FAQ List */}
                <LazySection
                    loader={() => import("@components/layout/FAQ")}
                    placeholder={
                        <div className="flex flex-col gap-4 w-full animate-pulse">
                            <hr className="absolute top-0 start-8 h-full border-0 border-s border-muted/25 -z-10 pointer-events-none" />
                            <hr className="absolute top-0 end-8 h-full border-0 border-e border-muted/25 -z-10 pointer-events-none" />
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="relative flex items-center justify-end p-5 bg-surface rounded-lg ring-1 ring-muted/15">
                                    <ChevronDown className="size-6 text-muted/75" />
                                </div>

                            ))}
                        </div>
                    }
                />

            </section>
        </>
    )
}
