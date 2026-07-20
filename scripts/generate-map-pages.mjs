import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { SITE, imageStatusLabels, regions, statusLabels } from "../content/regions.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const sortedRegions = [...regions].sort((a, b) => a.sortOrder - b.sortOrder);
const defaultImage = `${SITE.origin}/assets/images/og-default.png`;

const esc = (value = "") => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");

const json = (value) => JSON.stringify(value).replaceAll("<", "\\u003c");
const regionUrl = (region) => `/map/${region.slug}/`;
const absoluteRegionUrl = (region) => `${SITE.origin}${regionUrl(region)}`;
const status = (key) => statusLabels[key] || key;

function head({ title, description, canonical, type = "website", schemas = [] }) {
  return `<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="description" content="${esc(description)}">
<meta name="robots" content="index,follow,max-image-preview:large">
<link rel="canonical" href="${esc(canonical)}">
<meta property="og:type" content="${type}">
<meta property="og:locale" content="ja_JP">
<meta property="og:site_name" content="${SITE.name}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${esc(canonical)}">
<meta property="og:image" content="${defaultImage}">
<meta property="og:image:alt" content="GTA6インフォのトップページ">
<meta name="twitter:card" content="summary">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${defaultImage}">
<title>${esc(title)}</title>
${["00-tokens-base", "01-header-drawer", "02-controls-cards", "03-shell-home-article", "07-page-components", "08-release-mode", "04-responsive-core", "05-mobile-layout", "06-mobile-refinements", "10-desktop-layout", "09-map-static"].map(name => `<link rel="stylesheet" href="/assets/css/${name}.css">`).join("\n")}
${schemas.map(schema => `<script type="application/ld+json">${json(schema)}</script>`).join("\n")}
</head>`;
}

function shellStart(current = "map") {
  return `<body class="static-page">
<div class="site-shell">
<a class="skip-link" href="#main" id="skip-link">本文へ移動</a>
<header class="site-header">
  <div class="container header-inner">
    <a class="brand" href="/" aria-label="GTA6インフォ ホーム">
      <span class="brand-mark">G</span>
      <span class="brand-copy"><strong>GTA6インフォ</strong><small>日本語・非公式情報サイト</small></span>
    </a>
    <nav class="desktop-nav" aria-label="主要メニュー">
      <a href="/">ホーム</a>
      <a href="/release/">最新・公式情報</a>
      <a href="/articles/">最新記事</a>
      <a href="/map/"${current === "map" ? ' aria-current="page"' : ""}>舞台・地域</a>
      <a href="/vehicles/">登場車両</a>
    </nav>
    <div class="header-actions">
      <a class="icon-button static-search-link" href="/search/" aria-label="サイト内検索"><span aria-hidden="true">⌕</span></a>
      <button class="icon-button menu-trigger" type="button" aria-label="メニューを開く" aria-controls="site-drawer" aria-expanded="false"><span aria-hidden="true">☰</span></button>
    </div>
  </div>
</header>
<div class="drawer-backdrop" data-close-drawer></div>
<aside class="drawer" id="site-drawer" role="dialog" aria-modal="true" aria-label="サイトメニュー" aria-hidden="true">
  <div class="drawer-head"><strong>メニュー</strong><button class="icon-button" type="button" data-close-drawer aria-label="閉じる"><span aria-hidden="true">×</span></button></div>
  <nav class="drawer-nav">
    <a href="/">ホーム<span>›</span></a>
    <a href="/release/">最新・公式・発売情報<span>›</span></a>
    <a href="/articles/">最新記事<span>›</span></a>
    <a href="/map/" aria-current="page">舞台・地域<span>›</span></a>
    <a href="/vehicles/">登場車両情報<span>›</span></a>
    <a href="/release/">発売情報<span>›</span></a>
    <a href="/search/">サイト内検索<span>›</span></a>
  </nav>
  <p class="drawer-note">本サイトはRockstar GamesおよびTake-Two Interactiveとは関係のない非公式ファンサイトです。</p>
</aside>
<div id="route-status" class="visually-hidden" aria-live="polite" aria-atomic="true"></div>`;
}

