<?php

use Illuminate\Support\Facades\Route;
use Modules\Properties\Http\Controllers\PropertiesController;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('properties', PropertiesController::class)->names('properties');
});
