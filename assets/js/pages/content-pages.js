// 一覧、詳細、運営ページ描画
function renderLatest(){
  return `${pageHero("最新情報","公式発表と内容整理を分けて確認できます","最新情報")}<div class="container"><section class="page-section page-stack"><div class="status-grid"><div class="status-card"><span>発売予定日</span><strong>2026.11.19</strong><p>公式サイトで確認</p></div><div class="status-card"><span>予約受付</span><strong>開始済み</strong><p>2026.06.25開始</p></div></div><div class="filter-row" id="latest-filters"><button class="filter-chip is-active" data-filter="all">すべて</button><button class="filter-chip" data-filter="official">公式情報</button><button class="filter-chip" data-filter="latest">情報整理</button></div><div class="news-list" data-cms-category="最新情報">${newsCard("article/release","official","公式発表","発売日・対応機種・予約状況","公式情報を現在の状態に更新","","2026.06.25")}${newsCard("confirmed","official","公式公開","人物・地域の公式公開一覧","People & Placesの公開範囲を整理","alt","2025.05.06")}${newsCard("article/timeline","latest","情報整理","GTA6公式発表タイムライン","発表順と変更点を追える一覧","gold","2026.07.14更新")}</div></div></section></div>`;
}

function renderConfirmed(){
  return `${pageHero("公式発表から分かること","公式サイトとPeople & Placesで公開されている内容を中心にまとめています","公式発表")}<div class="container"><section class="page-section page-stack"><div class="status-grid"><div class="status-card"><span>発売予定日</span><strong>2026年11月19日</strong><p>公式サイト掲載</p></div><div class="status-card"><span>対応機種</span><strong>PS5</strong><p>Xbox Series X|Sも対応</p></div><div class="status-card"><span>予約状況</span><strong>受付中</strong><p>2026年6月25日開始</p></div></div><div class="section-card"><h2>公式に公開された人物</h2><p>プロフィール本文を転載せず、人物名と公開状態を整理しています。</p><div class="confirmed-grid" style="margin-top:10px">${officialPeople.map(person=>`<article class="confirmed-card"><span>公式People & Places</span><strong>${person.name}</strong><p>${person.note}</p></article>`).join("")}</div></div><div class="section-card"><h2>公式に公開された地域</h2><p>詳細な道路、施設、収集物、移動時間は発売後に確認します。</p><div class="data-list" style="margin-top:10px">${regions.map(region=>dataCard(`region/${region.id}`,region.title,`${region.label}・${region.status}`)).join("")}</div></div><div class="section-card"><h2>現時点で未発表として扱う項目</h2><div class="phase-list" style="margin-top:10px"><div class="phase-item"><span class="phase-tag">未掲載</span><span><strong>PC版の対応</strong><p>公式サイトの対応機種欄に追加されるまで断定しません</p></span></div><div class="phase-item"><span class="phase-tag">発売後</span><span><strong>車両・武器の性能</strong><p>名称、価格、速度、威力などを推測値で埋めません</p></span></div><div class="phase-item"><span class="phase-tag">公式待ち</span><span><strong>オンライン関連の詳細</strong><p>提供時期や参加条件は公式発表後に掲載します</p></span></div></div></div><div class="official-actions"><a class="source-link" href="https://www.rockstargames.com/VI" target="_blank" rel="noopener noreferrer">GTA VI 公式サイト ↗</a><a class="source-link" href="https://www.rockstargames.com/VI/only-in-leonida" target="_blank" rel="noopener noreferrer">People & Places ↗</a></div></section></div>`;
}

function renderCategories(){
  return `${pageHero("情報カテゴリ","発売前の公式情報と、発売後に検証する攻略項目を分けて探せます","情報カテゴリ")}<div class="container"><section class="page-section page-stack"><nav class="category-grid">${Object.entries(categoryData).map(([key,d])=>categoryCard(`category/${key}`,d.icon,d.title,d.desc)).join("")}${categoryCard("map","pin","舞台・地域","公式公開された地域を確認")}${categoryCard("vehicles","car","登場車両情報","公式名称と映像確認を分離")}</nav></section></div>`;
}

