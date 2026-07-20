import {
  ORIGIN,
  articlePath,
  articleDescription,
  articleSummary,
  clean,
  cmsCategories,
  cmsImage,
  escapeHtml,
  escapeJson,
  externalSources,
  fetchCmsContent,
  fetchCmsListing,
  formatDate,
  imageVariant,
  isoDate,
  relatedArticleScore,
  sanitizeRichText,
  stripHtml,
  verificationClass,
  verificationLabel
} from "../lib/cms-server.js";
import { cmsContentPolicy, isCrawlEntryContent } from "../lib/index-control.js";

function addHeadingIds(html) {
  const toc = [];
  let index = 0;
  const body = html.replace(/<h([23])\b([^>]*)>([\s\S]*?)<\/h\1>/gi, (match, level, attrs, content) => {
    index += 1;
    const existing = attrs.match(/\bid=["']([^"']+)["']/i)?.[1];
    const id = existing || `section-${index}`;
    const nextAttrs = existing ? attrs : `${attrs} id="${id}"`;
    toc.push({ level: Number(level), id, title: stripHtml(content) });
    return `<h${level}${nextAttrs}>${content}</h${level}>`;
  });
  return { body, toc };
}

function notFoundHtml() {
  return `<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,follow"><title>記事が見つかりません｜GTA6インフォ</title><link rel="stylesheet" href="/assets/css/00-tokens-base.css"><link rel="stylesheet" href="/assets/css/11-seo-static.css"></head><body class="seo-static-page"><main id="main"><div class="seo-container"><header class="seo-page-hero"><p>404</p><h1>記事が見つかりません</h1><div>公開を終了したか、URLが変更された可能性があります。</div></header><div class="seo-content"><section><h2>別のページを探す</h2><div class="seo-card-grid"><a class="seo-link-card" href="/articles/"><strong>最新記事一覧</strong><span>公開中の記事を確認</span><em>一覧を見る ›</em></a><a class="seo-link-card" href="/search/"><strong>サイト内検索</strong><span>キーワードから探す</span><em>検索する ›</em></a></div></section></div></div></main></body></html>`;
}

function retiredHtml() {
  return `<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,follow"><title>公開を終了しました｜GTA6インフォ</title><link rel="stylesheet" href="/assets/css/00-tokens-base.css"><link rel="stylesheet" href="/assets/css/11-seo-static.css"></head><body class="seo-static-page"><main id="main"><div class="seo-container"><header class="seo-page-hero"><p>410</p><h1>この記事は公開を終了しました</h1><div>内容の統合または掲載終了により、このURLでは記事を公開していません。</div></header><div class="seo-content"><section><h2>別の情報を探す</h2><div class="seo-card-grid"><a class="seo-link-card" href="/articles/"><strong>最新記事一覧</strong><span>現在公開中の記事を確認</span><em>一覧を見る ›</em></a><a class="seo-link-card" href="/search/"><strong>サイト内検索</strong><span>キーワードから探す</span><em>検索する ›</em></a></div></section></div></div></main></body></html>`;
}

function curatedSources(item) {
  const title = clean(item?.name);
  const sources = [
    { url: "https://www.rockstargames.com/VI/", title: "Rockstar Games GTA VI公式サイト" }
  ];
  if (item?.id === "g_3w1zg2-iaa") {
    sources.push(
      { url: "https://store.playstation.com/ja-jp/product/JP0230-PPSA29660_00-GTAVISTANDARD001", title: "PlayStation Store：GTA VI商品ページ" },
      { url: "https://www.xbox.com/ja-JP/games/store/vi/9NL3WWNZLZZN/0010", title: "Xbox：GTA VI商品ページ" }
    );
  }
  if (item?.id === "19hekcuk8bl") {
    sources.push({ url: "https://www.rockstargames.com/newswire/article/8971o8789584a4/roleplay-community-update", title: "Rockstar Games：Cfx.re Joins Rockstar Games（2023年8月11日）" });
  }
  if (/発売|予約|価格|対応機種|PC版|PlayStation|Xbox/u.test(title)) {
    sources.push({ url: "https://www.take2games.com/ir/news/take-two-interactive-software-inc-reports-results-fiscal-3", title: "Take-Two Interactive 公式発表" });
  }
  if (/MOD|クリエイター|配信|実況/u.test(title)) {
    sources.push({ url: "https://www.rockstargames.com/newswire/article/8971o8789584a4/roleplay-community-update/", title: "Rockstar Games Roleplay Community Update" });
  }
  if (/車|メーカー|NPC|モブAI|コンテンツ|GTA5とGTA6/u.test(title)) {
    sources.push({ url: "https://www.rockstargames.com/VI/media/screenshots", title: "Rockstar Games GTA VI公式スクリーンショット" });
  }
  return sources;
}

