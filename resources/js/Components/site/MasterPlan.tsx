import { usePage } from "@inertiajs/react";
import { Maximize2, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { SharedProps } from "@/lib/types";

/**
 * المخطط العام (الماستر بلان) — صورة كبيرة بتتفتح على شاشة كاملة.
 * المخطط بيبقى مليان تفاصيل صغيرة، فالتكبير مش رفاهية.
 */
export default function MasterPlan({ src, name }: { src?: string; name: string }) {
    const { locale } = usePage<SharedProps>().props;
    const ar = locale !== "en";
    const [open, setOpen] = useState(false);

    // Escape بيقفل — التكبير بياخد الشاشة كلها فلازم يكون ليه مخرج بالكيبورد
    useEffect(() => {
        if (!open) {
            return;
        }

        const close = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
        window.addEventListener("keydown", close);

        return () => window.removeEventListener("keydown", close);
    }, [open]);

    if (!src) {
        return null;
    }

    const title = ar ? "المخطط العام" : "Master plan";
    const hint = ar ? "اضغط على الصورة للتكبير" : "Click the image to enlarge";

    return (
        <section>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-2xl font-extrabold text-secondary">{title}</h2>
                <span className="text-xs font-bold text-muted">{hint}</span>
            </div>

            <button
                type="button"
                onClick={() => setOpen(true)}
                className="group relative block w-full overflow-hidden rounded-2xl border border-gray-100 bg-surface"
                aria-label={title}
            >
                <img src={src} alt={`${title} — ${name}`} loading="lazy" className="w-full object-contain" />
                <span className="absolute end-4 top-4 flex items-center gap-2 rounded-full bg-bg/90 px-3.5 py-2 text-[12px] font-extrabold text-secondary opacity-0 shadow transition group-hover:opacity-100">
                    <Maximize2 size={14} />
                    {ar ? "تكبير" : "Enlarge"}
                </span>
            </button>

            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4">
                    <button
                        type="button"
                        onClick={() => setOpen(false)}
                        aria-label={ar ? "إغلاق" : "Close"}
                        className="absolute end-5 top-5 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20"
                    >
                        <X size={20} />
                    </button>

                    <img
                        src={src}
                        alt={`${title} — ${name}`}
                        className="max-h-full max-w-full rounded-2xl object-contain"
                    />
                </div>
            )}
        </section>
    );
}
