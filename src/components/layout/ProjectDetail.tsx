import Spinner from "@components/common/Spinner";
import ZoomImage from "@components/ui/ZoomImage";
import { PATHS } from "@/routers/Paths";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState, type CSSProperties } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Zoom } from 'swiper/modules';
import { AdminService } from "@/services/admin.service";
import { ProjectService } from "@/services/project.service";
import { getLocalizedContent } from "@/utils/i18n";
import { useTimeAgo } from "@/hooks/useTimeAgo";
import { useTranslation } from "react-i18next";
import { MapPin, Heart, Eye, ArrowLeft } from "@/icons";
import useAuth from "@/hooks/useAuth";
import 'swiper/swiper.css';
import 'swiper/swiper-bundle.css';

function formatCount(n: number): string {
    if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
    return String(n)
}

export function ProjectDetail() {
    const { slug } = useParams<{ slug: string }>();
    const { i18n } = useTranslation();
    const lang = i18n.language;
    const { user } = useAuth();

    const [project, setProject] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [liked, setLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(0);
    const [likeLoading, setLikeLoading] = useState(false);

    const { t } = useTranslation()
    const created_ago = useTimeAgo(project?.created_at);

    useEffect(() => {
        async function fetchProject() {
            if (!slug) return;
            try {
                setLoading(true);
                const data = await AdminService.getProjects({ slug });
                if (data && data.length > 0) {
                    const p = data[0];
                    setProject(p);

                    const count = await ProjectService.getLikesCount(p.id)
                    setLikesCount(count)

                    if (user) {
                        const userLiked = await ProjectService.hasUserLiked(p.id, user.id)
                        setLiked(userLiked)
                    }

                    ProjectService.incrementViewCount(p.id)
                }
            } catch (err) {
                console.error("Failed to fetch project detail:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchProject();
        window.scrollTo(0, 0);
    }, [slug, user]);

    async function handleLikeToggle() {
        if (!user || !project || likeLoading) return
        setLikeLoading(true)
        const newLiked = !liked
        setLiked(newLiked)
        setLikesCount(prev => newLiked ? prev + 1 : Math.max(0, prev - 1))
        try {
            await ProjectService.toggleLike(project.id, user.id)
        } catch (err) {
            setLiked(!newLiked)
            setLikesCount(prev => newLiked ? Math.max(0, prev - 1) : prev + 1)
            console.error('Failed to toggle like:', err)
        } finally {
            setLikeLoading(false)
        }
    }

    if (loading) {
        return <div className="min-h-[50vh] flex items-center justify-center"><Spinner status={loading} size="lg"/></div>;
    }

    if (!project) {
        return <div className="min-h-[50vh] flex items-center justify-center text-muted">{t('projects:project_detail_empty')}</div>;
    }

    const imgs = project.project_images?.length > 0
        ? project.project_images.map((img: any) => ({ id: img.id, src: img.image_url, alt: project.title }))
        : (project.thumbnail_url ? [{ id: 'main', src: project.thumbnail_url, alt: project.title }] : []);

    const location = getLocalizedContent(project, 'location', lang);
    const dimensions = project.width && project.height ? `${project.width}m × ${project.height}m` : null;
    const description = getLocalizedContent(project, 'description', lang);
    const serviceType = getLocalizedContent(project.service_types, 'display_name', lang);
    const spaceType = getLocalizedContent(project.space_types, 'display_name', lang);

    return (
        <div className="flex flex-col gap-6 max-w-4xl mx-auto">
            <Link
                to={PATHS.PROJECT_LIST}
                className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-primary transition-colors w-fit"
            >
                <ArrowLeft className="size-4" />
                <span>{t('nav.projects')}</span>
            </Link>

            <Swiper
                loop={imgs.length > 1}
                navigation={imgs.length > 1}
                zoom={true}
                modules={[Pagination, Navigation, Zoom]}
                pagination={{ dynamicBullets: true, clickable: true }}
                className="w-full rounded-2xl aspect-video overflow-hidden bg-muted/5"
                style={{ '--swiper-navigation-size': '30px', '--swiper-navigation-color': 'var(--acme-primary)', '--swiper-pagination-color': 'var(--acme-primary)' } as CSSProperties}
            >
                {imgs.map((img: any) => (
                    <SwiperSlide key={img.id}>
                        <ZoomImage src={img.src} alt={img.alt} />
                    </SwiperSlide>
                ))}
            </Swiper>

            <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <h1 className="font-semibold text-xl md:text-2xl text-heading leading-tight">
                        {getLocalizedContent(project, 'title', lang)}
                    </h1>
                    <div className="flex flex-wrap gap-2">
                        {serviceType && (
                            <span className="text-2xs px-3 py-1 rounded-full bg-primary/8 text-primary border border-primary/15">
                                {serviceType}
                            </span>
                        )}
                        {spaceType && (
                            <span className="text-2xs px-3 py-1 rounded-full bg-muted/8 text-muted border border-muted/15">
                                {spaceType}
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted">
                    {location && (
                        <span className="inline-flex items-center gap-1.5">
                            <MapPin className="size-4" />
                            <span>{location}</span>
                        </span>
                    )}
                    {dimensions && (
                        <span className="inline-flex items-center gap-1.5 before:content-['·'] before:me-4">
                            <span>{dimensions}</span>
                        </span>
                    )}
                    <span className="inline-flex items-center gap-1.5 before:content-['·'] before:me-4">
                        <Eye className="size-4" />
                        <span>{formatCount(project.view_count ?? 0)}</span>
                    </span>
                    <button
                        onClick={handleLikeToggle}
                        disabled={!user || likeLoading}
                        title={!user ? t('auth:login_to_like') : undefined}
                        className={`inline-flex items-center gap-1.5 before:content-['·'] before:me-4 transition-colors
                            ${liked ? 'text-primary' : 'text-muted hover:text-primary'}
                            ${(!user || likeLoading) ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
                        `}
                    >
                        <Heart className={`size-4 ${liked ? 'fill-primary' : ''}`} />
                        <span>{formatCount(likesCount)}</span>
                    </button>
                    <span className="inline-flex items-center gap-1.5 before:content-['·'] before:me-4 text-muted/70">
                        <span>{created_ago}</span>
                    </span>
                </div>

                {description && (
                    <p className="text-sm md:text-[15px] text-body leading-relaxed pt-2">
                        {description}
                    </p>
                )}

                <div className="pt-4">
                    <Link
                        to={PATHS.CLIENT.REQUEST_SERVICE}
                        className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-white font-semibold text-sm rounded-full hover:bg-primary/90 transition-colors"
                    >
                        {t('nav.request_service')}
                    </Link>
                </div>
            </div>
        </div>
    );
}
