
import useAuth from "@/hooks/useAuth"
import Logo from "/public/vite.svg"
import i18n from "@/utils/i18n"

import { Link } from "react-router-dom"
import { createContext, useContext, useState } from "react"

import { LogoutButton } from "@components/common/Confirm"
import { ICONS } from "@/icons"
import { publicMenuItems, clientMenuItems, languages } from "@/constants/navigation"
import { MenuCard } from "@components/ui/MenuCard"
import { PCTALink, SCTALink } from "@components/ui/CTA"
import { PATHS } from "@/routers/Paths"
import { SelectDropDownMenu } from "@components/ui/Select"
import { allowedLocales } from "@/constants"
import { useTranslation } from "react-i18next"
import MenuLanguageSelectorModal from "../ui/LanguageSelectorModel"

const UserContext = createContext<any>(null);
const MenuContext = createContext<any>(undefined);

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
        <ul className="hidden lg:flex justify-center gap-4 w-full">
            {publicMenuItems().map((item, index) => (
                <li key={index}>
                    <Link to={item.path} className="font-medium text-sm p-2"> {item.label} </Link>
                </li>
            ))}

        </ul>
    )
}

export function AuthenticatedUserActins() {

    const { user, isAdmin } = useContext(UserContext);
    if (!user) return;

    const [chatMenuOpen, setChatMenuOpen] = useState<boolean>(false);
    const [navMenuOpen, setNavMenuOpen] = useState<boolean>(false);

    return (
        <>
            <div className="flex items-center gap-2 md:gap-4">

                {isAdmin

                    ? <>
                        {/* Request Project */}
                        <Link to={PATHS.ADMIN.PROJECT_CREATE} title="Create Project" className="max-md:hidden content-center p-2.5 min-w-max font-medium text-sm border border-muted/15 bg-surface/75 rounded-full">
                            Create a Project
                        </Link>

                        <Link to={PATHS.ADMIN.ROOT} title="Dashboard Panel" className="max-md:hidden content-center p-2 border border-muted/15 bg-surface/75 rounded-full">
                            <ICONS.presentationChartLine className="size-5 md:size-6" />
                        </Link>

                        {/* Chat Menu Card */}
                        <button type="button" title="Chat Menu" onClick={() => setChatMenuOpen(!chatMenuOpen)}
                            className="relative content-center p-2 border border-primary/45 border-muted/15 bg-surface/75 rounded-full">
                            <ICONS.chat className="size-5 md:size-6" />

                            <span className="absolute flex size-3 top-0 left-0">
                                <span className="absolute inline-flex h-full w-full animate-[ping_1.5s_infinite] rounded-full bg-primary/75"></span>
                                <span className="relative inline-flex size-3 rounded-full bg-primary"></span>
                            </span>
                        </button>
                    </>

                    : <>
                        {/* Request Project */}
                        <Link to={PATHS.CLIENT.REQUEST_SERVICE} title="Request Service" className="max-md:hidden content-center p-2 min-w-max font-medium text-sm border border-primary/45 bg-surface/75 rounded-full">
                            Request Service
                        </Link>

                        {/* Chat Nav Page */}
                        <Link to={PATHS.CLIENT.CHAT} title="Chats" className="relative content-center p-1.5 md:p-2 border border-primary/45 border-muted/15 bg-surface/75 rounded-full">
                            <ICONS.chat className="size-5 md:size-6" />

                            <span className="absolute flex size-3 top-0 left-0">
                                <span className="absolute inline-flex h-full w-full animate-[ping_1.5s_infinite] rounded-full bg-primary/75"></span>
                                <span className="relative inline-flex size-3 rounded-full bg-primary"></span>
                            </span>
                        </Link>

                    </>

                }

                {/* User Profile Nav Page */}
                <Link to={PATHS.CLIENT.ACCOUNT_PROFILE} title="My Profile" className="max-md:hidden content-center p-1.5 md:p-2 border border-muted/15 bg-surface/75 rounded-full">
                    <ICONS.user className="size-5 md:size-6" />
                </Link>

                {/* Menu Trigger */}
                <button type="button" title="Menu" onClick={() => setNavMenuOpen(!navMenuOpen)}
                    className="content-center p-1.5 md:p-2 border border-muted/15 bg-surface/75 rounded-full">
                    <ICONS.menu className="size-5 md:size-6" />
                </button>

            </div>

            {chatMenuOpen &&
                <MenuCard title={'Menu'} open={chatMenuOpen} setOpen={setChatMenuOpen}>
                    {/* Mobile Nav Menu */}

                    <ul className="flex flex-col w-full h-full gap-2 border border-muted/15 p-2 rounded-lg overflow-auto">
                    </ul>

                </MenuCard>
            }

            {/* Mobile Nav Menu Card Overlay */}
            {navMenuOpen &&
                <MenuCard title={'Menu'} open={navMenuOpen} setOpen={setNavMenuOpen}>
                    {/* Mobile Nav Menu */}

                    <ul className="flex flex-col w-full h-full gap-2 border border-muted/15 p-2 rounded-lg overflow-auto">
                        <ClientMenu />
                    </ul>

                </MenuCard>
            }

        </>
    )
}

