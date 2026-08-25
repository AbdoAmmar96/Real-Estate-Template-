import { Link, usePage } from "@inertiajs/react";
import AdStrip, { type Ad } from "@/Components/site/AdStrip";
import AreaCard from "@/Components/site/AreaCard";
import CompoundCard from "@/Components/site/CompoundCard";
import CompoundsCarousel from "@/Components/site/CompoundsCarousel";
import DevelopersStrip from "@/Components/site/DevelopersStrip";
import HeroSearch from "@/Components/site/HeroSearch";
import HomeContact from "@/Components/site/HomeContact";
import HowItWorks from "@/Components/site/HowItWorks";
import PromoBanner from "@/Components/site/PromoBanner";
import PropertyCard from "@/Components/site/PropertyCard";
import RecentlyViewed from "@/Components/site/RecentlyViewed";
import Reveal from "@/Components/site/Reveal";
import Reviews, { type ReviewCard } from "@/Components/site/Reviews";
import SpotlightBanner from "@/Components/site/SpotlightBanner";
import StatsBand from "@/Components/site/StatsBand";
import TypeCards from "@/Components/site/TypeCards";
import WhyUs from "@/Components/site/WhyUs";
import SiteLayout from "@/Layouts/SiteLayout";
import type {
    Area,
    Compound,
    DeveloperCard,
    Property,
    SearchOptions,
    SharedProps,
    SpotlightAd,
    TypeCard,
} from "@/lib/types";

/**
 * الرئيسية — الأقسام بترتيبها:
 * هيرو · تصفّح حسب النوع · أحدث المشروعات · مشروع تحت الضوء · أفضل
 * الكمبوندات · أشهر المطوّرين · المناطق الأكثر طلبًا · إيجار حسب النوع ·
 * أحدث العقارات · بانر ترويجي · سجل إنجازاتنا · كيف يعمل الموقع ·
 * شوهدت مؤخرًا · لماذا تختارنا · آراء العملاء · تواصل معنا.
 *
 * كل قسم بيختفي لوحده لو مالوش بيانات — مفيش عنوان بيفضل معلّق فوق فراغ.
 * الألوان كلها من توكنز الثيم (قاعدة البيانات) — مفيش قيمة لونية ثابتة هنا.
 */

const copy = {
    ar: {
        saleTypes: "تصفّح حسب النوع",
        saleTypesSub: "اختر نوع الوحدة وشوف كل المعروض منها بالسعر ونظام السداد.",
        newProjects: "أحدث المشروعات",
        newProjectsSub: "إطلاقات جديدة بأنظمة سداد من المطوّر مباشرة.",
        compsTitle: "أفضل الكمبوندات",
        compsSub: "المقدم والتقسيط وسعر البداية معروضة قبل أن تتواصل مع أحد.",
        compsAll: "كل الكمبوندات",
        areasTitle: "المناطق الأكثر طلبًا",
        areasSub: "اضغط على أي منطقة لتصفّح مشاريعها ووحداتها المتاحة.",
        areasAll: "كل المناطق",
        rentTypes: "عقارات للإيجار حسب نوع الوحدة",
        rentTypesSub: "وحدات مفروشة وغير مفروشة بأسعار شهرية واضحة.",
        propsTitle: "أحدث العقارات",
        propsSub: "وحدات تمت مراجعة أوراقها ومعاينتها من فريقنا خلال آخر أسبوعين.",
        propsAll: "كل العقارات",
        reviewsTitle: "عملاء اشتروا معنا",
        reviewsDesc: "آراء مكتوبة من حسابات عملاء فعليين — نراجعها قبل نشرها، ولا نكتب أيًّا منها بالنيابة عنهم.",
        clients: "عميل خدمناهم",
        years: "سنة في السوق",
    },
    en: {
        saleTypes: "Browse by type",
        saleTypesSub: "Pick a unit type and see everything listed with price and payment plan.",
        newProjects: "Latest projects",
        newProjectsSub: "New launches with payment plans straight from the developer.",
        compsTitle: "Top compounds",
        compsSub: "Down payment, instalments and starting price shown before you talk to anyone.",
        compsAll: "All compounds",
        areasTitle: "Most in-demand areas",
        areasSub: "Tap any area to browse its projects and available units.",
        areasAll: "All areas",
        rentTypes: "Rentals by unit type",
        rentTypesSub: "Furnished and unfurnished units with clear monthly prices.",
        propsTitle: "Latest properties",
        propsSub: "Units whose papers were reviewed and inspected by our team in the last two weeks.",
        propsAll: "All properties",
        reviewsTitle: "Clients who bought with us",
        reviewsDesc: "Written from real client accounts — we review each one before it appears, and we never write one on their behalf.",
        clients: "clients served",
        years: "years in market",
    },
};

