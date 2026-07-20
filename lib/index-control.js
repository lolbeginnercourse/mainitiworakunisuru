export const PAGE_POLICIES = Object.freeze({
  "/": { status: "published", indexable: true, crawlEntry: true },
  "/articles/": { status: "published", indexable: true, crawlEntry: true },
  "/category/": { status: "hold", indexable: false, crawlEntry: false, reviewAt: "2026-08-20" },
  "/release/": { status: "published", indexable: true, crawlEntry: true },
  "/vehicles/": { status: "published", indexable: true, crawlEntry: true },
  "/characters/": { status: "hold", indexable: false, crawlEntry: false, reviewAt: "2026-08-19" },
  "/online/": { status: "hold", indexable: false, crawlEntry: false, reviewAt: "2026-08-19" },
  "/systems/": { status: "retired", indexable: false, crawlEntry: false, retiredAt: "2026-07-20" },
  "/leaks/": { status: "retired", indexable: false, crawlEntry: false, retiredAt: "2026-07-20" },
  "/guide/": { status: "merged", indexable: false, crawlEntry: false, redirectTo: "/release/" },
  "/news/": { status: "merged", indexable: false, crawlEntry: false, redirectTo: "/release/" },
  "/official/": { status: "merged", indexable: false, crawlEntry: false, redirectTo: "/release/" }
});

export const INDEXABLE_STATIC_PATHS = Object.freeze([
  "",
  "articles/",
  "release/",
  "vehicles/",
  "about/",
  "editorial-policy/",
  "source-policy/",
  "corrections/",
  "privacy-policy/",
  "authors/editorial-team/",
  "map/",
  "map/vice-city/",
  "map/leonida-keys/",
  "map/grassrivers/",
  "map/port-gellhorn/",
  "map/ambrosia/",
  "map/mount-kalaga/"
]);

export function pagePolicy(pathname) {
  return PAGE_POLICIES[pathname] || { status: "published", indexable: true, crawlEntry: true };
}

export function cmsContentPolicy(item = {}) {
  const status = ["draft", "hold", "published", "retired", "merged"].includes(item.status)
    ? item.status
    : "published";
  return {
    status,
    indexable: item.indexable !== false,
    crawlEntry: item.crawlEntry !== false,
    redirectTo: typeof item.redirectTo === "string" ? item.redirectTo : ""
  };
}

export function isIndexableContent(item) {
  const policy = cmsContentPolicy(item);
  return policy.status === "published" && policy.indexable && policy.crawlEntry;
}

export function isCrawlEntryContent(item) {
  const policy = cmsContentPolicy(item);
  return policy.status === "published" && policy.indexable && policy.crawlEntry;
}
