<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Response;

class TicketController extends Controller
{
    public function show(Order $order): Response
    {
        $order->load('items.plat', 'customer');

        $catColors = [
            'Burgers'  => ['primary' => '#E53E30', 'light' => '#FFEBEE', 'gradient' => 'linear-gradient(135deg, #E53E30, #C62828)'],
            'Pizzas'   => ['primary' => '#2D8B46', 'light' => '#E8F5E9', 'gradient' => 'linear-gradient(135deg, #2D8B46, #1B5E20)'],
            'Tacos'    => ['primary' => '#F57C00', 'light' => '#FFF3E0', 'gradient' => 'linear-gradient(135deg, #F57C00, #E65100)'],
            'Desserts' => ['primary' => '#D81B60', 'light' => '#FCE4EC', 'gradient' => 'linear-gradient(135deg, #D81B60, #AD1457)'],
            'Boissons' => ['primary' => '#1976D2', 'light' => '#E3F2FD', 'gradient' => 'linear-gradient(135deg, #1976D2, #0D47A1)'],
        ];

        $items = $order->items->map(fn ($i) => [
            'name'      => $i->plat?->titre ?? 'Plat',
            'qty'       => $i->quantity,
            'price'     => $i->unit_price,
            'total'     => $i->quantity * $i->unit_price,
            'category'  => $i->plat?->categorie ?? '',
            'color'     => $catColors[$i->plat?->categorie ?? '']['primary'] ?? '#6B6357',
            'lightBg'   => $catColors[$i->plat?->categorie ?? '']['light'] ?? '#F4F1EA',
            'gradient'  => $catColors[$i->plat?->categorie ?? '']['gradient'] ?? 'none',
        ]);

        $date = $order->created_at->format('d/m/Y \à H:i');
        $nonce = base64_encode(random_bytes(16));
        $dayName = match((int)$order->created_at->format('N')) {
            1 => 'Lundi', 2 => 'Mardi', 3 => 'Mercredi', 4 => 'Jeudi',
            5 => 'Vendredi', 6 => 'Samedi', 7 => 'Dimanche',
            default => ''
        };
        $whatsappMsg = $order->whatsapp_message;

        $customer = $order->customer;

        $html = view('ticket', [
            'order'          => $order,
            'items'          => $items,
            'total'          => (int) $order->total_amount,
            'date'           => $date,
            'dayName'        => $dayName,
            'number'         => $order->id,
            'customerName'   => $order->customer_name,
            'customerPhone'  => $order->customer_phone,
            'customer'       => $customer,
            'loyaltyTier'    => $customer?->loyalty_tier,
            'loyaltyColor'   => $customer?->loyalty_color,
            'orderCount'     => $customer?->order_count,
            'brandName'      => 'Bethel Kitchen',
            'whatsappMsg'    => $whatsappMsg,
            'nonce'          => $nonce,
        ])->render();

        return response($html, 200, [
            'Content-Type' => 'text/html; charset=UTF-8',
            'X-Content-Type-Options' => 'nosniff',
            'X-Frame-Options' => 'DENY',
            'X-XSS-Protection' => '1; mode=block',
            'Referrer-Policy' => 'no-referrer',
            'Permissions-Policy' => 'geolocation=(), microphone=(), camera=()',
        ]);
    }
}
