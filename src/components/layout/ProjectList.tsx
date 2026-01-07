

import { Link } from "react-router-dom"

import { SectionHeader } from "../ui/SectionHeader";

import { projects } from "../../constants";
import { ICONS } from "../../icons";


export function ProjectCard ({project, index}: {project: {title: string; date: string; imgSrc: string}, index: number}) {

    // const [liked, setLiked] = useState(false);

    return (


        <li key={index} >

            <Link to={'/project'} className="flex flex-col h-fit gap-1">
                <div className="w-full aspect-video mb-2 overflow-hidden">
                    <img src={project.imgSrc} alt="" className="object-cover h-full w-full rounded-xl" />
                </div>
                <div className="h-fit">
                    <div className="flex gap-2">
                        <h3 className="font-medium text-xs md:text-sm"> {project.title} </h3>
                        <div className="flex h-fit gap-1 text-muted ml-auto px-1">
                            {/* Placeholder for future icons or actions */}
                            <div className="flex items-center gap-0.5 pt-0.5">
                                {ICONS.eye({className:'size-4'})}
                                <span className="text-2xs"> {/* statistic count goes here */} 220 </span>
                            </div>

                            {/* <div className="flex items-center gap-0.5 pt-0.5">
                                <button type="button" onClick={() => setLiked(!liked)}>
                                    {ICONS.heart({className:`size-4 ${liked ? 'fill-red-500 text-red-500' : ''}`})}
                                </button>
                                <span className="text-2xs"> {liked ? 69 + 1: 69} </span>
                            </div> */}

                        </div>
                    </div>
                    <span className="leading-0 text-2xs text-muted/75"> {project.date} </span>
                </div>

            </Link>
        </li>

    )
}

export function ProjectCardList () {

    return (
        <ul className="grid grid-cols-1 sm:grid-cols-[repeat(auto-fit,minmax(18rem,1fr))] gap-8 md:gap-6 w-full">

            {projects.map((project, index) => (
                <ProjectCard key={index} project={project} index={index} />
            ))}

        </ul>
    )
}

export function ProjectListLayout () {
    return (
        <section className="content-container relative flex flex-col gap-6 w-full px-3 sm:px-6 md:px-8">
            {/* Section Header */}
            <SectionHeader
                name='Portfolio & Projects Gallery'
                title='Browse our previous projects from our showcase'
                desc='A curated selection of our finest interior design projects, highlighting our commitment to quality, creativity, and client satisfaction. Explore the diverse styles and innovative solutions that define our work.'
            />

            {/* Project Cards */}
            <ProjectCardList/>

        </section>
    )
}