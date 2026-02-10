
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { RequestService } from "@/services/request.service";
import { ICONS } from "@/icons";
import { PATHS } from "@/routers/Paths";
import Spinner from "@/components/common/Spinner";
import { supabase } from "@/lib/supabase";

export default function RequestOverview() {
    const { id } = useParams<{ id: string }>();
    const [request, setRequest] = useState<any>(null);
    const [attachments, setAttachments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadRequest() {
            if (!id) return;

            try {
                setLoading(true);
                const data = await RequestService.getRequestById(id);
                setRequest(data);

                // Fetch attachments
                const { data: attachmentsData, error: attachError } = await supabase
                    .from('request_attachments')
                    .select('*')
                    .eq('request_id', id);

                if (!attachError && attachmentsData) {
                    setAttachments(attachmentsData);
                }
            } catch (err: any) {
                setError(err.message || "Failed to load request");
                console.error("Failed to load request:", err);
            } finally {
                setLoading(false);
            }
        }

        loadRequest();
    }, [id]);

    if (loading) {
        return (
            <main className="flex items-center justify-center min-h-hero">
                <Spinner className="w-12 h-12" />
            </main>
        );
    }

    if (error || !request) {
        return (
            <main className="flex flex-col items-center justify-center min-h-hero gap-4">
                <div className="text-danger text-center">
                    <ICONS.exclamationTriangle className="size-12 mx-auto mb-2" />
                    <p className="text-lg font-medium">{error || "Request not found"}</p>
                </div>
                <Link to={PATHS.ADMIN.REQUEST_SERVICE_LIST} className="text-primary hover:underline">
                    ← Back to Requests
                </Link>
            </main>
        );
    }

    const statusColors: Record<string, string> = {
        'Submitted': 'bg-blue-500/10 text-blue-600 border-blue-500/20',
        'Under Review': 'bg-amber-500/10 text-amber-600 border-amber-500/20',
        'Approved': 'bg-green-500/10 text-green-600 border-green-500/20',
        'In Progress': 'bg-purple-500/10 text-purple-600 border-purple-500/20',
        'Completed': 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
        'Cancelled': 'bg-zinc-500/10 text-zinc-600 border-zinc-500/20',
        'Rejected': 'bg-red-500/10 text-red-600 border-red-500/20'
    };

    return (
        <main>
            <section className="min-h-hero relative flex flex-col w-full md:pt-8 mb-40">
                <div className="relative flex flex-col gap-6 h-full">

                    {/* Header */}
                    <div className="flex items-center justify-between gap-4 pb-4 border-b border-muted/15">
                        <div className="space-y-1">
                            <h1 className="font-semibold text-lg md:text-2xl">Request Overview</h1>
                            <p className="text-xs text-muted">Request #{request.request_code}</p>
                        </div>
                        <Link
                            to={PATHS.ADMIN.REQUEST_SERVICE_LIST}
                            className="flex items-center gap-2 px-3 py-2 text-sm text-muted hover:text-primary border border-muted/15 rounded-lg hover:bg-emphasis/50 transition-colors"
                        >
                            <ICONS.arrowLeft className="size-4" />
                            Back to List
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* Main Content - Left Column */}
                        <div className="lg:col-span-2 space-y-6">

                            {/* Request Details Card */}
                            <div className="p-6 bg-surface border border-muted/15 rounded-xl space-y-4">
                                <h2 className="font-semibold text-base flex items-center gap-2">
                                    <ICONS.documentText className="size-5 text-primary" />
                                    Request Details
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs text-muted font-medium">Service Type</label>
                                        <p className="text-sm font-medium mt-1">
                                            {request.service_types?.display_name_en || 'N/A'}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-xs text-muted font-medium">Space Type</label>
                                        <p className="text-sm font-medium mt-1">
                                            {request.space_types?.display_name_en || 'N/A'}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-xs text-muted font-medium">Location</label>
                                        <p className="text-sm font-medium mt-1 flex items-center gap-1">
                                            <ICONS.mapPin className="size-4 text-muted" />
                                            {request.location || 'N/A'}
                                        </p>
                                    </div>
                                    {(request.width || request.height) && (
                                        <div>
                                            <label className="text-xs text-muted font-medium">Dimensions</label>
                                            <p className="text-sm font-medium mt-1">
                                                {request.width && request.height
                                                    ? `${request.width}m × ${request.height}m`
                                                    : request.width
                                                        ? `${request.width}m width`
                                                        : `${request.height}m height`
                                                }
                                            </p>
                                        </div>
                                    )}
                                    <div>
                                        <label className="text-xs text-muted font-medium">Created</label>
                                        <p className="text-sm font-medium mt-1">
                                            {new Date(request.created_at).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                </div>

                                {request.description && (
                                    <div className="pt-4 border-t border-muted/10">
                                        <label className="text-xs text-muted font-medium">Description</label>
                                        <p className="text-sm mt-2 leading-relaxed">{request.description}</p>
                                    </div>
                                )}
                            </div>

                            {/* Attachments Card */}
                            {attachments.length > 0 && (
                                <div className="p-6 bg-surface border border-muted/15 rounded-xl space-y-4">
                                    <h2 className="font-semibold text-base flex items-center gap-2">
                                        <ICONS.paperClip className="size-5 text-primary" />
                                        Attachments ({attachments.length})
                                    </h2>
                                    <div className="space-y-2">
                                        {attachments.map((attachment) => (
                                            <a
                                                key={attachment.id}
                                                href={attachment.file_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-3 p-3 border border-muted/15 rounded-lg hover:bg-emphasis/50 transition-colors group"
                                            >
                                                <div className="flex items-center justify-center size-10 bg-primary/10 rounded-lg shrink-0">
                                                    {attachment.file_type === 'IMAGE' ? (
                                                        <ICONS.photo className="size-5 text-primary" />
                                                    ) : attachment.file_type === 'PDF' ? (
                                                        <ICONS.documentText className="size-5 text-primary" />
                                                    ) : (
                                                        <ICONS.documentText className="size-5 text-primary" />
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                                                        {attachment.file_name}
                                                    </p>
                                                    <p className="text-xs text-muted capitalize">{attachment.file_type}</p>
                                                </div>
                                                <ICONS.arrowDownTray className="size-5 text-muted group-hover:text-primary transition-colors shrink-0" />
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Sidebar - Right Column */}
                        <div className="space-y-6">

                            {/* Status Card */}
                            <div className="p-6 bg-surface border border-muted/15 rounded-xl space-y-4">
                                <h2 className="font-semibold text-base">Status</h2>
                                <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border ${statusColors[request.status] || 'bg-zinc-500/10 text-zinc-600 border-zinc-500/20'}`}>
                                    <span className="size-2 rounded-full bg-current"></span>
                                    {request.status}
                                </div>
                            </div>

                            {/* Customer Info Card */}
                            <div className="p-6 bg-surface border border-muted/15 rounded-xl space-y-4">
                                <h2 className="font-semibold text-base flex items-center gap-2">
                                    <ICONS.user className="size-5 text-primary" />
                                    Customer
                                </h2>
                                <div className="space-y-3">
                                    <div>
                                        <label className="text-xs text-muted font-medium">Name</label>
                                        <p className="text-sm font-medium mt-1">
                                            {request.profiles?.full_name || 'N/A'}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-xs text-muted font-medium">Role</label>
                                        <p className="text-sm font-medium mt-1 capitalize">
                                            {request.profiles?.role || 'Customer'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="p-6 bg-surface border border-muted/15 rounded-xl space-y-3">
                                <h2 className="font-semibold text-base">Quick Actions</h2>
                                <Link
                                    to={PATHS.ADMIN.chatRoom(id!)}
                                    className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                                >
                                    <ICONS.chatBubbleOvalLeftEllipsis className="size-5" />
                                    Open Chat
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}