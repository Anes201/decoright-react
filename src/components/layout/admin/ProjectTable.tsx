import Table from "@/components/ui/DataTable";
import { AdminService } from "@/services/admin.service";
import { useEffect, useState } from "react";
import { ICONS } from "@/icons";
import { Link, useNavigate } from "react-router-dom";
import { PATHS } from "@/routers/Paths";
import { useConfirm } from "@components/confirm";

export default function ProjectTable({ onEdit, refreshKey }: { onEdit: (project: any) => void, refreshKey?: number }) {
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const confirm = useConfirm();
    const navigate = useNavigate();

    const loadProjects = async () => {
        try {
            setLoading(true);
            const data = await AdminService.getProjects();
            setProjects(data || []);
        } catch (error) {
            console.error("Failed to load projects:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProjects();
    }, [refreshKey]);

    const handleDelete = async (id: string) => {
        if (await confirm({
            title: 'Delete Project',
            message: 'Are you sure you want to delete this project? This action cannot be undone.',
            type: 'danger'
        })) {
            try {
                await AdminService.deleteProject(id);
                loadProjects();
            } catch (error) {
                console.error("Failed to delete project:", error);
            }
        }
    };

    const toggleVisibility = async (id: string, currentVisibility: string) => {
        const nextVisibility = currentVisibility === 'PUBLIC' ? 'HIDDEN' : 'PUBLIC';
        try {
            await AdminService.updateProject(id, { visibility: nextVisibility as any });
            loadProjects();
        } catch (error) {
            console.error("Failed to update visibility:", error);
        }
    };

    const columns = [
        {
            key: 'title',
            title: 'Project',
            searchable: true,
            sortable: true,
            render: (row: any) => (
                <div className="flex items-center gap-3">
                    <div className="size-12 rounded-lg bg-emphasis/10 overflow-hidden">
                        {row.thumbnail_url ? (
                            <img src={row.thumbnail_url} alt="" className="size-full object-cover" />
                        ) : (
                            <div className="size-full flex items-center justify-center">
                                <ICONS.photo className="size-5 text-muted" />
                            </div>
                        )}
                    </div>
                    <div>
                        <div className="font-semibold text-heading text-sm">{row.title}</div>
                        <div className="text-2xs text-muted font-mono">{row.slug}</div>
                    </div>
                </div>
            )
        },
        {
            key: 'visibility',
            title: 'Visibility',
            render: (row: any) => (
                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${row.visibility === 'PUBLIC'
                    ? 'bg-emerald-500/5 text-emerald-600 border-emerald-500/20'
                    : row.visibility === 'HIDDEN'
                        ? 'bg-zinc-500/5 text-zinc-500 border-zinc-500/20'
                        : 'bg-amber-500/5 text-amber-600 border-amber-500/20'
                    }`}>
                    <span className={`size-1.5 rounded-full ${row.visibility === 'PUBLIC' ? 'bg-emerald-500' :
                        row.visibility === 'HIDDEN' ? 'bg-zinc-500' : 'bg-amber-500'
                        }`} />
                    {row.visibility}
                </div>
            )
        },
        {
            key: 'type',
            title: 'Types',
            render: (row: any) => (
                <div className="flex flex-col gap-1">
                    <span className="text-2xs font-medium px-1.5 py-0.5 rounded bg-blue-500/5 text-blue-600 border border-blue-500/10 w-fit">
                        {row.service_types?.display_name_en || 'Default'}
                    </span>
                    <span className="text-2xs font-medium px-1.5 py-0.5 rounded bg-purple-500/5 text-purple-600 border border-purple-500/10 w-fit">
                        {row.space_types?.display_name_en || 'Default'}
                    </span>
                </div>
            )
        },
        {
            key: 'created_at',
            title: 'Created',
            sortable: true,
            render: (row: any) => (
                <span className="text-xs text-muted">
                    {new Date(row.created_at).toLocaleDateString()}
                </span>
            )
        }
    ];

    if (loading) {
        return <div className="p-10 text-center text-muted animate-pulse">Loading projects...</div>;
    }

    return (
        <Table
            columns={columns}
            data={projects}
            options={{
                selectable: false,
                searchPlaceholder: 'Search projects...',
                renderActions: (row) => (
                    <div className="flex flex-col gap-2 w-full">
                        <Link to={PATHS.projectDetail(row.slug || row.id)} target="_blank" className="px-2 py-1.5 w-full text-xs text-start hover:bg-emphasis/10 rounded font-medium flex items-center gap-2">
                            <ICONS.eye className="size-3.5" /> View Public
                        </Link>
                        <button
                            className="px-2 py-1.5 w-full text-xs text-start hover:bg-emphasis/10 rounded font-medium flex items-center gap-2"
                            onClick={() => onEdit(row)}
                        >
                            <ICONS.pencilSquare className="size-3.5" /> Edit Project
                        </button>
                        <button
                            className="px-2 py-1.5 w-full text-xs text-start hover:bg-emphasis/10 rounded font-medium flex items-center gap-2"
                            onClick={() => toggleVisibility(row.id, row.visibility)}
                        >
                            <ICONS.arrowPath className="size-3.5" /> {row.visibility === 'PUBLIC' ? 'Move to Hidden' : 'Make Public'}
                        </button>
                        <button
                            className="px-2 py-1.5 w-full text-xs text-start hover:bg-red-500/5 text-red-500 rounded font-medium flex items-center gap-2"
                            onClick={() => handleDelete(row.id)}
                        >
                            <ICONS.trash className="size-3.5 text-current" /> Delete Project
                        </button>
                    </div>
                )
            }}
        />
    );
}
