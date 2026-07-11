<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<style>
  @page { size: A4; margin: 12mm 15mm; }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'Helvetica', 'Arial', sans-serif;
    color: #222222;
    font-size: 8pt;
    line-height: 1.5;
    background: #FFFFFF;
  }

  /* ─── Header ─── */
  .header {
    text-align: center;
    padding: 6mm 0 5mm;
    border-bottom: 3px solid #19B000;
    margin-bottom: 5mm;
  }
  .brand { font-size: 26pt; font-weight: 900; }
  .brand .g { color: #19B000; }
  .brand .b { color: #222; }
  .subtitle {
    font-size: 11pt;
    font-weight: 700;
    color: #555;
    margin-top: 2mm;
    text-transform: uppercase;
    letter-spacing: 0.12em;
  }
  .report-date {
    margin-top: 2mm;
    font-size: 8pt;
    color: #888;
  }

  /* ─── Section titles ─── */
  .stitle {
    font-size: 10pt;
    font-weight: 900;
    color: #19B000;
    text-transform: uppercase;
    border-bottom: 2px solid #222;
    padding-bottom: 1.5mm;
    margin: 5mm 0 3mm;
  }

  /* ─── Stat cards ─── */
  .stats-grid { display: flex; gap: 2.5mm; margin-bottom: 3mm; }
  .scard {
    flex: 1;
    border: 2px solid #222;
    padding: 2.5mm 3mm;
    text-align: center;
  }
  .scard.dk { background: #1a1a1a; }
  .scard .lb {
    font-size: 5.5pt;
    font-weight: 900;
    text-transform: uppercase;
    color: #777;
    margin-bottom: 0.5mm;
  }
  .scard.dk .lb { color: #aaa; }
  .scard .vl {
    font-size: 15pt;
    font-weight: 900;
    color: #19B000;
    line-height: 1.1;
  }
  .scard .sb {
    font-size: 5.5pt;
    color: #888;
    margin-top: 0.5mm;
  }
  .scard.dk .sb { color: #999; }

  /* ─── Bar chart ─── */
  .chart-box {
    border: 2px solid #222;
    padding: 3mm 3mm 2mm;
    margin-bottom: 3mm;
  }
  .chart-title {
    font-size: 8pt;
    font-weight: 900;
    text-transform: uppercase;
    color: #333;
    margin-bottom: 2mm;
  }
  .barchart {
    width: 100%;
    border-collapse: collapse;
  }
  .barchart td {
    padding: 0;
    vertical-align: bottom;
    text-align: center;
    border: none;
  }
  .barchart .bar-cell {
    padding: 0 1px;
    vertical-align: bottom;
  }
  .barchart .bar {
    width: 100%;
    min-height: 1px;
  }
  .barchart .bar.green { background: #19B000; }
  .barchart .bar.black { background: #333; }
  .barchart .bar-label {
    font-size: 4.5pt;
    color: #888;
    padding-top: 1mm;
    white-space: nowrap;
    overflow: hidden;
  }
  .barchart .bar-value {
    font-size: 4.5pt;
    font-weight: 700;
    padding-bottom: 0.5mm;
  }
  .barchart .bar-value.green { color: #19B000; }
  .barchart .bar-value.black { color: #333; }

  /* ─── Pie (horizontal stacked bar) ─── */
  .pie-bar {
    display: flex;
    height: 8mm;
    border: 2px solid #222;
    overflow: hidden;
    margin-bottom: 1.5mm;
  }
  .pie-bar div { height: 100%; }
  .legend { display: flex; flex-wrap: wrap; gap: 1.5mm 4mm; margin-bottom: 2mm; }
  .legend-item { display: flex; align-items: center; gap: 1mm; font-size: 6pt; color: #444; }
  .legend-dot { width: 3mm; height: 3mm; flex-shrink: 0; }

  /* ─── Table ─── */
  table.data { width: 100%; border-collapse: collapse; font-size: 7pt; margin-bottom: 3mm; }
  table.data th {
    background: #1a1a1a;
    color: #19B000;
    font-weight: 900;
    text-transform: uppercase;
    padding: 1.5mm 2mm;
    text-align: left;
    font-size: 5.5pt;
  }
  table.data td {
    padding: 1.5mm 2mm;
    border-bottom: 0.5pt solid #ddd;
  }
  table.data tr:nth-child(even) td { background: #f7f7f7; }
  .tg { color: #19B000; font-weight: 900; }
  .tr { text-align: right; }
  .tb { font-weight: 900; }

  /* ─── Chips ─── */
  .chips { display: flex; flex-wrap: wrap; gap: 2mm; margin-bottom: 3mm; }
  .chip {
    border: 1.5px solid #222;
    padding: 1mm 2.5mm;
    font-size: 6.5pt;
    font-weight: 700;
    display: inline-block;
  }
  .chip .cq { color: #19B000; font-weight: 900; }

  /* ─── Footer ─── */
  .footer {
    margin-top: 6mm;
    padding-top: 3mm;
    border-top: 2px solid #19B000;
    text-align: center;
    font-size: 6.5pt;
    color: #999;
  }
  .footer .fb { font-weight: 900; color: #19B000; }

  /* Page break helper */
  .pagebreak { page-break-before: always; }
</style>
</head>
<body>

<!-- ═══════════════════ HEADER ═══════════════════ -->
<div class="header">
  <div class="brand"><span class="g">BETHEL</span> <span class="b">GRILL</span></div>
  <div class="subtitle">Rapport Statistique</div>
  <div class="report-date">Genere le {{ $now->format('d/m/Y \a H:i') }}</div>
</div>

<!-- ═══════════════════ VUE D'ENSEMBLE ═══════════════════ -->
<div class="stitle">Vue d'ensemble</div>
<div class="stats-grid">
  <div class="scard">
    <div class="lb">Revenu Total</div>
    <div class="vl">{{ number_format($totalRevenue, 0, '.', ' ') }}</div>
    <div class="sb">FCFA</div>
  </div>
  <div class="scard dk">
    <div class="lb">Commandes</div>
    <div class="vl">{{ $totalOrders }}</div>
    <div class="sb">{{ $ordersToday }} aujourd'hui</div>
  </div>
  <div class="scard">
    <div class="lb">Clients</div>
    <div class="vl">{{ $totalCustomers }}</div>
    <div class="sb">Enregistres</div>
  </div>
  <div class="scard dk">
    <div class="lb">Panier Moyen</div>
    <div class="vl">{{ number_format($avgOrderValue, 0, '.', ' ') }}</div>
    <div class="sb">FCFA</div>
  </div>
</div>
<div class="stats-grid">
  <div class="scard">
    <div class="lb">Aujourd'hui</div>
    <div class="vl">{{ $ordersToday }}</div>
    <div class="sb">commandes</div>
  </div>
  <div class="scard">
    <div class="lb">Cette semaine</div>
    <div class="vl">{{ $ordersThisWeek }}</div>
    <div class="sb">commandes</div>
  </div>
  <div class="scard dk">
    <div class="lb">Ce mois</div>
    <div class="vl">{{ $ordersThisMonth }}</div>
    <div class="sb">commandes</div>
  </div>
</div>

<!-- ═══════════════════ GRAPHIQUES ═══════════════════ -->
<div class="stitle">Graphiques &mdash; 14 derniers jours</div>

{{-- Bar chart: Commandes par jour --}}
<div class="chart-box">
  <div class="chart-title">Commandes par jour</div>
  <table class="barchart">
    <tr>
      @foreach($chartDays as $day)
        @php
          $barH = $maxBarOrders > 0 ? round(($day['orders'] / $maxBarOrders) * 28) : 0;
        @endphp
        <td style="padding:0 1px; vertical-align:bottom; text-align:center; width:{{ round(100/count($chartDays), 1) }}%;">
          @if($day['orders'] > 0)
            <div style="font-size:4.5pt; font-weight:700; color:#19B000; margin-bottom:0.3mm;">{{ $day['orders'] }}</div>
          @endif
          <div style="background:#19B000; height:{{ max(1, $barH) }}mm; width:100%;"></div>
          <div style="font-size:4pt; color:#999; margin-top:0.5mm; white-space:nowrap;">{{ substr($day['label'], -5) }}</div>
        </td>
      @endforeach
    </tr>
  </table>
</div>

{{-- Bar chart: Revenu par jour --}}
<div class="chart-box">
  <div class="chart-title">Revenu par jour (FCFA)</div>
  <table class="barchart">
    <tr>
      @foreach($chartDays as $day)
        @php
          $barH = $maxBarRevenue > 0 ? round(($day['revenue'] / $maxBarRevenue) * 28) : 0;
        @endphp
        <td style="padding:0 1px; vertical-align:bottom; text-align:center; width:{{ round(100/count($chartDays), 1) }}%;">
          @if($day['revenue'] > 0)
            <div style="font-size:4.5pt; font-weight:700; color:#333; margin-bottom:0.3mm;">{{ number_format($day['revenue'], 0, '.', ' ') }}</div>
          @endif
          <div style="background:#333; height:{{ max(1, $barH) }}mm; width:100%;"></div>
          <div style="font-size:4pt; color:#999; margin-top:0.5mm; white-space:nowrap;">{{ substr($day['label'], -5) }}</div>
        </td>
      @endforeach
    </tr>
  </table>
</div>

{{-- Pie: stacked horizontal bar --}}
<div class="chart-box">
  <div class="chart-title">Repartition par categorie</div>
  @if($categoryBreakdown->count() > 0)
    @php $totalCat = $categoryBreakdown->sum('count'); @endphp
    <div class="pie-bar">
      @foreach($categoryBreakdown as $ci => $cat)
        @php $pct = $totalCat > 0 ? ($cat['count'] / $totalCat) * 100 : 0; @endphp
        <div style="width:{{ $pct }}%; background:{{ $catColors[$ci % count($catColors)] }};"></div>
      @endforeach
    </div>
    <div class="legend">
      @foreach($categoryBreakdown as $ci => $cat)
        @php $pct = $totalCat > 0 ? round(($cat['count'] / $totalCat) * 100) : 0; @endphp
        <div class="legend-item">
          <div class="legend-dot" style="background:{{ $catColors[$ci % count($catColors)] }};"></div>
          {{ $cat['category'] }} ({{ $cat['count'] }} &mdash; {{ $pct }}%)
        </div>
      @endforeach
    </div>
  @else
    <p style="color:#999;font-style:italic;font-size:7pt;">Aucune donnee</p>
  @endif
</div>

<!-- ═══════════════════ TOP PLATS ═══════════════════ -->
<div class="stitle">Top plats</div>
<div class="chips">
  @forelse ($topPlats as $i => $plat)
    <div class="chip">
      <span style="color:#999;">#{{ $i + 1 }}</span>
      {{ $plat['name'] }}
      <span class="cq">x{{ $plat['qty'] }}</span>
    </div>
  @empty
    <p style="color:#999;font-style:italic;font-size:7pt;">Aucune commande</p>
  @endforelse
</div>

<!-- ═══════════════════ COMMANDES ═══════════════════ -->
<div class="stitle">Dernieres commandes</div>
<table class="data">
  <thead>
    <tr>
      <th style="width:6%;">#</th>
      <th style="width:20%;">Client</th>
      <th style="width:18%;">Contact</th>
      <th class="tr" style="width:10%;">Articles</th>
      <th class="tr" style="width:22%;">Total (FCFA)</th>
      <th class="tr" style="width:24%;">Date</th>
    </tr>
  </thead>
  <tbody>
    @forelse ($recentOrders as $o)
    <tr>
      <td class="tg">#{{ $o['id'] }}</td>
      <td class="tb">{{ $o['name'] }}</td>
      <td>{{ $o['phone'] }}</td>
      <td class="tr">{{ $o['items'] }}</td>
      <td class="tr tg tb">{{ number_format($o['total'], 0, '.', ' ') }}</td>
      <td class="tr">{{ $o['date'] }}</td>
    </tr>
    @empty
    <tr><td colspan="6" style="text-align:center;color:#999;">Aucune commande</td></tr>
    @endforelse
  </tbody>
</table>

<!-- ═══════════════════ FOOTER ═══════════════════ -->
<div class="footer">
  <span class="fb">BETHEL GRILL</span> &mdash; Rapport genere automatiquement le {{ $now->format('d/m/Y a H:i') }}
</div>

</body>
</html>
