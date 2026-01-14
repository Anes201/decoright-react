
import { showcases } from "@/constants";
import ZoomImage from "../ui/ZoomImage";
import { Link } from "react-router-dom";
import { PATHS } from "@/routers/Paths";


export function ShowcaseCard ({showcase, index}:any) {

    return (


        <li key={index} >
            <div className="relative w-full aspect-video rounded-xl overflow-hidden">
                {/* budget */}
                {showcase.budget && <span className="absolute top-2 left-2 font-medium text-2xs px-1 py-0.5 bg-emphasis/75 rounded-lg">{showcase.budget}</span>}
                <ZoomImage src={showcase.src} alt={showcase.alt} className="object-cover h-full w-full" />
            </div>

            <div className="px-1 mt-1">
                <h3 className="font-medium text-sm"> {showcase.title} </h3>
            </div>
        </li>

    )
}

export function ShowcaseCardList () {

    return (
        <ul className="grid grid-cols-1 sm:grid-cols-[repeat(auto-fit,minmax(18rem,1fr))] gap-8 md:gap-6 w-full">

            {showcases.map((showcase, index) => (
                <ShowcaseCard key={index} showcase={showcase} index={index} />
            ))}

        </ul>
    )
}
