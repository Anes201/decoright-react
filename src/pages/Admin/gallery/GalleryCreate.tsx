
// Request page for admin users to overview and manage request

import GalleryCreateLayout from "@/components/layout/admin/GalleryCreate";

export default function GalleryCreate() {
    return (
        <main>
            <section className="h-hero min-h-hero relative flex flex-col w-full md:pt-8 mb-40">
                <div className="relative flex flex-col gap-8 h-full">
                    <h1 className="font-semibold text-lg md:text-2xl"> Create a Gallery </h1>
                    {/* Request overview content goes here */}

                    <div className="w-full lg:w-2/3 border border-red-400">

                    <GalleryCreateLayout />

                    </div>

                </div>
            </section>
        </main>
    )
}