import { articlePath, articleSummary, cmsCategories, fetchCmsContents } from "../lib/cms-server.js";

const ORIGIN = "https://mainitiworakunisuru.com";

const pages = [
  ["/release/", "GTA6の最新・公式・発売情報", "新しい公式発表、発売日、対応機種、価格、予約、必要容量をまとめて確認できます。", "最新・公式・発売", "ニュース 公式 Rockstar Newswire 発売日 PS5 Xbox PC 価格 予約 容量"],
  ["/characters/", "GTA6の登場人物", "Jason Duval、Lucia Caminosなど公式公開された人物を整理しています。", "登場人物", "Jason Lucia ジェイソン ルシア"],
  ["/map/", "GTA6の舞台・地域一覧", "Vice Cityを含む公式公開地域を一覧で確認できます。", "舞台・地域", "Vice City Leonida バイスシティ 地図"],
  ["/map/vice-city/", "Vice City", "GTA6で公式公開されているVice Cityの情報を整理しています。", "舞台・地域", "Vice City バイスシティ 都市"],
  ["/map/leonida-keys/", "Leonida Keys", "Leonida Keysの公式公開情報を整理しています。", "舞台・地域", "Leonida Keys レオナイダ キーズ 島"],
  ["/map/grassrivers/", "Grassrivers", "Grassriversの公式公開情報を整理しています。", "舞台・地域", "Grassrivers グラスリバーズ"],
  ["/map/port-gellhorn/", "Port Gellhorn", "Port Gellhornの公式公開情報を整理しています。", "舞台・地域", "Port Gellhorn ポートゲルホーン"],
  ["/map/ambrosia/", "Ambrosia", "Ambrosiaの公式公開情報を整理しています。", "舞台・地域", "Ambrosia アンブロシア"],
  ["/map/mount-kalaga/", "Mount Kalaga", "Mount Kalagaの公式公開情報を整理しています。", "舞台・地域", "Mount Kalaga マウントカラガ"],
  ["/vehicles/", "GTA6の登場車両", "公式名称を確認できるGrotti、Vapid、Dinka、Shitzuを整理しています。", "登場車両", "車 メーカー Grotti Vapid Dinka Shitzu"],
  ["/systems/", "GTA6のゲームシステム", "ゲームシステムの公式発表と未発表項目を分けて確認できます。", "ゲームシステム", "NPC 警察 武器 システム"],
  ["/online/", "GTA6のオンライン情報", "オンライン要素の公式発表状況を確認できます。", "オンライン", "オンライン GTA Online"],
  ["/leaks/", "GTA6のリーク・未確認情報", "リーク、噂、考察を公式情報と分けて確認できます。", "リーク", "リーク 噂 未確認 考察"],
  ["/guide/", "GTA6の発売前ガイド", "予約や購入の前に確認する情報を順番に整理しています。", "ガイド", "購入 予約 準備 ガイド"],
  ["/about/", "運営者情報", "GTA6インフォの運営形態と情報確認の方針です。", "サイト情報", "運営者 編集責任"],
  ["/editorial-policy/", "編集・掲載方針", "公式確認済み、報道、未確認、リーク、考察の区分を説明します。", "サイト情報", "編集 掲載 方針"],
  ["/source-policy/", "出典・引用方針", "一次情報、引用、画像、外部リンクの扱いを説明します。", "サイト情報", "出典 引用 一次情報"],
  ["/corrections/", "訂正・更新方針", "誤情報や公式発表による変更を修正する手順です。", "サイト情報", "訂正 更新 修正"],
  ["/contact/", "お問い合わせ", "記事の訂正、権利関係、情報提供に関する窓口案内です。", "サイト情報", "問い合わせ 訂正 削除 権利 情報提供"]
].map(([url, title, description, category, keywords]) => ({
  url,
  title,
  description,
  category,
  keywords,
  informationStatus: category === "リーク" ? "未確認情報を含む" : category === "サイト情報" ? "サイト情報" : "公式情報を優先"
}));

const escapeHtml = (value = "") => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");

