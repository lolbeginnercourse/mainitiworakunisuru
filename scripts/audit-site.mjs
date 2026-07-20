import { readFile, readdir, stat } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { ARTICLE_DESCRIPTIONS, sanitizeRichText } from "../lib/cms-server.js";
import { auditHtmlLinks } from "../lib/link-audit.js";

const root = fileURLToPath(new URL("../", import.meta.url));
const failures = [];
const assert = (condition, message) => { if (!condition) failures.push(message); };
const read = (path) => readFile(join(root, path), "utf8");

const sitemap = await read("sitemap.xml");
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
const titles = new Map();
const dynamicPaths = new Set(["/", "/articles/"]);
assert(urls.length === new Set(urls).size, "sitemap.xmlに重複URLがあります");
const controlledPaths = ["category", "guide", "news", "official", "systems", "leaks", "characters", "online"];
assert(!urls.some((url) => new RegExp(`/(${controlledPaths.join("|")})/$`).test(url)), "統合・終了・保留URLがsitemap.xmlに残っています");
assert(!urls.some((url) => /\/search\//.test(url)), "検索結果ページがsitemap.xmlに含まれています");

for (const url of urls) {
  const pathname = new URL(url).pathname;
  if (dynamicPaths.has(pathname)) continue;
  const file = pathname === "/" ? "index.html" : `${pathname.replace(/^\//, "")}index.html`;
  try {
    await stat(join(root, file));
    const html = await read(file);
    const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
    assert(Boolean(title), `${file}: titleがありません`);
    if (title) {
      assert(!titles.has(title), `${file}: titleが${titles.get(title)}と重複しています`);
      titles.set(title, file);
    }
    assert(/<meta name="description"/.test(html), `${file}: descriptionがありません`);
    const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
    assert(canonical === url, `${file}: canonicalが正規URLと一致しません`);
    assert((html.match(/<h1[ >]/g) || []).length === 1, `${file}: h1が1つではありません`);
    assert(/<meta property="og:image"/.test(html), `${file}: OGP画像がありません`);
    for (const block of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
      try { JSON.parse(block[1]); } catch { failures.push(`${file}: JSON-LDを解析できません`); }
    }
    const hrefs = [...html.matchAll(/href="([^"]*)"/g)].map((match) => match[1]);
    assert(!hrefs.some((href) => !href || href === "#"), `${file}: 空または#だけのリンクがあります`);
    assert(!hrefs.some((href) => href.startsWith("http://")), `${file}: HTTPリンクがあります`);
    assert(!hrefs.some((href) => href.includes("www.mainitiworakunisuru.com")), `${file}: www版URLがあります`);
    failures.push(...auditHtmlLinks(html, file));
  } catch {
    failures.push(`${file}: sitemap掲載ファイルがありません`);
  }
}

for (const file of ["index.html", "404.html", "api/home.js", "scripts/generate-map-pages.mjs", "scripts/generate-seo-pages.mjs"]) {
  const content = await read(file);
  assert(!content.includes('href="/#search"') && !content.includes('href="#search"'), `${file}: 旧検索リンクが残っています`);
}

for (const slug of ["release", "vehicles"]) {
  const html = await read(`${slug}/index.html`);
  assert(html.includes('"@type":"Article"'), `${slug}: Article構造化データがありません`);
  assert(html.includes("GTA6インフォ編集部"), `${slug}: 執筆・確認者がありません`);
}

for (const slug of ["characters", "online"]) {
  const html = await read(`${slug}/index.html`);
  assert(/<meta name="robots" content="noindex,follow"/.test(html), `${slug}: 保留ページがnoindexではありません`);
  assert(!html.includes("application/ld+json"), `${slug}: 保留ページに構造化データが残っています`);
  assert(!urls.some((url) => new URL(url).pathname === `/${slug}/`), `${slug}: 保留ページがsitemap.xmlに含まれています`);
}

const categoryHtml = await read("category/index.html");
assert(/<meta name="robots" content="noindex,follow"/.test(categoryHtml), "category: 保留ページがnoindexではありません");
assert(!categoryHtml.includes("application/ld+json"), "category: 保留ページに構造化データが残っています");
assert(!urls.some((url) => new URL(url).pathname === "/category/"), "category: sitemap.xmlに含まれています");

const retired = await read("410.html");
assert(/<meta name="robots" content="noindex,follow"/.test(retired), "410.htmlがnoindexではありません");
assert(!retired.includes('rel="canonical"'), "410.htmlにcanonicalがあります");
assert(!retired.includes("application/ld+json"), "410.htmlに構造化データがあります");

const config = JSON.parse(await read("vercel.json"));
const catchAll = config.routes.find((route) => route.src === "^/.*$");
assert(catchAll?.status === 404, "不明URLのステータスが404ではありません");
assert(config.routes.some((route) => route.src === "^/(guide|news|official)/?$" && route.status === 301 && route.headers?.Location === "/release/"), "統合3ページの301転送がありません");
assert(config.routes.some((route) => route.src === "^/(systems|leaks)/?$" && route.status === 410 && route.dest === "/410.html"), "終了2ページの410応答がありません");
assert(config.routes.some((route) => route.src === "^/(characters|online)/$" && /noindex/i.test(route.headers?.["X-Robots-Tag"] || "")), "保留2ページのX-Robots-Tagがありません");
assert(config.routes.some((route) => route.src === "^/category/$" && /noindex/i.test(route.headers?.["X-Robots-Tag"] || "")), "categoryのX-Robots-Tagがありません");
assert(config.routes.some((route) => route.src === "^/vice-city/?$" && route.status === 301 && route.headers?.Location === "/map/vice-city/"), "vice-cityの1ホップ301転送がありません");
assert(config.routes.some((route) => route.src === "^/search/$" && route.dest === "/api/search"), "検索ルートがありません");
assert(config.routes.some((route) => route.src === "^/articles/([^/]+)/$" && route.dest === "/api/article?id=$1"), "CMS記事ルートがありません");
assert(config.routes.some((route) => route.src === "^/sitemap\\.xml$" && route.dest === "/api/sitemap"), "動的サイトマップルートがありません");
assert(config.routes.some((route) => route.src === "^/$" && route.dest === "/api/home"), "トップページがサーバー描画へ接続されていません");

const homeApi = await read("api/home.js");
assert(homeApi.includes("filter(isCrawlEntryContent).slice(0, 8)"), "トップページが公開・導線対象の記事だけに制限されていません");
assert(homeApi.includes('href="/release/"') && homeApi.includes('href="/articles/"'), "トップページに目的別の実リンクがありません");
const articleApi = await read("api/article.js");
assert(articleApi.includes("h2Count >= 4"), "記事目次の表示条件がありません");
assert(articleApi.includes("relatedArticleScore"), "関連記事が意味的に選ばれていません");
assert(articleApi.includes("主要出典・確認方法"), "記事に出典欄がありません");
assert(articleApi.includes("cmsContentPolicy") && articleApi.includes("response.status(410)"), "CMS記事の公開状態制御がありません");
assert(!articleApi.includes('href="/leaks/"'), "記事詳細から終了ページへのリンクが残っています");

async function listSourceFiles(directory = root, prefix = "") {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.name === ".git") continue;
    const relative = prefix ? `${prefix}/${entry.name}` : entry.name;
    const absolute = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await listSourceFiles(absolute, relative));
    else if (/\.(?:html|js|xml)$/i.test(entry.name)) files.push(relative);
  }
  return files;
}

