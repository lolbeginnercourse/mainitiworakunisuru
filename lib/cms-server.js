export const ORIGIN = "https://mainitiworakunisuru.com";

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

export function sanitizeRichText(value = "") {
  return String(value)
    .replace(/<(script|style|iframe|object|embed|form)\b[^>]*>[\s\S]*?<\/\1>/gi, "")
    .replace(/<(input|button)\b[^>]*\/?\s*>/gi, "")
    .replace(/\son[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/\s(href|src)\s*=\s*(["'])\s*javascript:[\s\S]*?\2/gi, " $1=\"#\"")
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

const listingFields = [
  "id",
  "createdAt",
  "updatedAt",
  "publishedAt",
  "revisedAt",
  "name",
  "category",
  "GAZOU"
].join(",");

export async function fetchCmsListing(limit = 100) {
  const { endpoint } = cmsConfig();
  const query = new URLSearchParams({
    limit: String(Math.min(Math.max(limit, 1), 100)),
    orders: "-publishedAt",
    fields: listingFields
  });
  const data = await cmsRequest(`${encodeURIComponent(endpoint)}?${query}`);
  return Array.isArray(data.contents)
    ? data.contents.filter((item) => !withdrawnContentIds.has(item.id))
    : [];
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
    seen.add(url);
    sources.push({ url, title: stripHtml(match[2]) || new URL(url).hostname });
    if (sources.length === 4) break;
  }
  return sources;
}
