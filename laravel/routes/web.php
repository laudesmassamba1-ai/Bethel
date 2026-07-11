<?php

use App\Http\Controllers\TicketController;
use Illuminate\Support\Facades\Route;

Route::get('/ticket/{order}', [TicketController::class, 'show'])->name('ticket')->whereNumber('order');

Route::get('/robots.txt', function () {
    $content = "User-agent: *\nAllow: /\nSitemap: " . url('/sitemap.xml');
    return response($content, 200, [
        'Content-Type' => 'text/plain; charset=UTF-8',
        'X-Content-Type-Options' => 'nosniff',
    ]);
});

Route::get('/sitemap.xml', function () {
    $baseUrl = url('/');
    $checkoutUrl = url('/checkout');
    $xml = '<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url><loc>' . e($baseUrl) . '</loc><priority>1.0</priority></url>
    <url><loc>' . e($checkoutUrl) . '</loc><priority>0.5</priority></url>
</urlset>';
    return response($xml, 200, [
        'Content-Type' => 'application/xml; charset=UTF-8',
        'X-Content-Type-Options' => 'nosniff',
    ]);
});

Route::fallback(function () {
    $path = public_path('dist/index.html');
    if (file_exists($path)) {
        return response(file_get_contents($path))
            ->header('Content-Type', 'text/html');
    }
    return redirect()->to('http://localhost:5173' . request()->getRequestUri());
});
