import { Link, usePage } from "@inertiajs/react";
import { ArrowLeft, CalendarCheck, MapPin, MessageCircle, SearchX } from "lucide-react";
import ActiveFilters, { type SearchFilters } from "@/Components/site/ActiveFilters";
import AreaCard from "@/Components/site/AreaCard";
import CompoundFilters from "@/Components/site/CompoundFilters";
import PageHero from "@/Components/site/PageHero";
import Reveal from "@/Components/site/Reveal";
import SiteLayout from "@/Layouts/SiteLayout";
import type { Area, Compound, SearchOptions, SharedProps } from "@/lib/types";

const copy = {
    ar: {
        crumb: "الكمبوندات",
        title: "الكمبوندات",
        desc: "مشاريع سكنية وساحلية بأنظمة سداد معلنة من المطوّر، مع تواريخ تسليم موثّقة في العقد.",
        byArea: "تصفّح حسب المنطقة",
        byAreaSub: "اختر منطقة لتشوف مشاريعها المتاحة فقط.",
        available: "المشروعات المتاحة",
        count: (n: number) => `${n} مشروع مطابق`,
        empty: "لا توجد مشاريع مطابقة لبحثك — جرّب توسيع الفلاتر.",
        helpTitle: "هل تحتاج مساعدة في الاختيار؟",
        helpSub: "أخبرنا بميزانيتك والمنطقة وعدد الغرف، ونرسل لك مقارنة مكتوبة بين أفضل ثلاثة مشاريع تناسبك.",
        helpCta: "تواصل معنا",
        helpWa: "تحدّث على واتساب",
        from: "يبدأ من",
        down: "مقدم",
        plan: "تقسيط",
        delivery: "التسليم",
        wa: "استفسر واتساب",
        newTag: "إطلاق جديد",
        details: "تفاصيل المشروع",
    },
    en: {
        crumb: "Compounds",
        title: "Compounds",
        desc: "Residential and coastal projects with payment plans stated by the developer, and delivery dates documented in the contract.",
        byArea: "Browse by area",
        byAreaSub: "Pick an area to see only its available projects.",
        available: "Available projects",
        count: (n: number) => `${n} matching projects`,
        empty: "No projects match your search — try widening the filters.",
        helpTitle: "Need help choosing?",
        helpSub: "Tell us your budget, area and bedroom count, and we'll send a written comparison of the three best-fitting projects.",
        helpCta: "Contact us",
        helpWa: "Chat on WhatsApp",
        from: "From",
        down: "Down",
        plan: "Plan",
        delivery: "Delivery",
        wa: "Ask on WhatsApp",
        newTag: "New launch",
        details: "Project details",
    },
};

