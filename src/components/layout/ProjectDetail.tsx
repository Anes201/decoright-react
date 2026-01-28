import { ICONS } from "../../icons"
import { PCTALink } from "../ui/CTA"
import { Link, useParams } from "react-router-dom";
import { useEffect, useState, type CSSProperties } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper.css';
import 'swiper/swiper-bundle.css';
import { Navigation, Pagination, Zoom } from 'swiper/modules';
import ZoomImage from "../ui/ZoomImage";
import { AdminService } from "@/services/admin.service";
import Spinner from "../ui/Spinner";
import { PATHS } from "@/routers/Paths";

export function ProjectCardItem({ project, index }: { project: any, index: number }) {
    return (
        <li key={index}>
            <Link to={PATHS.projectDetail(project.slug || project.id)} className="flex max-md:flex-col gap-1 h-full">
                <div className="w-full h-full aspect-video rounded-lg overflow-hidden shrink-0">
                    <img src={project.thumbnail_url} alt={project.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col gap-1 w-full h-full overflow-hidden">
                    <h3 className="font-medium text-xs md:text-2xs h-full text-ellipsis-3line"> {project.title} </h3>
                    <div className="flex md:flex-col">
                        <p className="font-medium text-2xs md:text-3xs text-muted/75"> View Project </p>
                    </div>
                </div>
            </Link>
        </li>
    )
}

export function ProjectSimilarList() {
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchSimilar() {
            try {
                const data = await AdminService.getProjects({ visibility: ['PUBLIC'], limit: 5 });
                setProjects(data || []);
            } catch (err) {
                console.error("Failed to fetch similar projects:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchSimilar();
    }, []);

    if (loading) return <div className="p-4 flex justify-center"><Spinner className="w-6 h-6" /></div>;

    return (
        <ul className="space-y-6 md:space-y-2">
            {projects.map((project, index) => (
                <ProjectCardItem key={project.id} project={project} index={index} />
            ))}
        </ul>
    )
}

export function ProjectDetail() {
    const { slug } = useParams<{ slug: string }>();
    const [project, setProject] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [liked, setLiked] = useState(false);
    const [descOpen, setDescOpen] = useState(false);

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
        return <div className="min-h-hero flex items-center justify-center"><Spinner className="w-12 h-12" /></div>;
    }

    if (!project) {
        return <div className="min-h-hero flex items-center justify-center text-muted">Project not found.</div>;
    }

    const imgs = project.project_images?.length > 0
        ? project.project_images.map((img: any) => ({ id: img.id, src: img.image_url, alt: project.title }))
        : (project.thumbnail_url ? [{ id: 'main', src: project.thumbnail_url, alt: project.title }] : []);

    return (
        <section className="min-h-hero content-container relative h-full w-full py-8">
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 mb-18 w-full">

                {/* Main Project Content */}
                <div className="relative w-full lg:w-[70%] h-fit">
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
                        <div className="flex flex-col gap-2">
                            <h1 className="font-semibold text-lg md:text-2xl text-heading leading-tight">{project.title}</h1>
                            <div className="flex flex-wrap gap-2">
                                <span className="text-2xs font-medium px-2 py-0.5 rounded-full bg-primary/5 text-primary border border-primary/10">
                                    {project.service_types?.display_name_en}
                                </span>
                                <span className="text-2xs font-medium px-2 py-0.5 rounded-full bg-secondary/5 text-secondary border border-secondary/10">
                                    {project.space_types?.display_name_en}
                                </span>
                            </div>
                        </div>

                        {/* Location and Area Info */}
                        <div className="flex items-center gap-6 py-2 px-1 border-b border-muted/10">
                            <div className="flex items-center gap-2 text-muted">
                                {ICONS.mapPin({ className: 'size-4' })}
                                <span className="text-xs font-medium">{project.location || 'N/A'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted">
                                {ICONS.layout({ className: 'size-4' })}
                                <span className="text-xs font-medium">{project.area_sqm ? `${project.area_sqm} m²` : 'N/A'}</span>
                            </div>
                        </div>

                        <div className="flex flex-wrap w-full gap-4 items-center">
                            <PCTALink to={'/request-service'}> Request Similar Project </PCTALink>

                            <button
                                onClick={() => setLiked(!liked)}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-muted/5 border border-muted/15 rounded-full hover:bg-muted/10 transition-colors"
                            >
                                {ICONS.heart({ className: `size-5 ${liked ? 'fill-red-500 text-red-500' : 'text-muted/75'}` })}
                                <span className="font-medium text-sm text-muted/75"> {liked ? 1 : 0} </span>
                            </button>
                        </div>

                        <div className="flex flex-col gap-4 p-4 bg-muted/5 border border-muted/15 rounded-2xl">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <p className="font-medium text-xs text-muted/75">
                                        {new Date(project.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                                <button
                                    className="font-medium text-xs text-primary cursor-pointer hover:underline"
                                    onClick={() => setDescOpen(!descOpen)}
                                >
                                    {descOpen ? 'Read Less' : 'Read More'}
                                </button>
                            </div>
                            <div>
                                <h4 className="font-medium text-sm mb-1"> Project Description </h4>
                                <p className={`text-xs text-body leading-relaxed ${!descOpen && 'line-clamp-3'}`}>
                                    {project.description}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* More & Similar Projects Container */}
                <div className="w-full lg:w-[30%]">
                    <h3 className="font-semibold text-sm mb-4 flex items-center gap-2">
                        <ICONS.presentationChartLine className="size-4" />
                        Explore More Projects
                    </h3>
                    <ProjectSimilarList />
                </div>

            </div>
        </section>
    )
}