import {
  ORIGIN,
  articlePath,
  articleSummary,
  cmsCategories,
  cmsImage,
  escapeHtml,
  escapeJson,
  fetchCmsListing,
  formatDate,
  imageVariant,
  verificationClass,
  verificationLabel
} from "../lib/cms-server.js";

const releaseAt = new Date("2026-11-19T00:00:00+09:00");

function countdown() {
  const remaining = Math.max(0, releaseAt.getTime() - Date.now());
  return {
    days: Math.floor(remaining / 86400000),
    hours: Math.floor((remaining % 86400000) / 3600000),
    minutes: Math.floor((remaining % 3600000) / 60000),
    seconds: Math.floor((remaining % 60000) / 1000)
  };
}

function latestCard(item) {
  const image = cmsImage(item);
  const title = item.name || "無題の記事";
  const summary = articleSummary(item, 80) || `${cmsCategories(item).join("・") || "GTA6"}の記事です。`;
  const date = formatDate(item.publishedAt || item.createdAt);
  const media = image.url
    ? `<img src="${escapeHtml(imageVariant(image.url, 480))}" width="${image.width}" height="${image.height}" alt="" loading="lazy" decoding="async">`
    : `<span class="cms-list-placeholder" aria-hidden="true">G</span>`;

  return `<a class="cms-server-card seo-home-latest-card" href="${articlePath(item)}">
    ${media}
    <span>
      <span class="seo-label-row">
        <span class="seo-label ${verificationClass(item)}">${escapeHtml(verificationLabel(item))}</span>
        ${date ? `<time datetime="${escapeHtml(item.publishedAt || item.createdAt)}">${escapeHtml(date)}</time>` : ""}
      </span>
      <strong>${escapeHtml(title)}</strong>
      <p>${escapeHtml(summary)}</p>
      <em>内容を確認する <span aria-hidden="true">›</span></em>
    </span>
  </a>`;
}

function homeSchema(items) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        name: "GTA6インフォ",
        alternateName: "GTA6 Info Japan",
        url: `${ORIGIN}/`,
        inLanguage: "ja",
        potentialAction: {
          "@type": "SearchAction",
          target: { "@type": "EntryPoint", urlTemplate: `${ORIGIN}/search/?q={search_term_string}` },
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "Organization",
        name: "GTA6インフォ",
        url: `${ORIGIN}/`,
        description: "GTA6の公式情報と未確認情報を区別して整理する個人運営の非公式ファンサイト"
      },
      {
        "@type": "ItemList",
        name: "GTA6の最新記事",
        itemListElement: items.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.name,
          url: `${ORIGIN}${articlePath(item)}`
        }))
      }
    ]
  };
}

