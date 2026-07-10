<?php

namespace App\Filament\Widgets;

use App\Models\Order;
use Carbon\Carbon;
use Filament\Widgets\ChartWidget;
use Illuminate\Support\Facades\DB;

class RevenueChart extends ChartWidget
{
    protected static ?string $heading = 'Revenu (14 jours)';

    protected function getData(): array
    {
        $now = Carbon::now();
        $revenueByDay = Order::select(
            DB::raw("DATE(created_at) as date"),
            DB::raw("SUM(total_amount) as revenue"),
        )
            ->where('status', 'terminee')
            ->where('created_at', '>=', $now->copy()->subDays(13)->startOfDay())
            ->groupBy(DB::raw("DATE(created_at)"))
            ->orderBy('date')
            ->get()
            ->keyBy('date');

        $labels = [];
        $data = [];
        for ($i = 13; $i >= 0; $i--) {
            $date = $now->copy()->subDays($i)->format('Y-m-d');
            $labels[] = $now->copy()->subDays($i)->format('D d');
            $data[] = (int) ($revenueByDay->get($date)?->revenue ?? 0);
        }

        return [
            'datasets' => [
                [
                    'label' => 'Revenu (FCFA)',
                    'data' => $data,
                    'backgroundColor' => '#D4AF37',
                    'borderColor' => '#D4AF37',
                    'tension' => 0.3,
                ],
            ],
            'labels' => $labels,
        ];
    }

    protected function getType(): string
    {
        return 'line';
    }
}
