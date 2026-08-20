<?php

namespace App\Support;

use Modules\Blog\Models\Post;
use Modules\Compounds\Models\Compound;
use Modules\Locations\Models\Location;
use Modules\Properties\Models\Property;

/**
 * مصدر بيانات الموقع العام — بيقرا من الجداول الحقيقية.
 * لو الجداول لسه فاضية (تثبيت جديد قبل الـ seed) بيرجع لـ DemoContent
 * عشان الموقع ميطلعش فاضي.
 */
class Catalog
{
    public static function properties(string $locale, ?int $limit = null): array
    {
        $rows = Property::query()
            ->where('is_active', true)
            ->with('location')
            ->orderBy('sort')->orderByDesc('id')
            ->when($limit, fn ($q) => $q->limit($limit))
            ->get();

        if ($rows->isEmpty()) {
            $demo = DemoContent::properties($locale);

            return $limit ? array_slice($demo, 0, $limit) : $demo;
        }

        return $rows->map(fn (Property $p) => $p->toCard($locale))->all();
    }

    public static function compounds(string $locale, ?int $limit = null): array
    {
        $rows = Compound::query()
            ->where('is_active', true)
            ->with(['developer', 'location'])
            ->orderBy('sort')->orderByDesc('id')
            ->when($limit, fn ($q) => $q->limit($limit))
            ->get();

        if ($rows->isEmpty()) {
            $demo = DemoContent::compounds($locale);

            return $limit ? array_slice($demo, 0, $limit) : $demo;
        }

        return $rows->map(fn (Compound $c) => $c->toCard($locale))->all();
    }

    /** بطاقات المناطق في الرئيسية — بعدد العقارات الحقيقي */
    public static function areas(string $locale, ?int $limit = 3): array
    {
        $rows = Location::query()
            ->where('is_active', true)
            ->withCount(['properties' => fn ($q) => $q->where('is_active', true)])
            ->orderBy('sort')->orderBy('id')
            ->when($limit, fn ($q) => $q->limit($limit))
            ->get();

        if ($rows->isEmpty()) {
            $demo = DemoContent::areas($locale);

            return $limit ? array_slice($demo, 0, $limit) : $demo;
        }

        $ar = $locale !== 'en';

        return $rows->map(fn (Location $l) => $l->toCard($locale) + [
            'count' => $l->properties_count.' '.($ar ? 'وحدة' : 'units'),
        ])->all();
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

    /** خيارات البحث في الهيرو — الأنواع ثابتة والمناطق من الجدول */
    public static function searchOptions(string $locale): array
    {
        $base = DemoContent::searchOptions($locale);

        $locations = Location::where('is_active', true)->orderBy('sort')->orderBy('id')->get();

        if ($locations->isNotEmpty()) {
            $base['locations'] = $locations->map(fn (Location $l) => $l->t('name', $locale))->all();
        }

        return $base;
    }
}
