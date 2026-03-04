
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
            <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-muted/5 border border-muted/15 transition-all duration-300 hover:shadow-md hover:border-primary/20">
                {!imgLoaded && (
                    <div className="flex items-center justify-center w-full h-full animate-pulse">
                        <Photo className="size-10 text-muted/30" />
                    </div>
                )}
                <ZoomImage
                    src={showcase.src}
                    alt={showcase.alt}
                    className={`h-full w-full object-cover transition-all duration-500 group-hover/item:scale-105 ${
                        imgLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                />
            </div>
            <div className="px-1 mt-3">
                <h3 className="font-semibold text-foreground text-sm sm:text-base transition-colors group-hover/item:text-primary line-clamp-1">
                    {t(`showcases.${showcase.key}`)}
                </h3>
            </div>
        </li>
    )
}

export default function ShowcaseCardList() {
    return (
        <ul className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
            {showcases.map((showcase, index) => (
                <ShowcaseCard key={index} showcase={showcase} />
            ))}
        </ul>
    )
}
