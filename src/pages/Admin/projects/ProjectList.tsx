
import { ProjectCardList } from "@/components/layout/admin/ProjectList";

export default function ProjectList () {
    return (

        <main>
            <section className="h-hero min-h-hero relative flex flex-col w-full md:pt-8">
                <div className="relative flex flex-col gap-8 h-full">
                    <h1 className="font-semibold text-lg md:text-2xl w-fit"> Project List </h1>
                    <div className="w-full">
                        <ProjectCardList />
                    </div>
                </div>
            </section>
        </main>
    )
}