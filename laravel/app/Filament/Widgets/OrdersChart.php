<?php

namespace App\Filament\Widgets;

use App\Models\Order;
use Carbon\Carbon;
use Filament\Widgets\ChartWidget;
use Illuminate\Support\Facades\DB;

class OrdersChart extends ChartWidget
{
    protected static ?string $heading = 'Commandes (14 jours)';

    protected function getData(): array
    {
        $now = Carbon::now();
        $ordersByDay = Order::select(
            DB::raw("DATE(created_at) as date"),
            DB::raw("COUNT(*) as count"),
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
            $data[] = (int) ($ordersByDay->get($date)?->count ?? 0);
        }

        return [
            'datasets' => [
                [
                    'label' => 'Commandes',
                    'data' => $data,
                    'backgroundColor' => '#9B1B30',
                    'borderColor' => '#9B1B30',
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
