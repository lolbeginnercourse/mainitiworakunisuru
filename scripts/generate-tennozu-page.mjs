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

const hotels = [
  {
    id: "ana-holiday-inn-tokyo-bay",
    name: "ANAホリデイ・イン東京ベイ by IHG",
    category: "劇場への近さを優先",
    distance: "徒歩約2分 / 約91m",
    priceTwin: "2名1室 約24,800円〜",
    priceSingle: "1名1室は公式・予約サイトで確認",
    perPerson: "2名利用時 1名あたり約12,400円〜",
    stationLines: ["東京モノレール 天王洲アイル駅周辺", "りんかい線 天王洲アイル駅周辺"],
    bestFor: "終演後すぐに戻りたい人、雨の日の徒歩距離を短くしたい人",
    reason: "劇場に非常に近く、観劇前後の移動時間を最小限にしやすい候補です。",
    caution: "料金は周辺候補より高くなりやすいため、近さを重視する日程向きです。",
    returnEase: "劇場から近いため、終演後に客室へ戻る負担を抑えやすい候補です。",
    movementNote: "天王洲アイル周辺は建物や出口の位置で体感距離が変わるため、初回は地図で入口を確認してください。",
    merits: ["劇場への距離が短い", "マチソワ間に戻る候補にしやすい", "羽田空港利用時に天王洲アイルを起点にしやすい"],
    details: ["荷物預かり、朝食、チェックイン前後の対応は公式・予約サイトで確認してください。"],
    badges: ["劇場に近い", "徒歩5分以内", "マチソワ向け"],
    routeMode: "walking",
    address: "東京都品川区東品川2-3-15",
  },
  {
    id: "toyoko-inn-tennozu",
    name: "東横INN品川港南口天王洲アイル",
    category: "料金を抑えたい",
    distance: "徒歩約5〜6分",
    priceTwin: "2名1室 約11,800円〜17,500円前後",
    priceSingle: "1名1室は公式・予約サイトで確認",
    perPerson: "2名利用時 1名あたり約5,900円〜",
    stationLines: ["東京モノレール 天王洲アイル駅周辺", "りんかい線 天王洲アイル駅周辺"],
    bestFor: "劇場近くに泊まりたいが、宿泊費も抑えたい人",
    reason: "劇場徒歩圏で、料金を比較しながら選びやすい定番ビジネスホテル系の候補です。",
    caution: "公演日や週末は料金・空室が変わりやすいため、早めの確認が必要です。",
    returnEase: "徒歩圏内のため、終演後の移動を短めにしやすい候補です。",
    movementNote: "天王洲アイル駅周辺の出口を確認し、劇場側とホテル側の位置関係を事前に見ておくと迷いにくいです。",
    merits: ["料金を比較しやすい", "劇場徒歩圏", "遠征の宿泊費を抑えたい日程に向く"],
    details: ["朝食や荷物預かりの扱いは公式・予約サイトで最新情報を確認してください。"],
    badges: ["料金重視", "徒歩圏", "1人遠征向け"],
    routeMode: "walking",
    address: "東京都品川区東品川2-2-35",
  },
  {
    id: "petals-tokyo",
    name: "PETALS TOKYO",
    category: "特別感のある滞在をしたい",
    distance: "徒歩約5〜7分 / 約370m",
    priceTwin: "2名1室 約64,800円〜",
    priceSingle: "1名1室は公式・予約サイトで確認",
    perPerson: "2名利用時 1名あたり約32,400円〜",
    stationLines: ["りんかい線 天王洲アイル駅B出口 徒歩約7分", "東京モノレール 天王洲アイル駅中央口 徒歩約8分"],
    bestFor: "観劇遠征そのものを特別な滞在にしたい人",
    reason: "天王洲運河周辺という立地を楽しみたい場合に候補になります。",
    caution: "料金は高めのため、宿泊費より滞在体験を重視する日程向きです。",
    returnEase: "劇場徒歩圏ですが、運河周辺のルートになるため夜間や雨天時は事前に経路を確認してください。",
    movementNote: "初めて利用する場合は、駅出口とホテル入口の位置をGoogleマップで確認してから向かうと安心です。",
    merits: ["運河沿いの滞在感", "劇場徒歩圏", "記念日や遠征の特別感を出しやすい"],
    details: ["客室設備、朝食、チェックイン前後の対応は公式・予約サイトで確認してください。"],
    badges: ["特別な滞在向け", "徒歩圏", "運河周辺"],
    routeMode: "walking",
    address: "東京都品川区東品川2-1 T-LOTUS M",
  },
  {
    id: "super-hotel-shinbanba",
    name: "スーパーホテル品川・新馬場 高濃度炭酸泉 七福神の湯",
    category: "徒歩圏で料金を抑えたい",
    distance: "徒歩約13〜16分 / 約926m",
    priceTwin: "2名1室 朝食付き 約9,900円〜13,000円前後",
    priceSingle: "1名1室は公式・予約サイトで確認",
    perPerson: "2名利用時 1名あたり約4,950円〜",
    stationLines: ["京急本線 新馬場駅北口 徒歩約5分"],
    bestFor: "少し歩いても宿泊費を抑えたい人",
    reason: "天王洲アイル周辺より範囲を広げ、料金とのバランスを取りたい時に比較しやすい候補です。",
    caution: "終演後に徒歩で戻る場合は距離が伸びるため、荷物が多い日や雨の日は負担を確認してください。",
    returnEase: "徒歩圏ではありますが、劇場至近ではないため終演後の体力と天候で判断したい候補です。",
    movementNote: "京急新馬場駅側に寄るため、品川・羽田方面の移動と組み合わせる場合に検討しやすいです。",
    merits: ["料金を抑えやすい", "京急線利用と組み合わせやすい", "徒歩圏として検討できる"],
    details: ["大浴場、朝食、荷物預かりの最新条件は公式・予約サイトで確認してください。"],
    badges: ["料金重視", "京急線に便利", "徒歩圏"],
    routeMode: "walking",
    address: "東京都品川区北品川2-30-26",
  },
  {
    id: "keikyu-ex-inn-shinbanba",
    name: "京急EXイン 品川・新馬場駅北口",
    category: "品川・羽田方面の移動を重視",
    distance: "徒歩約18〜22分",
    priceTwin: "2名1室 約8,600円〜",
    priceSingle: "1名1室は公式・予約サイトで確認",
    perPerson: "2名利用時 1名あたり約4,300円〜",
    stationLines: ["京急本線 新馬場駅北口周辺"],
    bestFor: "翌日に品川駅・羽田空港方面へ動きたい人",
    reason: "劇場最寄りではありませんが、京急線を使う移動計画と合わせやすい候補です。",
    caution: "徒歩で劇場へ戻るには距離があるため、近さ最優先の人には向きません。",
    returnEase: "終演後の徒歩移動は長めです。疲れやすい日程では交通手段も含めて確認してください。",
    movementNote: "新馬場駅を使う前提なら、品川・羽田方面への移動を組み立てやすい候補です。",
    merits: ["京急線利用に向く", "料金を比較しやすい", "品川方面への移動を考えやすい"],
    details: ["駅からの具体的な出口、荷物預かり、朝食は公式・予約サイトで確認してください。"],
    badges: ["羽田空港に便利", "料金重視", "品川駅に移動しやすい"],
    routeMode: "walking",
    address: "東京都品川区北品川2-18-1",
  },
  {
    id: "hearton-hotel-higashi-shinagawa",
    name: "ハートンホテル東品川",
    category: "電車移動も含めて検討",
    distance: "電車利用 約10〜15分 / 徒歩約22〜25分",
    priceTwin: "2名1室 約10,160円〜",
    priceSingle: "1名1室は公式・予約サイトで確認",
    perPerson: "2名利用時 1名あたり約5,080円〜",
    stationLines: ["りんかい線 品川シーサイド駅A出口 徒歩約1分"],
    bestFor: "徒歩距離より、駅近と料金のバランスを見たい人",
    reason: "劇場徒歩圏からは少し外れますが、りんかい線沿線で移動を組める候補です。",
    caution: "劇場まで徒歩だけで考えると距離があるため、電車移動前提で検討してください。",
    returnEase: "終演後は電車移動を含めて戻る候補です。最終電車や混雑を事前に確認してください。",
    movementNote: "品川シーサイド駅周辺を拠点にするため、翌日の移動先によっては天王洲より便利な場合があります。",
    merits: ["駅近を重視しやすい", "りんかい線利用と相性がよい", "徒歩距離より交通を重視する人向け"],
    details: ["朝食、荷物預かり、チェックイン前後の対応は公式・予約サイトで確認してください。"],
    badges: ["駅近", "電車移動向け", "料金重視"],
    routeMode: "transit",
    address: "東京都品川区東品川4-13-27",
  },
];

