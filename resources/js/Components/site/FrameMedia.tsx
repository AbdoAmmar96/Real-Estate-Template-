/**
 * إطار ميديا موحّد للرئيسية — بيرندر <video> لو المسار فيديو و<img> لو صورة.
 * القيمة جاية من الإعدادات (branding.hero_media / branding.process_media)،
 * فتقدر تبدّل الصورة بفيديو من الداشبورد من غير أي تعديل كود.
 */
export default function FrameMedia({
    src,
    alt = "",
    ratio = "4 / 4.6",
    className = "",
}: {
    src?: string;
    alt?: string;
    ratio?: string;
    className?: string;
}) {
    if (!src) return null;

    const isVideo = /\.(mp4|webm|ogv)(\?|$)/i.test(src);

    return (
        <div
            className={`overflow-hidden rounded-3xl border border-gray-200 bg-bg-dark ${className}`}
            style={{ aspectRatio: ratio }}
        >
            {isVideo ? (
                <video
                    src={src}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="block h-full w-full object-cover"
                />
            ) : (
                <img src={src} alt={alt} loading="lazy" className="block h-full w-full object-cover" />
            )}
        </div>
    );
}
