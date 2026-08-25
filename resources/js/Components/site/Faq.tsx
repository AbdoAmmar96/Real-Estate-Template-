import { usePage } from "@inertiajs/react";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import type { FaqItem, SharedProps } from "@/lib/types";

/**
 * الأسئلة الشائعة — أكورديون بسيط.
 * أول سؤال مفتوح افتراضيًا عشان الزائر يعرف إن القسم بيتفتح أصلًا.
 */
export default function Faq({ items, title }: { items: FaqItem[]; title?: string }) {
    const { locale } = usePage<SharedProps>().props;
    const ar = locale !== "en";
    const [open, setOpen] = useState(0);

    if (items.length === 0) {
        return null;
    }

    return (
        <section>
            <h2 className="mb-4 text-2xl font-extrabold text-secondary">
                {title ?? (ar ? "الأسئلة الشائعة" : "Frequently asked questions")}
            </h2>

            <div className="flex flex-col gap-3">
                {items.map((item, i) => {
                    const isOpen = open === i;

                    return (
                        <div key={item.q} className="overflow-hidden rounded-2xl border border-gray-100 bg-surface">
                            <button
                                type="button"
                                onClick={() => setOpen(isOpen ? -1 : i)}
                                aria-expanded={isOpen}
                                className="flex w-full items-center justify-between gap-4 p-5 text-start"
                            >
                                <span className="text-[15px] font-extrabold text-secondary">{item.q}</span>
                                <ChevronDown
                                    size={18}
                                    className={`shrink-0 text-primary transition duration-200 ${isOpen ? "rotate-180" : ""}`}
                                />
                            </button>

                            {isOpen && (
                                <p className="border-t border-gray-100 px-5 py-4 text-sm leading-[1.9] text-muted">
                                    {item.a}
                                </p>
                            )}
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
