const legacyRoutes = {
  "#map": "/map/",
  "#region/vice-city": "/map/vice-city/",
  "#region/leonida-keys": "/map/leonida-keys/",
  "#region/grassrivers": "/map/grassrivers/",
  "#region/port-gellhorn": "/map/port-gellhorn/",
  "#region/ambrosia": "/map/ambrosia/",
  "#region/mount-kalaga": "/map/mount-kalaga/"
};

const legacyCategoryRoutes = {
"#category/leaks": "/articles/",
  "#latest": "/articles/",
  "#category/release": "/release/",
"#category/characters": "/articles/"
};

function redirectLegacyHash() {
  const cmsMatch = location.hash.match(/^#cms\/([^/?#]+)/);
  if (cmsMatch) {
    let contentId = cmsMatch[1];
    try {
      contentId = decodeURIComponent(contentId);
    } catch {
      // Keep the original segment when a legacy URL contains invalid escaping.
    }
    location.replace(`/articles/${encodeURIComponent(contentId)}/`);
    return true;
  }

  const destination = legacyCategoryRoutes[location.hash] || legacyRoutes[location.hash];
  if (!destination) return false;
  location.replace(destination);
  return true;
}

redirectLegacyHash();
window.addEventListener("hashchange", redirectLegacyHash);
