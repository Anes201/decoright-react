import ProjectCreateLayout from "@/components/layout/admin/ProjectCreate";



export default function ServiceCreate () {
    return (

        <main>
            <section className="h-hero min-h-hero relative flex flex-col w-full md:pt-8">
                <div className="relative flex flex-col gap-8 h-full">
                    <h1 className="font-semibold text-lg md:text-2xl w-fit"> Create a Project </h1>
                    <div className="w-full lg:w-2/3 border border-red-400">
                        <ProjectCreateLayout />
                    </div>
                </div>
            </section>
        </main>
    )
}