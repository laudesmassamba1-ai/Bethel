<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class HealthController extends Controller
{
    public function index(): JsonResponse
    {
        $checks = [];

        try {
            $start = microtime(true);
            DB::select('SELECT 1');
            $checks['database'] = [
                'status' => 'ok',
                'latency_ms' => round((microtime(true) - $start) * 1000, 2),
            ];
        } catch (\Exception $e) {
            $checks['database'] = ['status' => 'error', 'message' => $e->getMessage()];
        }

        try {
            $row = DB::select('PRAGMA journal_mode');
            $checks['journal_mode'] = [
                'status' => 'ok',
                'mode' => $row[0]->journal_mode ?? 'unknown',
            ];
        } catch (\Exception $e) {
            $checks['journal_mode'] = ['status' => 'error'];
        }

        $dbPath = database_path('database.sqlite');
        if (file_exists($dbPath)) {
            clearstatcache(true, $dbPath);
            $checks['file'] = [
                'status' => 'ok',
                'size_mb' => round(filesize($dbPath) / (1024 * 1024), 2),
                'writable' => is_writable($dbPath),
                'last_modified' => date('c', filemtime($dbPath)),
            ];
        }

        $ok = collect($checks)->every(fn ($c) => $c['status'] === 'ok');

        return response()->json([
            'status' => $ok ? 'healthy' : 'degraded',
            'timestamp' => now()->toIso8601String(),
            'checks' => $checks,
        ], $ok ? 200 : 503);
    }
}
