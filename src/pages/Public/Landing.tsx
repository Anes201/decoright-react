
import { Hero } from "@/components/layout/Landing"
import { ServiceCardList } from "@components/layout/Services"
import { ProjectCardList } from "@/components/layout/ProjectList"
import { FAQList } from "@components/layout/FAQ"
import { SectionHeader } from "@/components/ui/SectionHeader"

export default function Landing () {
    return (
        <>
            <main className="bg-linear-0 from-transparent to-primary/4">
                <Hero/>
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
                    <ServiceCardList/>
                </div>

            </section>
            <section className="content-container relative flex flex-col gap-6 w-full px-3 sm:px-6 md:px-8">
                {/* Section Header */}
                <SectionHeader
                    title='Browse our previous projects from our showcase'
                    desc='A curated selection of our finest interior design projects, highlighting our commitment to quality, creativity, and client satisfaction. Explore the diverse styles and innovative solutions that define our work.'
                />

                {/* Project Cards */}
                <ProjectCardList/>

            </section>

            <section className="content-container flex flex-col gap-8 w-full my-16 px-4 sm:px-6 md:px-8">

                {/* Section Header */}
                <SectionHeader
                    title="Most frequently asked questions by our users"
                    desc="A curated selection of our finest interior design projects, highlighting our commitment to quality, creativity, and client satisfaction. Explore the diverse styles and innovative solutions that define our work."
                />

                {/* FAQ List */}
                <FAQList/>

        </section>
        </>
    )
}
