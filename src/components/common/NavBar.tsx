
import LogoutButton from "@components/common/Confirm"
import useAuth from "@/hooks/useAuth"
import Logo from "/public/vite.svg"

import { Link } from "react-router-dom"
import { useState } from "react"

import { ICONS } from "@/icons"
import { publicNavItems, clientNavItems } from "@/constants"
import { MenuCard } from "@components/ui/MenuCard"
import { PCTALink, SCTALink } from "@components/ui/CTA"
import { PATHS } from "@/routers/Paths"



export function NavLogo() {
    return (
        <div className="flex items-center gap-2 md:gap-4 min-w-max">
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

export function NavLinks() {
    return (
        <ul className="hidden md:flex justify-center gap-4 w-full">
            {publicNavItems.map((item, index) => (
                <li key={index}>
                    <Link to={item.path} className="font-medium text-sm p-2"> {item.label} </Link>
                </li>
            ))}

        </ul>
    )
}

export function AuthenticatedUserActins() {

    const { isAdmin } = useAuth()
    return (
        <>
            { isAdmin
            ?
                <>
                    {/* Request Project */}
                    <Link to={PATHS.ADMIN.PROJECT_CREATE} title="Create Project" className="max-md:hidden content-center p-2.5 min-w-max font-medium text-sm border border-muted/15 bg-surface/75 rounded-full">
                        Create a Project
                    </Link>

                    <Link to={PATHS.ADMIN.ROOT} title="Dashboard Panel" className="content-center p-2 border border-muted/15 bg-surface/75 rounded-full">
                        <ICONS.presentationChartLine className="size-5 md:size-6" />
                    </Link>
                </>

                :
                <>
                    {/* Request Project */}
                    <Link to={PATHS.CLIENT.REQUEST_SERVICE} title="Request Service" className="max-md:hidden content-center p-2.5 min-w-max font-medium text-sm border border-primary/45 bg-surface/75 rounded-full">
                        Request Service
                    </Link>
                </>
            }

            {/* Chat Nav Page */}
            <Link to={PATHS.CLIENT.CHAT} title="Chats" className="relative content-center p-2 border border-primary/45 border-muted/16 bg-surface/75 rounded-full">
                <ICONS.chat className="size-5 md:size-6" />

                <span className="absolute flex size-3 top-0 left-0">
                    <span className="absolute inline-flex h-full w-full animate-[ping_1.5s_infinite] rounded-full bg-primary/75"></span>
                    <span className="relative inline-flex size-3 rounded-full bg-primary"></span>
                </span>
            </Link>

            {/* User Profile Nav Page */}
            <Link to={PATHS.CLIENT.PROFILE} title="My Profile" className="max-md:hidden content-center p-2 border border-muted/15 bg-surface/75 rounded-full">
                <ICONS.user className="size-5 md:size-6" />
            </Link>
        </>
    )
}

export function AnonymousUserActins() {
    return (
        <>
            {/* Login */}
            <SCTALink to={PATHS.LOGIN} title="Login" className="max-md:hidden"> Login </SCTALink>

            {/* Sign Up */}
            <PCTALink to={PATHS.SIGNUP} title="Sign Up"> Sign Up </PCTALink>

        </>
    )
}


export function PublicNavMenuItems() {
    return (
        <>
            {publicNavItems.map((item, index) => (
                <li key={index} className="w-full">
                    <Link to={item.path} className="flex flex-col gap-1 w-full h-full p-2 border-b border-muted/15">
                        <div className="flex content-center gap-2">
                            {/* Icon */}
                            {/* { ICONS.informationCircle({}) } */}
                            {/* Label */}
                            <h3 className="font-medium text-sm"> {item.label} </h3>
                        </div>

                        {/* Description & Helper */}
                        <div className="w-full">
                            <p className="text-2xs text-muted"> {item.description} </p>
                        </div>
                    </Link>
                </li>
            ))}

            <li key="login" className="w-full">
                <Link to={PATHS.LOGIN} className="flex flex-col gap-1 w-full h-full p-2 border-b border-muted/15">
                    <div className="flex content-center gap-2">
                        {/* Icon */}
                        {/* { ICONS.informationCircle({}) } */}
                        {/* Label */}
                        <h3 className="font-medium text-sm"> Login </h3>
                    </div>

                    {/* Context */}
                    <div className="w-full">
                        <p className="text-2xs text-muted"> Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus culpa  </p>
                    </div>
                </Link>
            </li>

            <li key="signup" className="w-full">
                <Link to={PATHS.SIGNUP} className="flex flex-col gap-1 w-full h-full p-2 border-b border-muted/15">
                    <div className="flex content-center gap-2">
                        {/* Icon */}
                        {/* { ICONS.informationCircle({}) } */}
                        {/* Label */}
                        <h3 className="font-medium text-sm"> Signup </h3>
                    </div>

                    {/* Context */}
                    <div className="w-full">
                        <p className="text-2xs text-muted"> Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus culpa  </p>
                    </div>
                </Link>
            </li>
        </>

    )
}

export function ClientNavMenuItems() {

    const { isAdmin } = useAuth()

    return (

        <>
        {isAdmin &&
            <li id="admin-dashboard-nav-menu-item" className="w-full">
                <Link to={PATHS.ADMIN.ROOT} className="flex flex-col gap-1 w-full h-full p-2 border-b border-muted/15">
                    <div className="flex content-center gap-2">
                        {/* Icon */}
                        <ICONS.presentationChartLine/>
                        {/* Label */}
                        <span className="font-medium text-sm"> Dashboard </span>
                    </div>

                        {/* Context */}
                        <div className="w-full">
                            <p className="text-2xs text-muted"> Admin dashboard & control panel  </p>
                        </div>
                    </Link>
                </li>
            }

            {clientNavItems.map((item, index) => (
                <li key={index} className="w-full">
                    <Link to={item.path} className="flex flex-col gap-1 w-full h-full p-2 border-b border-muted/15">
                        <div className="flex content-center gap-2">
                            {/* Icon */}
                            {/* { ICONS.informationCircle({}) } */}
                            {/* Label */}
                            <span className="font-medium text-sm"> {item.label} </span>
                        </div>

                        {/* Context */}
                        <div className="w-full">
                            <p className="text-2xs text-muted"> Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus culpa  </p>
                        </div>
                    </Link>
                </li>
            ))}

            <li id="logout-nav-menu-item">
                <LogoutButton className="flex flex-col gap-1 w-full h-full px-2 py-4 border-b border-muted/15">
                    <div className="flex content-center gap-2">
                        {/* Icon */}
                        <ICONS.arrowRightStartOnRectangle />
                        {/* Label */}
                        <span className="font-medium text-sm"> Logout </span>
                    </div>
                </LogoutButton>
            </li>

        </>
    )
}

export function NavActions() {
    const { user } = useAuth();
    const navMenuOpenState = useState(false);
    const navMenuOpen = navMenuOpenState[0];
    const setNavMenuOpen = navMenuOpenState[1];

    return (

        <>
            <div className="flex items-center gap-2 md:gap-4">

                {user
                    ?
                    <>
                        <AuthenticatedUserActins />
                        {/* Menu Trigger */}
                        <button type="button" title="Menu" className="content-center p-2 border border-muted/15 bg-surface/75 rounded-full" onClick={() => setNavMenuOpen(!navMenuOpen)}>
                            <ICONS.menu className="size-6" />
                        </button>
                    </>
                    :
                    <>
                        <AnonymousUserActins />
                        {/* Menu Trigger */}
                        <button type="button" title="Menu" className="md:hidden content-center p-2 border border-muted/15 bg-surface/75 rounded-full" onClick={() => setNavMenuOpen(!navMenuOpen)}>
                            <ICONS.menu className="size-6" />
                        </button>
                    </>
                }

            </div>



            {/* Mobile Nav Menu Card Overlay */}
            {navMenuOpen &&
                <MenuCard title={'Menu'} open={navMenuOpen} setOpen={setNavMenuOpen}>
                    {/* Mobile Nav Menu */}

                    <ul className="flex flex-col w-full h-full gap-2 border border-muted/15 p-2 rounded-lg overflow-auto">
                        {user
                            ? <ClientNavMenuItems />
                            : <PublicNavMenuItems />
                        }
                    </ul>

                </MenuCard>
            }

        </>
    )
}

export function NavBar() {
    const { user, loading } = useAuth();

    return (

        <div className="navbar-height absolute flex justify-between gap-2 md:gap-4 w-full px-3 sm:px-6 md:px-9 z-30">
            <NavLogo />

            {/* Prevent flicker or showing links prematurely during loading */}
            {!loading && (
                <>
                    {user
                        ?
                        <nav className="flex items-center justify-end w-full">
                            <NavActions />
                        </nav>
                        :
                        <nav className="flex items-center w-fit md:w-full">
                            <NavLinks />
                            <NavActions />
                        </nav>
                    }
                </>
            )}

        </div>
    )
}