function homeHtml(items) {
  const clock = countdown();
  const latest = items.length
    ? items.map(latestCard).join("")
    : `<div class="seo-search-empty"><h2>記事一覧を一時的に取得できません</h2><p><a href="/articles/">最新記事一覧</a>からもう一度確認してください。</p></div>`;

  return `<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="description" content="GTA6の発売日、対応機種、公式発表、人物、舞台、車両、リークを、公式・報道・未確認・考察に分けて確認できる日本語情報サイトです。">
<meta name="robots" content="index,follow,max-image-preview:large">
<link rel="canonical" href="${ORIGIN}/">
<meta property="og:type" content="website">
<meta property="og:locale" content="ja_JP">
<meta property="og:site_name" content="GTA6インフォ">
<meta property="og:title" content="GTA6の気になる最新情報をわかりやすく整理">
<meta property="og:description" content="GTA6の公式情報、報道、未確認情報、考察を分けて整理します。">
<meta property="og:url" content="${ORIGIN}/">
<meta property="og:image" content="${ORIGIN}/assets/images/og-default.png">
<meta name="twitter:card" content="summary_large_image">
<title>GTA6の気になる最新情報をわかりやすく整理｜GTA6インフォ</title>
<link rel="stylesheet" href="/assets/css/00-tokens-base.css">
<link rel="stylesheet" href="/assets/css/11-seo-static.css">
<link rel="stylesheet" href="/assets/css/14-cms-article.css">
<script defer src="/assets/js/countdown.js"></script>
<script type="application/ld+json">${escapeJson(homeSchema(items))}</script>
</head>
<body class="seo-static-page cms-server-page seo-growth-home">
<a class="seo-skip" href="#main">本文へ移動</a>
<header class="seo-header"><div class="seo-container seo-header-inner">
  <a class="seo-brand" href="/"><span>G</span><strong>GTA6インフォ<small>日本語・非公式情報サイト</small></strong></a>
  <nav aria-label="主要メニュー"><a href="/" aria-current="page">ホーム</a><a href="/articles/">最新記事</a><a href="/release/">発売情報</a><a href="/characters/">人物</a><a href="/map/">舞台・地域</a><a href="/search/">検索</a></nav>
</div></header>
<main id="main">
  <section class="seo-growth-hero"><div class="seo-container seo-growth-hero-grid">
    <div>
      <p class="seo-growth-kicker">非公式・日本語情報サイト</p>
      <h1>GTA6の気になる最新情報をわかりやすく整理</h1>
      <p>公式情報、報道、未確認情報を分け、発売日や予約、人物、舞台、車両を根拠と一緒に確認できます。</p>
      <div class="release-countdown" id="release-countdown" data-release-at="2026-11-19T00:00:00+09:00" role="timer" aria-label="GTA6発売まで">
        <span><strong data-countdown-days>${clock.days}</strong><small>日</small></span>
        <span><strong data-countdown-hours>${String(clock.hours).padStart(2, "0")}</strong><small>時間</small></span>
        <span><strong data-countdown-minutes>${String(clock.minutes).padStart(2, "0")}</strong><small>分</small></span>
        <span><strong data-countdown-seconds>${String(clock.seconds).padStart(2, "0")}</strong><small>秒</small></span>
      </div>
    </div>
    <aside class="seo-growth-status"><strong>現在の公式確認情報</strong><dl>
      <div><dt>発売予定日</dt><dd>2026年11月19日</dd></div>
      <div><dt>対応機種</dt><dd>PS5・Xbox Series X|S</dd></div>
      <div><dt>舞台</dt><dd>Vice Cityを含むLeonida</dd></div>
    </dl><a href="https://www.rockstargames.com/VI/" target="_blank" rel="noopener noreferrer">Rockstar Games公式で確認 ↗</a></aside>
  </div></section>
  <div class="seo-container">
    <section class="seo-home-purpose"><header><p>PURPOSE</p><h2>知りたいことから選ぶ</h2></header><div class="seo-card-grid">
      <a class="seo-link-card" href="/release/"><strong>発売日・予約を確認</strong><span>価格、対応機種、特典、必要容量</span><em>発売情報へ ›</em></a>
      <a class="seo-link-card" href="/articles/"><strong>新しい情報を確認</strong><span>公開中の記事を新しい順に見る</span><em>最新記事へ ›</em></a>
      <a class="seo-link-card" href="/characters/"><strong>人物を調べる</strong><span>公式プロフィールと関係</span><em>人物一覧へ ›</em></a>
      <a class="seo-link-card" href="/map/"><strong>舞台・地域を調べる</strong><span>Vice Cityを含む公式公開地域</span><em>地域一覧へ ›</em></a>
      <a class="seo-link-card" href="/vehicles/"><strong>車両を調べる</strong><span>公式名称と映像確認を分ける</span><em>車両情報へ ›</em></a>
      <a class="seo-link-card" href="/leaks/"><strong>リークの確度を確認</strong><span>公式情報、報道、未確認を分離</span><em>検証記事へ ›</em></a>
    </div></section>
    <section class="seo-home-latest"><header><div><p>LATEST</p><h2>最新記事</h2></div><a href="/articles/">すべての記事を見る ›</a></header><div class="cms-server-list">${latest}</div></section>
    <section class="seo-content seo-home-policy"><section><h2>情報の見分け方</h2><p>公式確認済み、報道、公式映像での確認、リーク、考察を文字ラベルで区別します。判断基準は<a href="/editorial-policy/">編集・掲載方針</a>、情報源の扱いは<a href="/source-policy/">出典・引用方針</a>で確認できます。</p></section></section>
  </div>
</main>
<footer class="seo-footer"><div class="seo-container seo-footer-grid">
  <div><strong>GTA6インフォ</strong><p>公式情報と未確認情報を分けて整理する非公式ファンサイトです。</p></div>
  <nav><a href="/articles/">最新記事</a><a href="/release/">発売情報</a><a href="/characters/">登場人物</a><a href="/map/">舞台・地域</a><a href="/about/">運営者情報</a><a href="/contact/">お問い合わせ</a></nav>
</div></footer>
</body>
</html>`;
}

export default async function handler(request, response) {
  if (request.method !== "GET" && request.method !== "HEAD") {
    response.setHeader("Allow", "GET, HEAD");
    return response.status(405).end("Method not allowed");
  }

  let items = [];
  try {
    items = await fetchCmsListing(8);
  } catch {
    items = [];
  }

  response.setHeader("Content-Type", "text/html; charset=utf-8");
  response.setHeader("Cache-Control", "public, max-age=0, s-maxage=300, stale-while-revalidate=86400");
  return response.status(200).send(request.method === "HEAD" ? "" : homeHtml(items));
}
