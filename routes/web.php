<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EstateController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PushNotificationController;
use App\Http\Controllers\TenantController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::resource('estates', EstateController::class);

    Route::resource('estates.tenants', TenantController::class);
    Route::post('estates/{estate}/tenants/{tenant}/remind', [TenantController::class, 'sendReminder'])
        ->name('estates.tenants.remind');
    Route::post('estates/{estate}/tenants/remind-all', [TenantController::class, 'sendBulkReminders'])
        ->name('estates.tenants.remindAll');

    Route::get('estates/{estate}/payments', [PaymentController::class, 'index'])
        ->name('estates.payments.index');
    Route::get('estates/{estate}/payments/create/{tenant?}', [PaymentController::class, 'create'])
        ->name('estates.payments.create');
    Route::post('estates/{estate}/payments', [PaymentController::class, 'store'])
        ->name('estates.payments.store');
    Route::get('estates/{estate}/payments/{payment}', [PaymentController::class, 'show'])
        ->name('estates.payments.show');
    Route::patch('estates/{estate}/payments/{payment}/pay', [PaymentController::class, 'markPaid'])
        ->name('estates.payments.markPaid');
    Route::post('estates/{estate}/payments/generate', [PaymentController::class, 'generatePeriodPayments'])
        ->name('estates.payments.generate');
    Route::delete('estates/{estate}/payments/{payment}', [PaymentController::class, 'destroy'])
        ->name('estates.payments.destroy');

    Route::post('/push/subscribe', [PushNotificationController::class, 'subscribe'])
        ->name('push.subscribe');
    Route::post('/push/unsubscribe', [PushNotificationController::class, 'unsubscribe'])
        ->name('push.unsubscribe');
    Route::get('/push/vapid-public-key', [PushNotificationController::class, 'vapidPublicKey'])
        ->name('push.vapidPublicKey');
});

Route::get('/sw.js', function () {
    return response()
        ->header('Content-Type', 'application/javascript')
        ->header('Cache-Control', 'no-cache')
        ->file(resource_path('js/sw.js'));
});

require __DIR__.'/auth.php';
