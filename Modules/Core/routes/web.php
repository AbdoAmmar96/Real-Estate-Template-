<?php

use Illuminate\Support\Facades\Route;
use Modules\Core\Http\Controllers\AuthController;
use Modules\Core\Http\Controllers\DashboardController;
use Modules\Core\Http\Controllers\SettingsController;
use Modules\Core\Http\Controllers\UserAdminController;

/*
 |----------------------------------------------------------------------
 | Core Module — Admin Routes
 | (الملف ده بيتحمّل جوه مجموعة web من RouteServiceProvider بتاع الموديول)
 |----------------------------------------------------------------------
 */

Route::prefix('admin')->name('admin.')->group(function () {

    // ضيوف: تسجيل الدخول
    Route::middleware('guest')->group(function () {
        Route::get('login', [AuthController::class, 'create'])->name('login');
        Route::post('login', [AuthController::class, 'store'])->name('login.store');
    });

    // مسجّلين بدور admin
    Route::middleware(['auth', 'role:admin'])->group(function () {
        Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

        Route::get('settings/{group}', [SettingsController::class, 'edit'])->name('settings.edit');
        Route::put('settings/{group}', [SettingsController::class, 'update'])->name('settings.update');

        // إدارة مستخدمي اللوحة (إضافة/حذف حساب وتغيير كلمة المرور والدور)
        Route::get('users',           [UserAdminController::class, 'index'])->name('users.index');
        Route::get('users/create',    [UserAdminController::class, 'create'])->name('users.create');
        Route::post('users',          [UserAdminController::class, 'store'])->name('users.store');
        Route::get('users/{id}/edit', [UserAdminController::class, 'edit'])->name('users.edit');
        Route::put('users/{id}',      [UserAdminController::class, 'update'])->name('users.update');
        Route::delete('users/{id}',   [UserAdminController::class, 'destroy'])->name('users.destroy');

        Route::post('logout', [AuthController::class, 'destroy'])->name('logout');
    });
});
