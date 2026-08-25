import { usePage } from "@inertiajs/react";
import { Check, Link2, Share2 } from "lucide-react";
import { useState } from "react";
import type { SharedProps } from "@/lib/types";

/**
 * مشاركة الصفحة.
 *
 * بيستخدم Web Share API على الموبايل (بيفتح شيت المشاركة بتاع النظام)،
 * وبيقع على نسخ الرابط على الديسكتوب — من غير سكربتات طرف تالت.
 */
export default function ShareButtons({ title }: { title: string }) {
    const { locale } = usePage<SharedProps>().props;
    const ar = locale !== "en";
    const [copied, setCopied] = useState(false);

    const url = typeof window === "undefined" ? "" : window.location.href;

    const share = async () => {
        if (navigator.share) {
            try {
                await navigator.share({ title, url });
                return;
            } catch {
                // المستخدم قفل الشيت — منكمّلش لنسخ الرابط ورا ضهره
                return;
            }
        }

        await navigator.clipboard?.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const targets = [
        ["WhatsApp", `https://wa.me/?text=${encodeURIComponent(`${title} — ${url}`)}`],
        ["Facebook", `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`],
        ["X", `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`],
    ];

    return (
        <div className="flex flex-wrap items-center gap-2">
            <span className="me-1 text-[13px] font-extrabold text-muted">{ar ? "مشاركة" : "Share"}</span>

            <button
                type="button"
                onClick={share}
                className="flex items-center gap-1.5 rounded-full border border-gray-200 px-3.5 py-2 text-[12px] font-extrabold text-secondary transition hover:border-primary hover:text-primary"
            >
                {copied ? <Check size={14} /> : <Share2 size={14} />}
                {copied ? (ar ? "تم النسخ" : "Copied") : ar ? "مشاركة" : "Share"}
            </button>

            {targets.map(([name, href]) => (
                <a
                    key={name}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-gray-200 px-3.5 py-2 text-[12px] font-extrabold text-secondary transition hover:border-primary hover:text-primary"
                >
                    {name}
                </a>
            ))}

            <button
                type="button"
                onClick={async () => {
                    await navigator.clipboard?.writeText(url);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                }}
                aria-label={ar ? "نسخ الرابط" : "Copy link"}
                title={ar ? "نسخ الرابط" : "Copy link"}
                className="rounded-full border border-gray-200 p-2 text-secondary transition hover:border-primary hover:text-primary"
            >
                <Link2 size={14} />
            </button>
        </div>
    );
}
