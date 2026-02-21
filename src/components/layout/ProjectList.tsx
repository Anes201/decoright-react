import useAuth from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom"
import { Eye, Heart, MapPin } from "@/icons";
import { PATHS } from "@/routers/Paths";
import { AdminService } from "@/services/admin.service";
import Spinner from "@components/common/Spinner";
import { getLocalizedContent } from "@/utils/i18n";
import { useTranslation } from "react-i18next";

function formatCount(n: number): string {
    if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
    return String(n)
}

export function ProjectCard({ project, lang }: { project: any, lang: string }) {
    const serviceLabel = getLocalizedContent(project.service_types, 'display_name', lang)
    // likes is returned as [{count: number}] from the Supabase aggregate select
    const likesCount: number = Array.isArray(project.likes) && project.likes.length > 0
        ? (project.likes[0].count ?? 0)
        : 0

    return (
        <li>
            <Link
                to={PATHS.projectDetail(project.slug || project.id)}
                className="group flex flex-col gap-3"
            >
                {/* Thumbnail */}
                <div className="relative w-full aspect-[4/3] overflow-hidden rounded-2xl bg-muted/8">
                    {project.thumbnail_url ? (
                        <img
                            src={project.thumbnail_url}
                            alt={getLocalizedContent(project, 'title', lang)}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-muted/30">
                            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Z" />
                            </svg>
                        </div>
                    )}

                    {/* Service type badge */}
                    {serviceLabel && (
                        <span className="absolute top-3 start-3 text-3xs font-medium px-2 py-0.5 rounded-full bg-black/40 text-white/90 backdrop-blur-sm">
                            {serviceLabel}
                        </span>
                    )}
                </div>

                {/* Info */}
                <div className="flex flex-col gap-1 px-0.5">
                    <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-sm text-heading leading-snug line-clamp-1 group-hover:text-primary transition-colors">
                            {getLocalizedContent(project, 'title', lang)}
                        </h3>
                        {/* Metrics */}
                        <div className="flex items-center gap-2.5 shrink-0 pt-px">
                            <span className="flex items-center gap-1 text-muted">
                                <Eye className="size-3.5" />
                                <span className="text-3xs font-medium">{formatCount(project.view_count ?? 0)}</span>
                            </span>
                            <span className="flex items-center gap-1 text-muted">
                                <Heart className="size-3.5" />
                                <span className="text-3xs font-medium">{formatCount(likesCount)}</span>
                            </span>
                        </div>
                    </div>

                    {/* Location */}
                    {project.location && (
                        <div className="flex items-center gap-1 text-muted">
                            <MapPin className="size-3" />
                            <span className="text-3xs truncate">{getLocalizedContent(project, 'location', lang)}</span>
                        </div>
                    )}
                </div>
            </Link>
        </li>
    )
}

export function ProjectCardList() {
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { user, isAdmin } = useAuth();
    const { i18n, t } = useTranslation();

    useEffect(() => {
        async function fetchProjects() {
            try {
                const visibility: any[] = ['PUBLIC'];
                if (user) visibility.push('AUTHENTICATED_ONLY');
                if (isAdmin) visibility.push('HIDDEN');

                const data = await AdminService.getProjects({ visibility });
                setProjects(data || []);
            } catch (err) {
                console.error("Failed to fetch projects:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchProjects();
    }, [user, isAdmin]);

    if (loading) {
        return <div className="flex justify-center p-8"><Spinner className="w-8 h-8" /></div>;
    }

    if (projects.length === 0) {
        return <div className="text-center p-8 text-muted">{t('projects.project_list_empty')}</div>;
    }

    return (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10 w-full">
            {projects.map((project) => (
                <ProjectCard key={project.id} project={project} lang={i18n.language} />
            ))}
        </ul>
    )
}