const targetSourcePrefixes = /^(?:guide|news|official|systems|leaks|characters|online)\//;
for (const file of await listSourceFiles()) {
  if (targetSourcePrefixes.test(file) || file === "lib/index-control.js") continue;
  const source = await read(file);
  assert(!/href=["']\/(?:category|guide|news|official|systems|leaks|characters|online)\//.test(source), `${file}: 統合・終了・保留ページへの内部リンクがあります`);
}

const robots = await read("robots.txt");
assert(!/(?:category|guide|news|official|systems|leaks|characters|online)/.test(robots), "robots.txtで状態管理対象URLをブロックしています");

const descriptions = Object.values(ARTICLE_DESCRIPTIONS);
assert(descriptions.length === 11, "公開中11記事の個別descriptionが揃っていません");
assert(descriptions.length === new Set(descriptions).size, "記事descriptionが重複しています");
for (const [id, description] of Object.entries(ARTICLE_DESCRIPTIONS)) {
  assert(description.length >= 80 && description.length <= 120, `${id}: descriptionが80〜120文字ではありません`);
  assert(!/[、,]\s*$|…\s*$/u.test(description), `${id}: descriptionが文の途中で終わっています`);
}

assert(config.buildCommand === "node scripts/audit-site.mjs && node scripts/audit-cms-links.mjs", "Vercelの公開前リンク検査が設定されていません");

const hostileRichText = sanitizeRichText('<a href=javascript:alert(1)>x</a><svg><a xlink:href=javascript:alert(2)>y</a></svg><iframe src=x /><meta http-equiv="refresh" content="0;url=https://example.com">');
assert(!/(?:javascript:|xlink:href|<svg|<iframe|<meta)/i.test(hostileRichText), "CMS本文の危険なHTMLが除去されていません");
const safeRichText = sanitizeRichText('<table><tr><td><a href="https://example.org/">内容</a></td></tr></table>');
assert(/<table>/.test(safeRichText) && /href="https:\/\/example\.org\/"/.test(safeRichText), "CMS本文の安全な表・リンクが壊れています");

const articleCss = await read("assets/css/14-cms-article.css");
assert(articleCss.includes(".cms-server-card>img,.cms-list-placeholder{display:grid;width:220px;height:124px"), "記事一覧の画像に横長の固定寸法がありません");
assert(articleCss.includes(".seo-home-latest .cms-server-list{grid-template-columns:1fr"), "トップの記事一覧が横長1列レイアウトではありません");
assert(articleCss.includes(".seo-home-latest-card>img,.seo-home-latest-card>.cms-list-placeholder{width:110px;height:74px}"), "スマホの記事画像に固定寸法がありません");

if (failures.length) {
  console.error(failures.map((failure) => `- ${failure}`).join("\n"));
  process.exit(1);
}
console.log(`Audit passed: ${urls.length} indexed URLs, redirects/search/404/article metadata verified.`);
