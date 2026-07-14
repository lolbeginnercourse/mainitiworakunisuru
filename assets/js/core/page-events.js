// 検索、絞り込み、フォーム等のイベント
function bindPageEvents(route){
  const homeForm=document.querySelector("#home-search-form");
  if(homeForm)homeForm.addEventListener("submit",e=>{e.preventDefault();const q=document.querySelector("#home-search-input").value.trim();location.hash="#search/"+encodeURIComponent(q)});
  if(route==="latest")bindFilter("#latest-filters",".filterable-news");
  if(route==="map")bindMap();
  if(route==="vehicles")bindVehicles();
  if(route==="beginner")bindBeginner();
  if(route==="search")bindSearch();
  if(route==="contact")bindContact();
  if(route==="glossary")bindGlossary();
  if(route==="article")document.querySelectorAll("[data-scroll-target]").forEach(button=>button.addEventListener("click",()=>{const target=document.getElementById(button.dataset.scrollTarget);if(!target)return;const top=target.getBoundingClientRect().top+window.scrollY-72;window.scrollTo({top,behavior:"smooth"});target.setAttribute("tabindex","-1");target.focus({preventScroll:true})}));
}

function bindFilter(groupSelector,itemSelector){const group=document.querySelector(groupSelector);if(!group)return;group.addEventListener("click",e=>{const btn=e.target.closest("[data-filter]");if(!btn)return;group.querySelectorAll("[data-filter]").forEach(b=>b.classList.remove("is-active"));btn.classList.add("is-active");const value=btn.dataset.filter;document.querySelectorAll(itemSelector).forEach(item=>{item.hidden=value!=="all"&&item.dataset.type!==value})})}

function bindMap(){
  const input=document.querySelector("#map-search"),filters=document.querySelector("#map-filters"),items=[...document.querySelectorAll(".region-filterable")],status=document.querySelector("#map-status");let type="all";
  const draw=()=>{const q=(input.value||"").trim().toLowerCase();let shown=0;items.forEach(item=>{const okType=type==="all"||item.dataset.type===type;const okText=!q||(item.dataset.search||"").toLowerCase().includes(q);item.hidden=!(okType&&okText);if(okType&&okText)shown++});status.textContent=`表示中 ${shown}件 / 全${items.length}件`};
  input.addEventListener("input",draw);filters.addEventListener("click",e=>{const btn=e.target.closest("[data-filter]");if(!btn)return;filters.querySelectorAll("[data-filter]").forEach(b=>b.classList.remove("is-active"));btn.classList.add("is-active");type=btn.dataset.filter;draw()});draw();
}

function bindVehicles(){
  const search=document.querySelector("#vehicle-search"),sort=document.querySelector("#vehicle-sort"),filters=document.querySelector("#vehicle-filters"),list=document.querySelector("#vehicle-list"),status=document.querySelector("#vehicle-status");if(!search||!sort||!filters||!list||!status)return;let type="all";
  const draw=()=>{const q=(search.value||"").toLowerCase();let rows=vehicleData.filter(v=>(type==="all"||v.type===type)&&(`${v.name} ${v.desc} ${v.usage} ${v.tags.join(" ")}`).toLowerCase().includes(q));if(sort.value==="score")rows.sort((a,b)=>b.score-a.score);else if(sort.value==="seats")rows.sort((a,b)=>b.seats-a.seats);else rows.sort((a,b)=>a.name.localeCompare(b.name,"ja"));status.textContent=`表示中 ${rows.length}件 / 全${vehicleData.length}件`;list.innerHTML=rows.length?rows.map(v=>`<a class="vehicle-card-link" href="#vehicle/${v.id}" data-route="vehicle/${v.id}"><article class="vehicle-card"><div class="vehicle-thumb">${ICONS.car}</div><div><h3>${v.name}</h3><p>${v.desc}</p><div class="vehicle-tags"><span class="badge badge-db">${v.typeLabel}</span><span class="badge">${v.usage}</span><span class="badge">${v.seats}人</span></div></div><div class="vehicle-score"><strong>${v.score}</strong><small>総合値</small></div></article></a>`).join(""):`<div class="empty-state"><strong>条件に合う車両がありません</strong><p>検索語を短くするか、タイプを「すべて」に戻してください</p></div>`};
  search.addEventListener("input",draw);sort.addEventListener("change",draw);filters.addEventListener("click",e=>{const btn=e.target.closest("[data-filter]");if(!btn)return;filters.querySelectorAll("[data-filter]").forEach(b=>b.classList.remove("is-active"));btn.classList.add("is-active");type=btn.dataset.filter;draw()});draw();
}

