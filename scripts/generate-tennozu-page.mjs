import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const root = process.cwd();
const theater = {
  name: "天王洲 銀河劇場",
  title: "天王洲 銀河劇場近くのホテル｜徒歩時間・料金・終演後の戻りやすさを比較",
  h1: "天王洲 銀河劇場近くのホテル｜徒歩圏・料金・観劇後の帰りやすさを比較",
  description:
    "天王洲 銀河劇場近くのホテルを、劇場までの徒歩時間、料金目安、最寄り駅、終演後の戻りやすさで比較。近さ重視、料金重視、1人遠征向けなど、観劇予定に合わせて宿泊先を選べます。",
  url: "https://mainitiworakunisuru.com/theaters/tennozu-galaxy-theatre/",
  address: "東京都品川区東品川2丁目3-16",
  building: "シーフォートスクエア内",
  nearest: "東京モノレール 天王洲アイル駅 / りんかい線 天王洲アイル駅",
  updatedAt: "2026年7月",
  priceNote:
    "料金は2026年7月時点で、約1か月先の平日・素泊まり・税込価格を中心に確認した目安です。公演日、土曜日、連休、繁忙期は料金が大きく変わる場合があります。",
};

const venueMap = "https://www.google.com/maps/search/?api=1&query=%E5%A4%A9%E7%8E%8B%E6%B4%B2%20%E9%8A%80%E6%B2%B3%E5%8A%87%E5%A0%B4";
const venueOfficialUrl = "https://www.gingeki.jp/";

const hotels = [];

const picks = [];

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function routeUrl(hotel) {
  const origin = encodeURIComponent(hotel.address);
  const destination = encodeURIComponent(theater.address);
  return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=${hotel.routeMode}`;
}

function jalanUrl(hotel) {
  return `https://www.jalan.net/uw/uwp2011/uww2011init.do?keyword=${encodeURIComponent(hotel.name)}`;
}

function rakutenUrl(hotel) {
  return `https://kw.travel.rakuten.co.jp/keyword/Search.do?charset=utf-8&f_max=30&f_query=${encodeURIComponent(hotel.name)}`;
}

function bookingButtons(hotel) {
  return `<div class="booking-links" aria-label="${escapeHtml(hotel.name)}の予約サイト">
    <a class="primary-cta booking-cta jalan-cta external-link" href="${jalanUrl(hotel)}" target="_blank" rel="noopener noreferrer">じゃらんで見る <span aria-hidden="true">↗</span></a>
    <a class="primary-cta booking-cta rakuten-cta external-link" href="${rakutenUrl(hotel)}" target="_blank" rel="noopener noreferrer">楽天トラベルで見る <span aria-hidden="true">↗</span></a>
  </div>`;
}

function badgeHtml(hotel, limit = 2) {
  return hotel.badges.slice(0, limit).map((badge) => `<span class="badge">${escapeHtml(badge)}</span>`).join("");
}

function miniFacts(hotel) {
  return `<dl class="mini-facts">
    <div><dt>劇場まで</dt><dd>${escapeHtml(hotel.distance)}</dd></div>
    <div><dt>料金目安</dt><dd>${escapeHtml(hotel.priceTwin)}</dd></div>
    <div><dt>最寄り駅</dt><dd>${escapeHtml(hotel.stationLines[0])}</dd></div>
    <div><dt>向いている人</dt><dd>${escapeHtml(hotel.bestFor)}</dd></div>
  </dl>`;
}

function pickCard(pick) {
  const hotel = hotels.find((item) => item.id === pick.hotelId);
  return `<a class="pick-card" href="#${hotel.id}" aria-label="${escapeHtml(hotel.name)}のホテル情報へ移動">
    <p class="card-label">${escapeHtml(pick.label)}</p>
    <h3>${escapeHtml(hotel.name)}</h3>
    <p>${escapeHtml(hotel.distance)}</p>
    <span>ホテル情報を見る</span>
  </a>`;
}

function mobilePickCard(pick) {
  const hotel = hotels.find((item) => item.id === pick.hotelId);
  return `<article class="mobile-pick-card">
    <p class="card-label">${escapeHtml(pick.label)}</p>
    <h3><a href="#${hotel.id}">${escapeHtml(hotel.name)}</a></h3>
    <div class="badge-row">${badgeHtml(hotel, 3)}</div>
    <dl class="mobile-pick-facts">
      <div><dt>劇場まで</dt><dd>${escapeHtml(hotel.distance)}</dd></div>
      <div><dt>料金目安</dt><dd>${escapeHtml(hotel.priceTwin)}</dd></div>
    </dl>
    <p class="mobile-pick-fit"><b>向いている人</b>${escapeHtml(hotel.bestFor)}</p>
    ${bookingButtons(hotel)}
    <a class="sub-cta" href="${routeUrl(hotel)}" target="_blank" rel="noopener noreferrer">劇場からの徒歩ルートを見る <span aria-hidden="true">↗</span></a>
  </article>`;
}

