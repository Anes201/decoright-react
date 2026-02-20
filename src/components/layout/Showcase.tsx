
import { ICONS } from "@/icons";
import { showcases } from "@/constants";
import ZoomImage from "../ui/ZoomImage";
import { useState } from "react";


export function ShowcaseCard({ showcase }: { showcase: any }) {
    const [imgLoaded, setImgLoaded] = useState(false);

    const handleImageLoad = () => setImgLoaded(true);

    const handleImageError = () => {
        console.error('Image failed to load');
        // You might want to handle the error state differently (e.g., show a fallback)
    };

    return (
        <li className="group/item">
            <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-muted/5 border border-muted/10">
                {!imgLoaded &&
                    <div className="flex items-center justify-center w-full h-full animate-[pulse_2s_ease-in-out_infinite]">
                        <ICONS.photo className="size-12" />
                    </div>
                }

                <ZoomImage
                    src={showcase.src}
                    alt={showcase.title}
                    className={`${!imgLoaded && 'hidden'} h-full w-full object-cover transition-all duration-600 group-hover/item:scale-104`}
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                />
            </div>

            <div className="px-1 mt-1">
                <h3 className="font-semibold text-xs sm:text-sm text-heading text-muted group-hover:text-foreground transition-colors duration-300 flex-1 line-clamp-1">
                    {showcase.title}
                </h3>
            </div>
        </li>
    )
}


// Showcases meant to be static and not based on real projects.
export function ShowcaseCardList() {

    return (
        <ul className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-[repeat(auto-fit,minmax(18rem,1fr))] grid-cols-m gap-6 w-full">
            {showcases.map((showcase, index) => (
                <ShowcaseCard key={index} showcase={showcase} />
            ))}
        </ul>
    )
}