function renderCategory(type){
  if(type==="release")return renderReleaseArticle();
  if(type==="leaks")return `${pageHero("リーク・未確認情報","公式発表前の情報を公式情報と分けて掲載します","リーク・未確認情報")}<div class="container"><section class="page-section page-stack"><div class="news-list" data-cms-category="リーク" data-cms-replace="true"><div class="empty-state"><strong>記事を読み込んでいます</strong></div></div></section></div>`;
  const d=categoryData[type]||categoryData.story;
  return `${pageHero(d.title,d.desc,d.title)}<div class="container"><section class="page-section page-stack"><div class="section-card"><div class="meta-row"><span class="status-pill info">発売前カテゴリ</span><span class="status-pill ready">${d.status}</span></div><h2 style="margin-top:10px">このカテゴリで確認できること</h2><p>${d.desc}。未発表の名称、数値、条件は推測で補わず、公式発表または発売後の確認まで保留します。</p></div><div class="subcategory-list">${d.sections.map((item,index)=>`<a class="subcategory-card" href="/search/?q=${encodeURIComponent(item.query)}"><span><span class="badge">${String(index+1).padStart(2,"0")}</span><h3>${item.title}</h3><p>${item.desc}</p></span><span class="chevron">›</span></a>`).join("")}</div><div class="data-list">${dataCard("confirmed","公式発表一覧","公式に公開されている情報を中心に確認")}${dataCard("latest","このカテゴリの新着","更新された内容を区分別に確認")}${dataCard("categories","カテゴリ一覧へ戻る","別の入口から探し直す")}</div></section></div>`;
}

function regionCard(region){return `<a class="region-card region-filterable" data-type="${region.type}" data-search="${escapeAttr(region.title+" "+region.desc+" "+region.keywords)}" href="/map/${region.id}/"><span>${region.label}</span><strong>${region.title}</strong><p>${region.desc}</p><div class="meta-row"><span class="status-pill">${region.status}</span></div></a>`}

function renderMap(){
  return `${pageHero("舞台・地域","公式People & Placesで公開された地域名を、未発表の地図情報と分けて確認できます","舞台・地域")}<div class="container"><section class="page-section page-stack"><div class="map-overview"><strong>公式に公開されている地域</strong><p>現時点では地域名と公式画像を中心に整理し、道路、施設、移動時間、収集物は発売後に確認します</p><div class="map-legend"><span>都市</span><span>島・沿岸</span><span>湿地</span><span>山岳</span></div></div><div class="map-tools"><div class="search-input-wrap"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg><input id="map-search" type="search" placeholder="Vice City・Leonida Keysなど"></div><div class="filter-row" id="map-filters"><button class="filter-chip is-active" data-filter="all">すべて</button><button class="filter-chip" data-filter="city">都市</button><button class="filter-chip" data-filter="coast">島・沿岸</button><button class="filter-chip" data-filter="rural">自然・地方</button></div></div><p class="search-filter-summary" id="map-status"></p><div class="region-grid" id="region-list">${regions.map(regionCard).join("")}</div></section></div>`;
}

