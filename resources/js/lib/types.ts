export type SettingsGroups = Record<string, Record<string, string>>;

export interface AuthUser {
    id: number;
    name: string;
    email: string;
    /** صلاحيات المستخدم — بتحدد اللي بيظهر في سايدبار اللوحة */
    can: string[];
    /** بيفتح لوحة التحكم؟ العميل لأ — بيشوف «حسابي» بدلها */
    staff: boolean;
    /** أرقام الوحدات المحفوظة — عشان القلب يطلع مليان من أول رندر */
    favorites: number[];
    /** أرقام المشاريع المحفوظة — «احفظ» في صفحة الكمبوند */
    savedCompounds: number[];
}

/** طلب في صفحة «طلباتي» */
export interface AccountRequest {
    id: number;
    subject: string;
    /** رابط الوحدة/المشروع، أو null لو استفسار عام */
    link: string | null;
    message: string;
    status: { label: string; tone: string };
    date: string;
}

/** لينك في قائمة الهيدر أو الفوتر — بيتدار من /admin/menus */
export interface MenuLink {
    label: string;
    /** فاضي = عنصر قائمة منسدلة، مش رابط */
    url: string;
    external: boolean;
    newTab: boolean;
    /** مستوى واحد بس — الأعمق بيبوظ التنقّل على الموبايل */
    children: MenuLink[];
}

export interface SharedProps {
    settings: SettingsGroups;
    locale: "ar" | "en";
    menu: { header: MenuLink[]; footer: MenuLink[] };
    /** أعمدة روابط الفوتر — شراء · إيجار · مناطق · مطوّرون · كمبوندات · الأكثر بحثًا */
    footerLinks?: { title: string; links: { label: string; url: string }[] }[];
    /** ميتا الصفحة — بتترندر في السيرفر، وبتستخدم هنا لعنوان التاب بس */
    meta?: { title: string; description: string; canonical: string };
    auth: { user: AuthUser | null };
    flash: { success?: string | null; error?: string | null };
    [key: string]: unknown;
}

export interface Paginated<T> {
    data: T[];
    links: { url: string | null; label: string; active: boolean }[];
    total: number;
    from: number | null;
    to: number | null;
}

export interface Property {
    id: number;
    /** رابط صفحة العقار — /{locale}/properties/{slug} */
    slug: string;
    title: string;
    area: string;
    /** سلَج المنطقة — عشان اسمها يبقى لينك مش نص ميت */
    areaSlug?: string;
    purpose: string;
    /** نوع العقار باللغة المعروضة (شقة / Apartment) */
    type: string;
    /** residential | commercial — مشتق من النوع */
    category: string;
    /** السعر كرقم — للفرز والفلترة */
    priceAmount: number;
    /** إعلان مميّز — بيتصدّر النتايج */
    featured: boolean;
    /** مستوى التشطيب باللغة المعروضة — فاضي لو مش محدّد */
    finishing: string;
    price: string;
    beds: number;
    baths: number;
    size: number;
    ref: string;
    image: string;
    /** مطوّر الوحدة، وإلا مطوّر الكمبوند — فاضي لو الاتنين مش متحددين */
    developer: string;
    /** سلَج المطوّر — نفس السبب */
    developerSlug?: string;
}

/** العقار كامل في صفحة التفاصيل */
export interface PropertyDetail extends Property {
    description: string;
    floor: string;
    /** سنة التسليم */
    delivery: string;
    /** خطة السداد — المفاتيح الفاضية بتتشال من السيرفر */
    payment: { down?: string; monthly?: string; years?: string };
    /** garden · roof · dressing */
    amenities: string[];
    features: string[];
    /** الصورة الرئيسية أول عنصر دايمًا */
    gallery: string[];
    compound: { name: string; slug: string; developer: string; delivery: string } | null;
    /** إحداثيات المشروع — الوحدة بتورّثها، null يعني الخريطة بتختفي */
    lat: number | null;
    lng: number | null;
}

export interface Compound {
    id: number;
    /** رابط صفحة الكمبوند — /{locale}/compounds/{slug} */
    slug: string;
    name: string;
    developer: string;
    /** سلَج المطوّر — عشان اسمه يبقى لينك مش نص ميت */
    developerSlug?: string;
    developerLogo?: string;
    area: string;
    /** سلَج المنطقة — نفس السبب */
    areaSlug?: string;
    starting: string;
    /** سعر الريسيل — بيتشال لو مفيش ريسيل معروض */
    resale?: string;
    down: string;
    years: string;
    new: boolean;
    image: string;
    desc: string;
    delivery: string;
}

/** سؤال وإجابة في أكورديون الأسئلة الشائعة */
export interface FaqItem {
    q: string;
    a: string;
}

