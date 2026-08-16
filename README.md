# BP Engine — Real Estate Template

قالب عقارات متكامل: Laravel 12 + Inertia v2 + React TS + Vite + Tailwind v4 · Modular MVC (nwidart) · Theme Engine · داشبورد React مخصوص (بدون Filament)

© شركة شريك الأعمال لتقنية المعلومات — [bp-eg.com](https://bp-eg.com)

---

## التشغيل

**المتطلبات:** PHP 8.3+ · Composer · Node 20+

```bash
git clone https://github.com/AbdoAmmar96/Real-Estate-Template-.git
cd Real-Estate-Template-

composer install
npm install

cp .env.example .env
php artisan key:generate

touch database/database.sqlite
php artisan migrate --seed
php artisan storage:link

composer run dev
```

| | |
|---|---|
| الموقع | http://localhost:8000/ar (و `/en`) |
| الداشبورد | http://localhost:8000/admin |
| الدخول | `admin@bp-eg.com` / `password` ← **غيّرها فورًا** |
| قاعدة البيانات | SQLite جاهزة — للتحويل لـ MySQL عدّل `.env` وشغّل `php artisan migrate:fresh --seed` |

> `composer run dev` بيشغّل السيرفر والـ queue واللوجات وVite مع بعض. لو تحب تفصلهم:
> `php artisan serve` في تيرمنال و `npm run dev` في تيرمنال تاني.

## أول تجربة تعملها (إثبات الـ Theme Engine)

1. افتح الداشبورد → الإعدادات → **الهوية والألوان**.
2. غيّر "اللون الأساسي" من الذهبي لأي لون.
3. احفظ، وافتح الموقع واعمل ريفريش — **الموقع كله اتغير من غير أي build**.

## بنية المشروع

```
app/Support/DemoContent.php     بيانات عقارات وكمبوندات تجريبية (المرحلة 4 بتبدلها بموديلات حقيقية)
bootstrap/app.php               Inertia middleware + role/permission aliases
routes/web.php                  راوتات الموقع بـ /ar /en + تحويل الجذر
resources/views/app.blade.php   حقن توكنز الثيم من DB + خط Cairo + GTM من الإعدادات
resources/css/app.css           Tailwind v4 @theme inline ← قلب الـ Theme Engine
resources/js/
├── app.tsx · ssr.tsx
├── Layouts/SiteLayout.tsx      هيدر + سويتشر لغة + فوتر حقوق شريك الأعمال (إلزامي)
├── Layouts/AdminLayout.tsx     سايدبار RTL + ناڤ الموديولات
├── Pages/Site/                 Home · Properties · Compounds · About · Contact
├── Pages/Admin/                Login · Dashboard · Settings/Edit
└── Components/admin/           ui.tsx (Form Kit v0) + ResourceTable.tsx (Table Kit v0)
Modules/Core/                   الإعدادات + الأوث + الداشبورد
├── app/Services/SettingsService.php   كاش دائم + فلش تلقائي
└── database/                   migration settings + Seeders (Palette A + Cairo + admin user)
Modules/{Pages,Locations,Developers,Compounds,Properties,Leads,Blog,Seo,Reviews}/
                                متولّدة فاضية — كل مرحلة بتملى بتاعها
```

## قرارات مقصودة في المرحلة دي

- **Auth مبسطة** (session + `role:admin`) — Fortify + 2FA بيتركبوا في المرحلة 2 من غير ما يتغير أي راوت.
- **ResourceTable v0** مبني يدوي server-driven — TanStack بيتركب مكانه بنفس الـ API لما الجداول تتعقد.
- الموديولات التسعة الباقية متولّدة فاضية.

## الخريطة الجاية

- **المرحلة 2:** Media Manager + Menu Builder + Users/Roles UI + Fortify/2FA + Activity Log
- **المرحلة 3:** Block Builder (dnd-kit) + المعاينة الحية + أنماط الهيرو (static/slider/video)
- **المرحلة 4:** Locations → Developers → Compounds → Properties (أدمن CRUD + صفحات عامة + فلاتر)
- **المرحلة 5+:** Leads/واتساب → Blog/SEO/SSR → WebGL hero → Playwright → Deploy

---

## v1.1 — الموقع فاتح + 4 صفحات جديدة

- **الثيم الافتراضي أبيض بالكامل** (هيرو وأقسام وفوتر فواتح) — الكحلي والدهبي للنصوص والأزرار. الرجوع للداكن في أي وقت = تغيير `bg / surface / text` من شاشة الهوية والألوان.
- **صفحات جديدة:** `/properties` (فلاتر UI + كروت عقارات) · `/compounds` (كروت مشاريع بسعر البداية والمقدم والتقسيط) · `/about` · `/contact` (فورم بيبني رسالة واتساب فعلية من بيانات الإعدادات).
- بيانات العقارات والكمبوندات تجريبية من `app/Support/DemoContent.php` (أسماء مشاريع خيالية) — المرحلة 4 بتبدلها بالموديلات الحقيقية بنفس الـ props.
- الهيدر فيه ناڤ كامل + منيو موبايل، والفوتر فاتح بثلاث أعمدة + سطر الحقوق.

## v1.2 — WebGL + أنيميشن + اللوجو والفيديو

- **هيرو WebGL حي**: شادر خام (بدون three.js — صفر dependencies إضافية) بيرسم بقع ذهبي/كحلي متحركة فوق الخلفية الفاتحة، بيقرأ الألوان من توكنز الثيم تلقائيًا. Lazy-loaded، بيحترم reduced-motion، DPR cap 1.5، وبيتوقف لما يخرج من الشاشة. تشغيل/إيقاف من الداشبورد: `hero_variant = webgl / static`.
- **أنيميشن**: `Reveal` (ظهور عند التمرير بدون مكتبات) على كل الأقسام + `CountUp` عدادات متحركة للإحصائيات + hover lift على الكروت.
- **اللوجو الحقيقي متركّب**: `public/images/logo.png` — ظاهر في الهيدر والهيرو، ومساره بيتغير من الداشبورد → اللوجو والميديا.
- **قسم الفيديو التعريفي** في الرئيسية: حط رابط mp4 أو YouTube في الداشبورد → اللوجو والميديا → رابط الفيديو، وهيظهر فورًا.
- **أقسام جديدة في الرئيسية**: أحدث العقارات (3) · الفيديو · أحدث الكمبوندات (2) · كيف نعمل (3 خطوات) — والكروت بقت مكونات مشتركة (`PropertyCard` / `CompoundCard`).
