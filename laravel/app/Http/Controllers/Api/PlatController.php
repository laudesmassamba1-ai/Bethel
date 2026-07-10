<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PlatResource;
use App\Models\Plat;
use Illuminate\Http\JsonResponse;

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

        return response()->json([
            'data' => PlatResource::collection($plats),
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
