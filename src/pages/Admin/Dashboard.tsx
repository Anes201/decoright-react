
import { AreaChart } from "@/components/ui/AreaChart";
import { AdminService } from "@/services/admin.service";
import { ICONS } from "@/icons";
import { useEffect, useState } from "react";
import Spinner from "@/components/common/Spinner";

export default function Dashboard() {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [stats, setStats] = useState<any>(null);
    const [chartData, setChartData] = useState<any[]>([]);
    const [topServices, setTopServices] = useState<any[]>([]);
    const [activities, setActivities] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

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
        { id: '1', label: 'Total requests', value: stats?.totalRequests ?? '...' },
        { id: '2', label: 'Total completed', value: stats?.completedRequests ?? '...' },
        { id: '3', label: 'Total unique clients', value: stats?.totalUsers ?? '...' },
        { id: '4', label: 'Completion rate', value: stats?.completionRate ?? '...' },
    ];

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-hero">
                <Spinner status={loading} size="lg"/>
                <span className="text-sm text-muted mt-2"> Loading dashboard... </span>
            </div>
        );
    }

    return (
        <>
            <main>
                <section className="content-container relative flex flex-col md:pt-8 w-full">
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
                                    <ICONS.chevronDown className="size-4 text-muted" />
                                </button>
                                <span className="text-xs"> Jan 13 - Feb 11 </span>
                            </div>
                        </div>

                        {/* KPI cards */}
                        <div className="flex flex-col">
                            <h3 className="font-medium mx-1 my-2"> Overall performance </h3>
                            <div className="grid grid-cols-[repeat(auto-fit,minmax(12rem,1fr))] gap-4 w-full">
                                {topKPICards.map((data) => (
                                    <div key={data.id} className="flex flex-col justify-between min-h-20 p-3 border border-muted/15 shadow-xs bg-surface rounded-xl">
                                        <h4 className="font-medium text-sm text-muted"> {data.label} </h4>
                                        <span className="font-medium text-foreground"> {data.value} </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Chart */}
                        <div className="flex max-lg:flex-col gap-4 h-full">
                            <div className="w-full border border-muted/15 shadow-xs bg-surface rounded-xl">
                                <div className="p-3 md:p-4">
                                    <h3 className="font-medium">
                                        Created & Completed Requests Over Time
                                    </h3>
                                </div>
                                <AreaChart
                                    className="py-2 md:py-4 w-full h-100"
                                    data={chartData}
                                    index="date"
                                    categories={["Requests", "Complete"]}
                                    onValueChange={(v) => console.log(v)}
                                    allowDecimals={false}
                                />
                            </div>
                            {/* additional metrics */}
                            <div className="flex flex-col gap-4 w-full lg:w-2/3 xl:w-2/5 h-full">
                                <div className="flex flex-col gap-4 w-full p-3 border-muted/15 shadow-xs bg-surface rounded-xl">
                                    <h5 className="font-medium text-sm"> Top Services By Request </h5>
                                    <ol className="flex flex-col gap-4">
                                        {topServices.map((service, index) => (
                                            <li key={index} className="flex justify-between text-xs pb-4 last:pb-2 border-b border-muted/25 last:border-0">
                                                {service.service_type}
                                                <span className="font-bold mx-2"> {service.value} </span>
                                            </li>
                                        ))}
                                    </ol>
                                </div>
                            </div>
                        </div>
                    </div>

                </section>
            </main>

            <section className="w-full h-fit mt-4 mb-40">
                <div className="flex flex-col gap-4 w-full h-full p-4 bg-surface rounded-xl shadow-xs">
                    <h2 className="font-medium text-2xl w-full pb-4 mb-2 border-b border-muted/25" > Admin Activity </h2>

                    {/* Activity List */}
                    <ul className="flex flex-col gap-4 overscroll-y-auto">
                        {activities.map((activity) => (
                            <li key={activity.id} className="flex gap-3 w-full pb-4 last:pb-2 border-b border-muted/20 last:border-0">
                                <div className="flex flex-col gap-1 w-full">
                                    <div className="flex justify-between items-center">
                                        <p className="font-bold text-xs">
                                            {activity.profiles?.full_name || 'System'}
                                            <span className="font-medium text-2xs text-muted before:content-['•'] ml-1">
                                                {activity.action}
                                            </span>
                                        </p>
                                        <span className="text-xs text-muted">
                                            {new Date(activity.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <span className="text-xs"> {activity.details} </span>
                                </div>
                            </li>
                        ))}
                        {activities.length === 0 && (
                            <li className="text-sm text-muted py-4"> No recent activities found. </li>
                        )}
                    </ul>
                </div>
            </section>
        </>
    )
}