function shellEnd({ mapScript = false } = {}) {
  return `<footer class="site-footer">
  <div class="container footer-grid">
    <div class="footer-brand"><strong>GTA6インフォ</strong><p>公式発表と未発表情報を分けて整理する非公式日本語ガイドです。</p><div class="meta-row"><span class="status-pill info">非公式サイト</span><span class="status-pill">公式情報優先</span></div></div>
    <nav class="footer-links" aria-label="フッターメニュー">
      <div class="footer-section"><strong>探す</strong><a href="/">ホーム</a><a href="/release/">最新・公式・発売情報</a><a href="/map/">舞台・地域</a><a href="/search/">サイト内検索</a></div>
      <div class="footer-section"><strong>サイト情報</strong><a href="/about/">運営者情報</a><a href="/editorial-policy/">編集・掲載方針</a><a href="/source-policy/">出典・引用方針</a><a href="/corrections/">訂正・更新方針</a></div>
    </nav>
  </div>
</footer>
<nav class="bottom-nav" aria-label="下部メニュー">
  <a href="/"><span aria-hidden="true">⌂</span><span>ホーム</span></a>
  <a href="/release/"><span aria-hidden="true">◫</span><span>最新</span></a>
  <a href="/map/" aria-current="page"><span aria-hidden="true">⌖</span><span>地域</span></a>
  <a href="/search/"><span aria-hidden="true">⌕</span><span>検索</span></a>
</nav>
</div>
<script src="/assets/js/core/drawer.js"></script>${mapScript ? '\n<script src="/assets/js/map-page.js"></script>' : ""}
</body>
</html>`;
}

function breadcrumb(items) {
  return `<nav class="static-breadcrumbs" aria-label="パンくず">${items.map((item, index) => item.href ? `<a href="${item.href}">${esc(item.label)}</a>${index < items.length - 1 ? "<span aria-hidden=\"true\">›</span>" : ""}` : `<span aria-current="page">${esc(item.label)}</span>`).join("")}</nav>`;
}

function statusRows(region) {
  return `<dl class="region-status-list">
    <div><dt>名称</dt><dd><span class="fact-status is-official">${status(region.officialStatus)}</span></dd></div>
    <div><dt>公式画像</dt><dd>${imageStatusLabels[region.officialImageStatus]}</dd></div>
    <div><dt>詳細地図</dt><dd><span class="fact-status is-unreleased">${status(region.officialMapStatus)}</span></dd></div>
  </dl>`;
}

function listCard(region) {
  const search = [region.nameEn, region.nameJa, ...region.nameVariants, region.category, region.summary, ...region.tags].join(" ");
  return `<article class="static-region-card region-filterable" data-search="${esc(search)}" data-groups="${esc(region.filterGroups.join(" "))}">
    <a class="region-card-main" href="${regionUrl(region)}" aria-label="${esc(region.nameEn)}の詳細を見る">
      <span class="region-card-category">${esc(region.category)}</span>
      <h2>${esc(region.nameEn)}</h2>
      <p class="region-name-ja">${esc(region.nameJa)}</p>
      <p>${esc(region.summary)}</p>
      ${statusRows(region)}
      <span class="region-detail-link">${esc(region.nameEn)}の詳細を見る <span aria-hidden="true">›</span></span>
    </a>
  </article>`;
}

function listPage() {
  const title = "GTA6の舞台・地域一覧｜Vice Cityなど公式公開情報を整理";
  const description = "GTA6の舞台として公式公開されているVice City、Leonida Keysなどの地域を一覧で整理。地域の特徴、公式画像の有無、現在未発表の情報を確認できます。";
  const canonical = `${SITE.origin}/map/`;
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "GTA6の舞台・地域一覧",
    numberOfItems: sortedRegions.length,
    itemListElement: sortedRegions.map((region, index) => ({ "@type": "ListItem", position: index + 1, name: region.nameEn, url: absoluteRegionUrl(region) }))
  };
  const webPage = { "@context": "https://schema.org", "@type": "CollectionPage", name: title, description, url: canonical, inLanguage: "ja" };
  return `${head({ title, description, canonical, schemas: [webPage, itemList] })}
${shellStart()}
<main id="main" tabindex="-1">
  <div class="container static-page-wrap">
    ${breadcrumb([{ label: "ホーム", href: "/" }, { label: "舞台・地域" }])}
    <header class="static-page-hero">
      <p class="static-kicker">OFFICIAL PLACES</p>
      <h1>GTA6の舞台・地域一覧</h1>
      <p>GTA6で公式公開されている地域を、公式画像の有無や未発表の地図情報と分けて確認できます。ここでは完成地図を推測せず、現在確認できる範囲だけを掲載します。</p>
    </header>
    <section class="region-overview" aria-labelledby="overview-title">
      <div><p class="eyebrow">掲載概要</p><h2 id="overview-title">公式公開済みの6地域</h2><p>地域名と公式紹介を中心に整理しています。道路、施設、距離などの詳細は、公式公開または発売後の確認に合わせて追記します。</p></div>
      <dl><div><dt>掲載地域</dt><dd>6地域</dd></div><div><dt>公式地図</dt><dd>現時点で未発表</dd></div></dl>
    </section>
    <section class="region-search-panel" aria-labelledby="region-search-title">
      <div class="region-search-heading"><div><h2 id="region-search-title">地域を検索・絞り込み</h2><p>英語名、日本語読み、地域区分から探せます。</p></div><button type="button" class="region-clear-button" id="region-clear">入力を消す</button></div>
      <form class="region-search-form" id="region-search-form" role="search">
        <label for="region-search">地域名を検索</label>
        <div class="region-search-row"><input id="region-search" type="search" placeholder="Vice City、バイスシティなど" autocomplete="off"><button type="submit">検索</button></div>
      </form>
      <div class="static-filter-row" id="region-filters" aria-label="地域区分で絞り込む">
        <button type="button" data-filter="all" aria-pressed="true">すべて</button>
        <button type="button" data-filter="city" aria-pressed="false">都市・市街地</button>
        <button type="button" data-filter="sea" aria-pressed="false">海・島</button>
        <button type="button" data-filter="nature" aria-pressed="false">自然</button>
        <button type="button" data-filter="rural" aria-pressed="false">地方・産業</button>
        <button type="button" data-filter="mountain" aria-pressed="false">山岳</button>
      </div>
      <p class="region-result-count" id="region-result-count" aria-live="polite">6件中6件を表示</p>
    </section>
    <section class="static-region-grid" id="region-list" aria-label="地域一覧">${sortedRegions.map(listCard).join("\n")}</section>
    <div class="static-empty-state" id="region-empty" hidden><strong>一致する地域がありません</strong><p>英語名または日本語読みで検索してください。人物、車両、発売情報を探す場合はサイト内検索を利用してください。</p><button type="button" id="region-reset">検索条件を解除</button></div>
    <aside class="accuracy-note"><h2>地図情報について</h2><p>現時点では、地域間の正確な位置関係を示す公式地図は公開されていません。ファン制作地図や映像から推測した道路配置は掲載していません。</p><strong>地域の位置関係を示す公式地図ではありません</strong></aside>
  </div>
</main>
${shellEnd({ mapScript: true })}`;
}

