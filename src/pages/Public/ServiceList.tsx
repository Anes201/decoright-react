
import { ServiceCardList } from "@components/layout/Services"

import { PCTALink } from "@components/ui/CTA"
import { SectionHeader } from "@components/ui/SectionHeader"
import { FAQList } from "@components/layout/FAQ"

export default function ServiceList () {
    return (

        <main>
            <section className="content-container relative px-4 sm:px-8 md:px-12">
                <div className="w-full h-full my-12 p-4 md:p-8 border border-muted/15 rounded-4xl">
                    {/* Context */}
                    <div className="flex flex-col gap-8">
                        <div className="space-y-2 md:space-y-4">
                            <h1 className="font-semibold text-lg sm:text-2xl md:text-3xl leading-6"> Lorem ipsum dolor sit amet consectetur adipisicing elit. </h1>
                            <p className="text-3xs sm:text-2xs md:text-xs"> Lorem ipsum dolor sit, amet consectetur adipisicing elit. Totam corrupti vero a enim harum molestias facilis, optio pariatur voluptate itaque nam obcaecati quas omnis reprehenderit doloribus perspiciatis. dolores enim harum molestias facilis, optio pariatur voluptate itaque nam obcaecati quas omnis reprehenderit doloribus perspiciatis. Qui, ex. </p>
                        </div>


                        {/* CTA */}
                        <div className="flex gap-2">
                            <PCTALink to="/request-service"> Request a Project </PCTALink>
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
                    title="Lorem ipsum dolor sit amet consectetur adipisicing elit."
                    desc="Lorem ipsum dolor sit, amet consectetur adipisicing elit. Totam corrupti vero a enim harum molestias facilis, optio pariatur voluptate itaque nam obcaecati quas omnis reprehenderit doloribus perspiciatis. dolores enim harum molestias facilis, optio pariatur voluptate itaque nam obcaecati quas omnis reprehenderit doloribus perspiciatis. Qui, ex."
                />
                <FAQList/>
            </section>
        </main>
    )
}