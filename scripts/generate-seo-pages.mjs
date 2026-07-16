import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const ORIGIN = "https://mainitiworakunisuru.com";
const SITE_NAME = "GTA6インフォ";
const DEFAULT_IMAGE = `${ORIGIN}/assets/images/og-default.png`;

const nav = [
  ["/", "ホーム"],
  ["/release/", "最新・公式情報"],
  ["/category/", "情報カテゴリ"],
  ["/map/", "舞台・地域"],
  ["/vehicles/", "登場車両"]
];

const categoryLinks = [
  ["/release/", "最新・公式・発売情報", "新しい発表、発売日、対応機種、予約、必要容量"],
  ["/characters/", "登場人物", "公式公開された人物と組織"],
  ["/map/", "舞台・地域", "Vice Cityなど公式公開地域"],
  ["/vehicles/", "登場車両", "車両の確認状態と公式情報"],
  ["/systems/", "ゲームシステム", "発売前に確認できる仕様"],
  ["/online/", "オンライン", "公式発表と未発表項目"],
  ["/leaks/", "リーク・未確認情報", "確定情報と分離して確認"],
  ["/guide/", "発売前ガイド", "購入前に確認する順番"]
];

const esc = (value = "") => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

const cards = (items) => `<div class="seo-card-grid">${items.map(([href, title, text]) => `
  <a class="seo-link-card" href="${href}"><strong>${esc(title)}</strong><span>${esc(text)}</span><em>確認する <span aria-hidden="true">›</span></em></a>`).join("")}
</div>`;

const facts = `<dl class="seo-facts">
  <div><dt>発売予定日</dt><dd><strong>2026年11月19日</strong><span class="seo-label official">公式確認済み</span></dd></div>
  <div><dt>対応機種</dt><dd>PlayStation 5・Xbox Series X|S <span class="seo-label official">公式確認済み</span></dd></div>
  <div><dt>PC版</dt><dd>発売時期・必要スペックともに未発表 <span class="seo-label pending">公式未発表</span></dd></div>
  <div><dt>舞台</dt><dd>Vice Cityを含むLeonida <span class="seo-label official">公式確認済み</span></dd></div>
  <div><dt>主人公</dt><dd>Jason Duval・Lucia Caminos <span class="seo-label official">公式確認済み</span></dd></div>
  <div><dt>予約</dt><dd>2026年6月25日から受付 <span class="seo-label official">公式確認済み</span></dd></div>
</dl>`;

