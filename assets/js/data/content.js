// 記事、カテゴリ、地域、人物、検索用データ
const articles = {
  release:{
    tag:"公式情報",state:"公式発表",updated:"2026年7月14日",confirmed:"Rockstar Games公式サイト",spoiler:"なし",
    title:"GTA6の発売日・対応機種・予約状況｜必要容量と快適な空き容量",
    summary:"2026年7月14日時点で、発売予定日は2026年11月19日、対応機種はPlayStation 5とXbox Series X|Sです。正式な必要容量は未発表です",
    sections:[
      ["現在確認できる公式情報","<strong>発売予定日は2026年11月19日</strong>です。発売前は日付だけを転載せず、確認日と公式参照先を同じ場所に表示します。"],
      ["対応機種","公式サイトに掲載されている対応機種は<strong>PlayStation 5とXbox Series X|S</strong>です。PC版については、公式の対応機種欄に追加されるまで未確認として扱います。"],
      ["予約状況","予約受付は<strong>2026年6月25日</strong>に開始されています。エディションや特典は販売地域やストアで確認し、記事内では公式情報と販売店独自情報を分けます。"],
      ["公式参照先","<a class='source-link' href='https://www.rockstargames.com/VI' target='_blank' rel='noopener noreferrer'>GTA VI 公式サイトを開く ↗</a> <a class='source-link' href='https://www.rockstargames.com/newswire/article/5171972o3ak5oa/pre-order-grand-theft-auto-vi-on-june-25' target='_blank' rel='noopener noreferrer'>予約開始の公式発表を開く ↗</a>"]
    ]
  },
  timeline:{
    tag:"情報整理",state:"公式発表を整理",updated:"2026年7月14日",confirmed:"公式発表日を基準",spoiler:"なし",
    title:"GTA6公式発表タイムライン",
    summary:"速報を並べるだけでなく、発表内容がいつ追加・変更されたかを日付順に確認するページです",
    sections:[
      ["2025年5月6日","Trailer 2とPeople & Placesが公開され、Jason、Luciaを含む人物とLeonida各地の情報が公式に追加されました。"],
      ["2026年6月25日","予約受付が開始され、発売日、対応機種、エディション、予約特典を確認できる状態になりました。"],
      ["2026年11月19日予定","発売後は速報中心の構造から、実プレイで確認した攻略、車両、武器、マップ情報へ段階的に移行します。"]
    ]
  },
  mission:{
    tag:"発売後準備",state:"未公開",updated:"発売後に更新",confirmed:"実プレイ後",spoiler:"あり",
    title:"ミッション攻略は発売後に公開",
    summary:"開始条件、手順、報酬、失敗条件を実際のプレイで確認してから掲載します",
    sections:[
      ["発売前に断定しない","トレーラーの場面だけからミッション名や開始条件を推測して攻略情報として掲載しません。"],
      ["発売後の確認項目","開始人物、場所、時間帯、直前の進行、報酬、取り逃し、再挑戦条件を同じ形式で検証します。"]
    ]
  },
  generic:{
    tag:"情報整理",state:"構造サンプル",updated:"公開準備",confirmed:"未接続",spoiler:"なし",
    title:"情報ページのサンプル",
    summary:"発売前は公式発表を整理し、発売後に実測・攻略情報へ拡張する記事テンプレートです",
    sections:[
      ["情報区分を先に置く","記事を開いた直後に、公式発表、映像確認、未確認のどこに当たる情報かを表示します。"],
      ["未発表項目は空欄にする","情報がない項目を推測で埋めず、発表待ちまたは発売後確認として残します。"],
      ["関連情報へつなぐ","人物、地域、公式発表、発売後の攻略を相互に移動できる構造にします。"]
    ]
  }
};

