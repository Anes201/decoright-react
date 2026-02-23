
import Spinner from "@/components/common/Spinner";
import ProjectCardList, { type ProjectAction }  from "@/components/layout/admin/projects/ProjectList";
import toast from "react-hot-toast";
import { useConfirm } from "@/components/confirm";
import { PATHS } from "@/routers/Paths";
import { AdminService } from "@/services/admin.service";
import { ServiceTypesService, type ServiceType } from "@/services/service-types.service";
import { SpaceTypesService, type SpaceType } from "@/services/space-types.service";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Folder, Plus } from "@/icons";

export default function ProjectList () {

    const [projects, setProjects] = useState<any[]>([]);
    const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
    const [spaceTypes, setSpaceTypes] = useState<SpaceType[]>([]);
    const [loading, setLoading] = useState(true);

    const { t } = useTranslation(['common'])

    const visibilityStages = [
        {"PUBLIC": t('common:public')},
        {"AUTHENTICATED_ONLY": t('common:clients_only')},
        {"HIDDEN": t('common:hidden')}
    ]

    const confirm = useConfirm();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const projectData = await AdminService.getProjects();
                setProjects(projectData);

                const serviceData = await ServiceTypesService.getAll();
                setServiceTypes(serviceData);

                const spaceData = await SpaceTypesService.getAll();
                setSpaceTypes(spaceData);

            } catch (error) {
                console.error("Failed to fetch projects:", error);
                toast.error("Failed to load projects.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleAction = async (id: string, action:ProjectAction) => {

        if (action === "delete") {

            const isConfirmed = await confirm({
                title: "Delete Project",
                description: "Are you sure you want to delete this project? All associated data and images will be removed.",
                confirmText: "Delete",
                variant: "destructive"
            });

            if (!isConfirmed) return;

            try {
                await AdminService.deleteProject(id);
                toast.success("Project deleted successfully.");
                setProjects(projects.filter(p => p.id !== id));
            } catch (error) {
                console.error("Failed to delete project:", error);
                toast.error("Failed to delete project.");
            }

            return
        }
    };

    if (loading) {
        return <div className="flex justify-center h-full w-full"><Spinner status={loading}/></div>;
    }

    if (projects.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-20 border-2 border-dashed border-muted/10 rounded-2xl bg-surface/50 text-center">
                <div className="p-4 bg-primary/10 rounded-full mb-4">
                    <Folder className="size-10 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-1">No Projects Found</h3>
                <p className="text-sm text-muted max-w-100 mb-6">
                    You haven't added any real-world projects yet.
                </p>
                <Link to={PATHS.ADMIN.PROJECT_CREATE} className="p-button">
                    <Plus className="size-4 mr-2" />
                    Create Your First Project
                </Link>
            </div>
        );
    }
    return (

        <main>
            <section className="relative flex flex-col w-full mb-20">
                <div className="relative flex flex-col gap-8 h-full">
                    <h1 className="font-semibold text-lg md:text-2xl w-fit"> Project List </h1>
                    <div className="w-full">
                        <ProjectCardList
                            projects={projects}
                            serviceTypes={serviceTypes}
                            serviceSpaceTypes={spaceTypes}
                            visibilityStags={visibilityStages}
                            onAction={handleAction}
                        />
                    </div>
                </div>
            </section>
        </main>
    )
}