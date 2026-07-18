import { ORIGIN, articlePath, escapeHtml, fetchCmsListing, isoDate } from "../lib/cms-server.js";

const staticPaths = [
  "", "category/", "articles/", "release/", "characters/", "vehicles/", "systems/", "online/", "leaks/", "guide/",
  "about/", "editorial-policy/", "source-policy/", "corrections/", "privacy-policy/", "authors/editorial-team/", "map/",
  "map/vice-city/", "map/leonida-keys/", "map/grassrivers/", "map/port-gellhorn/", "map/ambrosia/", "map/mount-kalaga/"
];

export default async function handler(request, response) {
  if (request.method !== "GET" && request.method !== "HEAD") {
    response.setHeader("Allow", "GET, HEAD");
    return response.status(405).end();
  }
  let items = [];
  try { items = await fetchCmsListing(100); } catch { items = []; }
  const staticEntries = staticPaths.map((path) => `<url><loc>${ORIGIN}/${path}</loc><lastmod>2026-07-18</lastmod></url>`);
  const articleEntries = items.map((item) => {
    const lastmod = isoDate(item.revisedAt || item.updatedAt || item.publishedAt || item.createdAt).slice(0, 10);
    return `<url><loc>${escapeHtml(`${ORIGIN}${articlePath(item)}`)}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}</url>`;
  });
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  ${[...staticEntries, ...articleEntries].join("\n  ")}\n</urlset>`;
  response.setHeader("Content-Type", "application/xml; charset=utf-8");
  response.setHeader("Cache-Control", "public, max-age=0, s-maxage=300, stale-while-revalidate=86400");
  return response.status(200).send(request.method === "HEAD" ? "" : xml);
}
