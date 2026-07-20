export const ORIGIN = "https://mainitiworakunisuru.com";

export const ARTICLE_DESCRIPTIONS = Object.freeze({
  "vfu1c65zit": "GTA6で実装が噂される釣り・筋力トレーニング・ボウリングなど11種類を整理。2022年の流出映像に基づく未確認情報として、公式発表との違いを分けて確認できます。",
  "k_ei265jy": "GTA6で実装されそうな強盗準備、車両保管、水上移動、SNSなどの要素を整理。公式トレーラーで確認できる内容と、流出映像に基づく予測を現在の範囲で分けて紹介します。",
  "d60oe14xoi6": "GTA6が実況、ライブ配信、ショート動画、RPドラマなどの創作活動に与える可能性を整理。現在の配信環境と過去作の事例を基に、収益化と権利面の注意点も確認します。",
  "u2g44c7uy": "GTA6のPC版がPS5・Xbox Series X|S版と同時発売されない理由を考察。公式にはPC版の発売日・必要スペックとも未発表で、過去作の傾向と現在の状況を整理します。",
  "g_3w1zg2-iaa": "GTA6の日本向け予約状況を調査。Amazon・楽天・PlayStation Store・Xbox Storeの販売状況と、非公式商品を避ける確認点を整理します。",
  "19hekcuk8bl": "GTA6のMODがGTA5の規模を超える可能性を、PC版の発表状況、制作環境、Cfx.reの動向から考察。公式発表済みの事実と、発売後に確認が必要な予測を分けて整理します。",
  "5a23s8gr8": "GTA5とGTA6の違いを、舞台、主人公、NPC、警察、車両、犯罪システムの観点で比較。公式公開済みの内容と、映像からの考察・未発表事項を整理して確認できます。",
  "hqa9kli6slu4": "2022年に流出した約90本のGTA6開発映像について、発生経緯、Rockstar Gamesの対応、後に公式情報で確認された内容を整理。映像自体は掲載せず事実関係を解説します。",
  "8v240x9xu2": "NBA選手ミカル・ブリッジズがGTA6に出演するという噂を調査。発言とされる情報の出所、公式発表の有無、現在確定できない理由を分け、本人役かどうかも未発表として整理します。",
  "lid80cxqy4": "GTA6のNPCやモブAIがどう進化する可能性があるか、公式映像と過去作の仕組みから考察。移動、天候への反応、生活行動について、現時点の確認済み情報と予測を分けます。",
  "p0kuqp4wmj": "GTA6で公式に名称が確認されたGrotti、Vapid、Dinka、Shitzuを整理。自動車・バイク・ボートの区分と、日本車風ブランドや未発表メーカーの扱いを分けて解説します。"
});

const CFX_SOURCE_URL = "https://www.rockstargames.com/newswire/article/8971o8789584a4/roleplay-community-update";
const RETAIL_LINKS = new Map([
  ["http://amazon.co.jp", "https://www.amazon.co.jp/"],
  ["http://www.amazon.co.jp", "https://www.amazon.co.jp/"],
  ["http://ヨドバシ.com", "https://www.yodobashi.com/"],
  ["http://ビックカメラ.com", "https://www.biccamera.com/bc/main/"]
]);
const EVIDENCE_EXCLUDED_HOSTS = /(?:^|\.)(?:amzn\.to|amazon\.co\.jp|rakuten\.co\.jp|yodobashi\.com|biccamera\.com)$/i;

const withdrawnContentIds = new Set([
  "mj_c93czbup",
  "1z_k36dv0i5",
  "uyibhc7ad"
]);

export const clean = (value = "") => String(value || "").trim();

export const escapeHtml = (value = "") => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");

export const escapeJson = (value) => JSON.stringify(value).replaceAll("<", "\\u003c");

export function cmsCategories(item) {
  const value = item?.category;
  if (Array.isArray(value)) return value.map(clean).filter(Boolean);
  return value ? [clean(value)] : [];
}

export function articlePath(itemOrId) {
  const value = typeof itemOrId === "object"
    ? clean(itemOrId.slug || itemOrId.id)
    : clean(itemOrId);
  return `/articles/${encodeURIComponent(value)}/`;
}

export function cmsImage(item) {
  const media = item?.GAZOU || item?.heroImage || item?.thumbnail || item?.eyecatch || item?.image;
  if (typeof media === "string") return { url: clean(media), width: 1200, height: 675 };
  return {
    url: clean(media?.url),
    width: Number(media?.width) || 1200,
    height: Number(media?.height) || 675
  };
}

