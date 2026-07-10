<?php

namespace App\Filament\Widgets;

use App\Models\Order;
use Filament\Widgets\Widget;

class OrdersSummary extends Widget
{
    protected static string $view = 'filament.widgets.orders-summary';

    protected function getViewData(): array
    {
        $completed = Order::where('status', 'terminee');
        return [
            'ordersCount' => (clone $completed)->count(),
            'totalRevenue' => (int) (clone $completed)->sum('total_amount'),
            'pendingCount' => Order::where('status', 'en_attente')->count(),
        ];
    }
}
