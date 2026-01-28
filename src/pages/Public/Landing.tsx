
import { Hero } from "@/components/layout/Landing"
import { ServiceCardList } from "@components/layout/Services"

import { FAQList } from "@components/layout/FAQ"
import { SectionHeader } from "@/components/ui/SectionHeader"
import { ShowcaseCardList } from "@/components/layout/Showcase"
import { Link } from "react-router-dom"
import { PATHS } from "@/routers/Paths"
import { ICONS } from "@/icons"

export default function Landing() {
    return (
        <>
            <main className="bg-linear-0 from-transparent to-primary/4">
                <Hero />
            </main>
            <section className="relative my-8 py-12 px-3 sm:px-6 md:px-8">

                {/* <div className="absolute top-0 left-0 bg-linear-to-b from-background to-background/15 w-full h-full -z-10"></div> */}

                <div className="content-container flex flex-col gap-8 w-full">
                    {/* Section Header */}
                    <SectionHeader
                        title="Explore our range of interior design services"
                        desc="Lorem ipsum dolor, sit amet consectetur adipisicing elit. Minus aperiam aspernatur, et repellendus facilis non dolore,  tailored to meet your unique needs."
                    />

                    {/* Service Cards */}
                    <ServiceCardList />
                </div>

            </section>
            <section className="content-container relative flex flex-col gap-6 w-full px-3 sm:px-6 md:px-8">
                {/* Section Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                    <SectionHeader
                        title='Browse our previous projects from our showcase'
                        desc='A curated selection of our finest interior design projects, highlighting our commitment to quality, creativity, and client satisfaction. Explore the diverse styles and innovative solutions that define our work.'
                    />
                    <Link to={PATHS.PROJECT_LIST} className="text-primary font-medium text-sm whitespace-nowrap hover:underline pb-2 flex items-center gap-1">
                        View All Projects {ICONS.chevronRight({ className: 'size-4' })}
                    </Link>
                </div>

                {/* Project Cards */}
                <ShowcaseCardList />

            </section>

            <section className="content-container flex flex-col gap-8 w-full my-16 px-4 sm:px-6 md:px-8">

                {/* Section Header */}
                <SectionHeader
                    title="Most frequently asked questions by our users"
                    desc="A curated selection of our finest interior design projects, highlighting our commitment to quality, creativity, and client satisfaction. Explore the diverse styles and innovative solutions that define our work."
                />

                {/* FAQ List */}
                <FAQList />

            </section>
        </>
    )
}
