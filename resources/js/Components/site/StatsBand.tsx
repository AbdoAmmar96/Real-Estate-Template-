import { usePage } from "@inertiajs/react";
import CountUp from "@/Components/site/CountUp";
import Reveal from "@/Components/site/Reveal";
import type { SharedProps } from "@/lib/types";

const copy = {
    ar: { title: "سجل إنجازاتنا", desc: "أرقام محسوبة من قاعدة البيانات مباشرة — بتتحدّث لوحدها مع كل وحدة أو مشروع جديد." },
    en: { title: "Our track record", desc: "Counted straight from the database — they update themselves with every new unit or project." },
};

/**
 * شريط الأرقام «سجل إنجازاتنا».
 *
 * كل رقم جاي من عدّ حقيقي (Catalog::stats) — مفيش رقم مكتوب بالإيد،
 * فالقسم مبيوعدش الزائر بحاجة مش موجودة.
 */
type Stat = { value: string; label: string; suffix?: string };

export default function StatsBand({
    items,
    extra = [],
}: {
    items: Stat[];
    /** أرقام من الإعدادات (عملاء · سنوات خبرة) — بتتشال لو مش متكتوبة */
    extra?: Stat[];
}) {
    const { locale } = usePage<SharedProps>().props;
    const t = copy[locale] ?? copy.ar;

    const all = [...items, ...extra].filter((s) => s.value && s.value !== "0");

    if (all.length === 0) {
        return null;
    }

    return (
        <section className="bg-secondary px-4 py-14">
            <div className="mx-auto max-w-7xl text-center">
                <Reveal>
                    <h2 className="text-3xl font-extrabold text-white">{t.title}</h2>
                    <p className="mx-auto mt-2 max-w-2xl text-base leading-relaxed text-white/70">{t.desc}</p>
                </Reveal>

                <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {all.map((s, i) => (
                        <Reveal key={s.label} delay={i * 90}>
                            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                                <span className="block text-4xl font-black text-primary" dir="ltr">
                                    <CountUp value={s.value} />
                                    {s.suffix ?? ""}
                                </span>
                                <span className="mt-2 block text-sm font-bold text-white/75">{s.label}</span>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
