import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Table from "@/components/ui/DataTable";
import { AdminService } from "@/services/admin.service";
import { ICONS } from "@/icons";

interface RequestServiceTableProps {
    onRowClick?: (request: any) => void;
    externalData?: any[];
    onRefresh?: () => void;
}

const STATUS_OPTIONS = [
    'Submitted', 'Under Review', 'Approved', 'In Progress', 'Completed', 'Rejected', 'Cancelled'
];

export default function RequestServiceTable({ onRowClick, externalData, onRefresh }: RequestServiceTableProps) {
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
            await AdminService.updateRequestStatus(id, newStatus);
            if (onRefresh) onRefresh();
            else loadData();
        } catch (error) {
            console.error("Failed to update status:", error);
        } finally {
            setUpdatingStatusId(null);
        }
    };

    const displayData = (externalData || data).map((req: any) => ({
        ...req,
        full_name: req.profiles?.full_name || 'Anonymous',
        status_label: req.status,
        date: new Date(req.created_at).toLocaleDateString(),
        chat_id: req.chat_rooms?.[0]?.id
    }));

    const columns = [
        {
            key: 'request_code',
            title: 'ID',
            searchable: true,
            className: 'w-16 hidden sm:table-cell text-xs',
            render: (row: any) => (
                <span className="font-medium uppercase" onClick={() => onRowClick?.(row)}>{row.request_code}</span>
            )
        },
        // Mobile Stacked Column (Client + Status)
        {
            key: 'mobile_info',
            title: 'Request',
            className: 'md:hidden w-full min-w-[140px]',
            render: (row: any) => (
                <div className="flex flex-col gap-1.5 py-1">
                    <span className="font-semibold text-body text-sm truncate block" title={row.full_name}>{row.full_name}</span>
                    <div className="relative group w-full" onClick={(e) => e.stopPropagation()}>
                        {updatingStatusId === row.id ? (
                            <div className="flex items-center gap-2 text-xs text-muted">
                                <ICONS.arrowPath className="size-3 animate-spin" /> Updating...
                            </div>
                        ) : (
                            <select
                                value={row.status}
                                onChange={(e) => handleStatusUpdate(row.id, e.target.value)}
                                className={`w-full appearance-none cursor-pointer pl-2 pr-6 py-1 text-xs font-bold rounded-md border-0 focus:ring-1 focus:ring-primary/20 outline-none
                                    request-status-${row.status.toLowerCase().replace(/\s+/g, '-')}
                                    hover:opacity-90 transition-opacity bg-right bg-no-repeat`}
                                style={{
                                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                                    backgroundPosition: 'right 0.2rem center',
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
                </div>
            )
        },
        // Desktop Client Column
        {
            key: 'full_name',
            title: 'Client',
            searchable: true,
            className: 'hidden md:table-cell min-w-[120px] max-w-[180px] truncate',
            render: (row: any) => <span className="font-medium text-body truncate block" title={row.full_name}>{row.full_name}</span>
        },
        // Direct Action Column for Chat (Visible on all)
        {
            key: 'chat_action',
            title: 'Chat',
            width: '48px',
            className: 'w-12 px-0 text-center',
            render: (row: any) => row.chat_id ? (
                <Link
                    to={`/admin/chats?room=${row.chat_id}`}
                    className="inline-flex items-center justify-center size-8 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors"
                    title="Open Chat"
                    onClick={(e) => e.stopPropagation()}
                >
                    <ICONS.chatBubbleOvalLeftEllipsis className="size-4" />
                </Link>
            ) : (
                <span title="No Chat Initiated" className="inline-flex items-center justify-center size-8 rounded-full bg-muted/10 text-muted cursor-not-allowed">
                    <ICONS.chatBubbleOvalLeftEllipsis className="size-4 opacity-50" />
                </span>
            )
        },
        // Desktop Status Column
        {
            key: 'status', title: 'Status', className: 'hidden md:table-cell min-w-[190px] w-[200px]', render: (row: any) => (
                <div className="relative group w-full" onClick={(e) => e.stopPropagation()}>
                    {updatingStatusId === row.id ? (
                        <div className="flex items-center justify-center gap-2 text-xs text-muted w-full py-1">
                            <ICONS.arrowPath className="size-3 animate-spin" />
                        </div>
                    ) : (
                        <select
                            value={row.status}
                            onChange={(e) => handleStatusUpdate(row.id, e.target.value)}
                            className={`w-full appearance-none cursor-pointer pl-3 pr-8 py-1 text-[11px] sm:text-xs font-bold rounded-full border-0 focus:ring-2 focus:ring-offset-1 focus:ring-primary/20 outline-none
                            request-status-${row.status.toLowerCase().replace(/\s+/g, '-')}
                            hover:opacity-90 transition-opacity bg-right bg-no-repeat truncate`}
                            style={{
                                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                                backgroundPosition: 'right 0.2rem center',
                                backgroundSize: '1.2em'
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
        { key: 'service_type', title: 'Service', className: 'hidden md:table-cell text-muted' },
        { key: 'space_type', title: 'Space', className: 'hidden lg:table-cell text-muted' },
        { key: 'area_sqm', title: 'Area', className: 'hidden xl:table-cell text-end', render: (row: any) => (<span className="font-medium text-muted"> {row.area_sqm || 0} m² </span>) },
        { key: 'date', title: 'Date', className: 'hidden lg:table-cell text-end text-muted' },
    ];

    if (loading && displayData.length === 0) return <div className="p-8 text-center text-muted">Loading requests...</div>;

    return (
        <Table
            columns={columns}
            data={displayData}
            options={{
                selectable: true,
                filterOptions: [
                    { label: 'Submitted', value: 'Submitted' },
                    { label: 'Under Review', value: 'Under Review' },
                    { label: 'Approved', value: 'Approved' },
                    { label: 'In Progress', value: 'In Progress' },
                    { label: 'Completed', value: 'Completed' },
                    { label: 'Rejected', value: 'Rejected' },
                    { label: 'Cancelled', value: 'Cancelled' },
                ],
                filterField: 'status',
                renderActions: (row: any) => (
                    <div className="flex flex-col gap-2 w-full p-1">
                        <button
                            onClick={() => onRowClick?.(row)}
                            className="px-2 py-1.5 w-full text-sm text-start hover:bg-emphasis rounded flex items-center gap-2 font-medium text-primary"
                        >
                            <ICONS.eye className="size-4" />
                            Manage Request
                        </button>
                        {row.chat_id && (
                            <Link
                                to={`/admin/chats?room=${row.chat_id}`}
                                className="px-2 py-1.5 w-full text-sm text-start hover:bg-emphasis rounded flex items-center gap-2"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <ICONS.chatBubbleOvalLeftEllipsis className="size-4" />
                                Chat with Client
                            </Link>
                        )}
                        <button className="px-2 py-1.5 w-full text-sm text-start hover:bg-emphasis rounded flex items-center gap-2 text-red-500">
                            <ICONS.trash className="size-4" />
                            Delete
                        </button>
                    </div>
                ),
                bulkActions: [
                    { label: 'Export Selected', onClick: (selected) => console.log('export', selected) },
                ],
                searchPlaceholder: 'Search by names or codes',
            }}
            className="cursor-pointer"
        />
    );
}