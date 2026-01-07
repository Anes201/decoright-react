
import { ICONS } from "@/icons";
import { supportMailAddress, phoneNumber, googleMapLocationUrl } from "@/constants/company";

export function ContactCard({children}:any) {
    return (
        <li className="flex flex-col justify-between gap-8 w-full p-4 sm:p-6 border border-muted/25 rounded-lg cursor-pointer hover:bg-surface/75 active:bg-surface/75"> {children} </li>
    )
}

export function ContactCardList() {
    return (
        <ul className="grid grid-cols-[repeat(auto-fit,minmax(12rem,1fr))] justify-center gap-4 w-full">
            <ContactCard>
                {/* Card Icon */}
                <div className="p-2 ring-1 ring-muted/15 rounded-lg w-fit bg-surface">
                    {ICONS.phone({className:'size-6'})}
                </div>

                <a href={`tel:${phoneNumber}`} className="space-y-3">
                    <div>
                        <h3 className="font-semibold text-primary text-lg"> Call Us </h3>
                        <p className="text-2xs md:text-xs text-muted"> Lorem ipsum dolor sit amet consectetur, adipisicing elit. </p>
                    </div>

                    <span className="font-medium text-xs text-foreground hover:underline active:underline"> {phoneNumber} </span>
                </a>

            </ContactCard>

            <ContactCard>
                {/* Card Icon */}
                <div className="p-2 ring-1 ring-muted/15 rounded-lg w-fit bg-surface">
                    {ICONS.envelope({className:'size-6'})}
                </div>

                <a href={`mailto:${supportMailAddress}`} className="space-y-3">
                    <div>
                        <h3 className="font-semibold text-primary text-lg"> Mail & Support </h3>
                        <p className="text-2xs md:text-xs text-muted"> Lorem ipsum dolor sit amet consectetur, adipisicing elit. </p>
                    </div>

                        <span className="font-medium text-xs text-foreground hover:underline active:underline"> {supportMailAddress} </span>
                </a>
            </ContactCard>

            <ContactCard>
                {/* Card Icon */}
                <div className="p-2 ring-1 ring-muted/15 rounded-lg w-fit bg-surface">
                    {ICONS.mapPin({className:'size-6'})}
                </div>

                <a href={googleMapLocationUrl} target="_blank" rel="noopener noreferrer" className="space-y-3">
                    <div>
                        <h3 className="font-semibold text-primary text-lg"> Visit Us </h3>
                        <p className="text-2xs md:text-xs text-muted"> Lorem ipsum dolor sit amet consectetur, adipisicing elit. </p>
                    </div>

                    <span className="font-medium text-xs text-foreground hover:underline active:underline"> View on Google Maps </span>
                </a>
            </ContactCard>
        </ul>
    )
}

export default function Contact () {
    return (
        <main>
            <section className="h-hero min-h-hero content-container relative flex flex-col items-center justify-center max-sm:my-18 space-y-16">


                {/* Section Header */}
                <div className="flex flex-col gap-2 md:gap-4 w-full text-center">
                    <h1 className="font-semibold text-xl sm:text-2xl md:text-4xl"> Lorem ipsum dolor sit amet consectetur adipisicing </h1>
                    <p className="text-2xs sm:text-xs md:text-sm text-muted/75"> Lorem ipsum dolor sit, amet consectetur adipisicing elit. Totam corrupti vero a enim harum molestias facilis, optio pariatur voluptate itaque nam obcaecati quas omnis reprehenderit doloribus perspiciatis. dolores enim harum molestias facilis, optio pariatur voluptate itaque nam obcaecati quas omnis reprehenderit doloribus perspiciatis. Qui, ex.  </p>
                </div>

                <ContactCardList/>

            </section>
        </main>
    )
}