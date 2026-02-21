import toast from "react-hot-toast";
import ZoomImage from "@/components/ui/ZoomImage";
import Spinner from "@/components/common/Spinner";
import type { SpaceType } from "@/services/space-types.service";
import type { ServiceType } from "@/services/service-types.service";
import { Link } from "react-router-dom"
import { useState, useEffect, useRef } from "react";
import { PATHS } from "@/routers/Paths";
import { AdminService } from "@/services/admin.service";
import { useConfirm } from "@components/confirm";
import { MagnifyingGlass, AdjustmentsHorizontal, ArrowDownWideShort, ArrowUpWideShort, CaretDown, ChevronUp, EllipsisVertical, Folder, InformationCircle, PencilSquare, Plus, Trash } from "@/icons";


export type ProjectAction = "edit" | "publish" | "private" | "hide" | "delete";

type Props = {
    projects: any[];
    serviceTypes: ServiceType[];
    serviceSpaceTypes:SpaceType[];
    onAction?: (projectId: string, action: ProjectAction) => void;
    visibilityStags?: any[];
};

export default function ProjectCardListLayout ({projects, onAction, serviceTypes, serviceSpaceTypes, visibilityStags}: Props) {

    const [openId, setOpenId] = useState<string | null>(null);
    const rootRef = useRef<HTMLDivElement | null>(null);
    const triggerRef = useRef<HTMLButtonElement | null>(null);
    const [placement, setPlacement] = useState<"bottom" | "top">("bottom");

    // search + filters
    const [filtersOpen, setFiltersOpen] = useState<boolean>(false); // Display search filters or not for small screen sizes
    const [query, setQuery] = useState("");
    const [serviceTypeFilter, setServiceTypeFilter] = useState<string | "all">("all");
    const [serviceSpaceTypeFilter, setServiceSpaceTypeFilter] = useState<string | "all">("all");
    const [visibilityStagFilter, setVisibilityStagFilter] = useState<string | "all">("all");
    const [sortBy, setSortBy] = useState<"likes"|"views"|"newest">("newest");
    const [sortDir, setSortDir] = useState<"desc"|"asc">("desc"); // desc is usually what you want


    // Close on outside click
    useEffect(() => {

        function handleDocClick(e: MouseEvent) {
            if (!rootRef.current) return;
            if (!rootRef.current.contains(e.target as Node)) setOpenId(null);
        }

        function handleEsc(e: KeyboardEvent) {
            if (e.key === "Escape") setOpenId(null);
        }

        document.addEventListener("click", handleDocClick);
        document.addEventListener("keydown", handleEsc);
        return () => {
            document.removeEventListener("click", handleDocClick);
            document.removeEventListener("keydown", handleEsc);
        };

    }, []);

    const derivedServiceTypes = Array.from(
        new Set((projects || []).map((p) => p.service_type).filter(Boolean))
    );

    const derivedServiceSpaceTypes = Array.from(
        new Set((projects || []).map((p) => p.service_space_type).filter(Boolean))
    );

    const derivedStages = Array.from(
        new Set((projects || []).map((p) => p.visibility).filter(Boolean))
    );

    const serviceTypeOptions = serviceTypes && serviceTypes.length ? serviceTypes : derivedServiceTypes;
    const serviceSpaceTypeOptions = serviceSpaceTypes && serviceSpaceTypes.length ? serviceSpaceTypes : derivedServiceSpaceTypes;
    const visibilityStageOptions = visibilityStags && visibilityStags.length ? visibilityStags : derivedStages;

    // filtering logic
    const filtered = projects.filter((project) => {
        // query match against title/description
        const q = query.trim().toLowerCase();
            if (q) {
                const hay = `${project.title} ${project.description || ""}`.toLowerCase();
                if (!hay.includes(q)) return false;
            }

            // service type
            if (serviceTypeFilter !== "all") {
                if (project.service_type !== serviceTypeFilter) return false;
            }

            // service space type
            if (serviceSpaceTypeFilter !== "all") {
                if (project.service_space_type !== serviceSpaceTypeFilter) return false;
            }

            // service space type
            if (visibilityStagFilter !== "all") {
                if (project.stage.value !== visibilityStagFilter) return false;
            }

            return true;
        }
    );

    const sorted = [...filtered].sort((a, b) => {
        if (sortBy === "likes")      return (b.likes || 0) - (a.likes || 0);
        if (sortBy === "views")      return (b.views || 0) - (a.views || 0);
        if (sortBy === "newest") {
            const ta = new Date(a.created_at || a.updated_at || 0).getTime();
            const tb = new Date(b.created_at || b.updated_at || 0).getTime();
            return tb - ta;
        }
        return 0;
    });

    if (sortDir === "asc") sorted.reverse();

    const handleAction = (id: string, action: ProjectAction) => {
        setOpenId(null);
        onAction?.(id, action);
    };

    // when toggling the menu, compute available space:
    function toggleMenu(id: string) {
        if (openId === id) {
            setOpenId(null);
            return;
        }

        const btn = triggerRef.current;
        if (!btn) {
            setPlacement("bottom");
            setOpenId(id);
            return;
        }

        const rect = btn.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;

        // quick estimate of menu height
        const estimatedMenuHeight = 220;

        // prefer bottom unless not enough space and there's more space above
        if (spaceBelow < estimatedMenuHeight && spaceAbove > spaceBelow) {
            setPlacement("bottom");
        } else {
            setPlacement("top");
        }

        setOpenId(id);
    }

    function handleResetFilters(e:React.MouseEvent<HTMLButtonElement>) {
        e.stopPropagation();
        setServiceTypeFilter('all');
        setServiceSpaceTypeFilter('all');
        setVisibilityStagFilter('all');
        setSortBy('newest');
        setSortDir('desc');
        return
    }

    return (
        <div ref={rootRef} className="w-full h-full">
        {/* Search + filters */}
        <div className="flex max-xl:flex-col items-center gap-2 mb-2 sm:mb-4 w-full h-fit">
            <div className="flex gap-2 w-full">
                <div className="flex items-center min-w-40 w-full rounded-full border border-muted/15 bg-surface">
                    <span className="p-2"> <MagnifyingGlass className="size-5 text-muted" /> </span>
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search portfolios..."
                        className="flex-1 w-full py-2 text-sm focus:outline-none"
                    />

                </div>
                <button type="button"
                onClick={() => {setFiltersOpen(!filtersOpen)}}
                area-label="Search filters"
                className="md:hidden p-2 w-fit h-fit rounded-full border border-muted/15 bg-surface"
                > {filtersOpen ? <ChevronUp/> : <AdjustmentsHorizontal/> } </button>
            </div>

            <div
            className={`flex max-lg:flex-wrap items-center gap-2 w-full overflow-clip duration-150 transition-all h-full
                ${filtersOpen ? "max-md:mb-2 max-md:max-h-fit" : "max-md:max-h-0"}`
                }>

                <div className="relative flex items-center max-xs:w-full h-fit rounded-full border border-muted/15 bg-surface">
                    <select value={serviceTypeFilter}
                    onChange={(e) => setServiceTypeFilter((e.target.value as string) || "all")}
                    className="flex appearance-none text-xs md:text-sm py-2 pl-2 pr-12 min-w-max w-full cursor-pointer focus:outline-none"
                    >
                        <option value="all"> All Services </option>
                        {serviceTypeOptions.map((s:any) => (
                            <option key={s?.id} value={s?.display_name_en}>{s?.display_name_en}</option>
                        ))}
                    </select>
                    <span className="absolute flex items-center px-2 pointer-events-none inset-y-0 right-0"> <CaretDown className="size-4"/> </span>
                </div>

                <div className="relative flex items-center max-xs:w-full h-fit rounded-full border border-muted/15 bg-surface">
                    <select value={serviceSpaceTypeFilter}
                    onChange={(e) => setServiceSpaceTypeFilter((e.target.value as string) || "all")}
                    className="flex appearance-none text-xs md:text-sm py-2 pl-2 pr-12 min-w-max w-full cursor-pointer focus:outline-none"
                    >
                        <option value="all"> All Space Services </option>
                        {serviceSpaceTypeOptions.map((s:any) => (
                            <option key={s?.id} value={s?.display_name_en}>{s?.display_name_en}</option>
                        ))}
                    </select>
                    <span className="absolute flex items-center px-2 pointer-events-none inset-y-0 right-0"> <CaretDown className="size-4"/> </span>
                </div>

                <div className="relative flex items-center max-xs:w-full h-fit rounded-full border border-muted/15 bg-surface">
                    <select value={visibilityStagFilter}
                    onChange={(e) => setVisibilityStagFilter((e.target.value as string) || "all")}
                    className="flex appearance-none text-xs md:text-sm py-2 pl-2 pr-12 min-w-max w-full cursor-pointer focus:outline-none"
                    >
                        <option value="all"> All Status </option>
                        {visibilityStageOptions.map((s:any) => (
                            <option key={s?.key} value={s?.key}>{s?.value}</option>
                        ))}

                    </select>
                    <span className="absolute flex items-center px-2 pointer-events-none inset-y-0 right-0"> <CaretDown className="size-4"/> </span>
                </div>

                <div className="relative flex items-center max-xs:w-full h-fit rounded-full border border-muted/15 bg-surface">
                    <button className="px-2 md:px-3 py-2 border-r border-r-muted/25"
                        title={sortDir === "desc" ? 'Descending Sort' : 'Ascending Sort'} onClick={() => setSortDir(d => d === "desc" ? "asc" : "desc")} >
                        {sortDir === "desc" ? <ArrowDownWideShort className="size-4 md:size-5"/> : <ArrowUpWideShort className="size-4 md:size-5"/>}
                    </button>
                    <div className="relative flex items-center w-full">
                        <select value={sortBy} onChange={e => setSortBy(e.target.value as any)}
                        className="flex appearance-none text-xs md:text-sm py-2 pl-2 pr-12 min-w-max w-full cursor-pointer focus:outline-0">
                            <option value="newest">Newest</option>
                            <option value="likes">Most liked</option>
                            <option value="views">Most viewed</option>
                        </select>
                        <span className="absolute flex items-center px-2 pointer-events-none inset-y-0 right-0"> <CaretDown className="size-4"/> </span>
                    </div>
                </div>
            </div>
        </div>

        { sorted.length > 0
        ?
        <ul className="relative flex flex-col gap-4 pt-4 w-full border-y border-y-muted/15">

                {sorted.map((project) => (
            <>
                <li key={project.id} className="flex gap-2">
                    <Link to={PATHS.ADMIN.projectUpdate('slug')} className="flex max-xs:flex-col gap-2 w-full">
                        <div className="xs:min-w-max xs:h-28 aspect-video overflow-hidden">
                            <ZoomImage src={project.thumbnail_url || project.main_image_url} alt="Project Image" className="object-cover h-full w-full rounded-lg" />
                        </div>

                        <div className="flex gap-2 w-full">
                            <div className="flex flex-col gap-2 w-full">

                                <h4 className="text-ellipsis-2line md:text-ellipsis-1line font-medium text-sm md:text-lg text-muted"> {project.title} </h4>

                                <div className="hidden sm:flex flex-wrap gap-1 sm:gap-2 w-fit">
                                    <span className="text-ellipsis-1line text-2xs px-2 py-1 border border-muted/15 rounded-full bg-surface">{project.service_type}</span>
                                    <span className="text-ellipsis-1line text-2xs px-2 py-1 border border-muted/15 rounded-full bg-surface">{project.service_space_type}</span>
                                </div>

                                <div className="flex flex-wrap">
                                    <span className="text-2xs min-w-max after:content-['•'] after:mx-1 last:after:content-none">{project.visibility} </span>
                                    <span className="text-2xs min-w-max after:content-['•'] after:mx-1 last:after:content-none">{project.views} Views</span>
                                    <span className="text-2xs min-w-max after:content-['•'] after:mx-1 last:after:content-none">{project.likes} Likes</span>
                                </div>

                                <p className="text-2xs min-w-max">{project.date}</p>

                            </div>
                            <div className="w-fit">
                                <button
                                    type="button"
                                    aria-haspopup="menu"
                                    aria-expanded={openId === project.id} ref={triggerRef}
                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleMenu(project.id); }}
                                    className="relative inline-flex items-center justify-center sm:p-2 rounded-full ring-muted/15 hover:ring-1 focus:ring-1 hover:bg-surface active:bg-surface focus:outline-none"
                                    title="Actions"
                                    >   <EllipsisVertical/>
                                        {openId === project.id && (
                                        <div role="menu" aria-label={`Actions for ${project.title}`}
                                            className={"absolute right-0 w-45 rounded-md border border-muted/25 bg-surface shadow-xs z-20 overflow-hidden " + (placement === "bottom" ? "top-full mt-2" : "bottom-full mb-2")}
                                            onClick={(e) => e.stopPropagation()}

                                        >   <button role="menuitem" onClick={() => handleAction(project.id, "edit")} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"> Edit </button>

                                            <div className="border-t border-y-muted" />

                                            <button role="menuitem" onClick={() => handleAction(project.id, "edit")} className="w-full text-left px-3 py-2 text-sm hover:text-white hover:bg-danger"> Delete </button>
                                        </div>
                                        )}
                                </button>
                            </div>
                        </div>

                </Link>

            </li>
            <div className="w-full h-full border-b border-muted/15 last:border-0 mask-r-to-transparent mask-r-from-100%"/>
        </>
                ))}

        </ul>
        :
        <div className="flex items-center justify-center gap-2 w-full h-full border border-red-400">
            <InformationCircle className="size-6" />
            <p> No projects match your current search or filters. </p>
            <button type="button" onClick={handleResetFilters} className="font-medium underline"> Reset filters </button>
        </div>
        }
    </div>
    )
}

