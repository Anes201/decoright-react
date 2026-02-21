
import type { SpaceType } from "@/services/space-types.service";
import { Link } from "react-router-dom"
import { PATHS } from "@/routers/Paths";
import { useEffect, useRef, useState } from "react";
import { AdjustmentsHorizontal, ArrowDownWideShort, ArrowUpWideShort, CaretDown, ChevronUp, EllipsisVertical, InformationCircle, MagnifyingGlass } from "@/icons";

type visibilityStag = {
    id:string;
    label:string;
    value:string;
}

type Action = "edit" | "publish" | "private" | "hide" | "delete";

type Props = {
    spaceTypes: SpaceType[];
    onAction?: (spaceId: string, action: Action) => void;
    serviceSpaceStatus:visibilityStag[];
};

export default function ServiceSpaceListLayout ({spaceTypes, onAction, serviceSpaceStatus}: Props) {

    const [openId, setOpenId] = useState<string | null>(null);
    const rootRef = useRef<HTMLDivElement | null>(null);
    const triggerRef = useRef<HTMLButtonElement | null>(null);
    const [placement, setPlacement] = useState<"bottom" | "top">("bottom");

    // search + filters
    const [filtersOpen, setFiltersOpen] = useState<boolean>(false); // Display search filters or not for small screen sizes
    const [query, setQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState< string | "active" | "inactive" | "all">("all");
    const [sortBy, setSortBy] = useState<"newest">("newest");
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


    const derivedStages = Array.from(
        new Set((spaceTypes || []).map((s) => s.is_active).filter(Boolean))
    );

    const stageOptions = serviceSpaceStatus && serviceSpaceStatus.length ? serviceSpaceStatus : derivedStages;

    // filtering logic
    const filtered = spaceTypes.filter((space) => {
        // query match against title/description
        const q = query.trim().toLowerCase();
            if (q) {
                const hay = `${space.display_name_en} ${space.description || ""}`.toLowerCase();
                if (!hay.includes(q)) return false;
            }

            // service space type
            if (statusFilter !== "all") {
                const space_status = space.is_active ? "active" : "inactive"
                if (space_status !== statusFilter) return false;
            }

            return true;
        }
    );

    const sorted = [...filtered].sort((a, b) => {
        if (sortBy === "newest") {
            const ta = new Date(a.created_at || a.updated_at || 0).getTime();
            const tb = new Date(b.created_at || b.updated_at || 0).getTime();
            return tb - ta;
        }
        return 0;
    });

if (sortDir === "asc") sorted.reverse();


    const handleAction = (id: string, action: Action) => {
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
        setStatusFilter('all');
        setSortBy('newest');
        setSortDir('desc');
        return
    }
    return (
        <div ref={rootRef} className="w-full h-full">
            {/* Search + filters */}
            <div className="flex max-lg:flex-col items-center gap-2 mb-2 sm:mb-4 w-full h-fit">
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
                className={`flex max-lg:flex-wrap items-center gap-2 max-lg:w-full h-fit overflow-clip duration-150 transition-all
                    ${filtersOpen ? "max-md:mb-2 max-md:max-h-fit" : "max-md:max-h-0"}`
                }>

                    <div className="relative flex items-center max-xs:w-full h-fit rounded-full border border-muted/15 bg-surface">
                        <select value={statusFilter}
                        onChange={(e) => setStatusFilter((e.target.value as string) || "all")}
                        className="flex appearance-none text-xs md:text-sm py-2 pl-2 pr-12 min-w-max w-full cursor-pointer focus:outline-none"
                        >
                            <option value="all"> All Status </option>
                            {stageOptions.map((s:any) => (
                                <option key={s?.value} value={s?.value}>{s?.label}</option>
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
                            </select>
                            <span className="absolute flex items-center px-2 pointer-events-none inset-y-0 right-0"> <CaretDown className="size-4"/> </span>
                        </div>
                    </div>
                </div>
            </div>

            { sorted.length > 0

            ?
                <ul className="relative flex flex-col gap-4 pt-4 w-full border-t border-t-muted/15">

                    {sorted.map((space) => (
                        <>
                            <li>
                                <Link to={PATHS.ADMIN.serviceSpaceUpdate('slug')}
                                className="flex max-xs:flex-col gap-2 p-4 w-full border border-muted/15 bg-surface rounded-lg">
                                    <div className="flex items-center gap-2 w-full">
                                        <div className="flex flex-col gap-2 w-full">

                                            <h4 className="text-ellipsis-2line md:text-ellipsis-1line font-medium text-sm md:text-lg text-muted"> {space.display_name_en} </h4>

                                            <div className="flex flex-wrap">
                                                <span className="text-2xs min-w-max after:content-['•'] after:mx-1 last:after:content-none">{space.is_active}</span>
                                                <span className="text-2xs min-w-max after:content-['•'] after:mx-1 last:after:content-none">{space.created_at}</span>
                                            </div>

                                        </div>
                                        <div className="w-fit">
                                            <button
                                                type="button"
                                                aria-haspopup="menu"
                                                aria-expanded={openId === space.id}
                                                ref={triggerRef}
                                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleMenu(space.id); }}
                                                className="relative inline-flex items-center justify-center sm:p-2 rounded-full ring-muted/15 hover:ring-1 focus:ring-1 hover:bg-surface active:bg-surface focus:outline-none"
                                                title="Actions"

                                            >
                                                <EllipsisVertical/>
                                                {openId === space.id && (
                                                    <div role="menu"
                                                        aria-label={`Actions for ${space.display_name_en}`}
                                                        className={"absolute right-0 w-45 rounded-md border border-muted/25 bg-surface shadow-xs z-20 overflow-hidden " +
                                                        (placement === "bottom" ? "top-full mt-2" : "bottom-full mb-2")}
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <button role="menuitem"
                                                            onClick={() => handleAction(space.id, "edit")}
                                                            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                                                        > Edit </button>

                                                        <button role="menuitem"
                                                            onClick={() => handleAction(space.id, "edit")}
                                                            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                                                        > Publish </button>

                                                        <button role="menuitem"
                                                            onClick={() => handleAction(space.id, "edit")}
                                                            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                                                        > Hide </button>

                                                        <button role="menuitem"
                                                            onClick={() => handleAction(space.id, "edit")}
                                                            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                                                        > Delete </button>

                                                        <div className="border-t" />

                                                        <button role="menuitem"
                                                            onClick={() => handleAction(space.id, "edit")}
                                                            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                                                        > Delete </button>
                                                    </div>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </Link>
                            </li>
                        </>
                    ))}

                </ul>
            :
                <div className="flex items-center justify-center gap-2 w-full h-full">
                    <InformationCircle className="size-6" />
                    <p>
                        No spaces match your current search or filters.
                    </p>
                    <button type="button" onClick={handleResetFilters}
                    className="font-medium underline"
                    > Reset filters </button>
                </div>
            }
        </div>
    )
}