function renderRegion(id){
  const r=regions.find(x=>x.id===id)||regions[0];
  return `${pageHero(r.title,r.desc,"地域詳細")}<div class="container"><section class="page-section page-stack"><a class="nav-back" href="#map" data-route="map">‹ 舞台・地域へ戻る</a><div class="detail-hero"><div class="detail-visual">${ICONS.pin}</div><div class="detail-copy"><div class="meta-row"><span class="badge badge-official">${r.label}</span><span class="status-pill ready">${r.status}</span></div><h2 style="margin:9px 0 0;font-size:25px;line-height:1.25">${r.title}</h2><p>${r.desc}。公式に公開された名称と、発売後に検証する地図情報を分けて管理します。</p></div></div><div class="section-card"><h2>現在確認できる範囲</h2><div class="facility-list" style="margin-top:10px">${r.facilities.map(f=>`<div class="facility-item"><span class="facility-symbol">${f[0]}</span><span><strong>${f[1]}</strong><small>${f[2]}</small></span><em>${f[3]}</em></div>`).join("")}</div></div><div class="metric-grid"><div class="metric-card"><span>名称</span><strong>公式公開</strong><small>People & Places掲載</small></div><div class="metric-card"><span>公式画像</span><strong>参照可能</strong><small>公式ページで確認</small></div><div class="metric-card"><span>詳細地図</span><strong>未掲載</strong><small>推測地図を使用しない</small></div><div class="metric-card"><span>攻略情報</span><strong>発売後</strong><small>実地確認して追加</small></div></div><div class="official-actions"><a class="source-link" href="https://www.rockstargames.com/VI/only-in-leonida" target="_blank" rel="noopener noreferrer">公式ページで確認 ↗</a></div><div class="data-list">${dataCard(`search/${encodeURIComponent(r.title)}`,"この地域をサイト内検索","人物や記事を横断して確認")}${dataCard("confirmed","公式発表一覧へ","人物と地域について公開されている内容を確認")}${dataCard("map","別の地域を見る","地域一覧へ戻る")}</div></section></div>`;
}

function renderVehicles(){
  return `${pageHero("登場車両情報","発売前は公式名称と映像内で確認できる範囲だけを整理します","登場車両")}<div class="container"><section class="page-section page-stack"><div class="release-mode"><span>${ICONS.car}</span><span><strong>架空の性能値を公開画面から外しました</strong><p>正式名称、価格、速度、加速、耐久性、定員などは、公式発表または発売後の実プレイで確認できるまで掲載しません</p></span></div><div class="placeholder-panel"><strong>個別の車両データは発表待ちです</strong><p>公式映像に車両が映っていても、名称や性能について公式の明記がない場合は、その旨を表示します。確認できた範囲から順に追加します。</p></div><div class="data-list">${dataCard("confirmed","公式発表から分かることを見る","現在公式サイトで公開されている内容を確認")}${dataCard("map","舞台・地域を見る","公式サイトで公開されている地域を見る")}${dataCard("sources","出典・引用方針","映像確認と推測の分け方を確認")}</div></section></div>`;
}

function renderVehicle(id){
  return `${pageHero("ページが見つかりません","指定された車両情報は公開されていません","登場車両")}<div class="container"><section class="page-section page-stack"><div class="data-list">${dataCard("vehicles","登場車両情報へ戻る","公開中の情報を確認")}${dataCard("confirmed","公式発表一覧","公式に公開されている情報を確認")}</div></section></div>`;
}

function renderBeginner(){
  const checks=[
    ["release","発売日を確認","発売予定日は2026年11月19日"],
    ["platform","対応機種を確認","PlayStation 5とXbox Series X|S"],
    ["edition","エディションと特典を確認","購入する地域とストアの公式販売ページで確認"],
    ["source","情報の出典を確認","公式発表、映像確認、未確認の表示を確認"],
    ["spoiler","発売後のネタバレ表示を選ぶ","物語情報をどこまで表示するか事前に選ぶ"]
  ];
  return `${pageHero("発売前ガイド","購入前に確認する順番と、未確認情報を避ける見方を整理します","発売前ガイド")}<div class="container"><section class="page-section page-stack"><div class="check-summary"><strong>購入前の確認チェック</strong><span id="check-progress">0 / ${checks.length} 完了</span></div><div class="checklist" id="beginner-checklist">${checks.map(c=>`<label class="check-item"><input type="checkbox" data-check-id="${c[0]}"><span><strong>${c[1]}</strong><p>${c[2]}</p></span></label>`).join("")}</div><div class="section-card"><h2>迷った時の確認順</h2><div class="steps" style="margin-top:10px">${stepCard("confirmed","01","公式発表を見る","発売日、対応機種、人物、地域を確認")}${stepCard("latest","02","最新の変更を見る","発表日とサイトの確認日を確認")}${stepCard("category/characters","03","人物情報を見る","公式プロフィールがある人物だけを確認")}${stepCard("map","04","舞台・地域を見る","公式に発表された地域名を確認")}</div></div><div class="section-card"><h2>よく使う検索</h2><div class="search-assist" style="margin-top:10px">${["発売日","対応機種","予約","Jason","Lucia","Vice City"].map(q=>routeLink(`search/${encodeURIComponent(q)}`,q,"search-suggestion")).join("")}</div></div></section></div>`;
}

