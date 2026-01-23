
import { serviceTypes } from "@/constants/index"
import ZoomImage from "@components/ui/ZoomImage"


export function ServiceCard ({ id, label, description, src }: { id?:string, label: string, description: string, src: string }) {
    return (
        <li key={id} className="relative p-4">
            <div className="absolute top-0 right-0 w-full h-full bg-surface/45 shadow-xs mask-t-to-transparent -z-10 rounded-2xl"></div>
            <div className="absolute top-0 right-0 w-full h-full border border-muted/15 mask-b-to-transparent -z-10 rounded-2xl"></div>
            <div className="w-full aspect-4/3 mb-4 overflow-hidden shadow-sm rounded-xl">
                <ZoomImage src={src} alt="Service Image"/>
            </div>

            <h3 className="text-lg font-medium mb-0.5"> {label} </h3>
            <p className="text-2xs md:text-xs text-muted/75"> {description} </p>
        </li>
    )
}

export function ServiceCardList () {
    return (
        <ul className="grid max-md:grid-cols-[repeat(auto-fit,minmax(14rem,1fr))] grid-cols-3 gap-6 w-full">

            {serviceTypes.map((service, index) => (
                <ServiceCard id={service.value} key={index} label={service.label} description={service.description} src={service.src} />
            ))}
        </ul>
    )
}
