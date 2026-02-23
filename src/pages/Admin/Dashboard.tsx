import Spinner from "@/components/common/Spinner";
import { AreaChart } from "@/components/ui/AreaChart";
import { AdminService } from "@/services/admin.service";
import { useEffect, useState } from "react";
import { Calendar, ChartBar, Check, ChevronDown, RectangleStack, UserCircle } from "@/icons";

export default function Dashboard() {
    const [timeframe, setTimeframe] = useState<'30d' | '90d' | 'lifetime'>('30d');
    const [stats, setStats] = useState<any>(null);
    const [chartData, setChartData] = useState<any[]>([]);
    const [topServices, setTopServices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    useEffect(() => {
        async function loadDashboardData() {
            setLoading(true);
            try {
                const [dashboardStats, monthlyRequests, services] = await Promise.all([
                    AdminService.getDashboardStats(timeframe),
                    AdminService.getRequestsByMonth(timeframe),
                    AdminService.getTopServices(timeframe),
                ]);

                setStats(dashboardStats);
                setChartData(monthlyRequests);
                setTopServices(services);
            } catch (error) {
                console.error("Failed to load dashboard data:", error);
            } finally {
                setLoading(false);
            }
        }

        loadDashboardData();
    }, [timeframe]);

    const topKPICards = [
        { id: '1', label: 'Total requests', value: stats?.totalRequests ?? '...', icon: RectangleStack, color: 'from-blue-600 to-indigo-600' },
        { id: '2', label: 'Total completed', value: stats?.completedRequests ?? '...', icon: Check, color: 'from-emerald-500 to-teal-500' },
        { id: '3', label: 'Total unique clients', value: stats?.totalUsers ?? '...', icon: UserCircle, color: 'from-amber-500 to-orange-500' },
        { id: '4', label: 'Completion rate', value: stats?.completionRate ?? '...', icon: ChartBar, color: 'from-purple-500 to-pink-500' },
    ];

    const timeframeLabels = {
        '30d': 'Last 30 days',
        '90d': 'Last 90 days',
        'lifetime': 'Lifetime'
    };

    if (loading && !stats) {
        return (
            <div className="flex items-center justify-center h-hero">
                <Spinner status={loading} size="lg" />
            </div>
        );
    }

    return (
        <>
            <main className="h-full">
                <section className="relative flex flex-col w-full h-full pt-4 md:py-6">
                    <div className="flex flex-col gap-4 w-full h-full">

                        {/* Filters & Search */}
                        <div className="relative flex flex-col gap-4">
                            {/* Page Header */}
                            <div className="flex items-center gap-2">
                                <ChartBar className="size-6" />
                                <h1 className="font-semibold text-xl"> Analytics & Overall Performance </h1>
                            </div>
                            <div className="relative flex items-center gap-4">
                                <div className="relative">
                                    <button
                                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                                        className="space-x-1 shrink-0 inline-flex items-center justify-center text-body bg-emphasis/75 box-border border border-muted/20 hover:text-heading focus:outline-1 outline-muted/45 font-medium leading-5 rounded-lg text-sm px-3 py-2"
                                    >
                                        <Calendar className="size-4 text-muted" />
                                        <span> {timeframeLabels[timeframe]} </span>
                                        <ChevronDown className={`size-3 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {isFilterOpen && (
                                        <div className="absolute top-full left-0 mt-2 w-40 bg-surface border border-muted/20 rounded-xl shadow-xl z-50 overflow-hidden">
                                            {(['30d', '90d', 'lifetime'] as const).map((option) => (
                                                <button
                                                    key={option}
                                                    onClick={() => {
                                                        setTimeframe(option);
                                                        setIsFilterOpen(false);
                                                    }}
                                                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-emphasis transition-colors ${timeframe === option ? 'text-primary font-bold bg-primary/5' : 'text-body'}`}
                                                >
                                                    {timeframeLabels[option]}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* KPI cards */}
                        <div className="flex flex-col">
                            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                                {topKPICards.map((data) => (
                                    <div key={data.id} className="relative group/card overflow-hidden flex flex-col justify-between p-4 border border-muted/20 bg-surface rounded-2xl transition-all">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="p-2.5 bg-linear-to-br rounded-lg ring-1 ring-muted/25 bg-emphasis">
                                                <data.icon className="size-6 text-muted" />
                                            </div>
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
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
                            <div className="flex flex-col lg:col-span-2 h-full border border-muted/20 bg-surface rounded-2xl overflow-hidden">
                                <div className="p-6 border-b border-muted/5 flex items-center justify-between">
                                    <div>
                                        <h3 className="font-bold text-heading">
                                            Requests Volume
                                        </h3>
                                        <p className="text-xs text-muted mt-1">Growth of created and completed requests.</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/5 border border-primary/10 text-[10px] font-bold text-primary">
                                            <span className="size-1.5 rounded-full bg-primary" /> Requests
                                        </div>
                                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sky-400/5 border border-sky-400/10 text-[10px] font-bold text-sky-600">
                                            <span className="size-1.5 rounded-full bg-sky-400" /> Completed
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4 flex-1 min-h-[400px]">
                                    {loading ? (
                                        <div className="flex items-center justify-center h-full w-full opacity-50">
                                            <Spinner size="md" />
                                        </div>
                                    ) : (
                                        <AreaChart
                                            className="w-full h-full"
                                            data={chartData}
                                            index="date"
                                            categories={["Requests", "Complete"]}
                                            colors={["primary", "sky"]}
                                            showLegend={false}
                                            showGridLines={true}
                                            onValueChange={(v) => console.log(v)}
                                            allowDecimals={false}
                                            fill="gradient"
                                            tickGap={80}
                                        />
                                    )}
                                </div>
                            </div>

                            {/* Additional Metrics */}
                            <div className="flex flex-col gap-6 h-full min-h-[480px]">
                                <div className="flex flex-col border border-muted/20 bg-surface rounded-2xl overflow-hidden h-full">
                                    <div className="p-6 border-b border-muted/5">
                                        <h3 className="font-bold text-heading text-sm"> Popular Services </h3>
                                        <p className="text-xs text-muted mt-1">Distribution by importance.</p>
                                    </div>
                                    <div className="p-6 flex flex-col gap-4 overflow-y-auto max-h-[400px]">
                                        {loading && topServices.length === 0 ? (
                                            <div className="flex items-center justify-center py-20 opacity-50">
                                                <Spinner size="sm" />
                                            </div>
                                        ) : topServices.length > 0 ? (
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
        </>
    )
}