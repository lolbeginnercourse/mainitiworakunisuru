function releaseTable(headers,rows){
  return `<div class="release-table-wrap"><table class="release-table"><thead><tr>${headers.map(h=>`<th>${h}</th>`).join("")}</tr></thead><tbody>${rows.map(row=>`<tr>${row.map(cell=>`<td>${cell}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
}

function releaseSection(id,title,body){
  return `<section id="release-${id}" class="release-section"><h2>${title}</h2>${body}</section>`;
}

function renderReleaseArticle(){
  const officialSummary=releaseTable(
    ["確認項目","2026年7月14日時点の情報"],
    [
      ["発売予定日","<strong>2026年11月19日</strong>"],
      ["対応機種","PlayStation 5・Xbox Series X|S"],
      ["予約受付","2026年6月25日から受付中"],
      ["スタンダード版","9,800円"],
      ["アルティメット版","12,280円"],
      ["正式な必要容量","<strong>未発表</strong>"],
      ["事前ダウンロード","2026年11月12日開始予定"],
      ["PC版","発売日・対応予定ともに未発表"]
    ]
  );

  const body=[
    releaseSection("official","現在確認できる公式情報",`${officialSummary}<p>発売日や対応機種はRockstar Gamesの公式発表を基準にしています。変更が発表された場合は、確認日と変更内容を分けて更新します。</p>`),
    releaseSection("date","発売日は2026年11月19日",`<p>『グランド・セフト・オートVI』の発売予定日は、<strong>2026年11月19日（木）</strong>です。過去の予定日が残っている記事やSNSではなく、現在の公式発表を基準にしてください。</p><div class="release-note"><strong>PlayStation Storeの日付表示について</strong><p>日本のPlayStation Storeには「2026年11月18日 03:00 PM UTC」と表示されます。日本時間へ換算すると11月19日午前0時です。</p></div>`),
    releaseSection("platforms","対応機種",`${releaseTable(["機種","対応状況"],[
      ["PlayStation 5","対応"],["PlayStation 5 Pro","PS5版がPS5 Pro Enhancedに対応"],["Xbox Series X","対応"],["Xbox Series S","対応"],["PlayStation 4","対応発表なし"],["Xbox One","対応発表なし"],["Nintendo Switch / Switch 2","対応発表なし"],["PC","対応時期を含めて未発表"]
    ])}<p>PS5 Pro専用版が別に発売されるのではなく、PS5版が<strong>PS5 Pro Enhanced</strong>に対応します。「PC版も同時発売される」「Switch 2版が発売される」といった情報は、公式発表として扱わない方が安全です。</p>`),
    releaseSection("preorder","予約状況と国内価格",`<p>予約受付は<strong>2026年6月25日</strong>に始まりました。PlayStation StoreとXbox Storeではデジタル版を予約できます。</p>${releaseTable(["エディション","価格"],[
      ["スタンダード・エディション","9,800円"],["アルティメット・エディション","12,280円"],["アルティメット版アップグレード","2,480円"]
    ])}<p>スタンダード版の購入後でも、アルティメット版アップグレードを追加できます。価格や販売状況はストア側で変更される可能性があるため、購入画面でも再確認してください。</p>`),
    releaseSection("bonus","予約特典",`<p><strong>2026年11月20日より前</strong>に購入すると、ヴィンテージ・バイスシティパックが付属します。</p><ul><li>ヴァピッド スタニアー55年式とガレージ</li><li>ジェイソンとルシア用のコスチュームと髪型</li><li>限定武器パターン</li></ul><p>デジタル版の予約にはGTA+の1か月分も付属します。PlayStation版では無料期間終了後、解約しない限り通常料金で自動更新されます。利用条件、引き換え期限、自動更新設定は購入したストアで確認してください。</p>`),
    releaseSection("package","パッケージ版と事前ダウンロード",`<p>Rockstar Storeで案内されているパッケージ形式の商品は、<strong>ディスクではなくダウンロードコードが箱に入るCode-in-Box版</strong>です。発送予定日は2026年11月12日で、コード登録後に事前ダウンロードを進められます。</p><div class="release-warning"><strong>ディスク版ではありません</strong><p>箱を購入しても、本体ストレージへのダウンロードとインターネット接続が必要です。コードの対象地域と使用アカウントの国・地域も購入前に確認してください。</p></div><p>デジタル版の事前ダウンロードは<strong>2026年11月12日</strong>開始予定です。この時期にPS5版とXbox Series X|S版の実際の容量が本体やストアに表示される可能性があります。</p>`),
    releaseSection("capacity","正式な必要容量は未発表",`<p>2026年7月14日時点では、Rockstar Games、PlayStation Store、Xbox Storeの公開ページに<strong>GTA6の正式なインストール容量は掲載されていません</strong>。</p><blockquote>「200GBで確定」「300GB必要」「600GBを超える」といった数字は、現時点では公式の必要容量ではありません。</blockquote><p>正式な数字が公開されるまでは、必要容量を確定情報として扱わず、次の空き容量は当サイトの準備目安として分けて掲載します。</p>`),
    releaseSection("space","発売前に確保したい空き容量",`${releaseTable(["容量の考え方","空き容量の目安"],[
      ["公式の必要容量","未発表"],["発売前に最低限確保したい容量","250GB以上（当サイト目安）"],["快適に管理するための容量","300〜350GB以上（当サイト目安）"],["ほかの大型ゲームも残す場合","1TB以上の増設を検討"]
    ])}<div class="release-estimate"><strong>250GB／300〜350GBは公式容量ではありません</strong><p>過去作の公式PC要件では、GTAV Enhancedが105GB、Red Dead Redemption 2が150GBです。GTA6本体、発売日の更新、その後の追加データを受け取りやすくするための準備目安として算出しています。</p></div><h3>最低250GBを空けておく理由</h3><p>仮に本体容量が150〜200GB前後だった場合、250GBの空きがあれば発売日の更新データも受け取りやすくなります。ただし、実際の容量が250GBを超える可能性もあります。</p><h3>快適容量は300〜350GB以上</h3><p>長く遊ぶ場合は、ゲーム本体だけでなく、追加アップデート、スクリーンショット、プレイ動画、システムが使用する空き領域も必要です。削除や移動を繰り返したくない場合の管理目安です。</p>`),
    releaseSection("ps5-storage","PS5で必要な保存場所",`<p>PS5用ゲームは、PS5本体の内蔵SSDまたは要件を満たすM.2 SSDから起動します。USB拡張ストレージへ保管できますが、そのままではプレイできません。</p><ul><li>プレイ時は本体SSDまたはM.2 SSDへ戻す</li><li>容量を増やして直接遊ぶなら、PS5対応M.2 SSDを選ぶ</li><li>現在の空き容量は［設定］→［ストレージ］で確認する</li></ul>`),
    releaseSection("xbox-storage","Xbox Series X|Sで必要な保存場所",`<p>Xbox Series X|S向けに最適化されたゲームは、基本的に本体内蔵ストレージか対応するストレージ拡張カードへインストールして遊びます。一般的なUSB外付けストレージは保管用として使えても、起動時に対応ストレージへ戻す必要がある場合があります。</p><p>特にXbox Series Sは本体モデルによって使用できる保存容量が異なるため、予約前に現在の空き容量を確認してください。</p>`),
    releaseSection("pc","PC版は未発表",`<p>現在予約できるのはPS5版とXbox Series X|S版です。PC版については、発売日、必要容量、CPU、グラフィックボード、メモリ、SSD条件のいずれも正式発表されていません。</p><p>家庭用ゲーム機版の容量予想をPC版へ流用せず、PC版の公式発表後に別途整理します。</p>`),
    releaseSection("check","予約前に確認すること",`<div class="release-check-grid"><div><strong>1. 対応機種</strong><p>PS5またはXbox Series X|Sが必要です。</p></div><div><strong>2. 空き容量</strong><p>正式容量は未発表。準備目安は250GB以上です。</p></div><div><strong>3. パッケージの中身</strong><p>Rockstar StoreのCode-in-Box版にディスクは入りません。</p></div><div><strong>4. GTA+の自動更新</strong><p>無料期間後の条件と停止方法を購入ストアで確認します。</p></div></div><div class="release-summary-box"><strong>まとめ</strong><p>発売予定日は2026年11月19日、対応機種はPlayStation 5とXbox Series X|Sです。予約受付は2026年6月25日に始まり、国内価格はスタンダード版9,800円、アルティメット版12,280円です。</p><p>正式な必要容量は未発表です。発売前は最低250GB、余裕を持って管理するなら300〜350GB以上を当サイトの準備目安とします。正確な容量は11月12日の事前ダウンロード開始前後に各ストアで再確認します。</p></div>`),
    releaseSection("sources-official","公式参照先",`<p>以下の公式ページを2026年7月14日に確認しました。</p><div class="release-source-list"><a href="https://www.rockstargames.com/VI/en-US/" target="_blank" rel="noopener noreferrer"><strong>Rockstar Games『Grand Theft Auto VI』</strong><span>発売日・対応機種を確認 ↗</span></a><a href="https://www.rockstargames.com/newswire/article/5171972o3ak5oa/pre-order-grand-theft-auto-vi-on-june-25" target="_blank" rel="noopener noreferrer"><strong>Rockstar Games Newswire</strong><span>予約開始・特典・事前ダウンロードを確認 ↗</span></a><a href="https://store.rockstargames.com/game/buy-gta-vi" target="_blank" rel="noopener noreferrer"><strong>Rockstar Store</strong><span>エディション・Code-in-Box版を確認 ↗</span></a><a href="https://store.playstation.com/ja-jp/product/JP0230-PPSA29660_00-GTAVISTANDARD001" target="_blank" rel="noopener noreferrer"><strong>PlayStation Store 日本</strong><span>国内価格・PS5 Pro Enhanced・GTA+条件を確認 ↗</span></a><a href="https://www.xbox.com/ja-jp/games/store/grand-theft-auto-vi/9nl3wwnzlzzn" target="_blank" rel="noopener noreferrer"><strong>Xbox 日本</strong><span>国内価格・対応機種を確認 ↗</span></a></div>`)
  ].join("");

  return `<div class="container page-section release-article"><div class="article-layout"><article class="article-main"><a class="nav-back" href="#categories" data-route="categories">‹ 情報カテゴリへ戻る</a><div class="article-kicker"><span class="badge badge-official">公式情報</span><span class="badge">購入前ガイド</span></div><h1>GTA6の発売日・対応機種・予約状況｜必要容量と快適な空き容量</h1><div class="article-meta"><span>確認：Rockstar Games・PlayStation Store・Xbox Store</span><span>ネタバレ：なし</span></div><div class="article-body">${body}</div><section class="page-section">${sectionHeading("次に見るページ")}<div class="data-list">${dataCard("confirmed","公式発表一覧","公式に公開されている情報をまとめて確認")}${dataCard("latest","最新情報","更新された内容を確認")}${dataCard("search","サイト内検索","人物や地域名で探す")}</div></section></article><aside class="article-side"><a class="notice" href="#sources" data-route="sources"><span class="notice-icon">${ICONS.info}</span><span><strong>出典・確認方針</strong><small>公式情報と準備目安を区別</small></span><span class="chevron">›</span></a></aside></div></div>`;
}
