import GalleryListLayout from "@components/layout/admin/gallery/GalleryList";
import { Link } from "react-router-dom";
import { PATHS } from "@/routers/Paths";
import { Plus } from "@/icons";

export default function GalleryList() {
    return (
        <main className="w-full h-full">
            <section className="flex flex-col pt-4 md:pt-6 w-full h-full">
                <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto">
                    <div className="flex flex-col gap-1">
                        <h1 className="font-bold text-2xl tracking-tight">Gallery Showcase</h1>
                        <p className="text-sm text-muted">Manage your marketing showcase items with before and after comparisons.</p>
                    </div>

                    <div className="w-full">
                        <div className="flex justify-end">
                            <Link to={PATHS.ADMIN.GALLERY_CREATE} className="flex items-center px-3 py-1.5 border border-muted/15 rounded-full bg-emphasis">
                                <Plus className="size-4 mr-2" />
                                Add Gallery Item
                            </Link>
                        </div>
                        <GalleryListLayout />
                    </div>
                </div>
            </section>
        </main>
    );
}