const categoryData = {
  release:{title:"発売・商品情報",desc:"発売日、対応機種、予約、エディションを公式サイトの公開内容をもとに整理",icon:"info",status:"公式情報を優先",sections:[
    {title:"発売日・対応機種",desc:"2026年11月19日とPS5・Xbox Series X|Sを確認",query:"発売日 対応機種"},
    {title:"予約・エディション",desc:"予約開始日、内容、販売地域ごとの差を整理",query:"予約 エディション"},
    {title:"購入前の確認",desc:"公式ストアと販売店独自情報を分けて確認",query:"購入前 公式情報"}
  ]},
  story:{title:"ストーリー・世界観",desc:"公式公開されたあらすじ、人物、組織、舞台を整理し、攻略は発売後に追加",icon:"book",status:"発売前は公式設定のみ",sections:[
    {title:"公式あらすじ",desc:"JasonとLuciaを中心に公開済みの範囲を確認",query:"公式 あらすじ Jason Lucia"},
    {title:"人物・組織",desc:"公式People & Placesに掲載された人物を整理",query:"人物 組織 公式"},
    {title:"発売後の攻略予定",desc:"進行、開始条件、報酬は実プレイ後に検証",query:"発売後 攻略予定"}
  ]},
  weapons:{title:"武器・装備情報",desc:"公式画像や映像で確認できる範囲を整理し、名称・性能は発表または実測まで保留",icon:"target",status:"性能値は発売後",sections:[
    {title:"公式名称が判明した装備",desc:"名称が公式に示されたものだけ個別化",query:"武器 装備 公式名称"},
    {title:"映像内の登場確認",desc:"映像の場面と確認時点を記録",query:"武器 映像確認"},
    {title:"発売後の性能検証",desc:"威力、反動、射程、入手条件を実測",query:"武器 性能 発売後"}
  ]},
  characters:{title:"人物・組織",desc:"Jason、Luciaなど公式公開された人物、関係、所属を出典付きで整理",icon:"user",status:"公式公開済みを掲載",sections:[
    {title:"Jason Duval",desc:"公式プロフィールと関連人物を確認",query:"Jason Duval"},
    {title:"Lucia Caminos",desc:"公式プロフィールと関連人物を確認",query:"Lucia Caminos"},
    {title:"その他の公式人物",desc:"Cal、Boobie、Dre'Quan、Real Dimez、Raul、Brianを整理",query:"公式人物 People Places"}
  ]},
  leaks:{title:"リーク・未確認情報",desc:"噂、リーク、第三者報道を公式発表と分け、出典と現在の扱いを明示して整理",icon:"info",status:"真偽を断定しない",sections:[
    {title:"出典が示されている情報",desc:"元記事や発信元までたどれる情報だけを区別して整理",query:"リーク 出典 報道"},
    {title:"真偽不明の情報",desc:"画像、投稿、伝聞だけの情報は未確認として分離",query:"リーク 真偽不明 未確認"},
    {title:"公式発表後の更新",desc:"後から公式情報が出た場合は内容と掲載状態を更新",query:"リーク 公式発表 更新"}
  ]},
  money:{title:"ゲームシステム",desc:"購入、施設、生活要素など、公式公開内容と発売後検証項目を分離",icon:"dollar",status:"未発表項目は空欄",sections:[
    {title:"公式に確認できる要素",desc:"公式説明や画面で示された範囲だけを整理",query:"ゲームシステム 公式"},
    {title:"発売後に検証する項目",desc:"購入、保管、施設利用などを実プレイで確認",query:"購入 保管 施設 発売後"},
    {title:"過去作との違い",desc:"類似点を公式発表の事実として扱わず比較",query:"過去作 違い"}
  ]},
  online:{title:"オンライン関連",desc:"提供状況、開始時期、参加条件は公式発表が出るまで未確認として扱う",icon:"globe",status:"公式発表待ち",sections:[
    {title:"提供状況",desc:"公式に明示された内容だけを確認",query:"オンライン 提供状況 公式"},
    {title:"参加条件",desc:"必要環境や料金は発表後に整理",query:"オンライン 参加条件"},
    {title:"未確認情報との区別",desc:"予想や過去作ベースの推測を分離",query:"オンライン 未確認"}
  ]}
};

