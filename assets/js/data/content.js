// 記事、カテゴリ、地域、人物、検索用データ
const articles = {
  release:{
    tag:"公式情報",state:"公式発表",updated:"2026年7月14日",confirmed:"Rockstar Games公式サイト",spoiler:"なし",
    title:"GTA6の発売日・対応機種・予約状況｜必要容量と快適な空き容量",
    summary:"発売予定日は2026年11月19日、対応機種はPlayStation 5とXbox Series X|Sです。正式な必要容量は未発表です",
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
  {name:"Jason Duval",note:"ジェイソン・デュバル",detailHtml:`<p>ジェイソン・デュバル</p><h4>公式に確認できる経歴</h4><p>ジェイソンは、詐欺師や犯罪者が身近にいる環境で育ちました。問題の多かった10代の生活から抜け出そうと陸軍に入ったものの、その後はレオナイダ・キーズで地元の麻薬密輸業者の仕事をしています。</p><p>本人は平穏で簡単な生活を望んでいますが、現実には状況が悪化し続けています。</p><h4>Luciaとの関係</h4><p>公式紹介では、ルシアとの出会いがジェイソンの人生で「最高の出来事」にも「最悪の出来事」にもなり得ると表現されています。</p><p>ジェイソンはルシアに対して強い忠誠心を示しており、トレーラーでも二人が恋愛関係と犯罪上の相棒を兼ねていることが分かります。ただし、結婚している、婚約しているといった具体的な関係は公表されていません。</p><h4>周辺人物との関係</h4><p>ジェイソンは、Brian Hederが所有する物件に家賃なしで住んでいます。その代わり、地元での取り立てなど、Brianの仕事を手伝う必要があります。</p><p>Cal Hamptonはジェイソンの友人であり、Brianの仕事仲間でもあります。</p>`},
  {name:"Lucia Caminos",note:"ルシア・カミノス",detailHtml:`<p>ルシア・カミノス</p><h4>公式に確認できる経歴</h4><p>ルシアは、幼いころから父親に戦い方を教えられて育ちました。家族を守るために起こした行動によって、レオナイダ刑務所へ収監されています。</p><p>刑務所から出られたのは、公式説明では本人の実力というより「幸運」によるものとされています。出所後は、無計画な行動を避け、より計算された方法で人生を変えようとしています。</p><h4>目的</h4><p>ルシアが望んでいるのは、母親がかつて夢見ていた「豊かで安定した生活」です。</p><p>ルシアと母親は以前、Liberty Cityで暮らしていたことが公式に示されています。ただし、ルシアがLiberty City生まれなのか、何歳まで住んでいたのかは分かっていません。</p><h4>Jasonとの関係</h4><p>公式プロフィールには、ジェイソンとの生活がルシアにとって現在の状況から抜け出す手段になり得ると書かれています。</p><p>そのためルシアは、単にジェイソンに付き従う人物ではなく、自分の計画を持ち、ジェイソンとの関係もその将来設計の一部として考えている人物と読み取れます。</p>`},
  {name:"Cal Hampton",note:"カル・ハンプトン",detailHtml:`<p>カル・ハンプトン</p><p>Calはジェイソンの友人で、Brianの仕事仲間です。</p><p>自宅でビールを飲みながら沿岸警備隊の無線を傍受し、インターネット上の陰謀論を追いかけることを好みます。鳥が不自然な隊列で飛んでいることを疑うなど、かなり強い被害妄想・陰謀論的思考を持つ人物として描かれています。</p><p>Cal本人は現在の停滞した暮らしに満足していますが、ジェイソンはそこから抜け出そうとしています。二人の方向性の違いが、物語上の対立や別離につながる可能性があります。ただし、後半部分は公式設定からの推測です。</p>`},
  {name:"Boobie Ike",note:"ブービー・アイク",detailHtml:`<p>ブービー・アイク</p><p>BoobieはVice Cityで知られた地元の有力者です。</p><p>路上犯罪の世界で得た地位や資金を利用し、現在は次の事業を運営しています。</p><ul><li>不動産</li><li>ストリップクラブ</li><li>レコーディングスタジオ</li></ul><p>普段は笑顔で人当たりよく振る舞う一方、仕事の話になると態度が変わる人物です。合法的な事業だけでなく、麻薬取引による資金が事業全体を支えていることも、本人の発言から示されています。</p><h4>Dre'Quanとの関係</h4><p>Boobieが特に力を入れているのが、Dre'Quan Priestと組んで展開するOnly Raw Recordsです。</p><p>クラブとスタジオは用意できていますが、レーベルを成功させるための大ヒット曲がまだ不足しています。</p>`},
  {name:"Dre'Quan Priest",note:"ドレクアン・プリースト",detailHtml:`<p>ドレクアン・プリースト</p><p>Dre'Quanは、ギャングというよりも商才のあるハスラーとして紹介されています。</p><p>生活費を稼ぐために路上で麻薬を売っていた時期もありますが、本来の目標は音楽業界で成功することでした。Boobieのストリップクラブで出演者を手配しながら、レコード会社の立ち上げを進めています。</p><h4>Real Dimezとの関係</h4><p>Dre'QuanはReal Dimezと契約しました。</p><p>この契約をきっかけに、クラブ内の小規模な仕事から離れ、Vice City全体の音楽シーンへ進出しようとしています。物語では、Boobieの資金力とDre'Quanの音楽ビジネス、Real Dimezの知名度が一つの勢力として描かれる可能性があります。</p>`},
  {name:"Real Dimez",note:"リアル・ダイムズ",detailHtml:`<p>リアル・ダイムズ</p><p>Real Dimezは一人の人物ではなく、次の女性2人によるラップデュオです。</p><ul><li>Bae-Luxe</li><li>Roxy</li></ul><p>二人は高校時代からの友人です。以前は地元の麻薬売人から金品を奪っていましたが、その経験や知名度を、刺激的なラップ曲と積極的なSNS活動へ転換しました。</p><h4>音楽活動</h4><p>地元ラッパーのDWNPLYと発表した初期のヒット曲によって、一度は注目を集めています。</p><p>しかし、その後の5年間には多くの問題があり、現在はOnly Raw Recordsと契約して再起を狙っています。公式には「次のヒットまであと一歩」という立場です。</p><p>SNS、クラブ、音楽、犯罪が結びついた現代的なVice Cityを象徴する人物群と考えられます。</p>`},
  {name:"Raul Bautista",note:"ラウル・バウティスタ",detailHtml:`<p>ラウル・バウティスタ</p><p>Raulは経験豊富な銀行強盗です。</p><p>自信、魅力、狡猾さを持ち、高額な報酬を得るために危険を冒せる人材を常に探しています。状況に合わせて行動を変えるプロ意識を持つ一方、本人の無謀さによって、仕事を重ねるほど危険度が高くなる人物です。</p><h4>JasonとLuciaとの関係</h4><p>公式プロフィールでは、Raulがジェイソンやルシアと直接どのように知り合うのかまでは説明されていません。</p><p>ただし、彼が銀行強盗のための人材を探していることから、二人を小規模犯罪から大規模な強盗へ導く役割を担う可能性があります。これは公式経歴とトレーラーの構成をもとにした推測であり、確定情報ではありません。</p>`},
  {name:"Brian Heder",note:"ブライアン・ヘダー",detailHtml:`<p>ブライアン・ヘダー</p><p>Brianは、レオナイダ・キーズにおける昔ながらの麻薬密輸業者です。</p><p>密輸が盛んだった時代から活動しており、現在も3人目の妻Loriとともに、所有するボートヤードを使って商品を運んでいます。長年生き残ってきたため、自分で危険な作業をするよりも、ほかの人間に実行させる立場になっています。</p><h4>Jasonとの関係</h4><p>Brianはジェイソンに物件を無償で貸しています。</p><p>ただし完全な好意ではなく、ジェイソンが地元での取り立てや脅しの仕事を手伝うことが条件です。ジェイソンにとっては住居を提供する恩人である一方、犯罪生活から抜け出せなくしている雇い主でもあります。</p>`}
];

const vehicleData = [];

const staticSearchItems = [
  {title:"公式発表から分かること",type:"article",typeLabel:"公式情報",desc:"発売日、対応機種、人物、地域について公式サイトの公開内容を確認",route:"confirmed",keys:"公式 公式発表 発売日 対応機種 人物 地域"},
  {title:"発売日・対応機種の確認ページ",type:"article",typeLabel:"記事",desc:"公式発表と確認日を分けて整理",route:"article/release",keys:"発売日 対応機種 公式"},
  {title:"公開情報を時系列で確認する",type:"article",typeLabel:"記事",desc:"発表内容を更新順にたどる",route:"article/timeline",keys:"最新 情報 時系列"},
  {title:"発売前ガイド",type:"guide",typeLabel:"ガイド",desc:"発売日、対応機種、公式情報の確認順を表示",route:"beginner",keys:"発売前 予約 対応機種 公式情報"},
  {title:"舞台・地域",type:"database",typeLabel:"公式情報",desc:"People & Placesで公開された地域名を確認",route:"map",keys:"マップ 地域 舞台 Vice City Leonida"},
  {title:"登場車両情報",type:"database",typeLabel:"発売前情報",desc:"公式名称と映像内で確認できる範囲を整理",route:"vehicles",keys:"車 車両 登場 映像 公式"},
  {title:"サイトの使い方",type:"guide",typeLabel:"ガイド",desc:"公式発表、映像確認、発売後検証の使い分け",route:"guide",keys:"使い方 探し方 検索 確認状態"},
  {title:"運営・掲載方針",type:"policy",typeLabel:"サイト情報",desc:"情報区分、出典、更新の考え方",route:"about",keys:"運営 掲載 方針"}
];

const routeTitles = {
  home:"ホーム",latest:"最新情報",confirmed:"公式発表",categories:"情報カテゴリ",category:"情報カテゴリ",map:"舞台・地域",region:"地域詳細",vehicles:"登場車両情報",vehicle:"車両詳細",beginner:"発売前ガイド",search:"サイト内検索",article:"情報記事",about:"運営・掲載方針",guide:"サイトの使い方",sources:"出典・引用方針",corrections:"訂正・更新方針",privacy:"プライバシーポリシー",terms:"利用規約",disclaimer:"免責事項",sitemap:"サイトマップ"
};
