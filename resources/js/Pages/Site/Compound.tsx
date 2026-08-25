import { Link, usePage } from "@inertiajs/react";
import {
    ArrowLeft,
    Building2,
    CalendarCheck,
    Check,
    Home,
    MapPin,
    MessageCircle,
    Phone,
    SearchX,
    Wallet,
} from "lucide-react";
import { useState } from "react";
import type { SearchFilters } from "@/Components/site/ActiveFilters";
import BrochureModal from "@/Components/site/BrochureModal";
import CompoundHero from "@/Components/site/CompoundHero";
import CompoundsCarousel from "@/Components/site/CompoundsCarousel";
import CompoundUnitSearch from "@/Components/site/CompoundUnitSearch";
import DeveloperLogo from "@/Components/site/DeveloperLogo";
import Faq from "@/Components/site/Faq";
import LeadForm from "@/Components/site/LeadForm";
import MapEmbed from "@/Components/site/MapEmbed";
import MasterPlan from "@/Components/site/MasterPlan";
import PropertyCard from "@/Components/site/PropertyCard";
import Reveal from "@/Components/site/Reveal";
import RichText from "@/Components/site/RichText";
import ShareButtons from "@/Components/site/ShareButtons";
import SiteLayout from "@/Layouts/SiteLayout";
import type { Compound, CompoundDetail, Property, SearchOptions, SharedProps } from "@/lib/types";

const copy = {
    ar: {
        back: "كل الكمبوندات",
        details: "التفاصيل",
        plan: "نظام السداد",
        about: "عن المشروع",
        features: "مميزات المشروع",
        explore: "استكشف العقارات في",
        exploreSub: "فلتر بالنوع والسعر وعدد الغرف داخل المشروع نفسه.",
        noUnits: "لا توجد وحدات مطابقة لبحثك داخل هذا المشروع — جرّب توسيع الفلاتر أو تواصل معنا.",
        from: "سعر المطوّر",
        resale: "سعر الريسيل",
        down: "المقدم",
        years: "التقسيط",
        delivery: "التسليم",
        developer: "المطوّر",
        area: "الموقع",
        available: "الوحدات المتاحة",
        unit: "وحدة",
        advisor: "تحتاج مشورة خبير؟",
        advisorNote: "اترك بياناتك ويتواصل معك مستشار المشروع خلال ساعات العمل.",
        wa: "استفسر واتساب",
        call: "اتصل بنا",
        form: "اطلب عرض الأسعار",
        formTitle: "مهتم بمشروع",
        formNote: "يصل الطلب مباشرة إلى الشركة المسؤولة عن المشروع.",
        note: "أنظمة السداد وتواريخ التسليم كما وردت من المطوّر، ويجري تأكيدها في العقد.",
        sameDeveloper: "مشروعات أخرى من",
        nearby: "كمبوندات قريبة من",
        allDeveloper: "كل مشاريع المطوّر",
        allArea: "كل مشاريع المنطقة",
    },
    en: {
        back: "All compounds",
        details: "Details",
        plan: "Payment plan",
        about: "About the project",
        features: "Project features",
        explore: "Explore properties in",
        exploreSub: "Filter by type, price and bedrooms inside the project itself.",
        noUnits: "No units match your search inside this project — try widening the filters or contact us.",
        from: "Developer price",
        resale: "Resale price",
        down: "Down payment",
        years: "Instalments",
        delivery: "Delivery",
        developer: "Developer",
        area: "Location",
        available: "Available units",
        unit: "units",
        advisor: "Need expert advice?",
        advisorNote: "Leave your details and a project advisor will reach out during working hours.",
        wa: "Ask on WhatsApp",
        call: "Call us",
        form: "Request a quote",
        formTitle: "Interested in",
        formNote: "Your request goes straight to the company behind this project.",
        note: "Payment plans and delivery dates are as stated by the developer, and confirmed in the contract.",
        sameDeveloper: "Other projects by",
        nearby: "Compounds near",
        allDeveloper: "All developer projects",
        allArea: "All area projects",
    },
};

