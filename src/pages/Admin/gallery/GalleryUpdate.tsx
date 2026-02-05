import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import GalleryForm from "@/components/layout/admin/gallery/GalleryForm";
import { AdminService, type GalleryItem } from "@/services/admin.service";
import Spinner from "@/components/common/Spinner";
import toast from "react-hot-toast";

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
        <main className="min-h-screen">
            <section className="relative flex flex-col w-full px-4 md:px-8 pt-6 pb-20">
                <div className="flex flex-col gap-8 w-full max-w-3xl mx-auto">
                    <div className="flex flex-col gap-1 border-b border-muted/10 pb-6">
                        <h1 className="font-bold text-2xl tracking-tight">Edit Gallery Item</h1>
                        <p className="text-sm text-muted">Update your marketing showcase item details and imagery.</p>
                    </div>

                    <div className="w-full">
                        <GalleryForm initialData={item} isEdit={true} />
                    </div>
                </div>
            </section>
        </main>
    );
}