export function ProjectCard({ project, onDelete }: { project: any, onDelete: (id: string) => void }) {
    return (
        <li className="relative group">
            <div className="flex max-xs:flex-col gap-4 w-full p-4 border border-muted/10 bg-surface rounded-xl hover:border-primary/30 transition-all">
                <Link to={PATHS.ADMIN.projectUpdate(project.id)} className="xs:min-w-[180px] xs:h-28 aspect-video overflow-hidden rounded-lg shrink-0">
                    <ZoomImage src={project.thumbnail_url || project.main_image_url} alt="" className="object-cover h-full w-full" />
                </Link>

                <div className="flex flex-col gap-2 w-full">
                    <div className="flex justify-between items-start gap-4">
                        <Link to={PATHS.ADMIN.projectUpdate(project.id)} className="hover:text-primary transition-colors">
                            <h4 className="font-semibold text-sm md:text-base text-foreground"> {project.title} </h4>
                        </Link>

                        <div className="flex items-center gap-1 shrink-0">
                            <Link
                                to={PATHS.ADMIN.projectUpdate(project.id)}
                                className="p-2 text-muted hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                                title="Edit Project"
                            >
                                <PencilSquare className="size-4" />
                            </Link>
                            <button
                                onClick={() => onDelete(project.id)}
                                className="p-2 text-muted hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                                title="Delete Project"
                            >
                                <Trash className="size-4" />
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {project.service_types && <span className="text-2xs px-1.5 py-0.5 border border-muted/15 rounded-md text-muted">{project.service_types.display_name_en}</span>}
                        {project.space_types && <span className="text-2xs px-1.5 py-0.5 border border-muted/15 rounded-md text-muted">{project.space_types.display_name_en}</span>}
                        {project.location && <span className="text-2xs px-1.5 py-0.5 border border-muted/15 rounded-md text-muted">{project.location}</span>}

                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter ${project.visibility === 'PUBLIC' ? 'bg-green-500/10 text-green-500' :
                            project.visibility === 'AUTHENTICATED_ONLY' ? 'bg-blue-500/10 text-blue-500' :
                                'bg-red-500/10 text-red-500'
                            }`}>
                            {project.visibility?.replace('_', ' ')}
                        </span>
                    </div>

                    <div className="flex flex-wrap items-center mt-auto">
                        <span className="text-2xs text-muted/60">{new Date(project.created_at).toLocaleDateString()}</span>
                        {(project.width || project.height) && <span className="text-2xs text-muted/60 before:content-['•'] before:mx-2">{project.width || 0}m × {project.height || 0}m</span>}
                    </div>
                </div>
            </div>
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
                    <Folder className="size-10 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-1">No Projects Found</h3>
                <p className="text-sm text-muted max-w-[300px] mb-6">
                    You haven't added any real-world projects yet.
                </p>
                <Link to={PATHS.ADMIN.PROJECT_CREATE} className="p-button">
                    <Plus className="size-4 mr-2" />
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
