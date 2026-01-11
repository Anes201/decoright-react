
import { adminNavItems } from "@/constants"
import Logo from "/public/vite.svg"
import { NavLink } from "react-router-dom"
import { ICONS } from "@/icons"
import LogoutButton from "./Confirm"

function NavLogo() {
    return (
        <div className="flex items-center gap-2 md:gap-4 min-w-max w-full h-fit py-2 px-4">
            <div className="w-8 md:w-10 aspect-square">
                <img src={Logo} alt="logo" height="40" width="40" className="w-full object-cover rounded-lg" loading="lazy" />
            </div>
            <div className="flex flex-col">
                <h3 className="text-sm md:text-base font-medium"> Deco Right </h3>
                <span className="text-3xs md:text-2xs text-muted hover:text-foreground" title="Decor agency">
                    Admin Panel
                </span>
            </div>
        </div>
    )
}

function NavLinkList() {
    return (

        <ul className="flex flex-col gap-2 w-full h-full">
            {adminNavItems.map((item, index) => (
                <li key={index}>
                    <NavLink to={item.path} className="flex font-medium text-sm px-4 py-2 border border-transparent hover:border-muted/15 hover:bg-emphasis/50 rounded-lg"> {item.label} </NavLink>
                </li>
            ))}
        </ul>

    )
}

function NavActionList() {
    return (

        <ul className="flex flex-col gap-2 w-full h-fit p-2">
            <li key={'action-item-logout'}>
                <LogoutButton className="flex justify-between font-medium text-sm p-2 w-full border border-muted/15 hover:bg-surface/75 rounded-lg">
                    <span className="px-2">Logout</span>
                    <ICONS.arrowRightStartOnRectangle/>
                </LogoutButton>
            </li>
        </ul>

    )
}



export function NavSideBar () {

    return (

        <div className="flex flex-col gap-4 w-full h-full px-2 py-4 bg-surface/50">
            <NavLogo/>
            <nav className="p-2 border-y border-muted/15 h-full overflow-y-auto min-scrollbar">
                <NavLinkList/>
            </nav>

            <NavActionList/>

        </div>


    )
}