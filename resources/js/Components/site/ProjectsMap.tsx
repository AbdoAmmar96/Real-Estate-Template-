import { Link, usePage } from "@inertiajs/react";
import { MapPin } from "lucide-react";
import { useState } from "react";
import MapEmbed from "@/Components/site/MapEmbed";
import type { MapPin as Pin, SharedProps } from "@/lib/types";

/**
 * «مواقع المشاريع على الخريطة».
 *
 * embed جوجل بيعرض نقطة واحدة، فبنعرض قائمة المشاريع جنب الخريطة
 * والضغط على مشروع بينقل الخريطة عليه — أوضح من دبابيس متكوّمة،
 * وبيشتغل من غير API key.
 */
export default function ProjectsMap({ pins, title }: { pins: Pin[]; title?: string }) {
    const { locale } = usePage<SharedProps>().props;
    const ar = locale !== "en";
    const [active, setActive] = useState(0);

    if (pins.length === 0) {
        return null;
    }

    const current = pins[active] ?? pins[0];

    return (
        <section>
            <h2 className="mb-4 text-xl font-extrabold text-secondary">
                {title ?? (ar ? "مواقع المشاريع على الخريطة" : "Project locations on the map")}
            </h2>

            <div className="grid gap-4 lg:grid-cols-[16rem_minmax(0,1fr)]">
                <div className="flex max-h-[420px] flex-col gap-2 overflow-y-auto lg:pe-1">
                    {pins.map((p, i) => (
                        <button
                            key={p.name}
                            type="button"
                            onClick={() => setActive(i)}
                            aria-pressed={i === active}
                            className={`flex items-center gap-2.5 rounded-xl border p-3.5 text-start text-[13px] font-extrabold transition ${
                                i === active
                                    ? "border-primary bg-primary/10 text-primary"
                                    : "border-gray-100 bg-surface text-secondary hover:border-primary/50"
                            }`}
                        >
                            <MapPin size={15} className="shrink-0" />
                            <span className="truncate">{p.name}</span>
                        </button>
                    ))}
                </div>

                <div>
                    <MapEmbed lat={current.lat} lng={current.lng} title="" height={420} />

                    {current.url && (
                        <Link
                            href={current.url}
                            className="mt-3 inline-block text-[13px] font-extrabold text-primary transition hover:underline"
                        >
                            {ar ? `صفحة ${current.name}` : `${current.name} page`}
                        </Link>
                    )}
                </div>
            </div>
        </section>
    );
}
