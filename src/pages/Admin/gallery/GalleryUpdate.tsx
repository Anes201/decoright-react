import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import GalleryForm from "@/components/layout/admin/gallery/GalleryForm";
import { AdminService, type GalleryItem } from "@/services/admin.service";
import Spinner from "@/components/common/Spinner";
import toast from "react-hot-toast";
import { useConfirm } from "@/components/confirm";
import { PATHS } from "@/routers/Paths";
import { ICONS } from "@/icons";


function DeleteButton({ id }: { id: string }) {
    const confirm = useConfirm();
    const navigate = useNavigate();
    const [deleting, setDeleting] = useState(false);

    const handleDelete = async () => {
        const isConfirmed = await confirm({
            title: "Delete Gallery Item",
            description: "Are you sure you want to delete this showcase item? This action cannot be undone.",
            confirmText: "Delete Item",
            variant: "destructive"
        });

        if (!isConfirmed) return;

        setDeleting(true);
        try {
            await AdminService.deleteGalleryItem(id);
            toast.success("Gallery item deleted successfully");
            navigate(PATHS.ADMIN.GALLERY_LIST);
        } catch (error) {
            console.error("Delete failed:", error);
            toast.error("Failed to delete item");
        } finally {
            setDeleting(false);
        }
    };

    return (
        <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-red-200"
        >
            {deleting ? <Spinner status={true} size="sm" /> : <ICONS.trash className="size-4" />}
            Delete
        </button>
    );
}

export default function GalleryUpdatePage() {
    const { id } = useParams();
    const [item, setItem] = useState<GalleryItem | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchItem = async () => {
            if (!id) return;
            try {
                const data = await AdminService.getGalleryItem(id);
                setItem(data);
            } catch (error) {
                console.error("Failed to fetch gallery item:", error);
                toast.error("Failed to load gallery item.");
            } finally {
                setLoading(false);
            }
        };

        fetchItem();
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Spinner status={true} size="lg" />
            </div>
        );
    }

    if (!item) {
        return (
            <div className="flex flex-col items-center justify-center p-20 text-center">
                <h3 className="font-semibold text-lg">Item Not Found</h3>
                <p className="text-sm text-muted">The gallery item you are looking for does not exist.</p>
            </div>
        );
    }

    return (
        <main className="w-full">
            <section className="relative flex flex-col w-full px-4 md:px-8 py-6">
                <div className="flex flex-col gap-8 w-full max-w-3xl mx-auto">
                    <div className="flex flex-col gap-1 border-b border-muted/10 pb-6">
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2 text-muted mb-2">
                                    <Link to={PATHS.ADMIN.GALLERY_LIST} className="hover:text-primary transition-colors">Gallery</Link>
                                    <ICONS.chevronRight className="size-3" />
                                    <span>Edit</span>
                                </div>
                                <h1 className="font-bold text-2xl tracking-tight">Edit Gallery Item</h1>
                                <p className="text-sm text-muted">Update your marketing showcase item details and imagery.</p>
                            </div>

                            <DeleteButton id={item.id} />
                        </div>
                    </div>

                    <div className="w-full">
                        <GalleryForm initialData={item} isEdit={true} />
                    </div>
                </div>
            </section>
        </main>
    );
}
