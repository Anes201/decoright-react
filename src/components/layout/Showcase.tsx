
import ZoomImage from "../ui/ZoomImage";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { showcases } from "@/constants";


export function ShowcaseCard({ showcase }: { showcase: any }) {
    const [imgLoaded, setImgLoaded] = useState(false);
    const { t } = useTranslation();

    const handleImageLoad = () => setImgLoaded(true);

    return (
        <li className="group/item">
            <Link to={'#'}>
                <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-muted/5 border border-muted/10">
                    <ZoomImage
                        src={showcase.src}
                        alt={showcase.alt}
                        className={`${!imgLoaded && 'hidden'} h-full w-full object-cover transition-all duration-600 group-hover/item:scale-104`}
                        onLoad={handleImageLoad}
                    />
                </div>

                <div className="px-1 mt-2">
                    <h3 className="font-semibold text-sm sm:text-base text-heading group-hover/item:text-primary transition-colors duration-300 line-clamp-1">
                        {t(`showcases.${showcase.key}`)}
                    </h3>
                </div>
            </Link>
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