const regions = [
  {id:"vice-city",type:"city",label:"都市",title:"Vice City",desc:"ネオンに照らされた都市として公式People & Placesで公開済み",status:"公式公開",keywords:"Vice City バイスシティ 都市 Leonida",facilities:[["✓","公式名称","People & Placesで公開","公式ページ掲載"],["🖼️","公式画像・映像","公式ページから確認可能","公開済み"],["…","施設・道路・収集物","発売後に実地確認","発表待ち"]]},
  {id:"leonida-keys",type:"coast",label:"島・沿岸",title:"Leonida Keys",desc:"Jasonの背景にも関わる島しょ地域として公式公開済み",status:"公式公開",keywords:"Leonida Keys レオニダ キーズ 島 海岸",facilities:[["✓","公式名称","People & Placesで公開","公式ページ掲載"],["🖼️","公式画像・映像","公式ページから確認可能","公開済み"],["…","移動経路・施設","発売後に実地確認","発表待ち"]]},
  {id:"grassrivers",type:"rural",label:"湿地・自然",title:"Grassrivers",desc:"Leonidaの自然地域として公式People & Placesで公開済み",status:"公式公開",keywords:"Grassrivers グラスリバーズ 湿地 自然",facilities:[["✓","公式名称","People & Placesで公開","公式ページ掲載"],["🖼️","公式画像・映像","公式ページから確認可能","公開済み"],["…","地形・探索地点","発売後に実地確認","発表待ち"]]},
  {id:"port-gellhorn",type:"coast",label:"沿岸都市",title:"Port Gellhorn",desc:"沿岸の地域名として公式People & Placesで公開済み",status:"公式公開",keywords:"Port Gellhorn ポートゲルホーン 港 沿岸",facilities:[["✓","公式名称","People & Placesで公開","公式ページ掲載"],["🖼️","公式画像・映像","公式ページから確認可能","公開済み"],["…","港・道路・施設","発売後に実地確認","発表待ち"]]},
  {id:"ambrosia",type:"rural",label:"地方・産業",title:"Ambrosia",desc:"Leonida内の地域名として公式People & Placesで公開済み",status:"公式公開",keywords:"Ambrosia アンブロシア 地方 産業",facilities:[["✓","公式名称","People & Placesで公開","公式ページ掲載"],["🖼️","公式画像・映像","公式ページから確認可能","公開済み"],["…","施設・活動・移動","発売後に実地確認","発表待ち"]]},
  {id:"mount-kalaga",type:"rural",label:"山岳・自然",title:"Mount Kalaga",desc:"Leonidaの地域名として公式People & Placesで公開済み。詳細は追加発表待ち",status:"公式公開",keywords:"Mount Kalaga マウントカラガ 山岳 自然",facilities:[["✓","公式名称","People & Placesで公開","公式ページ掲載"],["🖼️","公式画像・映像","公式ページから確認可能","公開済み"],["…","地形・活動・到達方法","発売後に実地確認","発表待ち"]]}
];

const officialPeople = [
  {name:"Jason Duval",note:"主要人物として公式プロフィール公開済み"},
  {name:"Lucia Caminos",note:"主要人物として公式プロフィール公開済み"},
  {name:"Cal Hampton",note:"公式People & Places掲載"},
  {name:"Boobie Ike",note:"公式People & Places掲載"},
  {name:"Dre'Quan Priest",note:"公式People & Places掲載"},
  {name:"Real Dimez",note:"公式People & Places掲載"},
  {name:"Raul Bautista",note:"公式People & Places掲載"},
  {name:"Brian Heder",note:"公式People & Places掲載"}
];

const vehicleData = [];

