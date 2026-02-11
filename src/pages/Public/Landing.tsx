
import { HeroSection } from "@/components/layout/Landing"
import { ServiceCardList } from "@components/layout/Services"

import { FAQList } from "@components/layout/FAQ"
import { SectionHeader } from "@/components/ui/SectionHeader"
import { ShowcaseCardList } from "@/components/layout/Showcase"
import { useTranslation } from "react-i18next"

export default function LandingPage() {

    const { t } = useTranslation('pages');

    return (
        <>
            <main className="bg-linear-0 from-transparent to-primary/4 overflow-y-clip">
                <HeroSection />
            </main>
            <section className="relative my-8 py-12 px-3 sm:px-6 md:px-8">

                {/* <div className="absolute top-0 left-0 bg-linear-to-b from-background to-background/15 w-full h-full -z-10"></div> */}

                <div className="content-container flex flex-col gap-8 w-full">
                    {/* Section Header */}
                    <SectionHeader
                        title={ t('pages:landing.services.header') }
                        desc={ t('pages:landing.services.subheader') }
                    />

                    {/* Service Cards */}
                    <ServiceCardList />
                </div>

            </section>
            <section className="content-container relative flex flex-col gap-6 w-full px-3 sm:px-6 md:px-8">
                {/* Section Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                    <SectionHeader
                        title={ t('pages:landing.showcases.header') }
                        desc={ t('pages:landing.showcases.subheader') }
                    />
                </div>

                {/* Showcase Cards */}
                <ShowcaseCardList />

            </section>

            <section className="content-container flex flex-col gap-8 w-full my-16 px-4 sm:px-6 md:px-8">

                {/* Section Header */}
                <SectionHeader
                    title={ t('pages:landing.faqs.header') }
                    desc={ t('pages:landing.faqs.subheader') }
                />

                {/* FAQ List */}
                <FAQList />

            </section>
        </>
    )
}
