import { useState, useEffect } from "react"
import { Hero } from "@/components/layout/Landing"
import { ServiceCardList } from "@components/layout/Services"
import { FAQList } from "@components/layout/FAQ"
import { SectionHeader } from "@/components/ui/SectionHeader"
import { ShowcaseCardList } from "@/components/layout/Showcase"
import { Link } from "react-router-dom"
import { PATHS } from "@/routers/Paths"
import { AdminService } from "@/services/admin.service"
import { useTranslation } from "react-i18next"
import { ICONS } from "@/icons"

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
            <section className="relative my-8 py-12 px-3 sm:px-6 md:px-8">

                {/* <div className="absolute top-0 left-0 bg-linear-to-b from-background to-background/15 w-full h-full -z-10"></div> */}

                <div className="content-container flex flex-col gap-8 w-full">
                    {/* Section Header */}
                    <SectionHeader
                        title={servicesTitle}
                        desc={servicesDescription}
                    />

                    {/* Service Cards */}
                    <ServiceCardList />
                </div>

            </section>
            <section className="content-container relative flex flex-col gap-6 w-full px-3 sm:px-6 md:px-8">
                {/* Section Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                    <SectionHeader
                        title={projectsTitle}
                        desc={projectsDescription}
                    />
                    <Link to={PATHS.PROJECT_LIST} className="text-primary font-medium text-sm whitespace-nowrap hover:underline pb-2 flex items-center gap-1">
                        {t('common.view_all_projects')} {ICONS.chevronRight({ className: `size-4 ${i18n.dir() === 'rtl' ? 'rotate-180' : ''}` })}
                    </Link>
                </div>

                {/* Project Cards */}
                <ShowcaseCardList />

            </section>

            <section className="content-container flex flex-col gap-8 w-full my-16 px-4 sm:px-6 md:px-8">

                {/* Section Header */}
                <SectionHeader
                    title={faqTitle}
                    desc={faqDescription}
                />

                {/* FAQ List */}
                <FAQList />

            </section>
        </>
    )
}