const picks = [
  {
    label: "近さを最優先するなら",
    hotelId: "ana-holiday-inn-tokyo-bay",
    why: "劇場への徒歩距離が最も短く、終演後すぐ戻りたい日程に向きます。",
  },
  {
    label: "料金を抑えたいなら",
    hotelId: "toyoko-inn-tennozu",
    why: "劇場徒歩圏を保ちながら、料金を比較しやすい候補です。",
  },
  {
    label: "特別感を重視するなら",
    hotelId: "petals-tokyo",
    why: "天王洲運河周辺の滞在感を楽しみたい時に候補になります。",
  },
];

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

function searchUrl(hotel) {
  return `https://www.google.com/search?q=${encodeURIComponent(`${hotel.name} 空室 料金`)}`;
}

function badgeHtml(hotel) {
  return hotel.badges.slice(0, 3).map((badge) => `<span class="badge">${escapeHtml(badge)}</span>`).join("");
}

function miniFacts(hotel) {
  return `<dl class="mini-facts">
    <div><dt>劇場まで</dt><dd>${escapeHtml(hotel.distance)}</dd></div>
    <div><dt>料金目安</dt><dd>${escapeHtml(hotel.priceTwin)}</dd></div>
    <div><dt>向いている人</dt><dd>${escapeHtml(hotel.bestFor)}</dd></div>
  </dl>`;
}

