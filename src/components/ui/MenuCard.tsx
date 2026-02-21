
import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { XMark } from "@/icons";

export function MenuCard({title, children, open, setOpen}: {title: string, children:any, open:boolean, setOpen: React.Dispatch<React.SetStateAction<boolean>>}) {

    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const listenersAddedRef = useRef(false);
    const { t } = useTranslation();

    // keep a mutable ref of the current `open` so nav-effect can read latest value
    const openRef = useRef(open);
    useEffect(() => { openRef.current = open; }, [open]);

    // Close when clicking outside
    useEffect(() => {
        if (!open) return;

        function onPointerDown(e: PointerEvent) {
            const target = e.target as Node;
            if (wrapperRef.current && wrapperRef.current.contains(target)) return;
            setOpen(false);
        }

        function onKey(e: KeyboardEvent) {
            if (e.key === 'Escape') setOpen(false);
        }

        // attach listeners on the next tick to avoid reacting to the same opening click
        const t = window.setTimeout(() => {
            document.addEventListener('pointerdown', onPointerDown);
            document.addEventListener('keydown', onKey);
            listenersAddedRef.current = true;
        }, 0);

        return () => {
            clearTimeout(t);
            if (listenersAddedRef.current) {
                document.removeEventListener('pointerdown', onPointerDown);
                document.removeEventListener('keydown', onKey);
                listenersAddedRef.current = false;
            }
        };
    }, [open, setOpen]);

    // Close menu when navigation occurs (only after mount, and only if menu is open)
    const location = useLocation();
    const prevPathRef = useRef(location.pathname);
    useEffect(() => {
        // If pathname changed (real navigation) and menu is open, close it.
        const prev = prevPathRef.current;
        if (prev !== location.pathname && openRef.current) {
        setOpen(false);
        }
        // update stored pathname for next navigation check
        prevPathRef.current = location.pathname;
        // only depend on pathname (we intentionally don't include `open` here)
    }, [location.pathname, setOpen]);

    if (!open) return null;

    return (
        <>
            <div dir={document.documentElement.dir} ref={wrapperRef} className="fixed flex justify-center top-0 right-0 w-full md:w-w-[22rem] lg:w-1/3 xl:w-1/4 h-full">
                <div className="absolute w-full h-full z-10 bg-muted/45 md:mask-l-to-transparent md:mask-l-from-0"></div>
                <div className="relative p-2 space-y-4 w-full z-20">
                    <div className="flex flex-col gap-2 w-full h-full p-2 border border-muted/25 bg-surface rounded-lg">
                        {/* Card Header */}
                        <div className="flex justify-between w-full h-fit border border-muted/15 p-2 rounded-lg">
                            <h2 className="text-sm font-semibold">{ title }</h2>
                            <button type="button" title={ t('common.exit') } area-label={ t('common.exit') } onClick={() => setOpen(!open)}>
                                <XMark />
                            </button>
                        </div>

                        {/* Card Content */}
                        { children }

                    </div>
                </div>
            </div>
        </>
    )
}