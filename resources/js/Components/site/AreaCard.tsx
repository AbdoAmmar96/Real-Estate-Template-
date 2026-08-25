import { Link, usePage } from "@inertiajs/react";
import type { Area, SharedProps } from "@/lib/types";

/**
 * كارت منطقة — الكارت كله لينك.
 *
 * كان `<article>` بلا رابط في الرئيسية، فالزائر بيضغط ومفيش حاجة بتحصل.
 * الوجهة بتقع على /areas لو الداتا التجريبية مالهاش رابط.
 */
export default function AreaCard({ a, height = "h-64" }: { a: Area; height?: string }) {
    const { locale } = usePage<SharedProps>().props;

    return (
        <Link
            href={a.url || `/${locale}/areas`}
            className={`group relative block ${height} overflow-hidden rounded-3xl border border-gray-100 bg-bg transition duration-200 hover:-translate-y-1 hover:border-primary/50`}
        >
            <img
                src={a.image}
                alt={a.name}
                loading="lazy"
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />

            <div className="pointer-events-none absolute inset-x-4 bottom-3.5 flex items-center justify-between gap-3 rounded-2xl bg-bg/90 p-4 backdrop-blur">
                <span className="flex flex-col gap-1">
                    <span className="text-[17px] font-extrabold text-secondary">{a.name}</span>
                    <span className="text-xs font-bold text-muted">{a.note}</span>
                </span>
                <span className="shrink-0 text-lg font-extrabold text-primary">{a.count}</span>
            </div>
        </Link>
    );
}
