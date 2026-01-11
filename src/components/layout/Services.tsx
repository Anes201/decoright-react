
import { serviceTypes } from "../../constants/index"
import { SectionHeader } from '../ui/SectionHeader';
import ZoomImage from "../ui/ZoomImage";

export function ServiceCardList () {
    return (
        <ul className="grid max-md:grid-cols-[repeat(auto-fit,minmax(14rem,1fr))] grid-cols-3 gap-6 w-full">

            {serviceTypes.map((service, index) => (

                <li key={index} className="relative p-4">
                    <div className="absolute top-0 right-0 w-full h-full bg-surface/45 shadow-xs mask-t-to-transparent -z-10 rounded-2xl"></div>
                    <div className="absolute top-0 right-0 w-full h-full border border-muted/10 mask-b-to-transparent -z-10 rounded-2xl"></div>
                    <div className="w-full aspect-4/3 mb-4 overflow-hidden shadow-sm rounded-xl">
                        <img src={service.src} alt="Service Image"/>
                    </div>

                    <h3 className="text-lg font-medium mb-1"> {service.label} </h3>
                    <p className="text-2xs text-muted/75"> {service.description} </p>
                </li>
            ))}

            <li className="max-md:hidden relative p-4 w-full">
                <div className="absolute top-0 right-0 w-full h-full bg-surface/45 shadow-xs mask-t-to-transparent -z-10 rounded-2xl"></div>
                <div className="absolute top-0 right-0 w-full h-full border border-muted/10 mask-b-to-transparent -z-10 rounded-2xl"></div>
                <div className="w-full aspect-4/3 mb-4 ring-1 ring-muted/10 overflow-hidden rounded-xl"></div>

                <div className="flex flex-col">

                    <span className="p-3 w-1/3 bg-emphasis/15 mb-1 ring-1 ring-muted/5 rounded"> </span>
                    <span className="p-2 w-full bg-emphasis/10 ring-1 ring-muted/5 rounded"> </span>
                </div>
            </li>

        </ul>
    )
}
