import { useState, useEffect } from "react";
import { ImgComparisonSlider } from '@img-comparison-slider/react';
import ZoomImage from "@components/ui/ZoomImage";
import { AdminService, type GalleryItem } from "@/services/admin.service";
import Spinner from "@/components/common/Spinner";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

export function GalleryItemCard({ item }: { item: GalleryItem }) {

    const { t } = useTranslation('common');

    return (
        <li className="relative flex flex-col gap-2 w-full h-full rounded-2xl cursor-pointer px-3 md:px-4 border border-muted/20 bg-surface overflow-clip">
            {/* <div className='primary-gallery-card absolute top-0 left-0 w-full h-full border hover:bg-primary/10 rounded-2xl -z-10 mask-b-to-transparent mask-b-to-100%'></div> */}
            <div className="p-3 md:p-4 h-full border-x border-muted/20">
                <div className="flex flex-col gap-4">

                    <div className="flex flex-col gap-2">
                        <div className="relative flex items-center gap-2">
                            <div className="absolute w-2 aspect-square bg-emphasis border border-muted/45 rounded-full ltr:-left-4 md:ltr:-left-5 rtl:-right-5" />
                            <h3 className="font-medium sm:text-lg lg:text-xl "> {item.title} </h3>
                        </div>
                        <p className="text-ellipsis-6line text-2xs md:text-xs text-muted/75"> {item.description} </p>
                    </div>

                </div>

                <div className="relative flex flex-col w-full mt-4">

                    {/* Details & Checklist */}

                    <ImgComparisonSlider className="coloured-slider max-xs:hidden flex h-full aspect-video rounded-lg outline-0 cursor-ew-resize">
                        <figure slot="first" className="relative w-full h-full">
                            <img
                            slot="first"
                            aria-label="Before Image"
                            src={item.before_image_url || ""}
                            className="block w-full h-full object-cover object-center"
                            />
                            <figcaption className="absolute top-2 left-2 font-medium uppercase text-xs text-white px-2 py-0.5 border border-muted/45 bg-black/45 rounded-full">{ t('common:before') } </figcaption>
                        </figure>

                        <figure slot="second" className="relative w-full h-full">
                            <img
                            slot="second"
                            aria-label="After Image"
                            src={item.after_image_url || ""}
                            className="block w-full h-full object-cover object-center"
                            />
                            <figcaption className="absolute top-2 right-2 font-medium uppercase text-xs text-white px-2 py-0.5 border border-muted/45 bg-black/45 rounded-full"> { t('common:after') } </figcaption>
                        </figure>
                    </ImgComparisonSlider>

                    <div className="xs:hidden flex flex-col gap-4">

                        <div className='flex flex-col justify-center gap-2 w-full text-center'>
                            <ZoomImage slot="first" src={item.before_image_url || ""} className="aspect-video object-cover w-full h-full rounded-lg"/>
                            <span className="font-medium text-xs md:text-sm"> Before </span>
                        </div>

                        <div className='flex flex-col justify-center gap-2 w-full text-center'>
                            <ZoomImage slot="second" src={item.after_image_url || ""} className="aspect-video object-cover w-full h-full rounded-lg"/>
                            <span className="font-medium text-xs md:text-sm"> After </span>
                        </div>
                    </div>

                    <div className="max-md:hidden absolute -bottom-[105%] w-full h-full border border-muted/15 rounded-lg" />

                </div>
            </div>
        </li>
    );
}

export default function GalleryPortfolioListLayout() {
    const [items, setItems] = useState<GalleryItem[]>([]);
    const [loading, setLoading] = useState(true);

    const { t } = useTranslation('nav');

    useEffect(() => {
        const fetchItems = async () => {
            try {
                // Public list only shows 'PUBLIC' items
                const data = await AdminService.getGalleryItems({ visibility: ['PUBLIC'] });
                setItems(data);
            } catch (error) {
                console.error("Failed to fetch gallery items:", error);
                toast.error("Failed to load gallery items.");
            } finally {
                setLoading(false);
            }
        };

        fetchItems();
    }, []);

    if (loading) {
        return <div className="flex justify-center p-20"><Spinner status={loading} /></div>;
    }

    if (items.length === 0) {
        return (
            <div className="text-center p-20 border-2 border-dashed border-muted/10 rounded-2xl bg-surface/50">
                <p className="text-muted"> { t('nav:gallery_list_empty') } </p>
            </div>
        );
    }

    return (
        <ul className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
            {items.map((item) => (
                <GalleryItemCard key={item.id} item={item} />
            ))}
        </ul>
    );
}