const pages = [
  {
    slug: "news",
    title: "GTA6最新ニュース一覧｜公式発表・報道・未確認情報の更新履歴",
    description: "GTA6の新しい発表や変更点を日付順に並べ、公式発表・報道・未確認情報の区分と詳細ページへのリンクを掲載します。",
    h1: "GTA6最新ニュース",
    lead: "GTA6について新しく分かったことと、以前の情報から変わった点を時系列で確認するページです。発売情報の固定まとめは発売・商品情報、一次情報の記録は公式発表へ分けています。",
    status: "情報整理",
    sources: [["Rockstar Games Newswire", "https://www.rockstargames.com/newswire"]],
    body: `<section><h2>ニュース一覧</h2><ol class="seo-timeline"><li><time datetime="2026-06-25">2026年6月25日</time><div><span class="seo-label official">公式発表</span><h3>GTA6の予約受付が開始</h3><p>PlayStation 5とXbox Series X|S向け商品の予約受付開始を確認しました。価格、エディション、容量の注意点は発売・商品情報へ集約しています。</p><a href="/release/">発売・商品情報を確認する ›</a></div></li></ol></section><section><h2>このページに掲載する内容</h2><ul class="seo-list"><li>新しい公式発表と、以前の情報からの変更点</li><li>発表日または確認できる出来事の日付</li><li>公式・報道・未確認の区分</li><li>情報源と詳しい解説ページへのリンク</li></ul><p class="seo-note">発売日や対応機種の固定情報は<a href="/release/">発売・商品情報</a>、Rockstar Gamesの発表記録は<a href="/official/">公式発表一覧</a>で確認できます。</p></section>`
  },
  {
    slug: "official",
    title: "GTA6公式発表まとめ｜Rockstar Gamesの発表を時系列で確認",
    description: "Rockstar Gamesなどの一次情報で確認できるGTA6の公式発表を、発表元、内容、変更点、参照URLとともに整理します。",
    h1: "GTA6の公式発表一覧",
    lead: "Rockstar Games公式サイト、公式Newswire、各プラットフォームの公式ストアで確認できる発表だけを記録します。映像からの推測や匿名投稿はこの一覧に含めません。",
    status: "公式確認済み",
    sources: [["Rockstar Games GTA VI公式サイト", "https://www.rockstargames.com/VI"], ["Rockstar Games Newswire", "https://www.rockstargames.com/newswire"]],
    body: `<section><h2>公式発表の記録</h2><ol class="seo-timeline"><li><time datetime="2026-06-25">2026年6月25日</time><div><span class="seo-label official">Rockstar Games・公式ストア</span><h3>予約受付を開始</h3><p>PlayStation 5とXbox Series X|S向け商品の予約受付開始を確認しました。購入条件の詳細は発売・商品情報に分離しています。</p><a href="/release/">購入前の確認事項を見る ›</a></div></li></ol></section><section><h2>公式参照先</h2><ul class="seo-list"><li><a href="https://www.rockstargames.com/VI" target="_blank" rel="noopener noreferrer">Rockstar Games GTA VI公式サイト</a></li><li><a href="https://www.rockstargames.com/newswire" target="_blank" rel="noopener noreferrer">Rockstar Games Newswire</a></li></ul></section><section><h2>分野別に確認</h2>${cards([["/release/","発売・商品情報","発売日、価格、機種、予約を確認"],["/characters/","登場人物","公式公開された人物を確認"],["/map/","舞台・地域","公式公開された地域を確認"]])}</section>`
  },
  {
    slug: "category",
    title: "GTA6情報カテゴリ一覧｜公式・発売・人物・舞台",
    description: "GTA6の最新情報、公式発表、発売情報、登場人物、舞台、車両、ゲームシステム、リークを目的別に探せます。",
    h1: "GTA6の情報カテゴリ",
    lead: "知りたい内容から直接ページへ移動できる一覧です。公式発表と未確認情報を同じ一覧で混同しないよう、リーク・未確認情報は独立したカテゴリに分けています。",
    body: `<section><h2>カテゴリから探す</h2>${cards(categoryLinks)}</section>`
  },
  {
    slug: "release",
    title: "GTA6最新・公式・発売情報｜発売日・対応機種・価格・予約状況",
    description: "GTA6の新しい公式発表、発売日、PS5・Xbox Series X|S対応、国内価格、予約、必要容量、PC版の状況をまとめて確認できます。",
    h1: "GTA6の最新・公式・発売情報",
    lead: "新しい発表と購入前に必要な発売日、対応機種、価格、予約、容量を一つのページへ集約しています。情報源と確認状態を示し、未発表事項は推測で確定しません。",
    status: "公式情報を優先",
    sources: [["Rockstar Games GTA VI公式サイト", "https://www.rockstargames.com/VI"], ["PlayStation Store", "https://store.playstation.com/"], ["Xbox Store", "https://www.xbox.com/games/store"]],
    body: `<section><h2>発売日と対応機種</h2><dl class="seo-table"><div><dt>発売予定日</dt><dd><strong>2026年11月19日</strong> <span class="seo-label official">公式確認済み</span></dd></div><div><dt>PlayStation 5</dt><dd>対応</dd></div><div><dt>Xbox Series X|S</dt><dd>対応</dd></div><div><dt>PlayStation 4・Xbox One</dt><dd>対応発表なし</dd></div><div><dt>PC版</dt><dd>発売日・必要スペックともに未発表</dd></div></dl></section><section><h2>価格と予約状況</h2><dl class="seo-table"><div><dt>予約受付</dt><dd>2026年6月25日から受付</dd></div><div><dt>スタンダード版</dt><dd>9,800円</dd></div><div><dt>アルティメット版</dt><dd>12,280円</dd></div><div><dt>アルティメット版アップグレード</dt><dd>2,480円</dd></div></dl><p class="seo-note">価格、内容、販売地域、特典は購入時に各公式ストアで再確認してください。</p></section><section><h2>必要容量</h2><p><strong>正式なインストール容量は未発表です。</strong>発売前に最低250GB、余裕を持つなら300〜350GB以上という数値は、過去作品と更新データを考慮した準備目安であり、GTA6の公式容量ではありません。</p></section><section><h2>予約前に確認すること</h2><ul class="seo-list"><li>購入する機種とストアの地域が合っているか</li><li>エディションごとの収録内容とアップグレード条件</li><li>予約特典の期限とGTA+などの自動更新条件</li><li>パッケージ商品の収録形式</li><li>事前ダウンロード時に表示される正式容量</li></ul></section><section><h2>関連する公式情報</h2><p>発表元と発表履歴は<a href="/official/">公式発表一覧</a>、新しい変更点は<a href="/news/">最新ニュース</a>で確認できます。</p></section>`
  },
  {
    slug: "characters",
    title: "GTA6登場人物｜公式公開キャラクター一覧",
    description: "GTA6で公式公開されているJason Duval、Lucia Caminosなどの登場人物を、公式プロフィールと関連地域から整理します。",
    h1: "GTA6の登場人物",
    lead: "Rockstar Gamesの公式ページで名前とプロフィールが公開されている人物を中心に整理します。映像に映っただけで名前が確定していない人物や、匿名投稿の名称は公式人物一覧へ混ぜません。",
    body: `<section><h2>中心人物</h2>${cards([["/official/","Jason Duval","公式発表の確認先を見る"],["/official/","Lucia Caminos","公式発表の確認先を見る"]])}</section><section><h2>人物情報の掲載基準</h2><p>人物名、所属、関係性は公式プロフィールの記載範囲を優先します。ストーリー上の役割や結末につながる内容は、公式発表であってもネタバレ表示を分けます。</p></section><section><h2>関連する舞台</h2><p><a href="/map/">GTA6の舞台・地域一覧</a>では、人物と関連する公式公開地域を確認できます。</p></section>`
  },
  {
    slug: "vehicles",
    title: "GTA6に登場する車メーカー一覧｜公式確認済み車両",
    description: "GTA6で公式に名称を確認できるGrotti、Vapid、Dinka、Shitzuと、確認済みの車・バイク・ボートを整理します。",
    h1: "GTA6に登場する車メーカーと確認済み車両",
    lead: "GTA6に登場する車メーカーは一部のみ公式情報で確認されています。全メーカーや全車両は未発表のため、公式サイトや公式画像に名称が掲載されたものだけを公式確認済みとして整理します。",
    body: `<section><h2>現在の結論</h2><p>公式情報で名称を確認できる自動車メーカーは、現時点で<strong>GrottiとVapidの2社</strong>です。車以外では、バイクのDinkaとボートのShitzuも確認されています。</p><div class="seo-key-grid"><article><span>自動車</span><strong>Grotti・Vapid</strong><small>公式名称を確認済み</small></article><article><span>バイク</span><strong>Dinka</strong><small>Enduro Motorcycleを確認</small></article><article><span>ボート</span><strong>Shitzu</strong><small>Squaloを確認</small></article></div><p class="seo-note">Rockstar Gamesが全メーカー・全車両の一覧を発表したわけではありません。映像の外見だけを基にした特定は、公式確認済み情報と分けて扱います。</p></section>
<section><h2>公式確認済みの自動車メーカー</h2><div class="seo-brand-block"><h3>Grotti</h3><p>Grottiは、GTAシリーズで高級スポーツカーを中心に展開してきた架空メーカーです。</p><p>GTA6の公式情報では、<strong>’95 Grotti Cheetah</strong>の名称が確認されています。車両名にGrottiが明記されているため、GTA6への登場が公式に確認されたメーカーとして扱えます。</p><ul class="seo-vehicle-list"><li><strong>’95 Grotti Cheetah</strong><span>自動車</span></li></ul></div><div class="seo-brand-block"><h3>Vapid</h3><p>VapidもGTA6の公式情報に名称が掲載されています。過去のGTAシリーズでは、アメリカ車を思わせる車両を多く展開してきた架空メーカーです。</p><p>複数の車両名が公式情報に掲載されているため、GTA6への登場を確認できます。</p><ul class="seo-vehicle-list"><li><strong>’67 Vapid Dominator Buggy</strong><span>自動車</span></li><li><strong>’55 Vapid Stanier Sedan</strong><span>自動車</span></li></ul></div></section>
<section><h2>車以外で確認されているメーカー</h2><div class="seo-brand-block"><h3>Dinka</h3><p>バイク系では、<strong>Dinka Enduro Motorcycle</strong>の名称が公式情報に掲載されています。Dinkaは過去作でも、バイクや小型車などを展開してきた架空メーカーです。</p><p>GTA6では、少なくともバイク系メーカーとして登場することが確認できます。</p><ul class="seo-vehicle-list"><li><strong>Dinka Enduro Motorcycle</strong><span>バイク</span></li></ul></div><div class="seo-brand-block"><h3>Shitzu</h3><p>ボート系では、<strong>Shitzu Squalo</strong>の名称が確認されています。Shitzuも過去のGTAシリーズに登場してきた架空メーカーで、バイクや水上車両などに使われてきました。</p><ul class="seo-vehicle-list"><li><strong>Shitzu Squalo</strong><span>ボート</span></li></ul></div><p class="seo-note">乗り物メーカー全体ではGrotti、Vapid、Dinka、Shitzuの4社を確認できます。ただし、自動車メーカーとして公式確認済みなのはGrottiとVapidです。</p></section>
<section><h2>日本車系のメーカーは登場する？</h2><p>現時点では、トヨタ、日産、ホンダ、マツダ、三菱などの実在する日本メーカーが、そのままの名称で登場するとは発表されていません。</p><p>GTAシリーズでは実在メーカー名を使わず、現実のメーカーや車種を連想させる架空ブランドを採用するのが基本です。過去作では、日本車を思わせるブランドとして次の名称が登場しています。</p><ul class="seo-list"><li><strong>Karin</strong></li><li><strong>Dinka</strong></li><li><strong>Annis</strong></li><li><strong>Maibatsu</strong></li></ul><p>Karinはトヨタ系、Dinkaはホンダ系、Annisは日産系、Maibatsuは三菱系を連想させるメーカーとして扱われることがあります。ただし、これは過去作の車両デザインやファンによる分類を含み、実在メーカーとの正式な関係を示すものではありません。</p><p>GTA6の公式情報で現在確認できる日本車風メーカーは<strong>Dinka</strong>です。ただし、確認されているのは自動車ではなく<strong>Dinka Enduro Motorcycle</strong>です。Karin、Annis、Maibatsuの登場はまだ発表されていません。</p></section>
<section><h2>実在する自動車メーカーは登場する？</h2><p>GTA6の車両には、現実の車を思わせるデザインが採用される可能性があります。ただし、実在メーカー名がそのまま使われることを意味するものではありません。</p><dl class="seo-table"><div><dt>Grotti</dt><dd>フェラーリ系を連想させる架空ブランド</dd></div><div><dt>Vapid</dt><dd>フォード系を連想させる架空ブランド</dd></div><div><dt>Dinka</dt><dd>ホンダ系を連想させる架空ブランド</dd></div></dl><p class="seo-note">Ferrari、Ford、Toyota、Hondaなどが正式名称のまま登場するという意味ではありません。「実在車に似たデザイン」「実在メーカーを思わせる架空ブランド」と表現するのが正確です。</p></section>
<section><h2>全メーカーと全車両はまだ未発表</h2><p>Rockstar Gamesは、GTA6に登場する全車両や全メーカーの一覧をまだ発表していません。現在確認できるのは、公式サイトや公式画像に車両名が掲載された一部のメーカーのみです。</p><p>街中を走る一般車、警察車両、トラック、カスタムカー、バイク、ボートなどを含む完全な車両リストは未発表です。トレーラーやスクリーンショットには過去作のメーカーや車種に見える車両もありますが、外見だけを基にした特定には推測が含まれます。</p></section>
<section><h2>確認できるメーカーまとめ</h2><dl class="seo-table"><div><dt>公式確認済みの自動車メーカー</dt><dd><strong>Grotti・Vapid</strong></dd></div><div><dt>バイクで確認</dt><dd><strong>Dinka</strong></dd></div><div><dt>ボートで確認</dt><dd><strong>Shitzu</strong></dd></div><div><dt>実在する日本メーカー</dt><dd>正式名称での登場は未発表</dd></div><div><dt>そのほかの日本車風ブランド</dt><dd>Karin・Annis・MaibatsuはGTA6での登場未発表</dd></div></dl><p>今後、新しい公式画像や車両情報が公開されれば、確認できるメーカーが増える可能性があります。</p></section>
<section><h2>関連情報</h2>${cards([["/official/","公式発表","一次情報を確認"],["/systems/","ゲームシステム","車両を含むシステム情報"],["/map/","舞台・地域","車両が登場する地域"]])}</section>`
  },
  {
    slug: "systems",
    title: "GTA6ゲームシステム情報｜公式発表と未発表項目",
    description: "GTA6のNPC、警察、所持品、武器、建物、経済などのゲームシステムを、公式確認済みと未発表に分けます。",
    h1: "GTA6のゲームシステム",
    lead: "NPC、警察、所持品、武器、建物、経済などの仕様を扱うカテゴリです。発売前映像から分かる範囲と、操作感や数値など発売後の検証が必要な内容を分けます。",
    body: `<section><h2>扱う情報</h2>${cards([["/vehicles/","車両","公式名称と映像確認を分離"],["/online/","オンライン","提供時期と仕様の発表状況"],["/official/","公式発表","現在の一次情報を確認"]])}</section><section><h2>発売前に断定しない情報</h2><p>NPCの行動パターン、警察AI、武器性能、経済バランス、建物へ入れる条件などは、公式な仕様説明または発売後の再現確認がない限り確定情報として掲載しません。</p></section>`
  },
  {
    slug: "online",
    title: "GTA6オンライン情報｜公式発表の確認状況",
    description: "GTA6のオンライン要素について、提供時期、対応機種、参加条件などの公式発表状況を整理します。",
    h1: "GTA6のオンライン情報",
    lead: "オンライン要素の名称、提供時期、参加条件、料金などは、公式発表前に断定しません。GTA Onlineの既存仕様を、そのままGTA6の仕様として扱わないための確認ページです。",
    body: `<section><h2>現在の扱い</h2><p><span class="seo-label pending">公式未発表</span> 詳細な提供時期や参加条件は、Rockstar Gamesの正式な案内を確認後に掲載します。</p></section><section><h2>確認する項目</h2><ul class="seo-list"><li>提供開始日</li><li>対象プラットフォーム</li><li>利用料金とサブスクリプション条件</li><li>セーブデータや進行状況の扱い</li><li>クロスプレイの有無</li></ul></section>`
  },
  {
    slug: "leaks",
    title: "GTA6リーク・未確認情報｜公式情報との区別",
    description: "GTA6のリーク、噂、未確認情報を公式発表と分離し、出所と現在の確認状況が分かる形で整理します。",
    h1: "GTA6のリーク・未確認情報",
    lead: "リークや噂を確定情報として扱わないためのカテゴリです。出所、一次資料の有無、公式発表後の変化を明示し、権利者の許可が確認できない流出画像や動画は転載しません。",
    body: `<section><h2>掲載時の表示</h2><div class="seo-label-row"><span class="seo-label reported">報道情報</span><span class="seo-label unverified">未確認情報</span><span class="seo-label leak">リーク</span><span class="seo-label analysis">予測・考察</span></div><p>各ラベルの意味は<a href="/editorial-policy/">編集・掲載方針</a>で確認できます。</p></section><section><h2>公式発表が出た後</h2><p>内容が公式発表で確認できた場合は公式情報への参照を追加します。誤りだった場合は、削除だけで終わらせず訂正内容を明示します。</p></section>`
  },
  {
    slug: "guide",
    title: "GTA6発売前ガイド｜購入前に確認すること",
    description: "GTA6を購入する前に、発売日、対応機種、予約条件、必要容量、公式情報と未確認情報の違いを確認できます。",
    h1: "GTA6の発売前ガイド",
    lead: "予約や購入の前に確認しておきたい情報を、迷いにくい順番でまとめています。販売店の表示だけでなく、Rockstar Gamesと各プラットフォームの公式案内も確認してください。",
    body: `<section><h2>確認する順番</h2><ol class="seo-steps"><li><strong>対応機種を確認</strong><span>PS5またはXbox Series X|S向けかを確認します。</span></li><li><strong>エディションを確認</strong><span>本編と追加コンテンツの違いを販売ページで確認します。</span></li><li><strong>空き容量を確認</strong><span>正式容量は発表後に再確認します。</span></li><li><strong>予約特典を確認</strong><span>期限、自動更新、地域制限を確認します。</span></li></ol></section><section><h2>関連ページ</h2>${cards([["/release/","発売・商品情報","発売日と対応機種を確認"],["/official/","公式発表","一次情報の参照先を確認"],["/source-policy/","出典・引用方針","情報源の優先順位を確認"]])}</section>`
  },
  {
    slug: "about",
    title: "運営者情報｜GTA6インフォ",
    description: "GTA6インフォの運営形態、サイトの目的、想定読者、情報源、広告と編集内容の考え方を掲載します。",
    h1: "GTA6インフォの運営者情報",
    lead: "GTA6インフォは、GTA6に関する公式発表と未確認情報を分け、日本語で確認しやすく整理する個人運営の非公式ファンサイトです。",
    body: `<section><h2>サイト基本情報</h2><dl class="seo-table"><div><dt>サイト名</dt><dd>GTA6インフォ</dd></div><div><dt>URL</dt><dd>${ORIGIN}/</dd></div><div><dt>運営形態</dt><dd>個人運営</dd></div><div><dt>運営者名</dt><dd>非公開</dd></div><div><dt>目的</dt><dd>公式情報、報道、未確認情報、考察を区別して整理すること</dd></div><div><dt>想定読者</dt><dd>GTA6の発売情報や公式発表を日本語で確認したい人</dd></div></dl></section><section><h2>情報源の優先順位</h2><ol class="seo-list"><li>Rockstar Games公式サイト・公式Newswire</li><li>Take-Two Interactive公式資料</li><li>PlayStation・Xbox公式情報</li><li>信頼できる報道機関</li><li>本人が公開した発言</li><li>SNS、掲示板、動画などの未確認情報</li></ol></section><section><h2>広告と編集内容</h2><p>現在、このサイトのコードには広告配信・アクセス解析のスクリプトを設置していません。将来導入する場合も、広告やアフィリエイトの有無を明示し、掲載判断と分離します。</p></section><section><h2>関連方針</h2>${cards([["/editorial-policy/","編集・掲載方針","情報区分と記事制作の基準"],["/source-policy/","出典・引用方針","一次情報と引用の扱い"],["/corrections/","訂正・更新方針","誤りを修正する手順"]])}</section>`
  },
  {
    slug: "editorial-policy",
    title: "編集・掲載方針｜GTA6インフォ",
    description: "GTA6インフォが公式確認済み、報道情報、未確認情報、リーク、予測・考察を区別して掲載する基準を説明します。",
    h1: "編集・掲載方針",
    lead: "情報の確度が読者に伝わるよう、記事内の主張を次の区分で整理します。確定情報と予測を同じ表現で混同しません。",
    body: `<section><h2>情報区分</h2><dl class="seo-table"><div><dt>公式確認済み</dt><dd>Rockstar Games、Take-Two Interactive、PlayStation、Xboxなどの公式情報で確認できた内容</dd></div><div><dt>報道情報</dt><dd>信頼できる報道機関が報じているが、公式発表されていない内容</dd></div><div><dt>未確認情報</dt><dd>出所や一次資料を確認できない内容</dd></div><div><dt>予測・考察</dt><dd>公式情報や過去作品を基にした独自の分析</dd></div><div><dt>リーク</dt><dd>公式発表前に外部へ流出した可能性がある情報</dd></div></dl></section><section><h2>記事制作の基準</h2><ul class="seo-list"><li>一次情報を優先し、参照URLを掲載する</li><li>情報の区分と主要出典を明示する</li><li>不明な内容を断定しない</li><li>誤りが分かった場合は訂正する</li><li>他サイトの文章を言い換えただけの記事を作らない</li></ul></section><section><h2>AIの利用</h2><p>文章整理、構成案、校正などにAIを使用する場合があります。掲載前に人間が情報源と内容を確認し、未確認の生成内容をそのまま公開しません。</p></section>`
  },
  {
    slug: "source-policy",
    title: "出典・引用方針｜GTA6インフォ",
    description: "GTA6インフォにおける一次情報、公式リンク、引用、SNS投稿、リーク画像、外部リンクの扱いを説明します。",
    h1: "出典・引用方針",
    lead: "記事の根拠を確認できるよう、公式発表などの一次情報を優先し、引用と独自文章を区別します。",
    body: `<section><h2>出典の優先順位</h2><p>Rockstar Games、Take-Two Interactive、PlayStation、Xboxなどの公式情報を優先します。報道を参照する場合は、元となる一次資料が存在するかを確認します。</p></section><section><h2>引用と画像</h2><ul class="seo-list"><li>引用は必要最小限にし、引用元を明記する</li><li>SNS投稿は削除・修正される可能性を考慮する</li><li>匿名投稿を事実として断定しない</li><li>リーク画像や動画を無断転載しない</li><li>権利者から申し出があった場合は確認のうえ対応する</li></ul></section><section><h2>外部リンク</h2><p>外部サイトの内容や安全性を保証するものではありません。公式サイトを開くリンクは、リンク先が分かる文言で表示します。</p></section>`
  },
  {
    slug: "corrections",
    title: "訂正・更新方針｜GTA6インフォ",
    description: "GTA6インフォが記事の誤り、公式発表による変更、軽微な誤字をどのように訂正・更新するかを説明します。",
    h1: "訂正・更新方針",
    lead: "誤りや新しい公式発表を確認した場合、変更の重要度に応じて本文と内容を修正します。",
    body: `<section><h2>訂正の手順</h2><ol class="seo-steps"><li><strong>根拠を再確認</strong><span>公式発表や一次資料を確認します。</span></li><li><strong>本文を修正</strong><span>誤りと影響範囲を特定して修正します。</span></li><li><strong>変更内容を記録</strong><span>重大な変更は訂正内容を記事内に明示します。</span></li></ol></section><section><h2>修正の区別</h2><p>誤字や表記ゆれなどの軽微な修正と、発売日・対応機種など内容に関わる修正を区別します。情報を削除する場合は、必要に応じて理由を残します。</p></section>`
  },
  {
    slug: "privacy-policy",
    title: "プライバシーポリシー｜GTA6インフォ",
    description: "GTA6インフォにおける個人情報、Cookie、問い合わせ情報、外部リンク、広告・アクセス解析の扱いを説明します。",
    h1: "プライバシーポリシー",
    lead: "このページでは、サイト利用時に取り扱う可能性がある情報と、その利用目的を説明します。",
    body: `<section><h2>現在利用している外部サービス</h2><p>現在、このサイトの公開コードにはGoogle Analytics、広告配信、アフィリエイト用スクリプトを設置していません。導入した場合は、実際の利用内容に合わせてこのページを更新します。</p></section><section><h2>Cookieと端末内データ</h2><p>表示設定などを保存するため、ブラウザのローカルストレージを使用する場合があります。ブラウザ設定から削除できます。</p></section><section><h2>個人情報</h2><p>問い合わせ窓口を設置した場合、返信や本人確認に必要な範囲で名前、メールアドレス、対象URL、問い合わせ内容を扱います。法令に基づく場合を除き、本人の同意なく第三者へ提供しません。</p></section><section><h2>外部リンクと免責</h2><p>外部サイトで行われる情報収集は、リンク先のプライバシーポリシーに従います。当サイトはRockstar GamesおよびTake-Two Interactiveとは関係のない非公式ファンサイトです。</p></section>`
  },
  {
    slug: "contact",
    title: "お問い合わせ｜GTA6インフォ",
    description: "GTA6インフォの記事訂正、著作権・商標、情報提供に関する問い合わせ窓口の案内です。",
    h1: "お問い合わせ",
    lead: "記事訂正、情報提供、著作権・商標に関する連絡先を案内するページです。",
    robots: "noindex,follow",
    body: `<section><h2>お問い合わせ窓口について</h2><p>現在、公開できる送信先とスパム対策の設定が完了していないため、問い合わせフォームは公開していません。連絡先を偽って掲載せず、受信・返信できる窓口を用意した後に公開します。</p></section><section><h2>公開時に受け付ける内容</h2><ul class="seo-list"><li>記事内容の訂正</li><li>情報提供</li><li>著作権・商標に関する連絡</li><li>その他のサイト運営に関する連絡</li></ul></section>`
  },
  {
    slug: "authors/editorial-team",
    title: "GTA6インフォ編集部｜執筆・情報確認",
    description: "GTA6インフォ編集部の役割、記事公開前の確認手順、公式英語情報の整理方法、訂正対応を説明します。",
    h1: "GTA6インフォ編集部",
    lead: "GTA6インフォで記事の執筆と情報確認を担当する編集名義です。実名や経歴を作らず、現在公開できる運営方法と確認手順を明示します。",
    body: `<section><h2>担当する作業</h2><ul class="seo-list"><li>Rockstar Gamesなどの一次情報を確認する</li><li>公式情報、報道、未確認情報、リーク、考察を分類する</li><li>英語原文と日本語記事の固有名詞・日付・数値を照合する</li><li>公開後に公式発表が変わった場合は本文と変更履歴を更新する</li></ul></section><section><h2>公開している運営情報</h2><dl class="seo-table"><div><dt>運営形態</dt><dd>個人運営</dd></div><div><dt>執筆・確認名義</dt><dd>GTA6インフォ編集部</dd></div><div><dt>実名</dt><dd>非公開</dd></div><div><dt>プレイ歴・使用機種</dt><dd>現在未掲載</dd></div><div><dt>外部プロフィール</dt><dd>現在未掲載</dd></div></dl><p class="seo-note">未掲載の経歴や専門性を推測で補いません。追加で公開できる情報が決まった場合に更新します。</p></section><section><h2>訂正について</h2><p>誤りを確認した場合の対応は<a href="/corrections/">訂正・更新方針</a>に従います。訂正依頼と権利関係の連絡先は<a href="/contact/">お問い合わせ</a>で案内します。</p></section>`
  }
];

