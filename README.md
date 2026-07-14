# GTA6 GUIDE JAPAN 分離版

未発売段階のGTA6情報サイトを、編集しやすいようにHTML・CSS・JavaScript・データ・画面描画へ分離した構成です。

## 起動方法

`index.html` をブラウザで開いてください。外部ライブラリやビルド処理は不要です。

## 構成

- `index.html`：ヘッダー、ドロワー、フッター、下部ナビなど共通HTML
- `assets/css/00-tokens-base.css`：色、余白、基本スタイル
- `assets/css/01-header-drawer.css`：ヘッダーとメニュー
- `assets/css/02-controls-cards.css`：検索、ボタン、カード
- `assets/css/03-shell-home-article.css`：トップ、記事、DB画面
- `assets/css/04-responsive-core.css`：基本レスポンシブ
- `assets/css/05-mobile-preview.css`：スマホ幅プレビュー
- `assets/css/06-mobile-refinements.css`：スマホUI詳細
- `assets/css/07-page-components.css`：補助ページとフォーム
- `assets/css/08-release-mode.css`：発売前モード専用UI
- `assets/js/data/icons.js`：SVGアイコン
- `assets/js/data/content.js`：記事、カテゴリ、地域、人物等のデータ
- `assets/js/ui/templates.js`：共通カード・見出し生成
- `assets/js/pages/home.js`：トップページ
- `assets/js/pages/content-pages.js`：その他の各画面
- `assets/js/core/drawer.js`：ドロワー制御
- `assets/js/core/router.js`：画面遷移
- `assets/js/core/page-events.js`：検索、絞り込み、フォーム
- `assets/js/app.js`：サイト起動
- `single-file-backup.html`：分離前の単体HTMLバックアップ

## 主な編集場所

- トップの4アイコン：`assets/js/pages/home.js`
- リークカテゴリの文言：`assets/js/data/content.js`
- 記事本文：`assets/js/data/content.js`
- 色や角丸：`assets/css/00-tokens-base.css`
- スマホ表示：`assets/css/05-mobile-preview.css` と `06-mobile-refinements.css`
- ルート追加：`assets/js/core/router.js`

## 注意

JavaScriptはブラウザで直接開けるよう、ES Modulesではなく読み込み順を固定した通常スクリプトで分離しています。`index.html`内のscript順は変更しないでください。
