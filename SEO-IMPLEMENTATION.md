# SEO基盤 実装・運用メモ

## 現在の構成

- フレームワーク: なし（静的HTML・CSS・JavaScript）
- ルーティング: Vercel Routes、トップの補助機能のみハッシュルーター
- レンダリング: トップは初期HTMLとCSR、主要カテゴリ・固定ページ・地域ページは静的HTML
- CMS: 既存連携を維持。今回のSEO基盤対応ではAPI、環境変数、取得処理、データ構造を変更していない

## index対象URL

- `/`
- `/news/`
- `/official/`
- `/category/`
- `/release/`
- `/characters/`
- `/vehicles/`
- `/systems/`
- `/online/`
- `/leaks/`
- `/guide/`
- `/about/`
- `/editorial-policy/`
- `/source-policy/`
- `/corrections/`
- `/privacy-policy/`
- `/map/`
- `/map/vice-city/`
- `/map/leonida-keys/`
- `/map/grassrivers/`
- `/map/port-gellhorn/`
- `/map/ambrosia/`
- `/map/mount-kalaga/`

`/contact/`は送信先とスパム対策が未設定のため、ページは存在するが`noindex,follow`とし、サイトマップには含めない。

## HTTPとcanonical

- index対象ページは自己参照canonical
- 主要ディレクトリの末尾スラッシュなしURLは、末尾スラッシュありへ308転送
- `/index.html`は`/`へ308転送
- 存在しない地域URLは404
- その他の削除済み・未定義URLは410と`X-Robots-Tag: noindex, follow`
- 無関係な旧URLをトップへ転送しない

## 構造化データ

- トップ: `WebSite`、`Organization`
- 主要下層ページ: `WebPage`、`BreadcrumbList`
- 地域詳細: `Article`、`BreadcrumbList`

存在しないロゴ、SNS、著者名、画像URLは構造化データへ追加しない。

## サイトマップ

`node scripts/generate-seo-pages.mjs`で主要静的ページと`sitemap.xml`を再生成する。

サイトマップには、200を返すindex対象のcanonical URLだけを含める。検索、API、contact、404、410、リダイレクトは含めない。

地域ページを変更した場合は、続けて次を実行する。

```powershell
node scripts/generate-map-pages.mjs
```

## 確認コマンド

```powershell
node scripts/generate-seo-pages.mjs
node scripts/generate-map-pages.mjs
Get-ChildItem assets/js -Recurse -Filter *.js | ForEach-Object { node --check $_.FullName }
node --check scripts/generate-seo-pages.mjs
node --check scripts/generate-map-pages.mjs
[xml](Get-Content sitemap.xml -Raw -Encoding UTF8) | Out-Null
```

公開後は、`/`、主要カテゴリ、方針ページ、地域ページ、存在しないURLのHTTPステータスを確認する。

## Search Consoleで行う作業

1. ドメインプロパティが確認済みか確認する
2. `https://mainitiworakunisuru.com/sitemap.xml`を送信する
3. トップ、`/news/`、`/official/`、`/release/`、`/map/`をURL検査する
4. 「クロール済み - インデックス未登録」と「検出 - インデックス未登録」を確認する
5. 旧サイトURLが残る場合は、実際の応答が404または410か確認する
6. 重複ページとGoogleが選択したcanonicalを確認する
7. 手動対策とセキュリティ問題を確認する

## 未対応・管理者入力待ち

- 問い合わせの受信先とCloudflare Turnstileなどのスパム対策
- 公開できる運営者ペンネーム、経歴、担当分野
- 権利を確認した共通OGP画像とロゴ画像
- 実際にアクセス解析・広告を導入した場合のプライバシーポリシー更新
- CMS記事のArticle/NewsArticle構造化データ、公開日、更新履歴、著者情報（CMSを変更しない指定のため対象外）