function returnEaseLevel(hotel) {
  if (hotel.routeMode !== "walking" || hotel.distance.includes("18〜22") || hotel.distance.includes("22〜25")) return "徒歩移動は長め";
  if (hotel.distance.includes("13〜16")) return "天候次第";
  return "戻りやすい";
}

function compareCard(hotel) {
  return `<article class="compare-card">
    <a class="compare-title" href="#${hotel.id}">${escapeHtml(hotel.name)}</a>
    ${badgeHtml(hotel, 3)}
    ${miniFacts(hotel)}
    <details>
      <summary><span class="summary-closed">比較項目をもっと見る</span><span class="summary-open">比較項目を閉じる</span></summary>
      <dl class="detail-list">
        <div><dt>1名料金</dt><dd>${escapeHtml(hotel.priceSingle)}</dd></div>
        <div><dt>1名あたり</dt><dd>${escapeHtml(hotel.perPerson)}</dd></div>
        <div><dt>駅・出口の補足</dt><dd>${hotel.stationLines.map(escapeHtml).join("<br>")}</dd></div>
        <div><dt>補足情報</dt><dd>${escapeHtml(hotel.movementNote)}</dd></div>
      </dl>
    </details>
  </article>`;
}

function tableRow(hotel) {
  return `<tr>
    <th scope="row"><a href="#${hotel.id}">${escapeHtml(hotel.name)}</a></th>
    <td>${escapeHtml(hotel.distance)}</td>
    <td>${escapeHtml(hotel.priceSingle)}</td>
    <td>${escapeHtml(hotel.priceTwin)}</td>
    <td>${hotel.stationLines.map(escapeHtml).join("<br>")}</td>
    <td>${escapeHtml(hotel.bestFor)}</td>
    <td><a href="#${hotel.id}">詳細へ</a></td>
  </tr>`;
}

function hotelCard(hotel, index) {
  const imageMarkup = hotel.image
    ? `<img src="${hotel.image}" alt="${escapeHtml(hotel.name)}の外観" loading="lazy" width="640" height="480">`
    : "";
  const mobileImage = imageMarkup ? `<div class="hotel-image mobile-card-image">${imageMarkup}</div>` : "";
  const actionImage = imageMarkup ? `<div class="hotel-image action-image">${imageMarkup}</div>` : "";
  const routeLabel = hotel.routeMode === "walking" ? "徒歩ルートを見る" : "劇場までのルートを見る";
  const mobileRouteLabel = hotel.routeMode === "walking" ? "劇場からの徒歩ルートを見る" : "劇場までのルートを見る";
  return `<article id="${hotel.id}" class="hotel-card">
    <div class="hotel-main">
      ${mobileImage}
      <p class="card-label">候補 ${index + 1} / ${escapeHtml(hotel.category)}</p>
      <h3>${escapeHtml(hotel.name)}</h3>
      <div class="badge-row">${badgeHtml(hotel)}</div>
      <dl class="summary-facts">
        <div><dt>劇場まで</dt><dd>${escapeHtml(hotel.distance)}</dd></div>
        <div><dt>料金目安</dt><dd>${escapeHtml(hotel.priceTwin)}</dd></div>
      </dl>
      <section class="hotel-fit"><h4>このホテルが向いている人</h4><p>${escapeHtml(hotel.bestFor)}</p></section>
      <section class="hotel-merits"><h4>メリット</h4><ul>${hotel.merits.slice(0, 3).map((merit) => `<li>${escapeHtml(merit)}</li>`).join("")}</ul></section>
      <p class="caution"><b>注意点</b>${escapeHtml(hotel.caution)}</p>
      <section class="return-ease"><h4>終演後の戻りやすさ：${returnEaseLevel(hotel)}</h4><p>${escapeHtml(hotel.returnEase)}</p></section>
      <details class="hotel-details" open>
        <summary aria-label="${escapeHtml(hotel.name)}のホテル情報を詳しく見る"><span class="summary-closed">ホテル情報を詳しく見る</span><span class="summary-open">ホテル情報を閉じる</span></summary>
        <dl class="detail-list">
          <div><dt>路線別の駅情報</dt><dd>${hotel.stationLines.map(escapeHtml).join("<br>")}</dd></div>
          <div><dt>移動時の注意点</dt><dd>${escapeHtml(hotel.movementNote)}</dd></div>
          <div><dt>補足</dt><dd>${hotel.details.map(escapeHtml).join("<br>")}</dd></div>
        </dl>
      </details>
      <div class="mobile-actions">
        ${bookingButtons(hotel)}
        <a class="sub-cta" href="${routeUrl(hotel)}" target="_blank" rel="noopener noreferrer">${mobileRouteLabel} <span aria-hidden="true">↗</span></a>
      </div>
    </div>
    <div class="hotel-actions">
      ${actionImage}
      <div class="price-box"><span>料金目安</span><b>${escapeHtml(hotel.priceTwin)}</b><small>${escapeHtml(hotel.perPerson)}</small></div>
      ${bookingButtons(hotel)}
      <a class="sub-cta" href="${routeUrl(hotel)}" target="_blank" rel="noopener noreferrer">${routeLabel}</a>
    </div>
  </article>`;
}

