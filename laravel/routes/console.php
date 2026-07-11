<?php

use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Schedule::command('db:backup')->dailyAt('03:00');
Schedule::command('session:cleanup --days=7')->dailyAt('04:00');
Schedule::command('cache:prune-stale-tags')->hourly();
