
import { Outlet } from "react-router-dom"
import { NavBar } from "@/components/common/NavBar"

export default function ClientLayout () {
    return (
        <>
            <header className="content-container relative flex justify-center w-full z-30">
                <NavBar/>
            </header>

            <Outlet/>

        </>
    )
}