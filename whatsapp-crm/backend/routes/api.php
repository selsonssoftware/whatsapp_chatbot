// This file contains the API routes for the application, excluding Super Admin-specific routes.

use Illuminate\Support\Facades\Route;

// Regular user routes
Route::middleware(['auth:sanctum'])->group(function () {
    // User-related routes
    Route::get('/user/profile', [UserController::class, 'profile']);
    Route::put('/user/update', [UserController::class, 'update']);
    
    // Other user-related API endpoints
});

// Admin and Manager routes
Route::middleware(['auth:sanctum', 'can:manage-users'])->group(function () {
    // Admin and Manager-related routes
    Route::get('/admin/users', [AdminController::class, 'index']);
    Route::post('/admin/users', [AdminController::class, 'store']);
    Route::put('/admin/users/{id}', [AdminController::class, 'update']);
    Route::delete('/admin/users/{id}', [AdminController::class, 'destroy']);
});

// Additional routes for other functionalities
Route::post('/messages/send', [MessageController::class, 'send']);
Route::get('/messages/inbox', [MessageController::class, 'inbox']);
Route::post('/campaigns/create', [CampaignController::class, 'create']);
Route::get('/campaigns', [CampaignController::class, 'index']);