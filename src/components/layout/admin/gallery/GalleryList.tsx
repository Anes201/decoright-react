import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ZoomImage from "@components/ui/ZoomImage";
import { PATHS } from "@/routers/Paths";
import { ICONS } from "@/icons";
import { AdminService, type GalleryItem } from "@/services/admin.service";
import toast from "react-hot-toast";
import Spinner from "@/components/common/Spinner";
import { useConfirm } from "@/components/confirm";

export function GalleryItemRow({ item, onDelete }: { item: GalleryItem, onDelete: (id: string) => void }) {
    return (
        <li className="flex flex-col gap-3 p-4 border border-muted/15 bg-surface rounded-xl hover:border-primary/30 transition-all group">
            <div className="flex gap-1 w-full aspect-video rounded-lg overflow-hidden border border-muted/10">
                <ZoomImage src={item.before_image_url || ""} className="object-cover w-1/2 h-full" />
                <ZoomImage src={item.after_image_url || ""} className="object-cover w-1/2 h-full" />
            </div>

            <div className="flex justify-between items-start gap-4">
                <div className="flex flex-col gap-1 flex-1">
                    <h3 className="font-semibold text-sm line-clamp-1">{item.title}</h3>
                    <div className="flex items-center gap-2">
                        <span className={`text-3xs font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter ${item.visibility === 'PUBLIC' ? 'bg-green-500/10 text-green-500' :
                            item.visibility === 'AUTHENTICATED_ONLY' ? 'bg-blue-500/10 text-blue-500' :
                                'bg-red-500/10 text-red-500'
                            }`}>
                            {item.visibility?.replace('_', ' ')}
                        </span>
                        <span className="text-3xs text-muted">{new Date(item.created_at!).toLocaleDateString()}</span>
                    </div>
                </div>

                <div className="flex items-center gap-1 transition-opacity">
                    <Link
                        to={PATHS.ADMIN.galleryUpdate(item.id)}
                        className="p-1.5 text-muted hover:text-primary hover:bg-primary/10 rounded-md transition-colors"
                        title="Edit Item"
                    >
                        <ICONS.pencilSquare className="size-4" />
                    </Link>
                    <button
                        onClick={() => onDelete(item.id)}
                        className="p-1.5 text-muted hover:text-red-500 hover:bg-red-500/10 rounded-md transition-colors"
                        title="Delete Item"
                    >
                        <ICONS.trash className="size-4" />
                    </button>
                </div>
            </div>
        </li>
    );
}

export default function GalleryList() {
    const [items, setItems] = useState<GalleryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const confirm = useConfirm();

    const fetchItems = async () => {
        try {
            setLoading(true);
            const data = await AdminService.getGalleryItems();
            setItems(data);
        } catch (error) {
            console.error("Failed to fetch gallery items:", error);
            toast.error("Failed to load gallery items.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const handleDelete = async (id: string) => {
        const isConfirmed = await confirm({
            title: "Delete Gallery Item",
            description: "Are you sure you want to delete this gallery item? This action cannot be undone.",
            confirmText: "Delete",
            variant: "destructive"
        });

        if (!isConfirmed) return;

        try {
            await AdminService.deleteGalleryItem(id);
            toast.success("Gallery item deleted successfully.");
            setItems(items.filter(i => i.id !== id));
        } catch (error) {
            console.error("Failed to delete item:", error);
            toast.error("Failed to delete item.");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-20">
                <Spinner status={true} size="lg" />
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-20 border-2 border-dashed border-muted/10 rounded-2xl bg-surface/50 text-center">
                <div className="p-4 bg-primary/10 rounded-full mb-4">
                    <ICONS.photo className="size-10 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-1">No Gallery Items Yet</h3>
                <p className="text-sm text-muted max-w-[300px] mb-6">
                    Start by creating your first marketing showcase item.
                </p>
                <Link to={PATHS.ADMIN.GALLERY_CREATE} className="p-button">
                    <ICONS.plus className="size-4 mr-2" />
                    Create Gallery Item
                </Link>
            </div>
        );
    }

    return (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
            {items.map((item) => (
                <GalleryItemRow key={item.id} item={item} onDelete={handleDelete} />
            ))}
        </ul>
    );
}
