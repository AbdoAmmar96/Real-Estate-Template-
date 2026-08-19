export type SettingsGroups = Record<string, Record<string, string>>;

export interface AuthUser {
    id: number;
    name: string;
    email: string;
}

export interface SharedProps {
    settings: SettingsGroups;
    locale: "ar" | "en";
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
    title: string;
    area: string;
    purpose: string;
    price: string;
    beds: number;
    baths: number;
    size: number;
    ref: string;
    image: string;
}

export interface Compound {
    id: number;
    name: string;
    developer: string;
    area: string;
    starting: string;
    down: string;
    years: string;
    new: boolean;
    image: string;
    desc: string;
    delivery: string;
}

/** بطاقة منطقة في قسم "مناطق بنغطيها" بالرئيسية */
export interface Area {
    id: number;
    name: string;
    note: string;
    count: string;
    image: string;
}

/** خيارات البحث في الهيرو */
export interface SearchOptions {
    types: string[];
    locations: string[];
    stats: { value: string; suffix: string; label: string }[];
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
}
