import { useState, useEffect } from "react";
import { AdminService, type FAQ } from "@/services/admin.service";
import { useTranslation } from "react-i18next";
import Spinner from "@/components/common/Spinner";

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
        const currentLang = i18n.language.split('-')[0]; // Handle language variants like 'en-US'

        switch (currentLang) {
            case 'ar':
                return {
                    question: faq.question_ar || faq.question_en,
                    answer: faq.answer_ar || faq.answer_en
                };
            case 'fr':
                return {
                    question: faq.question_fr || faq.question_en,
                    answer: faq.answer_fr || faq.answer_en
                };
            default:
                return {
                    question: faq.question_en,
                    answer: faq.answer_en
                };
        }
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
                    <li key={faq.id} className="flex flex-col border-b border-muted/10 pb-2" onClick={() => setOpenIndex(isOpen ? null : index)}>

                        <div className="flex justify-between items-center mb-2 gap-2 cursor-pointer">
                            <h4 className="font-medium text-muted text-xs md:text-sm mb-2"> {question} </h4>
                            <button
                                type="button"
                                className="transition-transform duration-300"
                                aria-expanded={isOpen}
                                aria-controls={`faq-answer-${index}`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`size-4 md:size-5 ${isOpen ? 'rotate-180' : ''}`}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
                            </button>
                        </div>

                        <div id={`faq-answer-${index}`} className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                            <p className="text-sm text-foreground mt-1 mb-4"> {answer} </p>
                        </div>
                    </li>
                )
            })}
        </ul>
    )
}
