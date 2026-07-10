<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; base-uri 'self'; form-action 'self'; script-src 'self' 'nonce-{{ $nonce }}'">
<meta name="referrer" content="no-referrer">
<title>Ticket #{{ $number }} - {{ $brandName }}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bangers&family=Nunito:wght@400;600;700;800;900&display=swap" rel="stylesheet">
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  @page { size: A4; margin: 0; }

  html, body {
    margin: 0;
    padding: 0;
    background: #EDE8DC;
    font-family: 'Nunito', sans-serif;
  }

  .ticket {
    width: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
    background: #FDFBF7;
  }

  /* ── orbs floues ── */
  .orb {
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
    z-index: 0;
  }
  .orb-1 { width: 280px; height: 280px; background: radial-gradient(circle, #E53E30 0%, transparent 70%); top: -80px; right: -60px; opacity: 0.12; }
  .orb-2 { width: 200px; height: 200px; background: radial-gradient(circle, #2D8B46 0%, transparent 70%); top: 35%; left: -80px; opacity: 0.1; }
  .orb-3 { width: 180px; height: 180px; background: radial-gradient(circle, #D4AF37 0%, transparent 70%); bottom: 35%; right: -60px; opacity: 0.11; }
  .orb-4 { width: 150px; height: 150px; background: radial-gradient(circle, #D81B60 0%, transparent 70%); bottom: -50px; left: 30%; opacity: 0.12; }
  .orb-5 { width: 120px; height: 120px; background: radial-gradient(circle, #1976D2 0%, transparent 70%); top: 15%; left: 60%; opacity: 0.08; }

  /* ── bandes haut/bas ── */
  .strip {
    flex-shrink: 0;
    height: 10mm;
    background: linear-gradient(90deg, #9B1B30 0%, #D4AF37 25%, #9B1B30 50%, #D4AF37 75%, #9B1B30 100%);
    position: relative;
    z-index: 1;
  }

  .strip.bottom {
    background: linear-gradient(90deg, #D4AF37 0%, #9B1B30 25%, #D4AF37 50%, #9B1B30 75%, #D4AF37 100%);
  }

  /* ── header ── */
  .header {
    flex-shrink: 0;
    background: linear-gradient(135deg, #9B1B30 0%, #8B1528 30%, #B8203A 70%, #D4AF37 100%);
    padding: 14mm 20mm 12mm;
    text-align: center;
    position: relative;
    z-index: 1;
    border-bottom: 3px solid #1D1D1D;
  }

  .brand-title {
    font-family: 'Bangers', cursive;
    font-size: 36pt;
    letter-spacing: 0.08em;
    color: #fff;
    text-shadow: 3px 3px 0 rgba(0,0,0,0.25);
    line-height: 1.1;
  }

  .brand-title .gold { color: #D4AF37; }

  .brand-sub {
    font-family: 'Bangers', cursive;
    font-size: 11pt;
    letter-spacing: 0.35em;
    color: rgba(255,255,255,0.8);
    margin-top: 2px;
  }

  .badge-wrap {
    margin-top: 8mm;
    display: flex;
    justify-content: center;
  }

  .badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 3mm 14mm;
    background: #1D1D1D;
    color: #D4AF37;
    font-family: 'Bangers', cursive;
    font-size: 22pt;
    letter-spacing: 0.06em;
    border: 3px solid #fff;
    box-shadow: 5px 5px 0 rgba(0,0,0,0.3);
  }

  .badge .hash { color: #fff; }

  /* ── body (prend tout l'espace restant) ── */
  .body {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 0;
    position: relative;
    z-index: 1;
    min-height: 0;
  }

  /* ── infos client ── */
  .info-section {
    flex-shrink: 0;
    padding: 8mm 20mm;
    background: linear-gradient(180deg, #FDFBF7 0%, #F8F4EC 100%);
    border-bottom: 2px dashed #D4C9B0;
  }

  .info-header {
    font-family: 'Bangers', cursive;
    font-size: 10pt;
    letter-spacing: 0.2em;
    color: #9B1B30;
    margin-bottom: 4mm;
    text-transform: uppercase;
  }

  .info-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2mm 10mm;
  }

  .info-cell { display: flex; flex-direction: column; }
  .info-cell.full { grid-column: 1 / -1; }

  .info-label {
    font-size: 7pt;
    font-weight: 900;
    color: #888072;
    text-transform: uppercase;
    letter-spacing: 0.15em;
  }

  .info-value {
    font-size: 11pt;
    font-weight: 800;
    color: #1D1D1D;
    line-height: 1.3;
  }

  .msg-box {
    margin-top: 3mm;
    padding: 3mm 4mm;
    background: #F4F1EA;
    border-left: 3px solid #25D366;
    font-size: 8pt;
    font-weight: 600;
    color: #1D1D1D;
    line-height: 1.4;
    word-break: break-word;
  }

  .msg-box .msg-label {
    font-size: 6pt;
    font-weight: 900;
    color: #25D366;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    display: block;
    margin-bottom: 1mm;
  }

  /* ── items ── */
  .items-section {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0;
  }

  .items-scroll {
    flex: 1;
    overflow-y: auto;
  }

  .items-header-bar {
    display: flex;
    align-items: center;
    padding: 3mm 20mm;
    background: #1D1D1D;
    font-size: 7pt;
    font-weight: 900;
    color: #D4AF37;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    flex-shrink: 0;
  }
  .items-header-bar .col-name { flex: 1; }
  .items-header-bar .col-qty  { width: 14mm; text-align: center; flex-shrink: 0; }
  .items-header-bar .col-price { width: 22mm; text-align: right; flex-shrink: 0; }

  .item-row {
    display: flex;
    align-items: center;
    padding: 3mm 20mm;
    border-bottom: 1px solid #E5DCC6;
    flex-shrink: 0;
  }

  .item-row .bar {
    flex-shrink: 0;
    width: 4px;
    height: 10mm;
    border-radius: 2px;
    margin-right: 4mm;
  }

  .item-row .name-block {
    flex: 1;
    min-width: 0;
  }

  .item-row .name {
    font-size: 10pt;
    font-weight: 800;
    color: #1D1D1D;
  }

  .item-row .cat {
    font-size: 6.5pt;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  .item-row .qty {
    width: 14mm;
    text-align: center;
    font-size: 10pt;
    font-weight: 700;
    color: #6B6357;
    flex-shrink: 0;
  }

  .item-row .price {
    width: 22mm;
    text-align: right;
    font-family: 'Bangers', cursive;
    font-size: 13pt;
    letter-spacing: 0.04em;
    flex-shrink: 0;
  }

  .items-spacer {
    flex: 1;
    min-height: 4mm;
  }

  /* ── total ── */
  .total-block {
    flex-shrink: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5mm 20mm;
    background: linear-gradient(135deg, #1B4D3E 0%, #0F3329 100%);
    border-top: 3px solid #1D1D1D;
    border-bottom: 3px solid #1D1D1D;
    position: relative;
    z-index: 1;
  }

  .total-block .label {
    font-family: 'Bangers', cursive;
    font-size: 22pt;
    color: #D4AF37;
    letter-spacing: 0.06em;
  }

  .total-block .amount-wrap {
    display: flex;
    align-items: baseline;
    gap: 3mm;
  }

  .total-block .amount {
    font-family: 'Bangers', cursive;
    font-size: 28pt;
    color: #fff;
    letter-spacing: 0.04em;
  }

  .total-block .currency {
    font-size: 9pt;
    font-weight: 900;
    color: rgba(255,255,255,0.6);
  }

  /* ── footer ── */
  .footer {
    flex-shrink: 0;
    padding: 6mm 20mm 8mm;
    text-align: center;
    position: relative;
    z-index: 1;
  }

  .footer .merci {
    font-family: 'Bangers', cursive;
    font-size: 18pt;
    color: #1D1D1D;
    letter-spacing: 0.08em;
  }
  .footer .merci .heart { color: #9B1B30; }

  .footer .info {
    font-size: 9pt;
    font-weight: 600;
    color: #6B6357;
    margin-top: 1mm;
  }

  .footer .outro {
    margin-top: 3mm;
    font-family: 'Bangers', cursive;
    font-size: 14pt;
    letter-spacing: 0.15em;
    background: linear-gradient(135deg, #9B1B30 30%, #D4AF37 70%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  /* ── ecran (centré, dimensionné) ── */
  @media screen {
    html, body {
      width: auto;
      height: auto;
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px;
      overflow: auto;
      background: linear-gradient(135deg, #D4C9B0 0%, #EDE8DC 50%, #D4C9B0 100%);
    }
    .ticket {
      width: 420px;
      min-height: 297mm;
      box-shadow: 8px 8px 0 #1D1D1D;
      border: 3px solid #1D1D1D;
    }
  }

  /* ── actions ── */
  @media screen {
    .actions {
      margin-top: 24px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
    }

    .btn-print {
      padding: 14px 40px;
      font-family: 'Nunito', sans-serif;
      font-weight: 900;
      font-size: 0.9rem;
      color: #fff;
      background: #9B1B30;
      border: 3px solid #1D1D1D;
      box-shadow: 5px 5px 0 #1D1D1D;
      cursor: pointer;
      transition: transform 0.08s ease, box-shadow 0.08s ease;
    }

    .btn-print:hover {
      transform: translate(-2px, -2px);
      box-shadow: 7px 7px 0 #1D1D1D;
    }

    .btn-print:active {
      transform: translate(1px, 1px);
      box-shadow: 3px 3px 0 #1D1D1D;
    }

    .btn-back {
      font-size: 0.8rem;
      font-weight: 700;
      color: #6B6357;
      text-decoration: none;
      font-family: 'Nunito', sans-serif;
      transition: color 0.1s;
    }
    .btn-back:hover { color: #1D1D1D; }
  }

  @media print {
    .actions { display: none !important; }
    html, body { width: 210mm; height: 297mm; margin: 0; padding: 0; background: #fff; }
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .ticket { box-shadow: none; border: none; width: 210mm; height: 297mm; }
    .orb { opacity: 0.1 !important; }
    .strip, .header, .total-block, .items-header-bar {
      -webkit-print-color-adjust: exact; print-color-adjust: exact;
    }
    .footer .outro { -webkit-text-fill-color: #9B1B30; color: #9B1B30; background: none; }
    .brand-title { -webkit-text-fill-color: #fff; color: #fff; }
  }
</style>
</head>
<body>

  <div class="ticket">
    <div class="orb orb-1"></div>
    <div class="orb orb-2"></div>
    <div class="orb orb-3"></div>
    <div class="orb orb-4"></div>
    <div class="orb orb-5"></div>

    <div class="strip"></div>

    <div class="header">
      <div class="brand-title">BETHEL <span class="gold">KITCHEN</span></div>
      <div class="brand-sub">C U I S I N E  &bull;  G R I L L</div>
      <div class="badge-wrap">
        <div class="badge">
          <span class="hash">#</span>{{ $number }}
        </div>
      </div>
    </div>

    <div class="body">
      <div class="info-section">
        <div class="info-header">Commande</div>
        <div class="info-grid">
          <div class="info-cell">
            <span class="info-label">Date</span>
            <span class="info-value">{{ $dayName }} {{ $date }}</span>
          </div>
          <div class="info-cell">
            <span class="info-label">Statut</span>
            <span class="info-value" style="color:#1B4D3E;">&#10003; Confirmée</span>
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
          <div class="info-cell" style="border-top:2px dashed #D4C9B0;padding-top:2mm;margin-top:2mm;">
            <span class="info-label">Fidélité</span>
            <span class="info-value" style="color:{{ $loyaltyColor }};">{{ $loyaltyTier }}</span>
          </div>
          <div class="info-cell" style="border-top:2px dashed #D4C9B0;padding-top:2mm;margin-top:2mm;">
            <span class="info-label">Nombre de commandes sur Bethel Kitchen</span>
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

        <div class="items-scroll">
        @forelse ($items as $item)
        <div class="item-row" style="background:{{ $item['lightBg'] }}">
          <div class="bar" style="background:{{ $item['color'] }}"></div>
          <div class="name-block">
            <div class="name">{{ $item['name'] }}</div>
            <div class="cat" style="color:{{ $item['color'] }}">{{ $item['category'] }}</div>
          </div>
          <div class="qty">x{{ $item['qty'] }}</div>
          <div class="price" style="color:{{ $item['color'] }}">{{ number_format($item['total'], 0, '.', ' ') }}</div>
        </div>
        @empty
        <div style="padding:20mm;text-align:center;color:#6B6357;font-weight:600;">Aucun article</div>
        @endforelse
        </div>

        <div class="items-spacer"></div>
      </div>
    </div>

    <div class="total-block">
      <span class="label">TOTAL</span>
      <div class="amount-wrap">
        <span class="amount">{{ number_format($total, 0, '.', ' ') }}</span>
        <span class="currency">FCFA</span>
      </div>
    </div>

    <div class="footer">
      <div class="merci">Merci <span class="heart">&hearts;</span></div>
      <div class="info">Un reçu vous a été envoyé par WhatsApp</div>
      <div class="outro">BETHEL KITCHEN</div>
    </div>

    <div class="strip bottom"></div>
  </div>

  <div class="actions">
    <button class="btn-print" id="btnPrint">Télécharger le ticket (PDF)</button>
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
      setTimeout(function() { window.print(); }, 700);
    })();
  </script>
</body>
</html>
