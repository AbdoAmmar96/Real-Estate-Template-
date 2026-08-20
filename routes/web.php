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

        // ← في المرحلة 4 بيانات العقارات والكمبوندات بتتبدل من DemoContent
        //   لموديلات Properties/Compounds الحقيقية بنفس الـ props بالظبط.

    });
