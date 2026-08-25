<?php

namespace App\Support;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use Modules\Blog\Models\Post;
use Modules\Compounds\Models\Compound;
use Modules\Developers\Models\Developer;
use Modules\Locations\Models\Location;
use Modules\Properties\Models\Property;
use Modules\Reviews\Models\Review;
use Modules\Seo\Models\LandingPage;

/**
 * مصدر بيانات الموقع العام — بيقرا من الجداول الحقيقية.
 * لو الجداول لسه فاضية (تثبيت جديد قبل الـ seed) بيرجع لـ DemoContent
 * عشان الموقع ميطلعش فاضي.
 */
class Catalog
{
    /**
     * الفلاتر المسموحة ونوع كل واحدة — الحارس الوحيد لأي قيمة جاية من الرابط.
     * أي مفتاح مش هنا بيتجاهل، فمحدش يقدر يحقن عمود أو ترتيب من الكويري سترنج.
     */
    private const FILTER_SCHEMA = [
        'q' => 'text',
        'type' => 'text',
        'location' => 'text',
        'developer' => 'text',
        'compound' => 'text',
        'purpose' => 'purpose',
        'category' => 'category',
        'finishing' => 'finishing',
        'sort' => 'sort',
        'price_min' => 'int',
        'price_max' => 'int',
        'area_min' => 'int',
        'area_max' => 'int',
        'beds' => 'int',
        'baths' => 'int',
        'down_max' => 'int',
        'monthly_max' => 'int',
        'years_max' => 'int',
        'delivery' => 'int',
        'featured' => 'bool',
        'garden' => 'bool',
        'roof' => 'bool',
        'dressing' => 'bool',
        // كمبوندات بس — «إطلاق جديد»
        'new' => 'bool',
    ];

    /** خيارات الترتيب — المفتاح بيتحط في الرابط */
    public const SORTS = [
        'newest' => ['ar' => 'الأحدث', 'en' => 'Newest'],
        'oldest' => ['ar' => 'الأقدم', 'en' => 'Oldest'],
        'price_asc' => ['ar' => 'السعر: من الأقل', 'en' => 'Price: low to high'],
        'price_desc' => ['ar' => 'السعر: من الأعلى', 'en' => 'Price: high to low'],
        'area_desc' => ['ar' => 'المساحة: الأكبر', 'en' => 'Area: largest'],
        'area_asc' => ['ar' => 'المساحة: الأصغر', 'en' => 'Area: smallest'],
    ];

    /**
     * @param  array  $filters  q · type · location · purpose — جايين من فورم البحث في الهيرو
     */
    public static function properties(string $locale, ?int $limit = null, array $filters = []): array
    {
        // الفولباك بيتحدد بجدول فاضي مش بنتيجة فاضية،
        // عشان بحث ملقاش حاجة ميرجّعش بيانات تجريبية بدل "مفيش نتايج"
        if (! Property::query()->exists()) {
            $demo = self::filterDemoProperties(
                self::withDemoSlugs(DemoContent::properties($locale), 'property'),
                $filters,
            );

            return $limit ? array_slice($demo, 0, $limit) : $demo;
        }

        $rows = Property::published()
            ->with(['location', 'developer', 'compound.developer', 'compound.location'])
            ->tap(fn ($q) => self::applyPropertyFilters($q, $filters))
            ->tap(fn ($q) => self::applyPropertySort($q, (string) ($filters['sort'] ?? '')))
            ->when($limit, fn ($q) => $q->limit($limit))
            ->get();

        return $rows->map(fn (Property $p) => $p->toCard($locale))->all();
    }

