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
import { MapPin, Layout, Heart, Eye, ChevronUp, ChevronDown } from "@/icons";
import useAuth from "@/hooks/useAuth";
import 'swiper/swiper.css';
import 'swiper/swiper-bundle.css';

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
    const [descOpen, setDescOpen] = useState(false);

    const { t } = useTranslation()
    const created_ago = useTimeAgo(project?.created_at);

    // Fetch project + likes state
    useEffect(() => {
        async function fetchProject() {
            if (!slug) return;
            try {
                setLoading(true);
                const data = await AdminService.getProjects({ slug });
                if (data && data.length > 0) {
                    const p = data[0];
                    setProject(p);

                    // Get likes count
                    const count = await ProjectService.getLikesCount(p.id)
                    setLikesCount(count)

                    // Check if current user liked it
                    if (user) {
                        const userLiked = await ProjectService.hasUserLiked(p.id, user.id)
                        setLiked(userLiked)
                    }

                    // Increment view count (fire-and-forget)
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
        // Optimistic update
        const newLiked = !liked
        setLiked(newLiked)
        setLikesCount(prev => newLiked ? prev + 1 : Math.max(0, prev - 1))
        try {
            await ProjectService.toggleLike(project.id, user.id)
        } catch (err) {
            // Revert on failure
            setLiked(!newLiked)
            setLikesCount(prev => newLiked ? Math.max(0, prev - 1) : prev + 1)
            console.error('Failed to toggle like:', err)
        } finally {
            setLikeLoading(false)
        }
    }

    if (loading) {
        return <div className="min-h-hero flex items-center justify-center"><Spinner status={loading} size="lg"/></div>;
    }

    if (!project) {
        return <div className="min-h-hero flex items-center justify-center text-muted"> { t('projects:project_detail_empty') } </div>;
    }

    const imgs = project.project_images?.length > 0
        ? project.project_images.map((img: any) => ({ id: img.id, src: img.image_url, alt: project.title }))
        : (project.thumbnail_url ? [{ id: 'main', src: project.thumbnail_url, alt: project.title }] : []);

    return (
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 mb-18 w-full">

            {/* Main Project Content */}
            <div className="flex flex-col w-full h-fit">
                <Swiper
                    loop={imgs.length > 1}
                    navigation={imgs.length > 1}
                    zoom={true}
                    modules={[Pagination, Navigation, Zoom]}
                    pagination={{ dynamicBullets: true, clickable: true }}
                    className="w-full rounded-xl aspect-video overflow-hidden bg-muted/5"
                    style={{ '--swiper-navigation-size': '30px', '--swiper-navigation-color': 'var(--acme-primary)', '--swiper-pagination-color': 'var(--acme-primary)' } as CSSProperties}
                >
                    {imgs.map((img: any) => (
                        <SwiperSlide key={img.id}>
                            <ZoomImage src={img.src} alt={img.alt} />
                        </SwiperSlide>
                    ))}
                </Swiper>

                <div className="flex flex-col gap-4 w-full mt-6">
                    <div className="flex max-lg:flex-col lg:justify-between gap-2">
                        <h1 className="font-semibold text-lg md:text-xl text-heading leading-tight line-clamp-2">{getLocalizedContent(project, 'title', lang)}</h1>
                        <div className="flex flex-wrap gap-2 min-w-max">
                            <span className="text-2xs md:text-xs px-3 py-1 h-fit rounded-full bg-muted/5 text-muted border border-muted/15">
                                {getLocalizedContent(project.service_types, 'display_name', lang)}
                            </span>
                            <span className="text-2xs md:text-xs px-3 py-1 h-fit rounded-full bg-muted/5 text-muted border border-muted/15">
                                {getLocalizedContent(project.space_types, 'display_name', lang)}
                            </span>
                        </div>
                    </div>

                    {/* Location and Area Info */}
                    <div className="flex items-center gap-6 py-2 px-1 border-b border-muted/10">
                        <div className="flex items-center gap-2 text-muted">
                            <MapPin className="size-4"/>
                            <span className="text-xs font-medium">{getLocalizedContent(project, 'location', lang) || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted">
                            <span className="text-xs font-medium">{project.width && project.height ? `${project.width}m × ${project.height}m` : 'N/A'}</span>
                        </div>
                    </div>

                    <div className="flex flex-wrap w-full gap-4 items-center">
                        <Link to={PATHS.CLIENT.REQUEST_SERVICE} className="font-semibold text-xs text-center text-white min-w-max px-3 py-2 bg-primary rounded-full"
                        > { t('nav:service_request_similar_project') } </Link>

                        {/* Like button — disabled for guests */}
                        <button
                            onClick={handleLikeToggle}
                            disabled={!user || likeLoading}
                            title={!user ? t('auth:login_to_like') : undefined}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-colors
                                ${liked
                                    ? 'bg-primary/8 border-primary/20 hover:bg-primary/12'
                                    : 'bg-muted/5 border-muted/15 hover:bg-muted/10'
                                }
                                ${(!user || likeLoading) ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
                            `}
                        >
                            <Heart className={`size-4.5 transition-colors ${liked ? 'fill-primary text-primary' : 'text-muted/75'}`} />
                            <span className={`font-medium text-sm transition-colors ${liked ? 'text-primary' : 'text-muted/75'}`}>
                                {likesCount}
                            </span>
                        </button>
                    </div>

                    <div className="flex flex-col gap-4 p-4 bg-muted/5 border border-muted/15 rounded-2xl">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-0">
                                <div className="flex items-center gap-1 text-muted/75 after:content-['•'] after:mx-2 last:after:content-none">
                                    <Eye className="size-3.5" />
                                    <span className="font-medium text-2xs md:text-xs">
                                        {t('common.views_compact', { value: project.view_count ?? 0, format: 'compact' })}
                                    </span>
                                </div>
                                <p className="font-medium text-2xs md:text-xs text-muted/75 after:content-['•'] after:mx-2 last:after:content-none">
                                    { created_ago }
                                </p>
                            </div>
                            <button
                                className="font-medium text-xs text-primary cursor-pointer"
                                onClick={() => setDescOpen(!descOpen)}
                            >
                                {descOpen ? <ChevronUp /> : <ChevronDown />}
                            </button>
                        </div>
                        <div className="flex flex-wrap items-center gap-6">
                            {project.location &&
                                <div className="flex items-center gap-2 text-muted">
                                    <div className="flex gap-1">
                                        <MapPin className="size-4" />
                                        <h5 className="text-xs text-muted"> { t('common.location') } </h5>
                                    </div>
                                    <span className="text-xs font-medium"> {getLocalizedContent(project, 'location', lang) || 'N/A'} </span>
                                </div>
                            }

                            {project.area_sqm &&
                                <div className="flex items-center gap-2 text-muted">
                                    <div className="flex gap-1">
                                        <Layout className="size-4" />
                                        <h5 className="text-xs text-muted"> { t('common.floor_area') } </h5>
                                    </div>
                                    <span className="text-xs font-medium"> {project.area_sqm ? `${project.area_sqm} m²` : 'N/A'} </span>
                                </div>
                            }
                        </div>
                        <div onClick={() => setDescOpen(!descOpen)}>
                            <p className={`text-xs text-body leading-relaxed ${!descOpen && 'line-clamp-2'}`}>
                                {getLocalizedContent(project, 'description', lang)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
