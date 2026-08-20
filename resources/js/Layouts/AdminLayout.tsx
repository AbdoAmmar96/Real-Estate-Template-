import { Link, usePage } from "@inertiajs/react";
import {
    Briefcase,
    Building2,
    Home,
    Image as ImageIcon,
    Images,
    Inbox,
    LayoutDashboard,
    Link2,
    ListTree,
    LogOut,
    MapPin,
    Newspaper,
    Palette,
    Phone,
    Search,
    Settings,
    Share2,
    UserCog,
} from "lucide-react";
import type { ReactNode } from "react";
import { FlashBanner } from "@/Components/admin/ui";
import type { SharedProps } from "@/lib/types";

const settingsNav = [
    { href: "/admin/settings/general", label: "عام", icon: Settings },
    { href: "/admin/settings/theme", label: "الهوية والألوان", icon: Palette },
    { href: "/admin/settings/branding", label: "اللوجو والميديا", icon: ImageIcon },
    { href: "/admin/settings/contact", label: "بيانات التواصل", icon: Phone },
    { href: "/admin/settings/social", label: "السوشيال ميديا", icon: Share2 },
    { href: "/admin/settings/seo", label: "السيو", icon: Search },
    { href: "/admin/settings/integrations", label: "التكاملات", icon: Link2 },
];

// محتوى مشترك بين كل الصفحات
const contentNav = [
    { href: "/admin/media", label: "مكتبة الميديا", icon: Images },
    { href: "/admin/menus", label: "القوائم", icon: ListTree },
];

// موديولات الدومين
const moduleNav = [
    { href: "/admin/properties", label: "العقارات", icon: Building2 },
    { href: "/admin/compounds", label: "الكمبوندات", icon: Building2 },
    { href: "/admin/developers", label: "المطوّرون", icon: Briefcase },
    { href: "/admin/locations", label: "المناطق", icon: MapPin },
    { href: "/admin/leads", label: "الطلبات", icon: Inbox },
    { href: "/admin/posts", label: "المدونة", icon: Newspaper },
];

// إدارة النظام
const systemNav = [{ href: "/admin/users", label: "المستخدمون", icon: UserCog }];

export default function AdminLayout({ title, children }: { title: string; children: ReactNode }) {
    const { auth } = usePage<SharedProps>().props;
    const path = typeof window !== "undefined" ? window.location.pathname : "";

    const item = (href: string, label: string, Icon: typeof Home, active: boolean) => (
        <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-bold transition ${
                active ? "bg-primary text-primary-fg" : "text-gray-300 hover:bg-white/10 hover:text-white"
            }`}
        >
            <Icon size={17} />
            {label}
        </Link>
    );

    return (
        <div dir="rtl" className="flex min-h-screen bg-gray-100 font-sans text-gray-900">
            {/* ------------------------------ Sidebar ------------------------------ */}
            <aside className="fixed inset-y-0 start-0 z-40 flex w-64 flex-col bg-bg-dark p-4">
                <div className="mb-8 flex items-center gap-2 px-2 pt-2">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary font-extrabold text-primary-fg">
                        BP
                    </span>
                    <span className="text-sm font-extrabold text-white">إنجن شريك الأعمال</span>
                </div>

                {/* min-h-0 مهم: من غيره الفلكس مبيسمحش للعنصر يقل عن محتواه فالسكرول مبيشتغلش */}
                <nav className="-mx-1 flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto px-1">
                    {item("/admin", "لوحة التحكم", LayoutDashboard, path === "/admin")}

                    <div className="mt-4 mb-1 px-4 text-[11px] font-extrabold tracking-wide text-gray-500">الإعدادات</div>
                    {settingsNav.map((s) => item(s.href, s.label, s.icon, path.startsWith(s.href)))}

                    <div className="mt-4 mb-1 px-4 text-[11px] font-extrabold tracking-wide text-gray-500">المحتوى</div>
                    {contentNav.map((c) => item(c.href, c.label, c.icon, path.startsWith(c.href)))}

                    <div className="mt-4 mb-1 px-4 text-[11px] font-extrabold tracking-wide text-gray-500">الموديولات</div>
                    {moduleNav.map((m) => item(m.href, m.label, m.icon, path.startsWith(m.href)))}

                    <div className="mt-4 mb-1 px-4 text-[11px] font-extrabold tracking-wide text-gray-500">النظام</div>
                    {systemNav.map((s) => item(s.href, s.label, s.icon, path.startsWith(s.href)))}
                </nav>

                <div className="mt-4 shrink-0 border-t border-white/10 pt-4">
                    <div className="px-2 text-xs text-gray-400">{auth.user?.name}</div>
                    <Link
                        href="/admin/logout"
                        method="post"
                        as="button"
                        className="mt-2 flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-300 hover:bg-white/10 hover:text-white"
                    >
                        <LogOut size={17} />
                        تسجيل الخروج
                    </Link>
                </div>
            </aside>

            {/* ------------------------------ Content ------------------------------ */}
            <div className="flex-1 ps-64">
                <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white/90 px-8 backdrop-blur">
                    <h1 className="text-lg font-extrabold">{title}</h1>
                    <a href="/ar" target="_blank" className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-secondary">
                        <Home size={16} />
                        عرض الموقع
                    </a>
                </header>

                <main className="p-8">{children}</main>
            </div>

            <FlashBanner />
        </div>
    );
}