    private static function applyPropertyFilters($query, array $filters): void
    {
        if ($q = trim((string) ($filters['q'] ?? ''))) {
            // الـ placeholder في الهيرو بيوعد بالمنطقة والكمبوند والمطوّر — فلازم
            // البحث يغطيهم كلهم، مش العنوان والكود بس.
            // المطوّر بيتدوّر عليه في العمود المباشر وفي مطوّر الكمبوند سوا،
            // عشان الوحدة المستقلة والوحدة اللي جوه مشروع يطلعوا في نفس النتيجة.
            $like = fn ($s) => $s->where('name', 'like', "%{$q}%")->orWhere('name_en', 'like', "%{$q}%");

            $query->where(fn ($s) => $s
                ->where('title', 'like', "%{$q}%")
                ->orWhere('title_en', 'like', "%{$q}%")
                ->orWhere('ref', 'like', "%{$q}%")
                ->orWhereHas('location', $like)
                ->orWhereHas('compound', $like)
                ->orWhereHas('developer', $like)
                // الوحدة جوه مشروع بتورّث منطقته ومطوّره لو مش متكتبين عليها
                ->orWhereHas('compound.location', $like)
                ->orWhereHas('compound.developer', $like));
        }

        // القسم بيتحدد من قايمة الأنواع مش من عمود، فمصدر الحقيقة واحد
        if (in_array($filters['category'] ?? null, array_keys(Property::CATEGORIES), true)) {
            $query->whereIn('type', Property::typesIn($filters['category']));
        }

        if ($type = trim((string) ($filters['type'] ?? ''))) {
            // القيمة متخزّنة بالعربي، فالبحث الإنجليزي (Villa) بيترجم الأول
            $type = Property::TYPES[$type] ?? false
                ? $type
                : (array_flip(Property::TYPES)[$type] ?? $type);

            $query->where('type', $type);
        }

        if (in_array($filters['purpose'] ?? null, ['sale', 'rent'], true)) {
            $query->where('purpose', $filters['purpose']);
        }

        // زي المطوّر: الوحدة جوه مشروع بتورّث منطقته لو مش متكتبة عليها،
        // والكارت بيعرض المنطقة الموروثة — فالفلتر لازم يلاقيها برضه
        if ($location = trim((string) ($filters['location'] ?? ''))) {
            $match = fn ($s) => $s->where('name', $location)
                ->orWhere('name_en', $location)
                ->orWhere('slug', $location);

            $query->where(fn ($s) => $s
                ->whereHas('location', $match)
                ->orWhere(fn ($inner) => $inner
                    ->whereNull('location_id')
                    ->whereHas('compound.location', $match)));
        }

        // المطوّر ممكن يكون على الوحدة نفسها أو على مشروعها
        if ($developer = trim((string) ($filters['developer'] ?? ''))) {
            $match = fn ($s) => $s->where('name', $developer)
                ->orWhere('name_en', $developer)
                ->orWhere('slug', $developer);

            $query->where(fn ($s) => $s
                ->whereHas('developer', $match)
                ->orWhereHas('compound.developer', $match));
        }

        if ($compound = trim((string) ($filters['compound'] ?? ''))) {
            $query->whereHas('compound', fn ($s) => $s
                ->where('name', $compound)
                ->orWhere('name_en', $compound)
                ->orWhere('slug', $compound));
        }

        if (isset(Property::FINISHING[$filters['finishing'] ?? ''])) {
            $query->where('finishing', $filters['finishing']);
        }

        // النطاقات: الوحدة اللي مالهاش رقم مبتظهرش في فلتر رقمي —
        // أحسن من إنها تظهر في كل نطاق وتضلّل الباحث
        self::range($query, 'price_amount', $filters['price_min'] ?? null, $filters['price_max'] ?? null);
        self::range($query, 'size', $filters['area_min'] ?? null, $filters['area_max'] ?? null);

        foreach (['beds', 'baths'] as $column) {
            if ($min = (int) ($filters[$column] ?? 0)) {
                // «٣ غرف» معناها ٣ أو أكتر — زي كل بوابات العقارات
                $query->where($column, '>=', $min);
            }
        }

        $atMost = [
            'down_max' => 'down_payment',
            'monthly_max' => 'monthly_installment',
            'years_max' => 'installment_years',
            'delivery' => 'delivery_year',
        ];

        foreach ($atMost as $key => $column) {
            if ($max = (int) ($filters[$key] ?? 0)) {
                $query->whereNotNull($column)->where($column, '<=', $max);
            }
        }

        $flags = [
            'featured' => 'is_featured',
            'garden' => 'has_garden',
            'roof' => 'has_roof',
            'dressing' => 'has_dressing_room',
        ];

        foreach ($flags as $key => $column) {
            if (! empty($filters[$key])) {
                $query->where($column, true);
            }
        }
    }

    /**
     * تطبيق الفلاتر على استعلام جاهز — نفس منطق الصفحة بالظبط.
     * التنبيهات بتستخدمه عشان اللي في الإيميل يبقى هو اللي في الموقع.
     */
    /**
     * آراء العملاء المعتمدة.
     *
     * مفيش fallback لـ DemoContent هنا عن قصد: باقي الكتالوج بيرجع لبيانات
     * تجريبية على التثبيت الجديد عشان الصفحة تبان، بس رأي عميل متلفّق حاجة
     * تانية خالص. القسم بيختفي وهو فاضي.
     *
     * @return list<array<string, mixed>>
     */
    public static function reviews(string $locale, int $limit = 6): array
    {
        if (! Schema::hasTable('reviews')) {
            return [];
        }

        return Review::published()
            ->orderBy('sort')
            ->orderByDesc('published_at')
            ->limit($limit)
            ->get()
            ->map(fn (Review $r) => $r->toCard($locale))
            ->all();
    }

    public static function applyFilters(Builder $query, array $filters): void
    {
        self::applyPropertyFilters($query, $filters);
    }

    /** اسم الفلتر وقيمته في جملة — للإيميل ولملخّص البحث المحفوظ */
    public static function filterLabel(string $key, string $value, string $locale): ?string
    {
        if ($value === '' || ! isset(self::FILTER_SCHEMA[$key])) {
            return null;
        }

        $en = $locale === 'en';

        $names = $en
            ? ['q' => 'Search', 'type' => 'Type', 'location' => 'Area', 'purpose' => 'Purpose',
                'category' => 'Section', 'finishing' => 'Finishing', 'developer' => 'Developer',
                'compound' => 'Project', 'sort' => 'Sort', 'price_min' => 'Price from',
                'price_max' => 'Price to', 'area_min' => 'Size from', 'area_max' => 'Size to',
                'beds' => 'Beds', 'baths' => 'Baths', 'down_max' => 'Max down',
                'monthly_max' => 'Max instalment', 'years_max' => 'Max years',
                'delivery' => 'Delivered before', 'featured' => 'Featured', 'garden' => 'Garden',
                'roof' => 'Roof', 'dressing' => 'Dressing room', 'new' => 'New launch']
            : ['q' => 'بحث', 'type' => 'النوع', 'location' => 'المنطقة', 'purpose' => 'الغرض',
                'category' => 'القسم', 'finishing' => 'التشطيب', 'developer' => 'المطوّر',
                'compound' => 'المشروع', 'sort' => 'الترتيب', 'price_min' => 'سعر من',
                'price_max' => 'سعر إلى', 'area_min' => 'مساحة من', 'area_max' => 'مساحة إلى',
                'beds' => 'غرف', 'baths' => 'حمامات', 'down_max' => 'أقصى مقدم',
                'monthly_max' => 'أقصى قسط', 'years_max' => 'أقصى سنوات',
                'delivery' => 'تسليم قبل', 'featured' => 'مميّزة', 'garden' => 'حديقة',
                'roof' => 'روف', 'dressing' => 'غرفة ملابس', 'new' => 'إطلاق جديد'];

        $shown = match (self::FILTER_SCHEMA[$key]) {
            'bool' => $en ? 'yes' : 'نعم',
            'purpose' => $value === 'rent' ? ($en ? 'Rent' : 'إيجار') : ($en ? 'Sale' : 'بيع'),
            'category' => Property::CATEGORIES[$value][$en ? 'en' : 'ar'] ?? $value,
            'finishing' => Property::FINISHING[$value][$en ? 'en' : 'ar'] ?? $value,
            'sort' => self::SORTS[$value][$en ? 'en' : 'ar'] ?? $value,
            'int' => number_format((int) $value),
            default => $value,
        };

        return $names[$key].': '.$shown;
    }

