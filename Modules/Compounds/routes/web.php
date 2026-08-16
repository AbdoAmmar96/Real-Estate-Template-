<?php

use Illuminate\Support\Facades\Route;
use Modules\Compounds\Http\Controllers\CompoundsController;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('compounds', CompoundsController::class)->names('compounds');
});
