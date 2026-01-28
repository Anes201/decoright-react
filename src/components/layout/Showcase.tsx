import { useEffect, useState } from "react";
import { AdminService } from "@/services/admin.service";
import { Link } from "react-router-dom";
import { PATHS } from "@/routers/Paths";
import { ICONS } from "@/icons";
import Spinner from "../ui/Spinner";

export function ShowcaseCard({ project, index }: any) {
    const [hasError, setHasError] = useState(false);

    return (
        <li key={index} >
            <Link to={PATHS.projectDetail(project.slug || project.id)} className="block group">
                <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-surface-hover/50 border border-muted/10 flex items-center justify-center">
                    {!hasError && project.thumbnail_url ? (
                        <img
                            src={project.thumbnail_url}
                            alt={project.title}
                            className="object-cover h-full w-full transition-transform duration-500 group-hover:scale-105"
                            onError={() => setHasError(true)}
                        />
                    ) : (
                        <div className="text-muted/30">
                            {ICONS.photo({ className: 'size-12' })}
                        </div>
                    )}
                </div>

                <div className="px-1 mt-3">
                    <h3 className="font-medium text-sm text-heading group-hover:text-primary transition-colors"> {project.title} </h3>
                </div>
            </Link>
        </li>
    )
}

export function ShowcaseCardList() {
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProjects() {
            try {
                const data = await AdminService.getProjects({ visibility: ['PUBLIC'], limit: 6 });
                setProjects(data || []);
            } catch (err) {
                console.error("Failed to fetch showcase projects:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchProjects();
    }, []);

    if (loading) {
        return <div className="flex justify-center p-8"><Spinner className="w-8 h-8" /></div>;
    }

    if (projects.length === 0) {
        return <div className="text-center p-8 text-muted">No showcase projects available yet.</div>;
    }

    return (
        <ul className="grid grid-cols-1 sm:grid-cols-[repeat(auto-fit,minmax(18rem,1fr))] gap-8 md:gap-6 w-full">
            {projects.map((project, index) => (
                <ShowcaseCard key={project.id} project={project} index={index} />
            ))}
        </ul>
    )
}