    /**
     * عدد الوحدات المطابقة لفلاتر — بنفس منطق صفحة النتايج بالظبط.
     * صفحات الهبوط بتعتمد عليها: العدد اللي الأمر بيخزّنه لازم يكون هو
     * اللي الزائر هيشوفه، وإلا الصفحة بتوعد بوحدات مش موجودة.
     */
    public static function countProperties(array $filters): int
    {
        return Property::published()
            ->tap(fn ($q) => self::applyPropertyFilters($q, $filters))
            ->count();
    }

    /** نطاق رقمي — بيتجاهل الوحدات اللي العمود ده فاضي عندها */
    private static function range($query, string $column, mixed $min, mixed $max): void
    {
        if ($from = (int) $min) {
            $query->whereNotNull($column)->where($column, '>=', $from);
        }

        if ($to = (int) $max) {
            $query->whereNotNull($column)->where($column, '<=', $to);
        }
    }

    /**
     * المميّز بيتصدّر الترتيب الافتراضي بس. لما المستخدم يختار ترتيب صريح
     * («السعر من الأقل») بيتنفّذ زي ما طلبه — وإلا الترتيب بيبان مكسور.
     */
    private static function applyPropertySort($query, string $sort): void
    {
        if ($sort === '' || $sort === 'newest') {
            $query->orderByDesc('is_featured');
        }

        match ($sort) {
            'oldest' => $query->orderBy('id'),
            // الوحدات بلا سعر تحت في الترتيب التصاعدي بدل ما تتصدّر النتايج
            'price_asc' => $query->orderByRaw('price_amount is null')->orderBy('price_amount'),
            'price_desc' => $query->orderByDesc('price_amount'),
            'area_asc' => $query->orderByRaw('size = 0')->orderBy('size'),
            'area_desc' => $query->orderByDesc('size'),
            default => $query->orderBy('sort')->orderByDesc('id'),
        };
    }

    /**
     * @param  array  $filters  q · location — نفس فورم الهيرو في تبويب "مشروع"
     */
    public static function compounds(string $locale, ?int $limit = null, array $filters = []): array
    {
        if (! Compound::query()->exists()) {
            $demo = self::withDemoSlugs(DemoContent::compounds($locale), 'compound');

            return $limit ? array_slice($demo, 0, $limit) : $demo;
        }

        $rows = Compound::query()
            ->where('is_active', true)
            ->with(['developer', 'location'])
            ->when(trim((string) ($filters['q'] ?? '')), fn ($query, $q) => $query
                ->where(fn ($s) => $s
                    ->where('name', 'like', "%{$q}%")
                    ->orWhere('name_en', 'like', "%{$q}%")
                    ->orWhereHas('developer', fn ($d) => $d->where('name', 'like', "%{$q}%"))))
            ->when(trim((string) ($filters['location'] ?? '')), fn ($query, $loc) => $query
                ->whereHas('location', fn ($s) => $s->where('name', $loc)->orWhere('name_en', $loc)->orWhere('slug', $loc)))
            ->when(trim((string) ($filters['developer'] ?? '')), fn ($query, $dev) => $query
                ->whereHas('developer', fn ($s) => $s->where('name', $dev)->orWhere('name_en', $dev)->orWhere('slug', $dev)))
            // التسليم والتقسيط نصوص معروضة («Q4 2027» / «8 سنوات»)، فالمقارنة
            // بتتعمل على أول رقم فيهم — المستخدم بيختار سنة أو عدد سنين
            ->when((int) ($filters['delivery'] ?? 0), fn ($query, $year) => $query
                ->whereNotNull('delivery')
                ->whereRaw("cast(replace(replace(delivery, 'Q', ''), ' ', '') as integer) % 10000 <= ?", [$year]))
            ->when((int) ($filters['years_max'] ?? 0), fn ($query, $years) => $query
                ->whereNotNull('installment_years')
                ->whereRaw('cast(installment_years as integer) <= ?', [$years]))
            ->when(! empty($filters['new']), fn ($query) => $query->where('is_new', true))
            ->orderBy('sort')->orderByDesc('id')
            ->when($limit, fn ($q) => $q->limit($limit))
            ->get();

        return $rows->map(fn (Compound $c) => $c->toCard($locale))->all();
    }

    /**
     * المطوّرون المعروضين في الموقع — بعدد مشاريعهم الحقيقي.
     *
     * المطوّر من غير مشاريع منشورة مش بيظهر: القسم ده بيوعد الزائر بمشاريع
     * يقدر يشوفها، وكارت بيوصّل لصفحة فاضية أسوأ من إنه مايبانش.
     */
    public static function developers(string $locale, ?int $limit = null): array
    {
        $rows = Developer::query()
            ->where('is_active', true)
            // whereHas مش having: withCount بيطلّع subquery مش aggregate،
            // و HAVING عليه بيرمي "non-aggregate query" في SQLite
            ->withCount(['compounds' => fn ($q) => $q->where('is_active', true)])
            ->whereHas('compounds', fn ($q) => $q->where('is_active', true))
            ->orderBy('sort')->orderBy('id')
            ->when($limit, fn ($q) => $q->limit($limit))
            ->get();

        return $rows->map(fn (Developer $d) => $d->toCard($locale))->all();
    }

