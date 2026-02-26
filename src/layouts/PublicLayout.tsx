

import { Outlet } from "react-router-dom"

import { NavBar } from "@/components/navigation/NavBar"
import Footer from "@/components/navigation/Footer"

export default function PublicLayout () {
    return (
        <>
            <header className="content-container relative flex justify-center w-full z-30">
                <NavBar/>
            </header>

            <Outlet/>

            <footer className="relative flex w-full h-full z-30 pt-12">
                <Footer/>
            </footer>

        </>
    )
}