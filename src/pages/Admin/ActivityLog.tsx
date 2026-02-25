
import { useEffect, useState } from "react";
import { ActivityLogService } from "@/services/activity-log.service";
import { Calendar, User, DocumentText, CheckCircle, Trash, ArrowPath } from "@/icons";
import { format } from "date-fns";

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

    const getEventIcon = (type: string) => {
        switch (type) {
            case 'REQUEST_DELETED': return <Trash className="size-4 text-danger" />;
            case 'ROLE_CHANGED': return <CheckCircle className="size-4 text-primary" />;
            case 'REQUEST_STATUS_CHANGED': return <ArrowPath className="size-4 text-warning" />;
            case 'USER_REGISTERED': return <User className="size-4 text-success" />;
            default: return <DocumentText className="size-4 text-muted" />;
        }
    };

    const renderDetails = (log: any) => {
        const { event_type, metadata, target_user, target_request_id } = log;
        
        switch (event_type) {
            case 'REQUEST_DELETED':
                return (
                    <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium">Request Deleted</span>
                        <span className="text-xs text-muted">Code: {metadata?.request_code || target_request_id?.slice(0, 8)}</span>
                    </div>
                );
            case 'ROLE_CHANGED':
                return (
                    <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium">Role Updated for {target_user?.full_name || 'User'}</span>
                        <span className="text-xs text-muted">
                            {metadata?.old_role} → <span className="font-bold text-primary">{metadata?.new_role}</span>
                        </span>
                    </div>
                );
            case 'REQUEST_STATUS_CHANGED':
                return (
                    <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium">Status Updated</span>
                        <span className="text-xs text-muted">
                            {metadata?.old_status} → <span className="font-bold text-warning">{metadata?.new_status}</span>
                        </span>
                    </div>
                );
            default:
                return <span className="text-sm font-medium">{event_type.replace(/_/g, ' ')}</span>;
        }
    };

    return (
        <main className="p-4 md:p-8 space-y-8">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h2 className="text-2xl font-bold tracking-tight">System Activity</h2>
                    <p className="text-muted text-sm">Audit trail of important system events and administrative actions.</p>
                </div>
                <button 
                    onClick={fetchLogs}
                    className="p-2 hover:bg-emphasis rounded-lg transition-colors"
                    disabled={loading}
                    title="Refresh logs"
                >
                    <ArrowPath className={`size-5 ${loading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            {error && (
                <div className="p-4 bg-danger/10 border border-danger/20 rounded-xl text-danger text-sm">
                    {error}
                </div>
            )}

            <div className="bg-surface border border-muted/10 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-muted/5 border-b border-muted/10">
                                <th className="p-4 text-xs font-bold uppercase tracking-wider text-muted">Time</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-wider text-muted">Event</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-wider text-muted">Action Details</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-wider text-muted">Actor</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-muted/10">
                            {loading && logs.length === 0 ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={4} className="p-8">
                                            <div className="h-4 bg-muted/10 rounded w-full"></div>
                                        </td>
                                    </tr>
                                ))
                            ) : logs.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-12 text-center text-muted italic">
                                        No activity logs found.
                                    </td>
                                </tr>
                            ) : (
                                logs.map((log) => (
                                    <tr key={log.id} className="hover:bg-muted/5 transition-colors">
                                        <td className="p-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2 text-xs text-muted">
                                                <Calendar className="size-3.5" />
                                                {format(new Date(log.created_at), 'MMM d, HH:mm:ss')}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <div className="size-8 rounded-lg bg-emphasis flex items-center justify-center">
                                                    {getEventIcon(log.event_type)}
                                                </div>
                                                <span className="text-xs font-bold text-muted uppercase tracking-tight">
                                                    {log.event_type.split('_')[0]}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            {renderDetails(log)}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                                    {log.actor?.full_name?.charAt(0) || <User className="size-4" />}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium">{log.actor?.full_name || 'System'}</span>
                                                    <span className="text-[10px] uppercase font-bold text-primary/60">{log.actor?.role}</span>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    );
}
