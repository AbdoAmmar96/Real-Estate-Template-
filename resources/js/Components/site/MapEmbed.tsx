import { usePage } from "@inertiajs/react";
import { ExternalLink, MapPin } from "lucide-react";
import type { SharedProps } from "@/lib/types";

/**
 * خريطة الموقع.
 *
 * embed بتاع جوجل من غير API key — الإحداثيات بس. الإطار بيتحمّل كسول
 * عشان مايبطّأش الصفحة، والقسم كله بيختفي لو الإحداثيات مش متكتوبة
 * بدل ما يعرض خريطة على نص المحيط.
 */
export default function MapEmbed({
    lat,
    lng,
    label,
    title,
    zoom = 14,
    height = 420,
}: {
    lat?: number | null;
    lng?: number | null;
    /** اسم المكان — بيظهر تحت الخريطة وفي رابط الفتح في جوجل */
    label?: string;
    /** "" يعني بدون ترويسة — لما الخريطة تكون جوّه قسم ليه عنوانه */
    title?: string;
    zoom?: number;
    height?: number;
}) {
    const { locale } = usePage<SharedProps>().props;
    const ar = locale !== "en";

    if (lat === null || lat === undefined || lng === null || lng === undefined) {
        return null;
    }

    const heading = title ?? (ar ? "الموقع على الخريطة" : "Location on the map");
    const openLabel = ar ? "افتح في خرائط جوجل" : "Open in Google Maps";

    const src = `https://www.google.com/maps?q=${lat},${lng}&z=${zoom}&hl=${ar ? "ar" : "en"}&output=embed`;
    const external = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

    return (
        <section>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                {title !== "" && <h2 className="text-2xl font-extrabold text-secondary">{heading}</h2>}
                <a
                    href={external}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-[13px] font-extrabold text-primary transition hover:underline"
                >
                    {openLabel}
                    <ExternalLink size={14} />
                </a>
            </div>

            <div className="overflow-hidden rounded-2xl border border-gray-100">
                <iframe
                    src={src}
                    title={heading}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    style={{ height }}
                    className="w-full border-0"
                />
            </div>

            {label && (
                <p className="mt-3 flex items-center gap-2 text-sm font-bold text-muted">
                    <MapPin size={15} className="text-primary" />
                    {label}
                </p>
            )}
        </section>
    );
}