function articleHtml(item, relatedItems, policy) {
  const title = clean(item.name) || "無題の記事";
  const canonical = `${ORIGIN}${articlePath(item)}`;
  const categories = cmsCategories(item);
  const parentUrl = "/articles/";
  const parentName = "最新記事";
  const indexable = policy.status === "published" && policy.indexable;
  const summary = articleSummary(item);
  const description = articleDescription(item);
  const rawBody = item.ritti || (item.honbunn ? `<p>${escapeHtml(item.honbunn)}</p>` : "<p>本文を表示できません。</p>");
  const prepared = addHeadingIds(sanitizeRichText(rawBody));
  const image = cmsImage(item);
  const heroUrl = imageVariant(image.url, 1200) || `${ORIGIN}/assets/images/og-default.png`;
  const published = isoDate(item.publishedAt || item.createdAt);
  const modified = isoDate(item.revisedAt || item.updatedAt || item.publishedAt || item.createdAt);
  const publishedLabel = formatDate(published);
  const modifiedLabel = formatDate(modified);
  const status = verificationLabel(item);
  const directSources = externalSources(prepared.body);
  const sources = directSources.length ? directSources : curatedSources(item);
  const h2Count = prepared.toc.filter((entry) => entry.level === 2).length;
  const toc = h2Count >= 4
    ? `<nav class="cms-article-toc" aria-label="この記事の目次"><strong>この記事の内容</strong><ol>${prepared.toc.map((entry) => `<li class="level-${entry.level}"><a href="#${escapeHtml(entry.id)}">${escapeHtml(entry.title)}</a></li>`).join("")}</ol></nav>`
    : "";
  const hero = image.url
    ? `<figure class="cms-hero-image"><img src="${escapeHtml(imageVariant(image.url, 960))}" srcset="${escapeHtml(imageVariant(image.url, 640))} 640w, ${escapeHtml(imageVariant(image.url, 960))} 960w, ${escapeHtml(imageVariant(image.url, 1200))} 1200w" sizes="(max-width:760px) calc(100vw - 28px), 960px" width="${image.width}" height="${image.height}" alt="${escapeHtml(title)}のサムネイル" decoding="async" fetchpriority="high"></figure>`
    : "";
  const sourceMarkup = `<ul class="seo-list">${sources.map((source) => `<li><a href="${escapeHtml(source.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(source.title)} ↗</a></li>`).join("")}</ul>${directSources.length ? "" : `<p class="seo-note">本文内に個別の出典リンクがないため、公式確認ページと照合し、考察・未確認部分は確定情報として扱わないでください。</p>`}`;
  const related = relatedItems.length
    ? `<section><h2>関連する記事</h2><div class="seo-card-grid">${relatedItems.map((entry) => {
      const relatedSummary = articleSummary(entry, 74) || `${cmsCategories(entry).join("・") || "GTA6"}の記事です。`;
      return `<a class="seo-link-card" href="${articlePath(entry)}"><strong>${escapeHtml(entry.name || "記事")}</strong><span>${escapeHtml(relatedSummary)}</span><em>記事を読む <span aria-hidden="true">›</span></em></a>`;
    }).join("")}</div></section>`
    : "";
  const articleNotice = item.id === "g_3w1zg2-iaa"
    ? `<aside class="seo-note"><strong>販売状況の確認</strong><p>2026年7月20日時点で、Amazon.co.jp、楽天市場、ヨドバシ.com、ビックカメラ.comの各サイト検索を確認しました。公式商品ページを確認できない販売先は「未確認」とし、ストアのトップページだけを販売証拠にはしていません。</p></aside>`
    : "";
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    image: [heroUrl],
    datePublished: published,
    dateModified: modified,
    inLanguage: "ja",
    author: { "@type": "Organization", name: "GTA6インフォ編集部", url: `${ORIGIN}/authors/editorial-team/` },
    publisher: { "@type": "Organization", name: "GTA6インフォ", url: `${ORIGIN}/` },
    mainEntityOfPage: canonical
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "ホーム", item: `${ORIGIN}/` },
      { "@type": "ListItem", position: 2, name: parentName, item: `${ORIGIN}${parentUrl}` },
      { "@type": "ListItem", position: 3, name: title, item: canonical }
    ]
  };

  return `<!doctype html>
<html lang="ja"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="description" content="${escapeHtml(description)}"><meta name="robots" content="${indexable ? "index,follow,max-image-preview:large" : "noindex,follow"}">
<link rel="canonical" href="${canonical}">
<meta property="og:type" content="article"><meta property="og:locale" content="ja_JP"><meta property="og:site_name" content="GTA6インフォ">
<meta property="og:title" content="${escapeHtml(title)}"><meta property="og:description" content="${escapeHtml(description)}"><meta property="og:url" content="${canonical}"><meta property="og:image" content="${escapeHtml(heroUrl)}">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${escapeHtml(title)}"><meta name="twitter:description" content="${escapeHtml(description)}"><meta name="twitter:image" content="${escapeHtml(heroUrl)}">
<title>${escapeHtml(title)}｜GTA6インフォ</title>
<link rel="stylesheet" href="/assets/css/00-tokens-base.css"><link rel="stylesheet" href="/assets/css/11-seo-static.css"><link rel="stylesheet" href="/assets/css/13-trust.css"><link rel="stylesheet" href="/assets/css/14-cms-article.css">
${indexable ? `<script type="application/ld+json">${escapeJson(articleSchema)}</script><script type="application/ld+json">${escapeJson(breadcrumbSchema)}</script>` : ""}
</head><body class="seo-static-page cms-server-page"><a class="seo-skip" href="#main">本文へ移動</a>
<header class="seo-header"><div class="seo-container seo-header-inner"><a class="seo-brand" href="/"><span>G</span><strong>GTA6インフォ<small>日本語・非公式情報サイト</small></strong></a><nav aria-label="主要メニュー"><a href="/">ホーム</a><a href="/articles/">最新記事</a><a href="/release/">発売情報</a><a href="/map/">舞台・地域</a><a href="/search/">検索</a></nav></div></header>
<main id="main"><div class="seo-container cms-article-container"><nav class="seo-breadcrumb" aria-label="パンくず"><a href="/">ホーム</a><span aria-hidden="true">›</span><a href="${parentUrl}">${parentName}</a><span aria-hidden="true">›</span><span aria-current="page">${escapeHtml(title)}</span></nav>
<article><header class="seo-page-hero cms-article-hero"><div class="seo-label-row"><span class="seo-label ${verificationClass(item)}">${escapeHtml(status)}</span>${categories.slice(0, 3).map((category) => `<span class="seo-label${category === "リーク" ? " leak" : ""}">${escapeHtml(category)}</span>`).join("")}</div><h1>${escapeHtml(title)}</h1><p class="cms-article-summary">${escapeHtml(summary)}</p><div class="cms-visible-dates"><span>公開日：<time datetime="${published}">${publishedLabel}</time></span>${modifiedLabel && modifiedLabel !== publishedLabel ? `<span>最終更新：<time datetime="${modified}">${modifiedLabel}</time></span>` : ""}<span>執筆・確認：<a href="/authors/editorial-team/">GTA6インフォ編集部</a></span><span>主要情報元：${directSources.length ? "本文内リンク" : "Rockstar Games公式"}</span></div></header>
${hero}${toc}${articleNotice}<div class="seo-content cms-article-content"><section class="cms-article-body">${prepared.body}</section><section><h2>主要出典・確認方法</h2>${sourceMarkup}</section>${related}</div></article></div></main>
<footer class="seo-footer"><div class="seo-container seo-footer-grid"><div><strong>GTA6インフォ</strong><p>公式情報と未確認情報を分けて整理する非公式ファンサイトです。</p></div><nav><a href="/articles/">最新記事</a><a href="/release/">発売情報</a><a href="/vehicles/">登場車両</a><a href="/editorial-policy/">編集・掲載方針</a><a href="/source-policy/">出典・引用方針</a><a href="/contact/">お問い合わせ</a></nav></div></footer></body></html>`;
}

