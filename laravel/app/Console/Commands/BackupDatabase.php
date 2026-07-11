<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class BackupDatabase extends Command
{
    protected $signature = 'db:backup';
    protected $description = 'Create a timestamped backup of the SQLite database';

    private const MAX_BACKUPS = 30;

    public function handle(): int
    {
        $dbPath = database_path('database.sqlite');
        $backupDir = database_path('backups');

        if (!File::exists($dbPath)) {
            $this->error('Database file not found: ' . $dbPath);
            return 1;
        }

        if (!File::isDirectory($backupDir)) {
            File::makeDirectory($backupDir, 0755, true);
        }

        $timestamp = now()->format('Y-m-d_His');
        $backupPath = $backupDir . "/database_{$timestamp}.sqlite";

        try {
            $db = new \SQLite3($dbPath);
            $db->exec("VACUUM INTO '{$backupPath}'");
            $db->close();

            $size = number_format(File::size($backupPath) / 1024, 1);
            $this->info("Backup created: {$backupPath} ({$size} KB)");
        } catch (\Exception $e) {
            File::copy($dbPath, $backupPath);
            $this->warn("Fallback copy used: {$e->getMessage()}");
        }

        $backups = collect(File::files($backupDir))
            ->filter(fn ($f) => $f->getExtension() === 'sqlite')
            ->sortByDesc('filename');

        $toDelete = $backups->skip(self::MAX_BACKUPS);
        foreach ($toDelete as $old) {
            File::delete($old->getPathname());
            $this->line("  Removed old backup: {$old->getFilename()}");
        }

        $remaining = collect(File::files($backupDir))
            ->filter(fn ($f) => $f->getExtension() === 'sqlite')
            ->count();

        $this->info("Total backups: " . $remaining);
        return 0;
    }
}
