// microCMSの記事一覧と詳細を、APIキーを公開せずVercel Function経由で取得する
let cmsContentsPromise;
const withdrawnCmsContentIds = new Set(["mj_c93czbup"]);

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

function cmsCard(item, index) {
  const title = escapeHTML(item.name || "無題の記事");
  const source = item.honbunn || item.ritti || "";
  const description = escapeHTML(cmsPlainText(source).slice(0, 90));
  const visual = ["", "alt", "gold", "gray"][index % 4];
  return `<a class="news-card filterable-news" data-type="latest" href="#cms/${encodeURIComponent(item.id)}" data-route="cms/${encodeURIComponent(item.id)}"><span class="news-visual ${visual}"></span><span><span class="news-meta"><span class="badge">記事</span></span><h3>${title}</h3>${description ? `<p>${description}</p>` : ""}</span></a>`;
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

function renderCmsArticle(id) {
  return `<div class="container page-section"><article class="article-main"><a class="nav-back" href="#latest" data-route="latest">‹ 最新情報へ戻る</a><div id="cms-article"><div class="section-card"><h1>記事を読み込んでいます</h1></div></div></article></div>`;
}

async function hydrateCmsArticle(id) {
  const target = document.querySelector("#cms-article");
  if (!target) return;
  if (withdrawnCmsContentIds.has(id)) {
    target.innerHTML = `<div class="empty-state"><strong>この記事は公開を終了しました</strong><p>最新情報の一覧から、ほかの記事をご確認ください。</p></div>`;
    return;
  }
  try {
    const response = await fetch(`/api/microcms?id=${encodeURIComponent(id)}`);
    if (!response.ok) throw new Error("CMS request failed");
    const item = await response.json();
    if (!target.isConnected) return;
    const title = escapeHTML(item.name || "無題の記事");
    const body = item.ritti || (item.honbunn ? `<p>${escapeHTML(item.honbunn)}</p>` : "<p>本文を表示できません。</p>");
    const backLink = document.querySelector("#cms-article .nav-back") || document.querySelector(".article-main > .nav-back");
    if (backLink && cmsCategories(item).includes("リーク")) {
      backLink.href = "#category/leaks";
      backLink.dataset.route = "category/leaks";
      backLink.textContent = "‹ リーク・未確認情報へ戻る";
    }
    target.innerHTML = `<div class="article-kicker"><span class="badge">${escapeHTML(cmsCategories(item)[0] || "記事")}</span></div><h1>${title}</h1><div class="article-body cms-article-body">${body}</div>`;
    document.title = `${item.name || "記事"}｜GTA6 GUIDE JAPAN`;
  } catch {
    if (target.isConnected) target.innerHTML = `<div class="empty-state"><strong>記事を読み込めませんでした</strong><p>時間をおいて、もう一度開いてください。</p></div>`;
  }
}
