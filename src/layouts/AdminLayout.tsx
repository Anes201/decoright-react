
import { Outlet } from "react-router-dom"

import { NavSideBar } from "@/components/common/NavSideBar"
import DashboardNavBar from "@/components/common/DashboardNavBar"


export default function AdminLayout () {
    return (
        <div className="flex max-md:flex-col">
            <aside className="max-md:hidden sticky top-0 w-1/6 min-w-64 h-screen border-r border-muted/15">
                <NavSideBar/>
            </aside>

            <div className="content-container flex flex-col w-full h-full mb-5">

                <header className="content-container relative flex justify-center w-full z-30">
                    <DashboardNavBar/>
                </header>

                <Outlet/>
            </div>
        </div>
    )
}