export default function Compounds({
    compounds,
    filters,
    options,
    areas = [],
}: {
    compounds: Compound[];
    filters: SearchFilters;
    options: SearchOptions;
    areas?: Area[];
}) {
    const { locale, settings } = usePage<SharedProps>().props;
    const ar = locale === "ar";
    const t = copy[locale] ?? copy.ar;
    const wa = settings.contact?.whatsapp;

    const cell = (label: string, value: string, gold = false) => (
        <div className="flex flex-col items-center gap-1 px-2">
            <span className="text-[11px] font-bold text-muted">{label}</span>
            <span className={`text-sm font-extrabold ${gold ? "text-primary" : "text-secondary"}`} dir="ltr">
                {value}
            </span>
        </div>
    );

    return (
        <SiteLayout>
            <PageHero bg="/images/demo/bg-comps.jpg" crumb={t.crumb} title={t.title} desc={t.desc} />

            <section className="bg-bg px-4 py-12">
                <div className="mx-auto max-w-7xl">
                    <CompoundFilters filters={filters} options={options} path={`/${locale}/compounds`} />
                </div>

                {/* تصفّح حسب المنطقة — مدخل أسرع من الفلتر لأغلب الزوار */}
                {areas.length > 0 && (
                    <div className="mx-auto mt-10 max-w-7xl">
                        <Reveal>
                            <h2 className="text-2xl font-extrabold text-secondary">{t.byArea}</h2>
                            <p className="mt-2 text-sm leading-relaxed text-muted">{t.byAreaSub}</p>
                        </Reveal>

                        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {areas.map((a, i) => (
                                <Reveal key={a.id} delay={i * 70}>
                                    <Link
                                        href={`/${locale}/compounds?location=${encodeURIComponent(a.name)}`}
                                        className="group relative block h-40 overflow-hidden rounded-2xl border border-gray-100"
                                    >
                                        <img
                                            src={a.image}
                                            alt={a.name}
                                            loading="lazy"
                                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                        />
                                        <span className="pointer-events-none absolute inset-x-3 bottom-3 flex items-center justify-between gap-2 rounded-xl bg-bg/90 px-3.5 py-2.5 backdrop-blur">
                                            <span className="text-sm font-extrabold text-secondary">{a.name}</span>
                                            <span className="text-xs font-extrabold text-primary">{a.compounds ?? 0}</span>
                                        </span>
                                    </Link>
                                </Reveal>
                            ))}
                        </div>
                    </div>
                )}

                <div className="mx-auto mt-10 max-w-7xl">
                    <div className="mb-4 flex flex-wrap items-baseline justify-between gap-3">
                        <h2 className="text-2xl font-extrabold text-secondary">{t.available}</h2>
                        <span className="text-sm font-bold text-muted">{t.count(compounds.length)}</span>
                    </div>
                    <ActiveFilters filters={filters} path="/compounds" />
                </div>

                {compounds.length === 0 && (
                    <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 rounded-2xl border border-gray-100 bg-surface p-12 text-center">
                        <SearchX size={30} className="text-muted" />
                        <p className="text-sm font-bold text-muted">{t.empty}</p>
                    </div>
                )}

                <div className="mx-auto grid max-w-7xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {compounds.map((c, i) => (
                        <Reveal key={c.id} delay={i * 90}>
                            <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-bg transition duration-200 hover:-translate-y-1 hover:border-primary/50 hover:shadow-[0_12px_30px_rgba(11,18,32,0.07)]">
                                <Link
                                    href={c.slug ? `/${locale}/compounds/${c.slug}` : `/${locale}/compounds`}
                                    className="flex flex-1 flex-col"
                                >
                                <div className="relative h-48 overflow-hidden bg-surface">
                                    <img
                                        src={c.image}
                                        alt={c.name}
                                        loading="lazy"
                                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                    />
                                    {c.new && (
                                        <span className="absolute start-3 top-3 rounded-full bg-primary px-3 py-2 text-[11px] font-extrabold text-primary-fg">
                                            {t.newTag}
                                        </span>
                                    )}
                                </div>

                                <div className="flex flex-1 flex-col gap-2 p-4">
                                    <h3 className="text-lg font-extrabold leading-relaxed text-secondary transition group-hover:text-primary">
                                        {c.name}
                                    </h3>

                                    <div className="flex items-center gap-2 text-xs font-bold text-muted">
                                        <MapPin size={13} className="shrink-0 text-primary" />
                                        <span>
                                            {c.area} · {c.developer}
                                        </span>
                                    </div>

                                    <p className="text-sm leading-[1.8] text-muted">{c.desc}</p>

                                    <div className="mt-2 grid grid-cols-2 gap-y-4 rounded-xl bg-surface py-4">
                                        {cell(t.from, c.starting, true)}
                                        <div className="border-s border-gray-200">{cell(t.down, c.down)}</div>
                                        {cell(t.plan, c.years)}
                                        <div className="border-s border-gray-200">{cell(t.delivery, c.delivery)}</div>
                                    </div>

                                    <div className="mt-auto flex items-center gap-2 pt-1 text-[11px] font-bold text-muted">
                                        <CalendarCheck size={13} className="text-primary" />
                                        {ar ? "تاريخ التسليم موثّق في العقد" : "Delivery date documented in the contract"}
                                    </div>

                                    <span className="mt-2 flex items-center justify-center gap-2 rounded-brand bg-primary py-3 text-[13px] font-extrabold text-primary-fg transition group-hover:opacity-90">
                                        {t.details}
                                        <ArrowLeft size={15} className="ltr:rotate-180" />
                                    </span>
                                </div>
                                </Link>

                                {wa && (
                                    <a
                                        href={`https://wa.me/${wa}?text=${encodeURIComponent((ar ? "مهتم بمشروع: " : "Interested in project: ") + c.name)}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="mx-4 mb-4 block rounded-brand border-2 border-primary py-3 text-center text-[13px] font-extrabold text-secondary transition hover:bg-primary hover:text-primary-fg"
                                    >
                                        {t.wa}
                                    </a>
                                )}
                            </article>
                        </Reveal>
                    ))}
                </div>

                {/* هل تحتاج مساعدة في الاختيار؟ */}
                <div className="mx-auto mt-12 max-w-7xl">
                    <Reveal>
                        <div className="flex flex-wrap items-center justify-between gap-8 rounded-3xl border border-primary/30 bg-primary/10 p-8">
                            <div>
                                <h2 className="text-2xl font-extrabold text-secondary">{t.helpTitle}</h2>
                                <p className="mt-2 max-w-xl text-sm leading-[1.9] text-muted">{t.helpSub}</p>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                <Link
                                    href={`/${locale}/contact`}
                                    className="rounded-brand bg-primary px-7 py-3.5 text-sm font-extrabold text-primary-fg transition hover:bg-primary-hover"
                                >
                                    {t.helpCta}
                                </Link>

                                {wa && (
                                    <a
                                        href={`https://wa.me/${wa}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center gap-2 rounded-brand border-2 border-secondary px-7 py-3 text-sm font-extrabold text-secondary transition hover:bg-secondary hover:text-white"
                                    >
                                        <MessageCircle size={16} />
                                        {t.helpWa}
                                    </a>
                                )}
                            </div>
                        </div>
                    </Reveal>
                </div>
            </section>
        </SiteLayout>
    );
}