function sourceLinks(region, ids) {
  return ids.map(id => {
    const item = region.sources.find(sourceItem => sourceItem.id === id);
    return item ? `<a href="#source-${esc(item.id)}">[出典]</a>` : "";
  }).join(" ");
}

function relatedPeople(region) {
  const entries = [
    ...region.relatedPeople.map(item => ({ ...item, kind: "人物" })),
    ...region.relatedOrganizations.map(item => ({ ...item, kind: "組織" }))
  ];
  if (!entries.length) return `<p class="no-confirmed-data">この地域との関係が公式文章で確認できる人物・組織は、現時点ではこのページに掲載していません。</p>`;
  return `<div class="related-entity-list">${entries.map(item => `<article><span>${item.kind}</span><h3>${esc(item.name)}</h3><p>${esc(item.relation)}</p><div class="entity-meta"><span class="fact-status is-official">${status(item.status)}</span>${sourceLinks(region, item.sourceIds)}</div></article>`).join("")}</div>`;
}

function regionCardCompact(region) {
  return `<a class="related-region-card" href="${regionUrl(region)}"><span>${esc(region.category)}</span><strong>${esc(region.nameEn)}</strong><small>${esc(region.nameJa)}</small><em>${esc(region.nameEn)}を見る ›</em></a>`;
}

