import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import ProjectForm from "@/components/layout/admin/projects/ProjectForm";
import { AdminService } from "@/services/admin.service";
import Spinner from "@/components/common/Spinner";
import toast from "react-hot-toast";
import { PATHS } from "@/routers/Paths";
import { ICONS } from "@/icons";
import { useConfirm } from "@/components/confirm";


function DeleteButton({ id }: { id: string }) {
    const confirm = useConfirm();
    const navigate = useNavigate();
    const [deleting, setDeleting] = useState(false);

    const handleDelete = async () => {
        const isConfirmed = await confirm({
            title: "Delete Project",
            description: "Are you sure you want to delete this project? This action cannot be undone.",
            confirmText: "Delete Project",
            variant: "destructive"
        });

        if (!isConfirmed) return;

        setDeleting(true);
        try {
            await AdminService.deleteProject(id);
            toast.success("Project deleted successfully");
            navigate(PATHS.ADMIN.PROJECT_LIST);
        } catch (error) {
            console.error("Delete failed:", error);
            toast.error("Failed to delete project");
        } finally {
            setDeleting(false);
        }
    };

    return (
        <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-red-200"
        >
            {deleting ? <Spinner status={true} size="sm" /> : <ICONS.trash className="size-4" />}
            Delete
        </button>
    );
}

export default function ProjectUpdatePage() {
    const { id } = useParams();
    const [project, setProject] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProject = async () => {
            if (!id) return;
            try {
                // Fetch projects and find by id
                const projects = await AdminService.getProjects();
                const found = projects?.find((p: any) => p.id === id);
                setProject(found);
            } catch (error) {
                console.error("Failed to fetch project:", error);
                toast.error("Failed to load project details.");
            } finally {
                setLoading(false);
            }
        };

        fetchProject();
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Spinner status={true} size="lg" />
            </div>
        );
    }

    if (!project) {
        return (
            <div className="flex flex-col items-center justify-center p-20 text-center">
                <h3 className="font-semibold text-lg">Project Not Found</h3>
                <p className="text-sm text-muted">The project you are looking for does not exist.</p>
                <Link to={PATHS.ADMIN.PROJECT_LIST} className="mt-4 p-button">Back to Projects</Link>
            </div>
        );
    }

    return (
        <main className="min-h-screen">
            <section className="relative flex flex-col w-full px-4 md:px-8 pt-6 pb-20">
                <div className="flex flex-col gap-8 w-full max-w-5xl mx-auto">
                    <div className="flex flex-col gap-1 border-b border-muted/10 pb-6">
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2 text-muted mb-2">
                                    <Link to={PATHS.ADMIN.PROJECT_LIST} className="hover:text-primary transition-colors">Projects</Link>
                                    <ICONS.chevronRight className="size-3" />
                                    <span>Edit</span>
                                </div>
                                <h1 className="font-bold text-2xl tracking-tight">Edit Project</h1>
                                <p className="text-sm text-muted">Update technical details and imagery for this project.</p>
                            </div>

                            <DeleteButton id={project.id} />
                        </div>
                    </div>

                    <div className="w-full">
                        <ProjectForm project={project} />
                    </div>
                </div>
            </section>
        </main>
    );
}
