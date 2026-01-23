
import Logo from "/public/vite.svg"
import LogoutButton from "./Confirm"
import type { SideNavItem } from "@/types/nav"
import { adminSideMenuNav } from "@/constants"
import { NavLink, useLocation } from "react-router-dom"
import { ICONS } from "@/icons"
import { useEffect, useState } from "react"

// Helper: return array of parent ids whose subtree matches the current path.
// Uses startsWith so parent items containing path prefixes open automatically.
function findParentIdsForPath(items: SideNavItem[], target: string): string[] | null {
  for (const it of items) {
    if (it.path && (target === it.path || target.startsWith(it.path + "/"))) {
      return []; // found at this node (no parents above this)
    }
    if (it.children) {
      const res = findParentIdsForPath(it.children, target);
      if (res !== null) {
        return [it.id, ...res];
      }
    }
  }
  return null;
}


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

    const location = useLocation();
    const [openSet, setOpenSet] = useState<Set<string>>(new Set());

    // initialize open groups based on current path
    useEffect(() => {
        const parents = findParentIdsForPath(adminSideMenuNav, location.pathname) ?? [];
        setOpenSet(new Set(parents));
    }, [location.pathname]);

    const toggle = (id: string) => {
        setOpenSet((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
        });
    };

    return (

        <ul className="flex flex-col gap-2 w-full h-full">
            {adminSideMenuNav.map((item) => (
                // <li key={index}>
                //     <NavLink to={item.path} className="flex font-medium text-sm px-4 py-2 border border-transparent hover:border-muted/15 hover:bg-emphasis/50 rounded-lg"> {item.label} </NavLink>
                // </li>
                <NavItem key={item.id} item={item} openSet={openSet} toggle={toggle} />
            ))}
        </ul>

    )
}

function NavItem({
  item,
  openSet,
  toggle,
}: {
  item: SideNavItem;
  openSet: Set<string>;
  toggle: (id: string) => void;
}) {
  const isOpen = openSet.has(item.id);

  if (item.children) {
    return (
      <li className="space-y-2 border-b border-muted/5">
        <button onClick={() => toggle(item.id)} aria-expanded={isOpen} aria-controls={`children-${item.id}`}
          className="flex items-center justify-between w-full px-3 py-2"
        >
          <span className="text-sm text-muted">{item.label}</span>
          <span aria-hidden className="ml-2 text-sm">
            <ICONS.caretDown className={`size-4 ${isOpen && "-rotate-180"}`} />
          </span>
        </button>

        <ul id={`children-${item.id}`} role="group"
          className={`relative px-1 space-y-2 overflow-hidden transition-[max-height] duration-150 ${isOpen ? "max-h-96" : "max-h-0"}`}
        >
            {item.children.map((child) => (
                <li key={child.id} className="flex items-center last:mb-2">
                    <NavLink
                        to={child.path ?? "#"}
                        className="text-xs w-full p-2 hover:bg-emphasis active:hover:bg-emphasis rounded-lg cursor-pointer"
                        aria-current={undefined}
                    >
                      {child.label}
                    </NavLink>
                </li>
            ))}
        </ul>
      </li>
    );
  }

  // leaf link
  return (
    <li className="border-b border-muted/5">
      <NavLink
        to={item.path ?? "#"}
        className="block text-sm mb-2 p-2 hover:bg-emphasis active:hover:bg-emphasis rounded-lg cursor-pointer"
      >
        {item.label}
      </NavLink>
    </li>
  );
}

function NavActionList() {
    return (

        <ul className="flex flex-col gap-2 w-full h-fit p-2">
            <li key={'action-item-logout'}>
                <LogoutButton className="flex justify-between font-medium text-sm p-2 w-full border border-muted/15 hover:bg-emphasis rounded-lg">
                    <span className="px-2"> Logout </span>
                    <ICONS.arrowRightStartOnRectangle/>
                </LogoutButton>
            </li>
        </ul>

    )
}

export function NavSideBar () {

    return (

        <div className="flex flex-col gap-4 w-full h-full px-2 py-4 bg-surface">
            <NavLogo/>
            <nav className="p-2 border-y border-muted/15 h-full overflow-y-auto min-scrollbar">
                <NavLinkList/>
            </nav>

            <NavActionList/>

        </div>


    )
}