function buildSearchItems(){
  const categoryItems=Object.entries(categoryData).map(([key,d])=>({title:d.title,type:"category",typeLabel:"カテゴリ",desc:d.desc,route:`category/${key}`,keys:d.sections.map(s=>s.query).join(" ")}));
  const regionItems=regions.map(r=>({title:r.title,type:"database",typeLabel:"地域",desc:r.desc,route:`region/${r.id}`,keys:r.keywords}));
  const vehicleItems=vehicleData.map(v=>({title:v.name,type:"database",typeLabel:"車両",desc:v.desc,route:`vehicle/${v.id}`,keys:`${v.typeLabel} ${v.usage} ${v.tags.join(" ")}`}));
  return [...staticSearchItems,...categoryItems,...regionItems,...vehicleItems];
}

function renderSearch(query=""){
  return `${pageHero("サイト内検索","発売日、人物、地域、公式発表との関係から横断検索できます","検索")}<div class="container"><section class="page-section search-page-wrap"><form class="search-form" id="search-page-form"><div class="search-input-wrap"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg><input id="search-page-input" type="search" value="${escapeAttr(safeDecode(query))}" placeholder="例：発売日、Jason、Vice City"></div><button type="submit">検索</button></form><div class="filter-row" id="search-type-filters"><button class="filter-chip is-active" data-filter="all">すべて</button><button class="filter-chip" data-filter="article">記事</button><button class="filter-chip" data-filter="category">カテゴリ</button><button class="filter-chip" data-filter="database">データ</button><button class="filter-chip" data-filter="guide">ガイド</button><button class="filter-chip" data-filter="policy">サイト情報</button></div><p class="result-count" id="search-status"></p><div class="category-page-grid" id="search-results"></div><div class="section-card"><h2>検索語の例</h2><p>文章のまま入力するより、対象と困りごとを一語ずつ組み合わせると探しやすくなります。</p><div class="search-assist" style="margin-top:10px">${["発売日","対応機種","Jason","Lucia","Vice City","車両","公式情報"].map(q=>`<button type="button" class="search-suggestion" data-search-suggest="${q}">${q}</button>`).join("")}</div></div></section></div>`;
}

