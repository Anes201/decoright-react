import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import GalleryForm from "@/components/layout/admin/gallery/GalleryForm";
import { PATHS } from "@/routers/Paths";
import { ChevronRight } from "@/icons";

export default function GalleryCreatePage() {
    const { t } = useTranslation();

    return (
        <main className="w-full">
            <section className="relative flex flex-col w-full px-4 md:px-8 py-6">
                <div className="flex flex-col gap-8 w-full max-w-3xl">
                    <div className="flex flex-col gap-1 border-b border-muted/10 pb-6">
                        <div className="flex items-center gap-2 text-muted mb-2">
                            <Link to={PATHS.ADMIN.GALLERY_LIST} className="hover:text-primary transition-colors">{t('admin.gallery.breadcrumb_gallery')}</Link>
                            <ChevronRight className="size-3" />
                            <span>{t('admin.gallery.breadcrumb_create')}</span>
                        </div>
                        <h1 className="font-bold text-2xl tracking-tight">{t('admin.gallery.create_title')}</h1>
                        <p className="text-sm text-muted">{t('admin.gallery.create_subtitle')}</p>
                    </div>

                    <div className="w-full">
                        <GalleryForm />
                    </div>
                </div>
            </section>
        </main>
    );
}
