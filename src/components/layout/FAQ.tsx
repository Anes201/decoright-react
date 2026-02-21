import Spinner from "@/components/common/Spinner";
import { useState, useEffect } from "react";
import { AdminService, type FAQ } from "@/services/admin.service";
import { useTranslation } from "react-i18next";
import { getLocalizedContent } from "@/utils/i18n";
import { ChevronDown } from "@/icons";

export function FAQList() {
    const { i18n } = useTranslation();
    const [faqData, setFaqData] = useState<FAQ[]>([]);
    const [loading, setLoading] = useState(true);
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    useEffect(() => {
        const fetchFaqs = async () => {
            try {
                const data = await AdminService.getFAQs({ is_active: true });
                setFaqData(data);
            } catch (error) {
                console.error("Failed to fetch FAQs:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFaqs();
    }, []);

    const getTranslatedContent = (faq: FAQ) => {
        const lang = i18n.language;
        return {
            question: getLocalizedContent(faq, 'question', lang),
            answer: getLocalizedContent(faq, 'answer', lang)
        };
    };

    if (loading) {
        return (
            <div className="flex justify-center p-10">
                <Spinner status={true} size="md" />
            </div>
        );
    }

    if (faqData.length === 0) {
        return null;
    }

    return (
        <ul className="flex flex-col gap-6 w-full">
            {faqData.map((faq, index) => {
                const { question, answer } = getTranslatedContent(faq);
                const isOpen = index === openIndex;

                return (
                    <li key={faq.id} className="group/item flex flex-col border-b border-muted/25 pb-2" onClick={() => setOpenIndex(isOpen ? null : index)}>

                        <div className="flex justify-between items-center mb-2 gap-2 cursor-pointer">
                            <h4 className="font-medium text-muted text-xs md:text-sm mb-2"> {question} </h4>
                            <button
                                type="button"
                                aria-expanded={isOpen}
                                aria-controls={`faq-answer-${index}`}
                                className="p-2 ring-muted/15 rounded-full group-hover/item:ring-1"
                            >
                            <ChevronDown className={`size-4 md:size-5 ${isOpen ? 'rotate-180' : ''}`}/>
                            </button>
                        </div>

                        <div id={`faq-answer-${index}`} className={`overflow-hidden transition-all duration-150 ${isOpen ? 'max-h-125 opacity-100' : 'max-h-0 opacity-0'}`}>
                            <p className="text-sm text-foreground mt-1 mb-4"> {answer} </p>
                        </div>
                    </li>
                )
            })}
        </ul>
    )
}
