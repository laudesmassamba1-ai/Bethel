<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

class ResetDataController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'confirm' => 'required|in:reset_all_data',
        ]);

        $backupPath = database_path('backups/pre_reset_' . now()->format('Y-m-d_His') . '.sqlite');
        $dbPath = database_path('database.sqlite');

        if (!File::isDirectory(database_path('backups'))) {
            File::makeDirectory(database_path('backups'), 0755, true);
        }

        try {
            $db = new \SQLite3($dbPath);
            $safePath = addslashes($backupPath);
            $db->exec("VACUUM INTO '{$safePath}'");
            $db->close();
        } catch (\Exception $e) {
            File::copy($dbPath, $backupPath);
        }

        DB::table('order_items')->truncate();
        DB::table('orders')->truncate();

        DB::table('customers')->update([
            'order_count' => 0,
            'total_spent' => 0,
        ]);

        return response()->json([
            'message' => 'Toutes les donnees de commandes ont ete reinitialisees.',
            'backup' => basename($backupPath),
        ]);
    }
}
