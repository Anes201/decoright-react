import { FAQList } from "@/components/layout/FAQ";
import { PCTALink } from "@/components/ui/CTA";
import { PATHS } from "@/routers/Paths";
import { useTranslation } from "react-i18next";
import { Phone } from "@/icons";

export default function FAQListPage(){

    const { t } = useTranslation();

    return (

        <main>
            <section className="h-hero min-h-hero max-w-240 mx-auto relative flex flex-col items-center justify-center w-full md:mt-8">
                <div className="absolute right-full w-full h-[calc(100svh-22rem)] md:h-[calc(100svh-18rem)] border border-muted/20 rounded-4xl mask-l-to-transparent mask-l-to-30% overflow-hidden"></div>


                <div className="relative flex flex-col gap-8 items-center justify-center w-full h-full px-4 py-4 md:py-8 ">
                    {/* Section Header */}
                    <div className="flex flex-col gap-4 md:gap-8 md:p-8 w-full md:border border-muted/15 rounded-4xl">
                        <div className="space-y-2 md:space-y-4">
                            <h1 className="font-semibold text-lg sm:text-2xl md:text-3xl"> { t('gallery.header') } </h1>
                            <p className="text-2xs md:text-xs"> { t('gallery.subheader') } </p>
                        </div>
                        {/* CTA */}
                        <PCTALink to={PATHS.CONTACT} className="flex items-center gap-2 w-full md:w-fit"
                        > <Phone className="size-5 text-white rtl:rotate-y-180"/> { t('nav.request_service') }
                        </PCTALink>

                    </div>

                    <FAQList />
                </div>

                <div className="absolute left-full w-full h-[calc(100svh-22rem)] md:h-[calc(100svh-18rem)] border border-muted/20 rounded-4xl mask-r-to-transparent mask-r-to-30% overflow-hidden"></div>
            </section>
        </main>

    )
}