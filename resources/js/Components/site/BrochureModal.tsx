import { usePage } from "@inertiajs/react";
import { CheckCircle2, Download, X } from "lucide-react";
import { useState } from "react";
import FormField, { inputClass } from "@/Components/site/FormField";
import type { SharedProps } from "@/lib/types";

const copy = {
    ar: {
        title: "تحميل البروشور",
        sub: "اترك بياناتك ليصلك البروشور، وسيتواصل معك مستشار المشروع خلال 24 ساعة.",
        name: "الاسم",
        phone: "رقم الهاتف",
        email: "البريد الإلكتروني (اختياري)",
        consent: "أوافق على أن يتم التواصل معي بخصوص هذا المشروع.",
        submit: "أرسل وحمّل البروشور",
        sending: "جارٍ الإرسال…",
        ready: "بروشورك جاهز — اضغط «تحميل البروشور» بالأسفل.",
        download: "تحميل البروشور",
        close: "إغلاق",
        required: "هذا الحقل مطلوب",
    },
    en: {
        title: "Download brochure",
        sub: "Leave your details to receive the brochure — a project advisor will contact you within 24 hours.",
        name: "Name",
        phone: "Mobile",
        email: "Email (optional)",
        consent: "I agree to be contacted about this project.",
        submit: "Send and download",
        sending: "Sending…",
        ready: "Your brochure is ready — press “Download brochure” below.",
        download: "Download brochure",
        close: "Close",
        required: "This field is required",
    },
};

/**
 * مودال طلب البروشور.
 *
 * الرابط مش معروض في الصفحة: الزائر بيسيب بياناته الأول، والسيرفر بيسجّل
 * الطلب كـ lead بمصدر `brochure` وبيرجّع رابط الملف في الرد. fetch مش
 * router.post عشان الرد بيرجّع JSON مش صفحة Inertia.
 */
export default function BrochureModal({
    compoundId,
    name,
    onClose,
}: {
    compoundId: number;
    name: string;
    onClose: () => void;
}) {
    const { locale, auth } = usePage<SharedProps>().props;
    const t = copy[locale] ?? copy.ar;

    const [form, setForm] = useState({
        name: auth.user?.name ?? "",
        phone: "",
        email: auth.user?.email ?? "",
        website: "",
    });
    const [consent, setConsent] = useState(false);
    const [sending, setSending] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [url, setUrl] = useState<string | null>(null);

    const set = (k: keyof typeof form) => (e: { target: { value: string } }) =>
        setForm((f) => ({ ...f, [k]: e.target.value }));

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!form.name.trim() || !form.phone.trim()) {
            setErrors({
                name: form.name.trim() ? "" : t.required,
                phone: form.phone.trim() ? "" : t.required,
            });
            return;
        }

        setSending(true);
        setErrors({});

        try {
            const token = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content ?? "";

            const res = await fetch(`/${locale}/brochure/${compoundId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "X-CSRF-TOKEN": token,
                },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (res.ok && data.url) {
                setUrl(data.url);
            } else {
                setErrors((data.errors ?? {}) as Record<string, string>);
            }
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 p-4">
            <div className="relative w-full max-w-lg rounded-3xl bg-bg p-6 shadow-2xl sm:p-8">
                <button
                    type="button"
                    onClick={onClose}
                    aria-label={t.close}
                    className="absolute end-4 top-4 rounded-full p-2 text-muted transition hover:bg-surface hover:text-secondary"
                >
                    <X size={18} />
                </button>

                <h2 className="pe-8 text-xl font-extrabold text-secondary">
                    {t.title} — {name}
                </h2>

                {url ? (
                    <div className="mt-6 flex flex-col items-start gap-4">
                        <p className="flex items-center gap-2 text-sm font-extrabold text-success">
                            <CheckCircle2 size={18} />
                            {t.ready}
                        </p>
                        <a
                            href={url}
                            download
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-2 rounded-brand bg-primary px-6 py-3 text-sm font-extrabold text-primary-fg transition hover:bg-primary-hover"
                        >
                            <Download size={16} />
                            {t.download}
                        </a>
                    </div>
                ) : (
                    <form onSubmit={submit} className="mt-2">
                        <p className="mb-5 text-sm leading-relaxed text-muted">{t.sub}</p>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <FormField label={t.name} error={errors.name}>
                                <input value={form.name} onChange={set("name")} autoComplete="name" className={inputClass} />
                            </FormField>

                            <FormField label={t.phone} error={errors.phone}>
                                <input
                                    type="tel"
                                    dir="ltr"
                                    value={form.phone}
                                    onChange={set("phone")}
                                    autoComplete="tel"
                                    className={inputClass}
                                />
                            </FormField>

                            <div className="sm:col-span-2">
                                <FormField label={t.email} error={errors.email}>
                                    <input
                                        type="email"
                                        dir="ltr"
                                        value={form.email}
                                        onChange={set("email")}
                                        autoComplete="email"
                                        className={inputClass}
                                    />
                                </FormField>
                            </div>
                        </div>

                        <label className="mt-4 flex items-start gap-2.5 text-[13px] font-bold leading-relaxed text-muted">
                            <input
                                type="checkbox"
                                checked={consent}
                                onChange={(e) => setConsent(e.target.checked)}
                                className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--primary)]"
                            />
                            {t.consent}
                        </label>

                        {/* مصيدة بوتس — مخفية عن البني آدمين */}
                        <input
                            type="text"
                            name="website"
                            value={form.website}
                            onChange={set("website")}
                            tabIndex={-1}
                            autoComplete="off"
                            aria-hidden="true"
                            className="hidden"
                        />

                        <button
                            type="submit"
                            disabled={sending || !consent}
                            className="mt-5 flex w-full items-center justify-center gap-2 rounded-brand bg-primary px-6 py-3 text-sm font-extrabold text-primary-fg transition hover:bg-primary-hover disabled:opacity-50"
                        >
                            <Download size={16} />
                            {sending ? t.sending : t.submit}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
