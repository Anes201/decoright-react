
import { AreaChart } from "@/components/ui/AreaChart";
import { additionalKPICards, topKPICards, topServicesByRequest, usersActivityLogs } from "@/constants";
import { ICONS } from "@/icons";
import { useState } from "react";

export default function Dashboard () {

    const [dropdownOpen, setDropdownOpen] = useState(false);

    const chartdata = [
    {
        date: "Jan 23",
        Requests: 20,
        Completed: 4,
    },
    {
        date: "Feb 23",
        Requests: 18,
        Completed: 7,
    },
    {
        date: "Mar 23",
        Requests: 12,
        Completed: 2,
    },
    {
        date: "Apr 23",
        Requests: 22,
        Completed: 8,
    },
    {
        date: "May 23",
        Requests: 6,
        Completed: 11,
    },
    {
        date: "Jun 23",
        Requests: 8,
        Completed: 4,
    },
    {
        date: "Jul 23",
        Requests: 16,
        Completed: 12,
    },
    {
        date: "Aug 23",
        Requests: 22,
        Completed: 4,
    },
    {
        date: "Sep 23",
        Requests: 28,
        Completed: 9,
    },
    {
        date: "Oct 23",
        Requests: 12,
        Completed: 1,
    },
    {
        date: "Nov 23",
        Requests: 18,
        Completed: 6,
    },
    {
        date: "Dec 23",
        Requests: 21,
        Completed: 16,
    },
    ]


    return (
        <>
            <main>
                <section className="min-h-hero content-container relative flex flex-col space-y-16 w-full">
                <div className="flex flex-col gap-4 w-full h-full">
                    {/* Page Header */}
                    <div className="flex items-center gap-2">
                        <ICONS.chartBar className="size-6" />
                        <h1 className="font-semibold text-2xl mb-2"> Analytics </h1>
                    </div>

                    {/* Filters & Search */}

                    <div>
                        <div className="relative flex items-center gap-4">
                            <button id="dropdownDefaultButton" onClick={() => setDropdownOpen(v => !v)} type="button"
                                className="space-x-1 shrink-0 inline-flex items-center justify-center text-body bg-emphasis/75 box-border border border-muted/25 hover:text-heading shadow-xs focus:outline-1 outline-muted/45 font-medium leading-5 rounded-lg text-sm px-3 py-2"
                                >
                                <ICONS.calendar className="size-4 text-muted" />
                                <span className="max-md:hidden"> Filter by </span>
                            </button>

                            <span className="text-xs"> Jan 13 - Feb 11 </span>
                        </div>
                    </div>

                    {/* KPI cards */}
                    <div className="flex flex-col">
                        <h3 className="font-medium mx-1 my-2"> Overall performance </h3>
                        <div className="grid grid-cols-[repeat(auto-fit,minmax(12rem,1fr))] gap-4 w-full">

                            {topKPICards.map((data) =>(
                                <div key={data.id} className="flex flex-col justify-between min-h-20 p-3 border border-muted/15 shadow-xs bg-surface rounded-xl">
                                    <h4 className="font-medium text-sm text-muted"> {data.label} </h4>
                                    <data value={data.data_value}> <span className="font-medium text-foreground"> {data.value} </span> </data>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Chart */}
                    <div className="flex max-lg:flex-col gap-4 h-full">
                        <div className="w-full h-fit border border-muted/15 shadow-xs bg-surface rounded-xl">

                        <AreaChart
                            className="py-4 md:py-6 w-full h-100 bg-surface rounded-xl shadow-xs"
                            data={chartdata}
                            index="date"
                            categories={["Requests", "Completed"]}
                            onValueChange={(v) => console.log(v)}
                            allowDecimals={false}
                            />

                        </div>
                        {/* additional metrics */}
                        <div className="flex flex-col gap-4 w-full lg:w-2/3 xl:w-2/5 h-full">
                            <div className="flex flex-col gap-4 w-full p-3 border-muted/15 shadow-xs bg-surface rounded-xl">
                                <h5 className="font-medium text-sm"> Top Services By Request </h5>
                                <ol className="flex flex-col gap-4">
                                    {topServicesByRequest.map((service)=>(
                                        <li className="flex justify-between text-xs pb-4 last:pb-2 border-b border-muted/25 last:border-0"> {service.service_type} <span className="font-bold mx-2"> {service.value} </span> </li>
                                    ))}
                                </ol>
                            </div>
                            <div className="grid grid-cols-[repeat(auto-fit,minmax(8rem,1fr))] gap-4">
                                {additionalKPICards.map((data)=>(
                                    <div key={data.id} className="flex flex-col gap-4 w-full p-3 border border-muted/15 shadow-xs bg-surface rounded-xl">
                                        <h5 className="font-medium text-xs text-muted"> {data.label} </h5>
                                        <data value={data.data_value}> <span className="font-medium text-foreground"> {data.value} </span> </data>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                </section>
            </main>

            <section className="w-full h-fit mt-4 mb-40">
                <div className="flex flex-col gap-4 w-full h-full p-4 bg-surface rounded-xl">

                    <h2 className="font-medium text-2xl w-full pb-4 mb-2 border-b border-muted/25" > Users Activity </h2>

                    {/* Activity List */}
                    <ul className="flex flex-col gap-4 overscroll-y-auto">
                        {usersActivityLogs.map((activity) => (
                            <li className="flex gap-3 w-full pb-4 last:pb-2 border-b border-muted/20 last:border-0">
                                <div className="flex w-10 h-fit aspect-square rounded-full overflow-hidden">
                                    <img src={activity.user.img} alt="User Profile" className="w-full h-full object-cover" />
                                </div>
                                <div className="flex max-md:flex-col md:justify-between md:items-center gap-1 w-full">
                                    <div className="flex flex-col gap-0.5 justify-center w-full">
                                        <p className="font-bold text-xs">  {activity.user.full_name}  <span className="font-medium text-2xs text-muted before:content-['•']"> {activity.user.role} </span> </p>
                                        <span className="text-xs"> {activity.content} </span>
                                    </div>
                                    <div className="w-fit min-w-max">
                                        <span className="text-xs"> {activity.date} </span>
                                    </div>
                                </div>
                            </li>
                        ))}

                    </ul>
                </div>
            </section>
        </>

    )
}