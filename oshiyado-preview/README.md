# 推し宿 本番候補 Preview

このブランチ `oshiyado-production` は、推し宿の本番候補を安全に確認するためのPreview用です。

- 本番ドメイン想定: https://mainitiworakunisuru.com
- Previewは `noindex, nofollow`
- 既存 `main` は変更しない
- 切替前バックアップ: `backup-before-oshiyado-20260912`
- ホテルデータ原本: 本番候補ZIPの `data/hotels.json`

## 本番切替前の必須確認

1. 公開する運営者名または屋号
2. 公開連絡先（メールアドレスまたは問い合わせURL）
3. 楽天・じゃらんのアフィリエイトURL
4. `python validate-production.py` のERROR 0確認
5. `python release.py --prepare` 実行後のrobots / sitemap / canonical確認
6. Previewでトップ・一覧・ホテル詳細・法務ページ・404を確認

本番切替時にのみ `publicationReady` を有効化し、robotsのクロール許可とsitemap公開を行うこと。
