<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; style-src 'self' 'unsafe-inline'; font-src 'self'; img-src 'self' data:; base-uri 'self'; form-action 'self'; script-src 'self' 'nonce-{{ $nonce }}'">
<title>Ticket #{{ $number }} - {{ $brandName }}</title>
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  @page { size: A4; margin: 0; }

  html, body {
    margin: 0; padding: 0;
    font-family: 'Helvetica Neue', 'Arial', sans-serif;
    background: #FAFAF8;
    color: #000000;
  }

  .ticket {
    width: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
    background: #FFFFFF;
    border: 3px solid #000000;
  }

  /* ── Header ── */
  .header {
    flex-shrink: 0;
    background: #19B000;
    padding: 10mm 16mm 8mm;
    text-align: center;
    position: relative;
    border-bottom: 3px solid #000000;
  }

  .brand-title {
    font-size: 28pt;
    font-weight: 900;
    letter-spacing: 0.06em;
    color: #FFFFFF;
    text-transform: uppercase;
    line-height: 1.1;
    text-shadow: 2px 2px 0 rgba(0,0,0,0.2);
  }

  .brand-sub {
    font-size: 8pt;
    font-weight: 700;
    letter-spacing: 0.25em;
    color: rgba(255,255,255,0.8);
    margin-top: 1mm;
    text-transform: uppercase;
  }

  .badge-wrap {
    margin-top: 5mm;
    display: flex;
    justify-content: center;
  }

  .badge {
    display: inline-flex;
    align-items: center;
    gap: 1mm;
    padding: 2.5mm 10mm;
    background: #000000;
    color: #19B000;
    font-size: 18pt;
    font-weight: 900;
    letter-spacing: 0.06em;
    border: 2px solid #FFFFFF;
    box-shadow: 3px 3px 0 rgba(0,0,0,0.15);
  }

  .badge .hash { color: #FFFFFF; }

  /* ── Info section ── */
  .info-section {
    flex-shrink: 0;
    padding: 6mm 16mm;
    background: #FAFAF8;
    border-bottom: 2px dashed #000000;
  }

  .info-header {
    font-size: 8pt;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: #19B000;
    margin-bottom: 3mm;
  }

  .info-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2mm 8mm;
  }

  .info-cell { display: flex; flex-direction: column; }
  .info-cell.full { grid-column: 1 / -1; }

  .info-label {
    font-size: 6pt;
    font-weight: 900;
    color: #6B6357;
    text-transform: uppercase;
    letter-spacing: 0.12em;
  }

  .info-value {
    font-size: 10pt;
    font-weight: 800;
    color: #000000;
    line-height: 1.3;
  }

  .msg-box {
    margin-top: 3mm;
    padding: 3mm 4mm;
    background: #F5F1EA;
    border-left: 3px solid #25D366;
    font-size: 7pt;
    font-weight: 600;
    color: #000000;
    line-height: 1.4;
    word-break: break-word;
  }

  .msg-box .msg-label {
    font-size: 5.5pt;
    font-weight: 900;
    color: #25D366;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    display: block;
    margin-bottom: 1mm;
  }

  /* ── Items ── */
  .items-section { flex: 1; display: flex; flex-direction: column; min-height: 0; }

  .items-header-bar {
    display: flex;
    align-items: center;
    padding: 2.5mm 16mm;
    background: #000000;
    font-size: 6pt;
    font-weight: 900;
    color: #19B000;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    flex-shrink: 0;
  }
  .items-header-bar .col-name { flex: 1; }
  .items-header-bar .col-qty { width: 12mm; text-align: center; flex-shrink: 0; }
  .items-header-bar .col-price { width: 20mm; text-align: right; flex-shrink: 0; }

  .item-row {
    display: flex;
    align-items: center;
    padding: 2.5mm 16mm;
    border-bottom: 1px solid #E0E0E0;
    flex-shrink: 0;
  }

  .item-row .bar {
    flex-shrink: 0;
    width: 4px;
    height: 8mm;
    border-radius: 2px;
    margin-right: 3mm;
  }

  .item-row .name-block { flex: 1; min-width: 0; }

  .item-row .name {
    font-size: 9pt;
    font-weight: 800;
    color: #000000;
  }

  .item-row .cat {
    font-size: 5.5pt;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .item-row .qty {
    width: 12mm;
    text-align: center;
    font-size: 9pt;
    font-weight: 700;
    color: #6B6357;
    flex-shrink: 0;
  }

  .item-row .price {
    width: 20mm;
    text-align: right;
    font-size: 11pt;
    font-weight: 900;
    flex-shrink: 0;
  }

  .items-spacer { flex: 1; min-height: 3mm; }

  /* ── Total ── */
  .total-block {
    flex-shrink: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 4mm 16mm;
    background: #000000;
    border-top: 3px solid #000000;
    position: relative;
  }

  .total-block .label {
    font-size: 16pt;
    font-weight: 900;
    color: #19B000;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  .total-block .amount-wrap {
    display: flex;
    align-items: baseline;
    gap: 2mm;
  }

  .total-block .amount {
    font-size: 22pt;
    font-weight: 900;
    color: #FFFFFF;
    letter-spacing: 0.04em;
  }

  .total-block .currency {
    font-size: 8pt;
    font-weight: 900;
    color: rgba(255,255,255,0.5);
  }

  /* ── Footer ── */
  .footer {
    flex-shrink: 0;
    padding: 5mm 16mm 6mm;
    text-align: center;
    border-top: 3px solid #000000;
    background: #FAFAF8;
  }

  .footer .merci {
    font-size: 14pt;
    font-weight: 900;
    color: #000000;
    letter-spacing: 0.06em;
  }
  .footer .merci .heart { color: #19B000; }

  .footer .info {
    font-size: 7pt;
    font-weight: 600;
    color: #6B6357;
    margin-top: 1mm;
  }

  .footer .outro {
    margin-top: 2mm;
    font-size: 10pt;
    font-weight: 900;
    letter-spacing: 0.12em;
    color: #19B000;
  }

  /* ── Screen layout ── */
  @media screen {
    html, body {
      width: auto; height: auto; min-height: 100vh;
      display: flex; justify-content: center; align-items: center;
      padding: 20px; overflow: auto;
      background: linear-gradient(135deg, #E0E0E0 0%, #FAFAF8 50%, #E0E0E0 100%);
    }
    .ticket {
      width: 420px;
      min-height: 297mm;
      box-shadow: 6px 6px 0 #000000;
    }
  }

  @media screen {
    .actions {
      margin-top: 20px;
      display: flex; flex-direction: column; align-items: center; gap: 10px;
    }
    .btn-print {
      padding: 12px 36px;
      font-weight: 900; font-size: 0.85rem;
      color: #FFFFFF;
      background: #19B000;
      border: 3px solid #000000;
      box-shadow: 4px 4px 0 #000000;
      cursor: pointer;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      transition: transform 0.08s ease, box-shadow 0.08s ease;
    }
    .btn-print:hover {
      transform: translate(-2px, -2px);
      box-shadow: 6px 6px 0 #000000;
    }
    .btn-print:active {
      transform: translate(1px, 1px);
      box-shadow: 2px 2px 0 #000000;
    }
    .btn-back {
      font-size: 0.75rem; font-weight: 700;
      color: #6B6357; text-decoration: none;
      transition: color 0.1s;
    }
    .btn-back:hover { color: #000000; }
  }

  @media print {
    .actions { display: none !important; }
    html, body { width: 210mm; height: 297mm; margin: 0; padding: 0; background: #fff; }
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .ticket { box-shadow: none; width: 210mm; height: 297mm; }
  }
</style>
</head>
<body>

  <div class="ticket">
    <div class="header">
      <div class="brand-title">BETHEL GRILL</div>
      <div class="brand-sub">Cuisine &bull; Grill</div>
      <div class="badge-wrap">
        <div class="badge">
          <span class="hash">#</span>{{ $number }}
        </div>
      </div>
    </div>

    <div class="info-section">
      <div class="info-header">Commande</div>
      <div class="info-grid">
        <div class="info-cell">
          <span class="info-label">Date</span>
          <span class="info-value">{{ $dayName }} {{ $date }}</span>
        </div>
        <div class="info-cell">
          <span class="info-label">Statut</span>
          <span class="info-value" style="color:#19B000;">&#10003; Confirmee</span>
        </div>
        @if ($customerName)
        <div class="info-cell full">
          <span class="info-label">Client</span>
          <span class="info-value">{{ $customerName }}</span>
        </div>
        @endif
        @if ($customerPhone)
        <div class="info-cell full">
          <span class="info-label">Contact</span>
          <span class="info-value">{{ $customerPhone }}</span>
        </div>
        @endif
        @if ($customer)
        <div class="info-cell" style="border-top:2px dashed #000;padding-top:2mm;margin-top:2mm;">
          <span class="info-label">Fidelite</span>
          <span class="info-value" style="color:{{ $loyaltyColor }};">{{ $loyaltyTier }}</span>
        </div>
        <div class="info-cell" style="border-top:2px dashed #000;padding-top:2mm;margin-top:2mm;">
          <span class="info-label">Commandes sur Bethel Grill</span>
          <span class="info-value">{{ $orderCount }}</span>
        </div>
        @endif
      </div>
      @if ($whatsappMsg)
      <div class="msg-box">
        <span class="msg-label">Message WhatsApp</span>
        {!! nl2br(e($whatsappMsg)) !!}
      </div>
      @endif
    </div>

    <div class="items-section">
      <div class="items-header-bar">
        <span class="col-name">Plat</span>
        <span class="col-qty">Qte</span>
        <span class="col-price">Prix</span>
      </div>

      @forelse ($items as $item)
      <div class="item-row">
        <div class="bar" style="background:{{ $item['color'] }}"></div>
        <div class="name-block">
          <div class="name">{{ $item['name'] }}</div>
          <div class="cat" style="color:{{ $item['color'] }}">{{ $item['category'] }}</div>
        </div>
        <div class="qty">x{{ $item['qty'] }}</div>
        <div class="price" style="color:{{ $item['color'] }}">{{ number_format($item['total'], 0, '.', ' ') }}</div>
      </div>
      @empty
      <div style="padding:16mm;text-align:center;color:#6B6357;font-weight:600;">Aucun article</div>
      @endforelse

      <div class="items-spacer"></div>
    </div>

    <div class="total-block">
      <span class="label">Total</span>
      <div class="amount-wrap">
        <span class="amount">{{ number_format($total, 0, '.', ' ') }}</span>
        <span class="currency">FCFA</span>
      </div>
    </div>

    <div class="footer">
      <div class="merci">Merci <span class="heart">&hearts;</span></div>
      <div class="info">Un recu vous a ete envoye par WhatsApp</div>
      <div class="outro">BETHEL GRILL</div>
    </div>
  </div>

  <div class="actions">
    <button class="btn-print" id="btnPrint">Telecharger le ticket (PDF)</button>
    <a href="/" class="btn-back">&larr; Retour au menu</a>
  </div>

  <script nonce="{{ $nonce }}">
    (function() {
      var btn = document.getElementById('btnPrint');
      if (btn) {
        btn.addEventListener('click', function(e) {
          e.preventDefault();
          window.print();
        });
      }
    })();
  </script>
</body>
</html>
