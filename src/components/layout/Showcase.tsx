
import ZoomImage from "../ui/ZoomImage";
import { useTranslation } from "react-i18next";
import { showcases } from "@/constants";
import { useImageLoaded } from "@/hooks/useImageLoaded";
import { Photo } from "@/icons";

export function ShowcaseCard({ showcase }: { showcase: any }) {
    const { loaded: imgLoaded } = useImageLoaded(showcase.src);
    const { t } = useTranslation();

    return (
        <li className="group/item">
            <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-muted/5 border border-muted/10">
                {!imgLoaded &&
                    <div className="flex items-center justify-center w-full h-full animate-[pulse_2s_ease-in-out_infinite]">
                        <Photo className="size-12" />
                    </div>
                }
                <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-muted/5 border border-muted/10">
                    <ZoomImage
                        src={showcase.src}
                        alt={showcase.alt}
                        className={`${!imgLoaded && 'hidden'} h-full w-full object-cover transition-all duration-600 group-hover/item:scale-104`}
                    />
                </div>


            </div>
            <div className="px-1 mt-1">
                <h3 className="font-semibold text-muted text-sm sm:text-base group-hover/item:text-foreground text-heading line-clamp-1">
                    { t(`showcases.${showcase.key}`) }
                </h3>
            </div>
        </li>
    )
}


export function ShowcaseCardList() {
    return (
        <ul className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-[repeat(auto-fit,minmax(18rem,1fr))] grid-cols-m gap-6 w-full">
            {showcases.map((showcase, index) => (
                <ShowcaseCard key={index} showcase={showcase} />
            ))}
        </ul>
    )
}
