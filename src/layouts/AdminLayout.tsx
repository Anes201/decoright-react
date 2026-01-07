
import { Outlet } from "react-router-dom"

import { NavBar } from "@/components/common/NavBar"

export default function AdminLayout () {
    return (
        <>
            <header className="md:hidden content-container relative flex justify-center w-full">
                <NavBar/>
            </header>

            <aside className="max-md:hidden w-1/4 h-full border-r border-muted/15 bg-green-400">

            </aside>

            <Outlet/>
        </>
    )
}
