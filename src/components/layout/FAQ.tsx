
import { ICONS } from "@/icons";
import { useState } from "react";

export function FAQList () {
    const faqData = [
        {
            question: "What services do you offer?",
            answer: "We offer a wide range of interior design services including residential, commercial, office, hospitality, and retail design."
        },
        {
            question: "How can I get a quote for my project?",
            answer: "You can contact us through our website or call us directly to discuss your project and receive a customized quote. contact us through our website or call us directly to discuss your project and receive a customized quote. contact us through our website or call us directly to discuss your project and receive a customized quote. contact us through our website or call us directly to discuss your project and receive a customized quote. contact us through our website or call us directly to discuss your project and receive a customized quote.contact us through our website or call us directly to discuss your project and receive a customized quote.contact us through our website or call us directly to discuss your project and receive a customized quote."
        },
        {
            question: "What is your design process?",
            answer: "Our design process includes an initial consultation, concept development, design presentation, revisions, and final implementation."
        },
        {
            question: "Do you provide project management services?",
            answer: "Yes, we offer comprehensive project management services to ensure your project is completed on time and within budget."
        },
        {
            question: "Can you work within my budget?",
            answer: "Absolutely! We tailor our services to meet your budget while still delivering high-quality design solutions."
        },
    ];

    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <ul className="flex flex-col gap-6 w-full">
            {faqData.map((faq, index) => {
                const isOpen = index === openIndex;
                return (
                    <li key={index} className="flex flex-col border-b border-muted/15 pb-2" onClick={() => setOpenIndex(isOpen ? null : index)}>

                        <div className="flex justify-between items-center mb-2 gap-2 cursor-pointer">
                            <h4 className="text-muted text-xs md:text-sm mb-2"> {faq.question} </h4>
                            <button
                                type="button"
                                aria-expanded={isOpen}
                                aria-controls={`faq-answer-${index}`}
                            >
                            <ICONS.chevronDown className={`size-4 md:size-5 ${isOpen ? 'rotate-180' : ''}`}/>
                            </button>
                        </div>

                        <div id={`faq-answer-${index}`} className={`overflow-hidden ${isOpen ? 'max-h-full mb-2' : 'max-h-0'}`}>
                            <p className="text-sm text-foreground"> {faq.answer} </p>
                        </div>
                    </li>
                )
            })}
        </ul>
    )
}
