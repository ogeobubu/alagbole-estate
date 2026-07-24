<?php

use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\UserController;
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
    Route::post('estates/{estate}/payments/paystack', [PaymentController::class, 'initializePaystack'])
        ->name('estates.payments.paystack');
    Route::delete('estates/{estate}/payments/{payment}', [PaymentController::class, 'destroy'])
        ->name('estates.payments.destroy');

    Route::post('/push/subscribe', [PushNotificationController::class, 'subscribe'])
        ->name('push.subscribe');
    Route::post('/push/unsubscribe', [PushNotificationController::class, 'unsubscribe'])
        ->name('push.unsubscribe');
Route::get('/push/vapid-public-key', [PushNotificationController::class, 'vapidPublicKey'])
        ->name('push.vapidPublicKey');
});

Route::prefix('admin')
    ->name('admin.')
    ->middleware(['auth', 'verified', 'admin'])
    ->group(function () {
        Route::get('/', [AdminDashboardController::class, 'index'])->name('dashboard');
        Route::resource('users', UserController::class);
        Route::resource('roles', RoleController::class);
    });

Route::get('/sw.js', function () {
    return response()
        ->header('Content-Type', 'application/javascript')
        ->header('Cache-Control', 'no-cache')
        ->file(resource_path('js/sw.js'));
});

Route::get('/payments/paystack/callback', [PaymentController::class, 'paystackCallback'])
    ->name('payments.paystack.callback');

Route::post('/webhooks/paystack', [PaymentController::class, 'paystackWebhook'])
    ->name('payments.paystack.webhook');

Route::get('/deploy', function () {
    if (!app()->environment('production')) {
        return response('Not available', 403)->header('Content-Type', 'text/plain');
    }
    $output = [];
    $output[] = 'Environment: ' . app()->environment();
    $output[] = 'APP_KEY set: ' . (config('app.key') ? 'Yes' : 'No');
    $output[] = 'PHP version: ' . phpversion();

    try {
        \Illuminate\Support\Facades\DB::connection()->getPdo();
        $output[] = 'Database: Connected';
    } catch (\Throwable $e) {
        $output[] = 'Database: ' . $e->getMessage();
        return response(implode("\n", $output), 500)->header('Content-Type', 'text/plain');
    }

    try {
        \Illuminate\Support\Facades\Artisan::call('migrate', ['--force' => true]);
        $output[] = 'Migration: ' . \Illuminate\Support\Facades\Artisan::output();
    } catch (\Throwable $e) {
        $output[] = 'Migration error: ' . $e->getMessage();
    }

    try {
        \Illuminate\Support\Facades\Artisan::call('db:seed', ['--force' => true]);
        $output[] = 'Seed: ' . \Illuminate\Support\Facades\Artisan::output();
    } catch (\Throwable $e) {
        $output[] = 'Seed error: ' . $e->getMessage();
    }

    return response(implode("\n", $output), 200)->header('Content-Type', 'text/plain');
});

require __DIR__.'/auth.php';
