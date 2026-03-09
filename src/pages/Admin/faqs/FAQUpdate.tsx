import { useTranslation } from "react-i18next";
import Spinner from "@/components/common/Spinner";
import FAQForm from "@/components/layout/admin/faqs/FAQForm";
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { PATHS } from "@/routers/Paths";
import { AdminService, type FAQ } from "@/services/admin.service";
import { ChevronRight } from "@/icons";

export default function FAQUpdatePage() {
    const { t } = useTranslation();
    const { id } = useParams();
    const [faq, setFaq] = useState<FAQ | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFaq = async () => {
            if (!id) return;
            try {
                const faqs = await AdminService.getFAQs();
                const item = faqs.find((f: FAQ) => f.id === id);
                if (item) setFaq(item);
            } catch (error) {
                console.error("Failed to fetch FAQ:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchFaq();
    }, [id]);

    return (
        <main className="w-full">
            <section className="relative flex flex-col w-full px-4 md:px-8 py-6">
                <div className="flex flex-col gap-8 w-full max-w-3xl mx-auto">
                    <div className="flex flex-col gap-1 border-b border-muted/10 pb-6">
                        <div className="flex items-center gap-2 text-muted mb-2">
                            <Link to={PATHS.ADMIN.FAQ_LIST} className="hover:text-primary transition-colors text-sm">{t('admin.faqs.breadcrumb_faqs')}</Link>
                            <ChevronRight className="size-3" />
                            <span className="text-sm">{t('admin.faqs.breadcrumb_edit')}</span>
                        </div>
                        <h1 className="font-bold text-2xl tracking-tight">{t('admin.faqs.edit_title')}</h1>
                        <p className="text-sm text-muted">{t('admin.faqs.edit_subtitle')}</p>
                    </div>

                    <div className="w-full">
                        {loading ? (
                            <div className="flex items-center justify-center p-20">
                                <Spinner status={true} size="lg" />
                            </div>
                        ) : faq ? (
                            <FAQForm initialData={faq} isUpdate={true} />
                        ) : (
                            <div className="p-10 text-center bg-surface border border-muted/10 rounded-2xl">
                                <p className="text-muted">{t('admin.faqs.not_found')}</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </main>
    );
}
