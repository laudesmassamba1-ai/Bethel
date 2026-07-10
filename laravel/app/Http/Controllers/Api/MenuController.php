<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\MenuResource;
use App\Models\Menu;
use Illuminate\Http\JsonResponse;

class MenuController extends Controller
{
    public function index(): JsonResponse
    {
        $menus = Menu::with('plats')
            ->where('is_active', true)
            ->orderBy('nom')
            ->get();

        return response()->json([
            'data' => MenuResource::collection($menus),
        ]);
    }
}
