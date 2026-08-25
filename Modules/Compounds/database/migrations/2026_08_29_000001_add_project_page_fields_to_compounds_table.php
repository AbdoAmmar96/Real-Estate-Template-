<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('compounds', function (Blueprint $table) {
            // سعر الريسيل معروض جنب سعر المطوّر — نص زي starting_price
            // عشان يستحمل «يبدأ من ...» بصيغة العرض اللي الأدمن بيكتبها
            $table->string('resale_price')->nullable()->after('starting_price');
            $table->string('master_plan_image')->nullable()->after('image');
            $table->string('brochure_path')->nullable()->after('master_plan_image');
            $table->decimal('latitude', 10, 7)->nullable()->after('brochure_path');
            $table->decimal('longitude', 10, 7)->nullable()->after('latitude');
            // سطر لكل سؤال بصيغة «السؤال | الإجابة» — نفس نمط features
            $table->text('faqs')->nullable()->after('features_en');
            $table->text('faqs_en')->nullable()->after('faqs');
        });
    }

    public function down(): void
    {
        Schema::table('compounds', function (Blueprint $table) {
            $table->dropColumn([
                'resale_price', 'master_plan_image', 'brochure_path',
                'latitude', 'longitude', 'faqs', 'faqs_en',
            ]);
        });
    }
};
