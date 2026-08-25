import { router, usePage } from "@inertiajs/react";
import { Heart } from "lucide-react";
import type { SharedProps } from "@/lib/types";

/**
 * حفظ الوحدة أو المشروع في قائمة العميل. الضيف بيتحوّل للوجين ومعاه رابط الرجوع،
 * فبيرجع لنفس الصفحة بعد ما يسجّل بدل ما يتوه في الرئيسية.
 */
export default function FavoriteButton({
    propertyId,
    compoundId,
    className = "",
    label = false,
}: {
    propertyId?: number;
    /** مشروع بدل وحدة — الزرار في صفحة الكمبوند */
    compoundId?: number;
    className?: string;
    /** يعرض نص جنب القلب (لصفحة التفاصيل) */
    label?: boolean;
}) {
    const { auth, locale } = usePage<SharedProps>().props;
    const ar = locale === "ar";

    const isCompound = compoundId !== undefined;
    const id = isCompound ? compoundId : propertyId;

    const saved = isCompound
        ? (auth.user?.savedCompounds?.includes(compoundId) ?? false)
        : (auth.user?.favorites?.includes(propertyId as number) ?? false);

    const toggle = (e: React.MouseEvent) => {
        // الكارت كله لينك — لازم نمنع فتح الصفحة لما نضغط القلب
        e.preventDefault();
        e.stopPropagation();

        if (!auth.user) {
            router.visit(`/${locale}/login`);
            return;
        }

        const path = isCompound ? "compound-favorites" : "favorites";

        router.post(`/${locale}/${path}/${id}`, {}, { preserveScroll: true });
    };

    const text = saved ? (ar ? "محفوظة" : "Saved") : ar ? "احفظ" : "Save";

    return (
        <button
            type="button"
            onClick={toggle}
            aria-pressed={saved}
            aria-label={text}
            title={text}
            className={
                className ||
                `flex items-center gap-2 rounded-full bg-bg/90 p-2.5 shadow transition hover:bg-bg ${
                    saved ? "text-danger" : "text-secondary"
                }`
            }
        >
            <Heart size={16} fill={saved ? "currentColor" : "none"} />
            {label && <span className="text-[13px] font-extrabold">{text}</span>}
        </button>
    );
}
