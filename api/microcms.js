const clean = value => String(value || "").trim();
const withdrawnContentIds = new Set([
  "mj_c93czbup",
  "1z_k36dv0i5",
  "uyibhc7ad"
]);

export default async function handler(request, response) {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    return response.status(405).json({ error: "Method not allowed" });
  }

  const domain = clean(process.env.MICROCMS_SERVICE_DOMAIN);
  const apiKey = clean(process.env.MICROCMS_API_KEY);
  const endpoint = clean(process.env.MICROCMS_ENDPOINT || "categories");

  if (!domain || !apiKey || !endpoint) {
    return response.status(503).json({ error: "CMS is not configured" });
  }

  if (clean(request.query.id)) {
    return response.status(404).json({ error: "Content not found" });
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
  const listQuery = new URLSearchParams({
    limit: "50",
    orders: "-publishedAt",
    fields: listingFields
  });
  const path = `${encodeURIComponent(endpoint)}?${listQuery}`;

  try {
    const cmsResponse = await fetch(`https://${domain}.microcms.io/api/v1/${path}`, {
      headers: { "X-MICROCMS-API-KEY": apiKey }
    });

    if (!cmsResponse.ok) {
      return response.status(cmsResponse.status).json({ error: "CMS request failed" });
    }

    const data = await cmsResponse.json();
    if (Array.isArray(data.contents)) {
      data.contents = data.contents.filter(item => !withdrawnContentIds.has(item.id));
      data.totalCount = data.contents.length;
    }
    response.setHeader("Cache-Control", "public, max-age=0, s-maxage=60, stale-while-revalidate=86400");
    return response.status(200).json(data);
  } catch {
    return response.status(502).json({ error: "CMS is temporarily unavailable" });
  }
}
