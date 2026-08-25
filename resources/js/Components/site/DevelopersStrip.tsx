import { Link, usePage } from "@inertiajs/react";
import { ArrowLeft } from "lucide-react";
import DeveloperLogo from "@/Components/site/DeveloperLogo";
import Reveal from "@/Components/site/Reveal";
import type { DeveloperCard, SharedProps } from "@/lib/types";

const copy = {
    ar: { title: "أشهر المطوّرين", desc: "مطوّرون لهم مشاريع معروضة على المنصة بأنظمة سداد موثّقة.", all: "كل المطوّرين", projects: "مشروع" },
    en: { title: "Top developers", desc: "Developers with live projects on the platform and documented payment plans.", all: "All developers", projects: "projects" },
};

/** شبكة لوجوهات المطوّرين في الرئيسية — كل لوجو بيوصّل لصفحة المطوّر */
export default function DevelopersStrip({ items }: { items: DeveloperCard[] }) {
    const { locale } = usePage<SharedProps>().props;
    const t = copy[locale] ?? copy.ar;

    if (items.length === 0) {
        return null;
    }

    return (
        <section className="bg-surface px-4 py-14">
            <div className="mx-auto max-w-7xl">
                <div className="mb-6 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
                    <Reveal>
                        <h2 className="text-3xl font-extrabold text-secondary">{t.title}</h2>
                        <p className="mt-2 max-w-xl text-base leading-relaxed text-muted">{t.desc}</p>
                    </Reveal>

                    <Link
                        href={`/${locale}/developers`}
                        className="shrink-0 rounded-brand border-2 border-secondary px-6 py-3 text-sm font-extrabold text-secondary transition hover:bg-secondary hover:text-white"
                    >
                        {t.all}
                    </Link>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                    {items.map((d, i) => (
                        <Reveal key={d.id} delay={i * 50}>
                            <Link
                                href={d.url}
                                className="group flex h-full flex-col items-center justify-center gap-3 rounded-2xl border border-gray-100 bg-bg p-5 text-center transition duration-200 hover:-translate-y-1 hover:border-primary/50 hover:shadow-[0_12px_30px_rgba(11,18,32,0.07)]"
                            >
                                <DeveloperLogo name={d.name} logo={d.logo} size={56} />
                                <span className="text-[13px] font-extrabold leading-snug text-secondary transition group-hover:text-primary">
                                    {d.name}
                                </span>
                                <span className="flex items-center gap-1 text-[11px] font-bold text-muted">
                                    {d.compounds} {t.projects}
                                    <ArrowLeft size={12} className="ltr:rotate-180" />
                                </span>
                            </Link>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
