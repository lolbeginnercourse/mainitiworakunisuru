import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const ORIGIN = "https://mainitiworakunisuru.com";
const SITE_NAME = "GTA6インフォ";

const nav = [
  ["/", "ホーム"],
  ["/news/", "最新情報"],
  ["/official/", "公式発表"],
  ["/category/", "情報カテゴリ"],
  ["/map/", "舞台・地域"],
  ["/vehicles/", "登場車両"]
];

const categoryLinks = [
  ["/news/", "最新情報", "新しい公式発表や確認内容の入口"],
  ["/official/", "公式発表", "一次情報で確認できた内容"],
  ["/release/", "発売・商品情報", "発売日、対応機種、予約、必要容量"],
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
    title: "GTA6最新情報｜公式発表と確認状況",
    description: "GTA6の発売日、対応機種、人物、舞台などの最新情報を、公式確認済み・公式未発表・未確認情報に分けて整理します。",
    h1: "GTA6の最新情報",
    lead: "GTA6に関する新しい発表や変更点を、情報の確度が分かる形で確認するためのページです。公式情報はRockstar Gamesなどの一次情報を優先し、報道、リーク、予測とは分けて扱います。",
    body: `<section><h2>現在の重要情報</h2>${facts}</section><section><h2>情報の入口</h2>${cards(categoryLinks.slice(1, 6))}</section><section><h2>確認時の注意</h2><p>公開日が新しいだけでは最新情報とは限りません。記事内の情報確認日と出典を確認し、公式発表後に内容が変わった場合は訂正方針に沿って更新します。</p></section>`
  },
  {
    slug: "official",
    title: "GTA6公式発表まとめ｜発売日・人物・舞台",
    description: "Rockstar Games、Take-Two Interactive、PlayStation、Xboxの公式情報で確認できるGTA6の発売日、人物、舞台を整理します。",
    h1: "GTA6の公式発表まとめ",
    lead: "このページでは公式サイト、公式Newswire、各プラットフォームの公式ストアで確認できる情報を優先します。映像から推測した内容や匿名投稿は、公式発表として扱いません。",
    body: `<section><h2>公式に確認できる主要情報</h2>${facts}</section><section><h2>公式参照先</h2><ul class="seo-list"><li><a href="https://www.rockstargames.com/VI" target="_blank" rel="noopener noreferrer">Rockstar Games GTA VI公式サイト</a></li><li><a href="https://www.rockstargames.com/newswire" target="_blank" rel="noopener noreferrer">Rockstar Games Newswire</a></li></ul></section><section><h2>関連ページ</h2>${cards([["/release/","発売・商品情報","発売日、対応機種、予約を確認"],["/characters/","登場人物","公式公開された人物を確認"],["/map/","舞台・地域","公式公開された地域を確認"]])}</section>`
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
    title: "GTA6発売日・対応機種・予約情報",
    description: "GTA6の発売予定日、PS5・Xbox Series X|S対応、PC版の発表状況、予約、価格、必要容量を公式情報優先で整理します。",
    h1: "GTA6の発売・商品情報",
    lead: "購入前に確認したい発売日、対応機種、予約状況をまとめています。未発表の容量やPC版情報は推測で確定せず、公式発表があるまで未発表として表示します。",
    body: `<section><h2>現在確認できる情報</h2>${facts}</section><section><h2>購入前に確認すること</h2><ul class="seo-list"><li>PS5またはXbox Series X|S向けの商品であること</li><li>正式な必要容量は未発表であること</li><li>予約特典や自動更新条件を購入画面で確認すること</li><li>パッケージ商品の収録形式を販売店ページで確認すること</li></ul></section><section><h2>公式情報の確認先</h2><p><a href="/official/">GTA6の公式発表まとめ</a>から、Rockstar Games公式サイトと公式Newswireへの参照先を確認できます。</p></section>`
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
    title: "GTA6登場車両情報｜公式映像の確認状況",
    description: "GTA6の登場車両について、公式名称が確認できる情報と、映像で存在のみ確認できる車両を分けて整理します。",
    h1: "GTA6の登場車両情報",
    lead: "発売前は、公式名称や性能が発表された車両と、公式映像で存在だけを確認できる車両を区別します。速度、価格、改造内容など、実プレイが必要な情報は発売後に確認します。",
    body: `<section><h2>発売前の確認方針</h2><ul class="seo-list"><li>公式名称がある車両は出典と一緒に掲載</li><li>映像だけで確認した車両は車種名を断定しない</li><li>速度、価格、入手条件は発売後に検証</li><li>現実の車種との類似は考察として分離</li></ul></section><section><h2>関連情報</h2>${cards([["/official/","公式発表","一次情報を確認"],["/systems/","ゲームシステム","車両を含むシステム情報"],["/map/","舞台・地域","車両が登場する地域"]])}</section>`
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
    body: `<section><h2>情報区分</h2><dl class="seo-table"><div><dt>公式確認済み</dt><dd>Rockstar Games、Take-Two Interactive、PlayStation、Xboxなどの公式情報で確認できた内容</dd></div><div><dt>報道情報</dt><dd>信頼できる報道機関が報じているが、公式発表されていない内容</dd></div><div><dt>未確認情報</dt><dd>出所や一次資料を確認できない内容</dd></div><div><dt>予測・考察</dt><dd>公式情報や過去作品を基にした独自の分析</dd></div><div><dt>リーク</dt><dd>公式発表前に外部へ流出した可能性がある情報</dd></div></dl></section><section><h2>記事制作の基準</h2><ul class="seo-list"><li>一次情報を優先し、参照URLを掲載する</li><li>情報確認日を明示する</li><li>不明な内容を断定しない</li><li>誤りが分かった場合は訂正する</li><li>他サイトの文章を言い換えただけの記事を作らない</li></ul></section><section><h2>AIの利用</h2><p>文章整理、構成案、校正などにAIを使用する場合があります。掲載前に人間が情報源と内容を確認し、未確認の生成内容をそのまま公開しません。</p></section>`
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
    lead: "誤りや新しい公式発表を確認した場合、変更の重要度に応じて本文と更新内容を修正します。更新していない記事の日付だけを変更しません。",
    body: `<section><h2>訂正の手順</h2><ol class="seo-steps"><li><strong>根拠を再確認</strong><span>公式発表や一次資料を確認します。</span></li><li><strong>本文を修正</strong><span>誤りと影響範囲を特定して修正します。</span></li><li><strong>変更内容を記録</strong><span>重大な変更は訂正内容を記事内に明示します。</span></li></ol></section><section><h2>修正の区別</h2><p>誤字や表記ゆれなどの軽微な修正と、発売日・対応機種など内容に関わる修正を区別します。情報を削除する場合は、必要に応じて理由を残します。</p></section>`
  },
  {
    slug: "privacy-policy",
    title: "プライバシーポリシー｜GTA6インフォ",
    description: "GTA6インフォにおける個人情報、Cookie、問い合わせ情報、外部リンク、広告・アクセス解析の扱いを説明します。",
    h1: "プライバシーポリシー",
    lead: "このページでは、サイト利用時に取り扱う可能性がある情報と、その利用目的を説明します。",
    body: `<section><h2>現在利用している外部サービス</h2><p>現在、このサイトの公開コードにはGoogle Analytics、広告配信、アフィリエイト用スクリプトを設置していません。導入した場合は、実際の利用内容に合わせてこのページを更新します。</p></section><section><h2>Cookieと端末内データ</h2><p>表示設定などを保存するため、ブラウザのローカルストレージを使用する場合があります。ブラウザ設定から削除できます。</p></section><section><h2>個人情報</h2><p>問い合わせ窓口を設置した場合、返信や本人確認に必要な範囲で名前、メールアドレス、対象URL、問い合わせ内容を扱います。法令に基づく場合を除き、本人の同意なく第三者へ提供しません。</p></section><section><h2>外部リンクと免責</h2><p>外部サイトで行われる情報収集は、リンク先のプライバシーポリシーに従います。当サイトはRockstar GamesおよびTake-Two Interactiveとは関係のない非公式ファンサイトです。</p></section><section><h2>制定・改定</h2><p>制定日：2026年7月16日</p></section>`
  },
  {
    slug: "contact",
    title: "お問い合わせ｜GTA6インフォ",
    description: "GTA6インフォの記事訂正、著作権・商標、情報提供に関する問い合わせ窓口の案内です。",
    h1: "お問い合わせ",
    lead: "記事訂正、情報提供、著作権・商標に関する連絡先を案内するページです。",
    robots: "noindex,follow",
    body: `<section><h2>お問い合わせ窓口について</h2><p>現在、公開できる送信先とスパム対策の設定が完了していないため、問い合わせフォームは公開していません。連絡先を偽って掲載せず、受信・返信できる窓口を用意した後に公開します。</p></section><section><h2>公開時に受け付ける内容</h2><ul class="seo-list"><li>記事内容の訂正</li><li>情報提供</li><li>著作権・商標に関する連絡</li><li>その他のサイト運営に関する連絡</li></ul></section>`
  }
];

