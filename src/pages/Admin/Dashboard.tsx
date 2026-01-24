
import { AreaChart } from "@/components/ui/AreaChart";
import { AdminService } from "@/services/admin.service";
import { ICONS } from "@/icons";
import { useEffect, useState } from "react";

export default function Dashboard() {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [stats, setStats] = useState<any>(null);
    const [chartData, setChartData] = useState<any[]>([]);
    const [topServices, setTopServices] = useState<any[]>([]);
    const [activities, setActivities] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const COLORS = {
        primary: 'bg-primary',
        secondary: 'bg-secondary',
        success: 'bg-emerald-500',
        warning: 'bg-amber-500',
        info: 'bg-blue-500',
        accent: 'bg-purple-500'
    };

    useEffect(() => {
        async function loadDashboardData() {
            try {
                const [dashboardStats, monthlyRequests, services, logs] = await Promise.all([
                    AdminService.getDashboardStats(),
                    AdminService.getRequestsByMonth(),
                    AdminService.getTopServices(),
                    AdminService.getUsersActivity()
                ]);

                setStats(dashboardStats);
                setChartData(monthlyRequests);
                setTopServices(services);
                setActivities(logs);
            } catch (error) {
                console.error("Failed to load dashboard data:", error);
            } finally {
                setLoading(false);
            }
        }

        loadDashboardData();
    }, []);

    const topKPICards = [
        { id: '1', label: 'Total requests', value: stats?.totalRequests ?? '...', icon: ICONS.rectangleStack, color: 'from-blue-600 to-indigo-600', trend: '+12%' },
        { id: '2', label: 'Total completed', value: stats?.completedRequests ?? '...', icon: ICONS.check, color: 'from-emerald-500 to-teal-500', trend: '+5%' },
        { id: '3', label: 'Total unique clients', value: stats?.totalUsers ?? '...', icon: ICONS.userCircle, color: 'from-amber-500 to-orange-500', trend: '+8%' },
        { id: '4', label: 'Completion rate', value: stats?.completionRate ?? '...', icon: ICONS.chartBar, color: 'from-purple-500 to-pink-500', trend: '+3%' },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-hero">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <>
            <main>
                <section className="content-container relative flex flex-col space-y-16 w-full">
                    <div className="flex flex-col gap-4 w-full h-full">

                        {/* Filters & Search */}
                        <div className="relative flex gap-4 md:gap-6 mb-1">
                            <div className="absolute -bottom-4 w-full border-b border-muted/75 mask-x-to-transparent"></div>
                            {/* Page Header */}
                            <div className="flex items-center gap-2">
                                <ICONS.chartBar className="size-6" />
                                <h1 className="font-semibold text-xl"> Analytics </h1>
                            </div>
                            <div className="relative flex items-center gap-4">
                                <button id="dropdownDefaultButton" onClick={() => setDropdownOpen(v => !v)} type="button"
                                    className="space-x-1 shrink-0 inline-flex items-center justify-center text-body bg-emphasis/75 box-border border border-muted/25 hover:text-heading shadow-xs focus:outline-1 outline-muted/45 font-medium leading-5 rounded-lg text-sm px-3 py-2"
                                >
                                    <ICONS.calendar className="size-4 text-muted" />
                                    <span> Filter by </span>
                                </button>
                                <span className="text-xs"> Jan 13 - Feb 11 </span>
                            </div>
                        </div>

                        {/* KPI cards */}
                        <div className="flex flex-col">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-lg text-heading"> Overall Performance </h3>
                                <span className="text-xs text-muted bg-emphasis/50 px-2 py-1 rounded-full border border-muted/10"> Last 30 days </span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
                                {topKPICards.map((data) => (
                                    <div key={data.id} className="relative group overflow-hidden flex flex-col justify-between p-5 border border-muted/10 shadow-sm bg-surface rounded-2xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                                        <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 bg-gradient-to-br ${data.color} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity`}></div>
                                        <div className="flex items-start justify-between mb-4">
                                            <div className={`p-2.5 rounded-xl bg-gradient-to-br ${data.color} shadow-lg shadow-indigo-500/20`}>
                                                <data.icon className="size-5 text-white" />
                                            </div>
                                            <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded-md">
                                                {data.trend}
                                            </span>
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-xs text-muted uppercase tracking-wider mb-1"> {data.label} </h4>
                                            <span className="text-2xl font-bold text-heading"> {data.value} </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Chart Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
                            <div className="lg:col-span-2 border border-muted/10 shadow-sm bg-surface rounded-2xl overflow-hidden flex flex-col">
                                <div className="p-6 border-b border-muted/5 flex items-center justify-between">
                                    <div>
                                        <h3 className="font-bold text-heading">
                                            Requests Volume
                                        </h3>
                                        <p className="text-xs text-muted mt-1">Growth of created and completed requests.</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/5 border border-blue-500/10 text-[10px] font-bold text-blue-600">
                                            <span className="size-1.5 rounded-full bg-blue-500" /> Requests
                                        </div>
                                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/5 border border-emerald-500/10 text-[10px] font-bold text-emerald-600">
                                            <span className="size-1.5 rounded-full bg-emerald-500" /> Completed
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4 flex-1 min-h-[400px]">
                                    <AreaChart
                                        className="w-full h-full"
                                        data={chartData}
                                        index="date"
                                        categories={["Requests", "Complete"]}
                                        colors={["blue", "emerald"]}
                                        showLegend={false}
                                        showGridLines={true}
                                        onValueChange={(v) => console.log(v)}
                                        allowDecimals={false}
                                        fill="gradient"
                                    />
                                </div>
                            </div>

                            {/* Additional Metrics */}
                            <div className="flex flex-col gap-6 h-full">
                                <div className="flex flex-col border border-muted/10 shadow-sm bg-surface rounded-2xl overflow-hidden h-full">
                                    <div className="p-6 border-b border-muted/5">
                                        <h3 className="font-bold text-heading text-sm"> Popular Services </h3>
                                        <p className="text-xs text-muted mt-1">Distribution by importance.</p>
                                    </div>
                                    <div className="p-6 flex flex-col gap-4 overflow-y-auto max-h-[400px]">
                                        {topServices.length > 0 ? (
                                            topServices.map((service, index) => (
                                                <div key={index} className="group flex flex-col gap-2">
                                                    <div className="flex justify-between items-center text-xs font-semibold">
                                                        <span className="text-heading truncate max-w-[150px]">{service.service_type}</span>
                                                        <span className="text-primary bg-primary/5 px-2 py-0.5 rounded-full">{service.value}</span>
                                                    </div>
                                                    <div className="h-2 w-full bg-muted/10 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full bg-gradient-to-r from-primary to-primary/60 rounded-full transition-all duration-1000 ease-out`}
                                                            style={{ width: `${(service.value / Math.max(...topServices.map(s => s.value))) * 100}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="py-10 text-center text-muted text-xs">No service data available.</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </section>
            </main>

            <section className="w-full h-fit mt-12 mb-40">
                <div className="flex flex-col gap-4 w-full h-full p-6 border border-muted/10 shadow-sm bg-surface rounded-2xl">
                    <div className="flex items-center justify-between pb-6 mb-2 border-b border-muted/5">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                <ICONS.presentationChartLine className="size-5" />
                            </div>
                            <h2 className="font-bold text-xl text-heading"> Admin Activity </h2>
                        </div>
                        <button className="text-xs font-semibold text-primary hover:underline">View All Logs</button>
                    </div>
                    {/* Activity List */}
                    <ul className="flex flex-col gap-6">
                        {activities.map((activity) => (
                            <li key={activity.id} className="group flex gap-4 w-full">
                                <div className="flex-shrink-0 size-10 rounded-full bg-surface-tertiary flex items-center justify-center text-primary group-hover:bg-primary/10 transition-colors border border-muted/5">
                                    <ICONS.user className="size-5" />
                                </div>
                                <div className="flex flex-col gap-1.5 w-full">
                                    <div className="flex justify-between items-center">
                                        <p className="font-bold text-sm text-heading flex items-center gap-2">
                                            {activity.profiles?.full_name || 'System'}
                                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emphasis text-muted uppercase tracking-wider">
                                                {activity.action}
                                            </span>
                                        </p>
                                        <span className="text-xs text-muted flex items-center gap-1">
                                            <ICONS.calendar className="size-3" />
                                            {new Date(activity.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <span className="text-xs text-body/80 leading-relaxed"> {activity.details} </span>
                                </div>
                            </li>
                        ))}
                        {activities.length === 0 && (
                            <li className="text-sm text-center text-muted py-12 flex flex-col items-center gap-2">
                                <ICONS.rectangleStack className="size-8 opacity-20" />
                                <span>No recent activities found in the system.</span>
                            </li>
                        )}
                    </ul>
                </div >
            </section >
        </>
    )
}