/** الكمبوند كامل في صفحة التفاصيل */
export interface CompoundDetail extends Compound {
    features: string[];
    gallery: string[];
    /** صورة المخطط العام — فاضية يعني القسم بيختفي */
    masterPlan: string;
    /** مسار ملف البروشور — فاضي يعني زر التحميل بيختفي */
    brochure: string;
    lat: number | null;
    lng: number | null;
    faqs: FaqItem[];
    /** عدد الوحدات المنشورة داخل المشروع */
    units: number;
    developerId?: number | null;
    locationId?: number | null;
}

/** موقع مشروع على خريطة صفحة المطوّر */
export interface MapPin {
    name: string;
    lat: number;
    lng: number;
    url: string;
}

/** كارت «تصفّح حسب النوع» — بعدد الوحدات الحقيقي ورابط مفلتر */
export interface TypeCard {
    /** slug الجمع من Property::TYPE_PLURALS — بيحدد الأيقونة */
    key: string;
    type: string;
    label: string;
    count: number;
    category: "residential" | "commercial";
    url: string;
}

/** بانر «مشروع تحت الضوء» — إعلان بموضع spotlight */
export interface SpotlightAd extends Compound {
    adId: number;
    kind: "compound" | "property";
    /** رابط التتبّع — بيعدّي على /ads/{id} قبل صفحة المشروع */
    url: string;
    href: string;
    masterPlan: string;
    brochure: string;
}

/** بطاقة منطقة في قسم "مناطق بنغطيها" بالرئيسية */
export interface Area {
    id: number;
    slug: string;
    name: string;
    note: string;
    count: string;
    image: string;
    /** رابط صفحة المنطقة */
    url: string;
    compounds?: number;
    properties?: number;
}

/** المنطقة كاملة في صفحتها */
export interface AreaDetail {
    id: number;
    slug: string;
    name: string;
    note: string;
    about: string;
    image: string;
    cover: string;
    url: string;
    properties: number;
    compounds: number;
    developers: number;
}

/** كارت مطوّر — في صفحة المطوّرين وفي «من نحن» */
export interface DeveloperCard {
    id: number;
    slug: string;
    name: string;
    /** نبذة المطوّر — بتفضل فاضية لحد ما تتكتب من الداشبورد */
    about: string;
    /** مسار اللوجو — فاضي يعني ارسم أول حرف بدله */
    logo: string;
    /** عدد المشاريع المنشورة */
    compounds: number;
    /** عدد الوحدات المعروضة — بيتبعت في صفحة المطوّرين بس */
    units?: number;
    /** رابط صفحة المطوّر — /{locale}/developers/{slug} */
    url: string;
}

/** المطوّر كامل في صفحته */
export interface DeveloperDetail extends DeveloperCard {
    cover: string;
    website: string;
    founded: string;
    headquarters: string;
    units: number;
    areas: number;
}

/** كارت مقال في المدونة */
export interface BlogPost {
    id: number;
    title: string;
    slug: string;
    category: string;
    excerpt: string;
    image: string;
    author: string;
    date: string;
    /** تاريخ ISO — للـ JSON-LD و<time> */
    publishedAt: string | null;
    /** وقت القراءة بالدقايق */
    read: number;
}

/** المقال كامل بصفحة العرض */
export interface BlogArticle extends BlogPost {
    body: string;
}

export interface Option {
    value: string;
    label: string;
}

/** خيارات البحث في الهيرو ولوحة الفلاتر */
export interface SearchOptions {
    types: string[];
    locations: string[];
    stats: { value: string; suffix: string; label: string }[];
    finishing: Option[];
    sorts: Option[];
    developers: Option[];
    compounds: Option[];
    /** حدود المنزلقات — محسوبة من المعروض فعلًا */
    bounds: { priceMin: number; priceMax: number; areaMin: number; areaMax: number };
}

/** محطة في الخط الزمني بصفحة "من نحن" */
export interface Milestone {
    year: string;
    title: string;
    text: string;
}

/** عضو فريق */
export interface TeamMember {
    name: string;
    role: string;
    image: string;
}

/** خيارات فورم "اتصل بنا" */
export interface ContactOptions {
    areas: string[];
    budgets: string[];
    offices: { title: string; text: string }[];
    steps: { title: string; text: string }[];
    faq: { q: string; a: string }[];
}

/** حقل في فورم الريسورس العام */
export interface ResourceField {
    name: string;
    label: string;
    type: "text" | "number" | "password" | "date" | "textarea" | "select" | "toggle" | "image" | "gallery";
    hint?: string;
    required?: boolean;
    options?: { value: string; label: string }[];
}

/** سكيما الريسورس الجاية من الكنترولر */
export interface ResourceSchema {
    key: string;
    labels: { plural: string; singular: string };
    columns: Record<string, string>;
    fields: ResourceField[];
    /** فلاتر منسدلة فوق الجدول */
    filters?: { name: string; label: string; options: { value: string; label: string }[] }[];
}
