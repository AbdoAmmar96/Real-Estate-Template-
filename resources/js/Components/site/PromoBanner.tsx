import { Link, usePage } from "@inertiajs/react";
import { ArrowLeft } from "lucide-react";
import Reveal from "@/Components/site/Reveal";
import type { SharedProps } from "@/lib/types";

const fallback = {
    ar: {
        title: "عندك عقار وعايز تبيعه أو تأجّره؟",
        body: "أضف وحدتك في دقائق — نراجع بياناتها وننشرها أمام مشترين ومستأجرين جادين، بدون رسوم مقدّمة.",
        cta: "أضف عقارك مجانًا",
        second: "تحدّث مع مستشار",
    },
    en: {
        title: "Have a property to sell or rent?",
        body: "Add your unit in minutes — we review the details and publish it to serious buyers and tenants, with no upfront fees.",
        cta: "List your property free",
        second: "Talk to an advisor",
    },
};

/**
 * بانر ترويجي عريض في نص الرئيسية.
 *
 * نصوصه من الإعدادات (مجموعة `promo`) عشان تتغيّر من اللوحة، وبيقع على
 * نص افتراضي معقول لو الأدمن ما كتبش حاجة — أحسن من بانر فاضي.
 */
export default function PromoBanner() {
    const { locale, settings } = usePage<SharedProps>().props;
    const ar = locale !== "en";
    const f = fallback[locale] ?? fallback.ar;

    const promo = settings.promo ?? {};
    const suffix = ar ? "" : "_en";

    const title = (promo[`title${suffix}`] || promo.title || f.title) as string;
    const body = (promo[`body${suffix}`] || promo.body || f.body) as string;
    const cta = (promo[`cta${suffix}`] || promo.cta || f.cta) as string;
    const href = (promo.url as string) || `/${locale}/add-property`;
    const image = promo.image as string | undefined;

    return (
        <section className="bg-bg px-4 py-8">
            <Reveal>
                <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-secondary">
                    {image && (
                        <img
                            src={image}
                            alt=""
                            loading="lazy"
                            className="absolute inset-0 h-full w-full object-cover opacity-25"
                        />
                    )}

                    <div className="relative flex flex-wrap items-center justify-between gap-8 p-8 lg:p-12">
                        <div className="max-w-2xl">
                            <h2 className="text-3xl font-black leading-snug text-white md:text-4xl">{title}</h2>
                            <p className="mt-3 text-base leading-[1.9] text-white/75">{body}</p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <Link
                                href={href}
                                className="flex items-center gap-2 rounded-brand bg-primary px-7 py-3.5 text-sm font-extrabold text-primary-fg transition hover:bg-primary-hover"
                            >
                                {cta}
                                <ArrowLeft size={15} className="ltr:rotate-180" />
                            </Link>

                            <Link
                                href={`/${locale}/contact`}
                                className="rounded-brand border border-white/30 px-7 py-3.5 text-sm font-extrabold text-white transition hover:bg-white/10"
                            >
                                {f.second}
                            </Link>
                        </div>
                    </div>
                </div>
            </Reveal>
        </section>
    );
}
