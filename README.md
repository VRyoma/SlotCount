# SlotCount

スロットの小役カウンターWebアプリ。C・チェリー・ブドウ・BAR・7の5種類の出現回数と回転数を記録し、出現確率（1/n）を自動計算します。小役を3列2行、回転数を画面下部に配置したシンプルなUIで、スマホの縦向き・横向きどちらでも使えます。

## 使い方

`index.html` をそのまま開くだけで動作します（ビルド不要の静的サイト）。データは端末のlocalStorageに保存されるため、リロードしても記録は消えません。

- 回転数: `+1` / `+10` / `-1` で調整
- 各小役: `+1` / `-1` で調整
- 確率は 回転数 ÷ 出現回数 で「1/xxx.x」形式表示
- 「リセット」ですべてのカウントを0に戻せます（確認あり）

## Cloudflareへのデプロイ

静的ファイルのみのサイトなのでビルドコマンドは不要です。`wrangler.toml` に `[assets]` を設定済みなので、Cloudflareの新しい「Workers」Git連携（デプロイコマンドが `wrangler deploy` になるタイプ）でも、従来の「Pages」プロジェクトでもそのままデプロイできます。

### CloudflareダッシュボードでGitHub連携する場合

1. Cloudflareダッシュボードでこのリポジトリを接続
2. ビルドコマンド: なし（空欄）
3. デプロイコマンド:
   - 「Workers」タイプのプロジェクト: `npx wrangler deploy`（デフォルトのままでOK）
   - 「Pages」タイプのプロジェクト: `npx wrangler pages deploy .`
   - ビルド出力ディレクトリを聞かれた場合は `/`

### Wrangler CLIで直接デプロイする場合

```sh
# Workersとしてデプロイ（静的アセットのみ）
npx wrangler deploy

# もしくはPagesとしてデプロイ
npx wrangler pages deploy .
```
