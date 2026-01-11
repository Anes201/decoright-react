import CreateProjectForm from "@/components/layout/admin/CreateProject";



export default function Users () {
    return (
        <main>
            <section className="h-hero min-h-hero relative flex flex-col w-full mb-40">
                <div className="relative flex flex-col gap-8 h-full md:p-6">
                <div className="max-md:hidden absolute top-0 left-0 w-full h-full border border-muted/15 rounded-3xl bg-surface -z-10 mask-b-to-transparent mask-b-to-100%"></div>
                    <h1 className="font-semibold text-lg md:text-2xl"> Create Project Form </h1>
                    <CreateProjectForm />
                </div>
            </section>
        </main>
    )
}