    /** إحصاءات الهيرو — معدودة من الداتابيز مش مكتوبة بالإيد */
    public static function stats(string $locale): array
    {
        $ar = $locale !== 'en';

        $counts = [
            [Property::published()->count(), $ar ? 'عقار' : 'properties'],
            [Compound::where('is_active', true)->count(), $ar ? 'كمبوند' : 'compounds'],
            [Developer::count(), $ar ? 'مطوّر' : 'developers'],
        ];

        return collect($counts)
            ->map(fn ($c) => ['value' => (string) $c[0], 'suffix' => '', 'label' => $c[1]])
            ->all();
    }

    /** الفلاتر المسموحة من الـ query string، منضّفة حسب السكيما */
    public static function filters(Request $request): array
    {
        $out = [];

        foreach (self::FILTER_SCHEMA as $key => $kind) {
            $raw = $request->query($key);

            $out[$key] = match ($kind) {
                'int' => ($n = (int) $raw) > 0 ? $n : '',
                'bool' => in_array($raw, ['1', 'true', 'on'], true) ? '1' : '',
                'purpose' => in_array($raw, ['sale', 'rent'], true) ? $raw : '',
                'category' => in_array($raw, array_keys(Property::CATEGORIES), true) ? $raw : '',
                'finishing' => isset(Property::FINISHING[$raw]) ? $raw : '',
                'sort' => isset(self::SORTS[$raw]) ? $raw : '',
                default => Str::limit(trim((string) $raw), 80, ''),
            };
        }

        return $out;
    }

    /**
     * وحدات منطقة — المربوطة بيها مباشرة + اللي جوّه مشاريعها.
     *
     * الوحدة جوّه كمبوند بتورّث منطقته لو مش متكتبة عليها، والكارت وفلتر
     * البحث الاتنين بيعاملوها كده. لازم صفحة المنطقة وعدّادها يمشوا على
     * نفس القاعدة، وإلا الصفحة بتقول «لا توجد وحدات» واللينك اللي جنبها
     * بيرجّع نفس الوحدات.
     */
    private static function areaUnits(int $locationId): Builder
    {
        return Property::published()->where(fn ($q) => $q
            ->where('location_id', $locationId)
            ->orWhere(fn ($inner) => $inner
                ->whereNull('location_id')
                ->whereHas('compound', fn ($c) => $c->where('location_id', $locationId))));
    }

    /** بطاقات المناطق في الرئيسية — بعدد العقارات الحقيقي */
    public static function areas(string $locale, ?int $limit = 3): array
    {
        $rows = Location::query()
            ->where('is_active', true)
            ->orderBy('sort')->orderBy('id')
            ->when($limit, fn ($q) => $q->limit($limit))
            ->get();

        if ($rows->isEmpty()) {
            $demo = self::demoAreas($locale);

            return $limit ? array_slice($demo, 0, $limit) : $demo;
        }

        $ar = $locale !== 'en';

        return $rows->map(fn (Location $l) => $l->toCard($locale) + [
            'count' => self::areaUnits($l->id)->count().' '.($ar ? 'وحدة' : 'units'),
        ])->all();
    }

    /**
     * مناطق تجريبية بـ slug ورابط — الرئيسية كانت بترجّعها بدون رابط،
     * فكارت المنطقة كان بيبان وهو مش شغّال.
     */
    private static function demoAreas(string $locale): array
    {
        return array_map(function (array $row) use ($locale) {
            $slug = Str::slug((string) $row['name']) ?: 'area-'.$row['id'];

            return $row + ['slug' => $slug, 'url' => "/{$locale}/properties?location=".rawurlencode((string) $row['name'])];
        }, DemoContent::areas($locale));
    }

    /**
     * كل المطوّرين لصفحة /developers — من غير فلترة على وجود مشاريع،
     * عكس developers() اللي بتغذّي قسم الرئيسية.
     */
    public static function allDevelopers(string $locale): array
    {
        $rows = Developer::query()
            ->where('is_active', true)
            ->withCount([
                'compounds' => fn ($q) => $q->where('is_active', true),
                'properties' => fn ($q) => $q->published(),
            ])
            ->orderByDesc('compounds_count')
            ->orderBy('sort')->orderBy('id')
            ->get();

        return $rows->map(fn (Developer $d) => $d->toCard($locale) + [
            'units' => (int) $d->properties_count,
        ])->all();
    }

    /** صفحة مطوّر — بياناته + مشاريعه + وحداته + المناطق اللي بيشتغل فيها */
    public static function developer(string $locale, string $slug): ?array
    {
        $developer = Developer::query()
            ->where('is_active', true)
            ->where('slug', $slug)
            ->withCount([
                'compounds' => fn ($q) => $q->where('is_active', true),
                'properties' => fn ($q) => $q->published(),
            ])
            ->first();

        if (! $developer) {
            return null;
        }

        $compounds = Compound::query()
            ->where('is_active', true)
            ->where('developer_id', $developer->id)
            ->with(['developer', 'location'])
            ->orderBy('sort')->orderByDesc('id')
            ->get();

        // وحدات المطوّر: المربوطة بيه مباشرة + اللي جوه مشاريعه
        $units = Property::published()
            ->where(fn ($q) => $q
                ->where('developer_id', $developer->id)
                ->orWhereIn('compound_id', $compounds->pluck('id')))
            ->with('location')
            ->orderBy('sort')->orderByDesc('id')
            ->limit(6)
            ->get();

        // مواقع مشاريع المطوّر على الخريطة — المشروع بلا إحداثيات بيتشال
        $pins = $compounds
            ->filter(fn (Compound $c) => $c->latitude !== null && $c->longitude !== null)
            ->map(fn (Compound $c) => [
                'name' => $c->t('name', $locale),
                'lat' => (float) $c->latitude,
                'lng' => (float) $c->longitude,
                'url' => $c->slug ? "/{$locale}/compounds/{$c->slug}" : '',
            ])
            ->values()
            ->all();

        return [
            'developer' => $developer->toDetail($locale) + [
                'units' => $units->count(),
                'areas' => $compounds->pluck('location_id')->filter()->unique()->count(),
            ],
            'compounds' => $compounds->map(fn (Compound $c) => $c->toCard($locale))->all(),
            'units' => $units->map(fn (Property $p) => $p->toCard($locale))->all(),
            'pins' => $pins,
            'types' => self::typeCards($locale, '', '', $developer->name),
        ];
    }