export function imageVariant(url, width = 960) {
  if (!url || !/microcms-assets\.io/i.test(url)) return url;
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}w=${width}&fm=webp&fit=max`;
}

export function stripHtml(value = "") {
  return String(value)
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#0?39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

export function articleSummary(item, max = 118) {
  const text = clean(item?.summary) || stripHtml(item?.ritti || item?.honbunn || "");
  if (text.length <= max) return text;
  return `${text.slice(0, max).replace(/[、。\s]+$/u, "")}…`;
}

export function articleDescription(item) {
  const id = clean(item?.id);
  const manual = ARTICLE_DESCRIPTIONS[id];
  if (manual) return manual;
  const cmsDescription = clean(item?.description);
  if (cmsDescription && !/[、,]\s*$|…\s*$/u.test(cmsDescription)) return cmsDescription;
  const text = clean(item?.summary) || stripHtml(item?.ritti || item?.honbunn || "");
  if (!text) return "GTA6の公開情報を確認し、公式発表、報道、未確認情報、考察を区別して分かりやすく整理します。";
  const sentences = text.match(/[^。！？!?]+[。！？!?]/g) || [];
  const complete = sentences.join("").trim();
  return complete.length >= 45 && complete.length <= 140
    ? complete
    : `${clean(item?.name) || "GTA6の情報"}について、確認できる内容と未発表事項を区別して整理します。`;
}

function normalizeExternalAnchor(before, href, after, inner, state) {
  const rawHref = clean(href);
  const cfxBroken = /^http:\/\/(?:FiveMとRedMを支えるCfx\.re|GamesがCfx\.re|Cfx\.re)\/?$/iu.test(rawHref);
  if (cfxBroken) {
    if (state.cfxLinked) return stripHtml(inner) || "Cfx.re";
    state.cfxLinked = true;
    return `<a href="${CFX_SOURCE_URL}" target="_blank" rel="noopener noreferrer">Rockstar Games：Cfx.re Joins Rockstar Games（2023年8月11日）</a>`;
  }

  const mapped = RETAIL_LINKS.get(rawHref.toLocaleLowerCase("ja"));
  const nextHref = mapped || rawHref;
  if (!nextHref || nextHref === "#" || /[\s\r\n]/.test(nextHref) || /^(?:javascript|vbscript|data):/i.test(nextHref)) {
    return stripHtml(inner);
  }
  if (/^http:\/\//i.test(nextHref)) return stripHtml(inner);
  if (/^https:\/\//i.test(nextHref)) {
    if (/[^\x00-\x7F]/.test(nextHref)) return stripHtml(inner);
    try { new URL(nextHref); } catch { return stripHtml(inner); }
    const affiliate = /^https:\/\/(?:www\.)?amzn\.to\//i.test(nextHref);
    const label = affiliate ? "Amazonで商品を確認" : inner;
    const rel = affiliate ? "sponsored noopener noreferrer" : "noopener noreferrer";
    return `<a href="${nextHref}" target="_blank" rel="${rel}">${label}</a>`;
  }
  if (!/^(?:\/|#|\.\/|\.\.\/)/.test(nextHref)) return stripHtml(inner);
  return `<a href="${nextHref}">${inner}</a>`;
}

export function normalizeCmsRichText(value = "") {
  const state = { cfxLinked: false };
  return String(value).replace(/<a\b([^>]*?)href\s*=\s*(["'])(.*?)\2([^>]*)>([\s\S]*?)<\/a>/gi,
    (match, before, quote, href, after, inner) => normalizeExternalAnchor(before, href, after, inner, state));
}

export function sanitizeRichText(value = "") {
  return normalizeCmsRichText(value)
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<(script|style|iframe|object|embed|form|svg|math)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, "")
    .replace(/<(script|style|iframe|object|embed|form|svg|math|meta|link|base)\b[^>]*\/?\s*>/gi, "")
    .replace(/<(input|button|textarea|select|option)\b[^>]*\/?\s*>/gi, "")
    .replace(/\son[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/\s(srcdoc|formaction|xlink:href|style)\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/\s(href|src)\s*=\s*(?:"\s*(?:javascript|vbscript|data):[^"]*"|'\s*(?:javascript|vbscript|data):[^']*'|(?:javascript|vbscript|data):[^\s>]+)/gi, "")
    .replace(/<img\b([^>]*?)>/gi, (match, attrs) => {
      let next = attrs;
      if (!/\bloading\s*=/i.test(next)) next += ' loading="lazy"';
      if (!/\bdecoding\s*=/i.test(next)) next += ' decoding="async"';
      return `<img${next}>`;
    });
}

export function formatDate(value) {
  const date = new Date(value || "");
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "long",
    day: "numeric"
  }).format(date);
}

export function isoDate(value) {
  const date = new Date(value || "");
  return Number.isNaN(date.getTime()) ? "" : date.toISOString();
}

export function verificationLabel(item) {
  const categories = cmsCategories(item);
  const title = clean(item?.name);
  if (categories.includes("リーク")) return "リーク・未確認情報";
  if (/予想|考察|可能性|なぜ/u.test(title)) return "予測・考察";
  if (/公式/u.test(title)) return "公式情報を整理";
  return "情報整理";
}

export function verificationClass(item) {
  const label = verificationLabel(item);
  if (label.includes("リーク") || label.includes("未確認")) return "leak";
  if (label.includes("公式")) return "official";
  if (label.includes("考察") || label.includes("予測")) return "analysis";
  return "reported";
}

export function articleTopicTokens(item) {
  const source = `${clean(item?.name)} ${cmsCategories(item).join(" ")} ${stripHtml(item?.ritti || item?.honbunn || "")}`;
  const stopWords = new Set(["GTA6", "GTA", "公式", "情報", "最新", "整理", "確認", "可能性", "について", "まとめ"]);
  return new Set((source.match(/[A-Za-z][A-Za-z0-9'+-]{2,}|[一-龠ぁ-んァ-ヶー]{2,}/g) || [])
    .map((token) => token.toLocaleLowerCase("ja"))
    .filter((token) => !stopWords.has(token) && token.length < 28));
}

export function relatedArticleScore(base, candidate) {
  const baseCategories = new Set(cmsCategories(base));
  const candidateCategories = cmsCategories(candidate);
  let score = candidateCategories.reduce((total, category) => total + (baseCategories.has(category) ? 8 : 0), 0);
  const baseTokens = articleTopicTokens(base);
  const candidateTokens = articleTopicTokens(candidate);
  for (const token of candidateTokens) {
    if (baseTokens.has(token)) score += token.length >= 5 ? 3 : 1;
  }
  return score;
}

function cmsConfig() {
  const domain = clean(process.env.MICROCMS_SERVICE_DOMAIN);
  const apiKey = clean(process.env.MICROCMS_API_KEY);
  const endpoint = clean(process.env.MICROCMS_ENDPOINT || "categories");
  if (!domain || !apiKey || !endpoint) throw new Error("CMS is not configured");
  return { domain, apiKey, endpoint };
}

async function cmsRequest(path) {
  const { domain, apiKey } = cmsConfig();
  const response = await fetch(`https://${domain}.microcms.io/api/v1/${path}`, {
    headers: { "X-MICROCMS-API-KEY": apiKey }
  });
  if (!response.ok) {
    const error = new Error(`CMS request failed: ${response.status}`);
    error.status = response.status;
    throw error;
  }
  return response.json();
}

