import FAQList from "@/components/layout/FAQ";
import { useTranslation } from "react-i18next";

export default function FAQListPage() {

    useTranslation();

    return (

        <main>
            <section className="h-hero min-h-hero max-w-240 mx-auto relative flex flex-col items-center justify-center w-full md:mt-8">
                <div className="absolute right-full w-full h-[calc(100svh-22rem)] md:h-[calc(100svh-18rem)] border border-muted/20 rounded-4xl mask-l-to-transparent mask-l-to-30% overflow-hidden"></div>


                <div className="relative flex flex-col gap-8 items-center justify-center w-full h-full px-4 py-4 md:py-8 ">


                    <FAQList />
                </div>

                <div className="absolute left-full w-full h-[calc(100svh-22rem)] md:h-[calc(100svh-18rem)] border border-muted/20 rounded-4xl mask-r-to-transparent mask-r-to-30% overflow-hidden"></div>
            </section>
        </main>

    )
}