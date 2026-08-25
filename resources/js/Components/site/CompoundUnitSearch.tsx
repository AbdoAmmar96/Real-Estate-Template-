import { router, usePage } from "@inertiajs/react";
import { RotateCcw, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import type { SearchFilters } from "@/Components/site/ActiveFilters";
import type { SearchOptions, SharedProps } from "@/lib/types";

const copy = {
    ar: {
        purpose: "نوع الإعلان",
        type: "أنواع الوحدات",
        price: "نطاق السعر",
        beds: "غرف النوم",
        baths: "الحمامات",
        extras: "المميزات",
        any: "الكل",
        sale: "بيع",
        rent: "إيجار",
        min: "من",
        max: "إلى",
        garden: "حديقة",
        roof: "روف",
        dressing: "غرفة ملابس",
        apply: "بحث",
        reset: "مسح",
        results: (n: number) => `${n} وحدة مطابقة`,
    },
    en: {
        purpose: "Listing type",
        type: "Unit types",
        price: "Price range",
        beds: "Bedrooms",
        baths: "Bathrooms",
        extras: "Features",
        any: "All",
        sale: "Sale",
        rent: "Rent",
        min: "From",
        max: "To",
        garden: "Garden",
        roof: "Roof",
        dressing: "Dressing room",
        apply: "Search",
        reset: "Reset",
        results: (n: number) => `${n} matching units`,
    },
};

const field = "w-full rounded-xl border border-gray-200 bg-bg px-3.5 py-2.5 text-sm font-bold text-secondary outline-none transition focus:border-primary";

/**
 * «استكشف العقارات في المشروع» — فلترة داخل الكمبوند.
 *
 * بتبعت على نفس صفحة الكمبوند بنفس مفاتيح فلاتر صفحة العقارات، والسيرفر
 * بيمرّرها لـ Catalog::compoundUnits — فمفيش منطق فلترة تاني يتفرّق عن
 * البحث العام.
 */
export default function CompoundUnitSearch({
    filters,
    options,
    path,
    count,
}: {
    filters: SearchFilters;
    options: SearchOptions;
    /** مسار صفحة الكمبوند الحالية */
    path: string;
    count: number;
}) {
    const { locale } = usePage<SharedProps>().props;
    const t = copy[locale] ?? copy.ar;

    const [form, setForm] = useState<SearchFilters>(filters);

    const set = (k: keyof SearchFilters, v: string) => setForm((f) => ({ ...f, [k]: v }));
    const toggle = (k: keyof SearchFilters) => setForm((f) => ({ ...f, [k]: f[k] ? "" : "1" }));

    const apply = (e: React.FormEvent) => {
        e.preventDefault();

        // القيم الفاضية بتتشال من الرابط عشان مايتملاش بمفاتيح بلا قيمة
        const query = Object.fromEntries(Object.entries(form).filter(([, v]) => v !== "" && v !== null));

        router.get(path, query, { preserveState: true, preserveScroll: true });
    };

    const reset = () => {
        setForm({} as SearchFilters);
        router.get(path, {}, { preserveScroll: true });
    };

    const flags: [keyof SearchFilters, string][] = [
        ["garden", t.garden],
        ["roof", t.roof],
        ["dressing", t.dressing],
    ];

    return (
        <form onSubmit={apply} className="rounded-2xl border border-gray-100 bg-surface p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <span className="flex items-center gap-2 text-sm font-extrabold text-secondary">
                    <SlidersHorizontal size={16} className="text-primary" />
                    {t.results(count)}
                </span>

                <button
                    type="button"
                    onClick={reset}
                    className="flex items-center gap-1.5 text-[13px] font-extrabold text-muted transition hover:text-primary"
                >
                    <RotateCcw size={14} />
                    {t.reset}
                </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <label className="flex flex-col gap-1.5">
                    <span className="text-xs font-extrabold text-muted">{t.purpose}</span>
                    <select value={form.purpose ?? ""} onChange={(e) => set("purpose", e.target.value)} className={field}>
                        <option value="">{t.any}</option>
                        <option value="sale">{t.sale}</option>
                        <option value="rent">{t.rent}</option>
                    </select>
                </label>

                <label className="flex flex-col gap-1.5">
                    <span className="text-xs font-extrabold text-muted">{t.type}</span>
                    <select value={form.type ?? ""} onChange={(e) => set("type", e.target.value)} className={field}>
                        <option value="">{t.any}</option>
                        {options.types.map((ty) => (
                            <option key={ty} value={ty}>
                                {ty}
                            </option>
                        ))}
                    </select>
                </label>

                <label className="flex flex-col gap-1.5">
                    <span className="text-xs font-extrabold text-muted">{t.beds}</span>
                    <select value={form.beds ?? ""} onChange={(e) => set("beds", e.target.value)} className={field}>
                        <option value="">{t.any}</option>
                        {[1, 2, 3, 4, 5].map((n) => (
                            <option key={n} value={n}>
                                {n}+
                            </option>
                        ))}
                    </select>
                </label>

                <label className="flex flex-col gap-1.5">
                    <span className="text-xs font-extrabold text-muted">{t.baths}</span>
                    <select value={form.baths ?? ""} onChange={(e) => set("baths", e.target.value)} className={field}>
                        <option value="">{t.any}</option>
                        {[1, 2, 3, 4].map((n) => (
                            <option key={n} value={n}>
                                {n}+
                            </option>
                        ))}
                    </select>
                </label>

                <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <span className="text-xs font-extrabold text-muted">{t.price}</span>
                    <div className="flex items-center gap-2">
                        <input
                            type="number"
                            dir="ltr"
                            inputMode="numeric"
                            placeholder={t.min}
                            value={form.price_min ?? ""}
                            onChange={(e) => set("price_min", e.target.value)}
                            className={field}
                        />
                        <input
                            type="number"
                            dir="ltr"
                            inputMode="numeric"
                            placeholder={t.max}
                            value={form.price_max ?? ""}
                            onChange={(e) => set("price_max", e.target.value)}
                            className={field}
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <span className="text-xs font-extrabold text-muted">{t.extras}</span>
                    <div className="flex flex-wrap gap-2">
                        {flags.map(([key, label]) => (
                            <button
                                key={key}
                                type="button"
                                onClick={() => toggle(key)}
                                aria-pressed={Boolean(form[key])}
                                className={`rounded-full border px-4 py-2 text-[12px] font-extrabold transition ${
                                    form[key]
                                        ? "border-primary bg-primary text-primary-fg"
                                        : "border-gray-200 text-secondary hover:border-primary hover:text-primary"
                                }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <button
                type="submit"
                className="mt-5 rounded-brand bg-primary px-8 py-3 text-sm font-extrabold text-primary-fg transition hover:bg-primary-hover"
            >
                {t.apply}
            </button>
        </form>
    );
}
