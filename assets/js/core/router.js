// ハッシュルーターと画面切替
function getRoute(){return (location.hash.replace(/^#/,"")||"home").split("/")}
function parentRoute(route){if(route==="category")return "categories";if(route==="region")return "map";if(route==="vehicle")return "vehicles";return route}
function setActive(route){const active=parentRoute(route);document.querySelectorAll("[data-route]").forEach(a=>a.removeAttribute("aria-current"));document.querySelectorAll(`[data-route="${active}"]`).forEach(a=>a.setAttribute("aria-current","page"))}

function render(){
  const parts=getRoute();
  const route=parts[0];
  main.classList.remove("route-view");void main.offsetWidth;
  let html="";
  if(route==="home")html=renderHome();
  else if(route==="latest")html=renderLatest();
  else if(route==="confirmed")html=renderConfirmed();
  else if(route==="categories")html=renderCategories();
  else if(route==="category")html=renderCategory(parts[1]||"story");
  else if(route==="map")html=renderMap();
  else if(route==="region")html=renderRegion(parts[1]||"central");
  else if(route==="vehicles")html=renderVehicles();
  else if(route==="vehicle")html=renderVehicle(parts[1]||"");
  else if(route==="beginner")html=renderBeginner();
  else if(route==="search")html=renderSearch(parts.slice(1).join("/"));
  else if(route==="article")html=renderArticle(parts[1]||"generic");
  else if(route==="cms")html=renderCmsArticle(parts[1]||"");
  else if(route==="about")html=renderAbout();
  else if(route==="guide")html=renderGuide();
  else if(route==="sources")html=renderSources();
  else if(route==="corrections")html=renderCorrections();
  else if(route==="privacy")html=renderPrivacy();
  else if(route==="terms")html=renderTerms();
  else if(route==="disclaimer")html=renderDisclaimer();
  else if(route==="contact")html=renderContact();
  else if(route==="changelog")html=renderChangelog();
  else if(route==="glossary")html=renderGlossary();
  else if(route==="sitemap")html=renderSitemap();
  else html=renderHome();
  main.innerHTML=html;main.classList.add("route-view");setActive(route);closeDrawer(false);bindPageEvents(route);
  const visibleTitle=main.querySelector("h1")?.textContent?.trim()||routeTitles[route]||"ホーム";
  document.title=`${visibleTitle}｜GTA6 GUIDE JAPAN`;
  routeStatus.textContent=`${visibleTitle}を表示しました`;
  window.scrollTo({top:0,behavior:"auto"});
  if(!firstRender)main.focus({preventScroll:true});
  firstRender=false;
  hydrateCmsListings();
  if(route==="cms")hydrateCmsArticle(parts[1]||"");
}
