
import { Outlet } from "react-router-dom"

import { NavSideBar } from "@/components/navigation/NavSideBar"
import DashboardNavBar from "@/components/navigation/DashboardNavBar"


export default function AdminLayout() {
    return (
        <div className="flex max-md:flex-col w-full mx-auto">
            <aside className="max-md:hidden sticky top-0 w-1/6 min-w-64 h-screen border-r border-muted/15 z-50 bg-background">
                <NavSideBar />
            </aside>

            <div className="flex flex-col h-screen w-full overflow-y-auto">
                <header className="relative z-50 bg-background">
                    <DashboardNavBar />
                </header>

                <Outlet />

            </div>
        </div>
    )
}