function pickCard(pick) {
  const hotel = hotels.find((item) => item.id === pick.hotelId);
  return `<article class="pick-card">
    <p class="card-label">${escapeHtml(pick.label)}</p>
    <h3>${escapeHtml(hotel.name)}</h3>
    ${badgeHtml(hotel)}
    ${miniFacts(hotel)}
    <p class="reason">${escapeHtml(pick.why)}</p>
    <p class="caution"><b>注意点</b>${escapeHtml(hotel.caution)}</p>
    <div class="card-actions">
      <a class="primary-cta" href="${searchUrl(hotel)}" target="_blank" rel="noopener">空室・料金を見る</a>
      <a class="sub-cta" href="${routeUrl(hotel)}" target="_blank" rel="noopener">徒歩ルートを見る</a>
    </div>
  </article>`;
}

function compareCard(hotel) {
  return `<article class="compare-card">
    <a class="compare-title" href="#${hotel.id}">${escapeHtml(hotel.name)}</a>
    ${badgeHtml(hotel)}
    ${miniFacts(hotel)}
    <details>
      <summary>比較項目をもっと見る</summary>
      <dl class="detail-list">
        <div><dt>1名料金</dt><dd>${escapeHtml(hotel.priceSingle)}</dd></div>
        <div><dt>1名あたり</dt><dd>${escapeHtml(hotel.perPerson)}</dd></div>
        <div><dt>最寄り駅</dt><dd>${hotel.stationLines.map(escapeHtml).join("<br>")}</dd></div>
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
  return `<article id="${hotel.id}" class="hotel-card">
    <div class="hotel-main">
      <p class="card-label">候補 ${index + 1} / ${escapeHtml(hotel.category)}</p>
      <h3>${escapeHtml(hotel.name)}</h3>
      <div class="badge-row">${badgeHtml(hotel)}</div>
      ${miniFacts(hotel)}
      <div class="hotel-body">
        <section><h4>このホテルが向いている人</h4><p>${escapeHtml(hotel.bestFor)}</p></section>
        <section><h4>メリット</h4><ul>${hotel.merits.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></section>
        <section><h4>注意点</h4><p>${escapeHtml(hotel.caution)}</p></section>
        <section><h4>終演後の戻りやすさ</h4><p>${escapeHtml(hotel.returnEase)}</p></section>
      </div>
      <details class="hotel-details">
        <summary>ホテル情報を詳しく見る</summary>
        <dl class="detail-list">
          <div><dt>路線別の駅情報</dt><dd>${hotel.stationLines.map(escapeHtml).join("<br>")}</dd></div>
          <div><dt>移動時の注意点</dt><dd>${escapeHtml(hotel.movementNote)}</dd></div>
          <div><dt>補足</dt><dd>${hotel.details.map(escapeHtml).join("<br>")}</dd></div>
        </dl>
      </details>
    </div>
    <div class="hotel-actions">
      <div class="price-box"><span>料金目安</span><b>${escapeHtml(hotel.priceTwin)}</b><small>${escapeHtml(hotel.perPerson)}</small></div>
      <a class="primary-cta" href="${searchUrl(hotel)}" target="_blank" rel="noopener">空室・料金を見る</a>
      <a class="sub-cta" href="${routeUrl(hotel)}" target="_blank" rel="noopener">劇場からの徒歩ルートを見る</a>
    </div>
  </article>`;
}

const style = `:root{--text:#171317;--muted:#625a60;--primary:#e54887;--primary-dark:#be2867;--border:#ead7df;--soft:#fff1f6;--shadow:0 16px 42px rgba(88,46,67,.1)}*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;color:var(--text);font-family:"Noto Sans JP","Hiragino Kaku Gothic ProN","Yu Gothic",system-ui,sans-serif;line-height:1.8;background:#fff}a{color:inherit}.container{width:min(calc(100% - 32px),1120px);margin:0 auto}.header{position:sticky;top:0;z-index:10;background:rgba(255,255,255,.96);border-bottom:1px solid #f5c9d9}.header-inner{min-height:72px;display:flex;align-items:center;justify-content:space-between;gap:20px}.brand{display:inline-flex;align-items:center;gap:10px;font-weight:900;font-size:20px;line-height:1.1;text-decoration:none}.brand-mark{width:40px;height:40px;display:grid;place-items:center;border-radius:12px 12px 12px 3px;background:var(--primary);color:white;font:italic 25px Georgia,serif}.brand small{display:block;margin-top:4px;color:var(--muted);font-size:9px;letter-spacing:.12em}.nav{display:flex;gap:24px;font-size:14px;font-weight:800}.breadcrumbs{padding-top:24px;color:var(--muted);font-size:13px}.breadcrumbs a{color:var(--primary-dark);font-weight:800}.hero{padding:34px 0 22px}.hero-grid{display:grid;grid-template-columns:minmax(0,1.08fr) minmax(300px,.92fr);gap:28px;align-items:start}.eyebrow{margin:0 0 10px;color:var(--primary-dark);font-size:12px;letter-spacing:.13em;font-weight:900}h1{margin:0;font-size:clamp(32px,4.6vw,50px);line-height:1.3;letter-spacing:-.04em}.lead{margin:18px 0 0;color:var(--muted)}.hero-note{margin-top:18px;padding:14px;border:1px solid var(--border);border-radius:14px;background:#fff7fa}.facts-card,.toc,.notice,.pick-card,.compare-card,.hotel-card,.venue-card,.choice-card{border:1px solid var(--border);border-radius:18px;background:#fff;box-shadow:var(--shadow)}.facts-card{padding:20px}.facts-card h2,.toc h2,.notice h2{margin:0 0 10px;font-size:18px}.detail-list,.mini-facts{display:grid;gap:10px;margin:0}.detail-list div,.mini-facts div{padding:10px;border-radius:12px;background:#fff7fa}.detail-list dt,.mini-facts dt{color:var(--muted);font-size:12px;font-weight:800}.detail-list dd,.mini-facts dd{margin:2px 0 0;font-weight:800}.toc{margin:22px auto 34px;padding:20px;max-width:820px}.overview-list{display:grid;gap:12px;margin:14px 0 0;padding:0;list-style:none}.overview-list a{display:block;padding:14px;border-radius:14px;background:#fff7fa;color:var(--text);font-weight:900;text-decoration:none}.overview-list span{display:block;margin-top:3px;color:var(--muted);font-size:14px;font-weight:500}.section{padding:34px 0;border-top:1px solid #f5dbe5;scroll-margin-top:96px}.section-title{margin:0 0 10px;padding-left:12px;border-left:5px solid var(--primary);font-size:clamp(24px,3vw,32px);line-height:1.45}.section-lead{margin:0 0 20px;color:var(--muted)}.notice{padding:18px;margin:0 0 22px}.pick-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}.pick-card,.compare-card{padding:18px}.card-label{margin:0 0 6px;color:var(--primary-dark);font-size:12px;font-weight:900;letter-spacing:.04em}.pick-card h3,.hotel-card h3{margin:0 0 10px;font-size:22px;line-height:1.45}.badge-row,.pick-card .badge{margin-right:6px}.badge{display:inline-flex;margin:0 6px 6px 0;padding:5px 9px;border-radius:999px;background:#fff1f6;color:var(--primary-dark);font-size:12px;font-weight:900}.reason{margin:14px 0 8px}.caution{margin:0;color:var(--muted)}.caution b{display:block;color:var(--text)}.card-actions,.hotel-actions{display:grid;gap:10px;margin-top:14px}.primary-cta,.sub-cta{min-height:48px;display:grid;place-items:center;padding:10px 14px;border-radius:12px;font-weight:900;text-align:center;text-decoration:none}.primary-cta{background:var(--primary);color:#fff}.sub-cta{border:1.5px solid var(--primary);color:var(--primary-dark);background:#fff}.comparison-desktop{overflow-x:auto}.comparison-table{width:100%;border-collapse:separate;border-spacing:0;min-width:940px}.comparison-table th,.comparison-table td{padding:13px;border-bottom:1px solid var(--border);vertical-align:top;text-align:left}.comparison-table thead th{background:#fff7fa;color:var(--primary-dark);font-size:13px}.comparison-table a{color:var(--primary-dark);font-weight:900}.comparison-mobile{display:none}.compare-title{display:block;margin-bottom:8px;color:var(--primary-dark);font-size:18px;font-weight:900;text-decoration:none}.hotel-list{display:grid;gap:18px}.hotel-card{display:grid;grid-template-columns:minmax(0,1fr) 260px;gap:20px;padding:20px}.hotel-body{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:14px}.hotel-body section{padding:12px;border-radius:14px;background:#fff7fa}.hotel-body h4{margin:0 0 4px;font-size:14px}.hotel-body p,.hotel-body ul{margin:0;color:var(--muted)}.hotel-body ul{padding-left:1.2em}.hotel-details{margin-top:12px}.hotel-details summary,.compare-card summary{cursor:pointer;color:var(--primary-dark);font-weight:900}.price-box{padding:14px;border-radius:14px;background:#fff7fa}.price-box span,.price-box small{display:block;color:var(--muted);font-size:12px}.price-box b{display:block;margin:4px 0;font-size:18px}.venue-grid,.choice-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:14px}.venue-card,.choice-card{padding:18px}.venue-card h3,.choice-card h3{margin:0 0 8px}.venue-card p,.choice-card p{margin:0;color:var(--muted)}footer{margin-top:40px;padding:38px 0;background:#171317;color:#fff}footer p{color:#cfc6cb;font-size:13px}@media(max-width:900px){.nav{display:none}.hero-grid,.pick-grid,.hotel-card,.venue-grid,.choice-grid{grid-template-columns:1fr}.hotel-actions{grid-row:auto}.hotel-body{grid-template-columns:1fr}.comparison-desktop{display:none}.comparison-mobile{display:grid;gap:12px}}@media(max-width:640px){.container{width:min(calc(100% - 24px),1120px)}.header-inner{min-height:64px}.brand{font-size:16px}.brand-mark{width:34px;height:34px;font-size:21px}.hero{padding-top:24px}h1{font-size:30px}.toc,.facts-card,.notice,.pick-card,.compare-card,.hotel-card,.venue-card,.choice-card{border-radius:16px}.section{padding:28px 0}.section-title{font-size:23px}.pick-card h3,.hotel-card h3{font-size:20px}.primary-cta,.sub-cta{min-height:50px}}`;

const breadcrumbJson = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "ホーム", item: "https://mainitiworakunisuru.com/" },
    { "@type": "ListItem", position: 2, name: "劇場一覧", item: "https://mainitiworakunisuru.com/theaters/" },
    { "@type": "ListItem", position: 3, name: "天王洲 銀河劇場近くのホテル", item: theater.url },
  ],
};

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
  <style>${style}</style>