const style = `:root{--text:#171317;--muted:#625a60;--primary:#e54887;--primary-dark:#be2867;--border:#ead7df;--soft:#fff1f6;--shadow:0 16px 42px rgba(88,46,67,.1)}*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;color:var(--text);font-family:"Noto Sans JP","Hiragino Kaku Gothic ProN","Yu Gothic",system-ui,sans-serif;line-height:1.8;background:#fff}a{color:inherit}.container{width:min(calc(100% - 32px),1120px);margin:0 auto}.header{position:sticky;top:0;z-index:10;background:rgba(255,255,255,.96);border-bottom:1px solid #f5c9d9}.header-inner{min-height:72px;display:flex;align-items:center;justify-content:space-between;gap:20px}.brand{display:inline-flex;align-items:center;gap:10px;font-weight:900;font-size:20px;line-height:1.1;text-decoration:none}.brand-mark{width:40px;height:40px;display:grid;place-items:center;border-radius:12px 12px 12px 3px;background:var(--primary);color:white;font:italic 25px Georgia,serif}.brand small{display:block;margin-top:4px;color:var(--muted);font-size:9px;letter-spacing:.12em}.nav{display:flex;gap:24px;font-size:14px;font-weight:800}.breadcrumbs{padding-top:24px;color:var(--muted);font-size:13px}.breadcrumbs a{color:var(--primary-dark);font-weight:800}.hero{padding:34px 0 22px}.hero-grid{display:grid;grid-template-columns:minmax(0,1.08fr) minmax(300px,.92fr);gap:28px;align-items:start}.eyebrow{margin:0 0 10px;color:var(--primary-dark);font-size:12px;letter-spacing:.13em;font-weight:900}h1{margin:0;font-size:clamp(32px,4.6vw,50px);line-height:1.3;letter-spacing:-.04em}.lead{margin:18px 0 0;color:var(--muted)}.hero-note{margin-top:18px;padding:14px;border:1px solid var(--border);border-radius:14px;background:#fff7fa}.facts-card,.toc,.notice,.pick-card,.compare-card,.hotel-card,.venue-card,.choice-card{border:1px solid var(--border);border-radius:18px;background:#fff;box-shadow:var(--shadow)}.facts-card{padding:20px}.facts-card h2,.toc h2,.notice h2{margin:0 0 10px;font-size:18px}.detail-list,.mini-facts{display:grid;gap:10px;margin:0}.detail-list div,.mini-facts div{padding:10px;border-radius:12px;background:#fff7fa}.detail-list dt,.mini-facts dt{color:var(--muted);font-size:12px;font-weight:800}.detail-list dd,.mini-facts dd{margin:2px 0 0;font-weight:800}.toc{margin:22px auto 34px;padding:20px;max-width:820px}.overview-list{display:grid;gap:12px;margin:14px 0 0;padding:0;list-style:none}.overview-list a{display:block;padding:14px;border-radius:14px;background:#fff7fa;color:var(--text);font-weight:900;text-decoration:none}.overview-list span{display:block;margin-top:3px;color:var(--muted);font-size:14px;font-weight:500}.section{padding:34px 0;border-top:1px solid #f5dbe5;scroll-margin-top:96px}.section-title{margin:0 0 10px;padding-left:12px;border-left:5px solid var(--primary);font-size:clamp(24px,3vw,32px);line-height:1.45}.section-lead{margin:0 0 20px;color:var(--muted)}.notice{padding:18px;margin:0 0 22px}.pick-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}.pick-card,.compare-card{padding:18px}.card-label{margin:0 0 6px;color:var(--primary-dark);font-size:12px;font-weight:900;letter-spacing:.04em}.pick-card h3,.hotel-card h3{margin:0 0 10px;font-size:22px;line-height:1.45}.badge-row,.pick-card .badge{margin-right:6px}.badge{display:inline-flex;margin:0 6px 6px 0;padding:5px 9px;border-radius:999px;background:#fff1f6;color:var(--primary-dark);font-size:12px;font-weight:900}.reason{margin:14px 0 8px}.caution{margin:0;color:var(--muted)}.caution b{display:block;color:var(--text)}.card-actions,.hotel-actions{display:grid;gap:10px;margin-top:14px}.primary-cta,.sub-cta{min-height:48px;display:grid;place-items:center;padding:10px 14px;border-radius:12px;font-weight:900;text-align:center;text-decoration:none}.primary-cta{background:var(--primary);color:#fff}.sub-cta{border:1.5px solid var(--primary);color:var(--primary-dark);background:#fff}.comparison-desktop{overflow-x:auto}.comparison-table{width:100%;border-collapse:separate;border-spacing:0;min-width:940px}.comparison-table th,.comparison-table td{padding:13px;border-bottom:1px solid var(--border);vertical-align:top;text-align:left}.comparison-table thead th{background:#fff7fa;color:var(--primary-dark);font-size:13px}.comparison-table a{color:var(--primary-dark);font-weight:900}.comparison-mobile{display:none}.compare-title{display:block;margin-bottom:8px;color:var(--primary-dark);font-size:18px;font-weight:900;text-decoration:none}.hotel-list{display:grid;gap:18px}.hotel-card{display:grid;grid-template-columns:minmax(0,1fr) 260px;gap:20px;padding:20px}.hotel-image-placeholder{display:none;min-height:170px;overflow:hidden;border:1px dashed var(--border);border-radius:16px;background:linear-gradient(135deg,#fff7fa,#f8eef3);color:var(--muted);font-weight:900;place-items:center;text-align:center}.hotel-image-placeholder img{width:100%;height:100%;display:block;object-fit:cover}.action-image{display:grid;min-height:150px}.hotel-body{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:14px}.hotel-body section{padding:12px;border-radius:14px;background:#fff7fa}.hotel-body h4{margin:0 0 4px;font-size:14px}.hotel-body p,.hotel-body ul{margin:0;color:var(--muted)}.hotel-body ul{padding-left:1.2em}.hotel-details{margin-top:12px}.hotel-details summary,.compare-card summary{cursor:pointer;color:var(--primary-dark);font-weight:900}.price-box{padding:10px 12px;border-radius:14px;background:#fff7fa}.price-box span,.price-box small{display:block;color:var(--muted);font-size:11px;line-height:1.45}.price-box b{display:block;margin:2px 0;font-size:16px;line-height:1.35}.hotel-actions .primary-cta,.hotel-actions .sub-cta{min-height:46px}.venue-grid,.choice-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:14px}.venue-card,.choice-card{padding:18px}.venue-card h3,.choice-card h3{margin:0 0 8px}.venue-card p,.choice-card p{margin:0;color:var(--muted)}footer{margin-top:40px;padding:38px 0;background:#171317;color:#fff}footer p{color:#cfc6cb;font-size:13px}@media(max-width:900px){.nav{display:none}.hero-grid,.pick-grid,.hotel-card,.venue-grid,.choice-grid{grid-template-columns:1fr}.hotel-actions{grid-row:auto}.hotel-body{grid-template-columns:1fr}.comparison-desktop{display:none}.comparison-mobile{display:grid;gap:12px}.hotel-main>.hotel-image-placeholder{display:grid}.action-image{display:none}.hotel-actions{margin-top:10px}}@media(max-width:640px){.container{width:min(calc(100% - 24px),1120px)}.header-inner{min-height:64px}.brand{font-size:16px}.brand-mark{width:34px;height:34px;font-size:21px}.hero{padding-top:24px}h1{font-size:30px}.toc,.facts-card,.notice,.pick-card,.compare-card,.hotel-card,.venue-card,.choice-card{border-radius:16px}.section{padding:28px 0}.section-title{font-size:23px}.pick-card h3,.hotel-card h3{font-size:20px}.primary-cta,.sub-cta{min-height:50px}.hotel-image-placeholder{min-height:180px;margin-bottom:16px}.price-box{padding:13px}.price-box b{font-size:18px}}`;

