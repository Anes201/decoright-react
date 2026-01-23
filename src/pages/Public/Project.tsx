
import { ProjectDetail } from "@/components/layout/ProjectDetail"

export default function ProjectPage() {
    return (

        <main>
            <section className="min-h-hero content-container relative h-full w-full">
                <div className="flex max-md:flex-col gap-3 md:gap-4 mb-18 w-full">
                    <ProjectDetail/>
                </div>
            </section>
        </main>

    )
}