const glossaryData = [
  {term:"公式発表",desc:"Rockstar Gamesなど権利元が文章や公式ページで明記した内容。発表日、確認日、参照先を併記します。"},
  {term:"公式映像で確認",desc:"公式トレーラーや映像内で存在を確認できる内容。名称、性能、条件まで判明したことにはしません。"},
  {term:"発売後検証",desc:"ミッション条件、性能、価格、入手場所など、実プレイで再現性を確認してから掲載する項目です。"},
  {term:"未確認",desc:"公式根拠が不足している情報。公式発表の一覧や検索結果とは別に扱います。"},
  {term:"確認日",desc:"サイト側が公式ページや出典を最後に確認した日。発表日や発売日とは別の日付です。"},
  {term:"ネタバレ段階",desc:"概要、軽微、重大のように、発売後の記事を開く前に内容の深さを判断する表示です。"}
];

const updateEntries = [
  {date:"2026.07.14",title:"発売前モードへ情報構造を変更",desc:"発売日、対応機種、予約状況、公式人物、公式地域を最優先にしました。"},
  {date:"2026.07.14",title:"架空の車両性能データを非表示",desc:"正式名称や性能が確認できないサンプル車両を公開画面から外しました。"},
  {date:"2026.07.14",title:"公式発表ページを追加",desc:"公式に公開されている情報と、まだ詳細が公開されていない項目を一画面で確認できるようにしました。"},
  {date:"発売後予定",title:"攻略・実測データへ段階移行",desc:"ミッション、車両、武器、マップを実プレイで確認した順に追加します。"}
];

const staticSearchItems = [
  {title:"公式発表から分かること",type:"article",typeLabel:"公式情報",desc:"発売日、対応機種、人物、地域について公式サイトの公開内容を確認",route:"confirmed",keys:"公式 公式発表 発売日 対応機種 人物 地域"},
  {title:"発売日・対応機種の確認ページ",type:"article",typeLabel:"記事",desc:"公式発表と確認日を分けて整理",route:"article/release",keys:"発売日 対応機種 公式"},
  {title:"公開情報を時系列で確認する",type:"article",typeLabel:"記事",desc:"発表内容を更新順にたどる",route:"article/timeline",keys:"最新 情報 時系列"},
  {title:"発売前ガイド",type:"guide",typeLabel:"ガイド",desc:"発売日、対応機種、公式情報の確認順を表示",route:"beginner",keys:"発売前 予約 対応機種 公式情報"},
  {title:"舞台・地域",type:"database",typeLabel:"公式情報",desc:"People & Placesで公開された地域名を確認",route:"map",keys:"マップ 地域 舞台 Vice City Leonida"},
  {title:"登場車両情報",type:"database",typeLabel:"発売前情報",desc:"公式名称と映像内で確認できる範囲を整理",route:"vehicles",keys:"車 車両 登場 映像 公式"},
  {title:"用語集",type:"guide",typeLabel:"ガイド",desc:"サイト内の表示や分類の意味を確認",route:"glossary",keys:"用語 意味 公式情報 未確認"},
  {title:"サイトの使い方",type:"guide",typeLabel:"ガイド",desc:"公式発表、映像確認、発売後検証の使い分け",route:"guide",keys:"使い方 探し方 検索 確認状態"},
  {title:"更新履歴",type:"policy",typeLabel:"サイト情報",desc:"画面と機能の追加内容を確認",route:"changelog",keys:"更新 履歴 変更"},
  {title:"運営・掲載方針",type:"policy",typeLabel:"サイト情報",desc:"情報区分、出典、更新の考え方",route:"about",keys:"運営 掲載 方針"}
];

const routeTitles = {
  home:"ホーム",latest:"最新情報",confirmed:"公式発表",categories:"情報カテゴリ",category:"情報カテゴリ",map:"舞台・地域",region:"地域詳細",vehicles:"登場車両情報",vehicle:"車両詳細",beginner:"発売前ガイド",search:"サイト内検索",article:"情報記事",about:"運営・掲載方針",guide:"サイトの使い方",sources:"出典・引用方針",corrections:"訂正・更新方針",privacy:"プライバシーポリシー",terms:"利用規約",disclaimer:"免責事項",contact:"お問い合わせ",changelog:"更新履歴",sitemap:"サイトマップ",glossary:"用語集"
};