const releaseUnifiedSections = `<section><h2>最新の変更</h2><ol class="seo-timeline"><li><time datetime="2026-06-25">2026年6月25日</time><div><span class="seo-label official">公式発表</span><h3>予約受付を開始</h3><p>PlayStation 5とXbox Series X|S向け商品の予約受付開始を確認しました。</p></div></li></ol></section><section><h2>公式参照先</h2><ul class="seo-list"><li><a href="https://www.rockstargames.com/VI" target="_blank" rel="noopener noreferrer">Rockstar Games GTA VI公式サイト</a></li><li><a href="https://www.rockstargames.com/newswire" target="_blank" rel="noopener noreferrer">Rockstar Games Newswire</a></li><li><a href="https://store.playstation.com/" target="_blank" rel="noopener noreferrer">PlayStation Store</a></li><li><a href="https://www.xbox.com/games/store" target="_blank" rel="noopener noreferrer">Xbox Store</a></li></ul><p class="seo-note">公式発表、固定の発売情報、購入前の注意をこのページでまとめて更新します。旧「最新情報」「公式発表」URLからもこのページへ移動します。</p></section>`;
const obsoleteReleaseLinks = `<section><h2>関連する公式情報</h2><p>発表元と発表履歴は<a href="/official/">公式発表一覧</a>、新しい変更点は<a href="/news/">最新ニュース</a>で確認できます。</p></section>`;
const aboutTrustSection = `<section><h2>執筆と確認の体制</h2><p>記事は<a href="/authors/editorial-team/">GTA6インフォ編集部</a>名義で執筆と情報確認を行います。固有名詞、日付、数値は公式英語ページと照合し、公式情報、報道、未確認情報、リーク、考察を記事上で区別します。</p><p>運営者の実名、GTAシリーズのプレイ歴、使用機種、外部SNSは現在公開していません。未公開の経歴を作らず、公開できる情報が決まった段階で追記します。</p></section>`;

