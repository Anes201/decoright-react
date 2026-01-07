

import { Outlet } from "react-router-dom"

import { NavBar } from "@/components/common/NavBar"
import Footer from "@/components/common/Footer"

export default function PublicLayout () {
    return (
        <>
            <header className="content-container relative flex justify-center w-full z-30">
                <NavBar/>
            </header>

            <Outlet/>

            <footer className="content-center">
                <Footer/>
            </footer>

        </>
    )
}