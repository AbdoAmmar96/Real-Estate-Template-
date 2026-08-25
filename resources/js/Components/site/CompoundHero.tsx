import { Link, usePage } from "@inertiajs/react";
import { Building2, FileText, Images, Map, MapPin, MessageCircle, Phone } from "lucide-react";
import { useState } from "react";
import BrochureModal from "@/Components/site/BrochureModal";
import DeveloperLogo from "@/Components/site/DeveloperLogo";
import FavoriteButton from "@/Components/site/FavoriteButton";
import type { CompoundDetail, SharedProps } from "@/lib/types";

const copy = {
    ar: {
        crumb: "الكمبوندات",
        home: "الرئيسية",
        by: "بواسطة",
        developerPrice: "سعر المطوّر يبدأ من",
        resalePrice: "سعر الريسيل يبدأ من",
        photos: "صورة",
        newLaunch: "إطلاق جديد",
        wa: "واتساب",
        call: "اتصل",
        nav: { details: "التفاصيل", map: "الموقع على الخريطة", plan: "المخطط العام", brochure: "تحميل البروشور" },
    },
    en: {
        crumb: "Compounds",
        home: "Home",
        by: "by",
        developerPrice: "Developer price from",
        resalePrice: "Resale price from",
        photos: "photos",
        newLaunch: "New launch",
        wa: "WhatsApp",
        call: "Call",
        nav: { details: "Details", map: "Location on map", plan: "Master plan", brochure: "Download brochure" },
    },
};

/**
 * أعلى صفحة الكمبوند: موزاييك صور + العنوان ولوجو المطوّر + السعرين
 * (المطوّر والريسيل) + زر الحفظ + شريط تنقّل داخلي للأقسام.
 *
 * الشريط بيتشال منه أي بند مالوش قسم فعلًا في الصفحة — لينك بيوديك
 * لمكان مش موجود أسوأ من غيابه.
 */
