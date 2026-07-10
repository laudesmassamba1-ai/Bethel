<div class="filament-widget">
    <div style="display:flex;gap:2rem;align-items:center;justify-content:space-between;">
        <div>
            <h3 style="margin:0;font-size:1.1rem;">Commandes</h3>
            <div style="font-weight:800;font-size:1.8rem;">{{ number_format($ordersCount) }}</div>
            <div style="font-size:0.7rem;font-weight:700;color:#F59E0B;">{{ $pendingCount }} en attente</div>
        </div>
        <div style="text-align:right;">
            <h3 style="margin:0;font-size:1.1rem;">CA total</h3>
            <div style="font-weight:800;font-size:1.4rem;color:#ffd166;">{{ number_format($totalRevenue, 0, '.', ' ') }} FCFA</div>
        </div>
    </div>
</div>