export function AnonymousUserActins() {

    const { user } = useContext(UserContext);
    if (user) return;

    const { t } = useTranslation('nav')

    const [navMenuOpen, setNavMenuOpen] = useState<boolean>(false);
    const [language, setLanguage] = useState<string | "en" | "fr" | "ar">(i18n.language || "en")
    const [langMenuOpen, setLangMenuOpen] = useState<boolean>(false);


    function handleChange(value: string) {

        if (!allowedLocales.includes(value)) return;
        setLanguage(value)
        i18n.changeLanguage(value); // This is the global trigger
        // Save it to the db if needed
    };

    return (

        <>
            <div className="flex items-center gap-3 xs:gap-4 w-fit">

                <div className="max-md:hidden flex min-w-max">
                    <SelectDropDownMenu
                        options={languages()}
                        placeholder="Select a Language"
                        id="select-language"
                        value={languages().find(s => s.value === language)}
                        onChange={(option: any) => handleChange(option.value)}
                        isSearchable={false}
                        required
                    />
                </div>

                {/* Login */}
                <SCTALink to={PATHS.LOGIN} title="Login" className="max-md:hidden"> { t('nav:auth_sign_in') } </SCTALink>

                {/* Sign Up */}
                <PCTALink to={PATHS.SIGNUP} title="Sign Up" className="max-2xs:hidden"> { t('nav:auth_sign_up') } </PCTALink>

                {/* Nav Menu Trigger */}
                <button type="button" title={ t('nav:menu_navigation_header') } className="lg:hidden content-center p-2 border border-muted/15 bg-surface/75 rounded-full" onClick={() => setNavMenuOpen(!navMenuOpen)}>
                    <ICONS.menu className="size-6" />
                </button>

            </div>

            <MenuLanguageSelectorModal isOpen={langMenuOpen} onClose={() => {setLangMenuOpen(false)}} onSuccess={() => {setLangMenuOpen(false)}} />

            {/* Mobile Nav Menu Card Overlay */}
            {navMenuOpen &&
                <MenuCard title={ t('nav:menu_navigation_header') } open={navMenuOpen} setOpen={setNavMenuOpen}>
                    {/* Mobile Nav Menu */}

                    <ul className="flex flex-col w-full h-full gap-2 border border-muted/15 p-2 rounded-lg overflow-auto">
                        <MenuContext.Provider value={{langMenuOpen, setLangMenuOpen}}>
                            <PublicMenu />
                        </MenuContext.Provider>
                    </ul>

                </MenuCard>
            }
        </>
    )
}

export function PublicMenu() {

    const { t } = useTranslation('nav')
    const { langMenuOpen, setLangMenuOpen } = useContext(MenuContext);

    return (
        <>
            {publicMenuItems().map((item, index) => (
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

            <li key="menu_language_settings" className="w-full">
                {/* Language Menu Trigger */}
                <button type="button" title={ t('nav:menu_language_area_label') }
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex flex-col gap-1 w-full h-full p-2 border-b border-muted/15"
                >
                    <h3 className="font-medium text-sm"> { t('nav:menu_language_settings') } </h3>
                </button>
            </li>

            <li key="login" className="w-full">
                <Link to={PATHS.LOGIN} className="flex flex-col gap-1 w-full h-full p-2 border-b border-muted/15">
                    <div className="flex content-center gap-2">
                        {/* { ICONS.informationCircle({}) } */}
                        <h3 className="font-medium text-sm"> { t('nav:auth_sign_in') } </h3>
                    </div>
                </Link>
            </li>

            <li key="signup" className="w-full">
                <Link to={PATHS.SIGNUP} className="flex flex-col gap-1 w-full h-full p-2 border-b border-muted/15">
                    <div className="flex content-center gap-2">
                        {/* { ICONS.informationCircle({}) } */}
                        <h3 className="font-medium text-sm"> { t('nav:auth_sign_up') } </h3>
                    </div>
                </Link>
            </li>
        </>

    )
}
export function ClientMenu() {

    const { isAdmin } = useContext(UserContext);

    return (

        <>
            {isAdmin &&
                <li id="admin-dashboard-nav-menu-item" className="w-full">
                    <Link to={PATHS.ADMIN.ROOT} className="flex flex-col gap-1 w-full h-full p-2 border-b border-muted/15">
                        <div className="flex content-center gap-2">
                            {/* Icon */}
                            <ICONS.presentationChartLine />
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

            {clientMenuItems.map((item, index) => (
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
                <LogoutButton className="flex w-full h-full px-2 py-4 border-b border-muted/15">
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

    return (

        <>
            <AuthenticatedUserActins />
            <AnonymousUserActins />
        </>
    )
}

export function NavBar() {
    const { user, loading: authLoading, isAdmin } = useAuth();

    return (

        <div dir="ltr" className="navbar-height absolute flex justify-between gap-2 md:gap-4 w-full px-3 sm:px-6 md:px-9 z-30">
            <NavLogo />

            {/* Prevent flicker or showing links prematurely during loading */}
            {authLoading
                ?
                <div className="flex items-center justify-end gap-2 md:gap-4 w-full">

                    <span className="max-md:hidden w-35 p-5 border border-muted/15 bg-surface rounded-full animate-pulse" />
                    <span className="max-md:hidden p-4 md:p-5 border border-muted/15 bg-surface rounded-full animate-pulse" />
                    <span className="p-4 md:p-5 border border-muted/15 bg-surface rounded-full animate-pulse" />
                    <span className="p-4 md:p-5 border border-muted/15 bg-surface rounded-full animate-pulse" />

                </div>

                :
                <UserContext.Provider value={{ user, isAdmin }}>
                    {user
                        ?
                        <nav className="flex items-center justify-end w-full">
                            <NavActions />
                        </nav>
                        :
                        <nav className="flex items-center justify-end w-fit md:w-full">
                            <NavLinks />
                            <NavActions />
                        </nav>
                    }
                </UserContext.Provider>
            }

        </div>
    )
}
