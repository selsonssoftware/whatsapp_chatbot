<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RegistrationController;
use App\Http\Controllers\SuperAdminAuthController;
use App\Http\Controllers\SuperAdminController;
use App\Support\Role;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/register', [RegistrationController::class, 'register']);

/*
|--------------------------------------------------------------------------
| Super Admin API
|--------------------------------------------------------------------------
|
| The Super Admin area is served as a session based SPA: the browser keeps
| the Laravel session cookie, every write is protected by the CSRF token and
| every route below re-checks the role against the database record.
|
*/
Route::prefix('super-admin')->name('api.super-admin.')->group(function () {
    Route::middleware('web')->group(function () {
        Route::get('csrf-cookie', [SuperAdminAuthController::class, 'csrfCookie'])
            ->name('csrf-cookie');

        Route::post('login', [SuperAdminAuthController::class, 'login'])
            ->middleware('throttle:10,1')
            ->name('login');

        Route::post('logout', [SuperAdminAuthController::class, 'logout'])
            ->middleware('auth:sanctum')
            ->name('logout');

        Route::get('me', [SuperAdminAuthController::class, 'me'])
            ->middleware(['auth:sanctum', 'active'])
            ->name('me');
    });

    Route::middleware(['web', 'auth:sanctum', 'active', 'role:' . Role::SUPER_ADMIN])->group(function () {
        Route::get('dashboard', [SuperAdminController::class, 'dashboard'])->name('dashboard');

        Route::get('companies', [SuperAdminController::class, 'companies'])->name('companies');
        Route::post('companies', [SuperAdminController::class, 'storeCompany'])->name('companies.store');
        Route::patch('companies/{company}', [SuperAdminController::class, 'updateCompany'])->name('companies.update');

        Route::get('plans', [SuperAdminController::class, 'plans'])->name('plans');

        Route::get('subscriptions', [SuperAdminController::class, 'subscriptions'])->name('subscriptions');
        Route::post('subscriptions', [SuperAdminController::class, 'storeSubscription'])->name('subscriptions.store');

        Route::get('feature-controls', [SuperAdminController::class, 'featureControls'])->name('feature-controls');
        Route::put('feature-controls', [SuperAdminController::class, 'updateFeatureControl'])->name('feature-controls.update');

        Route::get('payments', [SuperAdminController::class, 'payments'])->name('payments');
        Route::post('payments', [SuperAdminController::class, 'storePayment'])->name('payments.store');

        Route::get('reports', [SuperAdminController::class, 'reports'])->name('reports');
    });
});
