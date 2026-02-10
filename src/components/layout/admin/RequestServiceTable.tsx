import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Table from "@/components/ui/DataTable";
import { AdminService } from "@/services/admin.service";
import { ICONS } from "@/icons";
import { PATHS } from '@/routers/Paths';
import { useConfirm } from "@components/confirm";
import { toast } from 'react-hot-toast';

interface RequestServiceTableProps {
    externalData?: any[];
    onRefresh?: () => void;
}

const STATUS_OPTIONS = [
    'Submitted', 'Under Review', 'Approved', 'In Progress', 'Completed', 'Rejected', 'Cancelled'
];

export default function RequestServiceTable({ externalData, onRefresh }: RequestServiceTableProps) {
    const navigate = useNavigate();
    const confirm = useConfirm();
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);

    const loadData = async () => {
        if (externalData) {
            setData(externalData);
            return;
        }
        try {
            setLoading(true);
            const requests = await AdminService.getAllServiceRequests();
            setData(requests || []);
        } catch (error) {
            console.error("Failed to load requests:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [externalData]);

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        try {
            setUpdatingStatusId(id);
            await AdminService.updateRequestStatus(id, newStatus as any);
            if (onRefresh) onRefresh();
            else loadData();
        } catch (error) {
            console.error("Failed to update status:", error);
        } finally {
            setUpdatingStatusId(null);
        }
    };

    const handleDeleteRequest = async (id: string, code: string) => {
        const confirmed = await confirm({
            title: 'Delete Request',
            message: `Are you sure you want to delete request ${code}? This action cannot be undone.`,
            confirmLabel: 'Delete',
            variant: 'danger'
        });

        if (!confirmed) return;

        try {
            await AdminService.deleteServiceRequest(id);
            toast.success(`Request ${code} deleted successfully`);
            if (onRefresh) onRefresh();
            else loadData();
        } catch (error) {
            console.error("Failed to delete request:", error);
            toast.error("Failed to delete request");
        }
    };

    const displayData = (externalData || data).map((req: any) => {
        // chat_id might be flattened in formattedData (RequestServiceList) or nested in chat_room (AdminService)
        const chatId = req.chat_id || (Array.isArray(req.chat_room) ? req.chat_room[0]?.id : req.chat_room?.id);

        return {
            ...req,
            full_name: req.profiles?.full_name || 'Anonymous',
            status_label: req.status,
            date: new Date(req.created_at).toLocaleDateString(),
            chat_id: chatId
        };
    });

    const columns = [
        {
            key: 'request_code',
            title: 'Identity',
            searchable: true,
            sortable: true,
            render: (row: any) => (
                <div className="flex items-center gap-3">
                    <div className="size-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                        {row.request_code?.[0] || 'R'}
                    </div>
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-heading text-sm uppercase">{row.request_code}</span>
                            <span className="text-xs text-muted font-normal">• {row.service_type || 'Service'}</span>
                        </div>
                        <span className="text-xs text-muted truncate max-w-[150px]">{row.full_name || 'Unknown Client'}</span>
                    </div>
                </div>
            )
        },
        {
            key: 'status',
            title: 'Status',
            className: 'min-w-[140px]',
            render: (row: any) => (
                <div className="relative group w-full" onClick={(e) => e.stopPropagation()}>
                    {updatingStatusId === row.id ? (
                        <div className="flex items-center gap-2 text-xs text-muted">
                            <ICONS.arrowPath className="size-3 animate-spin" /> Updating...
                        </div>
                    ) : (
                        <select
                            value={row.status}
                            onChange={(e) => handleStatusUpdate(row.id, e.target.value)}
                            className={`w-full appearance-none cursor-pointer pl-3 pr-8 py-1.5 text-[11px] sm:text-xs font-bold rounded-full border-0 focus:ring-2 focus:ring-offset-1 focus:ring-primary/20 outline-none
                                request-status-${row.status.toLowerCase().replace(/\s+/g, '-')}
                                hover:opacity-90 transition-all bg-right bg-no-repeat truncate`}
                            style={{
                                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                                backgroundPosition: 'right 0.5rem center',
                                backgroundSize: '1em'
                            }}
                        >
                            {STATUS_OPTIONS.map(opt => (
                                <option key={opt} value={opt} className="bg-surface text-heading">
                                    {opt}
                                </option>
                            ))}
                        </select>
                    )}
                </div>
            )
        },
        {
            key: 'space_type',
            title: 'Scope',
            render: (row: any) => (
                <div className="flex flex-col text-xs">
                    <span className="font-medium text-body">{row.space_type || '-'}</span>
                    <span className="text-muted">{row.width || 0}m × {row.height || 0}m</span>
                </div>
            )
        },
        {
            key: 'chat_action',
            title: 'Chat',
            width: '60px',
            className: 'text-center',
            render: (row: any) => row.chat_id ? (
                <Link
                    to={PATHS.ADMIN.chatRoom(row.chat_id)}
                    className="inline-flex items-center justify-center size-9 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all shadow-sm"
                    title="Open Chat with Client"
                    onClick={(e) => e.stopPropagation()}
                >
                    <ICONS.chatBubbleOvalLeftEllipsis className="size-4.5" />
                </Link>
            ) : (
                <span title="No Chat Available" className="inline-flex items-center justify-center size-9 rounded-full bg-muted/10 text-muted cursor-not-allowed">
                    <ICONS.chatBubbleOvalLeftEllipsis className="size-4.5 opacity-40" />
                </span>
            )
        },
        {
            key: 'date',
            title: 'Submission',
            sortable: true,
            className: 'text-end',
            render: (row: any) => (
                <span className="text-xs text-muted">
                    {new Date(row.created_at).toLocaleDateString()}
                </span>
            )
        },
    ];

    const handleRowClick = (row: any) => {
        navigate(PATHS.ADMIN.requestServiceDetail(row.id));
    };

    if (loading && displayData.length === 0) return (
        <div className="p-20 text-center flex flex-col items-center gap-4 animate-pulse">
            <ICONS.rectangleStack className="size-12 text-muted/20" />
            <p className="text-muted font-medium">Loading requests...</p>
        </div>
    );

    return (
        <Table
            columns={columns}
            data={displayData}
            options={{
                onRowClick: handleRowClick,
                selectable: true,
                filterOptions: [
                    { label: 'All Requests', value: '' },
                    { label: 'Submitted', value: 'Submitted' },
                    { label: 'In Progress', value: 'In Progress' },
                    { label: 'Completed', value: 'Completed' },
                    { label: 'Under Review', value: 'Under Review' },
                    { label: 'Rejected', value: 'Rejected' },
                ],
                filterField: 'status',
                searchPlaceholder: 'Search by ID or Client name...',
                renderActions: (row: any) => (
                    <div className="flex flex-col gap-1.5 w-full p-1">
                        <button
                            onClick={() => handleRowClick(row)}
                            className="px-2 py-2 w-full text-sm text-start hover:bg-emphasis rounded-lg flex items-center gap-2.5 font-medium text-primary transition-colors"
                        >
                            <ICONS.eye className="size-4" />
                            View Details
                        </button>
                        {row.chat_id && (
                            <Link
                                to={PATHS.ADMIN.chatRoom(row.chat_id)}
                                className="px-2 py-2 w-full text-sm text-start hover:bg-emphasis rounded-lg flex items-center gap-2.5 font-medium transition-colors"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <ICONS.chatBubbleOvalLeftEllipsis className="size-4" />
                                Open Chat
                            </Link>
                        ) || (
                                <button
                                    disabled
                                    className="px-2 py-2 w-full text-sm text-start opacity-50 cursor-not-allowed flex items-center gap-2.5 font-medium"
                                >
                                    <ICONS.chatBubbleOvalLeftEllipsis className="size-4" />
                                    No Chat Room
                                </button>
                            )}
                        <hr className="my-1 border-muted/10" />
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteRequest(row.id, row.request_code);
                            }}
                            className="px-2 py-2 w-full text-sm text-start hover:bg-red-500/10 hover:text-red-600 rounded-lg flex items-center gap-2.5 font-medium transition-colors text-red-500/80"
                        >
                            <ICONS.trash className="size-4" />
                            Delete Request
                        </button>
                    </div>
                ),
            }}
            className="border-0 rounded-none shadow-none"
        />
    );
}