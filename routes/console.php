<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

/*
 |----------------------------------------------------------------------
 | الجدولة
 |----------------------------------------------------------------------
 */

// تنبيهات البحث المحفوظ — مرة في اليوم الصبح.
// التوقيت بتوقيت القاهرة عشان الرسالة توصل في وقت معقول للعميل.
Schedule::command('searches:alert')->dailyAt('09:00')->timezone('Africa/Cairo');

// صفحات الهبوط البرمجية بتتحدّث أعدادها وبتقفل اللي وحداته خلصت
Schedule::command('seo:landing-pages')->weeklyOn(1, '03:00')->timezone('Africa/Cairo');