const mobileUiStyle = `.pick-card{display:block;color:var(--text);text-decoration:none}.pick-card p{margin:0;color:var(--muted)}.pick-card>span{display:inline-block;margin-top:8px;color:var(--primary-dark);font-weight:900}.summary-facts{display:grid;gap:8px;margin:0 0 12px}.summary-facts div{padding:12px 14px;border-radius:12px;background:#fff7fa}.summary-facts dt{color:var(--muted);font-size:12px;font-weight:900}.summary-facts dd{margin:2px 0 0;font-size:18px;font-weight:900}.fit-for{margin:0 0 8px;font-weight:900}.caution{padding:8px 10px;border-radius:10px;background:#fff8ec;color:#6c4a00;font-size:14px;line-height:1.6}.caution b{color:#6c4a00}.mobile-actions{display:none}.hotel-image{overflow:hidden;border-radius:14px}.hotel-image img{display:block;width:100%;aspect-ratio:4/3;object-fit:cover}.mobile-card-image{display:none}.hotel-details .summary-open,.compare-card details .summary-open{display:none}.hotel-details[open] .summary-closed,.compare-card details[open] .summary-closed{display:none}.hotel-details[open] .summary-open,.compare-card details[open] .summary-open{display:inline}.hotel-card{scroll-margin-top:96px}.section{scroll-margin-top:96px}.hotel-actions{align-content:start;align-self:start}.hotel-actions .action-image{height:240px;min-height:0;align-self:start;margin:0 0 10px}.hotel-actions .action-image img{height:100%;aspect-ratio:auto}.booking-links{display:grid;gap:8px}.booking-cta{min-height:46px}.jalan-cta{background:#e54887}.rakuten-cta{background:#bf0000}.jalan-cta:hover{background:#c92f70}.rakuten-cta:hover{background:#980000}.price-box{min-height:auto}@media(max-width:900px){.pick-grid{gap:8px}.pick-card{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:2px 12px;padding:12px 14px;align-items:center}.pick-card .card-label{grid-column:1/-1;margin:0}.pick-card h3{margin:0;font-size:16px;line-height:1.45}.pick-card p{font-size:13px}.pick-card>span{margin:0;font-size:13px}.hotel-card{gap:0;padding:16px}.hotel-actions{display:none}.mobile-actions{display:grid;gap:10px;margin-top:16px}.mobile-card-image{display:block;margin:0 0 14px}.hotel-main>.hotel-image-placeholder{display:none}.hotel-details summary{min-height:44px}.summary-facts dd{font-size:17px}.section-lead{margin-bottom:14px}.hotel-list{gap:16px}}@media(max-width:640px){.section{padding:22px 0}.section-title{font-size:22px;margin-bottom:8px}.section-lead{font-size:14px;line-height:1.7}.hotel-card h3{font-size:21px;line-height:1.38}.badge{font-size:12px;padding:4px 8px}.summary-facts div{padding:10px 12px}.primary-cta,.sub-cta{min-height:48px}.hotel-image img{height:auto}.toc{margin-bottom:22px}}`;

