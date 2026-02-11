
import { ICONS } from "@/icons"
import { Link, useParams } from "react-router-dom";
import { useEffect, useState, type CSSProperties } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper.css';
import 'swiper/swiper-bundle.css';
import { Navigation, Pagination, Zoom } from 'swiper/modules';
import ZoomImage from "@components/ui/ZoomImage";
import { AdminService } from "@/services/admin.service";
import Spinner from "@components/common/Spinner";
import { PATHS } from "@/routers/Paths";
import { useTranslation } from "react-i18next";
import i18n from "@/utils/i18n";
import type { ServiceType } from "@/services/service-types.service";
import type { SpaceType } from "@/services/space-types.service";

// export function ProjectCardItem({ project, index }: { project: any, index: number }) {
//     return (
//         <li key={index}>
//             <Link to={PATHS.projectDetail(project.slug || project.id)} className="flex max-md:flex-col gap-1 h-full">
//                 <div className="w-fit h-30 aspect-video rounded-lg overflow-hidden shrink-0">
//                     <img src={project.thumbnail_url} alt={project.title} className="w-full h-full object-cover" />
//                 </div>
//                 <div className="flex flex-col gap-1 w-full h-full overflow-hidden">
//                     <h3 className="font-medium text-xs md:text-2xs h-full text-ellipsis-3line"> {project.title} </h3>
//                     <div className="flex md:flex-col">
//                         <p className="font-medium text-2xs md:text-3xs text-muted/75"> View Project </p>
//                     </div>
//                 </div>
//             </Link>
//         </li>
//     )
// }

// export function ProjectSimilarList() {
//     const [projects, setProjects] = useState<any[]>([]);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         async function fetchSimilar() {
//             try {
//                 const data = await AdminService.getProjects({ visibility: ['PUBLIC'], limit: 5 });
//                 setProjects(data || []);
//             } catch (err) {
//                 console.error("Failed to fetch similar projects:", err);
//             } finally {
//                 setLoading(false);
//             }
//         }
//         fetchSimilar();
//     }, []);

//     if (loading) return <div className="p-4 flex justify-center"><Spinner className="w-6 h-6" /></div>;

//     return (
//         <ul className="space-y-6 md:space-y-2">
//             {projects.map((project, index) => (
//                 <ProjectCardItem key={project.id} project={project} index={index} />
//             ))}
//         </ul>
//     )
// }

export function ProjectDetail() {
    const { slug } = useParams<{ slug: string }>();
    const [project, setProject] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [liked, setLiked] = useState(false);
    const [descOpen, setDescOpen] = useState(false);

    const { t } = useTranslation(['pages', 'nav', 'common'])

    useEffect(() => {
        async function fetchProject() {
            if (!slug) return;
            try {
                setLoading(true);
                const data = await AdminService.getProjects({ slug });
                if (data && data.length > 0) {
                    setProject(data[0]);
                }
            } catch (err) {
                console.error("Failed to fetch project detail:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchProject();
        window.scrollTo(0, 0);
    }, [slug]);

    if (loading) {
        return <div className="min-h-hero flex items-center justify-center"><Spinner status={loading} size="lg"/></div>;
    }

    if (!project) {
        return <div className="min-h-hero flex items-center justify-center text-muted"> { t('nav:project_detail_empty') } </div>;
    }

    const imgs = project.project_images?.length > 0
        ? project.project_images.map((img: any) => ({ id: img.id, src: img.image_url, alt: project.title }))
        : (project.thumbnail_url ? [{ id: 'main', src: project.thumbnail_url, alt: project.title }] : []);

    const getLocalizedLabel = (data: ServiceType | SpaceType) => {
        const lang = i18n.language
        if (lang === "ar" && data.display_name_ar) return data.display_name_ar
        if (lang === "fr" && data.display_name_fr) return data.display_name_fr
        return data.display_name_en
    }

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
                        <h1 className="font-semibold text-lg md:text-xl text-heading leading-tight line-clamp-2">{project.title}</h1>
                        <div className="flex flex-wrap gap-2 min-w-max">
                            <span className="text-2xs md:text-xs px-3 py-1 h-fit rounded-full bg-muted/5 text-muted border border-muted/15">
                                { getLocalizedLabel(project.service_types) }
                            </span>
                            <span className="text-2xs md:text-xs px-3 py-1 h-fit rounded-full bg-muted/5 text-muted border border-muted/15">
                                { getLocalizedLabel(project.space_types) }
                            </span>
                        </div>
                    </div>

                    {/* Location and Area Info */}
                    <div className="flex items-center gap-6 py-2 px-1 border-b border-muted/10">
                        <div className="flex items-center gap-2 text-muted">
                            <ICONS.mapPin className="size-4"/>
                            <span className="text-xs font-medium">{project.location || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted">
                            {/* {ICONS.layout({ className: 'size-4' })} */}
                            <span className="text-xs font-medium">{project.width && project.height ? `${project.width}m × ${project.height}m` : 'N/A'}</span>
                        </div>
                    </div>

                    <div className="flex flex-wrap w-full gap-4 items-center">
                        <Link to={PATHS.CLIENT.REQUEST_SERVICE} className="font-semibold text-xs text-center text-white min-w-max px-3 py-2 bg-primary rounded-full"
                        > { t('nav:service_request_similar_project') } </Link> {/* Set Initial Form Data If Needed */}

                        <button
                            onClick={() => setLiked(!liked)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-muted/5 border border-muted/15 rounded-full hover:bg-muted/10 transition-colors"
                        >
                            <ICONS.heart className={`size-5 ${liked ? 'fill-primary text-primary/75' : 'text-muted/75'}`} />
                            <span className="font-medium text-sm text-muted/75"> {liked ? 1 : 0} </span>
                        </button>
                    </div>

                    <div className="flex flex-col gap-4 p-4 bg-muted/5 border border-muted/15 rounded-2xl">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <p className="font-medium text-2xs md:text-xs text-muted/75 after:content-['•'] after:mx-2 last:after:content-none">
                                    { t('common:views_compact', {value: 44187, format: 'compact' }) }
                                </p>
                                <p className="font-medium text-2xs md:text-xs text-muted/75 after:content-['•'] after:mx-2 last:after:content-none">
                                    {new Date(project.created_at).toLocaleDateString()}
                                </p>
                            </div>
                            <button
                                className="font-medium text-xs text-primary cursor-pointer"
                                onClick={() => setDescOpen(!descOpen)}
                            >
                                {descOpen ? <ICONS.chevronUp /> : <ICONS.chevronDown />}
                            </button>
                        </div>
                        <div className="flex flex-wrap items-center gap-6">
                            {project.location &&
                                <div className="flex items-center gap-2 text-muted">
                                    <div className="flex gap-1">
                                        <ICONS.mapPin className="size-4" />
                                        <h5 className="text-xs text-muted"> { t('common:location') } </h5>
                                    </div>
                                    <span className="text-xs font-medium"> {project.location || 'N/A'} </span>
                                </div>
                            }

                            {project.area_sqm &&
                                <div className="flex items-center gap-2 text-muted">
                                    <div className="flex gap-1">
                                        <ICONS.layout className="size-4" />
                                        <h5 className="text-xs text-muted"> { t('common:floor_area') } </h5>
                                    </div>
                                    <span className="text-xs font-medium"> {project.area_sqm ? `${project.area_sqm} m²` : 'N/A'} </span>
                                </div>
                            }
                        </div>
                        <div onClick={() => setDescOpen(!descOpen)}>

                            <p className={`text-xs text-body leading-relaxed ${!descOpen && 'line-clamp-2'}`}>
                                {project.description}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}