import { useState, useEffect } from "react"
import { ServiceCardList } from "@components/layout/Services"
import { PCTALink } from "@components/ui/CTA"
import { SectionHeader } from "@components/ui/SectionHeader"
import { FAQList } from "@components/layout/FAQ"
import { PATHS } from "@/routers/Paths"
import { AdminService } from "@/services/admin.service"

export default function ServiceList() {
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

    const pageTitle = settings.service_list_title || "Our Services";
    const pageDescription = settings.service_list_description || "Discover our comprehensive range of interior design services tailored to transform your space into your dream environment.";
    const faqTitle = settings.service_faq_title || "Frequently Asked Questions";
    const faqDescription = settings.service_faq_description || "Find answers to common questions about our design services, process, and pricing.";

    return (

        <main>
            <section className="content-container relative px-4 sm:px-8 md:px-12">
                <div className="w-full h-full my-12 p-4 md:p-8 border border-muted/15 rounded-4xl">
                    {/* Context */}
                    <div className="flex flex-col gap-8">
                        <div className="space-y-2 md:space-y-4">
                            <h1 className="font-semibold text-lg sm:text-2xl md:text-3xl leading-6">
                                {pageTitle}
                            </h1>
                            <p className="text-3xs sm:text-2xs md:text-xs">
                                {pageDescription}
                            </p>
                        </div>

                        {/* CTA */}
                        <div className="flex gap-2">
                            <PCTALink to={PATHS.CLIENT.REQUEST_SERVICE}> Request a Project </PCTALink>
                        </div>

                    </div>

                    {/* Hero Image */}
                    <div>

                    </div>
                </div>


                <div>
                    <ServiceCardList />
                </div>

            </section>

            <section className="content-container relative my-18 px-4 sm:px-8 md:px-12 space-y-12">
                <SectionHeader
                    title={faqTitle}
                    desc={faqDescription}
                />
                <FAQList />
            </section>
        </main>
    )
}