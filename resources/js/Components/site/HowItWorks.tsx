import { Link, usePage } from "@inertiajs/react";
import { ArrowLeft, KeyRound, Search, Tag } from "lucide-react";
import Reveal from "@/Components/site/Reveal";
import type { SharedProps } from "@/lib/types";

const copy = {
    ar: {
        title: "كيف يعمل الموقع؟",
        desc: "ثلاثة مسارات واضحة — اختر اللي يناسبك وابدأ منه مباشرة.",
        cards: [
            {
                icon: Search,
                title: "تبحث عن شراء؟",
                body: "تصفّح الوحدات المعتمدة بالسعر ونظام السداد وموعد التسليم كاملة قبل أي معاينة، وفلتر بالمنطقة والميزانية.",
                cta: "ابدأ البحث",
                href: "/properties?purpose=sale",
            },
            {
                icon: Tag,
                title: "تريد بيع أو عرض عقارك؟",
                body: "أضف وحدتك في دقائق، يراجعها فريقنا ثم تُنشر أمام مشترين جادين — بدون رسوم مقدّمة.",
                cta: "أضف عقارك",
                href: "/add-property",
            },
            {
                icon: KeyRound,
                title: "تبحث عن إيجار؟",
                body: "وحدات مفروشة وغير مفروشة بأسعار شهرية واضحة، مع بيانات التشطيب والدور والمساحة.",
                cta: "تصفّح الإيجارات",
                href: "/properties?purpose=rent",
            },
        ],
    },
    en: {
        title: "How does it work?",
        desc: "Three clear paths — pick the one that fits and start there.",
        cards: [
            {
                icon: Search,
                title: "Looking to buy?",
                body: "Browse verified units with full price, payment plan and delivery date before any viewing, and filter by area and budget.",
                cta: "Start searching",
                href: "/properties?purpose=sale",
            },
            {
                icon: Tag,
                title: "Want to sell or list?",
                body: "Add your unit in minutes, our team reviews it, then it goes live in front of serious buyers — no upfront fees.",
                cta: "List your property",
                href: "/add-property",
            },
            {
                icon: KeyRound,
                title: "Looking to rent?",
                body: "Furnished and unfurnished units with clear monthly prices, plus finishing, floor and size details.",
                cta: "Browse rentals",
                href: "/properties?purpose=rent",
            },
        ],
    },
};

/** ثلاثة كروت جمهور: شراء · بيع · إيجار — كل كارت بيبدأ رحلة مختلفة */
export default function HowItWorks() {
    const { locale } = usePage<SharedProps>().props;
    const t = copy[locale] ?? copy.ar;

    return (
        <section className="bg-bg px-4 py-14">
            <div className="mx-auto max-w-7xl">
                <Reveal>
                    <h2 className="text-3xl font-extrabold text-secondary">{t.title}</h2>
                    <p className="mt-2 max-w-xl text-base leading-relaxed text-muted">{t.desc}</p>
                </Reveal>

                <div className="mt-6 grid gap-6 lg:grid-cols-3">
                    {t.cards.map((c, i) => {
                        const Icon = c.icon;

                        return (
                            <Reveal key={c.title} delay={i * 110}>
                                <Link
                                    href={`/${locale}${c.href}`}
                                    className="group flex h-full flex-col gap-3 rounded-3xl border border-gray-100 bg-surface p-7 transition duration-200 hover:-translate-y-1 hover:border-primary/50 hover:bg-bg hover:shadow-[0_12px_30px_rgba(11,18,32,0.07)]"
                                >
                                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-primary-fg">
                                        <Icon size={22} />
                                    </span>

                                    <h3 className="text-xl font-extrabold text-secondary transition group-hover:text-primary">
                                        {c.title}
                                    </h3>
                                    <p className="text-sm leading-[1.9] text-muted">{c.body}</p>

                                    <span className="mt-auto flex items-center gap-2 pt-2 text-[13px] font-extrabold text-primary">
                                        {c.cta}
                                        <ArrowLeft size={15} className="transition group-hover:-translate-x-1 ltr:rotate-180 ltr:group-hover:translate-x-1" />
                                    </span>
                                </Link>
                            </Reveal>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
