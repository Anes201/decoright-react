import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PATHS } from "@/routers/Paths";
import ZoomImage from "@/components/ui/ZoomImage";
import { AdminService } from "@/services/admin.service";
import { ICONS } from "@/icons";
import Spinner from "@/components/common/Spinner";
import toast from "react-hot-toast";
import { useConfirm } from "@/components/confirm";

export function ProjectCard({ project, onDelete }: { project: any, onDelete: (id: string) => void }) {
    return (
        <li className="relative">
            <Link to={PATHS.ADMIN.projectUpdate(project.id)} className="flex max-xs:flex-col gap-4 w-full p-4 border border-muted/10 bg-surface rounded-xl hover:border-primary/30 transition-all group">
                <div className="xs:min-w-[180px] xs:h-28 aspect-video overflow-hidden rounded-lg">
                    <ZoomImage src={project.thumbnail_url || project.main_image_url} alt="" className="object-cover h-full w-full" />
                </div>

                <div className="flex flex-col gap-2 w-full">
                    <div className="flex justify-between items-start">
                        <h4 className="font-semibold text-sm md:text-base text-foreground group-hover:text-primary transition-colors"> {project.title} </h4>
                        <span className={`text-3xs font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter ${project.visibility === 'PUBLIC' ? 'bg-green-500/10 text-green-500' :
                            project.visibility === 'AUTHENTICATED_ONLY' ? 'bg-blue-500/10 text-blue-500' :
                                'bg-red-500/10 text-red-500'
                            }`}>
                            {project.visibility?.replace('_', ' ')}
                        </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {project.service_types && <span className="text-2xs px-1.5 py-0.5 border border-muted/15 rounded-md text-muted">{project.service_types.display_name_en}</span>}
                        {project.space_types && <span className="text-2xs px-1.5 py-0.5 border border-muted/15 rounded-md text-muted">{project.space_types.display_name_en}</span>}
                        {project.location && <span className="text-2xs px-1.5 py-0.5 border border-muted/15 rounded-md text-muted">{project.location}</span>}
                    </div>

                    <div className="flex flex-wrap items-center mt-auto">
                        <span className="text-2xs text-muted/60">{new Date(project.created_at).toLocaleDateString()}</span>
                        {(project.width || project.height) && <span className="text-2xs text-muted/60 before:content-['•'] before:mx-2">{project.width || 0}m × {project.height || 0}m</span>}
                    </div>
                </div>
            </Link>

            <button
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onDelete(project.id);
                }}
                className="absolute top-4 right-4 p-2 text-muted hover:text-red-500 hover:bg-red-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all z-10"
                title="Delete Project"
            >
                <ICONS.trash className="size-4" />
            </button>
        </li>
    )
}

export function ProjectCardList() {
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const confirm = useConfirm();

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const data = await AdminService.getProjects();
                setProjects(data);
            } catch (error) {
                console.error("Failed to fetch projects:", error);
                toast.error("Failed to load projects.");
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    const handleDelete = async (id: string) => {
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
    };

    if (loading) {
        return <div className="flex justify-center p-20"><Spinner status={true} size="lg" /></div>;
    }

    if (projects.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-20 border-2 border-dashed border-muted/10 rounded-2xl bg-surface/50 text-center">
                <div className="p-4 bg-primary/10 rounded-full mb-4">
                    <ICONS.folder className="size-10 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-1">No Projects Found</h3>
                <p className="text-sm text-muted max-w-[300px] mb-6">
                    You haven't added any real-world projects yet.
                </p>
                <Link to={PATHS.ADMIN.PROJECT_CREATE} className="p-button">
                    <ICONS.plus className="size-4 mr-2" />
                    Create Your First Project
                </Link>
            </div>
        );
    }

    return (
        <ul className="flex flex-col gap-4 w-full">
            {projects.map((project) => (
                <ProjectCard key={project.id} project={project} onDelete={handleDelete} />
            ))}
        </ul>
    )
}