    /** صفحة منطقة — نبذتها + مشاريعها + وحداتها */
    public static function area(string $locale, string $slug): ?array
    {
        $location = Location::query()
            ->where('is_active', true)
            ->where('slug', $slug)
            ->withCount(['compounds' => fn ($q) => $q->where('is_active', true)])
            ->first();

        if (! $location) {
            return null;
        }

        $compounds = Compound::query()
            ->where('is_active', true)
            ->where('location_id', $location->id)
            ->with(['developer', 'location'])
            ->orderBy('sort')->orderByDesc('id')
            ->get();

        $units = self::areaUnits($location->id);

        $properties = (clone $units)
            ->with(['location', 'developer', 'compound.developer', 'compound.location'])
            ->orderBy('sort')->orderByDesc('id')
            ->limit(9)
            ->get();

        // المطوّرون الشغّالين في المنطقة — بكروتهم مش بعددهم بس،
        // عشان الرقم اللي في الهيرو يبقى وراه صفحة يتصفّحها الزائر
        $developers = Developer::query()
            ->where('is_active', true)
            ->whereIn('id', $compounds->pluck('developer_id')->filter()->unique())
            ->withCount(['compounds' => fn ($q) => $q->where('is_active', true)->where('location_id', $location->id)])
            ->orderBy('sort')->orderBy('id')
            ->get();

        return [
            'area' => $location->toDetail($locale) + [
                'properties' => (clone $units)->count(),
                'compounds' => (int) $location->compounds_count,
                'developers' => $developers->count(),
            ],
            'compounds' => $compounds->map(fn (Compound $c) => $c->toCard($locale))->all(),
            'properties' => $properties->map(fn (Property $p) => $p->toCard($locale))->all(),
            'developers' => $developers->map(fn (Developer $d) => $d->toCard($locale))->all(),
            'types' => self::typeCards($locale, '', $location->name),
        ];
    }

    /** كل المناطق المفعّلة للصفحة المخصّصة لها */
    public static function allAreas(string $locale): array
    {
        $rows = Location::query()
            ->where('is_active', true)
            ->withCount(['compounds' => fn ($q) => $q->where('is_active', true)])
            ->orderByDesc('is_featured')
            ->orderBy('sort')->orderBy('id')
            ->get();

        if ($rows->isEmpty()) {
            // الرئيسية بترجع لمناطق تجريبية، فلو الصفحة دي رجّعت فاضي
            // يبقى الموقع بيعرض مناطق ولينكاتها بتوديّ لصفحة بتقول مفيش
            return self::demoAreas($locale);
        }

        $ar = $locale !== 'en';

        return $rows->map(function (Location $l) use ($locale, $ar) {
            $units = self::areaUnits($l->id)->count();

            return $l->toCard($locale) + [
                'count' => $units.' '.($ar ? 'وحدة' : 'units'),
                'compounds' => (int) $l->compounds_count,
                'properties' => $units,
            ];
        })->all();
    }

    /**
     * «شوهدت مؤخرًا» للحساب المسجّل — بترجع فاضية للزائر،
     * وساعتها المتصفح بيجيبها من localStorage عبر /recently-viewed.
     */
    public static function recentlyViewed(string $locale, int $limit = 8): array
    {
        $user = auth()->user();

        if (! $user) {
            return [];
        }

        $ids = DB::table('recently_viewed')
            ->where('user_id', $user->id)
            ->orderByDesc('viewed_at')
            ->limit($limit)
            ->pluck('property_id');

        if ($ids->isEmpty()) {
            return [];
        }

        $rows = Property::published()
            ->whereIn('id', $ids)
            ->with(['location', 'compound.developer', 'compound.location', 'developer'])
            ->get()
            ->sortBy(fn (Property $p) => $ids->search($p->id));

        return $rows->map(fn (Property $p) => $p->toCard($locale))->values()->all();
    }

    /** مقالات المدونة المنشورة */
    public static function posts(string $locale, ?int $limit = null): array
    {
        $rows = Post::published()
            ->orderBy('sort')
            ->orderByDesc('published_at')
            ->orderByDesc('id')
            ->when($limit, fn ($q) => $q->limit($limit))
            ->get();

        return $rows->map(fn (Post $p) => $p->toCard($locale))->all();
    }

    /** مقال واحد بالرابط — null لو مش موجود أو مش منشور */
    public static function post(string $locale, string $slug): ?array
    {
        return Post::published()->where('slug', $slug)->first()?->toArticle($locale);
    }

    /** عقار واحد بالرابط — null لو مش موجود أو متوقّف */
    public static function property(string $locale, string $slug): ?array
    {
        if (! Property::query()->exists()) {
            $demo = self::withDemoSlugs(DemoContent::properties($locale), 'property');
            $hit = collect($demo)->firstWhere('slug', $slug);

            return $hit ? $hit + ['description' => '', 'features' => [], 'gallery' => [$hit['image']], 'compound' => null] : null;
        }

        return Property::published()
            ->where('slug', $slug)
            ->with(['location', 'developer', 'compound.developer', 'compound.location'])
            ->first()
            ?->toDetail($locale);
    }

