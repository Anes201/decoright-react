import { useState, useEffect } from "react";
import { ImgComparisonSlider } from '@img-comparison-slider/react';
import ZoomImage from "@components/ui/ZoomImage";
import { AdminService, type GalleryItem } from "@/services/admin.service";
import Spinner from "@/components/common/Spinner";
import toast from "react-hot-toast";

export function GalleryItemCard({ item }: { item: GalleryItem }) {
    return (
        <li className="relative flex flex-col gap-2 w-full h-full rounded-2xl px-3 md:px-4 border border-muted/20 bg-surface overflow-clip group">
            <div className="p-3 md:p-4 h-full border-x border-muted/20 flex flex-col">
                <div className="flex flex-col gap-2 mb-4">
                    <div className="relative flex items-center gap-2">
                        <div className="absolute w-2 aspect-square bg-primary border border-primary/20 rounded-full -left-5 md:-left-6" />
                        <h3 className="font-semibold sm:text-lg lg:text-xl group-hover:text-primary transition-colors"> {item.title} </h3>
                    </div>
                    {item.description && (
                        <p className="text-sm text-muted/75 line-clamp-3"> {item.description} </p>
                    )}
                </div>

                <div className="relative flex flex-col w-full mt-auto">
                    <ImgComparisonSlider className="coloured-slider max-xs:hidden aspect-video rounded-lg outline-0 cursor-ew-resize border border-muted/10">
                        <figure slot="first" className="relative w-full h-full">
                            <img
                                slot="first"
                                src={item.before_image_url || ""}
                                alt="Before"
                                className="block w-full h-full object-cover"
                            />
                            <figcaption className="absolute top-2 left-2 text-3xs uppercase tracking-widest font-bold text-white px-2 py-0.5 bg-black/50 rounded-full backdrop-blur-sm">Before</figcaption>
                        </figure>

                        <figure slot="second" className="relative w-full h-full">
                            <img
                                slot="second"
                                src={item.after_image_url || ""}
                                alt="After"
                                className="block w-full h-full object-cover"
                            />
                            <figcaption className="absolute top-2 right-2 text-3xs uppercase tracking-widest font-bold text-white px-2 py-0.5 bg-black/50 rounded-full backdrop-blur-sm">After</figcaption>
                        </figure>
                    </ImgComparisonSlider>

                    <div className="xs:hidden flex flex-col gap-4">
                        <div className='flex flex-col gap-1 w-full'>
                            <ZoomImage src={item.before_image_url || ""} className="aspect-video object-cover w-full rounded-lg" />
                            <span className="text-3xs uppercase text-muted text-center"> Before </span>
                        </div>
                        <div className='flex flex-col gap-1 w-full'>
                            <ZoomImage src={item.after_image_url || ""} className="aspect-video object-cover w-full rounded-lg" />
                            <span className="text-3xs uppercase text-muted text-center"> After </span>
                        </div>
                    </div>
                </div>
            </div>
        </li>
    );
}

export default function GalleryPortfolioListLayout() {
    const [items, setItems] = useState<GalleryItem[]>([]);
    const [loading, setLoading] = useState(true);

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
        return <div className="flex justify-center p-20"><Spinner status={true} size="lg" /></div>;
    }

    if (items.length === 0) {
        return (
            <div className="text-center p-20 border-2 border-dashed border-muted/10 rounded-2xl bg-surface/50">
                <p className="text-muted">No showcase items available at the moment.</p>
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
