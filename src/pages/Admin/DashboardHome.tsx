import { useEffect, useState } from "react";
import { AdminService } from "@/services/admin.service";
import { Plus, Cog, RectangleStack, ExclamationTriangle, ChatBubbleOvalLeftEllipsis, ChevronRight, Photo } from "@/icons";
import { PATHS } from "@/routers/Paths";
import { Link } from "react-router-dom";
import Spinner from "@/components/common/Spinner";

function timeAgo(date: string) {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
}

export default function DashboardHome() {
    const [stats, setStats] = useState<any>(null);
    const [pendingRequests, setPendingRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                const [morningStats, pending] = await Promise.all([
                    AdminService.getMorningCoffeeStats(),
                    AdminService.getPendingRequests(3)
                ]);
                setStats(morningStats);
                setPendingRequests(pending);
            } catch (error) {
                console.error("Failed to load dashboard home data:", error);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-hero">
                <Spinner status={loading} size="lg" />
            </div>
        );
    }

    return (
        <main className="content-container relative flex flex-col space-y-8 w-full py-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold italic">Good Morning!</h1>
                <p className="text-muted text-sm">Here's what's happening with DecoRight today.</p>
            </div>

            {/* KPI Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-surface border border-muted/15 rounded-2xl shadow-sm flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                        <span className="text-muted text-xs font-semibold uppercase tracking-wider">Total Active Requests</span>
                        <div className="p-2 bg-emphasis rounded-lg ring-1 ring-muted/20">
                            <RectangleStack className="size-4 text-muted" />
                        </div>
                    </div>
                    <span className="text-4xl font-bold">{stats?.activeRequests}</span>
                </div>
                <div className={`p-6 border rounded-2xl shadow-sm flex flex-col gap-3 ${stats?.pendingReview > 0 ? 'border-danger/50 bg-danger/5' : 'bg-surface border-muted/15'}`}>
                    <div className="flex items-center justify-between">
                        <span className="text-muted text-xs font-semibold uppercase tracking-wider">Pending Review</span>
                        <div className={`p-2 rounded-lg ring-1 ${stats?.pendingReview > 0 ? 'bg-danger/10 ring-danger/20' : 'bg-emphasis ring-muted/20'}`}>
                            <ExclamationTriangle className={`size-4 ${stats?.pendingReview > 0 ? 'text-danger' : 'text-muted'}`} />
                        </div>
                    </div>
                    <span className={`text-4xl font-bold ${stats?.pendingReview > 0 ? 'text-danger' : ''}`}>{stats?.pendingReview}</span>
                </div>
                <div className="p-6 bg-surface border border-muted/15 rounded-2xl shadow-sm flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                        <span className="text-muted text-xs font-semibold uppercase tracking-wider">Unread Messages</span>
                        <div className="p-2 bg-emphasis rounded-lg ring-1 ring-muted/20">
                            <ChatBubbleOvalLeftEllipsis className="size-4 text-muted" />
                        </div>
                    </div>
                    <span className="text-4xl font-bold">{stats?.unreadMessages}</span>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col gap-4">
                <h2 className="text-xl font-semibold">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <Link to={PATHS.ADMIN.GALLERY_CREATE} className="group flex items-start gap-3 p-4 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors">
                        <div className="p-1.5 bg-white/20 rounded-lg mt-0.5 shrink-0">
                            <Photo className="size-4" />
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <span className="font-semibold text-sm">Add Gallery Item</span>
                            <span className="text-xs text-white/70">Upload a before/after showcase</span>
                        </div>
                    </Link>
                    <Link to={PATHS.ADMIN.PROJECT_CREATE} className="group flex items-start gap-3 p-4 bg-surface border border-primary/20 text-primary rounded-xl hover:bg-primary/5 transition-colors">
                        <div className="p-1.5 bg-primary/10 rounded-lg mt-0.5 shrink-0">
                            <Plus className="size-4" />
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <span className="font-semibold text-sm">Create Project</span>
                            <span className="text-xs text-muted">Showcase a new design project</span>
                        </div>
                    </Link>
                    <Link to={PATHS.ADMIN.SETTINGS} className="group flex items-start gap-3 p-4 bg-surface border border-muted/15 rounded-xl hover:bg-emphasis/5 transition-colors">
                        <div className="p-1.5 bg-emphasis rounded-lg mt-0.5 shrink-0">
                            <Cog className="size-4 text-muted" />
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <span className="font-semibold text-sm">Update Contact Info</span>
                            <span className="text-xs text-muted">Phone, email, address</span>
                        </div>
                    </Link>
                </div>
            </div>

            {/* Pending Requests */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Pending Requests</h2>
                    <Link to={PATHS.ADMIN.REQUEST_SERVICE_LIST} className="text-sm text-primary hover:underline flex items-center gap-1">
                        View all <ChevronRight className="size-3.5" />
                    </Link>
                </div>
                <div className="bg-surface border border-muted/15 rounded-2xl overflow-hidden shadow-sm">
                    <ul className="divide-y divide-muted/10">
                        {pendingRequests.map((req) => (
                            <li key={req.id}>
                                <Link
                                    to={PATHS.ADMIN.requestServiceDetail(req.id)}
                                    className="p-4 flex items-center justify-between hover:bg-emphasis/5 transition-colors group"
                                >
                                    <div className="flex flex-col gap-0.5">
                                        <span className="font-semibold text-sm font-mono">{req.request_code}</span>
                                        <span className="text-xs text-muted">{(req.profiles as any)?.full_name || 'Unknown customer'}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs text-muted italic">{timeAgo(req.created_at)}</span>
                                        <ChevronRight className="size-4 text-muted group-hover:text-foreground transition-colors" />
                                    </div>
                                </Link>
                            </li>
                        ))}
                        {pendingRequests.length === 0 && (
                            <li className="p-8 text-center text-muted italic text-sm">
                                No pending requests — you're all caught up.
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </main>
    );
}
