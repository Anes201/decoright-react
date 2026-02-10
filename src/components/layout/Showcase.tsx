import { useEffect, useState } from "react";
import { AdminService } from "@/services/admin.service";
import { Link } from "react-router-dom";
import { PATHS } from "@/routers/Paths";
import { ICONS } from "@/icons";
import Spinner from "@components/common/Spinner";
import { useTranslation } from "react-i18next";
import useAuth from "@/hooks/useAuth";

export function ShowcaseCard({ project }: { project: any }) {
    const { i18n } = useTranslation();
    const [hasError, setHasError] = useState(false);

    const getServiceLabel = () => {
        if (!project.service_types) return null;
        const lang = i18n.language.split('-')[0];
        if (lang === 'ar') return project.service_types.display_name_ar || project.service_types.display_name_en;
        if (lang === 'fr') return project.service_types.display_name_fr || project.service_types.display_name_en;
        return project.service_types.display_name_en;
    };

    const serviceLabel = getServiceLabel();

    return (
        <li className="group">
            <Link to={PATHS.projectDetail(project.slug || project.id)} className="flex flex-col gap-3">
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-muted/5 border border-muted/10">
                    {!hasError && project.thumbnail_url ? (
                        <img
                            src={project.thumbnail_url}
                            alt={project.title}
                            className="object-cover h-full w-full transition-all duration-700 group-hover:scale-110 group-hover:brightness-90"
                            onError={() => setHasError(true)}
                        />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-2 opacity-20">
                            {ICONS.photo({ className: 'size-12' })}
                            <span className="text-[10px] uppercase tracking-widest font-medium"> No Image </span>
                        </div>
                    )}

                    {/* Overlay Label */}
                    {serviceLabel && (
                        <div className="absolute top-3 left-3 px-3 py-1 bg-background/60 backdrop-blur-md rounded-full border border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-y-2 group-hover:translate-y-0">
                            <span className="text-[10px] font-medium text-foreground tracking-wide uppercase"> {serviceLabel} </span>
                        </div>
                    )}
                </div>

                <div className="px-1 flex flex-col gap-1">
                    <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-sm md:text-base text-heading group-hover:text-primary transition-colors duration-300 flex-1 line-clamp-1">
                            {project.title}
                        </h3>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 pl-2">
                            {ICONS.arrowLongRight({ className: 'size-5 text-primary' })}
                        </div>
                    </div>
                    {project.location && (
                        <p className="text-[11px] text-muted/60 flex items-center gap-1 font-medium italic">
                            {ICONS.mapPin({ className: 'size-3' })} {project.location}
                        </p>
                    )}
                </div>
            </Link>
        </li>
    )
}

export function ShowcaseCardList() {
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { isAdmin } = useAuth();

    useEffect(() => {
        async function fetchProjects() {
            try {
                const visibility: any[] = isAdmin
                    ? ['PUBLIC', 'AUTHENTICATED_ONLY', 'HIDDEN']
                    : ['PUBLIC'];

                const data = await AdminService.getProjects({ visibility, limit: 6 });
                setProjects(data || []);
            } catch (err) {
                console.error("Failed to fetch showcase projects:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchProjects();
    }, [isAdmin]);

    if (loading) {
        return (
            <div className="w-full flex flex-col items-center justify-center p-20 gap-4">
                <Spinner status={true} size="lg" />
                <p className="text-xs text-muted animate-pulse"> Curating showcase... </p>
            </div>
        );
    }

    if (projects.length === 0) {
        return (
            <div className="w-full py-16 px-4 border border-dashed border-muted/20 rounded-3xl flex flex-col items-center justify-center text-center gap-4 bg-surface/5">
                <div className="p-4 bg-muted/5 rounded-full">
                    {ICONS.folder({ className: 'size-8 text-muted/40' })}
                </div>
                <div className="space-y-1">
                    <h4 className="font-medium text-muted">No projects available in the showcase yet.</h4>
                    <p className="text-2xs text-muted/60 max-w-xs mx-auto">
                        Head over to the admin panel to publish some of your amazing works to the public portfolio.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-x-8 md:gap-y-12 w-full">
            {projects.map((project) => (
                <ShowcaseCard key={project.id} project={project} />
            ))}
        </ul>
    )
}
