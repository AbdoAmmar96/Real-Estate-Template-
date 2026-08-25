import { router, usePage } from "@inertiajs/react";
import { RotateCcw, Search } from "lucide-react";
import { useState } from "react";
import type { SearchFilters } from "@/Components/site/ActiveFilters";
import type { SearchOptions, SharedProps } from "@/lib/types";

const copy = {
    ar: {
        title: "البحث المتقدم",
        q: "اسم المشروع",
        qPlaceholder: "مثال: ميفيدا",
        location: "المنطقة",
        developer: "المطوّر",
        delivery: "التسليم قبل",
        years: "سنوات التقسيط",
        any: "الكل",
        newOnly: "إطلاق جديد فقط",
        apply: "بحث",
        reset: "مسح",
        upTo: (n: number) => `حتى ${n} سنوات`,
    },
    en: {
        title: "Advanced search",
        q: "Project name",
        qPlaceholder: "e.g. Mivida",
        location: "Area",
        developer: "Developer",
        delivery: "Delivered before",
        years: "Instalment years",
        any: "All",
        newOnly: "New launches only",
        apply: "Search",
        reset: "Reset",
        upTo: (n: number) => `Up to ${n} years`,
    },
};

const field =
    "w-full rounded-xl border border-gray-200 bg-bg px-3.5 py-2.5 text-sm font-bold text-secondary outline-none transition focus:border-primary";

/**
 * البحث المتقدم في صفحة الكمبوندات — المنطقة والمطوّر والتسليم وسنوات
 * التقسيط. الصفحة كانت بتقبل الاسم والمنطقة بس، فباقي المعايير اللي
 * الزائر بيختار على أساسها ما كانش ليها مدخل.
 */
export default function CompoundFilters({
    filters,
    options,
    path,
}: {
    filters: SearchFilters;
    options: SearchOptions;
    path: string;
}) {
    const { locale } = usePage<SharedProps>().props;
    const t = copy[locale] ?? copy.ar;

    const [form, setForm] = useState<SearchFilters>(filters);

    const set = (k: keyof SearchFilters, v: string) => setForm((f) => ({ ...f, [k]: v }));

    const apply = (e: React.FormEvent) => {
        e.preventDefault();

        const query = Object.fromEntries(Object.entries(form).filter(([, v]) => v !== "" && v !== null));

        router.get(path, query, { preserveState: true, preserveScroll: true });
    };

    const thisYear = new Date().getFullYear();
    const years = [thisYear, thisYear + 1, thisYear + 2, thisYear + 3, thisYear + 4];

    return (
        <form onSubmit={apply} className="rounded-2xl border border-gray-100 bg-surface p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <h2 className="flex items-center gap-2 text-sm font-extrabold text-secondary">
                    <Search size={16} className="text-primary" />
                    {t.title}
                </h2>

                <button
                    type="button"
                    onClick={() => {
                        setForm({} as SearchFilters);
                        router.get(path, {}, { preserveScroll: true });
                    }}
                    className="flex items-center gap-1.5 text-[13px] font-extrabold text-muted transition hover:text-primary"
                >
                    <RotateCcw size={14} />
                    {t.reset}
                </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                <label className="flex flex-col gap-1.5">
                    <span className="text-xs font-extrabold text-muted">{t.q}</span>
                    <input
                        value={form.q ?? ""}
                        onChange={(e) => set("q", e.target.value)}
                        placeholder={t.qPlaceholder}
                        className={field}
                    />
                </label>

                <label className="flex flex-col gap-1.5">
                    <span className="text-xs font-extrabold text-muted">{t.location}</span>
                    <select value={form.location ?? ""} onChange={(e) => set("location", e.target.value)} className={field}>
                        <option value="">{t.any}</option>
                        {options.locations.map((l) => (
                            <option key={l} value={l}>
                                {l}
                            </option>
                        ))}
                    </select>
                </label>

                <label className="flex flex-col gap-1.5">
                    <span className="text-xs font-extrabold text-muted">{t.developer}</span>
                    <select value={form.developer ?? ""} onChange={(e) => set("developer", e.target.value)} className={field}>
                        <option value="">{t.any}</option>
                        {options.developers.map((d) => (
                            <option key={d.value} value={d.value}>
                                {d.label}
                            </option>
                        ))}
                    </select>
                </label>

                <label className="flex flex-col gap-1.5">
                    <span className="text-xs font-extrabold text-muted">{t.delivery}</span>
                    <select value={form.delivery ?? ""} onChange={(e) => set("delivery", e.target.value)} className={field}>
                        <option value="">{t.any}</option>
                        {years.map((y) => (
                            <option key={y} value={y}>
                                {y}
                            </option>
                        ))}
                    </select>
                </label>

                <label className="flex flex-col gap-1.5">
                    <span className="text-xs font-extrabold text-muted">{t.years}</span>
                    <select value={form.years_max ?? ""} onChange={(e) => set("years_max", e.target.value)} className={field}>
                        <option value="">{t.any}</option>
                        {[5, 6, 7, 8, 10].map((n) => (
                            <option key={n} value={n}>
                                {t.upTo(n)}
                            </option>
                        ))}
                    </select>
                </label>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-4">
                <button
                    type="submit"
                    className="rounded-brand bg-primary px-8 py-3 text-sm font-extrabold text-primary-fg transition hover:bg-primary-hover"
                >
                    {t.apply}
                </button>

                <label className="flex items-center gap-2 text-[13px] font-extrabold text-secondary">
                    <input
                        type="checkbox"
                        checked={Boolean(form.new)}
                        onChange={(e) => set("new", e.target.checked ? "1" : "")}
                        className="h-4 w-4 accent-[var(--primary)]"
                    />
                    {t.newOnly}
                </label>
            </div>
        </form>
    );
}
