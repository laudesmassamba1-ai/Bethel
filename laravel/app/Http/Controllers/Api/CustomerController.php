<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    public function verify(Request $request): JsonResponse
    {
        $request->validate([
            'customer_id' => 'required|integer|exists:customers,id',
            'phone' => 'required|string|max:50',
        ]);

        $customer = Customer::find($request->integer('customer_id'));

        if (! $customer || $customer->phone !== $request->string('phone')->value()) {
            return response()->json(['valid' => false], 404);
        }

        return response()->json([
            'valid' => true,
            'data' => [
                'id' => $customer->id,
                'name' => $customer->name,
                'phone' => $customer->phone,
                'order_count' => $customer->order_count,
                'loyalty_tier' => $customer->loyalty_tier,
                'loyalty_color' => $customer->loyalty_color,
            ],
        ]);
    }
}