    /** كمبوند واحد بالرابط — null لو مش موجود أو متوقّف */
    public static function compound(string $locale, string $slug): ?array
    {
        if (! Compound::query()->exists()) {
            $demo = self::withDemoSlugs(DemoContent::compounds($locale), 'compound');
            $hit = collect($demo)->firstWhere('slug', $slug);

            return $hit ? $hit + [
                'features' => [], 'gallery' => [$hit['image']], 'faqs' => [],
                'masterPlan' => '', 'brochure' => '', 'lat' => null, 'lng' => null,
                'resale' => '', 'units' => 0, 'developerSlug' => '', 'developerLogo' => '', 'areaSlug' => '',
                'developerId' => null, 'locationId' => null,
            ] : null;
        }

        $compound = Compound::query()
            ->where('is_active', true)
            ->where('slug', $slug)
            ->with(['developer', 'location'])
            ->first();

        if (! $compound) {
            return null;
        }

        // الـ id بيمشي مع الـ payload عشان أقسام «مشروعات نفس المطوّر»
        // و«كمبوندات قريبة» تدوّر بالمفتاح مش بالاسم
        return $compound->toDetail($locale) + [
            'developerId' => $compound->developer_id,
            'locationId' => $compound->location_id,
        ];
    }

    /** عقارات شبه المعروض — نفس المنطقة أو نفس النوع */
    public static function relatedProperties(string $locale, array $property, int $limit = 3): array
    {
        if (! Property::query()->exists()) {
            return [];
        }

        $rows = Property::published()
            ->where('id', '!=', $property['id'])
            ->with(['location', 'developer', 'compound.developer', 'compound.location'])
            ->where(fn ($q) => $q
                ->whereHas('location', fn ($l) => $l->where('name', $property['area'])->orWhere('name_en', $property['area']))
                ->when($property['type'] ?? '', fn ($s, $type) => $s->orWhere('type', $type)))
            ->orderBy('sort')->orderByDesc('id')
            ->limit($limit)
            ->get();

        return $rows->map(fn (Property $p) => $p->toCard($locale))->all();
    }

    /**
     * الوحدات المتاحة جوّه كمبوند — بتقبل نفس فلاتر صفحة العقارات
     * عشان «استكشف العقارات في المشروع» يشتغل بنفس منطق البحث العام.
     */
    public static function compoundUnits(string $locale, int $compoundId, ?int $limit = null, array $filters = []): array
    {
        $rows = Property::published()
            ->where('compound_id', $compoundId)
            ->with(['location', 'developer', 'compound.developer', 'compound.location'])
            // الكمبوند متحدّد بالفعل، فأي فلتر مشروع من الرابط بيتشال
            ->tap(fn ($q) => self::applyPropertyFilters($q, ['compound' => ''] + $filters))
            ->tap(fn ($q) => self::applyPropertySort($q, (string) ($filters['sort'] ?? '')))
            ->when($limit, fn ($q) => $q->limit($limit))
            ->get();

        return $rows->map(fn (Property $p) => $p->toCard($locale))->all();
    }

    /**
     * كروت «تصفّح حسب النوع» — كل نوع بعدد وحداته الحقيقي ورابط لصفحة
     * الهبوط بتاعته. الأنواع اللي مالهاش وحدة مبتظهرش: الكارت بيوعد
     * بنتايج، فالكارت الفاضي أسوأ من غيابه.
     *
     * @param  string  $purpose  sale · rent · '' للاتنين
     * @param  string  $location  اسم المنطقة لو الكروت جوّه صفحة منطقة
     * @param  string  $developer  اسم المطوّر لو الكروت جوّه صفحة مطوّر
     * @return list<array<string, mixed>>
     */
    public static function typeCards(string $locale, string $purpose = '', string $location = '', string $developer = ''): array
    {
        $en = $locale === 'en';
        $out = [];

        // على تثبيت جديد بنعدّ من نفس الوحدات التجريبية اللي الصفحات
        // بتعرضها، عشان الرقم على الكارت يطابق النتايج ورا اللينك
        $demo = Property::query()->exists()
            ? null
            : self::withDemoSlugs(DemoContent::properties($locale), 'property');

        foreach (Property::TYPE_PLURALS as $type => $plural) {
            $filters = array_filter([
                'type' => $type,
                'purpose' => in_array($purpose, ['sale', 'rent'], true) ? $purpose : '',
                'location' => $location,
                'developer' => $developer,
            ]);

            $count = $demo === null
                ? self::countProperties($filters)
                : count(self::filterDemoProperties($demo, $filters));

            if ($count === 0) {
                continue;
            }

            $query = array_filter([
                'type' => $type,
                'purpose' => $filters['purpose'] ?? '',
                'location' => $location,
                'developer' => $developer,
            ]);

            $out[] = [
                'key' => $plural['slug'],
                'type' => $type,
                'label' => $plural[$en ? 'en' : 'ar'],
                'count' => $count,
                'category' => in_array($type, Property::COMMERCIAL_TYPES, true) ? 'commercial' : 'residential',
                'url' => "/{$locale}/properties?".http_build_query($query),
            ];
        }

        usort($out, fn ($a, $b) => $b['count'] <=> $a['count']);

        return $out;
    }