export default function CompoundHero({
    compound,
    onBrochure,
}: {
    compound: CompoundDetail;
    /** لو الصفحة بتدير المودال بنفسها — وإلا الهيرو بيفتحه بنفسه */
    onBrochure?: () => void;
}) {
    const { locale, settings } = usePage<SharedProps>().props;
    const t = copy[locale] ?? copy.ar;

    const [ownBrochure, setOwnBrochure] = useState(false);

    const wa = settings.contact?.whatsapp;
    const phone = settings.contact?.phone;

    const gallery = compound.gallery.length > 0 ? compound.gallery : [compound.image];
    const [main, ...rest] = gallery;
    const tiles = rest.slice(0, 4);

    const nav = [
        ["#details", t.nav.details, Building2, true],
        ["#map", t.nav.map, MapPin, compound.lat !== null && compound.lat !== undefined],
        ["#master-plan", t.nav.plan, Map, Boolean(compound.masterPlan)],
    ].filter(([, , , show]) => show) as [string, string, typeof Building2, boolean][];

    const openBrochure = onBrochure ?? (() => setOwnBrochure(true));

    return (
        <section className="bg-bg px-4 pb-6 pt-6">
            <div className="mx-auto max-w-7xl">
                <nav className="mb-4 flex flex-wrap items-center gap-2 text-xs font-bold text-muted">
                    <Link href={`/${locale}`} className="transition hover:text-primary">
                        {t.home}
                    </Link>
                    <span aria-hidden>/</span>
                    <Link href={`/${locale}/compounds`} className="transition hover:text-primary">
                        {t.crumb}
                    </Link>
                    <span aria-hidden>/</span>
                    <span className="text-secondary">{compound.name}</span>
                </nav>

                {/* موزاييك الصور — صورة كبيرة وأربعة مربعات */}
                <div className="grid gap-2 overflow-hidden rounded-3xl lg:grid-cols-[1.6fr_1fr]">
                    <div className="relative h-[280px] lg:h-[420px]">
                        <img src={main} alt={compound.name} className="h-full w-full object-cover" />
                        {compound.new && (
                            <span className="absolute start-4 top-4 rounded-full bg-primary px-3.5 py-2 text-[11px] font-extrabold text-primary-fg">
                                {t.newLaunch}
                            </span>
                        )}
                        <span className="absolute bottom-4 end-4 flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-[11px] font-extrabold text-white">
                            <Images size={13} />
                            {gallery.length} {t.photos}
                        </span>
                    </div>

                    {tiles.length > 0 && (
                        <div className="hidden grid-cols-2 gap-2 lg:grid">
                            {tiles.map((src, i) => (
                                <img
                                    key={`${src}-${i}`}
                                    src={src}
                                    alt=""
                                    loading="lazy"
                                    className="h-[206px] w-full object-cover"
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* العنوان + الأسعار + الأزرار */}
                <div className="mt-6 flex flex-wrap items-start justify-between gap-6">
                    <div className="flex items-start gap-4">
                        {compound.developer && (
                            <DeveloperLogo name={compound.developer} logo={compound.developerLogo} size={64} />
                        )}

                        <div>
                            <h1 className="text-3xl font-black leading-snug text-secondary md:text-4xl">
                                {compound.name}
                                {compound.area && (
                                    <span className="text-muted"> — {compound.area}</span>
                                )}
                            </h1>

                            <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-bold text-muted">
                                {compound.developer && (
                                    <>
                                        <span>{t.by}</span>
                                        {compound.developerSlug ? (
                                            <Link
                                                href={`/${locale}/developers/${compound.developerSlug}`}
                                                className="text-secondary underline-offset-4 transition hover:text-primary hover:underline"
                                            >
                                                {compound.developer}
                                            </Link>
                                        ) : (
                                            <span className="text-secondary">{compound.developer}</span>
                                        )}
                                    </>
                                )}
                                {compound.area && compound.areaSlug && (
                                    <>
                                        <span aria-hidden>·</span>
                                        <Link
                                            href={`/${locale}/areas/${compound.areaSlug}`}
                                            className="flex items-center gap-1 text-secondary underline-offset-4 transition hover:text-primary hover:underline"
                                        >
                                            <MapPin size={13} className="text-primary" />
                                            {compound.area}
                                        </Link>
                                    </>
                                )}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <FavoriteButton
                            compoundId={compound.id}
                            label
                            className="flex items-center gap-2 rounded-brand border-2 border-gray-200 px-5 py-3 text-secondary transition hover:border-primary hover:text-primary"
                        />

                        {wa && (
                            <a
                                href={`https://wa.me/${wa}`}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-2 rounded-brand bg-primary px-5 py-3 text-sm font-extrabold text-primary-fg transition hover:bg-primary-hover"
                            >
                                <MessageCircle size={16} />
                                {t.wa}
                            </a>
                        )}

                        {phone && (
                            <a
                                href={`tel:${phone}`}
                                className="flex items-center gap-2 rounded-brand border-2 border-secondary px-5 py-3 text-sm font-extrabold text-secondary transition hover:bg-secondary hover:text-white"
                            >
                                <Phone size={16} />
                                {t.call}
                            </a>
                        )}
                    </div>
                </div>

                {/* السعرين جنب بعض — ده الفرق اللي الزائر بيدوّر عليه */}
                <div className="mt-5 flex flex-wrap gap-3">
                    {compound.starting && (
                        <div className="flex min-w-[220px] flex-col gap-1 rounded-2xl border border-primary/30 bg-primary/10 px-5 py-4">
                            <span className="text-[11px] font-bold text-muted">{t.developerPrice}</span>
                            <span className="text-xl font-black text-primary" dir="ltr">
                                {compound.starting}
                            </span>
                        </div>
                    )}

                    {compound.resale && (
                        <div className="flex min-w-[220px] flex-col gap-1 rounded-2xl border border-gray-200 bg-surface px-5 py-4">
                            <span className="text-[11px] font-bold text-muted">{t.resalePrice}</span>
                            <span className="text-xl font-black text-secondary" dir="ltr">
                                {compound.resale}
                            </span>
                        </div>
                    )}
                </div>

                {/* شريط التنقّل الداخلي */}
                <div className="mt-6 flex flex-wrap gap-2 border-t border-gray-100 pt-5">
                    {nav.map(([href, label, Icon]) => (
                        <a
                            key={href}
                            href={href}
                            className="flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2.5 text-[13px] font-extrabold text-secondary transition hover:border-primary hover:text-primary"
                        >
                            <Icon size={14} className="text-primary" />
                            {label}
                        </a>
                    ))}

                    {compound.brochure && (
                        <button
                            type="button"
                            onClick={openBrochure}
                            className="flex items-center gap-2 rounded-full border border-primary bg-primary/10 px-4 py-2.5 text-[13px] font-extrabold text-primary transition hover:bg-primary hover:text-primary-fg"
                        >
                            <FileText size={14} />
                            {t.nav.brochure}
                        </button>
                    )}
                </div>
            </div>

            {ownBrochure && (
                <BrochureModal
                    compoundId={compound.id}
                    name={compound.name}
                    onClose={() => setOwnBrochure(false)}
                />
            )}
        </section>
    );
}
