import ProjectForm from "@/components/layout/admin/projects/ProjectForm";
import { Link } from "react-router-dom";
import { PATHS } from "@/routers/Paths";
import { ChevronRight } from "@/icons";

export default function ProjectCreatePage() {
    return (
        <main className="min-h-screen">
            <section className="relative flex flex-col w-full px-4 md:px-8 pt-6 pb-20">
                <div className="flex flex-col gap-8 w-full max-w-5xl mx-auto">
                    <div className="flex flex-col gap-1 border-b border-muted/10 pb-6">
                        <div className="flex items-center gap-2 text-muted mb-2">
                            <Link to={PATHS.ADMIN.PROJECT_LIST} className="hover:text-primary transition-colors">Projects</Link>
                            <ChevronRight className="size-3" />
                            <span>Create</span>
                        </div>
                        <h1 className="font-bold text-2xl tracking-tight">Create a Project</h1>
                        <p className="text-sm text-muted">Add a new real-world project to your portfolio with all technical details.</p>
                    </div>

                    <div className="w-full">
                        <ProjectForm />
                    </div>
                </div>
            </section>
        </main>
    );
}
