import { Link, usePage } from "@inertiajs/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import CompoundCard from "@/Components/site/CompoundCard";
import Reveal from "@/Components/site/Reveal";
import type { Compound, SharedProps } from "@/lib/types";

/**
 * سلايدر كروت مشاريع — بيخدم «أحدث المشروعات» في الرئيسية
 * و«مشروعات أخرى من نفس المطوّر» و«كمبوندات قريبة» في صفحة الكمبوند.
 *
 * التمرير CSS scroll-snap مش مكتبة: أخف وبيشتغل باللمس على الموبايل
 * من غير أي جافاسكربت، والأزرار زيادة للماوس.
 */
export default function CompoundsCarousel({
    items,
    title,
    desc,
    allHref,
    allLabel,
    tone = "bg",
}: {
    items: Compound[];
    title: string;
    desc?: string;
    allHref?: string;
    allLabel?: string;
    tone?: "bg" | "surface";
}) {
    const { locale } = usePage<SharedProps>().props;
    const ar = locale !== "en";
    const track = useRef<HTMLDivElement>(null);

    if (items.length === 0) {
        return null;
    }

    // في RTL الاتجاه مقلوب، فـ"التالي" بيبقى قيمة سالبة
    const scroll = (forward: boolean) => {
        const step = 320 * (forward ? 1 : -1) * (ar ? -1 : 1);
        track.current?.scrollBy({ left: step, behavior: "smooth" });
    };

    return (
        <section className={`px-4 py-14 ${tone === "surface" ? "bg-surface" : "bg-bg"}`}>
            <div className="mx-auto max-w-7xl">
                <div className="mb-6 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
                    <Reveal>
                        <h2 className="text-3xl font-extrabold text-secondary">{title}</h2>
                        {desc && <p className="mt-2 max-w-xl text-base leading-relaxed text-muted">{desc}</p>}
                    </Reveal>

                    <div className="flex shrink-0 items-center gap-3">
                        {items.length > 3 && (
                            <div className="hidden items-center gap-2 lg:flex">
                                <button
                                    type="button"
                                    onClick={() => scroll(false)}
                                    aria-label={ar ? "السابق" : "Previous"}
                                    className="rounded-full border-2 border-gray-200 p-2.5 text-secondary transition hover:border-primary hover:text-primary"
                                >
                                    <ChevronRight size={18} className="ltr:rotate-180" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => scroll(true)}
                                    aria-label={ar ? "التالي" : "Next"}
                                    className="rounded-full border-2 border-gray-200 p-2.5 text-secondary transition hover:border-primary hover:text-primary"
                                >
                                    <ChevronLeft size={18} className="ltr:rotate-180" />
                                </button>
                            </div>
                        )}

                        {allHref && allLabel && (
                            <Link
                                href={allHref}
                                className="rounded-brand border-2 border-secondary px-6 py-3 text-sm font-extrabold text-secondary transition hover:bg-secondary hover:text-white"
                            >
                                {allLabel}
                            </Link>
                        )}
                    </div>
                </div>

                <div
                    ref={track}
                    className="-mx-1 flex snap-x snap-mandatory gap-6 overflow-x-auto px-1 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                >
                    {items.map((c) => (
                        <div key={c.id} className="w-[290px] shrink-0 snap-start sm:w-[320px]">
                            <CompoundCard c={c} ar={ar} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