const articleSlugs = new Set(["release", "characters", "vehicles", "systems", "online", "leaks", "guide"]);
const redirectedSlugs = new Set(["news", "official"]);
const publishedAt = "2026-07-16";
const defaultSources = [["Rockstar Games GTA VI公式サイト", "https://www.rockstargames.com/VI"], ["編集・掲載方針", "/editorial-policy/"]];

function articleMeta(page) {
  if (!articleSlugs.has(page.slug)) return "";
  const sources = page.sources || defaultSources;
  return `<aside class="seo-article-meta" aria-label="記事情報">
    <div><span class="seo-label official">${esc(page.status || "公式情報を優先")}</span></div>
    <p>執筆・確認：<a href="/authors/editorial-team/">GTA6インフォ編集部</a></p>
    <p>主要出典：${sources.map(([name, href]) => `<a href="${href}"${href.startsWith("http") ? ' target="_blank" rel="noopener noreferrer"' : ""}>${esc(name)}</a>`).join("・")}</p>
  </aside>`;
}

function articleFooter(page) {
  if (!articleSlugs.has(page.slug)) return "";
  const canonical = `${ORIGIN}/${page.slug}/`;
  return `<section class="seo-article-footer"><h2>執筆・訂正</h2><dl class="seo-table"><div><dt>執筆・確認</dt><dd><a href="/authors/editorial-team/">GTA6インフォ編集部</a></dd></div><div><dt>訂正依頼</dt><dd><a href="/contact/?type=correction&amp;page=${encodeURIComponent(canonical)}">この記事について連絡する</a></dd></div></dl></section>`;
}