/**
 * صفحة الكمبوند.
 *
 * الترتيب: هيرو (موزاييك + السعرين + احفظ + شريط أنكور) · استكشف الوحدات
 * بفلترة داخلية · نظام السداد · عن المشروع · المميزات · الخريطة · المخطط
 * العام · الأسئلة الشائعة · طلب عرض السعر — وجنبهم سايدبار التفاصيل
 * (المطوّر · الموقع · الوحدات) مع فورم المستشار. وتحت الصفحة مشروعات
 * نفس المطوّر وكمبوندات المنطقة.
 *
 * كل قسم شرطي على بياناته — الخريطة والمخطط والأسئلة بتختفي لو الأدمن
 * ما ملاش الحقول، فمفيش عنوان معلّق فوق فراغ.
 */
export default function CompoundPage({
    compound,
    units,
    filters = {} as SearchFilters,
    options,
    sameDeveloper = [],
    nearby = [],
}: {
    compound: CompoundDetail;
    units: Property[];
    filters?: SearchFilters;
    options: SearchOptions;
    sameDeveloper?: Compound[];
    nearby?: Compound[];
}) {
    const { locale, settings } = usePage<SharedProps>().props;
    const ar = locale === "ar";
    const t = copy[locale] ?? copy.ar;

    const [brochure, setBrochure] = useState(false);

    const wa = settings.contact?.whatsapp;
    const phone = settings.contact?.phone;
    const path = `/${locale}/compounds/${compound.slug}`;

    const cell = (label: string, value: string, gold = false) =>
        value ? (
            <div className="flex flex-col items-center gap-1.5 px-3 py-4 text-center">
                <span className="text-[11px] font-bold text-muted">{label}</span>
                <span
                    className={`text-base font-extrabold ${gold ? "text-primary" : "text-secondary"}`}
                    dir={label === t.years ? undefined : "ltr"}
                >
                    {value}
                </span>
            </div>
        ) : null;

    const planCells = [
        cell(t.from, compound.starting, true),
        cell(t.resale, compound.resale ?? ""),
        cell(t.down, compound.down),
        cell(t.years, compound.years),
        cell(t.delivery, compound.delivery),
    ].filter(Boolean);

    return (
        <SiteLayout>
            <CompoundHero compound={compound} onBrochure={() => setBrochure(true)} />

            <section className="bg-bg px-4 py-10">
                <div className="mx-auto grid max-w-7xl items-start gap-10 lg:grid-cols-[minmax(0,1fr)_21rem]">
                    {/* ---------------- العمود الرئيسي ---------------- */}
                    <div className="flex min-w-0 flex-col gap-12">
                        {/* استكشف العقارات في المشروع */}
                        <section id="units">
                            <Reveal>
                                <h2 className="text-2xl font-extrabold text-secondary">
                                    {t.explore} {compound.name}
                                </h2>
                                <p className="mt-2 text-sm leading-relaxed text-muted">{t.exploreSub}</p>
                            </Reveal>

                            <div className="mt-4">
                                <CompoundUnitSearch
                                    filters={filters}
                                    options={options}
                                    path={path}
                                    count={units.length}
                                />
                            </div>

                            {units.length > 0 ? (
                                <div className="mt-6 grid gap-6 sm:grid-cols-2">
                                    {units.map((p, i) => (
                                        <Reveal key={p.id} delay={i * 90}>
                                            <PropertyCard p={p} ar={ar} wa={wa} />
                                        </Reveal>
                                    ))}
                                </div>
                            ) : (
                                <div className="mt-6 flex flex-col items-center gap-3 rounded-2xl border border-gray-100 bg-surface p-10 text-center">
                                    <SearchX size={28} className="text-muted" />
                                    <p className="text-sm font-bold leading-relaxed text-muted">{t.noUnits}</p>
                                </div>
                            )}
                        </section>

                        {/* نظام السداد */}
                        {planCells.length > 0 && (
                            <section id="details">
                                <h2 className="mb-4 text-2xl font-extrabold text-secondary">{t.plan}</h2>
                                <div className="grid divide-y divide-gray-100 rounded-2xl border border-gray-100 bg-surface sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-5 lg:divide-x lg:divide-x-reverse">
                                    {planCells}
                                </div>
                                <p className="mt-3 text-xs font-bold leading-relaxed text-muted">{t.note}</p>
                            </section>
                        )}

                        {/* عن المشروع */}
                        {compound.desc && (
                            <section id="about">
                                <h2 className="mb-4 text-2xl font-extrabold text-secondary">
                                    {t.about} {compound.name}
                                </h2>
                                <RichText text={compound.desc} />
                            </section>
                        )}

                        {/* المميزات */}
                        {compound.features.length > 0 && (
                            <section id="features">
                                <h2 className="mb-4 text-2xl font-extrabold text-secondary">{t.features}</h2>
                                <ul className="grid gap-3 sm:grid-cols-2">
                                    {compound.features.map((f) => (
                                        <li key={f} className="flex items-start gap-2.5 text-sm font-bold text-secondary">
                                            <Check size={16} className="mt-0.5 shrink-0 text-primary" />
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}

                        {/* الموقع على الخريطة */}
                        <div id="map">
                            <MapEmbed lat={compound.lat} lng={compound.lng} label={compound.area} />
                        </div>

                        {/* المخطط العام */}
                        <div id="master-plan">
                            <MasterPlan src={compound.masterPlan} name={compound.name} />
                        </div>

                        {/* الأسئلة الشائعة */}
                        <Faq items={compound.faqs} />

                        {/* طلب عرض السعر */}
                        <section id="lead">
                            <h2 className="mb-2 text-2xl font-extrabold text-secondary">
                                {t.formTitle} {compound.name}؟
                            </h2>
                            <p className="mb-4 text-sm leading-relaxed text-muted">{t.formNote}</p>
                            <LeadForm compoundId={compound.id} source="compound" subject={compound.name} />
                        </section>

                        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-gray-100 pt-6">
                            <Link
                                href={`/${locale}/compounds`}
                                className="flex items-center gap-2 text-sm font-extrabold text-secondary transition hover:text-primary"
                            >
                                <ArrowLeft size={16} className="ltr:rotate-180" />
                                {t.back}
                            </Link>

                            <ShareButtons title={compound.name} />
                        </div>
                    </div>

                    {/* ---------------- سايدبار التفاصيل ---------------- */}
                    <aside className="flex flex-col gap-5 lg:sticky lg:top-24">
                        <div className="rounded-2xl border border-gray-100 bg-surface p-6">
                            <h2 className="mb-4 text-lg font-extrabold text-secondary">{t.details}</h2>

                            <dl className="flex flex-col gap-4">
                                {compound.developer && (
                                    <div className="flex items-center gap-3">
                                        <DeveloperLogo name={compound.developer} logo={compound.developerLogo} size={44} />
                                        <span className="flex min-w-0 flex-col gap-0.5">
                                            <dt className="text-[11px] font-bold text-muted">{t.developer}</dt>
                                            <dd className="truncate text-sm font-extrabold text-secondary">
                                                {compound.developerSlug ? (
                                                    <Link
                                                        href={`/${locale}/developers/${compound.developerSlug}`}
                                                        className="transition hover:text-primary"
                                                    >
                                                        {compound.developer}
                                                    </Link>
                                                ) : (
                                                    compound.developer
                                                )}
                                            </dd>
                                        </span>
                                    </div>
                                )}

                                {compound.area && (
                                    <div className="flex items-center gap-3">
                                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                            <MapPin size={18} />
                                        </span>
                                        <span className="flex min-w-0 flex-col gap-0.5">
                                            <dt className="text-[11px] font-bold text-muted">{t.area}</dt>
                                            <dd className="truncate text-sm font-extrabold text-secondary">
                                                {compound.areaSlug ? (
                                                    <Link
                                                        href={`/${locale}/areas/${compound.areaSlug}`}
                                                        className="transition hover:text-primary"
                                                    >
                                                        {compound.area}
                                                    </Link>
                                                ) : (
                                                    compound.area
                                                )}
                                            </dd>
                                        </span>
                                    </div>
                                )}

                                <div className="flex items-center gap-3">
                                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                        <Home size={18} />
                                    </span>
                                    <span className="flex flex-col gap-0.5">
                                        <dt className="text-[11px] font-bold text-muted">{t.available}</dt>
                                        <dd className="text-sm font-extrabold text-secondary">
                                            {compound.units} {t.unit}
                                        </dd>
                                    </span>
                                </div>

                                {compound.delivery && (
                                    <div className="flex items-center gap-3">
                                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                            <CalendarCheck size={18} />
                                        </span>
                                        <span className="flex flex-col gap-0.5">
                                            <dt className="text-[11px] font-bold text-muted">{t.delivery}</dt>
                                            <dd className="text-sm font-extrabold text-secondary" dir="ltr">
                                                {compound.delivery}
                                            </dd>
                                        </span>
                                    </div>
                                )}

                                {compound.starting && (
                                    <div className="flex items-center gap-3">
                                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                            <Wallet size={18} />
                                        </span>
                                        <span className="flex flex-col gap-0.5">
                                            <dt className="text-[11px] font-bold text-muted">{t.from}</dt>
                                            <dd className="text-sm font-extrabold text-primary" dir="ltr">
                                                {compound.starting}
                                            </dd>
                                        </span>
                                    </div>
                                )}
                            </dl>
                        </div>

                        <div className="rounded-2xl border border-primary/30 bg-primary/10 p-6">
                            <h2 className="flex items-center gap-2 text-lg font-extrabold text-secondary">
                                <Building2 size={18} className="text-primary" />
                                {t.advisor}
                            </h2>
                            <p className="mt-2 text-[13px] leading-relaxed text-muted">{t.advisorNote}</p>

                            <div className="mt-4 flex flex-col gap-2.5">
                                {wa && (
                                    <a
                                        href={`https://wa.me/${wa}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center justify-center gap-2 rounded-brand bg-primary px-5 py-3 text-sm font-extrabold text-primary-fg transition hover:bg-primary-hover"
                                    >
                                        <MessageCircle size={16} />
                                        {t.wa}
                                    </a>
                                )}

                                {phone && (
                                    <a
                                        href={`tel:${phone}`}
                                        className="flex items-center justify-center gap-2 rounded-brand border-2 border-secondary px-5 py-3 text-sm font-extrabold text-secondary transition hover:bg-secondary hover:text-white"
                                    >
                                        <Phone size={16} />
                                        {t.call}
                                    </a>
                                )}

                                <a
                                    href="#lead"
                                    className="rounded-brand border-2 border-primary px-5 py-3 text-center text-sm font-extrabold text-secondary transition hover:bg-primary hover:text-primary-fg"
                                >
                                    {t.form}
                                </a>
                            </div>
                        </div>
                    </aside>
                </div>
            </section>

            {/* مشروعات أخرى من نفس المطوّر */}
            <CompoundsCarousel
                items={sameDeveloper}
                title={`${t.sameDeveloper} ${compound.developer}`}
                allHref={compound.developerSlug ? `/${locale}/developers/${compound.developerSlug}` : undefined}
                allLabel={compound.developerSlug ? t.allDeveloper : undefined}
                tone="surface"
            />

            {/* كمبوندات قريبة */}
            <CompoundsCarousel
                items={nearby}
                title={`${t.nearby} ${compound.name}`}
                allHref={compound.areaSlug ? `/${locale}/areas/${compound.areaSlug}` : undefined}
                allLabel={compound.areaSlug ? t.allArea : undefined}
            />

            {brochure && (
                <BrochureModal
                    compoundId={compound.id}
                    name={compound.name}
                    onClose={() => setBrochure(false)}
                />
            )}
        </SiteLayout>
    );
}
