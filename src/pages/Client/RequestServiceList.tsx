
import { RequestServiceList } from "@/components/layout/client/RequestServiceList"
import { useTranslation } from "react-i18next";

export default function RequestServiceListPage() {
    const { t } = useTranslation();
    return (

        <main>

            <section className="h-hero min-h-hero content-container relative flex flex-col items-center gap-8 w-full my-8">
                <div className="flex flex-col gap-2 md:gap-4 w-full">
                    <h2 className="font-semibold text-lg sm:text-xl md:text-2xl"> {t('requests.title')}  </h2>
                    <p className="text-xs md:text-sm text-muted">{t('requests.description')}</p>
                </div>

                <div className="relative w-full h-full p-2 md:p-4">
                    <div className="absolute top-0 left-0 w-full h-full border border-muted/15 rounded-2xl -z-10 mask-b-to-transparent"></div>

                    <RequestServiceList />
                </div>
            </section>

        </main>

    )
}