function renderArticle(id){
  if(id==="release")return renderReleaseArticle();
  const a=articles[id];
  if(!a)return `${pageHero("ページが見つかりません","指定された記事は公開されていません","記事")}<div class="container"><section class="page-section page-stack"><div class="data-list">${dataCard("latest","最新情報を見る","公開中の記事を確認")}${dataCard("categories","情報カテゴリを見る","目的別に情報を探す")}</div></section></div>`;
  return `<div class="container page-section"><div class="article-layout"><article class="article-main"><a class="nav-back" href="#categories" data-route="categories">‹ 情報カテゴリへ戻る</a><div class="article-kicker"><span class="badge badge-official">${a.tag}</span><span class="badge">${a.state}</span></div><h1>${a.title}</h1><div class="article-meta"><span>確認：${a.confirmed}</span><span>ネタバレ：${a.spoiler}</span></div><div class="article-summary"><strong>現在の結論</strong><p>${a.summary}</p></div><div class="article-body">${a.sections.map((s,i)=>`<section id="section-${i+1}"><h2>${s[0]}</h2><p>${s[1]}</p>${i===0?`<dl class="info-table"><div class="info-row"><dt>情報区分</dt><dd>${a.tag}</dd></div><div class="info-row"><dt>確認状態</dt><dd>${a.state}</dd></div><div class="info-row"><dt>更新方針</dt><dd>公式発表と確認日を分け、変更時は履歴を残す</dd></div></dl>`:""}</section>`).join("")}</div><section class="page-section">${sectionHeading("次に見るページ")}<div class="data-list">${dataCard("confirmed","公式発表一覧","公式に公開されている情報をまとめて確認")}${dataCard("latest","最新情報","更新された内容を確認")}${dataCard("search","サイト内検索","人物や地域名で探す")}</div></section></article><aside class="article-side"><nav class="panel toc"><strong>この記事の内容</strong><ol>${a.sections.map((s,i)=>`<li><button type="button" class="toc-link" data-scroll-target="section-${i+1}">${s[0]}</button></li>`).join("")}</ol></nav><a class="notice" href="#sources" data-route="sources"><span class="notice-icon">${ICONS.info}</span><span><strong>出典・確認方針</strong><small>公式発表と映像確認の表示ルール</small></span><span class="chevron">›</span></a></aside></div></div>`;
}

function renderGuide(){
  return `${pageHero("サイトの使い方","発売前の公式情報と、発売後に検証する攻略項目を区別して探す方法です","サイトの使い方")}<div class="container"><section class="page-section page-stack"><div class="guide-grid"><div class="guide-card"><span class="guide-icon">1</span><span><h3>公式発表だけを見る</h3><p>公式発表ページで発売日、対応機種、人物、地域を確認します</p></span></div><div class="guide-card"><span class="guide-icon">2</span><span><h3>新しい変更を見る</h3><p>最新情報で発表日とサイト側の確認日を分けて確認します</p></span></div><div class="guide-card"><span class="guide-icon">3</span><span><h3>人物や地域から探す</h3><p>情報カテゴリと検索から公式に公開された対象へ移動します</p></span></div><div class="guide-card"><span class="guide-icon">4</span><span><h3>発売後情報を見分ける</h3><p>性能、報酬、条件などは発売後検証の表示があるまで断定しません</p></span></div></div><div class="section-card"><h2>画面に表示する情報</h2><div class="label-list" style="margin-top:10px"><div class="label-item"><span class="badge badge-official">公式発表</span><span><strong>公式サイトやNewswireに明記</strong><p>参照先、発表日、確認日を表示します</p></span></div><div class="label-item"><span class="badge badge-guide">映像確認</span><span><strong>公式映像で存在を確認</strong><p>名称や性能まで公式発表されたものとして扱いません</p></span></div><div class="label-item"><span class="badge badge-db">発売後検証</span><span><strong>実プレイが必要な情報</strong><p>測定条件や再現条件を確認してから掲載します</p></span></div><div class="label-item"><span class="badge badge-warn">未確認</span><span><strong>公式根拠が不足</strong><p>公式発表の一覧と検索結果から分離します</p></span></div></div></div><div class="data-list">${dataCard("confirmed","公式発表を見る","現在公式サイトで公開されている内容を確認")}${dataCard("beginner","発売前チェックへ進む","購入前の確認順を見る")}${dataCard("sitemap","すべてのページを見る","サイトマップから直接移動")}</div></section></div>`;
}