const mobileSpecStyle = `
.mobile-only{display:none}
.mobile-pick-list{display:none}
.hotel-fit,.hotel-merits,.return-ease{display:none}
.hotel-details>summary{display:none}
details:not([open])>:not(summary){display:none!important}
@media(max-width:767px){
  body{font-size:15px;line-height:1.8;overflow-x:hidden}
  .container{width:calc(100% - 32px)}
  .mobile-only{display:block}
  .desktop-only-mobile-hide{display:none!important}
  .breadcrumbs{padding-top:14px;font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .hero{padding:20px 0 8px}
  .hero-grid{display:block}
  .eyebrow{margin-bottom:8px}
  .desktop-page-title,.desktop-lead,.desktop-price-note,.facts-card{display:none}
  .mobile-page-title{display:block;margin:0;font-size:26px;line-height:1.4;font-weight:700;letter-spacing:0}
  .mobile-page-title span{display:block}
  .mobile-lead{display:block;margin-top:12px;color:var(--muted);font-size:15px;line-height:1.8}
  .mobile-lead p{margin:0 0 8px}
  .mobile-price-note{display:block;margin:12px 0 16px;padding:10px 12px;border:0;border-radius:8px;background:#f4f2f3;color:var(--muted);font-size:12px;line-height:1.6}
  .mobile-price-note b{display:block;color:var(--text);font-size:12px}
  .conclusion-card{margin-top:8px;padding:16px;border:1px solid var(--border);border-radius:12px;background:#fff;box-shadow:var(--shadow)}
  .conclusion-card h2{margin:0 0 4px;font-size:22px}
  .conclusion-card>p{margin:0 0 6px;color:var(--muted);font-size:13px}
  .conclusion-item{display:grid;gap:2px;min-height:44px;padding:14px 0;border-top:1px solid #f1e4e9;text-decoration:none}
  .conclusion-item:first-of-type{border-top:0}
  .conclusion-item span{color:var(--primary-dark);font-size:12px;font-weight:900}
  .conclusion-item b{font-size:16px;line-height:1.5}
  .conclusion-item strong{font-size:20px;line-height:1.4}
  .conclusion-item small{color:var(--muted);font-size:14px}
  .toc{display:none}
  .mobile-toc{margin:16px auto 48px;border:1px solid var(--border);border-radius:12px;background:#fff}
  .mobile-toc summary{min-height:52px;display:flex;align-items:center;justify-content:space-between;padding:0 16px;cursor:pointer;font-weight:800;list-style:none}
  .mobile-toc summary::-webkit-details-marker{display:none}
  .mobile-toc summary::after{content:"＋";font-size:20px;color:var(--primary-dark)}
  .mobile-toc[open] summary::after{content:"−"}
  .mobile-toc ul{margin:0;padding:0 16px 12px;list-style:none}
  .mobile-toc a{min-height:44px;display:flex;align-items:center;border-top:1px solid #f1e4e9;color:var(--primary-dark);font-weight:700;text-decoration:none}
  .section{padding:0 0 52px;border-top:0}
  .section-title{margin:0 0 16px;padding:0;border-left:0;font-size:22px;line-height:1.5;letter-spacing:0}
  .section-lead{margin:0 0 16px;font-size:15px}
  .pick-grid{display:none}
  .mobile-pick-list{display:grid;gap:16px}
  .mobile-pick-card{padding:16px;border:1px solid var(--border);border-radius:12px;background:#fff;box-shadow:var(--shadow)}
  .mobile-pick-card h3{margin:4px 0 8px;font-size:17px;line-height:1.5}
  .mobile-pick-card h3 a{text-decoration:none}
  .mobile-pick-facts{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:10px 0}
  .mobile-pick-facts div{padding:10px;border-radius:10px;background:#fff7fa}
  .mobile-pick-facts dt{color:var(--muted);font-size:12px;font-weight:700}
  .mobile-pick-facts dd{margin:2px 0 0;font-size:14px;font-weight:800}
  .mobile-pick-facts div:first-child dd{font-size:20px}
  .mobile-pick-fit{margin:10px 0 16px;font-size:14px;line-height:1.7}
  .mobile-pick-fit b{display:block;font-size:12px;color:var(--muted)}
  .comparison-desktop{display:none}
  .comparison-mobile{display:grid;gap:16px}
  .notice{padding:12px;margin-bottom:16px;border-radius:10px;box-shadow:none}
  #comparison .notice{display:none}
  .notice h2{font-size:16px}
  .notice p{margin:0;font-size:13px;line-height:1.7}
  .compare-card{padding:16px;border-radius:12px;box-shadow:var(--shadow)}
  .compare-title{font-size:17px;line-height:1.5}
  .mini-facts{gap:8px;margin-top:10px}
  .mini-facts div{padding:10px 12px}
  .mini-facts dt{font-size:12px}
  .mini-facts dd{font-size:14px;line-height:1.65}
  .mini-facts div:first-child dd{font-size:22px}
  .compare-card details summary{min-height:44px;display:flex;align-items:center;color:var(--primary-dark);cursor:pointer;font-weight:800}
  .hotel-card{padding:16px;border-radius:12px;box-shadow:var(--shadow)}
  .hotel-card h3{margin:4px 0 10px;font-size:17px;line-height:1.5;overflow-wrap:break-word;word-break:normal}
  .hotel-image{border-radius:10px}
  .hotel-image img{aspect-ratio:4/3}
  .summary-facts{grid-template-columns:1fr 1fr;gap:8px}
  .summary-facts div{padding:10px}
  .summary-facts dd{font-size:14px;line-height:1.55}
  .summary-facts div:first-child dd{font-size:20px}
  .hotel-fit,.hotel-merits,.return-ease{display:block;margin:14px 0 0}
  .hotel-fit h4,.hotel-merits h4,.return-ease h4{margin:0 0 5px;font-size:15px}
  .hotel-fit p,.return-ease p{margin:0;font-size:14px;line-height:1.7}
  .hotel-merits ul{margin:0;padding-left:1.25em;font-size:14px;line-height:1.8}
  .caution{margin-top:14px;padding:12px;border-radius:8px;font-size:14px;line-height:1.7}
  .return-ease{padding:12px;border-radius:8px;background:#f4f8f5}
  .hotel-details{margin-top:10px}
  .hotel-details>summary{min-height:44px;display:flex;align-items:center;font-size:14px}
  .primary-cta{min-height:52px;font-size:16px;border-radius:10px}
  .sub-cta{min-height:44px;font-size:14px;border-radius:10px}
  .hotel-card .badge-row{max-height:64px;overflow:hidden}
  .venue-grid{display:block}
  .venue-card{padding:14px 0;border:0;border-top:1px solid #f1e4e9;border-radius:0;box-shadow:none}
  .venue-card:first-child{border-top:0}
  .venue-card h3{font-size:17px}
  .venue-card p{font-size:14px;line-height:1.7}
  .venue-card:nth-child(n+4){display:none}
  .mobile-venue-facts{margin-bottom:52px;border:1px solid var(--border);border-radius:12px;background:#fff}
  .mobile-venue-facts summary{min-height:52px;display:flex;align-items:center;justify-content:space-between;padding:0 16px;cursor:pointer;font-weight:800;list-style:none}
  .mobile-venue-facts summary::-webkit-details-marker{display:none}
  .mobile-venue-facts summary::after{content:"＋";font-size:20px;color:var(--primary-dark)}
  .mobile-venue-facts[open] summary::after{content:"−"}
  .mobile-venue-facts .detail-list,.mobile-venue-facts .card-actions{padding:0 16px 16px}
  .choice-grid{grid-template-columns:1fr;gap:10px}
  .choice-card{padding:14px;border-radius:10px;box-shadow:none}
  .choice-card h3{font-size:16px}
  .choice-card p{font-size:14px;line-height:1.7}
  .mobile-related{padding-bottom:52px}
  .mobile-related-links{display:grid;gap:8px}
  .mobile-related-links a{min-height:48px;display:flex;align-items:center;padding:0 14px;border:1px solid var(--border);border-radius:10px;color:var(--primary-dark);font-weight:800;text-decoration:none}
  a:focus-visible,summary:focus-visible{outline:3px solid #7b3f98;outline-offset:3px}
}
@media(max-width:340px){
  .container{width:calc(100% - 24px)}
  .mobile-pick-facts,.summary-facts{grid-template-columns:1fr}
  .mobile-page-title{font-size:25px}
}
`;

