import useAuth from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom"
import { Eye } from "@/icons";
import { PATHS } from "@/routers/Paths";
import { AdminService } from "@/services/admin.service";
import Spinner from "@components/common/Spinner";
import { getLocalizedContent } from "@/utils/i18n";
import { useTranslation } from "react-i18next";
import { useTimeAgo } from "@/hooks/useTimeAgo";

export function ProjectCard({ project, index, lang }: { project: any, index: number, lang: string }) {
    const created_ago = useTimeAgo(project?.created_at)
    return (
        <li key={index} >
            <Link to={PATHS.projectDetail(project.slug || project.id)} className="flex flex-col h-fit gap-1">
                <div className="w-full aspect-video mb-2 overflow-hidden">
                    <img src={project.thumbnail_url} alt={project.title} className="object-cover h-full w-full rounded-xl" />
                </div>
                <div className="h-fit">
                    <div className="flex items-center justify-between gap-2">
                        <h3 className="font-medium text-xs px-0.5"> {getLocalizedContent(project, 'title', lang)} </h3>
                        <div className="flex h-fit gap-1 text-muted">
                            <div className="flex items-center gap-0.5 pt-0.5">
                                <Eye className="size-4" />
                                <span className="text-2xs"> 0 </span>
                            </div>
                        </div>
                    </div>
                    <span className="leading-0 text-2xs text-muted/75">
                        { created_ago }
                    </span>
                </div>
            </Link>
        </li>
    )
}

export function ProjectCardList() {
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { user, isAdmin } = useAuth();
    const { i18n } = useTranslation();

    const { t } = useTranslation()

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
    }, [user]);

    if (loading) {
        return <div className="flex justify-center p-8"><Spinner className="w-8 h-8" /></div>;
    }

    if (projects.length === 0) {
        return <div className="text-center p-8 text-muted"> { t('projects.project_list_empty') } </div>;
    }

    return (
        <ul className="grid grid-cols-1 sm:grid-cols-[repeat(auto-fit,minmax(18rem,1fr))] gap-8 md:gap-6 w-full">
            {projects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} lang={i18n.language} />
            ))}
        </ul>
    )
}