</head>
<body>
<header class="header"><div class="container header-inner"><a class="brand" href="/"><span class="brand-mark">S</span><span>ステージ<span style="color:var(--primary)">泊</span><small>観劇遠征ホテルガイド</small></span></a><nav class="nav" aria-label="主要ナビゲーション"><a href="/theaters/">劇場から探す</a><a href="/areas/">地域から探す</a></nav></div></header>
<main>
  <div class="container breadcrumbs"><a href="/">ホーム</a> › <a href="/theaters/">劇場一覧</a> › 東京都 › 天王洲 銀河劇場近くのホテル</div>
  <section class="hero">
    <div class="container hero-grid">
      <div>
        <p class="eyebrow">THEATER HOTEL GUIDE</p>
        <h1>${escapeHtml(theater.h1)}</h1>
        <p class="lead">天王洲 銀河劇場で観劇する人向けに、劇場までの近さ、料金目安、終演後の戻りやすさ、品川駅・羽田空港方面への移動を比べられるように整理しました。</p>
        <p class="hero-note">${escapeHtml(theater.priceNote)}</p>
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
  <section class="container toc" aria-label="ページ内ナビゲーション">
    <h2>このページでわかること</h2>
    <ol class="overview-list">
      <li><a href="#best-picks">迷ったらこの3軒<span>近さ、料金、特別感で候補を絞れます。</span></a></li>
      <li><a href="#comparison">ホテル比較表<span>徒歩時間、料金目安、最寄り駅を同じ画面で見比べられます。</span></a></li>
      <li><a href="#walking-hotels">徒歩で戻れるホテル<span>劇場に近い順で、終演後の戻りやすさも確認できます。</span></a></li>
      <li><a href="#venue-access">劇場アクセス<span>モノレール、りんかい線、品川駅、羽田空港との関係を整理しています。</span></a></li>
    </ol>
  </section>
  <section id="best-picks" class="container section">
    <h2 class="section-title">天王洲 銀河劇場近くで迷ったらこの3軒</h2>
    <p class="section-lead">まず候補を絞りたい人向けに、目的が違う3軒を選びました。近さ、料金、滞在体験のどれを優先するかで選びやすくなります。</p>
    <div class="pick-grid">${picks.map(pickCard).join("")}</div>
  </section>
  <section id="comparison" class="container section">
    <h2 class="section-title">天王洲 銀河劇場近くのホテル比較表</h2>
    <div class="notice"><h2>料金・徒歩時間の見方</h2><p>${escapeHtml(theater.priceNote)} 徒歩時間はGoogleマップ等の徒歩ルートを基準にした目安で、信号待ちや駅出口、混雑で変わります。</p></div>
    <div class="comparison-desktop"><table class="comparison-table"><thead><tr><th>ホテル名</th><th>劇場まで</th><th>1名料金目安</th><th>2名料金目安</th><th>最寄り駅</th><th>向いている人</th><th>詳細</th></tr></thead><tbody>${hotels.map(tableRow).join("")}</tbody></table></div>
    <div class="comparison-mobile">${hotels.map(compareCard).join("")}</div>
  </section>
  <section id="walking-hotels" class="container section">
    <h2 class="section-title">天王洲 銀河劇場から徒歩で戻れるホテル</h2>
    <p class="section-lead">天王洲 銀河劇場から徒歩で移動しやすいホテルを、劇場に近い順で掲載しています。徒歩時間は地図上の徒歩ルートを基準にした目安です。料金は宿泊日や公演日によって変動します。</p>
    <div class="hotel-list">${hotels.filter((hotel) => hotel.routeMode === "walking").map(hotelCard).join("")}</div>
  </section>
  <section id="transit-hotels" class="container section">
    <h2 class="section-title">徒歩距離より料金や交通を優先したいホテル</h2>
    <p class="section-lead">徒歩だけでなく、りんかい線や品川方面への移動を含めて検討したい候補です。</p>
    <div class="hotel-list">${hotels.filter((hotel) => hotel.routeMode !== "walking").map(hotelCard).join("")}</div>
  </section>
  <section id="venue-access" class="container section">
    <h2 class="section-title">天王洲 銀河劇場へのアクセスと終演後の移動</h2>
    <div class="venue-grid">
      <article class="venue-card"><h3>モノレールとりんかい線は出口位置を確認</h3><p>天王洲アイル駅は東京モノレールとりんかい線で駅位置や出口が異なります。初めて行く場合は、劇場入口までのルートを事前に確認しておくと移動時間を読みやすくなります。</p></article>
      <article class="venue-card"><h3>品川駅からは天王洲アイル方面へ移動</h3><p>新幹線利用では品川駅を宿泊拠点にする選択肢もあります。劇場至近を選ぶか、翌日の新幹線移動を優先するかでホテル候補が変わります。</p></article>
      <article class="venue-card"><h3>羽田空港利用はモノレール動線を確認</h3><p>羽田空港を使う遠征では、東京モノレールを含めた移動が候補になります。空港到着日や帰宅日の時間に合わせて、天王洲アイル周辺と品川周辺を比較してください。</p></article>
      <article class="venue-card"><h3>運河周辺は距離だけで判断しない</h3><p>天王洲アイル周辺は運河沿いの立地です。徒歩分数だけでなく、雨の日、キャリーケースの有無、終演後の疲れ具合を含めて戻りやすさを見ておくと失敗しにくくなります。</p></article>
    </div>
  </section>
  <section id="choice-points" class="container section">
    <h2 class="section-title">観劇遠征でホテルを選ぶポイント</h2>
    <div class="choice-grid">
      <article class="choice-card"><h3>近さ重視</h3><p>終演後すぐに休みたい日や、マチソワ間に戻りたい日は劇場徒歩5分前後を優先。</p></article>
      <article class="choice-card"><h3>料金重視</h3><p>新馬場や品川シーサイド方面まで広げると、料金と移動時間のバランスを取りやすくなります。</p></article>
      <article class="choice-card"><h3>交通重視</h3><p>品川駅や羽田空港を使う場合は、劇場への近さだけでなく翌日の移動も含めて比較。</p></article>
      <article class="choice-card"><h3>荷物が多い日</h3><p>荷物預かりやチェックイン前後の対応はホテルごとに変わるため、予約前に公式・予約サイトで確認してください。</p></article>
    </div>
  </section>
</main>
<footer><div class="container"><a class="brand" href="/"><span class="brand-mark">S</span><span>ステージ<span style="color:var(--primary)">泊</span><small>観劇遠征ホテルガイド</small></span></a><p>2.5次元ミュージカル・舞台の観劇遠征者が、劇場を起点にホテルを選ぶための非公式専門メディアです。</p><p>© 2026 ステージ泊</p></div></footer>
<script>
  document.querySelectorAll("details").forEach((details) => {
    details.setAttribute("aria-expanded", details.open ? "true" : "false");
    details.addEventListener("toggle", () => {
      details.setAttribute("aria-expanded", details.open ? "true" : "false");
    });
  });
</script>
</body>
</html>`;

function writePage(path, content) {
  const outPath = join(root, path);
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, content, "utf8");
}

writePage("theaters/tennozu-galaxy-theatre/index.html", html);
writePage("theaters/tennozu-galaxy-theatre.html", html);