export default function Home({
    latestProperties,
    latestCompounds,
    newCompounds = [],
    areas,
    developers = [],
    saleTypes = [],
    rentTypes = [],
    searchOptions,
    ads = [],
    spotlight = null,
    recentlyViewed = [],
    reviews = [],
}: {
    latestProperties: Property[];
    latestCompounds: Compound[];
    newCompounds?: Compound[];
    areas: Area[];
    developers?: DeveloperCard[];
    saleTypes?: TypeCard[];
    rentTypes?: TypeCard[];
    searchOptions: SearchOptions;
    ads?: Ad[];
    spotlight?: SpotlightAd | null;
    recentlyViewed?: Property[];
    reviews?: ReviewCard[];
}) {
    const { locale, settings } = usePage<SharedProps>().props;
    const ar = locale === "ar";
    const t = copy[locale] ?? copy.ar;
    const wa = settings.contact?.whatsapp;

    // أرقام «سجل إنجازاتنا» الإضافية من الإعدادات — بتتشال لو مش متكتوبة،
    // فالقسم مبيعرضش صفر ولا رقم متلفّق
    const founded = Number(settings.general?.founded_year);
    const years = founded > 1900 ? String(new Date().getFullYear() - founded) : "";
    const clients = String(settings.general?.clients_served ?? "");

    const extraStats = [
        clients && { value: clients, label: t.clients },
        years && { value: years, label: t.years },
    ].filter(Boolean) as { value: string; label: string }[];

    const sectionTitle = (title: string, sub: string, href: string, allLabel: string) => (
        <div className="mb-6 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <Reveal>
                <h2 className="text-3xl font-extrabold text-secondary">{title}</h2>
                <p className="mt-2 max-w-xl text-base leading-relaxed text-muted">{sub}</p>
            </Reveal>
            <Link
                href={href}
                className="shrink-0 rounded-brand border-2 border-secondary px-6 py-3 text-sm font-extrabold text-secondary transition hover:bg-secondary hover:text-white"
            >
                {allLabel}
            </Link>
        </div>
    );

    return (
        <SiteLayout>
            {/* 1 — هيرو + بحث */}
            <HeroSearch options={searchOptions} variant={settings.theme?.hero_variant ?? "video"} />

            <AdStrip ads={ads} />

            {/* 2 — تصفّح حسب النوع */}
            <TypeCards items={saleTypes} title={t.saleTypes} desc={t.saleTypesSub} />

            {/* 3 — أحدث المشروعات */}
            <CompoundsCarousel
                items={newCompounds}
                title={t.newProjects}
                desc={t.newProjectsSub}
                allHref={`/${locale}/compounds?new=1`}
                allLabel={t.compsAll}
                tone="surface"
            />

            {/* 4 — بانر مشروع تحت الضوء */}
            <SpotlightBanner ad={spotlight} />

            {/* 5 — أفضل الكمبوندات */}
            {latestCompounds.length > 0 && (
                <section className="bg-bg px-4 py-14">
                    <div className="mx-auto max-w-7xl">
                        {sectionTitle(t.compsTitle, t.compsSub, `/${locale}/compounds`, t.compsAll)}
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {latestCompounds.map((c, i) => (
                                <Reveal key={c.id} delay={i * 110}>
                                    <CompoundCard c={c} ar={ar} wa={wa} />
                                </Reveal>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* 6 — أشهر المطوّرين */}
            <DevelopersStrip items={developers} />

            {/* 7 — المناطق الأكثر طلبًا */}
            {areas.length > 0 && (
                <section className="bg-bg px-4 py-14">
                    <div className="mx-auto max-w-7xl">
                        {sectionTitle(t.areasTitle, t.areasSub, `/${locale}/areas`, t.areasAll)}
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {areas.map((a, i) => (
                                <Reveal key={a.id} delay={i * 80}>
                                    <AreaCard a={a} height="h-56" />
                                </Reveal>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* 8 — عقارات للإيجار حسب نوع الوحدة */}
            <TypeCards items={rentTypes} title={t.rentTypes} desc={t.rentTypesSub} />

            {/* 9 — أحدث العقارات */}
            {latestProperties.length > 0 && (
                <section className="bg-surface px-4 py-14">
                    <div className="mx-auto max-w-7xl">
                        {sectionTitle(t.propsTitle, t.propsSub, `/${locale}/properties`, t.propsAll)}
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {latestProperties.map((p, i) => (
                                <Reveal key={p.id} delay={i * 110}>
                                    <PropertyCard p={p} ar={ar} wa={wa} />
                                </Reveal>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* 10 — بانر ترويجي */}
            <PromoBanner />

            {/* 11 — سجل إنجازاتنا */}
            <StatsBand items={searchOptions.stats} extra={extraStats} />

            {/* 12 — كيف يعمل الموقع؟ */}
            <HowItWorks />

            {/* 13 — شوهدت مؤخرًا */}
            <RecentlyViewed properties={recentlyViewed} />

            {/* 14 — لماذا تختار موقعنا؟ */}
            <WhyUs />

            {/* 15 — آراء العملاء (بيختفي لو مفيش رأي معتمد) */}
            <Reviews items={reviews} title={t.reviewsTitle} desc={t.reviewsDesc} />

            {/* 16 — تواصل معنا */}
            <HomeContact />
        </SiteLayout>
    );
}
