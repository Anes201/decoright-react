import Spinner from "@/components/common/Spinner";
import { AdminService } from "@/services/admin.service";
import { useEffect, useRef, useState } from "react";
import { Calendar, ChartBar, Check, ChevronDown, RectangleStack, UserCircle } from "@/icons";
import {
    Area,
    AreaChart as RechartsAreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

// ─── Chart colours (raw values — Recharts SVG can't read CSS variables) ───────
const COLOR_REQUESTS = "#7c3aed";   // primary (violet)
const COLOR_COMPLETE = "#38bdf8";   // sky-400

// ─── Custom tooltip ────────────────────────────────────────────────────────────
function ChartTooltip({ active, payload, label }: any) {
    if (!active || !payload?.length) return null;
    return (
        <div className="rounded-xl border border-muted/20 bg-surface shadow-lg text-xs overflow-hidden">
            <div className="px-3 py-2 border-b border-muted/10">
                <p className="font-semibold text-heading">{label}</p>
            </div>
            <div className="px-3 py-2 flex flex-col gap-1.5">
                {payload.map((item: any) => (
                    <div key={item.dataKey} className="flex items-center justify-between gap-6">
                        <div className="flex items-center gap-1.5">
                            <span
                                className="size-2 rounded-full shrink-0"
                                style={{ background: item.color }}
                            />
                            <span className="text-muted">{item.name}</span>
                        </div>
                        <span className="font-bold tabular-nums text-heading">{item.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── Main component ─────────────────────────────────────────────────────────────
export default function Dashboard() {
    const [timeframe, setTimeframe] = useState<'30d' | '90d' | 'lifetime'>('30d');
    const [stats, setStats] = useState<any>(null);
    const [chartData, setChartData] = useState<any[]>([]);
    const [topServices, setTopServices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const filterRef = useRef<HTMLDivElement>(null);

    // Close timeframe dropdown on outside click
    useEffect(() => {
        function handleOutsideClick(e: MouseEvent) {
            if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
                setIsFilterOpen(false);
            }
        }
        document.addEventListener('mousedown', handleOutsideClick);
        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, []);

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
        { id: '1', label: 'Total requests', value: stats?.totalRequests ?? '...', icon: RectangleStack, borderColor: 'border-l-blue-500' },
        { id: '2', label: 'Total completed', value: stats?.completedRequests ?? '...', icon: Check, borderColor: 'border-l-emerald-500' },
        { id: '3', label: 'Total unique clients', value: stats?.totalUsers ?? '...', icon: UserCircle, borderColor: 'border-l-amber-500' },
        { id: '4', label: 'Completion rate', value: stats?.completionRate ?? '...', icon: ChartBar, borderColor: 'border-l-purple-500' },
    ];

    const timeframeLabels = {
        '30d': 'Last 30 days',
        '90d': 'Last 90 days',
        'lifetime': 'Lifetime'
    };

    const isLifetime = timeframe === 'lifetime';

    if (loading && !stats) {
        return (
            <div className="flex items-center justify-center h-hero">
                <Spinner status={loading} size="lg" />
            </div>
        );
    }

    return (
        <main className="h-full">
            <section className="relative flex flex-col w-full h-full pt-4 md:py-6">
                <div className="flex flex-col gap-4 w-full">

                    {/* Page Header + Timeframe filter */}
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                        <div className="flex items-center gap-2">
                            <ChartBar className="size-6" />
                            <h1 className="font-semibold text-xl">Analytics & Overall Performance</h1>
                        </div>
                        <div className="relative" ref={filterRef}>
                            <button
                                onClick={() => setIsFilterOpen(!isFilterOpen)}
                                className="shrink-0 inline-flex items-center gap-1.5 text-body bg-emphasis/75 border border-muted/20 hover:text-heading focus:outline-1 outline-muted/45 font-medium rounded-lg text-sm px-3 py-2"
                            >
                                <Calendar className="size-4 text-muted" />
                                <span>{timeframeLabels[timeframe]}</span>
                                <ChevronDown className={`size-3 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {isFilterOpen && (
                                <div className="absolute top-full right-0 mt-2 w-40 bg-surface border border-muted/20 rounded-xl shadow-xl z-50 overflow-hidden">
                                    {(['30d', '90d', 'lifetime'] as const).map((option) => (
                                        <button
                                            key={option}
                                            onClick={() => { setTimeframe(option); setIsFilterOpen(false); }}
                                            className={`w-full text-left px-4 py-2.5 text-sm hover:bg-emphasis transition-colors ${timeframe === option ? 'text-primary font-bold bg-primary/5' : 'text-body'}`}
                                        >
                                            {timeframeLabels[option]}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* KPI cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 w-full">
                        {topKPICards.map((data) => (
                            <div key={data.id} className={`relative overflow-hidden flex flex-col justify-between p-4 border border-muted/20 border-l-4 ${data.borderColor} bg-surface rounded-2xl`}>
                                <div className="flex items-start justify-between mb-3">
                                    <div className="p-2 bg-emphasis rounded-lg ring-1 ring-muted/25">
                                        <data.icon className="size-5 text-muted" />
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-medium text-xs text-muted uppercase tracking-wider mb-1">{data.label}</h4>
                                    <span className="text-2xl font-bold text-heading">{data.value}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Chart + Popular Services */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

                        {/* Requests Volume chart */}
                        <div className="flex flex-col lg:col-span-2 border border-muted/20 bg-surface rounded-2xl overflow-hidden">

                            {/* Chart header */}
                            <div className="px-5 py-4 border-b border-muted/10 flex items-start justify-between gap-4 flex-wrap">
                                <div>
                                    <h3 className="font-bold text-heading">Requests Volume</h3>
                                    <p className="text-xs text-muted mt-0.5">Growth of created and completed requests over time.</p>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-violet-500/5 border border-violet-500/15 text-[11px] font-semibold text-violet-600">
                                        <span className="size-1.5 rounded-full bg-violet-500 shrink-0" />
                                        Requests
                                    </div>
                                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sky-400/5 border border-sky-400/15 text-[11px] font-semibold text-sky-500">
                                        <span className="size-1.5 rounded-full bg-sky-400 shrink-0" />
                                        Completed
                                    </div>
                                </div>
                            </div>

                            {/* Chart body — fixed height drives ResponsiveContainer */}
                            <div className="h-[260px] md:h-[380px] p-2 pt-4">
                                {loading ? (
                                    <div className="flex items-center justify-center h-full w-full opacity-40">
                                        <Spinner size="md" />
                                    </div>
                                ) : chartData.length === 0 ? (
                                    <div className="flex items-center justify-center h-full text-muted text-xs">
                                        No data available for this period.
                                    </div>
                                ) : (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RechartsAreaChart
                                            data={chartData}
                                            margin={{
                                                top: 4,
                                                right: 8,
                                                left: -20,
                                                bottom: isLifetime ? 32 : 4,
                                            }}
                                        >
                                            <defs>
                                                <linearGradient id="gradRequests" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="0%" stopColor={COLOR_REQUESTS} stopOpacity={0.18} />
                                                    <stop offset="100%" stopColor={COLOR_REQUESTS} stopOpacity={0} />
                                                </linearGradient>
                                                <linearGradient id="gradComplete" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="0%" stopColor={COLOR_COMPLETE} stopOpacity={0.18} />
                                                    <stop offset="100%" stopColor={COLOR_COMPLETE} stopOpacity={0} />
                                                </linearGradient>
                                            </defs>

                                            <CartesianGrid
                                                strokeDasharray="3 3"
                                                stroke="currentColor"
                                                strokeOpacity={0.07}
                                                vertical={false}
                                            />

                                            <XAxis
                                                dataKey="date"
                                                axisLine={false}
                                                tickLine={false}
                                                tick={(props: any) => {
                                                    const { x, y, payload } = props;
                                                    return (
                                                        <text
                                                            x={x}
                                                            y={y}
                                                            dy={isLifetime ? 0 : 4}
                                                            textAnchor={isLifetime ? 'end' : 'middle'}
                                                            transform={isLifetime ? `rotate(-40, ${x}, ${y})` : undefined}
                                                            style={{ fontSize: 10, fill: 'currentColor', opacity: 0.5 }}
                                                        >
                                                            {payload.value}
                                                        </text>
                                                    );
                                                }}
                                                minTickGap={isLifetime ? 48 : 40}
                                                interval="equidistantPreserveStart"
                                            />

                                            <YAxis
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fontSize: 10, fill: 'currentColor', opacity: 0.5 }}
                                                allowDecimals={false}
                                                width={40}
                                            />

                                            <Tooltip
                                                content={<ChartTooltip />}
                                                cursor={{ stroke: 'currentColor', strokeOpacity: 0.12, strokeWidth: 1 }}
                                                animationDuration={150}
                                            />

                                            <Area
                                                type="monotone"
                                                dataKey="Requests"
                                                name="Requests"
                                                stroke={COLOR_REQUESTS}
                                                strokeWidth={2}
                                                fill="url(#gradRequests)"
                                                dot={false}
                                                activeDot={{ r: 4, stroke: '#fff', strokeWidth: 2, fill: COLOR_REQUESTS }}
                                                isAnimationActive={true}
                                                animationDuration={600}
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="Complete"
                                                name="Completed"
                                                stroke={COLOR_COMPLETE}
                                                strokeWidth={2}
                                                fill="url(#gradComplete)"
                                                dot={false}
                                                activeDot={{ r: 4, stroke: '#fff', strokeWidth: 2, fill: COLOR_COMPLETE }}
                                                isAnimationActive={true}
                                                animationDuration={600}
                                            />
                                        </RechartsAreaChart>
                                    </ResponsiveContainer>
                                )}
                            </div>
                        </div>

                        {/* Popular Services */}
                        <div className="flex flex-col border border-muted/20 bg-surface rounded-2xl overflow-hidden">
                            <div className="px-5 py-4 border-b border-muted/10">
                                <h3 className="font-bold text-heading text-sm">Popular Services</h3>
                                <p className="text-xs text-muted mt-0.5">Distribution by request volume.</p>
                            </div>
                            <div className="p-5 flex flex-col gap-4 flex-1 overflow-y-auto">
                                {loading && topServices.length === 0 ? (
                                    <div className="flex items-center justify-center py-12 opacity-40">
                                        <Spinner size="sm" />
                                    </div>
                                ) : topServices.length > 0 ? (
                                    topServices.map((service, index) => {
                                        const maxVal = Math.max(...topServices.map(s => s.value));
                                        const pct = Math.round((service.value / maxVal) * 100);
                                        return (
                                            <div key={index} className="flex flex-col gap-1.5">
                                                <div className="flex justify-between items-center text-xs font-semibold">
                                                    <span className="text-heading truncate pr-2">{service.service_type}</span>
                                                    <span className="text-primary bg-primary/5 px-2 py-0.5 rounded-full shrink-0">{service.value}</span>
                                                </div>
                                                <div className="h-1.5 w-full bg-muted/10 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-primary to-primary/50 rounded-full transition-all duration-700 ease-out"
                                                        style={{ width: `${pct}%` }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="py-10 text-center text-muted text-xs">No service data available.</div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </main>
    );
}
