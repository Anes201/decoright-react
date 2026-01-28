
import { Outlet } from "react-router-dom"

import { NavSideBar } from "@/components/common/NavSideBar"
import DashboardNavBar from "@/components/common/DashboardNavBar"


export default function AdminLayout() {
    return (
        <div className="flex max-md:flex-col">
            <aside className="max-md:hidden sticky top-0 w-1/6 min-w-64 h-screen border-r border-muted/15 z-50 bg-background">
                <NavSideBar />
            </aside>

            <div className="flex-1 flex flex-col h-screen overflow-hidden min-w-0 bg-background relative">
                <header className="relative z-30 flex-none">
                    <DashboardNavBar />
                </header>

                <div className="flex-1 overflow-auto">
                    <Outlet />
                </div>
            </div>
        </div>
    )
}