function renderAbout(){
  return `${pageHero("運営・掲載方針","未発売ゲームの非公式サイトとして、公式公開範囲と未確認情報を分けて扱う基本方針です","運営・掲載方針")}<div class="container"><section class="page-section page-stack"><div class="section-card legal-copy"><h2>サイトの目的</h2><p>発売前はGTA6の公式発表、人物、地域、購入前情報を探しやすく整理し、発売後は同じ構造へ実プレイで確認した攻略とデータを追加します。情報量を増やすことより、現在どこまで公式に公開されているかを優先します。</p><h2>発売前の情報区分</h2><p>公式発表、公式映像での確認、発売後検証、未確認を同じ扱いにしません。映像に登場しただけの対象へ名称や性能を推測で付けず、未発表項目は空欄または発表待ちとします。</p><h2>発売後の検証</h2><p>ミッション条件、報酬、車両性能、武器性能、マップ地点などは、実プレイで条件と再現性を確認してから掲載します。ゲーム内表記、実測値、編集上の評価を別項目にします。</p><h2>更新の考え方</h2><p>発売日、販売、対応機種など変化しやすい情報には確認日を明示し、結論が変わる訂正は該当ページ内で案内します。</p><h2>権利関係</h2><p>本サイトはRockstar GamesおよびTake-Two Interactiveとは関係のない非公式ファンサイトです。ゲーム名、会社名、画像、商標その他の権利は各権利者に帰属します。</p></div><div class="policy-index">${policyLink("sources","出典・引用方針","公式発表、映像確認、引用、リンクの扱い")}${policyLink("corrections","訂正・更新方針","誤情報の報告から修正までの流れ")}${policyLink("disclaimer","免責事項","情報利用時の注意と責任範囲")}${policyLink("privacy","プライバシーポリシー","アクセス情報と問い合わせ情報の扱い")}${policyLink("terms","利用規約","サイト利用時に守ってほしい事項")}</div></section></div>`;
}

function renderSources(){
  return renderLegalPage("出典・引用方針","公式発表、外部情報、画像、引用をどのように区別して掲載するかを定めます",`<h2>優先する情報源</h2><p>公式サイト、公式ニュース、公式サポート、権利元が運営する公式アカウントを優先します。第三者の記事を参照する場合は、元の発表へさかのぼれるかを確認します。</p><h2>出典の表示</h2><p>記事内の重要な事実には、情報源の名称と参照先を表示します。リンク先が変更または削除された場合は、その状態も確認対象にします。</p><h2>引用の範囲</h2><p>引用は説明に必要な最小限にとどめ、本文の代わりになる量を転載しません。引用部分とサイト側の説明が混ざらない見た目にします。</p><h2>画像・映像</h2><p>権利元の利用条件を確認し、必要な範囲で使用します。出所が不明な画像や、第三者が加工した素材を公式画像として扱いません。</p><h2>未確認情報</h2><p>出典が不明確なリーク、推測、伝聞は公式情報と同じ一覧に混ぜず、掲載する場合も未確認であることを明示します。</p>`);
}

function renderCorrections(){
  return renderLegalPage("訂正・更新方針","誤情報や古い情報を発見した時の確認・修正の流れです",`<h2>報告の受付</h2><p>ページ名、問題のある箇所、正しいと考える内容、確認できる参照先を受け付けます。感想と事実誤認を分けて確認します。</p><h2>確認手順</h2><p>公式情報と記事内の条件を再確認し、必要に応じて複数の画面や資料を照合します。確認できない内容を根拠が不十分なまま公式発表扱いへ変更しません。</p><h2>修正の表示</h2><p>結論、条件、読者の行動に影響する誤りは本文を訂正し、必要な場合は訂正内容も明示します。</p><h2>古い情報</h2><p>仕様変更や提供終了で役割を失ったページは、削除だけでなく、現状と代替ページへの導線を表示します。</p>`);
}

