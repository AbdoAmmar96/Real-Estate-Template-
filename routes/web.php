<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// الجذر → العربية (اللغة الافتراضية)
Route::redirect('/', '/ar');

// كل صفحات الموقع العام تحت بادئة اللغة: /ar/... و /en/...
Route::prefix('{locale}')
    ->whereIn('locale', ['ar', 'en'])
    ->middleware('locale')
    ->group(function () {

        Route::get('/', fn (string $locale) => Inertia::render('Site/Home', [
            'latestProperties' => \App\Support\Catalog::properties($locale, 6),
            'latestCompounds'  => \App\Support\Catalog::compounds($locale, 3),
            'areas'            => \App\Support\Catalog::areas($locale, 3),
            'searchOptions'    => \App\Support\Catalog::searchOptions($locale),
        ]))->name('home');

        Route::get('/properties', fn (string $locale) => Inertia::render('Site/Properties', [
            'properties' => \App\Support\Catalog::properties($locale),
        ]))->name('properties');

        Route::get('/compounds', fn (string $locale) => Inertia::render('Site/Compounds', [
            'compounds' => \App\Support\Catalog::compounds($locale),
        ]))->name('compounds');

        Route::get('/about', fn (string $locale) => Inertia::render('Site/About', [
            'milestones' => \App\Support\DemoContent::milestones($locale),
            'team'       => \App\Support\DemoContent::team($locale),
        ]))->name('about');

        Route::get('/contact', fn (string $locale) => Inertia::render('Site/Contact', [
            'options' => \App\Support\DemoContent::contactOptions($locale),
        ]))->name('contact');

        Route::get('/blog', fn (string $locale) => Inertia::render('Site/Blog', [
            'posts' => \App\Support\Catalog::posts($locale),
        ]))->name('blog');

        Route::get('/blog/{slug}', function (string $locale, string $slug) {
            $post = \App\Support\Catalog::post($locale, $slug);

            abort_if(! $post, 404);

            $more = array_filter(
                \App\Support\Catalog::posts($locale, 4),
                fn ($p) => $p['slug'] !== $slug,
            );

            return Inertia::render('Site/Post', [
                'post' => $post,
                'more' => array_slice(array_values($more), 0, 3),
            ]);
        })->name('blog.show');

        // استقبال طلبات فورم "اتصل بنا" → موديول Leads
        Route::post('/leads', [\Modules\Leads\Http\Controllers\LeadController::class, 'store'])
            ->name('leads.store');


    });
