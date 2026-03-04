
import { useState, useEffect, useRef } from "react";
import { AdminService, type FAQ } from "@/services/admin.service";
import { useTranslation } from "react-i18next";
import { getLocalizedContent } from "@/utils/i18n";
import { ChevronDown } from "@/icons";

type FAQItemProps = {
  question: string;
  answer: string;
  index: number;
  isOpen: boolean;
  onToggle: (index: number) => void;
};

export function FAQItem({ question, answer, index, isOpen, onToggle }: FAQItemProps) {
  const contentRef = useRef<HTMLDivElement | null>(null);
  // maxHeight state: '0px' | '<N>px' | 'none'
  const [maxHeight, setMaxHeight] = useState<string>("0px");

  // Update maxHeight when isOpen changes
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const setMeasured = () => {
      // measure content's full height
      const scrollH = el.scrollHeight;
      return `${scrollH}px`;
    };

    if (isOpen) {
      // Opening: set to measured height to animate from 0 -> px
      const measured = setMeasured();
      setMaxHeight(measured);

      // after transition ends, drop the max-height so content can grow/shrink naturally
      const onTransitionEnd = (ev: TransitionEvent) => {
        if (ev.propertyName === "max-height") {
          // only remove restriction if still open
          if (isOpen) setMaxHeight("none");
          el.removeEventListener("transitionend", onTransitionEnd);
        }
      };
      el.addEventListener("transitionend", onTransitionEnd);
    } else {
      // Closing: if we were 'none' (no max), set px first so we can animate to 0
      const currentlyNone = maxHeight === "none";
      const measured = setMeasured();
      if (currentlyNone) {
        // apply measured px, then in next frame animate to 0
        setMaxHeight(measured);
        requestAnimationFrame(() => requestAnimationFrame(() => setMaxHeight("0px")));
      } else {
        // normally animate from current px -> 0
        setMaxHeight(measured); // ensure we start from measured value
        requestAnimationFrame(() => setMaxHeight("0px"));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // style object for animated panel
  const panelStyle: React.CSSProperties =
    maxHeight === "none"
      ? { maxHeight: undefined, opacity: 1, transition: "opacity 240ms ease" }
      : { maxHeight, opacity: isOpen ? 1 : 0, transition: "max-height 320ms cubic-bezier(.2,.9,.2,1), opacity 180ms ease" };

  return (
    <li
      key={index}
      className="group/item flex flex-col p-4 ring-1 ring-muted/15 bg-surface rounded-lg cursor-pointer"
      // keep click on entire li (or you can put on button)
      onClick={() => onToggle(index)}
    >
      <div className="flex justify-between items-center gap-2">
        <h4 className="font-medium text-muted text-xs md:text-sm">{question}</h4>

        <button
          type="button"
          aria-expanded={isOpen}
          aria-controls={`faq-answer-${index}`}
          className="p-2 ring-muted/15 rounded-full group-hover/item:ring-1 transition-transform"
          onClick={(e) => {
            e.stopPropagation(); // avoid double toggle when clicking the button
            onToggle(index);
          }}
        >
          <ChevronDown
            className={`size-4 md:size-5 transform transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"}`}
          />
        </button>
      </div>

      <div
        id={`faq-answer-${index}`}
        ref={contentRef}
        style={panelStyle}
        className="overflow-hidden"
        aria-hidden={!isOpen}
      >
        <div className="pt-4"> {/* inner padding so max-height measurement includes spacing */}
          <p className="text-sm text-foreground">{answer}</p>
        </div>
      </div>
    </li>
  );
}

export default function FAQList() {
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
          <div className="flex flex-col gap-4 w-full animate-pulse">
              <hr className="absolute top-0 start-8 h-full border-0 border-s border-muted/25 -z-10 pointer-events-none" />
              <hr className="absolute top-0 end-8 h-full border-0 border-e border-muted/25 -z-10 pointer-events-none" />
              {[...Array(5)].map((_, i) => (
                  <>
                      <div key={i} className="relative flex items-center justify-end p-5 bg-surface rounded-lg ring-1 ring-muted/15">
                          <ChevronDown className="size-6 text-muted/75" />
                      </div>
                  </>
              ))}
          </div>
        );
    }

    if (faqData.length === 0) {
        return null;
    }

    return (
        <ul className="flex flex-col gap-4 w-full">
            <hr className="absolute top-0 start-8 h-full border-0 border-s border-muted/25 -z-10 pointer-events-none" />
            <hr className="absolute top-0 end-8 h-full border-0 border-e border-muted/25 -z-10 pointer-events-none" />
            {faqData.map((faq, index) => {
                const { question, answer } = getTranslatedContent(faq);
                const isOpen = index === openIndex;

                return (
                    <FAQItem
                      key={faq.id}
                      index={index}
                      question={question}
                      answer={answer}
                      isOpen={isOpen}
                      onToggle={() => setOpenIndex(isOpen ? null : index)}
                    />
                )
            })}
        </ul>
    )
}
