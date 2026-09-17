/* =========================================================
   Spice Of VRinks — script.js
   CSV読み込み / 動的描画
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  applyLinks();
  loadAbout();
  loadSchedule();
  loadNews();
  loadSupporters();
  document.getElementById("footer-year").textContent = new Date().getFullYear();
});

/* ---------------- リンク・開催期間の反映 ---------------- */
function applyLinks() {
  const joinLinks = [
    document.getElementById("group-join-link"),
    document.getElementById("group-join-link-2"),
  ];
  joinLinks.forEach((el) => el && (el.href = SITE_CONFIG.groupJoinUrl));

  const xLink = document.getElementById("footer-x-link");
  if (xLink) xLink.href = SITE_CONFIG.xUrl;

  const groupLink = document.getElementById("footer-group-link");
  if (groupLink) groupLink.href = SITE_CONFIG.groupJoinUrl;

  const periodEl = document.getElementById("hero-period-range");
  if (periodEl && SITE_CONFIG.eventDateRangeLabel) {
    periodEl.textContent = SITE_CONFIG.eventDateRangeLabel;
  }

  const bgPhoto = document.getElementById("bg-photo");
  if (bgPhoto && SITE_CONFIG.backgroundImageUrl) {
    bgPhoto.style.backgroundImage = `url("${SITE_CONFIG.backgroundImageUrl}")`;
  }
}

/* ---------------- CSV読み込み共通処理 ---------------- */
function loadCsv(url, onSuccess, onFallback) {
  if (!url) {
    onFallback();
    return;
  }
  Papa.parse(url, {
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: (results) => {
      if (!results.data || results.data.length === 0) {
        onFallback();
        return;
      }
      onSuccess(results.data);
    },
    error: () => onFallback(),
  });
}

/* ---------------- 概要 ---------------- */
function loadAbout() {
  loadCsv(
    SITE_CONFIG.csv.about,
    (rows) => renderAbout(rows[0] || {}),
    () => renderAbout(FALLBACK_ABOUT)
  );
}

function renderAbout(data) {
  const heroLedeEl = document.getElementById("hero-lede");
  if (heroLedeEl && data.hero_lede) heroLedeEl.textContent = data.hero_lede;

  const leadEl = document.getElementById("about-lead");
  const bodyEl = document.getElementById("about-body");
  if (leadEl) leadEl.textContent = data.lead || "";
  if (bodyEl) bodyEl.textContent = data.body || "";

  const grid = document.getElementById("about-grid");
  grid.innerHTML = "";

  [1, 2, 3].forEach((n) => {
    const title = data[`card${n}_title`];
    const text = data[`card${n}_text`];
    if (!title && !text) return;
    const card = document.createElement("div");
    card.className = "about-card";
    card.innerHTML = `<h3>${escapeHtml(title || "")}</h3><p>${escapeHtml(text || "")}</p>`;
    grid.appendChild(card);
  });
}

/* ---------------- タイムスケジュール（簡易） ---------------- */
function loadSchedule() {
  loadCsv(
    SITE_CONFIG.csv.schedule,
    (rows) => {
      renderHeroDays(rows);
      renderScheduleDetail(rows);
    },
    () => {
      renderHeroDays(FALLBACK_SCHEDULE);
      renderScheduleDetail(FALLBACK_SCHEDULE);
    }
  );
}

/* 日付ごとにグループ化するユーティリティ（登場順を維持） */
function groupByDate(rows) {
  const days = [];
  const dayIndex = {};
  rows.forEach((row) => {
    const key = row.date || "";
    if (!(key in dayIndex)) {
      dayIndex[key] = days.length;
      days.push({ date: key, weekday: row.weekday || "", rows: [] });
    }
    days[dayIndex[key]].rows.push(row);
  });
  return days;
}

/* ヒーロー内：開催期間に紐づく日程サマリー（日付・その日の時間帯・会場一覧） */
function renderHeroDays(rows) {
  const container = document.getElementById("hero-days");
  container.innerHTML = "";

  const days = groupByDate(rows);

  days.forEach((day) => {
    const starts = day.rows.map((r) => r.start_time).filter(Boolean).sort();
    const ends = day.rows.map((r) => r.end_time).filter(Boolean).sort();
    const start = starts[0] || "";
    const end = ends[ends.length - 1] || "";
    const timeRange = start && end ? `${escapeHtml(start)}〜${escapeHtml(end)}` : "";
    const venueList = day.rows.map((r) => r.venue).filter(Boolean).join("・");

    const el = document.createElement("div");
    el.className = "hero-day";
    el.innerHTML = `
      <p class="hero-day-date">${escapeHtml(day.date)}${day.weekday ? `<span>(${escapeHtml(day.weekday)})</span>` : ""}</p>
      ${timeRange ? `<p class="hero-day-time">${timeRange}</p>` : ""}
      ${venueList ? `<p class="hero-day-venues">${escapeHtml(venueList)}</p>` : ""}
    `;
    container.appendChild(el);
  });
}