const breadcrumbJson = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "ホーム", item: "https://mainitiworakunisuru.com/" },
    { "@type": "ListItem", position: 2, name: "劇場一覧", item: "https://mainitiworakunisuru.com/theaters/" },
    { "@type": "ListItem", position: 3, name: "天王洲 銀河劇場近くのホテル", item: theater.url },
  ],
};

const hotelSectionsHtml = hotels.length > 0
  ? `<section id="best-picks" class="container section">
    <h2 class="section-title">天王洲 銀河劇場近くで迷ったらこの3軒</h2>
    <div class="pick-grid">${picks.map(pickCard).join("")}</div>
    <div class="mobile-pick-list">${picks.map(mobilePickCard).join("")}</div>
  </section>
  <section id="comparison" class="container section">
    <h2 class="section-title">天王洲 銀河劇場近くのホテル比較表</h2>
    <div class="comparison-desktop"><table class="comparison-table"><thead><tr><th>ホテル名</th><th>劇場まで</th><th>1名料金目安</th><th>2名料金目安</th><th>最寄り駅</th><th>向いている人</th><th>詳細</th></tr></thead><tbody>${hotels.map(tableRow).join("")}</tbody></table></div>
    <div class="comparison-mobile">${hotels.map(compareCard).join("")}</div>
  </section>
  <section id="walking-hotels" class="container section">
    <h2 class="section-title">天王洲 銀河劇場から徒歩で戻れるホテル</h2>
    <div class="hotel-list">${hotels.filter((hotel) => hotel.routeMode === "walking").map(hotelCard).join("")}</div>
  </section>
  <section id="transit-hotels" class="container section">
    <h2 class="section-title">徒歩距離より料金や交通を優先したいホテル</h2>
    <div class="hotel-list">${hotels.filter((hotel) => hotel.routeMode !== "walking").map(hotelCard).join("")}</div>
  </section>`
  : `<section id="walking-hotels" class="container section">
    <h2 class="section-title">ホテル情報を準備中です</h2>
    <div class="notice"><p>現在、掲載するホテルを見直しています。確認ができ次第、徒歩時間・料金目安・予約先などの情報を追加します。</p></div>
  </section>`;