function pageBody(page) {
  return page.body
    .replace(obsoleteReleaseLinks, "")
    .replaceAll('href="/news/"', 'href="/release/"')
    .replaceAll('href="/official/"', 'href="/release/"');
}

function schemaFor(page, canonical) {
  const schemas = [
    { "@context": "https://schema.org", "@type": "WebPage", name: page.h1, description: page.description, url: canonical, inLanguage: "ja", isPartOf: { "@type": "WebSite", name: SITE_NAME, url: `${ORIGIN}/` } },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "ホーム", item: `${ORIGIN}/` },
      { "@type": "ListItem", position: 2, name: page.h1, item: canonical }
    ] }
  ];
  if (articleSlugs.has(page.slug)) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": page.slug === "news" ? "NewsArticle" : "Article",
      headline: page.h1,
      description: page.description,
      datePublished: publishedAt,
      dateModified: publishedAt,
      author: { "@type": "Organization", name: "GTA6インフォ編集部", url: `${ORIGIN}/authors/editorial-team/` },
      publisher: { "@type": "Organization", name: SITE_NAME, url: `${ORIGIN}/` },
      mainEntityOfPage: canonical,
      image: DEFAULT_IMAGE,
      inLanguage: "ja"
    });
  }
  return schemas.map((schema) => `<script type="application/ld+json">${JSON.stringify(schema).replaceAll("<", "\\u003c")}</script>`).join("\n");
}

