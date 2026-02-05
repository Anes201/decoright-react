import GalleryForm from "@/components/layout/admin/gallery/GalleryForm";

export default function GalleryCreatePage() {
    return (
        <main className="min-h-screen">
            <section className="relative flex flex-col w-full px-4 md:px-8 pt-6 pb-20">
                <div className="flex flex-col gap-8 w-full max-w-3xl mx-auto">
                    <div className="flex flex-col gap-1 border-b border-muted/10 pb-6">
                        <h1 className="font-bold text-2xl tracking-tight">Add Gallery Item</h1>
                        <p className="text-sm text-muted">Create a new marketing showcase item with before and after imagery.</p>
                    </div>

                    <div className="w-full">
                        <GalleryForm />
                    </div>
                </div>
            </section>
        </main>
    );
}
