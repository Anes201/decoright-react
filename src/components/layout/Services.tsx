
import { serviceTypes } from "@/constants/index"
import { PATHS } from "@/routers/Paths"
import ZoomImage from "@components/ui/ZoomImage"
import { PCTALink } from "../ui/CTA"
import { Link } from "react-router-dom"


export function ServiceCard ({ id, label, description, src }: { id?:string, label: string, description: string, src: string }) {
    return (
        <li key={id} className="relative p-4">
            <div className="absolute top-0 right-0 w-full h-full bg-surface/45 shadow-xs mask-t-to-transparent -z-10 rounded-2xl"></div>
            <div className="absolute top-0 right-0 w-full h-full border border-muted/15 mask-b-to-transparent -z-10 rounded-2xl"></div>
            <div className="w-full aspect-4/3 mb-4 overflow-hidden shadow-sm rounded-xl">
                <ZoomImage src={src} alt="Service Image"/>
            </div>

            <div className="flex flex-col gap-4">
                <div>
                    <h3 className="text-lg font-medium mb-0.5"> {label} </h3>
                    <p className="text-2xs md:text-xs text-muted/75"> {description} </p>
                </div>
                <Link to={PATHS.CLIENT.REQUEST_SERVICE}
                className="font-medium text-xs w-fit px-3 py-2 border border-muted/15 rounded-lg bg-surface hover:bg-emphasis active:bg-emphasis "
                >
                    Request Service
                </Link>
            </div>

        </li>
    )
}

export function ServiceCardList () {
    return (
        <ul className="grid max-md:grid-cols-[repeat(auto-fit,minmax(14rem,1fr))] grid-cols-3 gap-6 w-full">

            {serviceTypes.map((service, index) => (
                <ServiceCard id={service.value} key={index} label={service.label} description={service.description} src={service.src} />
            ))}

            {/* Blank Card for Grid Alignment */}
            {/* <li className="max-md:hidden relative p-4 w-full">
                <div className="absolute top-0 right-0 w-full h-full bg-surface/45 shadow-xs mask-t-to-transparent -z-10 rounded-2xl"></div>
                <div className="absolute top-0 right-0 w-full h-full border border-muted/10 mask-b-to-transparent -z-10 rounded-2xl"></div>
                <div className="w-full aspect-4/3 mb-4 ring-1 ring-muted/10 overflow-hidden rounded-xl"></div>

                <div className="flex flex-col">

                    <span className="p-3 w-1/3 bg-emphasis/15 mb-1 ring-1 ring-muted/5 rounded"> </span>
                    <span className="p-2 w-full bg-emphasis/10 ring-1 ring-muted/5 rounded"> </span>
                </div>
            </li> */}

        </ul>
    )
}