/* 詳細タイムスケジュール（日付ごと・会場+時間のみのシンプル表示） */
function renderScheduleDetail(rows) {
  const container = document.getElementById("schedule-detail");
  container.innerHTML = "";

  const days = groupByDate(rows);

  days.forEach((day) => {
    const dayEl = document.createElement("div");
    dayEl.className = "schedule-day-block";

    const slotsHtml = day.rows
      .map((row) => {
        const timeRange =
          row.start_time && row.end_time
            ? `${escapeHtml(row.start_time)}–${escapeHtml(row.end_time)}`
            : escapeHtml(row.start_time || "");
        return `
        <li class="schedule-slot">
          <span class="slot-time">${timeRange}</span>
          <span class="slot-venue">${escapeHtml(row.venue || "")}</span>
        </li>`;
      })
      .join("");

    dayEl.innerHTML = `
      <h3 class="schedule-day-heading">${escapeHtml(day.date)}${day.weekday ? `<span class="schedule-day-weekday">(${escapeHtml(day.weekday)})</span>` : ""}</h3>
      <ul class="schedule-slots">${slotsHtml}</ul>
    `;
    container.appendChild(dayEl);
  });
}

/* ---------------- 最新情報（テキスト or Xポスト埋め込み） ---------------- */
function loadNews() {
  loadCsv(
    SITE_CONFIG.csv.news,
    (rows) => renderNews(rows),
    () => renderNews(FALLBACK_NEWS)
  );
}

function renderNews(rows) {
  const container = document.getElementById("news-list");
  container.innerHTML = "";

  let hasEmbed = false;

  rows.forEach((row) => {
    if (row.x_post_url) {
      hasEmbed = true;
      const wrap = document.createElement("div");
      wrap.className = "news-embed";
      wrap.innerHTML = `
        ${row.date ? `<span class="news-date">${escapeHtml(row.date)}</span>` : ""}
        <blockquote class="twitter-tweet">
          <a href="${escapeAttr(row.x_post_url)}"></a>
        </blockquote>
      `;
      container.appendChild(wrap);
      return;
    }

    const item = document.createElement(row.link_url ? "a" : "div");
    item.className = "news-item";
    if (row.link_url) {
      item.href = row.link_url;
      item.target = "_blank";
      item.rel = "noopener";
    }
    item.innerHTML = `
      <span class="news-date">${escapeHtml(row.date || "")}</span>
      <span class="news-text">${escapeHtml(row.text || "")}</span>
    `;
    container.appendChild(item);
  });

  if (hasEmbed) {
    // Xの埋め込みスクリプト(widgets.js)が読み込み済みならレンダリングを実行
    if (window.twttr && window.twttr.widgets) {
      window.twttr.widgets.load(container);
    } else {
      // 非同期読み込み中の場合に備えて少し待って再試行
      let tries = 0;
      const timer = setInterval(() => {
        tries += 1;
        if (window.twttr && window.twttr.widgets) {
          window.twttr.widgets.load(container);
          clearInterval(timer);
        } else if (tries > 20) {
          clearInterval(timer);
        }
      }, 250);
    }
  }
}

/* ---------------- 広告枠（Supportersからランダムに1件表示） ---------------- */
function loadSupporters() {
  loadCsv(
    SITE_CONFIG.csv.supporters,
    (rows) => renderAdSlot(rows),
    () => renderAdSlot(FALLBACK_SUPPORTERS)
  );
}

function renderAdSlot(rows) {
  const container = document.getElementById("ad-slot");
  if (!container) return;
  container.innerHTML = "";
  if (!rows || rows.length === 0) return;

  const row = rows[Math.floor(Math.random() * rows.length)];

  const inner = document.createElement("div");
  inner.className = "ad-slot-inner";

  const banner = document.createElement(row.link_url ? "a" : "div");
  if (row.link_url) {
    banner.href = row.link_url;
    banner.target = "_blank";
    banner.rel = "noopener";
  }

  if (row.banner_url) {
    banner.className = "ad-banner";
    banner.innerHTML = `<img src="${escapeAttr(row.banner_url)}" alt="${escapeAttr(row.name || "")}">`;
  } else {
    banner.className = "ad-banner text-only";
    banner.textContent = row.name || "";
  }

  inner.appendChild(banner);
  container.appendChild(inner);
}

/* ---------------- ユーティリティ ---------------- */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
function escapeAttr(str) {
  return escapeHtml(str).replace(/"/g, "&quot;");
}
