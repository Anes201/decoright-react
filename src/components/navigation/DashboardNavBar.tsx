
import { Link } from "react-router-dom"
import { useState } from "react"
import { adminMenuNav } from "@/constants/navigation"
import { MenuCard } from "@components/ui/MenuCard"
import { PATHS } from "@/routers/Paths"
import { Chat, Home, Menu, Folder } from "@/icons";


const Logo = "/Logo.PNG";

export function NavLogo() {
    return (
        <div className="md:hidden max-md:flex items-center gap-2 md:gap-4 min-w-max">

            <div className="content-center w-8 md:w-10 aspect-square">
                <img src={Logo} alt="logo" height="40" width="40" className="w-full object-cover rounded-lg" loading="lazy" />
            </div>

            <div className="flex flex-col">
                <h3 className="text-sm md:text-base font-medium"> Deco Right </h3>
                <span className="text-3xs md:text-2xs text-muted hover:text-foreground" title="Decor agency">
                    Decor agency
                </span>
            </div>
        </div>
    )
}


export function NavMenuItems() {
    return (

        <>
            {adminMenuNav.map((item: any, index) => (
                <li key={index} className="w-full">
                    <Link to={item.path} className="flex flex-col gap-1 w-full h-full p-2 border-b border-muted/15">
                        <div className="flex content-center gap-2">
                            {/* Icon */}
                            {item.icon ? <item.icon /> : <Folder />}
                            {/* Label */}
                            <h3 className="font-medium text-sm"> {item.label} </h3>
                        </div>

                        {/* Context */}
                        <div className="w-full">
                            <p className="text-2xs text-muted"> {item.description} </p>
                        </div>
                    </Link>
                </li>
            ))}
        </>
    )
}

export function NavActions() {

    const [navMenuOpen, setNavMenuOpen] = useState(false);

    return (

        <>
            <div className="flex items-center gap-2 md:gap-4">

                {/* Request Project */}
                <Link to={PATHS.ADMIN.PROJECT_CREATE} title="Create a Project" className="max-md:hidden content-center p-2.5 min-w-max font-medium text-sm border border-muted/15 bg-surface rounded-full">
                    Create a Project
                </Link>

                {/* Chat Link */}
                <Link to={PATHS.ADMIN.CHAT} title="Chat" className="relative content-center p-2 border border-primary/45 border-muted/15 bg-surface rounded-full">
                    <Chat className="size-5 md:size-6" />

                    <span className="absolute flex size-3 top-0 left-0">
                        <span className="absolute inline-flex h-full w-full animate-[ping_1.5s_infinite] rounded-full bg-primary/75"></span>
                        <span className="relative inline-flex size-3 rounded-full bg-primary"></span>
                    </span>
                </Link>

                {/* User Profile Nav Page */}
                <Link to={PATHS.CLIENT.ROOT} title="Client Home Page" className="max-md:hidden content-center p-2 border border-muted/15 bg-surface rounded-full">
                    <Home className="size-5 md:size-6" />
                </Link>

                {/* Menu Trigger */}
                <button type="button" title="Menu" className="md:hidden content-center p-2 border border-muted/15 bg-surface rounded-full" onClick={() => setNavMenuOpen(!navMenuOpen)}>
                    <Menu className="size-5 md:size-6" />
                </button>
            </div>

            {/* Mobile Nav Menu Card Overlay */}
            {navMenuOpen &&
                <MenuCard title={'Menu'} open={navMenuOpen} setOpen={setNavMenuOpen}>
                    <ul className="flex flex-col w-full h-full gap-2 border border-muted/15 p-2 rounded-lg overflow-auto">
                        <li className="w-full">
                            <Link
                                to={PATHS.CLIENT.ROOT}
                                onClick={() => setNavMenuOpen(false)}
                                className="flex items-center gap-2 w-full p-2 border-b border-muted/15"
                            >
                                <Home className="size-4 text-muted" />
                                <h3 className="font-medium text-sm">Go to Website</h3>
                            </Link>
                        </li>
                        <NavMenuItems />
                    </ul>
                </MenuCard>
            }

        </>
    )
}

export default function DashboardNavBar() {

    return (

        <div className="navbar-height lg:absolute flex justify-between md:justify-end gap-2 md:gap-4 w-full px-3 sm:px-6 md:px-9 pointer-events-none">
            <NavLogo />
            <nav className="flex items-center justify-end w-fit pointer-events-auto">
                <NavActions />
            </nav>
        </div>


    )
}




