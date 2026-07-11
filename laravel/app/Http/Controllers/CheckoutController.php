<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Plat;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class CheckoutController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'cart' => ['required', 'array', 'min:1', 'max:50'],
            'cart.*.id' => ['required', 'integer', 'distinct', 'exists:plats,id'],
            'cart.*.title' => ['required', 'string'],
            'cart.*.quantity' => ['required', 'integer', 'min:1'],
            'cart.*.price' => ['required', 'integer', 'min:0'],
            'total' => ['required', 'integer', 'min:0'],
            'message' => ['nullable', 'string'],
            'customer_name' => ['nullable', 'string', 'max:255'],
            'customer_phone' => ['nullable', 'string', 'max:50'],
            'customer_email' => ['nullable', 'email', 'max:255'],
        ]);

        $platIds = array_column($validated['cart'], 'id');
        $plats = Plat::whereIn('id', $platIds)->get()->keyBy('id');

        $serverTotal = 0;
        foreach ($validated['cart'] as &$item) {
            $plat = $plats->get($item['id']);
            $item['price'] = $plat ? (int) $plat->prix : 0;
            $serverTotal += $item['price'] * $item['quantity'];
        }
        unset($item);

        return DB::transaction(function () use ($validated, $serverTotal, $plats) {
            $customer = null;
            $phone = $validated['customer_phone'] ?? null;
            $email = $validated['customer_email'] ?? null;
            $name = $validated['customer_name'] ?? null;

            if ($phone) {
                $customer = Customer::firstOrCreate(
                    ['phone' => $phone],
                    ['name' => $name, 'email' => $email],
                );
                if ($name && !$customer->name) {
                    $customer->name = $name;
                }
                if ($email && !$customer->email) {
                    $customer->email = $email;
                }
                $customer->save();
            } elseif ($email) {
                $customer = Customer::firstOrCreate(
                    ['email' => $email],
                    ['name' => $name],
                );
                if ($name && !$customer->name) {
                    $customer->name = $name;
                    $customer->save();
                }
            }

            $order = Order::create([
                'customer_id' => $customer?->id,
                'customer_name' => $name,
                'customer_phone' => $phone,
                'total_amount' => $serverTotal,
                'cart_payload' => $validated['cart'],
                'whatsapp_message' => $validated['message'] ?? null,
                'status' => 'en_attente',
            ]);

            foreach ($validated['cart'] as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'plat_id' => $item['id'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['price'],
                ]);
            }

            if ($customer) {
                $customer->increment('order_count');
                $customer->increment('total_spent', $serverTotal);
                DB::table('customers')
                    ->where('id', $customer->id)
                    ->update([
                        'last_order_at' => now(),
                        'first_order_at' => DB::raw('COALESCE(first_order_at, \'' . now()->toDateTimeString() . '\')'),
                    ]);
            }

            return response()->json([
                'success' => true,
                'order_id' => $order->id,
                'customer_id' => $customer?->id,
            ]);
        });
    }
}