function schemaFor(page, canonical) {
  const schemas = [
    { "@context": "https://schema.org", "@type": "WebPage", name: page.h1, description: page.description, url: canonical, inLanguage: "ja", isPartOf: { "@type": "WebSite", name: SITE_NAME, url: `${ORIGIN}/` } },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "ホーム", item: `${ORIGIN}/` },
      { "@type": "ListItem", position: 2, name: page.h1, item: canonical }
    ] }
  ];
  return schemas.map((schema) => `<script type="application/ld+json">${JSON.stringify(schema).replaceAll("<", "\\u003c")}</script>`).join("\n");
}

function pageHTML(page) {
  const canonical = `${ORIGIN}/${page.slug}/`;
  const robots = page.robots || "index,follow,max-image-preview:large";
  return `<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="description" content="${esc(page.description)}">
<meta name="robots" content="${robots}">
<link rel="canonical" href="${canonical}">
<meta property="og:type" content="website">
<meta property="og:locale" content="ja_JP">
<meta property="og:site_name" content="${SITE_NAME}">
<meta property="og:title" content="${esc(page.title)}">
<meta property="og:description" content="${esc(page.description)}">
<meta property="og:url" content="${canonical}">
<meta name="twitter:card" content="summary">
<meta name="twitter:title" content="${esc(page.title)}">
<meta name="twitter:description" content="${esc(page.description)}">
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
    <div class="seo-content">${page.body}</div>
  </div>
</main>
<footer class="seo-footer"><div class="seo-container seo-footer-grid">
  <div><strong>${SITE_NAME}</strong><p>GTA6の公式情報と未確認情報を分けて整理する非公式ファンサイトです。</p></div>
  <nav aria-label="サイト情報"><a href="/about/">運営者情報</a><a href="/editorial-policy/">編集・掲載方針</a><a href="/source-policy/">出典・引用方針</a><a href="/corrections/">訂正・更新方針</a><a href="/privacy-policy/">プライバシーポリシー</a></nav>
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
  ...pages.filter((page) => !page.robots?.includes("noindex")).map((page) => page.slug),
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