const html = `<!doctype html>
<html lang="ja">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="${escapeHtml(theater.description)}">
  <link rel="canonical" href="${theater.url}">
  <title>${escapeHtml(theater.title)}</title>
  <link rel="icon" href="/public/favicon.svg" type="image/svg+xml">
  <script type="application/ld+json">${JSON.stringify(breadcrumbJson)}</script>
  <style>${style}${mobileUiStyle}${mobileSpecStyle}</style>
</head>
<body>
<header class="header"><div class="container header-inner"><a class="brand" href="/"><span class="brand-mark">S</span><span>ステージ<span style="color:var(--primary)">泊</span><small>観劇遠征ホテルガイド</small></span></a><nav class="nav" aria-label="主要ナビゲーション"><a href="/theaters/">劇場から探す</a><a href="/areas/">地域から探す</a></nav></div></header>
<main>
  <div class="container breadcrumbs"><a href="/">ホーム</a> › <a href="/theaters/">劇場一覧</a> › 東京都 › 天王洲 銀河劇場近くのホテル</div>
  <section class="hero">
    <div class="container hero-grid">
      <div>
        <p class="eyebrow">THEATER HOTEL GUIDE</p>
        <h1 class="desktop-page-title">${escapeHtml(theater.h1)}</h1>
        <h1 class="mobile-page-title mobile-only">天王洲 銀河劇場近くのホテル<span>徒歩時間・料金・終演後の戻りやすさを比較</span></h1>
        <p class="lead desktop-lead">天王洲 銀河劇場で観劇する人向けのホテル情報を掲載するページです。現在、掲載候補を見直しています。</p>
        <div class="mobile-lead mobile-only"><p>天王洲 銀河劇場近くのホテル情報は、現在掲載候補を見直しています。</p></div>
      </div>
      <aside class="facts-card" aria-label="劇場基本情報">
        <h2>劇場基本情報</h2>
        <dl class="detail-list">
          <div><dt>劇場名</dt><dd>${escapeHtml(theater.name)}</dd></div>
          <div><dt>住所</dt><dd>${escapeHtml(theater.address)}</dd></div>
          <div><dt>建物</dt><dd>${escapeHtml(theater.building)}</dd></div>
          <div><dt>最寄り駅</dt><dd>${escapeHtml(theater.nearest)}</dd></div>
        </dl>
        <div class="card-actions"><a class="sub-cta" href="${venueMap}" target="_blank" rel="noopener">劇場の場所をGoogleマップで見る</a><a class="sub-cta" href="${venueOfficialUrl}" target="_blank" rel="noopener">劇場公式サイトを見る</a></div>
      </aside>
    </div>
  </section>
  <section class="container conclusion-card mobile-only" aria-labelledby="mobile-conclusion-title">
    <h2 id="mobile-conclusion-title">ホテル情報を準備中です</h2>
    <p>掲載候補の確認ができ次第、ホテル情報を追加します。</p>
  </section>
  <details class="container mobile-toc mobile-only">
    <summary>ページの内容を見る</summary>
    <ul>
      <li><a href="#walking-hotels">ホテル情報の掲載状況</a></li>
      <li><a href="#venue-access">劇場へのアクセス</a></li>
    </ul>
  </details>
  <section class="container toc" aria-label="ページ内ナビゲーション">
    <h2>このページでわかること</h2>
    <ol class="overview-list">
      <li><a href="#walking-hotels">ホテル情報の掲載状況<span>掲載候補を確認後、ホテル情報を追加します。</span></a></li>
      <li><a href="#venue-access">劇場アクセス<span>モノレール、りんかい線、品川駅、羽田空港との関係を整理しています。</span></a></li>
    </ol>
  </section>
  ${hotelSectionsHtml}
  <section id="venue-access" class="container section">
    <h2 class="section-title">天王洲 銀河劇場へのアクセスと終演後の移動</h2>
    <div class="venue-grid">
      <article class="venue-card"><h3>モノレールとりんかい線は出口位置を確認</h3><p>天王洲アイル駅は東京モノレールとりんかい線で駅位置や出口が異なります。初めて行く場合は、劇場入口までのルートを事前に確認しておくと移動時間を読みやすくなります。</p></article>
      <article class="venue-card"><h3>品川駅からは天王洲アイル方面へ移動</h3><p>新幹線利用では品川駅を宿泊拠点にする選択肢もあります。劇場至近を選ぶか、翌日の新幹線移動を優先するかでホテル候補が変わります。</p></article>
      <article class="venue-card"><h3>羽田空港利用はモノレール動線を確認</h3><p>羽田空港を使う遠征では、東京モノレールを含めた移動が候補になります。空港到着日や帰宅日の時間に合わせて、天王洲アイル周辺と品川周辺を比較してください。</p></article>
      <article class="venue-card"><h3>運河周辺は距離だけで判断しない</h3><p>天王洲アイル周辺は運河沿いの立地です。徒歩分数だけでなく、雨の日、キャリーケースの有無、終演後の疲れ具合を含めて戻りやすさを見ておくと失敗しにくくなります。</p></article>
    </div>
  </section>
  <details class="container mobile-venue-facts mobile-only">
    <summary>天王洲 銀河劇場の基本情報を見る</summary>
    <dl class="detail-list">
      <div><dt>劇場名</dt><dd>${escapeHtml(theater.name)}</dd></div>
      <div><dt>住所</dt><dd>${escapeHtml(theater.address)}</dd></div>
      <div><dt>建物</dt><dd>${escapeHtml(theater.building)}</dd></div>
      <div><dt>最寄り駅</dt><dd>${escapeHtml(theater.nearest)}</dd></div>
    </dl>
    <div class="card-actions"><a class="sub-cta" href="${venueMap}" target="_blank" rel="noopener">劇場をGoogleマップで見る <span aria-hidden="true">↗</span></a><a class="sub-cta" href="${venueOfficialUrl}" target="_blank" rel="noopener">劇場公式サイトを見る <span aria-hidden="true">↗</span></a></div>
  </details>
  <section id="choice-points" class="container section">
    <h2 class="section-title"><span class="desktop-only-mobile-hide">観劇遠征でホテルを選ぶポイント</span><span class="mobile-only">ホテル選びの注意事項</span></h2>
    <div class="choice-grid">
      <article class="choice-card"><h3>近さ重視</h3><p>終演後すぐに休みたい日や、マチソワ間に戻りたい日は劇場徒歩5分前後を優先。</p></article>
      <article class="choice-card"><h3>料金重視</h3><p>新馬場や品川シーサイド方面まで広げると、料金と移動時間のバランスを取りやすくなります。</p></article>
      <article class="choice-card"><h3>交通重視</h3><p>品川駅や羽田空港を使う場合は、劇場への近さだけでなく翌日の移動も含めて比較。</p></article>
      <article class="choice-card"><h3>荷物が多い日</h3><p>荷物預かりやチェックイン前後の対応はホテルごとに変わるため、予約前に公式・予約サイトで確認してください。</p></article>
    </div>
  </section>
  <section class="container mobile-related mobile-only">
    <h2 class="section-title">関連ページ</h2>
    <div class="mobile-related-links"><a href="/theaters/">ほかの劇場からホテルを探す</a><a href="/areas/">地域からホテルを探す</a></div>
  </section>
</main>
<footer><div class="container"><a class="brand" href="/"><span class="brand-mark">S</span><span>ステージ<span style="color:var(--primary)">泊</span><small>観劇遠征ホテルガイド</small></span></a><p>2.5次元ミュージカル・舞台の観劇遠征者が、劇場を起点にホテルを選ぶための非公式専門メディアです。</p><p>© 2026 ステージ泊</p></div></footer>
<script>
  const mobileHotelDetails = window.matchMedia("(max-width: 767px)");
  const syncHotelDetailsMode = () => {
    document.querySelectorAll(".hotel-details").forEach((details) => {
      if (mobileHotelDetails.matches) {
        if (!details.dataset.mobileReady) {
          details.open = false;
          details.dataset.mobileReady = "true";
        }
      } else {
        details.open = true;
        delete details.dataset.mobileReady;
      }
    });
  };
  syncHotelDetailsMode();
  mobileHotelDetails.addEventListener?.("change", syncHotelDetailsMode);

  document.querySelectorAll("details").forEach((details) => {
    const summary = details.querySelector("summary");
    const syncExpandedState = () => {
      const expanded = details.open ? "true" : "false";
      details.setAttribute("aria-expanded", expanded);
      summary?.setAttribute("aria-expanded", expanded);
    };
    syncExpandedState();
    details.addEventListener("toggle", () => {
      syncExpandedState();
    });
  });
</script>
</body>
</html>`;

function writePage(path, content) {
  const outPath = join(root, path);
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, content.replace(/[ \t]+$/gm, ""), "utf8");
}

writePage("theaters/tennozu-galaxy-theatre/index.html", html);
writePage("theaters/tennozu-galaxy-theatre.html", html);
