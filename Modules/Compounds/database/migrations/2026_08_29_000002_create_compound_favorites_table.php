<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('compound_favorites', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('compound_id')->constrained()->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['user_id', 'compound_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('compound_favorites');
    }
};
