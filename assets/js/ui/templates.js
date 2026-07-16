// 共通HTMLテンプレート関数
function safeDecode(value=""){try{return decodeURIComponent(value)}catch{return value}}
function escapeHTML(value=""){return String(value).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;")}
function escapeAttr(value=""){return escapeHTML(value).replaceAll("`","&#096;")}
function routeTarget(route){
  const staticRoutes={home:"/",latest:"/release/",confirmed:"/release/",categories:"/category/",vehicles:"/vehicles/",beginner:"/guide/",about:"/about/",guide:"/guide/",sources:"/source-policy/",corrections:"/corrections/",privacy:"/privacy-policy/"};
  if(staticRoutes[route])return {href:staticRoutes[route],attr:""};
  if(route==="map")return {href:"/map/",attr:""};
  if(route.startsWith("region/"))return {href:`/map/${route.slice(7)}/`,attr:""};
  return {href:`#${route}`,attr:`data-route="${route}"`}
}
function anchorAttrs(route){const target=routeTarget(route);return `href="${target.href}" ${target.attr}`}
function routeLink(route,label,cls=""){return `<a class="${cls}" ${anchorAttrs(route)}>${label}</a>`}
function pageHero(title,desc,crumb=""){return `<section class="page-hero"><div class="container"><div class="breadcrumbs">${routeLink("home","ホーム")}<span>›</span>${crumb?`<span>${crumb}</span>`:""}</div><h1>${title}</h1><p>${desc}</p></div></section>`}
function sectionHeading(title,desc="",linkRoute="",linkLabel=""){return `<div class="section-heading"><div><h2>${title}</h2>${desc?`<p>${desc}</p>`:""}</div>${linkRoute?routeLink(linkRoute,linkLabel||"見る","text-link"):""}</div>`}
function quickCard(route,icon,title,desc){return `<a class="quick-card" ${anchorAttrs(route)}><span class="quick-icon">${ICONS[icon]}</span><span><strong>${title}</strong><small>${desc}</small></span></a>`}
function categoryCard(route,icon,title,desc){return `<a class="category-card" ${anchorAttrs(route)}><span class="category-icon">${ICONS[icon]}</span><span><strong>${title}</strong><small>${desc}</small></span></a>`}
function intentCard(route,num,title,desc){return `<a class="intent-card" ${anchorAttrs(route)}><span class="intent-number">${num}</span><span><strong>${title}</strong><p>${desc}</p></span><span class="chevron">›</span></a>`}
function dataCard(route,title,desc){return `<a class="data-card" ${anchorAttrs(route)}><span><strong>${title}</strong><small>${desc}</small></span><span class="chevron">›</span></a>`}
function newsCard(route,type,badge,title,desc,visual){const badgeClass=type==="official"?"badge-official":type==="db"?"badge-db":type==="guide"?"badge-guide":"";return `<a class="news-card filterable-news" data-type="${type}" ${anchorAttrs(route)}><span class="news-visual ${visual}"></span><span><span class="news-meta"><span class="badge ${badgeClass}">${badge}</span></span><h3>${title}</h3><p>${desc}</p></span></a>`}
function stepCard(route,num,title,desc){return `<a class="step-card" ${anchorAttrs(route)}><span class="step-no">${num}</span><span><h3>${title}</h3><p>${desc}</p></span></a>`}
function policyLink(route,title,desc){return `<a class="policy-link" ${anchorAttrs(route)}><span><strong>${title}</strong><small>${desc}</small></span><span class="chevron">›</span></a>`}
