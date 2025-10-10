# INanim0、、 – ALL-IN-ONE（注釈付き）

## すぐ触る場所
- `index.html`
  - NEWSの li を上に追加
  - MUSICの `<figure data-key="...">` を追加（鍵は app.js の `musicData` と一致）
- `app.js`
  - `musicData` の各リンクURLを実データに置換
- `assets/`
  - `neanion.jpg` `numbness.jpg` `seiryo.jpg` `og.jpg` などを差し替え
  - `logo_src.png` は提供画像（このzip内の `assets/logo_src.png`）

## デプロイ
- Netlify / Vercel にフォルダをドラッグ＆ドロップ
- ルーティングはハッシュ（#）なのでサーバ設定不要

## デザインを変更したいとき
- `:root` の色変数をいじる（配色の一括変更）
- グローを弱める → `--glow` の半径調整
- ノイズを消す → `body::before` のブロックを削除
