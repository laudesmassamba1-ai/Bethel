<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class CleanupSessions extends Command
{
    protected $signature = 'session:cleanup {--days=7}';
    protected $description = 'Delete expired sessions and stale API tokens older than N days';

    public function handle(): int
    {
        $days = (int) $this->option('days');
        $cutoff = now()->subDays($days);

        $deletedSessions = DB::table('sessions')
            ->where('last_activity', '<', $cutoff->timestamp)
            ->delete();

        $this->info("Deleted {$deletedSessions} expired sessions (older than {$days} days).");

        $deletedTokens = DB::table('users')
            ->whereNotNull('api_token')
            ->where('updated_at', '<', $cutoff)
            ->update(['api_token' => null]);

        $this->info("Cleared {$deletedTokens} stale API tokens.");

        return 0;
    }
}
