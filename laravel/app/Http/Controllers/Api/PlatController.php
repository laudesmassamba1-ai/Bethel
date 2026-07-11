<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PlatResource;
use App\Models\OrderItem;
use App\Models\Plat;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class PlatController extends Controller
{
    public function index(): JsonResponse
    {
        $plats = Plat::with('menu')
            ->where(function ($query) {
                $query->whereNull('menu_id')
                    ->orWhereHas('menu', fn ($q) => $q->where('is_active', true));
            })
            ->latest()
            ->get();

        $mostOrderedPlatId = OrderItem::select('plat_id', DB::raw('SUM(quantity) as total_qty'))
            ->whereNotNull('plat_id')
            ->whereHas('order', fn ($q) => $q->where('status', 'terminee'))
            ->groupBy('plat_id')
            ->orderByDesc('total_qty')
            ->value('plat_id');

        return response()->json([
            'data' => PlatResource::collection($plats),
            'most_ordered_plat_id' => $mostOrderedPlatId,
        ]);
    }

    public function show(Plat $plat): JsonResponse
    {
        $plat->load('menu');

        return response()->json([
            'data' => new PlatResource($plat),
        ]);
    }
}
