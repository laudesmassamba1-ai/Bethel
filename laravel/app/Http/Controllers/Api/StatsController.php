<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Plat;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class StatsController extends Controller
{
    public function index(): JsonResponse
    {
        $now = Carbon::now();
        $todayStart = $now->copy()->startOfDay();
        $weekStart = $now->copy()->startOfWeek();
        $monthStart = $now->copy()->startOfMonth();

        $baseQuery = Order::where('status', 'terminee');

        $totalOrders = (clone $baseQuery)->count();
        $totalRevenue = (int) (clone $baseQuery)->sum('total_amount');
        $ordersToday = (clone $baseQuery)->where('created_at', '>=', $todayStart)->count();
        $ordersThisWeek = (clone $baseQuery)->where('created_at', '>=', $weekStart)->count();
        $ordersThisMonth = (clone $baseQuery)->where('created_at', '>=', $monthStart)->count();
        $avgOrderValue = $totalOrders > 0 ? (int) round($totalRevenue / $totalOrders) : 0;

        $totalCustomers = Customer::whereHas('orders', fn ($q) => $q->where('status', 'terminee'))->count();
        $newCustomersThisMonth = Customer::whereHas('orders', fn ($q) => $q->where('status', 'terminee'))
            ->where('created_at', '>=', $monthStart)
            ->count();

        $topPlats = OrderItem::select('plat_id', DB::raw('SUM(quantity) as total_qty'))
            ->whereNotNull('plat_id')
            ->whereHas('order', fn ($q) => $q->where('status', 'terminee'))
            ->groupBy('plat_id')
            ->orderByDesc('total_qty')
            ->limit(5)
            ->get()
            ->map(function ($item) {
                $plat = Plat::find($item->plat_id);
                return [
                    'id' => $item->plat_id,
                    'name' => $plat?->titre ?? 'Plat supprime',
                    'total_qty' => (int) $item->total_qty,
                ];
            });

        $recentOrders = Order::where('status', 'terminee')
            ->latest()
            ->take(10)
            ->get()
            ->map(fn ($o) => [
                'id' => $o->id,
                'customer_name' => $o->customer_name,
                'customer_phone' => $o->customer_phone,
                'total_amount' => (int) $o->total_amount,
                'items_count' => $o->items()->count(),
                'created_at' => $o->created_at->toISOString(),
            ]);

        $ordersByDay = (clone $baseQuery)
            ->select(
                DB::raw("DATE(created_at) as date"),
                DB::raw("COUNT(*) as count"),
                DB::raw("SUM(total_amount) as revenue")
            )
            ->where('created_at', '>=', $now->copy()->subDays(13)->startOfDay())
            ->groupBy(DB::raw("DATE(created_at)"))
            ->orderBy('date')
            ->get()
            ->keyBy('date');

        $chartDays = [];
        for ($i = 13; $i >= 0; $i--) {
            $date = $now->copy()->subDays($i)->format('Y-m-d');
            $dayData = $ordersByDay->get($date);
            $chartDays[] = [
                'date' => $date,
                'label' => $now->copy()->subDays($i)->format('D d'),
                'orders' => (int) ($dayData->count ?? 0),
                'revenue' => (int) ($dayData->revenue ?? 0),
            ];
        }

        $categoryBreakdown = Plat::select('categorie', DB::raw('COUNT(*) as count'))
            ->groupBy('categorie')
            ->orderByDesc('count')
            ->get()
            ->map(fn ($c) => [
                'category' => $c->categorie ?: 'Sans categorie',
                'count' => (int) $c->count,
            ]);

        return response()->json([
            'data' => [
                'total_orders' => $totalOrders,
                'total_revenue' => $totalRevenue,
                'orders_today' => $ordersToday,
                'orders_this_week' => $ordersThisWeek,
                'orders_this_month' => $ordersThisMonth,
                'avg_order_value' => $avgOrderValue,
                'total_customers' => $totalCustomers,
                'new_customers_this_month' => $newCustomersThisMonth,
                'top_plats' => $topPlats,
                'recent_orders' => $recentOrders,
                'chart_14_days' => $chartDays,
                'category_breakdown' => $categoryBreakdown,
            ],
        ]);
    }
}