function bindBeginner(){
  const list=document.querySelector("#beginner-checklist"),progress=document.querySelector("#check-progress");if(!list)return;let saved={};try{saved=JSON.parse(localStorage.getItem("gta6-beginner-checks")||"{}")||{}}catch{}
  list.querySelectorAll("[data-check-id]").forEach(input=>{input.checked=Boolean(saved[input.dataset.checkId])});
  const update=()=>{const inputs=[...list.querySelectorAll("[data-check-id]")];const state={};inputs.forEach(i=>state[i.dataset.checkId]=i.checked);progress.textContent=`${inputs.filter(i=>i.checked).length} / ${inputs.length} 完了`;try{localStorage.setItem("gta6-beginner-checks",JSON.stringify(state))}catch{}};
  list.addEventListener("change",update);update();
}

function bindSearch(){
  const input=document.querySelector("#search-page-input"),form=document.querySelector("#search-page-form"),results=document.querySelector("#search-results"),status=document.querySelector("#search-status"),filters=document.querySelector("#search-type-filters"),items=buildSearchItems();let activeType="all";
  const draw=()=>{const q=(input.value||"").trim().toLowerCase();const terms=q.split(/\s+/).filter(Boolean);const rows=items.filter(item=>(activeType==="all"||item.type===activeType)&&terms.every(term=>(`${item.title} ${item.desc} ${item.keys}`).toLowerCase().includes(term)));status.textContent=q?`「${q}」の検索結果 ${rows.length}件`:`全コンテンツ ${rows.length}件`;results.innerHTML=rows.length?rows.map(item=>`<a class="category-page-card" ${anchorAttrs(item.route)}><span><span class="badge">${item.typeLabel}</span><h3>${item.title}</h3><p>${item.desc}</p></span><span class="chevron">›</span></a>`).join(""):`<div class="empty-state"><strong>一致する情報がありません</strong><p>対象を一語にするか、カテゴリの絞り込みを「すべて」に戻してください</p><div class="empty-actions">${routeLink("categories","カテゴリを見る","button button-secondary")}${routeLink("sitemap","サイトマップ","button button-secondary")}</div></div>`};
  form.addEventListener("submit",e=>{e.preventDefault();draw()});input.addEventListener("input",draw);filters.addEventListener("click",e=>{const btn=e.target.closest("[data-filter]");if(!btn)return;filters.querySelectorAll("[data-filter]").forEach(b=>b.classList.remove("is-active"));btn.classList.add("is-active");activeType=btn.dataset.filter;draw()});document.querySelectorAll("[data-search-suggest]").forEach(btn=>btn.addEventListener("click",()=>{input.value=btn.dataset.searchSuggest;input.focus();draw()}));draw();
}

function bindContact(){
  const form=document.querySelector("#contact-form"),status=document.querySelector("#contact-status");form.addEventListener("submit",e=>{e.preventDefault();if(!form.reportValidity())return;status.hidden=false;status.className="form-status";status.textContent="入力内容を確認しました。このプレビューでは送信されません。本番化時に送信先と同意確認を接続します。"});form.addEventListener("reset",()=>{status.hidden=true;status.textContent=""});
}

function bindGlossary(){
  const input=document.querySelector("#glossary-search"),items=[...document.querySelectorAll(".glossary-item")],status=document.querySelector("#glossary-status");const draw=()=>{const q=(input.value||"").trim().toLowerCase();let shown=0;items.forEach(item=>{const ok=!q||(item.dataset.search||"").toLowerCase().includes(q);item.hidden=!ok;if(ok)shown++});status.textContent=`表示中 ${shown}件 / 全${items.length}件`};input.addEventListener("input",draw);draw();
}
