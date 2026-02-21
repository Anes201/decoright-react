import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { ServiceCardList } from "@components/layout/Services"
import { PCTALink } from "@components/ui/CTA"
import { SectionHeader } from "@components/ui/SectionHeader"
import { FAQList } from "@components/layout/FAQ"
import { PATHS } from "@/routers/Paths"
import { AdminService } from "@/services/admin.service"

export default function ServiceList() {
    const { t } = useTranslation();
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

    const pageTitle = settings.service_list_title || t('services.service_list_title');
    const pageDescription = settings.service_list_description || t('services.service_list_description');
    const faqTitle = settings.service_faq_title || t('faqs.faq_title');
    const faqDescription = settings.service_faq_description || t('faqs.faq_description');

    return (
        <>
            <main>
                <section className="content-container relative w-full px-4 sm:px-8 md:px-12">
                    <div className="w-full h-full my-12 p-4 md:p-8 border border-muted/15 rounded-4xl">
                        {/* Context */}
                        <div className="flex flex-col gap-8">
                            <div className="space-y-2 md:space-y-3">
                                <h1 className="font-semibold text-lg sm:text-2xl md:text-3xl">
                                    {pageTitle}
                                </h1>
                                <p className="text-3xs sm:text-2xs md:text-xs">
                                    {pageDescription}
                                </p>
                            </div>

                            {/* CTA */}
                            <div className="flex gap-2">
                                <PCTALink to={PATHS.CLIENT.REQUEST_SERVICE} className="w-fit"> {t('services.request_project')} </PCTALink>
                            </div>
                        </div>
                    </div>

                    <div>
                        <ServiceCardList />
                    </div>

                </section>

            </main>
            <section className="content-container relative my-18 px-4 sm:px-8 md:px-12 space-y-12">
                <SectionHeader
                    title={faqTitle}
                    desc={faqDescription}
                />
                <FAQList />
            </section>
        </>
    )
}