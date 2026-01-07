
import { useState } from "react";
import { images, projects } from "../../constants"
import { ICONS } from "../../icons"
import { PCTALink } from "../ui/CTA"
import Gallery, { type GalleryImage } from "../ui/GallerySwap";
import { Link } from "react-router-dom";

export function ProjectCardItem({project, index}:{project:any, index:number}) {
    return (

        <li key={index}>
            <Link to={'/project'} className="flex gap-1 h-full">
                <div className="w-full h-full aspect-video mb-2 overflow-hidden">
                    <img src={project.imgSrc} alt="" className="w-full h-full object-cover rounded-lg" />
                </div>
                <div className="flex flex-col gap-1 w-full h-full overflow-hidden">

                    <h3 className="font-medium text-xs md:text-2xs h-full text-ellipsis-3line"> {project.title} </h3>

                    <div className="flex flex-col">
                        <p className="font-medium text-2xs md:text-3xs text-muted/75"> 5,805 views </p>
                        <p className="font-medium text-2xs md:text-3xs text-muted/75"> 6 months ago </p>
                    </div>
                </div>

            </Link>
        </li>
    )
}

export function ProjectCardList() {
    return (

        <ul>
            {projects.map((project, index) => (
                <ProjectCardItem key={index} project={project} index={index} />
            ))}

        </ul>
    )
}

export function ProjectHero(){

    const [liked, setLiked] = useState(false);
    const [descOpen, setDescOpen] = useState(false);

    const imgs: GalleryImage[] = [
    { id: "1", src: images[0], alt: "Room 1" },
    { id: "2", src: images[1], alt: "Room 2" },
    { id: "3", src: images[2], alt: "Room 3" },
    ];

    return (
        <section className="content-container relative w-full h-full">
            <div className="flex max-md:flex-col gap-3 md:gap-4 h-full mb-18">

                {/* Main Project Content */}
                <div className="space-y-2 w-full">
                    {/* Images & Gallery */}
                    <div className="flex gap-2 md:gap-4 w-full h-fit">
                        {/* Main Visual Content */}
                        <Gallery images={imgs} objectFit="cover" className="w-full h-full rounded-xl aspect-video overflow-hidden" />
                    </div>

                    <div className="flex flex-col gap-4 w-full">
                        {/* Context */}

                        <h2 className="font-medium text-xs md:text-sm leading-5 md:leading-6"> Amet consectetur adipisicing elit Nemo mollitia dolorem delectus Nemo mollitia dolorem delectus.</h2>

                        {/* CTA & View, Likes */}
                        <div className="flex flex-wrap w-full gap-4">

                            {/* CTA */}

                            <PCTALink to={'/request-service'}> Request Similar Project </PCTALink>


                            <div className="flex gap-4">

                                <div className="flex items-center gap-1 px-2 py-1 bg-muted/5 border border-muted/15 rounded-full">
                                    <button type="button" onClick={() => setLiked(!liked)}>
                                        {ICONS.heart({className:`size-5 md:size-6 text-muted/75 ${liked ? 'fill-red-500 text-red-500' : ''}`})}
                                    </button>
                                    <span className="font-medium text-sm text-muted/75"> {liked ? 69 + 1: 69} </span>
                                </div>
                            </div>
                        </div>

                        {/* Description & More Details */}
                        <div className="flex flex-col gap-4 p-3 md:p-4 bg-muted/5 border border-muted/15 rounded-2xl" onClick={() => setDescOpen(!descOpen)}>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1">
                                    <p className="font-medium text-2xs md:text-xs text-muted/75 after:content-['•'] after:mx-1 last:after:content-none"> 5,805 views </p>
                                    <p className="font-medium text-2xs md:text-xs text-muted/75"> 6 months ago </p>
                                </div>
                                <span className="font-medium text-2xs md:text-xs text-muted/75 cursor-pointer" onClick={() => setDescOpen(!descOpen)}> {descOpen ? 'Read Less' : 'Read More'} </span>
                            </div>
                            <div>
                                <h4 className="font-medium text-xs"> Description </h4>
                                <p className={`text-2xs md:text-xs text-muted ${!descOpen && 'text-ellipsis-2line' } `}> Lorem ipsum dolor sit amet consectetur, Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus quaerat cumque placeat vel harum iure quisquam officiis adipisci ipsa non, asperiores doloremque voluptate? Explicabo, nemo tempora aperiam aut maxime quae!
                                Deserunt totam est temporibus pariatur aliquid eum, iusto sunt eaque error dignissimos id veritatis consequuntur? Ea accusantium modi corrupti dignissimos quia eaque necessitatibus quibusdam repellendus, alias numquam maxime quis cupiditate.
                                Nihil accusantium tempora temporibus sit officia facere libero neque similique accusamus illo quasi repellat eos excepturi, mollitia doloremque inventore esse nesciunt hic est totam nobis? Ut id ea reprehenderit sint!
                                Deserunt fugiat, odit ea harum voluptate, recusandae nulla facilis Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus ad eaque iure amet cum accusamus, ducimus vel eligendi iste, beatae voluptate dolorem. Sapiente facere numquam sunt, expedita quos modi molestias. ipsa assumenda consectetur debitis, totam suscipit ab corporis temporibus consequuntur animi non. Reiciendis quaerat dolore sunt fugit. Corrupti blanditiis quasi commodi?
                                Ipsa ad beatae temporibus facilis sunt eveniet illo officiis odit? Consequatur nostrum tenetur earum, sit deserunt perferendis ducimus modi atque suscipit temporibus, distinctio, quas necessitatibus eaque ipsam magnam iste quos? adipisicing elit. Nemo mollitia dolorem delectus fugit iusto animi minima voluptatem aut commodi impedit eaque, illo nam eligendi facilis, corrupti soluta dignissimos ad accusantium! </p>
                            </div>
                        </div>

                    </div>
                </div>

                {/* More & Similar Projects Container */}
                <div className="md:w-3/5 lg:w-1/3 w-full h-full rounded-xl p-2 border border-muted/25 overflow-clip">
                    <ProjectCardList />
                </div>


            </div>
        </section>
    )
}