    /**
     * أعمدة روابط الفوتر: شراء · إيجار · المناطق · المطوّرون · الكمبوندات ·
     * الأكثر بحثًا.
     *
     * ده اللي بيوصّل لصفحات الهبوط البرمجية وصفحات المناطق والمطوّرين —
     * من غيره الصفحات دي بتفضل في السايت ماب ومفيش لينك داخلي بيوديها.
     *
     * متكاش لدقيقة: بيترندر في كل صفحة، والمحتوى ده مش بيتغيّر كل ثانية.
     *
     * @return list<array{title: string, links: list<array{label: string, url: string}>}>
     */
    public static function footerLinks(string $locale): array
    {
        return Cache::remember("footer.links.{$locale}", now()->addHour(), function () use ($locale) {
            $en = $locale === 'en';

            $typeGroup = fn (string $purpose, string $title) => [
                'title' => $title,
                'links' => array_map(
                    fn (array $t) => ['label' => $t['label'], 'url' => $t['url']],
                    array_slice(self::typeCards($locale, $purpose), 0, 8),
                ),
            ];

            $groups = [
                $typeGroup('sale', $en ? 'Buy property' : 'شراء عقارات'),
                $typeGroup('rent', $en ? 'Rent property' : 'إيجار عقارات'),
                [
                    'title' => $en ? 'Areas' : 'المناطق',
                    'links' => array_map(
                        fn (array $a) => ['label' => $a['name'], 'url' => $a['url']],
                        array_slice(self::allAreas($locale), 0, 8),
                    ),
                ],
                [
                    'title' => $en ? 'Developers' : 'المطوّرون',
                    'links' => array_map(
                        fn (array $d) => ['label' => $d['name'], 'url' => $d['url']],
                        array_slice(self::developers($locale, 8), 0, 8),
                    ),
                ],
                [
                    'title' => $en ? 'Compounds' : 'الكمبوندات',
                    'links' => array_map(
                        fn (array $c) => [
                            'label' => $c['name'],
                            'url' => $c['slug'] ? "/{$locale}/compounds/{$c['slug']}" : "/{$locale}/compounds",
                        ],
                        array_slice(self::compounds($locale, 8), 0, 8),
                    ),
                ],
                self::popularSearches($locale),
            ];

            // العمود الفاضي بيتشال — عنوان بلا روابط تحته بيبان مكسور
            return array_values(array_filter($groups, fn (array $g) => $g['links'] !== []));
        });
    }

    /** «الأكثر بحثًا» — من صفحات الهبوط المنشورة، وإلا من الأنواع */
    private static function popularSearches(string $locale): array
    {
        $title = $locale === 'en' ? 'Most searched' : 'الأكثر بحثًا';

        if (! Schema::hasTable('seo_landing_pages')) {
            return ['title' => $title, 'links' => []];
        }

        $rows = LandingPage::query()
            ->where('is_active', true)
            ->orderByDesc('units_count')
            ->limit(8)
            ->get();

        return [
            'title' => $title,
            'links' => $rows->map(fn (LandingPage $p) => [
                'label' => $p->heading($locale),
                'url' => "/{$locale}/properties/{$p->slug}",
            ])->all(),
        ];
    }

    /** مشروعات تانية لنفس المطوّر — من غير المشروع المفتوح */
    public static function developerCompounds(string $locale, ?int $developerId, int $exceptId, int $limit = 6): array
    {
        if (! $developerId) {
            return [];
        }

        return Compound::query()
            ->where('is_active', true)
            ->where('developer_id', $developerId)
            ->whereKeyNot($exceptId)
            ->with(['developer', 'location'])
            ->orderBy('sort')->orderByDesc('id')
            ->limit($limit)
            ->get()
            ->map(fn (Compound $c) => $c->toCard($locale))
            ->all();
    }

    /** كمبوندات في نفس المنطقة — «كمبوندات قريبة من ...» */
    public static function nearbyCompounds(string $locale, ?int $locationId, int $exceptId, int $limit = 6): array
    {
        if (! $locationId) {
            return [];
        }

        return Compound::query()
            ->where('is_active', true)
            ->where('location_id', $locationId)
            ->whereKeyNot($exceptId)
            ->with(['developer', 'location'])
            ->orderBy('sort')->orderByDesc('id')
            ->limit($limit)
            ->get()
            ->map(fn (Compound $c) => $c->toCard($locale))
            ->all();
    }

    /**
     * بيانات DemoContent مالهاش slug — بنولّده هنا عشان كروت التثبيت الجديد
     * (قبل الـ seed) تفضل تفتح صفحة تفاصيل. ثابت مع اختلاف اللغة.
     *
     * وبنكمّل كمان المفاتيح اللي toCard() بيوعد بيها (النوع والقسم والسعر
     * الرقمي)، عشان الكارت التجريبي يبقى نفس شكل الكارت الحقيقي بالظبط
     * ويقدر يتفلتر بنفس الفلاتر.
     */
    private static function withDemoSlugs(array $rows, string $kind): array
    {
        return array_map(function (array $row) use ($kind) {
            $row['slug'] = $kind === 'property'
                ? Str::slug((string) ($row['ref'] ?? ''))
                : $kind.'-'.$row['id'];

            if ($kind !== 'property') {
                $row['type'] ??= '';

                return $row;
            }

            $type = self::demoType((string) ($row['title'] ?? ''));

            return $row + [
                'type' => $type,
                'category' => in_array($type, Property::COMMERCIAL_TYPES, true) ? 'commercial' : 'residential',
                'priceAmount' => (int) preg_replace('/\D/', '', (string) ($row['price'] ?? '')),
                'featured' => false,
                'finishing' => '',
                'developer' => '',
            ];
        }, $rows);
    }

    /** نوع الوحدة التجريبية من عنوانها — نفس منطق CatalogSeeder::guessType */
    private static function demoType(string $title): string
    {
        foreach (array_keys(Property::TYPES) as $type) {
            if (str_contains($title, $type)) {
                return $type;
            }
        }

        return '';
    }

