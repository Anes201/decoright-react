import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AdminService, type FAQ } from "@/services/admin.service";
import { PButton } from "@/components/ui/Button";
import Spinner from "@/components/common/Spinner";
import toast from "react-hot-toast";

interface FAQFormProps {
    initialData?: FAQ;
    isUpdate?: boolean;
}

export default function FAQForm({ initialData, isUpdate = false }: FAQFormProps) {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        question_en: "",
        question_ar: "",
        question_fr: "",
        answer_en: "",
        answer_ar: "",
        answer_fr: "",
        display_order: 0,
        is_active: true
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                question_en: initialData.question_en || "",
                question_ar: initialData.question_ar || "",
                question_fr: initialData.question_fr || "",
                answer_en: initialData.answer_en || "",
                answer_ar: initialData.answer_ar || "",
                answer_fr: initialData.answer_fr || "",
                display_order: initialData.display_order || 0,
                is_active: initialData.is_active !== false
            });
        }
    }, [initialData]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isUpdate && initialData?.id) {
                await AdminService.updateFAQ(initialData.id, formData);
                toast.success(t('admin.faqs.form_success_update'));
            } else {
                await AdminService.createFAQ(formData);
                toast.success(t('admin.faqs.form_success_create'));
            }
            navigate(-1);
        } catch (error) {
            console.error("FAQ operation failed:", error);
            toast.error(t('admin.faqs.form_error'));
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const val = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
        setFormData(prev => ({ ...prev, [name]: val }));
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 bg-surface p-6 rounded-2xl border border-muted/10">
            <div className="grid grid-cols-1 gap-6">
                {/* English Section (Primary) */}
                <div className="space-y-4">
                    <h3 className="font-semibold text-sm text-primary uppercase tracking-wider">{t('admin.faqs.form_section_en')}</h3>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-muted ml-1">{t('admin.faqs.form_question_en')}</label>
                        <input
                            required
                            name="question_en"
                            value={formData.question_en}
                            onChange={handleChange}
                            className="bg-muted/5 border border-muted/20 rounded-lg px-3 py-2 text-sm focus:border-primary/50 outline-hidden transition-all"
                            placeholder="e.g. What is your design process?"
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-muted ml-1">{t('admin.faqs.form_answer_en')}</label>
                        <textarea
                            required
                            name="answer_en"
                            rows={4}
                            value={formData.answer_en}
                            onChange={handleChange}
                            className="bg-muted/5 border border-muted/20 rounded-lg px-3 py-2 text-sm focus:border-primary/50 outline-hidden transition-all resize-none"
                            placeholder="Explain the process..."
                        />
                    </div>
                </div>

                {/* Arabic Section */}
                <div className="space-y-4 pt-4 border-t border-muted/10" dir="rtl">
                    <h3 className="font-semibold text-sm text-primary uppercase tracking-wider text-right">{t('admin.faqs.form_section_ar')}</h3>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-muted mr-1 text-right">{t('admin.faqs.form_question_ar')}</label>
                        <input
                            name="question_ar"
                            value={formData.question_ar}
                            onChange={handleChange}
                            className="bg-muted/5 border border-muted/20 rounded-lg px-3 py-2 text-sm focus:border-primary/50 outline-hidden transition-all text-right"
                            placeholder="مثال: ما هي عملية التصميم الخاصة بكم؟"
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-muted mr-1 text-right">{t('admin.faqs.form_answer_ar')}</label>
                        <textarea
                            name="answer_ar"
                            rows={4}
                            value={formData.answer_ar}
                            onChange={handleChange}
                            className="bg-muted/5 border border-muted/20 rounded-lg px-3 py-2 text-sm focus:border-primary/50 outline-hidden transition-all resize-none text-right"
                            placeholder="اشرح العملية..."
                        />
                    </div>
                </div>

                {/* French Section */}
                <div className="space-y-4 pt-4 border-t border-muted/10">
                    <h3 className="font-semibold text-sm text-primary uppercase tracking-wider">{t('admin.faqs.form_section_fr')}</h3>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-muted ml-1">{t('admin.faqs.form_question_fr')}</label>
                        <input
                            name="question_fr"
                            value={formData.question_fr}
                            onChange={handleChange}
                            className="bg-muted/5 border border-muted/20 rounded-lg px-3 py-2 text-sm focus:border-primary/50 outline-hidden transition-all"
                            placeholder="e.g. Quel est votre processus de conception ?"
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-muted ml-1">{t('admin.faqs.form_answer_fr')}</label>
                        <textarea
                            name="answer_fr"
                            rows={4}
                            value={formData.answer_fr}
                            onChange={handleChange}
                            className="bg-muted/5 border border-muted/20 rounded-lg px-3 py-2 text-sm focus:border-primary/50 outline-hidden transition-all resize-none"
                            placeholder="Expliquez le processus..."
                        />
                    </div>
                </div>

                {/* Settings Section */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-muted/10">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-muted ml-1">{t('admin.faqs.form_display_order')}</label>
                        <input
                            type="number"
                            name="display_order"
                            value={formData.display_order}
                            onChange={handleChange}
                            className="bg-muted/5 border border-muted/20 rounded-lg px-3 py-2 text-sm focus:border-primary/50 outline-hidden transition-all"
                        />
                    </div>
                    <div className="flex items-center gap-3 mt-6 ml-1">
                        <input
                            type="checkbox"
                            id="is_active"
                            name="is_active"
                            checked={formData.is_active}
                            onChange={handleChange}
                            className="size-4 accent-primary"
                        />
                        <label htmlFor="is_active" className="text-sm font-medium text-foreground cursor-pointer underline underline-offset-4 decoration-primary/30">{t('admin.faqs.form_is_active')}</label>
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-3 mt-4">
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="px-6 py-2.5 text-sm font-medium text-muted hover:text-foreground transition-colors"
                >
                    {t('admin.faqs.form_cancel')}
                </button>
                <PButton type="submit" disabled={loading} className="px-8 py-2.5 h-auto">
                    <Spinner status={false} size="sm">
                        {isUpdate ? t('admin.faqs.form_submit_update') : t('admin.faqs.form_submit_create')}
                    </Spinner>
                </PButton>
            </div>
        </form>
    );
}
