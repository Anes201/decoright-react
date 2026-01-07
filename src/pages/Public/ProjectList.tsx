
import { ProjectCardList } from "@/components/layout/ProjectList"
import { PCTALink } from "@components/ui/CTA"

export default function ProjectListPage() {
    return (
        <main>
            <section className="content-container relative px-4 sm:px-8 md:px-12">
                {/* <div className="absolute top-0 left-0 w-full h-1/2 -z-10 border border-muted/15 rounded-t-4xl mask-b-to-transparent mask-b-from-90%"></div> */}
                <div className="w-full h-full my-12">
                    {/* Context */}
                    <div className="flex flex-col gap-8 p-4 md:p-8 border border-muted/15 rounded-4xl">

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
                    <ProjectCardList />
                </div>

            </section>

        </main>
    )
}