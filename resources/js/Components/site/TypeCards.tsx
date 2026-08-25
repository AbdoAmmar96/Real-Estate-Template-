import { Link, usePage } from "@inertiajs/react";
import {
    Building2,
    Home,
    Hotel,
    LandPlot,
    Stethoscope,
    Store,
    Warehouse,
    Waves,
    type LucideIcon,
} from "lucide-react";
import Reveal from "@/Components/site/Reveal";
import type { SharedProps, TypeCard } from "@/lib/types";

/**
 * «تصفّح حسب النوع» — كل كارت بيوصّل لصفحة العقارات مفلترة على نوعه.
 *
 * القسم ده هو اللي بيوصّل لصفحات الهبوط البرمجية (شقق للبيع، فيلات
 * للإيجار…) — من غيره الصفحات دي بتفضل موجودة في السايت ماب ومفيش
 * لينك واحد في الموقع بيوديها.
 */

/** أيقونة لكل نوع — المفتاح هو slug الجمع من Property::TYPE_PLURALS */
const icons: Record<string, LucideIcon> = {
    apartments: Home,
    duplexes: Hotel,
    penthouses: Building2,
    studios: Home,
    villas: LandPlot,
    townhouses: Warehouse,
    "twin-houses": Warehouse,
    chalets: Waves,
    offices: Building2,
    shops: Store,
    clinics: Stethoscope,
};

export default function TypeCards({
    items,
    title,
    desc,
}: {
    items: TypeCard[];
    title: string;
    desc?: string;
}) {
    const { locale } = usePage<SharedProps>().props;
    const ar = locale !== "en";

    if (items.length === 0) {
        return null;
    }

    return (
        <section className="bg-bg px-4 py-14">
            <div className="mx-auto max-w-7xl">
                <Reveal>
                    <h2 className="text-3xl font-extrabold text-secondary">{title}</h2>
                    {desc && <p className="mt-2 max-w-xl text-base leading-relaxed text-muted">{desc}</p>}
                </Reveal>

                <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                    {items.map((t, i) => {
                        const Icon = icons[t.key] ?? Home;

                        return (
                            <Reveal key={t.key} delay={i * 60}>
                                <Link
                                    href={t.url}
                                    className="group flex h-full flex-col items-center gap-2 rounded-2xl border border-gray-100 bg-surface p-5 text-center transition duration-200 hover:-translate-y-1 hover:border-primary/50 hover:bg-bg hover:shadow-[0_12px_30px_rgba(11,18,32,0.07)]"
                                >
                                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-primary-fg">
                                        <Icon size={22} />
                                    </span>
                                    <span className="text-sm font-extrabold text-secondary transition group-hover:text-primary">
                                        {t.label}
                                    </span>
                                    <span className="text-xs font-bold text-muted">
                                        {t.count} {ar ? "وحدة" : t.count === 1 ? "unit" : "units"}
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
