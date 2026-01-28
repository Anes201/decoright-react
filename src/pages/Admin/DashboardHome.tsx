import { useEffect, useState } from "react";
import { AdminService } from "@/services/admin.service";
import { ICONS } from "@/icons";
import { PATHS } from "@/routers/Paths";
import { Link } from "react-router-dom";

export default function DashboardHome() {
    const [stats, setStats] = useState<any>(null);
    const [activities, setActivities] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                const [morningStats, recentLogs] = await Promise.all([
                    AdminService.getMorningCoffeeStats(),
                    AdminService.getUsersActivity()
                ]);
                setStats(morningStats);
                setActivities(recentLogs);
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
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
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
                <div className="p-6 bg-surface border border-muted/15 rounded-2xl shadow-sm flex flex-col gap-2">
                    <span className="text-muted text-xs font-semibold uppercase tracking-wider">Total Active Requests</span>
                    <span className="text-4xl font-bold">{stats?.activeRequests}</span>
                </div>
                <div className={`p-6 bg-surface border rounded-2xl shadow-sm flex flex-col gap-2 ${stats?.pendingReview > 0 ? 'border-danger/50 bg-danger/5' : 'border-muted/15'}`}>
                    <span className="text-muted text-xs font-semibold uppercase tracking-wider">Pending Review</span>
                    <span className={`text-4xl font-bold ${stats?.pendingReview > 0 ? 'text-danger' : ''}`}>{stats?.pendingReview}</span>
                </div>
                <div className="p-6 bg-surface border border-muted/15 rounded-2xl shadow-sm flex flex-col gap-2">
                    <span className="text-muted text-xs font-semibold uppercase tracking-wider">Unread Messages</span>
                    <span className="text-4xl font-bold">{stats?.unreadMessages}</span>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col gap-4">
                <h2 className="text-xl font-semibold">Quick Actions</h2>
                <div className="flex flex-wrap gap-4">
                    <Link to={PATHS.ADMIN.PROJECT_CREATE} className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors">
                        <ICONS.plus className="size-5" />
                        Add New Portfolio Item
                    </Link>
                    <Link to={PATHS.ADMIN.SETTINGS} className="flex items-center gap-2 px-6 py-3 bg-surface border border-muted/15 rounded-xl font-medium hover:bg-emphasis/5 transition-colors">
                        <ICONS.cog className="size-5" />
                        Update Contact Info
                    </Link>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="flex flex-col gap-4">
                <h2 className="text-xl font-semibold">Recent Activity</h2>
                <div className="bg-surface border border-muted/15 rounded-2xl overflow-hidden shadow-sm">
                    <ul className="divide-y divide-muted/10">
                        {activities.map((activity) => (
                            <li key={activity.id} className="p-4 flex flex-col gap-1 hover:bg-emphasis/5 transition-colors">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold text-sm">{activity.profiles?.full_name || 'System'}</span>
                                        <span className="text-2xs bg-emphasis/10 px-2 py-0.5 rounded-full text-muted capitalize">{activity.action}</span>
                                    </div>
                                    <span className="text-2xs text-muted italic">{new Date(activity.created_at).toLocaleString()}</span>
                                </div>
                                <p className="text-sm text-foreground/80">{activity.details}</p>
                            </li>
                        ))}
                        {activities.length === 0 && (
                            <li className="p-8 text-center text-muted italic">No recent activity recorded.</li>
                        )}
                    </ul>
                </div>
            </div>
        </main>
    );
}
