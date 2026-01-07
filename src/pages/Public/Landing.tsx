
import { Hero } from "@/components/layout/Landing"
import { ServiceListLayout } from "@components/layout/Services"
import { ProjectListLayout } from "@/components/layout/ProjectList"
import { FAQ } from "@components/layout/FAQ"

export default function Landing () {
    return (
        <>
            <main className="bg-linear-3 from-transparent via-primary/15 to-surface/45">
                <Hero/>
            </main>
            <ServiceListLayout/>
            <ProjectListLayout/>
            <FAQ/>
        </>
    )
}
