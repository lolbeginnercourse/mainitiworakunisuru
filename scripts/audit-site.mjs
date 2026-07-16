import { readFile, stat } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const failures = [];
const assert = (condition, message) => { if (!condition) failures.push(message); };
const read = (path) => readFile(join(root, path), "utf8");

const sitemap = await read("sitemap.xml");
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
const titles = new Map();
assert(urls.length === new Set(urls).size, "sitemap.xmlに重複URLがあります");
assert(!urls.some((url) => /\/(news|official)\/$/.test(url)), "転送URLがsitemap.xmlに残っています");
assert(!urls.some((url) => /\/search\//.test(url)), "検索結果ページがsitemap.xmlに含まれています");

for (const url of urls) {
  const pathname = new URL(url).pathname;
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
  } catch {
    failures.push(`${file}: sitemap掲載ファイルがありません`);
  }
}

for (const file of ["index.html", "404.html", "scripts/generate-map-pages.mjs", "scripts/generate-seo-pages.mjs"]) {
  const content = await read(file);
  assert(!content.includes('href="/#search"') && !content.includes('href="#search"'), `${file}: 旧検索リンクが残っています`);
}

for (const slug of ["release", "characters", "vehicles", "systems", "online", "leaks", "guide"]) {
  const html = await read(`${slug}/index.html`);
  assert(html.includes('"@type":"Article"'), `${slug}: Article構造化データがありません`);
  assert(html.includes("GTA6インフォ編集部"), `${slug}: 執筆・確認者がありません`);
}

const config = JSON.parse(await read("vercel.json"));
const catchAll = config.routes.find((route) => route.src === "^/.*$");
assert(catchAll?.status === 404, "不明URLのステータスが404ではありません");
assert(config.routes.some((route) => route.src === "^/(news|official)/?$" && route.status === 308), "旧3ページ統合用の転送がありません");
assert(config.routes.some((route) => route.src === "^/search/$" && route.dest === "/api/search"), "検索ルートがありません");

if (failures.length) {
  console.error(failures.map((failure) => `- ${failure}`).join("\n"));
  process.exit(1);
}
console.log(`Audit passed: ${urls.length} indexed URLs, redirects/search/404/article metadata verified.`);
