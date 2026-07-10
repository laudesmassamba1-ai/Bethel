<?php

namespace App\Filament\Widgets;

use App\Models\Customer;
use App\Models\Order;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class StatsOverview extends BaseWidget
{
    protected ?string $heading = 'Aperçu';

    protected function getStats(): array
    {
        $completed = Order::where('status', 'terminee');
        $totalOrders = (clone $completed)->count();
        $totalRevenue = (int) (clone $completed)->sum('total_amount');
        $ordersToday = (clone $completed)->whereDate('created_at', today())->count();
        $avgOrder = $totalOrders > 0 ? round($totalRevenue / $totalOrders) : 0;
        $totalCustomers = Customer::whereHas('orders', fn ($q) => $q->where('status', 'terminee'))->count();
        $newCustomers = Customer::whereHas('orders', fn ($q) => $q->where('status', 'terminee'))
            ->whereDate('customers.created_at', '>=', now()->startOfMonth())
            ->count();
        $pendingOrders = Order::where('status', 'en_attente')->count();

        return [
            Stat::make('Revenu total', number_format($totalRevenue, 0, '.', ' ') . ' FCFA')
                ->description($ordersToday . ' commande(s) aujourd\'hui')
                ->color('warning')
                ->chart([7, 3, 10, 5, 15, 8, 12]),

            Stat::make('Commandes', $totalOrders)
                ->description($pendingOrders . ' en attente, ' . (clone $completed)->whereDate('created_at', '>=', now()->startOfMonth())->count() . ' terminées ce mois')
                ->color('danger'),

            Stat::make('Clients', $totalCustomers)
                ->description($newCustomers . ' nouveau(x) ce mois')
                ->color('success'),

            Stat::make('Panier moyen', number_format($avgOrder, 0, '.', ' ') . ' FCFA')
                ->description(number_format($totalRevenue, 0, '.', ' ') . ' FCFA au total')
                ->color('warning'),
        ];
    }
}
