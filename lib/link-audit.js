const AFFILIATE_HOSTS = /(?:^|\.)amzn\.to$/i;

const KNOWN_REPAIRABLE_HREFS = new Set([
  "http://FiveMとRedMを支えるCfx.re",
  "http://GamesがCfx.re",
  "http://Cfx.re",
  "http://Amazon.co.jp",
  "http://ヨドバシ.com",
  "http://ビックカメラ.com",
  "https://amzn.to/4w2afGV"
]);

const plainText = (value = "") => String(value).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

function anchorParts(anchor) {
  const open = anchor.match(/^<a\b([^>]*)>/i)?.[1] || "";
  const href = open.match(/\bhref\s*=\s*(["'])(.*?)\1/i)?.[2] ?? "";
  const target = open.match(/\btarget\s*=\s*(["'])(.*?)\1/i)?.[2] ?? "";
  const rel = open.match(/\brel\s*=\s*(["'])(.*?)\1/i)?.[2] ?? "";
  const label = plainText(anchor.replace(/^<a\b[^>]*>/i, "").replace(/<\/a>$/i, ""));
  return { href, target, rel: rel.toLowerCase().split(/\s+/).filter(Boolean), label };
}

export function auditHtmlLinks(html = "", context = "HTML") {
  const failures = [];
  const anchors = String(html).match(/<a\b[^>]*>[\s\S]*?<\/a>/gi) || [];
  for (const anchor of anchors) {
    const { href, target, rel, label } = anchorParts(anchor);
    const prefix = `${context}: ${label || "無名リンク"}`;
    if (!href || href === "#") {
      failures.push(`${prefix} のhrefが空です`);
      continue;
    }
    if (/[\s\r\n]/.test(href)) failures.push(`${prefix} のURLに空白または改行があります: ${href}`);
    if (/^(?:javascript|vbscript|data):/i.test(href)) failures.push(`${prefix} に禁止スキームがあります: ${href}`);
    if (/^http:\/\//i.test(href)) failures.push(`${prefix} がHTTPです: ${href}`);
    if (/^https?:\/\//i.test(href)) {
      if (/[^\x00-\x7F]/.test(href)) failures.push(`${prefix} の絶対URLに非ASCII文字があります: ${href}`);
      let url;
      try { url = new URL(href); } catch { failures.push(`${prefix} のURLを解析できません: ${href}`); }
      if (url && AFFILIATE_HOSTS.test(url.hostname) && !rel.includes("sponsored")) {
        failures.push(`${prefix} のアフィリエイトリンクにsponsoredがありません`);
      }
      if (url && /Amazon\.co\.jp/i.test(label) && !/(?:^|\.)(?:amazon\.co\.jp|amzn\.to)$/i.test(url.hostname)) {
        failures.push(`${prefix} の表示名とリンク先ドメインが一致しません`);
      }
      if (url && /ヨドバシ\.com/i.test(label) && !/(?:^|\.)yodobashi\.com$/i.test(url.hostname)) {
        failures.push(`${prefix} の表示名とリンク先ドメインが一致しません`);
      }
      if (url && /ビックカメラ\.com/i.test(label) && !/(?:^|\.)biccamera\.com$/i.test(url.hostname)) {
        failures.push(`${prefix} の表示名とリンク先ドメインが一致しません`);
      }
    }
    if (target.toLowerCase() === "_blank" && (!rel.includes("noopener") || !rel.includes("noreferrer"))) {
      failures.push(`${prefix} のtarget=_blankにnoopener noreferrerがありません`);
    }
  }
  return failures;
}

export function auditRawCmsLinks(html = "", context = "CMS本文") {
  const failures = [];
  const anchors = String(html).match(/<a\b[^>]*>[\s\S]*?<\/a>/gi) || [];
  for (const anchor of anchors) {
    const { href } = anchorParts(anchor);
    if (KNOWN_REPAIRABLE_HREFS.has(href)) continue;
    failures.push(...auditHtmlLinks(anchor, context));
  }
  return failures;
}
