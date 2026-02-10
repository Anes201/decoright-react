import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PATHS } from "@/routers/Paths";
import { AdminService, type FAQ } from "@/services/admin.service";
import { ICONS } from "@/icons";
import Spinner from "@/components/common/Spinner";
import toast from "react-hot-toast";
import { useConfirm } from "@/components/confirm";

export function FAQRow({ faq, onDelete }: { faq: FAQ, onDelete: (id: string) => void }) {
    return (
        <li className="flex flex-col gap-3 p-4 border border-muted/15 bg-surface rounded-xl hover:border-primary/30 transition-all group">
            <div className="flex justify-between items-start gap-4">
                <div className="flex flex-col gap-1 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-3xs font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary uppercase tracking-tighter">
                            Order: {faq.display_order}
                        </span>
                        <span className={`text-3xs font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter ${faq.is_active ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                            {faq.is_active ? 'Active' : 'Inactive'}
                        </span>
                    </div>
                    <h3 className="font-semibold text-sm">{faq.question_en}</h3>
                    <p className="text-xs text-muted line-clamp-2">{faq.answer_en}</p>
                </div>

                <div className="flex items-center gap-1 transition-opacity">
                    <Link
                        to={PATHS.ADMIN.faqUpdate(faq.id)}
                        className="p-1.5 text-muted hover:text-primary hover:bg-primary/10 rounded-md transition-colors"
                        title="Edit FAQ"
                    >
                        <ICONS.pencilSquare className="size-4" />
                    </Link>
                    <button
                        onClick={() => onDelete(faq.id)}
                        className="p-1.5 text-muted hover:text-red-500 hover:bg-red-500/10 rounded-md transition-colors"
                        title="Delete FAQ"
                    >
                        <ICONS.trash className="size-4" />
                    </button>
                </div>
            </div>

            {(faq.question_ar || faq.question_fr) && (
                <div className="flex gap-2 pt-2 border-t border-muted/5">
                    {faq.question_ar && <span className="text-[10px] text-muted/60 bg-muted/5 px-1.5 py-0.5 rounded">AR</span>}
                    {faq.question_fr && <span className="text-[10px] text-muted/60 bg-muted/5 px-1.5 py-0.5 rounded">FR</span>}
                </div>
            )}
        </li>
    );
}

export default function FAQList() {
    const [faqs, setFaqs] = useState<FAQ[]>([]);
    const [loading, setLoading] = useState(true);
    const confirm = useConfirm();

    const fetchFaqs = async () => {
        try {
            setLoading(true);
            const data = await AdminService.getFAQs();
            setFaqs(data);
        } catch (error) {
            console.error("Failed to fetch FAQs:", error);
            // toast.error("Failed to load FAQs.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFaqs();
    }, []);

    const handleDelete = async (id: string) => {
        const isConfirmed = await confirm({
            title: "Delete FAQ",
            description: "Are you sure you want to delete this FAQ? This action cannot be undone.",
            confirmText: "Delete",
            variant: "destructive"
        });

        if (!isConfirmed) return;

        try {
            await AdminService.deleteFAQ(id);
            toast.success("FAQ deleted successfully.");
            setFaqs(faqs.filter(f => f.id !== id));
        } catch (error) {
            console.error("Failed to delete FAQ:", error);
            toast.error("Failed to delete FAQ.");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-20">
                <Spinner status={true} size="lg" />
            </div>
        );
    }

    if (faqs.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-20 border-2 border-dashed border-muted/10 rounded-2xl bg-surface/50 text-center">
                <div className="p-4 bg-primary/10 rounded-full mb-4">
                    <ICONS.informationCircle className="size-10 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-1">No FAQs Found</h3>
                <p className="text-sm text-muted max-w-[300px] mb-6">
                    Add frequently asked questions to help your customers understand your services better.
                </p>
                <Link to={PATHS.ADMIN.FAQ_CREATE} className="p-button">
                    <ICONS.plus className="size-4 mr-2" />
                    Add Your First FAQ
                </Link>
            </div>
        );
    }

    return (
        <ul className="flex flex-col gap-4 w-full">
            {faqs.map((faq) => (
                <FAQRow key={faq.id} faq={faq} onDelete={handleDelete} />
            ))}
        </ul>
    );
}
