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

    const servicesTitle = settings[`home_services_section_title${lang}`] || settings.home_services_section_title || t('landing.sections.services.title');
    const servicesDescription = settings[`home_services_section_description${lang}`] || settings.home_services_section_description || t('landing.sections.services.description');
    const projectsTitle = settings[`home_projects_section_title${lang}`] || settings.home_projects_section_title || t('landing.sections.projects.title');
    const projectsDescription = settings[`home_projects_section_description${lang}`] || settings.home_projects_section_description || t('landing.sections.projects.description');
    const faqTitle = settings[`home_faq_title${lang}`] || settings.home_faq_title || t('landing.sections.faq.title');
    const faqDescription = settings[`home_faq_description${lang}`] || settings.home_faq_description || t('landing.sections.faq.description');

    return (
        <>
            <main className="bg-linear-0 from-transparent to-primary/4 overflow-y-clip">
                <Hero settings={settings} />
            </main>

            <section className="content-container relative flex flex-col gap-8 w-full mt-16 pb-16 px-4 sm:px-6 md:px-8 max-lg:overflow-x-clip">

                <hr className="absolute top-0 left-0 w-full h-full border-0 border-x border-muted/25 -z-10" />
                <hr className="absolute -top-2 -start-1 w-2.25 h-fit aspect-square border border-muted/25 rounded-full bg-emphasis shadow-xs -z-10" />
                <hr className="absolute -top-2 -end-1 w-2.25 h-fit aspect-square border border-muted/25 rounded-full bg-emphasis shadow-xs -z-10" />

                <div className="content-container flex flex-col gap-4 md:gap-6 w-full">
                    {/* Section Header */}
                    <SectionHeader
                        title={servicesTitle}
                        desc={servicesDescription}
                    />

                    {/* Service Cards */}
                    <LazySection
                        loader={() => import("@components/layout/Services")}
                        placeholder={
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="h-75 bg-gray-100 animate-pulse rounded-lg" />
                                ))}
                            </div>
                        }
                    />
                </div>

            </section>
            <section className="content-container relative flex flex-col gap-6 w-full px-3 sm:px-6 md:px-8">

                <div className="absolute top-0 left-0 w-full h-full border-x border-muted/25 pointer-events-none" />

                {/* Section Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                    <SectionHeader
                        title={projectsTitle}
                        desc={projectsDescription}
                    />
                </div>

                {/* Showcase Cards */}
                <LazySection
                    loader={() => import("@components/layout/Showcase")}
                    placeholder={
                        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="h-40 bg-surface animate-pulse rounded-lg" />
                            ))}
                        </div>
                    }
                />

            </section>
            <section className="content-container relative flex flex-col gap-8 w-full mb-16 pt-16 px-4 sm:px-6 md:px-8 max-lg:overflow-x-clip">

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
                        <div className="flex flex-col gap-2">
                            {[...Array(5)].map((_, i) => (
                                <>
                                    <div key={i} className="relative h-14 bg-surface animate-pulse rounded-lg ring-1 ring-muted/15">
                                        <ChevronDown className="size-6 absolute top-1/2 -translate-y-1/2 end-3 text-muted/75" />
                                    </div>
                                </>
                            ))}
                        </div>
                    }
                />

            </section>
        </>
    )
}
