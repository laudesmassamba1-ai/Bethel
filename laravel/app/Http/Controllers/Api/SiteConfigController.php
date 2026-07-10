<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\SiteConfigResource;
use App\Models\SiteConfig;
use Illuminate\Http\JsonResponse;

class SiteConfigController extends Controller
{
    public function index(): JsonResponse
    {
        $config = SiteConfig::current();

        return response()->json([
            'data' => new SiteConfigResource($config),
        ]);
    }
}
