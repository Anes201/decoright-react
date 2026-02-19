
import { ICONS } from "@/icons";
import ZoomImage from "../ui/ZoomImage";
import { useState, useEffect } from "react";
import { AdminService } from "@/services/admin.service";
import { Link } from "react-router-dom";
import { PATHS } from "@/routers/Paths";
import { useTranslation } from "react-i18next";
import Spinner from "../common/Spinner";
import useAuth from "@/hooks/useAuth";


export function ShowcaseCard({ project }: { project: any }) {
    const [imgLoaded, setImgLoaded] = useState(false);
    const { i18n } = useTranslation();
    const langSuffix = i18n.language.startsWith('ar') ? '_ar' : i18n.language.startsWith('fr') ? '_fr' : '_en';

    const handleImageLoad = () => setImgLoaded(true);

    const handleImageError = () => {
        console.error('Image failed to load');
    };

    const coverImage = project.project_images?.find((img: any) => img.is_cover)?.image_url || project.project_images?.[0]?.image_url || '';

    return (
        <li className="group/item">
            <Link to={PATHS.projectDetail(project.slug)}>
                <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-muted/5 border border-muted/10">
                    {!imgLoaded &&
                        <div className="w-full h-full flex flex-col items-center justify-center gap-2 animate-[pulse_2s_ease-in-out_infinite]">
                            <ICONS.photo className="size-12 opacity-20" />
                        </div>
                    }

                    <ZoomImage
                        src={coverImage}
                        alt={project.title}
                        className={`${!imgLoaded && 'hidden'} h-full w-full object-cover transition-all duration-600 group-hover/item:scale-104`}
                        onLoad={handleImageLoad}
                        onError={handleImageError}
                    />
                </div>

                <div className="px-1 mt-2">
                    <h3 className="font-semibold text-sm sm:text-base text-heading group-hover/item:text-primary transition-colors duration-300 line-clamp-1">
                        {project.title}
                    </h3>
                    <p className="text-xs text-muted/80 line-clamp-1">
                        {project.service_types?.[`display_name${langSuffix}`] || project.service_types?.display_name_en}
                    </p>
                </div>
            </Link>
        </li>
    )
}


export function ShowcaseCardList() {
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { t } = useTranslation();
    const { isAdmin, user } = useAuth();

    useEffect(() => {
        async function fetchShowcase() {
            try {
                // Determine visibility filter based on user role
                const visibility: any[] = ['PUBLIC'];
                if (user) visibility.push('AUTHENTICATED_ONLY');
                if (isAdmin) visibility.push('HIDDEN');

                // Fetch projects with determined visibility, limit to 6 for the homepage
                const data = await AdminService.getProjects({
                    visibility,
                    limit: 6
                });
                setProjects(data);
            } catch (error) {
                console.error("Failed to fetch showcase projects:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchShowcase();
    }, [isAdmin, user]);

    if (loading) {
        return (
            <div className="w-full py-20 flex justify-center">
                <Spinner size="lg" />
            </div>
        );
    }

    if (projects.length === 0) {
        return (
            <div className="w-full py-16 flex flex-col items-center justify-center gap-4 text-center border border-dashed border-muted/20 rounded-2xl bg-muted/5">
                <div className="p-4 bg-muted/5 rounded-full">
                    <ICONS.photo className="size-8 text-muted/40" />
                </div>
                <div className="space-y-1">
                    <h4 className="font-medium text-muted">{t('landing.sections.projects.no_projects')}</h4>
                    <p className="text-xs text-muted/60 max-w-xs mx-auto">
                        {t('landing.sections.projects.no_projects_desc')}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <ul className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-6 w-full">
            {projects.map((project) => (
                <ShowcaseCard key={project.id} project={project} />
            ))}
        </ul>
    )
}
