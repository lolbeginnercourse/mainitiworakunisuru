// 起動処理と共通クリック制御
window.addEventListener("hashchange",render);
document.addEventListener("click",e=>{const link=e.target.closest("[data-route]");if(!link)return;const targetRoute=link.dataset.route,currentRoute=location.hash.replace(/^#/,"")||"home";closeDrawer(false);if(targetRoute===currentRoute){e.preventDefault();window.scrollTo({top:0,behavior:"smooth"});main.focus({preventScroll:true})}});
render();