export default async function handler(request, response) {
  if (request.method !== "GET" && request.method !== "HEAD") {
    response.setHeader("Allow", "GET, HEAD");
    return response.status(405).end("Method not allowed");
  }
  const query = String(request.query.q || "").trim().slice(0, 100);
  const terms = query.toLocaleLowerCase("ja").split(/[\s,、]+/).filter(Boolean);
  let searchablePages = pages;
  try {
    const contents = terms.length ? await fetchCmsContents(100) : [];
    const cmsPages = contents.map((item) => ({
      url: articlePath(item),
      title: item.name || "無題の記事",
      description: articleSummary(item, 110),
      category: cmsCategories(item).join("・") || "記事",
      keywords: `${item.name || ""} ${cmsCategories(item).join(" ")} ${articleSummary(item, 180)}`,
      informationStatus: cmsCategories(item).includes("リーク") ? "未確認情報を含む" : "情報整理"
    }));
    searchablePages = [...cmsPages, ...pages];
  } catch {
    searchablePages = pages;
  }
  const results = terms.length ? searchablePages.filter((page) => {
    const haystack = `${page.title} ${page.description} ${page.category} ${page.keywords}`.toLocaleLowerCase("ja");
    return terms.every((term) => haystack.includes(term));
  }) : [];
  const resultMarkup = query
    ? results.length
      ? `<p class="seo-search-count"><strong>${results.length}件</strong>見つかりました</p><div class="seo-search-results">${results.map((item) => `<a href="${item.url}"><span>${escapeHtml(item.category)}・${escapeHtml(item.informationStatus)}</span><strong>${escapeHtml(item.title)}</strong><p>${escapeHtml(item.description)}</p><em>ページを開く <span aria-hidden="true">›</span></em></a>`).join("")}</div>`
      : `<div class="seo-search-empty"><h2>「${escapeHtml(query)}」に一致するページがありません</h2><p>語句を短くするか、「発売日」「Jason」「Vice City」など別の言葉で検索してください。</p></div>`
    : `<div class="seo-search-empty"><h2>キーワードを入力してください</h2><p>発売日、人物名、地域名、車両メーカーなどから探せます。</p></div>`;
  const html = `<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="description" content="GTA6インフォの記事を発売日、人物、地域、車両などのキーワードから検索できます。"><meta name="robots" content="noindex,follow"><link rel="canonical" href="${ORIGIN}/search/"><title>サイト内検索｜GTA6インフォ</title><link rel="stylesheet" href="/assets/css/00-tokens-base.css"><link rel="stylesheet" href="/assets/css/11-seo-static.css"></head><body class="seo-static-page"><a class="seo-skip" href="#main">本文へ移動</a><header class="seo-header"><div class="seo-container seo-header-inner"><a class="seo-brand" href="/"><span>G</span><strong>GTA6インフォ<small>日本語・非公式情報サイト</small></strong></a><nav aria-label="主要メニュー"><a href="/">ホーム</a><a href="/release/">最新・公式・発売情報</a><a href="/map/">舞台・地域</a></nav></div></header><main id="main"><div class="seo-container"><nav class="seo-breadcrumb" aria-label="パンくず"><a href="/">ホーム</a><span aria-hidden="true">›</span><span aria-current="page">サイト内検索</span></nav><header class="seo-page-hero"><p>SEARCH</p><h1>サイト内検索</h1><div>複数の言葉はスペースで区切って検索できます。</div></header><section class="seo-search-panel"><form action="/search/" method="get" role="search"><label for="site-search">GTA6の情報を検索</label><div><input id="site-search" name="q" type="search" value="${escapeHtml(query)}" placeholder="例：発売日、Jason、Vice City" autocomplete="off"><button type="submit">検索</button></div></form>${resultMarkup}<nav class="seo-search-suggestions" aria-label="主なカテゴリ"><a href="/release/">最新・公式・発売情報</a><a href="/characters/">登場人物</a><a href="/map/">舞台・地域</a><a href="/vehicles/">登場車両</a><a href="/contact/">お問い合わせ</a></nav></section></div></main><footer class="seo-footer"><div class="seo-container seo-footer-grid"><div><strong>GTA6インフォ</strong><p>公式情報と未確認情報を分けて整理する非公式ファンサイトです。</p></div><nav><a href="/about/">運営者情報</a><a href="/editorial-policy/">編集・掲載方針</a><a href="/source-policy/">出典・引用方針</a><a href="/corrections/">訂正・更新方針</a></nav></div></footer></body></html>`;
  response.setHeader("Content-Type", "text/html; charset=utf-8");
  response.setHeader("Cache-Control", "public, max-age=0, s-maxage=300");
  return response.status(200).send(request.method === "HEAD" ? "" : html);
}
