<?php

use Illuminate\Support\Facades\Route;
use Modules\Developers\Http\Controllers\DevelopersController;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('developers', DevelopersController::class)->names('developers');
});
