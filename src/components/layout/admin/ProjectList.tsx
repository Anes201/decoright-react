


import { Link } from "react-router-dom"
import { projects } from "@/constants";
import { ICONS } from "@/icons";
import { PATHS } from "@/routers/Paths";
import ZoomImage from "@/components/ui/ZoomImage";

export function ProjectCard ({project, index}: {project: {title: string; date: string; src: string}, index: number}) {

    return (

        <li key={index} className="relative flex p-2 border-b border-muted/25 last:border-0">
            {/* <div className="absolute bottom-0 left-0 w-full h-full border-b border-muted/25 last:border-0 mask-x-to-transparent mask-x-from-96%"/> */}

            <Link to={PATHS.projectDetail('slug')} className="flex gap-4 w-full">
                <div className="min-w-max h-25 aspect-video overflow-hidden">
                    <ZoomImage src={project.src} alt="" className="object-cover h-full w-full rounded-lg" />
                </div>

                <div className="flex flex-col gap-2 w-full">
                    <p className="font-medium text-sm"> {project.title} </p>

                    <div className="flex">
                        <span className="text-2xs after:content-['•'] after:mx-1.5 last:after:content-none">823 Views</span>
                        <span className="text-2xs">477 Likes</span>
                    </div>

                    <span className="leading-0 text-2xs text-muted/75"> {project.date} </span>

                </div>

            </Link>

            <div className="content-center w-fit border border-red-400">
                <button type="button" className="rounded-full hover:bg-emphasis active::bg-emphasis">
                    <ICONS.ellipsisVertical className="size-6 text-muted"/>
                </button>
            </div>
        </li>

    )
}

export function ProjectCardList () {

    return (
        <ul className="flex flex-col w-full border border-muted/15 rounded-xl">

            {projects.map((project, index) => (
                <ProjectCard key={index} project={project} index={index} />
            ))}

        </ul>
    )
}
