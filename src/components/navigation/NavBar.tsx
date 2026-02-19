
import useAuth from "@/hooks/useAuth"
const Logo = "/decoright.jpeg"
import i18n from "@/utils/i18n"

import { Link } from "react-router-dom"
import { createContext, useContext, useState } from "react"

import { LogoutButton } from "@components/common/Confirm"
import { ICONS } from "@/icons"
import { publicMenuItems, clientMenuItems } from "@/constants/navigation"
import { MenuCard } from "@components/ui/MenuCard"
import { PCTALink, SCTALink } from "@components/ui/CTA"
import { PATHS } from "@/routers/Paths"
import { SelectDropDownMenu } from "@components/ui/Select"
import { allowedLocales } from "@/constants"
import { useTranslation } from "react-i18next"
import MenuLanguageSelectorModal from "@components/ui/LanguageSelectorModel"

const UserContext = createContext<any>(null);
const MenuContext = createContext<any>(undefined);

export function NavLogo() {
    const { t } = useTranslation();
    return (
        <div className="flex items-center gap-2 md:gap-4 min-w-max">
            <div className="content-center w-8 md:w-10 aspect-square">
                <img src={Logo} alt="logo" height="40" width="40" className="w-full object-cover rounded-lg" loading="lazy" />
            </div>
            <div className="flex flex-col">
                <h3 className="text-sm md:text-base font-medium"> Deco Right </h3>
                <span className="text-3xs md:text-2xs text-muted hover:text-foreground" title={t('common.decor_agency')}>
                    {t('common.decor_agency')}
                </span>
            </div>
        </div>
    )
}

