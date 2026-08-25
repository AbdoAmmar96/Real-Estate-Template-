import { usePage } from "@inertiajs/react";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import LeadForm from "@/Components/site/LeadForm";
import Reveal from "@/Components/site/Reveal";
import type { SharedProps } from "@/lib/types";

const copy = {
    ar: {
        title: "جاهز لعرض عقارك أو طلب وحدة مناسبة؟",
        desc: "اترك بياناتك ويتواصل معك مستشار خلال ساعات العمل — أو كلّمنا مباشرة على واتساب.",
        wa: "تواصل عبر واتساب",
        call: "اتصل بنا",
        formNote: "بنرد على كل طلب — ومش بنبيع بياناتك لأي طرف تاني.",
    },
    en: {
        title: "Ready to list your property or find the right unit?",
        desc: "Leave your details and an advisor will reach out during working hours — or message us directly on WhatsApp.",
        wa: "Chat on WhatsApp",
        call: "Call us",
        formNote: "We reply to every request — and we never sell your data to anyone.",
    },
};

/**
 * قسم التواصل في الرئيسية — بيانات الاتصال جنب الفورم.
 * أي سطر تواصل مش متكتوب في الإعدادات بيتشال بدل ما يبان فاضي.
 */
export default function HomeContact() {
    const { locale, settings } = usePage<SharedProps>().props;
    const t = copy[locale] ?? copy.ar;
    const c = settings.contact ?? {};

    const rows = [
        c.phone && [Phone, c.phone, `tel:${c.phone}`],
        c.whatsapp && [MessageCircle, c.whatsapp, `https://wa.me/${c.whatsapp}`],
        c.email && [Mail, c.email, `mailto:${c.email}`],
        c.address && [MapPin, c.address, null],
    ].filter(Boolean) as [typeof Phone, string, string | null][];

    return (
        <section className="bg-surface px-4 py-14">
            <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr]">
                <Reveal>
                    <h2 className="text-3xl font-extrabold text-secondary">{t.title}</h2>
                    <p className="mt-3 max-w-lg text-base leading-[1.9] text-muted">{t.desc}</p>

                    {rows.length > 0 && (
                        <div className="mt-6 flex flex-col gap-3">
                            {rows.map(([Icon, value, href]) => (
                                <div key={value} className="flex items-center gap-3">
                                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                                        <Icon size={17} />
                                    </span>
                                    {href ? (
                                        <a
                                            href={href}
                                            dir="ltr"
                                            className="text-sm font-extrabold text-secondary transition hover:text-primary"
                                        >
                                            {value}
                                        </a>
                                    ) : (
                                        <span className="text-sm font-bold text-muted">{value}</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {c.whatsapp && (
                        <a
                            href={`https://wa.me/${c.whatsapp}`}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-6 inline-flex items-center gap-2 rounded-brand bg-primary px-7 py-3.5 text-sm font-extrabold text-primary-fg transition hover:bg-primary-hover"
                        >
                            <MessageCircle size={16} />
                            {t.wa}
                        </a>
                    )}
                </Reveal>

                <Reveal delay={140}>
                    <LeadForm source="property" subject={t.title} />
                    <p className="mt-3 text-xs font-bold text-muted">{t.formNote}</p>
                </Reveal>
            </div>
        </section>
    );
}