function pageHTML(page) {
  const canonical = `${ORIGIN}/${page.slug}/`;
  const robots = page.robots || "index,follow,max-image-preview:large";
  const metadata = articleMeta(page);
  return `<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="description" content="${esc(page.description)}">
<meta name="robots" content="${robots}">
<link rel="canonical" href="${canonical}">
<meta property="og:type" content="${articleSlugs.has(page.slug) ? "article" : "website"}">
<meta property="og:locale" content="ja_JP">
<meta property="og:site_name" content="${SITE_NAME}">
<meta property="og:title" content="${esc(page.title)}">
<meta property="og:description" content="${esc(page.description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${DEFAULT_IMAGE}">
<meta property="og:image:alt" content="GTA6インフォのトップページ">
<meta name="twitter:card" content="summary">
<meta name="twitter:title" content="${esc(page.title)}">
<meta name="twitter:description" content="${esc(page.description)}">
<meta name="twitter:image" content="${DEFAULT_IMAGE}">
<title>${esc(page.title.includes(SITE_NAME) ? page.title : `${page.title}｜${SITE_NAME}`)}</title>
<link rel="stylesheet" href="/assets/css/00-tokens-base.css">
<link rel="stylesheet" href="/assets/css/11-seo-static.css">
${schemaFor(page, canonical)}
</head>
<body class="seo-static-page">
<a class="seo-skip" href="#main">本文へ移動</a>
<header class="seo-header"><div class="seo-container seo-header-inner">
  <a class="seo-brand" href="/"><span>G</span><strong>${SITE_NAME}<small>日本語・非公式情報サイト</small></strong></a>
  <nav aria-label="主要メニュー">${nav.map(([href, label]) => `<a href="${href}"${href === `/${page.slug}/` ? ' aria-current="page"' : ""}>${label}</a>`).join("")}</nav>
</div></header>
<main id="main">
  <div class="seo-container">
    <nav class="seo-breadcrumb" aria-label="パンくず"><a href="/">ホーム</a><span aria-hidden="true">›</span><span aria-current="page">${esc(page.h1)}</span></nav>
    <header class="seo-page-hero"><p>GTA6インフォ</p><h1>${esc(page.h1)}</h1><div>${esc(page.lead)}</div></header>
${metadata ? `    ${metadata}\n` : ""}
    <div class="seo-content">${pageBody(page)}${page.slug === "release" ? releaseUnifiedSections : ""}${page.slug === "about" ? aboutTrustSection : ""}${articleFooter(page)}</div>
  </div>
</main>
<footer class="seo-footer"><div class="seo-container seo-footer-grid">
  <div><strong>${SITE_NAME}</strong><p>GTA6の公式情報と未確認情報を分けて整理する非公式ファンサイトです。</p></div>
  <nav aria-label="サイト情報"><a href="/about/">運営者情報</a><a href="/authors/editorial-team/">執筆・確認者</a><a href="/editorial-policy/">編集・掲載方針</a><a href="/source-policy/">出典・引用方針</a><a href="/corrections/">訂正・更新方針</a><a href="/contact/">お問い合わせ</a><a href="/privacy-policy/">プライバシーポリシー</a></nav>
  <p class="seo-disclaimer">当サイトはRockstar GamesおよびTake-Two Interactiveとは関係ありません。ゲーム名、会社名、製品名などは各権利者に帰属します。</p>
</div></footer>
</body>
</html>`;
}

for (const page of pages) {
  const path = join(ROOT, page.slug, "index.html");
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, pageHTML(page), "utf8");
}

const sitemapPaths = [
  "",
  ...pages.filter((page) => !page.robots?.includes("noindex") && !redirectedSlugs.has(page.slug)).map((page) => page.slug),
  "map",
  "map/vice-city",
  "map/leonida-keys",
  "map/grassrivers",
  "map/port-gellhorn",
  "map/ambrosia",
  "map/mount-kalaga"
];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapPaths.map((path) => `  <url><loc>${ORIGIN}/${path ? `${path}/` : ""}</loc><lastmod>2026-07-16</lastmod></url>`).join("\n")}
</urlset>\n`;
await writeFile(join(ROOT, "sitemap.xml"), sitemap, "utf8");

console.log(`Generated ${pages.length} SEO pages.`);
