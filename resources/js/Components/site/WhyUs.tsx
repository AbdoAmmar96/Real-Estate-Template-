import { usePage } from "@inertiajs/react";
import { BadgeCheck, CalendarSync, ShieldCheck, Sparkles } from "lucide-react";
import Reveal from "@/Components/site/Reveal";
import type { SharedProps } from "@/lib/types";

const copy = {
    ar: {
        title: "لماذا تختار موقعنا؟",
        desc: "أربعة أسباب عملية تخلي البحث معنا أسرع وأوضح.",
        points: [
            [Sparkles, "إعلانات مختارة", "كل وحدة تُراجَع أوراقها ويُعايَن موقعها قبل النشر — لا إعلانات مكرّرة ولا صور مضلّلة."],
            [ShieldCheck, "مطوّرون موثوقون", "نتعامل مع مطوّرين لهم مشاريع قائمة وسجل تسليم معروف، وبياناتهم معروضة على المنصة."],
            [BadgeCheck, "مستشارون خبراء", "مستشار واحد مسؤول عن ملفك من أول مكالمة حتى العقد المسجّل — لا تكرار للشرح."],
            [CalendarSync, "تحديث يومي", "الأسعار وأنظمة السداد وحالة الوحدة تتحدّث أولًا بأول، والوحدة المباعة تختفي فورًا."],
        ],
    },
    en: {
        title: "Why choose us?",
        desc: "Four practical reasons that make searching with us faster and clearer.",
        points: [
            [Sparkles, "Curated listings", "Every unit's paperwork is reviewed and its location inspected before publishing — no duplicates, no misleading photos."],
            [ShieldCheck, "Trusted developers", "We work with developers who have live projects and a known delivery record, all shown on the platform."],
            [BadgeCheck, "Expert advisors", "One advisor owns your file from the first call to the registered contract — no repeating yourself."],
            [CalendarSync, "Updated daily", "Prices, payment plans and unit status update continuously, and a sold unit disappears immediately."],
        ],
    },
};

/** «لماذا تختار موقعنا؟» — أربع مميزات بأيقونات */
export default function WhyUs() {
    const { locale } = usePage<SharedProps>().props;
    const t = copy[locale] ?? copy.ar;

    return (
        <section className="bg-surface px-4 py-14">
            <div className="mx-auto max-w-7xl">
                <Reveal>
                    <h2 className="text-3xl font-extrabold text-secondary">{t.title}</h2>
                    <p className="mt-2 max-w-xl text-base leading-relaxed text-muted">{t.desc}</p>
                </Reveal>

                <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {(t.points as [typeof Sparkles, string, string][]).map(([Icon, title, body], i) => (
                        <Reveal key={title} delay={i * 90}>
                            <div className="flex h-full flex-col gap-3 rounded-2xl border border-gray-100 bg-bg p-6">
                                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                                    <Icon size={20} />
                                </span>
                                <h3 className="text-[17px] font-extrabold text-secondary">{title}</h3>
                                <p className="text-sm leading-[1.9] text-muted">{body}</p>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
