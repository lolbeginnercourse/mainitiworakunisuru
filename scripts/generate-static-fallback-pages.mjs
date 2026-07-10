import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const root = process.cwd();
const siteData = readFileSync(join(root, "app", "site-data.ts"), "utf8");

function pick(source, key) {
  const match = source.match(new RegExp(`${key}:"([^"]*)"`, "u"));
  return match ? match[1] : "";
}

function parseCollection(name) {
  const start = siteData.indexOf(`export const ${name} = [`);
  if (start < 0) return [];
  const bodyStart = siteData.indexOf("[", start);
  const bodyEnd = siteData.indexOf("];", bodyStart);
  return siteData
    .slice(bodyStart + 1, bodyEnd)
    .split(/\n\s*\{/u)
    .map((chunk) => (chunk.startsWith("{") ? chunk : `{${chunk}`))
    .filter((chunk) => chunk.includes("slug:"))
    .map((chunk) => ({
      slug: pick(chunk, "slug"),
      name: pick(chunk, "name"),
      prefecture: pick(chunk, "prefecture"),
      area: pick(chunk, "area"),
      station: pick(chunk, "station"),
      summary: pick(chunk, "summary"),
      description: pick(chunk, "description"),
    }))
    .filter((item) => item.slug && item.name);
}

const theaters = parseCollection("theaters");
const areas = parseCollection("areas");
const generatedAt = new Date().toISOString().slice(0, 10);

function writePage(path, html) {
  const outPath = join(root, path);
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, html, "utf8");
}

function baseHead(title, description) {
  return `<!doctype html>
<html lang="ja">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="${description}">
  <title>${title}</title>
  <link rel="icon" href="/public/favicon.svg" type="image/svg+xml">
  <style>
    :root{--p:#e54887;--pd:#be2867;--b:#ead7df;--m:#625a60;--t:#171317;--s:#fff1f6;--shadow:0 16px 42px rgba(88,46,67,.1)}
    *{box-sizing:border-box}body{margin:0;color:var(--t);font-family:"Noto Sans JP","Hiragino Kaku Gothic ProN","Yu Gothic",system-ui,sans-serif;line-height:1.8}a{text-decoration:none;color:inherit}.container{width:min(calc(100% - 32px),1120px);margin:0 auto}.header{border-bottom:1px solid #f5c9d9;background:#fff}.header-inner{min-height:72px;display:flex;align-items:center;justify-content:space-between}.brand{display:inline-flex;align-items:center;gap:10px;font-weight:900}.brand-mark{width:40px;height:40px;display:grid;place-items:center;border-radius:12px 12px 12px 3px;background:var(--p);color:#fff;font:italic 25px Georgia,serif}.nav{display:flex;gap:20px;font-size:14px;font-weight:800}.hero{padding:56px 0;background:var(--s)}.eyebrow{color:var(--pd);font-size:12px;font-weight:900;letter-spacing:.13em}h1{margin:0;font-size:clamp(32px,5vw,48px);line-height:1.35}.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;padding:48px 0}.card{padding:24px;border:1px solid var(--b);border-radius:16px;background:#fff;box-shadow:var(--shadow)}.card p,.muted{color:var(--m)}.button{min-height:44px;padding:9px 14px;border:1px solid var(--p);border-radius:10px;color:var(--pd);display:flex;justify-content:space-between;font-weight:900}.primary{display:inline-flex;min-height:48px;align-items:center;justify-content:center;padding:0 18px;border-radius:10px;background:var(--p);color:#fff;font-weight:900}@media(max-width:900px){.nav{display:none}.grid{grid-template-columns:1fr 1fr}}@media(max-width:640px){.grid{grid-template-columns:1fr}.hero{padding:38px 0}}
  </style>
</head>
<body>
<header class="header"><div class="container header-inner"><a class="brand" href="/"><span class="brand-mark">S</span><span>ステージ<span style="color:var(--p)">泊</span></span></a><nav class="nav"><a href="/theaters/">劇場から探す</a><a href="/areas/">地域から探す</a><a href="/search/">目的から探す</a></nav></div></header>`;
}

function pageEnd() {
  return `<footer style="margin-top:40px;padding:38px 0;background:#171317;color:#fff"><div class="container"><p style="color:#cfc6cb;font-size:13px">© 2026 ステージ泊 / Generated ${generatedAt}</p></div></footer></body></html>`;
}

