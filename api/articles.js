import { ORIGIN, articlePath, articleSummary, cmsCategories, cmsImage, escapeHtml, escapeJson, fetchCmsContents, imageVariant } from "../lib/cms-server.js";

export default async function handler(request, response) {
  if (request.method !== "GET" && request.method !== "HEAD") {
    response.setHeader("Allow", "GET, HEAD");
    return response.status(405).end("Method not allowed");
  }
  try {
    const category = String(request.query.category || "").trim();
    const isLeaks = request.query.hub === "leaks";
    const allItems = await fetchCmsContents(100);
    const items = category ? allItems.filter((item) => cmsCategories(item).includes(category)) : allItems;
    const canonicalPath = isLeaks ? "/leaks/" : "/articles/";
    const canonical = `${ORIGIN}${canonicalPath}`;
    const title = isLeaks ? "GTA6のリーク・未確認情報" : "GTA6の最新記事";
    const description = isLeaks
      ? "GTA6のリーク、噂、未確認情報を公式発表と分け、出所と確認状況が分かる形で整理します。"
      : "GTA6の公式情報、ニュース、考察、リーク検証を公開順に確認できる記事一覧です。";
    const cards = items.length
      ? items.map((item) => {
        const image = cmsImage(item);
        const imageMarkup = image.url
          ? `<img src="${escapeHtml(imageVariant(image.url, 480))}" width="${image.width}" height="${image.height}" alt="${escapeHtml(item.name || "記事")}のサムネイル" loading="lazy" decoding="async">`
          : `<span class="cms-list-placeholder" aria-hidden="true">G</span>`;
        return `<a class="cms-server-card" href="${articlePath(item)}">${imageMarkup}<span><span class="seo-label-row">${cmsCategories(item).slice(0, 2).map((value) => `<span class="seo-label${value === "リーク" ? " leak" : ""}">${escapeHtml(value)}</span>`).join("")}</span><strong>${escapeHtml(item.name || "無題の記事")}</strong><p>${escapeHtml(articleSummary(item, 92))}</p><em>記事を読む <span aria-hidden="true">›</span></em></span></a>`;
      }).join("")
      : `<div class="seo-search-empty"><h2>現在公開中の記事はありません</h2><p>公開後にこの一覧へ自動で追加されます。</p></div>`;
    const schema = { "@context": "https://schema.org", "@type": "CollectionPage", name: title, description, url: canonical, inLanguage: "ja", mainEntity: { "@type": "ItemList", itemListElement: items.map((item, index) => ({ "@type": "ListItem", position: index + 1, url: `${ORIGIN}${articlePath(item)}`, name: item.name })) } };
    const html = `<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="description" content="${description}"><meta name="robots" content="index,follow,max-image-preview:large"><link rel="canonical" href="${canonical}"><meta property="og:type" content="website"><meta property="og:site_name" content="GTA6インフォ"><meta property="og:title" content="${title}"><meta property="og:description" content="${description}"><meta property="og:url" content="${canonical}"><meta property="og:image" content="${ORIGIN}/assets/images/og-default.png"><meta name="twitter:card" content="summary_large_image"><title>${title}｜GTA6インフォ</title><link rel="stylesheet" href="/assets/css/00-tokens-base.css"><link rel="stylesheet" href="/assets/css/11-seo-static.css"><link rel="stylesheet" href="/assets/css/14-cms-article.css"><script type="application/ld+json">${escapeJson(schema)}</script></head><body class="seo-static-page cms-server-page"><a class="seo-skip" href="#main">本文へ移動</a><header class="seo-header"><div class="seo-container seo-header-inner"><a class="seo-brand" href="/"><span>G</span><strong>GTA6インフォ<small>日本語・非公式情報サイト</small></strong></a><nav><a href="/">ホーム</a><a href="/articles/" aria-current="page">最新記事</a><a href="/release/">発売情報</a><a href="/map/">舞台・地域</a><a href="/search/">検索</a></nav></div></header><main id="main"><div class="seo-container"><nav class="seo-breadcrumb" aria-label="パンくず"><a href="/">ホーム</a><span>›</span><span aria-current="page">${title}</span></nav><header class="seo-page-hero"><p>${isLeaks ? "LEAKS / UNCONFIRMED" : "LATEST ARTICLES"}</p><h1>${title}</h1><div>${description}</div></header>${isLeaks ? `<div class="seo-content"><section><h2>掲載の考え方</h2><p>リークや噂を確定情報として扱いません。権利未確認の流出画像・動画は転載せず、公式発表後に確認状況を更新します。</p></section></div>` : ""}<section class="cms-server-list" aria-label="記事一覧">${cards}</section></div></main><footer class="seo-footer"><div class="seo-container seo-footer-grid"><div><strong>GTA6インフォ</strong><p>公式情報と未確認情報を分けて整理する非公式ファンサイトです。</p></div><nav><a href="/release/">発売情報</a><a href="/leaks/">リーク・未確認情報</a><a href="/editorial-policy/">編集・掲載方針</a><a href="/source-policy/">出典・引用方針</a></nav></div></footer></body></html>`;
    response.setHeader("Content-Type", "text/html; charset=utf-8");
    response.setHeader("Cache-Control", "public, max-age=0, s-maxage=300, stale-while-revalidate=86400");
    return response.status(200).send(request.method === "HEAD" ? "" : html);
  } catch {
    return response.status(502).send("記事一覧を取得できませんでした");
  }
}
