import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { ARTICLE_DESCRIPTIONS, articleDescription, fetchCmsContents, sanitizeRichText } from "../lib/cms-server.js";
import { auditHtmlLinks, auditRawCmsLinks } from "../lib/link-audit.js";

const root = fileURLToPath(new URL("../", import.meta.url));

async function loadLocalEnv() {
  if (process.env.MICROCMS_SERVICE_DOMAIN && process.env.MICROCMS_API_KEY) return;
  for (const name of ["APIキー.env.local", ".env.local"]) {
    try {
      const content = await readFile(`${root}${name}`, "utf8");
      for (const line of content.split(/\r?\n/)) {
        const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
        if (!match || process.env[match[1]]) continue;
        process.env[match[1]] = match[2].trim().replace(/^['"]|['"]$/g, "");
      }
    } catch {}
  }
}

await loadLocalEnv();

const failures = [];
const requiredIds = new Set(Object.keys(ARTICLE_DESCRIPTIONS));
let contents;
try {
  contents = await fetchCmsContents(100);
} catch (error) {
  console.error(`CMS公開前リンク検査でコンテンツを取得できません: ${error.message}`);
  process.exit(1);
}

for (const item of contents) {
  const raw = item.ritti || (item.honbunn ? `<p>${item.honbunn}</p>` : "");
  failures.push(...auditRawCmsLinks(raw, `記事 ${item.id} のCMS本文`));
  const rendered = sanitizeRichText(raw);
  failures.push(...auditHtmlLinks(rendered, `記事 ${item.id} の公開HTML`));
  if (requiredIds.has(item.id)) {
    requiredIds.delete(item.id);
    const description = articleDescription(item);
    if (description.length < 80 || description.length > 120) failures.push(`記事 ${item.id} のdescriptionが80〜120文字ではありません`);
    if (/[、,]\s*$|…\s*$/u.test(description)) failures.push(`記事 ${item.id} のdescriptionが文の途中で終わっています`);
  }
}

if (requiredIds.size) failures.push(`対象記事をCMSから取得できません: ${[...requiredIds].join(", ")}`);
const descriptions = Object.values(ARTICLE_DESCRIPTIONS);
if (descriptions.length !== new Set(descriptions).size) failures.push("記事descriptionが重複しています");

const regression = auditHtmlLinks('<a href="http://壊れた.example/path" target="_blank">壊れたリンク</a>', "回帰テスト");
if (!regression.length) failures.push("意図的な不正URLをリンク検査が検出できません");

async function renderArticle(id) {
  const { default: handler } = await import("../api/article.js");
  const state = { status: 0, headers: {}, body: "" };
  const response = {
    setHeader(name, value) { state.headers[name.toLowerCase()] = value; },
    status(value) { state.status = value; return this; },
    send(value = "") { state.body = String(value); return this; },
    end(value = "") { state.body = String(value); return this; }
  };
  await handler({ method: "GET", query: { id } }, response);
  if (state.status !== 200) failures.push(`記事 ${id} の本番HTML生成がHTTP ${state.status}相当で失敗しました`);
  return state.body;
}

const renderedMod = await renderArticle("19hekcuk8bl");
const cfxUrl = "https://www.rockstargames.com/newswire/article/8971o8789584a4/roleplay-community-update";
const cfxLabel = "Rockstar Games：Cfx.re Joins Rockstar Games（2023年8月11日）";
const renderedModBody = renderedMod.match(/<section class="cms-article-body">([\s\S]*?)<\/section>/i)?.[1] || "";
if ((renderedModBody.match(new RegExp(cfxUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g")) || []).length !== 1) {
  failures.push("MOD記事のCfx.re公式リンクが1件に統合されていません");
}
if (!renderedModBody.includes(`>${cfxLabel}</a>`)) failures.push("MOD記事のCfx.re公式リンク名が指定文言と一致しません");
failures.push(...auditHtmlLinks(renderedMod, "MOD記事の本番HTML"));

const renderedAmazon = await renderArticle("g_3w1zg2-iaa");
for (const url of [
  "https://www.amazon.co.jp/",
  "https://www.yodobashi.com/",
  "https://www.biccamera.com/bc/main/",
  "https://store.playstation.com/ja-jp/product/JP0230-PPSA29660_00-GTAVISTANDARD001",
  "https://www.xbox.com/ja-JP/games/store/vi/9NL3WWNZLZZN/0010",
  "https://www.rockstargames.com/VI/"
]) {
  if (!renderedAmazon.includes(`href="${url}"`)) failures.push(`Amazon記事に指定リンクがありません: ${url}`);
}
if (!/href="https:\/\/amzn\.to\/4w2afGV"[^>]*rel="[^"]*sponsored[^"]*noopener[^"]*noreferrer[^"]*"/i.test(renderedAmazon)) {
  failures.push("Amazon記事の短縮URLにsponsored noopener noreferrerが揃っていません");
}
if (!renderedAmazon.includes("2026年7月20日時点")) failures.push("Amazon記事に販売状況の確認日がありません");
failures.push(...auditHtmlLinks(renderedAmazon, "Amazon記事の本番HTML"));

for (const [id, description] of Object.entries(ARTICLE_DESCRIPTIONS)) {
  const html = id === "19hekcuk8bl" ? renderedMod : id === "g_3w1zg2-iaa" ? renderedAmazon : await renderArticle(id);
  const escaped = description.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const occurrences = [
    `<meta name="description" content="${escaped}">`,
    `<meta property="og:description" content="${escaped}">`,
    `<meta name="twitter:description" content="${escaped}">`,
    `\"description\":\"${description}\"`
  ];
  if (occurrences.some((value) => !html.includes(value))) failures.push(`記事 ${id} のmeta・OG・Twitter・Article descriptionが一致しません`);
}

if (failures.length) {
  console.error(failures.map((failure) => `- ${failure}`).join("\n"));
  process.exit(1);
}

console.log(`CMS link audit passed: ${contents.length} published records checked.`);