function placeholderTheater(theater) {
  return `${baseHead(`${theater.name}近くのホテル｜ステージ泊`, `${theater.name}近くのホテル情報を準備中です。`)}
<main><section class="hero"><div class="container"><p class="eyebrow">THEATER HOTEL GUIDE</p><h1>${theater.name}近くのホテル</h1><p class="muted">${theater.area}・${theater.prefecture} 周辺のホテル情報は準備中です。</p></div></section><div class="container"><div class="card" style="margin:34px 0"><h2>ホテル情報を準備中です</h2><p>${theater.station}周辺の徒歩圏ホテル、電車アクセスに便利なホテル、料金目安、Googleマップルートを確認でき次第追加します。</p><a class="primary" href="/theaters/">劇場一覧へ戻る</a></div></div></main>${pageEnd()}`;
}

function indexPage(title, lead, cards) {
  return `${baseHead(`${title}｜ステージ泊`, lead)}
<main><section class="hero"><div class="container"><p class="eyebrow">STAGE HOTEL GUIDE</p><h1>${title}</h1><p class="muted">${lead}</p></div></section><div class="container grid">${cards}</div></main>${pageEnd()}`;
}

const theaterCards = theaters
  .map((theater) => `<article class="card"><p>${theater.area} / ${theater.prefecture}</p><h2>${theater.name}</h2><p>${theater.summary}</p><a class="button" href="/theaters/${theater.slug}/">ホテルを見る <span>→</span></a></article>`)
  .join("");

const areaCards = areas
  .map((area) => `<article class="card"><p>${area.station}</p><h2>${area.name}</h2><p>${area.description}</p><a class="button" href="/areas/${area.slug}/">エリアを見る <span>→</span></a></article>`)
  .join("");

writePage("theaters/index.html", indexPage("劇場から探す", "観劇する劇場を起点に、泊まりやすいホテルを探せます。", theaterCards));
writePage("theaters.html", indexPage("劇場から探す", "観劇する劇場を起点に、泊まりやすいホテルを探せます。", theaterCards));
writePage("areas/index.html", indexPage("地域から探す", "宿泊しやすいエリアを起点に、対応する劇場を確認できます。", areaCards));
writePage("areas.html", indexPage("地域から探す", "宿泊しやすいエリアを起点に、対応する劇場を確認できます。", areaCards));
writePage("search/index.html", indexPage("目的から探す", "近さ、料金、荷物預かりなど、重視したい条件から探せます。", `<article class="card"><h2>検索ページを準備中です</h2><p>条件別の一覧は準備中です。先に劇場一覧から確認してください。</p><a class="button" href="/theaters/">劇場一覧を見る <span>→</span></a></article>`));
writePage("search.html", indexPage("目的から探す", "近さ、料金、荷物預かりなど、重視したい条件から探せます。", `<article class="card"><h2>検索ページを準備中です</h2><p>条件別の一覧は準備中です。先に劇場一覧から確認してください。</p><a class="button" href="/theaters/">劇場一覧を見る <span>→</span></a></article>`));

for (const theater of theaters) {
  if (theater.slug === "tennozu-galaxy-theatre") continue;
  const html = placeholderTheater(theater);
  writePage(`theaters/${theater.slug}/index.html`, html);
  writePage(`theaters/${theater.slug}.html`, html);
}

for (const area of areas) {
  const html = indexPage(`${area.name}のホテル・劇場`, area.description, `<article class="card"><h2>${area.name}周辺の情報を準備中です</h2><p>対応する劇場とホテル候補を確認でき次第追加します。</p><a class="button" href="/theaters/">劇場一覧を見る <span>→</span></a></article>`);
  writePage(`areas/${area.slug}/index.html`, html);
  writePage(`areas/${area.slug}.html`, html);
}

const sitemapUrls = [
  "",
  "theaters/",
  "areas/",
  "search/",
  ...theaters.map((theater) => `theaters/${theater.slug}/`),
  ...areas.map((area) => `areas/${area.slug}/`),
];
writePage(
  "sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapUrls
    .map((path) => `  <url>\n    <loc>https://mainitiworakunisuru.com/${path}</loc>\n  </url>`)
    .join("\n")}\n</urlset>\n`,
);
