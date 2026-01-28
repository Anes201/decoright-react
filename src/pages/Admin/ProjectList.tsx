import ProjectTable from "@/components/layout/admin/ProjectTable";
import { ICONS } from "@/icons";
import { useState } from "react";
import ProjectDrawer from "@/components/layout/admin/ProjectDrawer";

export default function AdminProjectList() {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState<any>(null);
    const [refreshKey, setRefreshKey] = useState(0);

    const handleCreate = () => {
        setSelectedProject(null);
        setIsDrawerOpen(true);
    };

    const handleEdit = (project: any) => {
        setSelectedProject(project);
        setIsDrawerOpen(true);
    };

    const handleSuccess = () => {
        setIsDrawerOpen(false);
        setRefreshKey(prev => prev + 1);
    };

    return (
        <main className="w-full">
            <section className="min-h-hero relative flex flex-col w-full mb-20">
                <div className="relative flex flex-col gap-8 h-full md:p-6">
                    <div className="max-md:hidden absolute top-0 left-0 w-full h-full border border-muted/15 rounded-3xl bg-surface -z-10 mask-b-to-transparent mask-b-to-100%"></div>

                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h1 className="font-semibold text-lg md:text-2xl text-heading"> Showcase Projects </h1>
                            <p className="text-xs text-muted"> Manage projects displayed in the public showcase and gallery. </p>
                        </div>
                        <button
                            onClick={handleCreate}
                            className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 hover:bg-primary/90 transition-colors shadow-sm"
                        >
                            <ICONS.plus className="size-4" /> Create New Project
                        </button>
                    </div>

                    <div className="w-full">
                        <ProjectTable
                            onEdit={handleEdit}
                            refreshKey={refreshKey}
                        />
                    </div>
                </div>
            </section>

            <ProjectDrawer
                project={selectedProject}
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                onSuccess={handleSuccess}
            />
        </main>
    );
}