const baseIndexFields = [
  "id",
  "createdAt",
  "updatedAt",
  "publishedAt",
  "revisedAt",
  "name",
  "description",
  "category",
  "GAZOU"
].join(",");

const policyFields = ["status", "indexable", "crawlEntry", "redirectTo"].join(",");
const indexFields = `${baseIndexFields},${policyFields}`;
const baseListingFields = [
  baseIndexFields,
  "honbunn",
  "ritti"
].join(",");
const listingFields = `${baseListingFields},${policyFields}`;

async function fetchCmsList(limit, fields, fallbackFields = fields) {
  const { endpoint } = cmsConfig();
  const request = async (selectedFields) => {
    const query = new URLSearchParams({
      limit: String(Math.min(Math.max(limit, 1), 100)),
      orders: "-publishedAt",
      fields: selectedFields
    });
    return cmsRequest(`${encodeURIComponent(endpoint)}?${query}`);
  };
  let data;
  try {
    data = await request(fields);
  } catch (error) {
    if (error?.status !== 400 || fallbackFields === fields) throw error;
    data = await request(fallbackFields);
  }
  return Array.isArray(data.contents)
    ? data.contents.filter((item) => !withdrawnContentIds.has(item.id))
    : [];
}

export async function fetchCmsListing(limit = 100) {
  return fetchCmsList(limit, listingFields, baseListingFields);
}

export async function fetchCmsIndex(limit = 100) {
  return fetchCmsList(limit, indexFields, baseIndexFields);
}

export async function fetchCmsContents(limit = 100) {
  const { endpoint } = cmsConfig();
  const data = await cmsRequest(`${encodeURIComponent(endpoint)}?limit=${Math.min(Math.max(limit, 1), 100)}&orders=-publishedAt`);
  return Array.isArray(data.contents)
    ? data.contents.filter((item) => !withdrawnContentIds.has(item.id))
    : [];
}

export async function fetchCmsContent(id) {
  const value = clean(id);
  if (!/^[A-Za-z0-9_-]{1,64}$/.test(value) || withdrawnContentIds.has(value)) {
    const error = new Error("Content not found");
    error.status = 404;
    throw error;
  }
  const { endpoint } = cmsConfig();
  return cmsRequest(`${encodeURIComponent(endpoint)}/${encodeURIComponent(value)}`);
}

export function externalSources(html = "") {
  const sources = [];
  const seen = new Set();
  for (const match of String(html).matchAll(/<a\b[^>]*href=["'](https?:\/\/[^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)) {
    const url = clean(match[1]);
    if (!url || seen.has(url)) continue;
    let hostname = "";
    try { hostname = new URL(url).hostname; } catch { continue; }
    if (EVIDENCE_EXCLUDED_HOSTS.test(hostname)) continue;
    seen.add(url);
    sources.push({ url, title: stripHtml(match[2]) || new URL(url).hostname });
    if (sources.length === 4) break;
  }
  return sources;
}