export function NavLinks() {
    const { t } = useTranslation();
    return (
        <ul className="hidden xl:flex justify-center gap-4 w-full">
            {publicMenuItems.map((item, index) => (
                <li key={index}>
                    <Link to={item.path} className="font-medium text-sm p-2"> {t(`nav.${item.key}`)} </Link>
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

    const { t } = useTranslation()

    return (
        <>
            <div className="flex items-center gap-2 md:gap-4">

                {isAdmin
                    ? <>
                        {/* Request Project */}
                        <Link to={PATHS.ADMIN.PROJECT_CREATE} title="Create Project" className="max-md:hidden content-center p-2.5 min-w-max font-medium text-sm border border-muted/15 bg-surface/75 rounded-full">
                            Create a Project
                        </Link>

                        <Link to={PATHS.ADMIN.ANALYTICS} title="Dashboard Panel" className="max-md:hidden content-center p-2 border border-muted/15 bg-surface/75 rounded-full">
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
                <Link to={PATHS.CLIENT.ACCOUNT_PROFILE} title={t('nav.profile')} className="max-md:hidden content-center p-1.5 md:p-2 border border-muted/15 bg-surface/75 rounded-full">
                    <ICONS.user className="size-5 md:size-6" />
                </Link>

                {/* Menu Trigger */}
                <button type="button" title="Menu" onClick={() => setNavMenuOpen(!navMenuOpen)}
                    className="content-center p-1.5 md:p-2 border border-muted/15 bg-surface/75 rounded-full">
                    <ICONS.menu className="size-5 md:size-6" />
                </button>

            </div>

            {chatMenuOpen &&
                <MenuCard title={t('common.menu_chat')} open={chatMenuOpen} setOpen={setChatMenuOpen}>
                    {/* Mobile Nav Menu */}
                    <ul className="flex flex-col w-full h-full gap-2 border border-muted/15 p-2 rounded-lg overflow-y-auto min-scrollbar">
                    </ul>
                </MenuCard>
            }

            {/* Mobile Nav Menu Card Overlay */}
            {navMenuOpen &&
                <MenuCard title={t('common.menu_navigation')} open={navMenuOpen} setOpen={setNavMenuOpen}>
                    {/* Mobile Nav Menu */}
                    <ul className="flex flex-col w-full h-full gap-2 border border-muted/15 p-2 rounded-lg overflow-y-auto min-scrollbar">
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


    const { t } = useTranslation();
    const { languageChoices } = useContext(MenuContext)

    function handleChange(value: string) {

        console.log('HELLO ON CHNAGE')
        if (!allowedLocales.includes(value)) return;
        i18n.changeLanguage(value); // This is the global trigger
        // Save it to the db if needed
    };

    const [navMenuOpen, setNavMenuOpen] = useState<boolean>(false);

    return (

        <>
            <div className="flex items-center gap-2 md:gap-4">
                <div className="max-md:hidden flex min-w-max">
                    <SelectDropDownMenu
                        options={languageChoices}
                        placeholder="Select a Language"
                        id="select-language"
                        value={languageChoices.find((s: any) => s.value === i18n.language)}
                        onChange={(option: any) => handleChange(option.value)}
                        isSearchable={false}
                        required
                    />
                </div>

                {/* Login */}
                <SCTALink to={PATHS.LOGIN} title={t('auth.login')} className="max-md:hidden"> {t('auth.login')} </SCTALink>

                {/* Sign Up */}
                <PCTALink to={PATHS.SIGNUP} title={t('auth.signup')}> {t('auth.signup')} </PCTALink>

                {/* Menu Trigger */}
                <button type="button" title={t('common.menu')} className="content-center p-2 border border-muted/15 bg-surface/75 rounded-full" onClick={() => setNavMenuOpen(!navMenuOpen)}>
                    <ICONS.menu className="size-6" />
                </button>

            </div>

            {/* Mobile Nav Menu Card Overlay */}
            {navMenuOpen &&
                <MenuCard title={t('common.menu_navigation')} open={navMenuOpen} setOpen={setNavMenuOpen}>
                    {/* Mobile Nav Menu */}
                    <ul className="flex flex-col w-full h-full gap-2 border border-muted/15 p-2 rounded-lg overflow-y-auto min-scrollbar">
                        <PublicMenu />
                    </ul>
                </MenuCard>
            }
        </>
    )
}

export function PublicMenu() {

    const { t } = useTranslation()
    const { langMenuOpen, setLangMenuOpen } = useContext(MenuContext);

    return (
        <>
            {publicMenuItems.map((item, index) => (
                <li key={index} className="group/menuitem w-full">
                    <Link to={item.path} className="flex flex-col gap-1 w-full h-full p-2 border-b border-muted/15 group-hover/menuitem:border-primary/75">
                        <div className="flex content-center gap-2">
                            {/* Icon */}
                            {item.icon ?? <ICONS.folder />}
                            {/* Label */}
                            <h3 className="font-medium text-sm text-muted group-hover/menuitem:text-foreground"> {t(`nav.${item.key}`)} </h3>
                        </div>

                        {/* Description & Helper */}
                        <div className="w-full">
                            <p className="text-2xs text-muted group-hover/menuitem:text-foreground"> {t(`nav.${item.key}_description`)} </p>
                        </div>
                    </Link>
                </li>
            ))}

            <li key="menu_language_settings" className="group/menuitem w-full">
                {/* Language Menu Trigger */}
                <button type="button" title={t('nav.language_area')}
                    onClick={() => setLangMenuOpen(!langMenuOpen)}
                    className="flex items-center w-full text-start p-2 border-b border-muted/15 group-hover/menuitem:border-primary/75"
                >
                    <div className="flex flex-col gap-1 w-full">
                        <div className="flex gap-2 w-full">
                            <ICONS.language />
                            <h4 className="font-medium text-sm text-muted group-hover/menuitem:text-foreground"> {t('nav.language')} </h4>
                        </div>
                        <p className="text-2xs text-muted group-hover/menuitem:text-foreground"> {t('nav.language_description')} </p>
                    </div>
                    <ICONS.chevronRight className="rtl:rotate-180 size-4" />
                </button>
            </li>

            <li key="login" className="group/menuitem w-full">
                <Link to={PATHS.LOGIN} className="flex flex-col gap-1 w-full h-full p-2 border-b border-muted/15 group-hover/menuitem:border-primary/75">
                    <div className="flex content-center gap-2">
                        <ICONS.arrowRightEndOnRectangle />
                        <h3 className="font-medium text-sm text-muted group-hover/menuitem:text-foreground"> {t('auth.login')} </h3>
                    </div>

                    {/* Context */}
                    <div className="w-full">
                        <p className="text-2xs text-muted group-hover/menuitem:text-foreground"> {t('auth.login_description')} </p>
                    </div>
                </Link>
            </li>

            <li key="signup" className="group/menuitem w-full">
                <Link to={PATHS.SIGNUP} className="flex flex-col gap-1 w-full h-full p-2 border-b border-muted/15 group-hover/menuitem:border-primary/75 ">
                    <div className="flex content-center gap-2">
                        <ICONS.userPlus />
                        <h3 className="font-medium text-sm text-muted group-hover/menuitem:text-foreground"> {t('auth.signup')}  </h3>
                    </div>

                    {/* Context */}
                    <div className="w-full">
                        <p className="text-2xs text-muted group-hover/menuitem:text-foreground"> {t('auth.signup_description')} </p>
                    </div>
                </Link>
            </li>
        </>

    )
}

export function ClientMenu() {
    const { t } = useTranslation();
    const { isAdmin } = useContext(UserContext);
    const { langMenuOpen, setLangMenuOpen } = useContext(MenuContext);

    return (

        <>
            {isAdmin &&
                <li id="admin-dashboard-nav-menu-item" className="w-full">
                    <Link to={PATHS.ADMIN.ANALYTICS} className="flex flex-col gap-1 w-full h-full p-2 border-b border-muted/15 hover:border-primary">
                        <div className="flex content-center gap-2">
                            {/* Icon */}
                            <ICONS.presentationChartLine />
                            {/* Label */}
                            <span className="font-medium text-sm"> {t('nav.dashboard')} </span>
                        </div>

                        {/* Context */}
                        <div className="w-full">
                            <p className="text-2xs text-muted"> {t('nav.dashboard_description')}  </p>
                        </div>
                    </Link>
                </li>
            }

            {clientMenuItems.map((item, index) => (
                <li key={index} className="group/menuitem w-full">
                    <Link to={item.path} className="flex flex-col gap-1 w-full h-full p-2 border-b border-muted/15 group-hover/menuitem:border-primary/75">
                        <div className="flex content-center gap-2">
                            {/* Icon */}
                            {item.icon ?? <ICONS.folder />}
                            {/* Label */}
                            <h4 className="font-medium text-sm text-muted group-hover/menuitem:text-foreground"> {t(`nav.${item.key}`)} </h4>
                        </div>

                        {/* Context */}
                        <div className="w-full">
                            <p className="text-2xs text-muted group-hover/menuitem:text-foreground"> {t(`nav.${item.key}_description`)} </p>
                        </div>
                    </Link>
                </li>
            ))}

            <li key="menu_language_settings" className="group/menuitem w-full">
                {/* Language Menu Trigger */}
                <button type="button" title={t('nav.language_area')}
                    onClick={() => setLangMenuOpen(!langMenuOpen)}
                    className="flex items-center w-full text-start p-2 border-b border-muted/15 group-hover/menuitem:border-primary/75"
                >
                    <div className="flex flex-col gap-1 w-full">
                        <div className="flex gap-2 w-full">
                            <ICONS.language />
                            <h4 className="font-medium text-sm text-muted group-hover/menuitem:text-foreground"> {t('nav.language')} </h4>
                        </div>
                        <p className="text-2xs text-muted group-hover/menuitem:text-foreground"> {t('nav.language_description')} </p>
                    </div>
                    <ICONS.chevronRight className="rtl:rotate-180 size-4" />
                </button>
            </li>

            <li id="logout-nav-menu-item" className="group/menuitem w-full">
                <LogoutButton className="flex w-full h-full px-2 py-4 border-b border-muted/15 group-hover/menuitem:border-primary/75">
                    <div className="flex content-center gap-2">
                        {/* Icon */}
                        <ICONS.arrowRightStartOnRectangle />
                        {/* Label */}
                        <h4 className="font-medium text-sm text-muted group-hover/menuitem:text-foreground"> {t('auth.logout')} </h4>
                    </div>
                </LogoutButton>
            </li>

        </>
    )
}

export function NavActions() {

    const [langMenuOpen, setLangMenuOpen] = useState<boolean>(false);

    const { t } = useTranslation()

    const languageChoices = [
        { id: 'en', label: t('common.english'), value: 'en', icon: null, },
        { id: 'fr', label: t('common.french'), value: 'fr', icon: null, },
        { id: 'ar', label: t('common.arabic'), value: 'ar', icon: null, },
    ]

    return (

        <MenuContext.Provider value={{ langMenuOpen, setLangMenuOpen, languageChoices }}>
            <AuthenticatedUserActins />
            <AnonymousUserActins />
            <MenuLanguageSelectorModal isOpen={langMenuOpen} onClose={() => { setLangMenuOpen(false) }} onSuccess={() => { setLangMenuOpen(false) }} />

        </MenuContext.Provider>
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
                            <NavActions />
                        </nav>
                    }
                </UserContext.Provider>
            }

        </div>
    )
}
