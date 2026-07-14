<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Plat;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StatsPdfController extends Controller
{
    public function export(Request $request)
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

        $topPlats = OrderItem::select('plat_id', DB::raw('SUM(quantity) as total_qty'))
            ->whereNotNull('plat_id')
            ->whereHas('order', fn ($q) => $q->where('status', 'terminee'))
            ->groupBy('plat_id')
            ->orderByDesc('total_qty')
            ->limit(10)
            ->get();

        $platIds = $topPlats->pluck('plat_id')->unique()->values()->all();
        $platsMap = $platIds ? Plat::whereIn('id', $platIds)->get()->keyBy('id') : collect();
        $topPlats = $topPlats->map(fn ($item) => [
            'name' => $platsMap->get($item->plat_id)?->titre ?? 'Plat supprime',
            'qty' => (int) $item->total_qty,
        ]);

        $recentOrders = Order::withCount('items')
            ->where('status', 'terminee')
            ->latest()
            ->take(20)
            ->get()
            ->map(fn ($o) => [
                'id' => $o->id,
                'name' => $o->customer_name ?? 'Anonyme',
                'phone' => $o->customer_phone ?? '--',
                'items' => $o->items_count,
                'total' => (int) $o->total_amount,
                'date' => $o->created_at->format('d/m/Y H:i'),
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
                'label' => $now->copy()->subDays($i)->format('D d/m'),
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

        $maxBarOrders = max(array_column($chartDays, 'orders') ?: [1]);
        if ($maxBarOrders < 1) $maxBarOrders = 1;
        $maxBarRevenue = max(array_column($chartDays, 'revenue') ?: [1]);
        if ($maxBarRevenue < 1) $maxBarRevenue = 1;

        $barChartSvg = $this->buildBarChart($chartDays, 'orders', $maxBarOrders, '#19B000');
        $revenueChartSvg = $this->buildBarChart($chartDays, 'revenue', $maxBarRevenue, '#000000');

        $catColors = ['#19B000', '#000000', '#0D8A00', '#333333', '#095E00', '#1a1a1a'];
        $pieSvg = $this->buildPieChart($categoryBreakdown->toArray(), $catColors);

        $data = compact(
            'totalOrders', 'totalRevenue', 'ordersToday', 'ordersThisWeek',
            'ordersThisMonth', 'avgOrderValue', 'totalCustomers', 'topPlats',
            'recentOrders', 'chartDays', 'categoryBreakdown', 'barChartSvg',
            'revenueChartSvg', 'pieSvg', 'now', 'maxBarOrders', 'maxBarRevenue', 'catColors'
        );

        $pdf = Pdf::loadView('pdf.stats-report', $data)
            ->setPaper('a4', 'portrait')
            ->setOption('isFontSubsettingEnabled', true)
            ->setOption('isRemoteEnabled', false);

        return $pdf->download('bethel-grill-rapport-' . $now->format('Y-m-d') . '.pdf');
    }

    private function buildBarChart(array $days, string $key, int $maxVal, string $color): string
    {
        $w = 700;
        $h = 140;
        $barW = floor($w / count($days)) - 4;
        $bars = '';

        foreach ($days as $i => $d) {
            $v = $d[$key];
            $barH = $maxVal > 0 ? ($v / $maxVal) * ($h - 20) : 0;
            $x = $i * ($barW + 4) + 2;
            $y = $h - $barH - 14;
            $bars .= '<rect x="' . $x . '" y="' . $y . '" width="' . $barW . '" height="' . $barH . '" fill="' . $color . '" rx="2"/>';
            $bars .= '<text x="' . ($x + $barW / 2) . '" y="' . ($h - 2) . '" font-size="6" fill="#666" text-anchor="middle" font-family="sans-serif">' . substr($d['label'], -5) . '</text>';
            if ($v > 0) {
                $bars .= '<text x="' . ($x + $barW / 2) . '" y="' . ($y - 3) . '" font-size="6" fill="' . $color . '" text-anchor="middle" font-weight="bold" font-family="sans-serif">' . $v . '</text>';
            }
        }

        return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' . $w . ' ' . $h . '" width="' . $w . '" height="' . $h . '">' . $bars . '</svg>';
    }

    private function buildPieChart(array $data, array $colors): string
    {
        $total = array_sum(array_column($data, 'count'));
        if ($total === 0) return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120"><text x="60" y="65" text-anchor="middle" font-size="8" fill="#999" font-family="sans-serif">Aucune donnee</text></svg>';

        $cx = 50;
        $cy = 50;
        $r = 40;
        $paths = '';
        $startAngle = -90;

        foreach ($data as $i => $cat) {
            $pct = ($cat['count'] / $total) * 360;
            $endAngle = $startAngle + $pct;
            $startRad = deg2rad($startAngle);
            $endRad = deg2rad($endAngle);
            $largeArc = $pct > 180 ? 1 : 0;

            $x1 = $cx + $r * cos($startRad);
            $y1 = $cy + $r * sin($startRad);
            $x2 = $cx + $r * cos($endRad);
            $y2 = $cy + $r * sin($endRad);

            $color = $colors[$i % count($colors)];
            $paths .= '<path d="M' . $cx . ',' . $cy . ' L' . $x1 . ',' . $y1 . ' A' . $r . ',' . $r . ' 0 ' . $largeArc . ',1 ' . $x2 . ',' . $y2 . ' Z" fill="' . $color . '"/>';
            $startAngle = $endAngle;
        }

        $legend = '';
        foreach ($data as $i => $cat) {
            $color = $colors[$i % count($colors)];
            $ly = 12 + $i * 10;
            $legend .= '<rect x="108" y="' . $ly . '" width="6" height="6" fill="' . $color . '" rx="1"/>';
            $legend .= '<text x="116" y="' . ($ly + 5) . '" font-size="5" fill="#333" font-family="sans-serif">' . htmlspecialchars($cat['category'], ENT_XML1, 'UTF-8') . ' (' . $cat['count'] . ')</text>';
        }

        return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 100" width="180" height="100">' . $paths . $legend . '</svg>';
    }
}
