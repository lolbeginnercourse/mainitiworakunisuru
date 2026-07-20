import { ORIGIN, articlePath, escapeHtml, fetchCmsIndex, isoDate } from "../lib/cms-server.js";
import { INDEXABLE_STATIC_PATHS, isIndexableContent } from "../lib/index-control.js";

export default async function handler(request, response) {
  if (request.method !== "GET" && request.method !== "HEAD") {
    response.setHeader("Allow", "GET, HEAD");
    return response.status(405).end();
  }
  let items = [];
  try { items = await fetchCmsIndex(100); } catch { items = []; }
  const staticEntries = INDEXABLE_STATIC_PATHS.map((path) => `<url><loc>${ORIGIN}/${path}</loc></url>`);
  const articleEntries = items.filter(isIndexableContent).map((item) => {
    const lastmod = isoDate(item.revisedAt || item.updatedAt || item.publishedAt || item.createdAt).slice(0, 10);
    return `<url><loc>${escapeHtml(`${ORIGIN}${articlePath(item)}`)}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}</url>`;
  });
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  ${[...staticEntries, ...articleEntries].join("\n  ")}\n</urlset>`;
  response.setHeader("Content-Type", "application/xml; charset=utf-8");
  response.setHeader("Cache-Control", "public, max-age=0, s-maxage=300, stale-while-revalidate=86400");
  return response.status(200).send(request.method === "HEAD" ? "" : xml);
}
