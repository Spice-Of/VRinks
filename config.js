/* =========================================================
   Spice Of VRinks — サイト設定ファイル
   ここだけ書き換えれば、日付・リンク・データソースが反映されます。
   ========================================================= */

const SITE_CONFIG = {

  // ヒーローに大きく表示する開催期間の文言
  eventDateRangeLabel: "2026年11月27日(金)〜11月29日(日)",

  // 参加するVRChatグループのページURL
  groupJoinUrl: "https://vrc.group/SSC.6137",

  // X (Twitter) のプロフィールURL（フッター用）
  xUrl: "https://x.com/SpiceOfVRinks?s=20",

  // ページ全体の背景に敷く画像のURL（空欄なら無地の紺色背景のまま）
  // 画像の上には読みやすさのため紺色の半透明グラデーションを重ねています
  backgroundImageUrl: "Pic/Untitled_Design_24.png",

  /* ---------------------------------------------------------
     データソース（Googleスプレッドシート「ウェブに公開」→CSV）
     スプレッドシート側で「ファイル > 共有 > ウェブに公開」から
     該当シートをCSV形式で公開し、そのURLをここに貼ってください。
     未設定の間はサンプルデータ（下記 FALLBACK_*）が表示されます。
     --------------------------------------------------------- */
  csv: {
    about:      "https://docs.google.com/spreadsheets/d/e/2PACX-1vTHHdMeUs2rz-M8O547RDUbWaqyMJ5YLzKgNWRWNPX5R7gDWBBSsK6PS-4b6k-KyCUZIYFaj9PuVkE6/pub?gid=0&single=true&output=csv", // 概要シートのCSV公開URL（1行だけのシート）
    schedule:   "https://docs.google.com/spreadsheets/d/e/2PACX-1vTHHdMeUs2rz-M8O547RDUbWaqyMJ5YLzKgNWRWNPX5R7gDWBBSsK6PS-4b6k-KyCUZIYFaj9PuVkE6/pub?gid=867582881&single=true&output=csv", // タイムスケジュールシートのCSV公開URL
    news:       "https://docs.google.com/spreadsheets/d/e/2PACX-1vTHHdMeUs2rz-M8O547RDUbWaqyMJ5YLzKgNWRWNPX5R7gDWBBSsK6PS-4b6k-KyCUZIYFaj9PuVkE6/pub?gid=2040822935&single=true&output=csv", // 最新情報シートのCSV公開URL
    supporters: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTHHdMeUs2rz-M8O547RDUbWaqyMJ5YLzKgNWRWNPX5R7gDWBBSsK6PS-4b6k-KyCUZIYFaj9PuVkE6/pub?gid=359879489&single=true&output=csv", // 応援団体シートのCSV公開URL
  },

  /* ---------------------------------------------------------
     各シートの想定カラム構成（1行目はヘッダー）

     ■ about（概要）※1行だけ入力すればOK
       hero_lede,lead, body,
       card1_title, card1_text,
       card2_title, card2_text,
       card3_title, card3_text
       - card2/card3 は使わない場合は空欄でよい（その分は表示されません）

     ■ schedule（タイムスケジュール・簡易版）
       date, weekday, start_time, end_time, venue
       - date は「11月27日」のように表示用の文字列でOK
       - weekday は「金」「土」などの曜日1文字

     ■ news（最新情報）
       date, text, link_url, x_post_url
       - x_post_url にXの投稿URL（例: https://x.com/xxx/status/12345）を入れると
         そのポストがそのまま埋め込み表示されます
       - x_post_url が空欄の行は、date + text のシンプルな告知として表示されます

     ■ supporters（応援団体）
       name, banner_url, link_url
       - banner_url はバナー画像のURL（横長画像推奨）
     --------------------------------------------------------- */
};

/* ===========================================================
   フォールバック用サンプルデータ
   CSV未接続時や読み込み失敗時に表示されます。
   実データが揃うまでの確認用に、内容は自由に書き換えてください。
   =========================================================== */

const FALLBACK_ABOUT = {
  hero_lede: "VRChatで活動する団体が持ち回りで登壇し、それぞれが育ててきた "スパイス" ―― 個性やこだわり ―― を持ち寄って紹介する会。 知らなかったコミュニティに出会う、VR団体見本市です。",
  lead: "Spice Of VRinks は、VRChat上でイベントやコミュニティ運営を続ける団体が登壇し、自分たちの活動を自分たちの言葉で紹介するイベントです。",
  body: "大きなワールドで開催される華やかなイベントも、少人数でじっくり続く集まりも、どれも誰かが試行錯誤しながら育ててきた\u201cスパイス\u201dです。普段は交わらないコミュニティ同士が同じ舞台に立つことで、参加者にとっては新しい行き先を見つけるきっかけに、団体にとっては互いを知るきっかけになることを目指しています。",
  card1_title: "登壇形式", card1_text: "各会場で持ち時間の中、団体が自身のイベントやコミュニティの魅力を紹介します。詳細は決まり次第お知らせします。",
  card2_title: "対象",   card2_text: "VRChatに関わる全ての人。登壇団体側も、観覧する側も歓迎です。",
  card3_title: "会場",   card3_text: "VRChat内の特設ワールドにて開催。詳細は開催当日までに告知します。",
};

const FALLBACK_SCHEDULE = [
  { date: "11月27日", weekday: "金", start_time: "21:00", end_time: "22:00", venue: "第1会場" },
  { date: "11月27日", weekday: "金", start_time: "22:00", end_time: "23:00", venue: "第2会場" },
  { date: "11月27日", weekday: "金", start_time: "23:00", end_time: "24:00", venue: "第3会場" },

  { date: "11月28日", weekday: "土", start_time: "20:00", end_time: "21:00", venue: "第4会場" },
  { date: "11月28日", weekday: "土", start_time: "21:00", end_time: "22:00", venue: "第5会場" },
  { date: "11月28日", weekday: "土", start_time: "22:00", end_time: "23:00", venue: "第6会場" },
  { date: "11月28日", weekday: "土", start_time: "23:00", end_time: "24:00", venue: "第7会場" },

  { date: "11月29日", weekday: "日", start_time: "19:00", end_time: "20:00", venue: "第8会場" },
  { date: "11月29日", weekday: "日", start_time: "20:00", end_time: "21:00", venue: "第9会場" },
  { date: "11月29日", weekday: "日", start_time: "21:00", end_time: "22:00", venue: "第10会場" },
];

const FALLBACK_NEWS = [
  { date: "2026.09.15", text: "特設サイトを公開しました。", link_url: "", x_post_url: "" },
  { date: "2026.09.07", text: "開催期間を掲載しました。詳細はタイムスケジュールをご確認ください。", link_url: "", x_post_url: "" },
];

const FALLBACK_SUPPORTERS = [
  { name: "応援団体募集中", banner_url: "", link_url: "#" },
  { name: "応援団体募集中", banner_url: "", link_url: "#" },
  { name: "応援団体募集中", banner_url: "", link_url: "#" },
];