function detailPage(region) {
  const title = `${region.nameEn}とは？GTA6公式公開情報を整理｜GTA6インフォ`;
  const description = `GTA6の舞台${region.nameEn}について、Rockstar Gamesが公式公開している特徴、画像、関連人物、現時点で未発表の地図情報を整理します。`;
  const canonical = absoluteRegionUrl(region);
  const breadcrumbs = [
    { "@type": "ListItem", position: 1, name: "ホーム", item: `${SITE.origin}/` },
    { "@type": "ListItem", position: 2, name: "舞台・地域", item: `${SITE.origin}/map/` },
    { "@type": "ListItem", position: 3, name: region.nameEn, item: canonical }
  ];
  const schemas = [
    { "@context": "https://schema.org", "@type": "Article", headline: `GTA6の${region.nameEn}とは`, description, url: canonical, datePublished: region.firstPublishedAt, dateModified: region.lastVerifiedAt, inLanguage: "ja", author: { "@type": "Organization", name: SITE.name } },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: breadcrumbs }
  ];
  const related = region.relatedRegions.map(id => sortedRegions.find(item => item.id === id)).filter(Boolean).slice(0, 3);
  return `${head({ title, description, canonical, type: "article", schemas })}
${shellStart()}
<main id="main" tabindex="-1">
  <div class="container static-page-wrap region-detail-page">
    ${breadcrumb([{ label: "ホーム", href: "/" }, { label: "舞台・地域", href: "/map/" }, { label: region.nameEn }])}
    <article>
      <header class="region-detail-hero">
        <div class="region-detail-heading"><p class="static-kicker">OFFICIAL REGION GUIDE</p><h1>GTA6の${esc(region.nameEn)}とは</h1><p class="region-name-ja">${esc(region.nameJa)}</p></div>
        <div class="region-detail-meta"><span>${esc(region.category)}</span><span class="fact-status is-official">${status(region.officialStatus)}</span></div>
        <p class="region-detail-summary">${esc(region.summary)}</p>
        <p class="region-detail-conclusion"><strong>現在の結論</strong>${esc(region.conclusion)}</p>
      </header>
      <nav class="region-toc" aria-label="このページの目次"><strong>このページの内容</strong><ol>
        <li><a href="#known">公式に分かっていること</a></li><li><a href="#media">公式画像・映像</a></li><li><a href="#people">関連する人物・組織</a></li><li><a href="#location">地図・位置情報</a></li><li><a href="#unknown">まだ分かっていないこと</a></li><li><a href="#sources">出典</a></li>
      </ol></nav>
      <section class="region-content-section" id="known"><h2>${esc(region.nameEn)}について公式に分かっていること</h2><div class="fact-list">${region.knownFacts.map(fact => `<article><div><span class="fact-status is-${fact.status === "official" ? "official" : "visual"}">${status(fact.status)}</span>${sourceLinks(region, fact.sourceIds)}</div><p>${esc(fact.text)}</p></article>`).join("")}</div></section>
      <section class="region-content-section" id="media"><h2>${esc(region.nameEn)}の公式画像・映像</h2><div class="media-status-grid"><div><span>公式画像</span><strong>${imageStatusLabels[region.officialImageStatus]}</strong><p>Rockstar Games公式メディアページで地域名を付けた画像を確認できます。</p></div><div><span>公式動画</span><strong>公式サイトで確認</strong><p>映像や画像だけでは、道路名、施設の機能、正確な位置関係までは確定できません。</p></div></div><a class="official-source-button" href="${esc(region.sources[0].url)}" target="_blank" rel="noopener noreferrer">Rockstar Games公式ページで確認 <span aria-hidden="true">↗</span><span class="visually-hidden">（新しいタブで開きます）</span></a></section>
      <section class="region-content-section" id="people"><h2>${esc(region.nameEn)}に関連する人物・組織</h2>${relatedPeople(region)}</section>
      <section class="region-content-section" id="location"><h2>${esc(region.nameEn)}の地図・位置情報</h2><div class="map-unreleased-note"><span class="fact-status is-unreleased">${status(region.officialMapStatus)}</span><p>現時点では、地域内の道路配置、施設位置、地域間の正確な距離を確認できる公式地図は公開されていません。ファン制作地図は公式地図の代わりとして掲載しません。</p></div></section>
      <section class="region-content-section" id="unknown"><h2>現在まだ分かっていないこと</h2><ul class="unknown-list">${region.unknownItems.map(item => `<li>${esc(item)}</li>`).join("")}</ul></section>
      <section class="region-content-section" id="sources"><h2>出典</h2><ol class="source-list">${region.sources.map(sourceItem => `<li id="source-${esc(sourceItem.id)}"><a href="${esc(sourceItem.url)}" target="_blank" rel="noopener noreferrer">${esc(sourceItem.title)} <span aria-hidden="true">↗</span><span class="visually-hidden">（新しいタブで開きます）</span></a><small>${esc(sourceItem.publisher)}</small></li>`).join("")}</ol></section>
      <section class="region-content-section" id="related"><h2>ほかの舞台・地域を見る</h2><div class="related-region-grid">${related.map(regionCardCompact).join("")}</div><a class="back-to-map" href="/map/">GTA6の舞台・地域一覧へ戻る</a></section>
    </article>
  </div>
</main>
${shellEnd()}`;
}

function notFoundPage() {
  return `<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,follow"><title>ページが見つかりません｜${SITE.name}</title><link rel="stylesheet" href="/assets/css/00-tokens-base.css"><link rel="stylesheet" href="/assets/css/09-map-static.css"></head><body><main class="not-found-page"><div><p>404</p><h1>ページが見つかりません</h1><p>URLが変更されたか、まだ公開されていないページです。</p><nav><a href="/">ホームへ戻る</a><a href="/search/">サイト内検索</a><a href="/release/">最新・公式情報を見る</a><a href="/articles/">最新記事を見る</a><a href="/contact/">お問い合わせ</a></nav></div></main></body></html>`;
}

async function output(path, content) {
  const target = resolve(root, path);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, content, "utf8");
}

await output("map/index.html", listPage());
for (const region of sortedRegions) await output(`map/${region.slug}/index.html`, detailPage(region));
await output("404.html", notFoundPage());
console.log(`Generated ${sortedRegions.length + 2} static pages.`);
