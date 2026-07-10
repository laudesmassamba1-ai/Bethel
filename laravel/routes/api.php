<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CustomerController;
use App\Http\Controllers\Api\MenuController;
use App\Http\Controllers\Api\PlatController;
use App\Http\Controllers\Api\SiteConfigController;
use App\Http\Controllers\Api\StatsController;
use App\Http\Controllers\CheckoutController;
use Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse;
use Illuminate\Cookie\Middleware\EncryptCookies;
use Illuminate\Session\Middleware\StartSession;
use Illuminate\Support\Facades\Route;

Route::get('/plats', [PlatController::class, 'index']);
Route::get('/plats/{plat}', [PlatController::class, 'show']);
Route::get('/menus', [MenuController::class, 'index']);
Route::get('/config', [SiteConfigController::class, 'index']);
Route::get('/stats', [StatsController::class, 'index']);
Route::post('/checkout', [CheckoutController::class, 'store'])->middleware('throttle:5,1');
Route::get('/customer/verify', [CustomerController::class, 'verify']);

Route::post('/login', [AuthController::class, 'login'])->middleware([
    'throttle:5,60',
    EncryptCookies::class,
    AddQueuedCookiesToResponse::class,
    StartSession::class,
]);

Route::middleware('auth:api')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout'])->middleware([
        EncryptCookies::class,
        AddQueuedCookiesToResponse::class,
        StartSession::class,
    ]);
});
