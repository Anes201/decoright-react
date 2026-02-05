import GalleryList from "@/components/layout/admin/gallery/GalleryList";
import { Link } from "react-router-dom";
import { PATHS } from "@/routers/Paths";
import { ICONS } from "@/icons";

export default function GalleryListPage() {
    return (
        <main className="min-h-screen">
            <section className="relative flex flex-col w-full px-4 md:px-8 pt-6 pb-20">
                <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-muted/10 pb-6">
                        <div className="flex flex-col gap-1">
                            <h1 className="font-bold text-2xl tracking-tight">Gallery Showcase</h1>
                            <p className="text-sm text-muted">Manage your marketing showcase items with before and after comparisons.</p>
                        </div>
                        <Link to={PATHS.ADMIN.GALLERY_CREATE} className="p-button">
                            <ICONS.plus className="size-4 mr-2" />
                            Add Gallery Item
                        </Link>
                    </div>

                    <div className="w-full">
                        <GalleryList />
                    </div>
                </div>
            </section>
        </main>
    );
}
