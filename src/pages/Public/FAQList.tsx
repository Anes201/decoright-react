import { FAQList } from "@/components/layout/FAQ";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useTranslation } from "react-i18next";


export default function FAQListPage(){

    const { t } = useTranslation('pages');

    return (

        <main>
            <section className="h-hero min-h-hero max-w-240 mx-auto relative flex flex-col items-center justify-center w-full md:mt-8 ">
                <div className="absolute right-full w-full h-[calc(100svh-22rem)] md:h-[calc(100svh-18rem)] border border-muted/20 rounded-4xl mask-l-to-transparent mask-l-to-30% overflow-hidden"></div>


                <div className="relative flex flex-col gap-16 justify-center items-center w-full h-full px-4 py-4 md:py-8 ">
                    {/* Section Header */}
                    <SectionHeader
                        title={ t('pages:landing.faqs.header') }
                        desc={ t('pages:landing.faqs.subheader') }
                    />
                    <FAQList />
                </div>

                <div className="absolute left-full w-full h-[calc(100svh-22rem)] md:h-[calc(100svh-18rem)] border border-muted/20 rounded-4xl mask-r-to-transparent mask-r-to-30% overflow-hidden"></div>
            </section>
        </main>

    )
}