    /**
     * فلترة الوحدات التجريبية بنفس منطق الاستعلام الحقيقي.
     *
     * من غيرها /properties/commercial على تثبيت جديد كان بيعرض الوحدات
     * السكنية تحت عنوان «عقارات تجارية» — الصفحة بتكدب على الزائر.
     */
    private static function filterDemoProperties(array $rows, array $filters): array
    {
        $category = $filters['category'] ?? '';
        $purpose = $filters['purpose'] ?? '';
        $type = trim((string) ($filters['type'] ?? ''));
        $q = trim((string) ($filters['q'] ?? ''));
        $location = trim((string) ($filters['location'] ?? ''));
        $developer = trim((string) ($filters['developer'] ?? ''));

        // الفلتر جاي بالعربي أو بالإنجليزي، والمخزّن عربي دايمًا
        if ($type !== '' && ! isset(Property::TYPES[$type])) {
            $type = array_flip(Property::TYPES)[$type] ?? $type;
        }

        $rows = array_values(array_filter($rows, function (array $row) use ($category, $purpose, $type, $q, $location, $developer, $filters) {
            if ($category !== '' && ($row['category'] ?? '') !== $category) {
                return false;
            }

            // الغرض متخزّن في الديمو كنص معروض («بيع» / «Rent») مش كمفتاح
            if ($purpose !== '') {
                $label = (string) ($row['purpose'] ?? '');
                $isRent = $label === 'إيجار' || strcasecmp($label, 'Rent') === 0;

                if (($purpose === 'rent') !== $isRent) {
                    return false;
                }
            }

            if ($type !== '' && ($row['type'] ?? '') !== $type) {
                return false;
            }

            if ($location !== '' && ($row['area'] ?? '') !== $location) {
                return false;
            }

            if ($developer !== '' && ($row['developer'] ?? '') !== $developer) {
                return false;
            }

            if ($q !== '' && ! Str::contains((string) ($row['title'] ?? '').' '.($row['area'] ?? '').' '.($row['ref'] ?? ''), $q, true)) {
                return false;
            }

            foreach ([['price_min', 'price_max', 'priceAmount'], ['area_min', 'area_max', 'size']] as [$minKey, $maxKey, $column]) {
                $value = (int) ($row[$column] ?? 0);

                if ((($min = (int) ($filters[$minKey] ?? 0)) && $value < $min)
                    || (($max = (int) ($filters[$maxKey] ?? 0)) && $value > $max)) {
                    return false;
                }
            }

            foreach (['beds', 'baths'] as $column) {
                if (($min = (int) ($filters[$column] ?? 0)) && (int) ($row[$column] ?? 0) < $min) {
                    return false;
                }
            }

            return true;
        }));

        return self::sortDemoProperties($rows, (string) ($filters['sort'] ?? ''));
    }

    /** ترتيب الوحدات التجريبية — نفس مفاتيح SORTS */
    private static function sortDemoProperties(array $rows, string $sort): array
    {
        $by = fn (string $column, bool $desc) => function (array $a, array $b) use ($column, $desc) {
            $diff = ((int) ($a[$column] ?? 0)) <=> ((int) ($b[$column] ?? 0));

            return $desc ? -$diff : $diff;
        };

        match ($sort) {
            'oldest' => usort($rows, $by('id', false)),
            'price_asc' => usort($rows, $by('priceAmount', false)),
            'price_desc' => usort($rows, $by('priceAmount', true)),
            'area_asc' => usort($rows, $by('size', false)),
            'area_desc' => usort($rows, $by('size', true)),
            default => null,
        };

        return $rows;
    }

    /** خيارات البحث في الهيرو — الأنواع ثابتة والمناطق من الجدول */
    public static function searchOptions(string $locale): array
    {
        $base = DemoContent::searchOptions($locale);

        // الأنواع من نفس ثابت الموديل — لازم القيمة تطابق اللي متخزّن
        $base['types'] = $locale === 'en'
            ? array_values(Property::TYPES)
            : array_keys(Property::TYPES);

        // الأرقام دي كانت ثابتة في الكود (6000 عقار · 420 كمبوند · 161 مطوّر)
        // وهي ادعاءات مش صحيحة. بقت محسوبة من الجداول — بتكبر لوحدها
        // وبتفضل صح مهما اتغيّر المحتوى.
        $base['stats'] = self::stats($locale);

        $locations = Location::where('is_active', true)->orderBy('sort')->orderBy('id')->get();

        if ($locations->isNotEmpty()) {
            $base['locations'] = $locations->map(fn (Location $l) => $l->t('name', $locale))->all();
        }

        // خيارات لوحة الفلاتر المتقدمة
        $en = $locale === 'en';

        $base['finishing'] = collect(Property::FINISHING)
            ->map(fn ($labels, $key) => ['value' => $key, 'label' => $labels[$en ? 'en' : 'ar']])
            ->values()->all();

        $base['sorts'] = collect(self::SORTS)
            ->map(fn ($labels, $key) => ['value' => $key, 'label' => $labels[$en ? 'en' : 'ar']])
            ->values()->all();

        $base['developers'] = Developer::where('is_active', true)
            ->orderBy('sort')->orderBy('id')->get()
            ->map(fn (Developer $d) => ['value' => $d->name, 'label' => $d->t('name', $locale)])
            ->all();

        $base['compounds'] = Compound::where('is_active', true)
            ->orderBy('sort')->orderBy('id')->get()
            ->map(fn (Compound $c) => ['value' => $c->name, 'label' => $c->t('name', $locale)])
            ->all();

        // حدود المنزلقات — من المعروض فعلًا مش أرقام مكتوبة بالإيد
        $bounds = Property::published()->selectRaw(
            'min(price_amount) as price_min, max(price_amount) as price_max, min(nullif(size, 0)) as area_min, max(size) as area_max'
        )->first();

        $base['bounds'] = [
            'priceMin' => (int) ($bounds->price_min ?? 0),
            'priceMax' => (int) ($bounds->price_max ?? 0),
            'areaMin' => (int) ($bounds->area_min ?? 0),
            'areaMax' => (int) ($bounds->area_max ?? 0),
        ];

        return $base;
    }
}