function renderDisclaimer(){
  return renderLegalPage("免責事項","非公式情報サイトを利用する際の注意と責任範囲を示します",`<h2>非公式サイトであること</h2><p>本サイトはRockstar GamesおよびTake-Two Interactiveの公式サイトではなく、各社から承認、運営、協賛を受けたものではありません。</p><h2>情報の正確性</h2><p>可能な範囲で確認を行いますが、ゲームの更新、地域差、利用環境、掲載後の変更により、内容が現在の状態と異なる場合があります。重要な判断は公式情報も確認してください。</p><h2>損害について</h2><p>本サイトの情報を利用したことにより生じた損害、データ消失、購入上の問題、外部サイトでのトラブルについて、サイト運営者は責任を負いかねます。</p><h2>外部リンク</h2><p>外部サイトの内容、安全性、サービス継続を保証するものではありません。移動先の規約とプライバシーポリシーを確認してください。</p>`);
}

function renderPrivacy(){
  return renderLegalPage("プライバシーポリシー","アクセス情報、問い合わせ情報、外部サービスの扱いを公開前提で整理します",`<h2>取得する可能性のある情報</h2><p>アクセス解析を導入する場合、閲覧ページ、端末種別、ブラウザ、参照元など、個人を直接特定しない利用情報を取得することがあります。</p><h2>Cookie</h2><p>アクセス解析や表示設定の保存などにCookieを利用する場合があります。ブラウザの設定からCookieを無効にできます。</p><h2>第三者提供</h2><p>法令に基づく場合を除き、取得した個人情報を本人の同意なく第三者へ提供しません。</p><h2>改定</h2><p>利用するサービスや法令の変更に応じて内容を更新し、重要な変更は該当ページで案内します。</p>`);
}

function renderTerms(){
  return renderLegalPage("利用規約","サイトを安全に利用するための基本的な条件です",`<h2>利用できる範囲</h2><p>本サイトの閲覧、個人利用の範囲での参照、通常のリンク共有ができます。法令や公序良俗に反する目的での利用はできません。</p><h2>禁止事項</h2><ul><li>サイトやサーバーへ過度な負荷を与える行為</li><li>不正アクセス、脆弱性の悪用、機能の妨害</li><li>本文やデータを大量に複製し、別サイトとして再公開する行為</li><li>権利者や第三者になりすます行為</li></ul><h2>内容の変更</h2><p>掲載内容、画面、機能は予告なく変更または停止する場合があります。重要な変更は該当ページで案内します。</p>`);
}

function renderLegalPage(title,desc,content){return `${pageHero(title,desc,title)}<div class="container"><section class="page-section page-stack"><a class="nav-back" href="#about" data-route="about">‹ 運営・掲載方針へ戻る</a><div class="section-card legal-copy">${content}</div><div class="data-list">${dataCard("about","運営方針一覧へ戻る","他の方針ページを確認")}</div></section></div>`}
function renderSitemap(){
  const groups=[
    ["主要ページ",[["home","ホーム"],["latest","最新情報"],["confirmed","公式発表"],["categories","情報カテゴリ"],["map","舞台・地域"],["vehicles","登場車両情報"],["beginner","発売前ガイド"],["search","サイト内検索"]]],
    ["補助ページ",[["guide","サイトの使い方"]]],
    ["運営情報",[["about","運営・掲載方針"],["sources","出典・引用方針"],["corrections","訂正・更新方針"],["disclaimer","免責事項"],["privacy","プライバシーポリシー"],["terms","利用規約"]]]
  ];
  return `${pageHero("サイトマップ","主要機能、補助ページ、運営情報へ一覧から移動できます","サイトマップ")}<div class="container"><section class="page-section page-stack">${groups.map(g=>`<div class="sitemap-group"><h2>${g[0]}</h2><div class="sitemap-links">${g[1].map(([r,l])=>`<a ${anchorAttrs(r)}><span>${l}</span><span class="chevron">›</span></a>`).join("")}</div></div>`).join("")}<div class="sitemap-group"><h2>カテゴリ</h2><div class="sitemap-links">${Object.entries(categoryData).map(([r,d])=>`<a href="#category/${r}" data-route="category/${r}"><span>${d.title}</span><span class="chevron">›</span></a>`).join("")}</div></div></section></div>`;
}
