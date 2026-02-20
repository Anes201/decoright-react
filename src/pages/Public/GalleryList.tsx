import GalleryListLayout from "@/components/layout/GalleryList";
import { PCTALink } from "@/components/ui/CTA";
import { PATHS } from "@/routers/Paths";
import { useTranslation } from "react-i18next";



export default function GalleryPortfolioList () {

    const { t } = useTranslation()

    return (

        <main>
            <section className="h-hero min-h-hero content-container relative flex flex-col items-center justify-center w-full mt-8 mb-28">

                <div className="absolute right-full w-full h-[calc(100svh-18rem)] md:h-[calc(100svh-16rem)] border border-muted/20 rounded-4xl mask-l-to-transparent mask-l-to-30% overflow-hidden"></div>

                    <div className="relative flex flex-col gap-8 items-center justify-center w-full h-full md:py-8 ">
                        {/* Section Header */}
                        <div className="flex flex-col gap-4 md:gap-8 md:p-8 w-full md:border border-muted/15 rounded-4xl">
                            <div className="space-y-2 md:space-y-4">
                                <h1 className="font-semibold text-lg sm:text-2xl md:text-3xl"> { t('gallery.header') } </h1>
                                <p className="text-2xs md:text-xs"> { t('gallery.subheader') } </p>
                            </div>
                            {/* CTA */}
                            <PCTALink to={PATHS.CLIENT.REQUEST_SERVICE} className="w-full md:w-fit"> { t('nav.request_service') } </PCTALink>

                        </div>

                        <GalleryListLayout/>
                    </div>

                <div className="absolute left-full w-full h-[calc(100svh-18rem)] md:h-[calc(100svh-16rem)] border border-muted/20 rounded-4xl mask-r-to-transparent mask-r-to-30% overflow-hidden"></div>

            </section>
        </main>

    )
}
