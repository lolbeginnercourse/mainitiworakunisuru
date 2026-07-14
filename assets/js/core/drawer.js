// ドロワーとフォーカス制御
const main=document.querySelector("#main");
const body=document.body;
const drawer=document.querySelector(".drawer");
const trigger=document.querySelector(".menu-trigger");
const routeStatus=document.querySelector("#route-status");
const skipLink=document.querySelector("#skip-link");
let lastFocusedElement=null;
let firstRender=true;

function openDrawer(){lastFocusedElement=document.activeElement;body.classList.add("drawer-open");trigger.setAttribute("aria-expanded","true");drawer.setAttribute("aria-hidden","false");drawer.querySelector("[data-close-drawer]")?.focus()}
function closeDrawer(restoreFocus=true){const wasOpen=body.classList.contains("drawer-open");body.classList.remove("drawer-open");trigger.setAttribute("aria-expanded","false");drawer.setAttribute("aria-hidden","true");if(wasOpen&&restoreFocus)(lastFocusedElement||trigger)?.focus()}
trigger.addEventListener("click",openDrawer);
document.querySelectorAll("[data-close-drawer]").forEach(el=>el.addEventListener("click",()=>closeDrawer(true)));
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&body.classList.contains("drawer-open"))closeDrawer(true);if(e.key==="Tab"&&body.classList.contains("drawer-open")){const focusable=[...drawer.querySelectorAll('a[href],button:not([disabled])')];if(!focusable.length)return;const first=focusable[0],last=focusable[focusable.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}});
skipLink.addEventListener("click",e=>{e.preventDefault();main.focus()});
