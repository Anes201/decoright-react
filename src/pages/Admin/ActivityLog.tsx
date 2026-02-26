
import { useEffect, useState } from "react";
import { ActivityLogService } from "@/services/activity-log.service";
import { Calendar, User, DocumentText, CheckCircle, Trash, ArrowPath } from "@/icons";
import { format } from "date-fns";
import Table from "@/components/ui/DataTable";

function getEventIcon(type: string) {
    switch (type) {
        case 'REQUEST_DELETED': return <Trash className="size-4 text-danger" />;
        case 'ROLE_CHANGED': return <CheckCircle className="size-4 text-primary" />;
        case 'REQUEST_STATUS_CHANGED': return <ArrowPath className="size-4 text-warning" />;
        case 'USER_REGISTERED': return <User className="size-4 text-success" />;
        default: return <DocumentText className="size-4 text-muted" />;
    }
}

function renderDetails(log: any) {
    const { event_type, metadata, target_user, target_request_id } = log;
    switch (event_type) {
        case 'REQUEST_DELETED':
            return (
                <div className="flex flex-col gap-0.5">
                    <span className="font-medium text-heading">Request Deleted</span>
                    <span className="text-xs text-muted">Code: {metadata?.request_code || target_request_id?.slice(0, 8)}</span>
                </div>
            );
        case 'ROLE_CHANGED':
            return (
                <div className="flex flex-col gap-0.5">
                    <span className="font-medium text-heading">Role Updated for {target_user?.full_name || 'User'}</span>
                    <span className="text-xs text-muted">
                        {metadata?.old_role} → <span className="font-bold text-primary">{metadata?.new_role}</span>
                    </span>
                </div>
            );
        case 'REQUEST_STATUS_CHANGED':
            return (
                <div className="flex flex-col gap-0.5">
                    <span className="font-medium text-heading">Status Updated</span>
                    <span className="text-xs text-muted">
                        {metadata?.old_status} → <span className="font-bold text-warning">{metadata?.new_status}</span>
                    </span>
                </div>
            );
        default:
            return <span className="font-medium text-heading">{event_type.replace(/_/g, ' ')}</span>;
    }
}

const columns = [
    {
        key: 'created_at',
        title: 'Time',
        render: (row: any) => (
            <div className="flex items-center gap-2 text-xs text-muted whitespace-nowrap">
                <Calendar className="size-3.5 shrink-0" />
                {format(new Date(row.created_at), 'MMM d, HH:mm:ss')}
            </div>
        ),
    },
    {
        key: 'event_type',
        title: 'Event',
        searchable: true,
        render: (row: any) => (
            <div className="flex items-center gap-2">
                <div className="size-8 rounded-lg bg-emphasis flex items-center justify-center shrink-0">
                    {getEventIcon(row.event_type)}
                </div>
                <span className="text-xs font-bold text-muted uppercase tracking-tight whitespace-nowrap">
                    {row.event_type.split('_')[0]}
                </span>
            </div>
        ),
    },
    {
        key: 'details',
        title: 'Action Details',
        render: (row: any) => renderDetails(row),
    },
    {
        key: 'actor',
        title: 'Actor',
        render: (row: any) => (
            <div className="flex items-center gap-3">
                <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                    {row.actor?.full_name?.charAt(0) || <User className="size-4" />}
                </div>
                <div className="flex flex-col">
                    <span className="font-medium text-heading whitespace-nowrap">{row.actor?.full_name || 'System'}</span>
                    <span className="text-[10px] uppercase font-bold text-primary/60">{row.actor?.role}</span>
                </div>
            </div>
        ),
    },
];

export default function ActivityLogPage() {
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const data = await ActivityLogService.getLogs();
            setLogs(data);
            setError(null);
        } catch (err: any) {
            setError(err.message || "Failed to load activity logs");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    return (
        <main>
            <section className="h-hero min-h-hero relative flex flex-col w-full h-full pt-4 md:py-8 mb-40">
                <div className="flex flex-col gap-6 h-full">

                    <div className="flex items-center justify-between gap-4">
                        <h1 className="font-semibold text-lg md:text-2xl">System Activity</h1>
                    </div>

                    {error && (
                        <div className="p-4 bg-danger/10 border border-danger/20 rounded-xl text-danger text-sm">
                            {error}
                        </div>
                    )}

                    {loading && logs.length === 0 ? (
                        <div className="p-10 text-center text-muted animate-pulse">Loading activity logs...</div>
                    ) : (
                        <Table
                            columns={columns}
                            data={logs}
                            options={{
                                searchPlaceholder: 'Search by event type...',
                                onRefresh: fetchLogs,
                                filterOptions: [
                                    { label: 'Request Deleted', value: 'REQUEST_DELETED' },
                                    { label: 'Role Changed', value: 'ROLE_CHANGED' },
                                    { label: 'Status Changed', value: 'REQUEST_STATUS_CHANGED' },
                                    { label: 'User Registered', value: 'USER_REGISTERED' },
                                ],
                                filterField: 'event_type',
                                noResults: (
                                    <div className="py-12 text-center text-muted text-sm italic">
                                        No activity logs found.
                                    </div>
                                ),
                            }}
                        />
                    )}

                </div>
            </section>
        </main>
    );
}
