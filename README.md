# Spice Of VRinks 特設サイト

VRChatイベント「Spice Of VRinks」の特設サイトです。GitHub Pagesでの公開を想定した静的サイト構成になっています。

https://spice-of.github.io/VRinks/

## ファイル構成

- `index.html` … ページ本体
- `styles.css` … デザイン
- `script.js` … CSV読み込み・描画などの挙動
- `config.js` … **編集用の設定ファイル**(基本的にはここだけ触れば運用できます)
- `assets/` … ロゴ・バナーなど画像を置く場合に使用

## まず編集するところ(config.js)

1. `eventDateRangeLabel` … ヒーローに大きく表示する開催期間の文言。
2. `groupJoinUrl` … 参加するVRChatグループのページURL。
3. `xUrl` … フッターのXリンク。
4. `csv.about` / `csv.schedule` / `csv.news` / `csv.supporters` … 各コンテンツのデータ元。

## コンテンツはすべてGoogleスプレッドシートで管理できます

概要・タイムスケジュール・最新情報・応援団体、**サイトの内容はすべて** Googleスプレッドシートから読み込むようになっています。文章や画像を差し替えたいときは、コードを触らずスプレッドシートを更新するだけでOKです。

1. Googleスプレッドシートで `about` / `schedule` / `news` / `supporters` をそれぞれ別シートで用意する
2. 「ファイル」→「共有」→「ウェブに公開」で該当シートを **CSV形式** で公開する
3. 発行されたURLを `config.js` の `csv.*` に貼り付ける

各シートの列構成(1行目はヘッダー行にしてください):

| シート | 列 |
|---|---|
| 概要 (about) | `lead`, `body`, `card1_title`, `card1_text`, `card2_title`, `card2_text`, `card3_title`, `card3_text` |
| タイムスケジュール (schedule) | `date`, `weekday`, `start_time`, `end_time`, `venue` |
| 最新情報 (news) | `date`, `text`, `link_url`, `x_post_url` |
| 応援団体 (supporters) | `name`, `banner_url`, `link_url` |

### about シートについて

**1行だけ**入力すれば反映されます(1団体1行ではなく、サイト全体で1行)。`card2_title`〜`card3_text` は使わない場合は空欄でOKです(その分のカードは表示されません)。

### news シートについて

- `x_post_url` にXの投稿URL(例: `https://x.com/ユーザー名/status/12345`)を入れると、そのポストがそのまま埋め込み表示されます。
- `x_post_url` が空欄の行は、`date` + `text` のシンプルな告知として表示されます。
- 1行につき、テキスト告知かXポストのどちらか一方を選んで入力してください。

### supporters シートについて

`banner_url` に横長のバナー画像URLを入れてください。`link_url` を入れると、バナーがそのままリンクになります。

### 登壇団体・MC・コメンテーターについて

現時点では未確定のため、サイトには表示していません。決まり次第、あらためて組み込みます(ページ構成自体はすでに用意してあるので、データが揃えばすぐに反映できます)。

`csv.*` を空欄のままにしておくと、`config.js` 内の `FALLBACK_*` のサンプルデータが代わりに表示されます。実データが決まるまでの確認用にお使いください。

## GitHub Pagesでの公開

1. このフォルダの中身をリポジトリの直下(または `/docs` フォルダ)にそのままコミット
2. リポジトリの Settings → Pages で公開ブランチ・フォルダを指定
3. 数分後に公開URLが発行されます

## デザインについて

紙色の背景・藍色のアクセント・和文セリフ(Shippori Mincho)+ゴシック(Noto Sans JP)の組み合わせによるナチュラル/ミニマル路線にしています。端末が強制ダークモードになっている場合は、自動で読みやすい配色に切り替わります。カラーやフォントを変えたい場合は `styles.css` 冒頭の `:root` 内の変数を書き換えるだけで全体に反映されます。