export default async function handler(request, response) {
  if (request.method !== "GET" && request.method !== "HEAD") {
    response.setHeader("Allow", "GET, HEAD");
    return response.status(405).end("Method not allowed");
  }
  try {
    const [item, allItems] = await Promise.all([
      fetchCmsContent(clean(request.query.id)),
      fetchCmsListing(100)
    ]);
    const policy = cmsContentPolicy(item);
    if (policy.status === "merged" && /^\/(?!\/)/.test(policy.redirectTo)) {
      response.setHeader("Location", policy.redirectTo);
      return response.status(301).end();
    }
    if (policy.status === "retired") {
      response.setHeader("Content-Type", "text/html; charset=utf-8");
      response.setHeader("X-Robots-Tag", "noindex, follow");
      return response.status(410).send(request.method === "HEAD" ? "" : retiredHtml());
    }
    if (policy.status === "draft") {
      response.setHeader("Content-Type", "text/html; charset=utf-8");
      response.setHeader("X-Robots-Tag", "noindex, follow");
      return response.status(404).send(request.method === "HEAD" ? "" : notFoundHtml());
    }
    const related = allItems
      .filter((entry) => entry.id !== item.id && isCrawlEntryContent(entry))
      .map((entry) => ({ entry, score: relatedArticleScore(item, entry) }))
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)
      .map(({ entry }) => entry);
    const html = articleHtml(item, related, policy);
    response.setHeader("Content-Type", "text/html; charset=utf-8");
    response.setHeader("Cache-Control", "public, max-age=0, s-maxage=300, stale-while-revalidate=86400");
    if (policy.status === "hold" || !policy.indexable) response.setHeader("X-Robots-Tag", "noindex, follow");
    return response.status(200).send(request.method === "HEAD" ? "" : html);
  } catch (error) {
    const status = error?.status === 404 ? 404 : 502;
    response.setHeader("Content-Type", "text/html; charset=utf-8");
    response.setHeader("X-Robots-Tag", "noindex, follow");
    return response.status(status).send(request.method === "HEAD" ? "" : notFoundHtml());
  }
}
