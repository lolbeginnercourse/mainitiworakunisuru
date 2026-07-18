// microCMSの記事一覧と詳細を、APIキーを公開せずVercel Function経由で取得する
let cmsContentsPromise;
const withdrawnCmsContentIds = new Set([
  "mj_c93czbup",
  "1z_k36dv0i5",
  "uyibhc7ad"
]);

function getCmsContents() {
  if (!cmsContentsPromise) {
    cmsContentsPromise = fetch("/api/microcms")
      .then(response => {
        if (!response.ok) throw new Error("CMS request failed");
        return response.json();
      })
      .then(data => Array.isArray(data.contents)
        ? data.contents.filter(item => !withdrawnCmsContentIds.has(item.id))
        : []);
  }
  return cmsContentsPromise;
}

function cmsCategories(item) {
  const value = item?.category;
  if (Array.isArray(value)) return value.map(String);
  return value ? [String(value)] : [];
}

function cmsDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("ja-JP", { year: "numeric", month: "2-digit", day: "2-digit" })
    .format(date).replaceAll("/", ".");
}

function cmsPlainText(value) {
  const element = document.createElement("div");
  element.innerHTML = String(value || "");
  return (element.textContent || "").replace(/\s+/g, " ").trim();
}

function cmsThumbnail(item) {
  const media = item?.GAZOU || item?.thumbnail || item?.eyecatch || item?.image;
  if (typeof media === "string") return media;
  return media?.url || "";
}

function cmsImageVariant(url, width) {
  if (!url || !/microcms-assets\.io/i.test(url)) return url;
  return `${url}${url.includes("?") ? "&" : "?"}w=${width}&fm=webp&fit=max`;
}

function cmsThumbnailSize(item) {
  const media = item?.GAZOU || item?.thumbnail || item?.eyecatch || item?.image;
  return {
    width: Number(media?.width) || 640,
    height: Number(media?.height) || 360
  };
}

function cmsArticleUrl(itemOrId) {
  const value = typeof itemOrId === "object" ? itemOrId?.slug || itemOrId?.id : itemOrId;
  return `/articles/${encodeURIComponent(String(value || ""))}/`;
}

function cmsCard(item, index) {
  const title = escapeHTML(item.name || "無題の記事");
  const source = item.honbunn || item.ritti || "";
  const description = escapeHTML(cmsPlainText(source).slice(0, 90));
  const visual = ["", "alt", "gold", "gray"][index % 4];
  const thumbnail = cmsThumbnail(item);
  const size = cmsThumbnailSize(item);
  const thumbnailMarkup = thumbnail
    ? `<span class="news-visual has-image"><img src="${escapeHTML(cmsImageVariant(thumbnail, 640))}" srcset="${escapeHTML(cmsImageVariant(thumbnail, 320))} 320w, ${escapeHTML(cmsImageVariant(thumbnail, 640))} 640w, ${escapeHTML(cmsImageVariant(thumbnail, 960))} 960w" sizes="(max-width:760px) 110px, 220px" width="${size.width}" height="${size.height}" alt="${title}のサムネイル" loading="lazy" decoding="async"></span>`
    : `<span class="news-visual ${visual}"></span>`;
  return `<a class="news-card filterable-news" data-type="latest" href="${cmsArticleUrl(item)}">${thumbnailMarkup}<span><span class="news-meta"><span class="badge">記事</span></span><h3>${title}</h3>${description ? `<p>${description}</p>` : ""}</span></a>`;
}

async function hydrateCmsListings() {
  const lists = [...document.querySelectorAll("[data-cms-category]")];
  if (!lists.length) return;
  try {
    const contents = await getCmsContents();
    lists.forEach(list => {
      if (!list.isConnected) return;
      const category = list.dataset.cmsCategory;
      const rows = contents.filter(item => cmsCategories(item).includes(category));
      if (rows.length) list.innerHTML = rows.map(cmsCard).join("");
      else if (list.dataset.cmsReplace === "true") list.innerHTML = `<div class="empty-state"><strong>現在公開中の記事はありません</strong></div>`;
    });
  } catch {
    lists.forEach(list => {
      if (list.isConnected && list.dataset.cmsReplace === "true") {
        list.innerHTML = `<div class="empty-state"><strong>記事を読み込めませんでした</strong><p>時間をおいて、もう一度開いてください。</p></div>`;
      }
    });
  }
}
