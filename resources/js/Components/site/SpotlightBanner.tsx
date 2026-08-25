import { Link, usePage } from "@inertiajs/react";
import { CalendarClock, FileText, Map, MapPin } from "lucide-react";
import { useState } from "react";
import BrochureModal from "@/Components/site/BrochureModal";
import Reveal from "@/Components/site/Reveal";
import type { SharedProps, SpotlightAd } from "@/lib/types";

const copy = {
    ar: {
        badge: "مشروع تحت الضوء",
        down: "مقدم",
        location: "الموقع",
        plan: "التقسيط",
        explore: "استكشف المشروع",
        masterPlan: "الماستر بلان",
        brochure: "عرض البروشور",
    },
    en: {
        badge: "Project spotlight",
        down: "Down payment",
        location: "Location",
        plan: "Instalments",
        explore: "Explore project",
        masterPlan: "Master plan",
        brochure: "View brochure",
    },
};

/**
 * بانر «مشروع تحت الضوء» — بيتظبط من /admin/featured-ads بموضع `spotlight`.
 * الضغط على «استكشف المشروع» بيعدّي على راوت التتبّع عشان الضغطة تتحسب،
 * وباقي الأزرار بتفتح الماستر بلان والبروشور في نفس الصفحة.
 */
export default function SpotlightBanner({ ad }: { ad?: SpotlightAd | null }) {
    const { locale } = usePage<SharedProps>().props;
    const t = copy[locale] ?? copy.ar;

    const [plan, setPlan] = useState(false);
    const [brochure, setBrochure] = useState(false);

    if (!ad) {
        return null;
    }

    const facts = [
        ad.area && [MapPin, t.location, ad.area],
        ad.years && [CalendarClock, t.plan, ad.years],
    ].filter(Boolean) as [typeof MapPin, string, string][];

    return (
        <section className="bg-bg px-4 py-8">
            <Reveal>
                <div className="mx-auto grid max-w-7xl overflow-hidden rounded-3xl bg-secondary lg:grid-cols-2">
                    <div className="relative min-h-[260px]">
                        <img src={ad.image} alt={ad.name} loading="lazy" className="h-full w-full object-cover" />
                    </div>

                    <div className="flex flex-col justify-center gap-4 p-8 text-white lg:p-10">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-full border border-primary/60 px-3 py-1.5 text-[11px] font-extrabold text-primary">
                                {t.badge}
                            </span>
                            {ad.down && (
                                <span className="rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-extrabold text-white">
                                    {t.down} {ad.down}
                                </span>
                            )}
                        </div>

                        <h2 className="text-3xl font-black leading-snug md:text-4xl">
                            {ad.name}
                            {ad.developer && (
                                <span className="ms-2 align-middle text-base font-bold text-white/70">
                                    {locale === "en" ? `by ${ad.developer}` : `من ${ad.developer}`}
                                </span>
                            )}
                        </h2>

                        {ad.desc && <p className="line-clamp-3 text-sm leading-[1.9] text-white/75">{ad.desc}</p>}

                        {facts.length > 0 && (
                            <div className="flex flex-wrap gap-6 border-t border-white/15 pt-4">
                                {facts.map(([Icon, label, value]) => (
                                    <span key={label} className="flex flex-col gap-1">
                                        <span className="text-[11px] font-bold text-white/60">{label}</span>
                                        <span className="flex items-center gap-1.5 text-sm font-extrabold">
                                            <Icon size={14} className="text-primary" />
                                            {value}
                                        </span>
                                    </span>
                                ))}
                            </div>
                        )}

                        <div className="mt-2 flex flex-wrap gap-3">
                            <a
                                href={ad.url}
                                className="rounded-brand bg-primary px-6 py-3 text-sm font-extrabold text-primary-fg transition hover:bg-primary-hover"
                            >
                                {t.explore}
                            </a>

                            {ad.masterPlan && (
                                <button
                                    type="button"
                                    onClick={() => setPlan(true)}
                                    className="flex items-center gap-2 rounded-brand border border-white/30 px-6 py-3 text-sm font-extrabold text-white transition hover:bg-white/10"
                                >
                                    <Map size={15} />
                                    {t.masterPlan}
                                </button>
                            )}

                            {ad.brochure && (
                                <button
                                    type="button"
                                    onClick={() => setBrochure(true)}
                                    className="flex items-center gap-2 rounded-brand border border-white/30 px-6 py-3 text-sm font-extrabold text-white transition hover:bg-white/10"
                                >
                                    <FileText size={15} />
                                    {t.brochure}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </Reveal>

            {plan && ad.masterPlan && (
                <button
                    type="button"
                    onClick={() => setPlan(false)}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
                    aria-label={t.masterPlan}
                >
                    <img src={ad.masterPlan} alt={t.masterPlan} className="max-h-full max-w-full rounded-2xl object-contain" />
                </button>
            )}

            {brochure && (
                <BrochureModal compoundId={ad.id} name={ad.name} onClose={() => setBrochure(false)} />
            )}
        </section>
    );
}
