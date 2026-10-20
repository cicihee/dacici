/* 合成大慈慈 - 排行榜前端（Supabase REST，无需 SDK） */
(function () {
  var CFG = window.LB_CONFIG || {};
  var BASE = (CFG.url || "").replace(/\/+$/, "");
  var KEY = CFG.anonKey || "";
  var configured = !!(BASE && KEY);
  var NAME_KEY = "dacici_name";
  var lastSubmit = { score: -1, t: 0 };
  var built = false;
  var el = {};

  function q(id) { return document.getElementById(id); }

  function getName() {
    try { return (localStorage.getItem(NAME_KEY) || "").trim(); } catch (e) { return ""; }
  }
  function setName(v) {
    try { localStorage.setItem(NAME_KEY, v); } catch (e) {}
  }

  function build() {
    if (built || !document.body) return;
    built = true;

    var style = document.createElement("style");
    style.textContent = [
      "#lb-bar{position:fixed;top:10px;right:10px;z-index:99998;font-family:-apple-system,BlinkMacSystemFont,'PingFang SC','Microsoft YaHei',sans-serif}",
      "#lb-open{background:rgba(255,255,255,.9);border:2px solid #c98a3b;color:#7a4a12;border-radius:999px;padding:6px 14px;font-size:14px;font-weight:700;box-shadow:0 3px 10px rgba(0,0,0,.18);cursor:pointer}",
      "#lb-open:active{transform:scale(.97)}",
      "#lb-mask{position:fixed;inset:0;background:rgba(40,24,8,.55);z-index:99999;display:none;align-items:center;justify-content:center;padding:16px;font-family:-apple-system,BlinkMacSystemFont,'PingFang SC','Microsoft YaHei',sans-serif}",
      "#lb-mask.show{display:flex}",
      "#lb-card{width:min(92vw,380px);max-height:82vh;background:#fff8e8;border:2px solid #c98a3b;border-radius:18px;box-shadow:0 18px 60px rgba(0,0,0,.38);color:#4a2f10;display:flex;flex-direction:column;overflow:hidden}",
      "#lb-head{display:flex;align-items:center;justify-content:space-between;padding:12px 14px;background:#f6c86a;color:#5a3510;font-weight:700;font-size:16px}",
      "#lb-x{background:none;border:0;font-size:22px;line-height:1;color:#6b4112;cursor:pointer;padding:0 4px}",
      "#lb-body{padding:12px 14px;overflow:auto}",
      ".lb-row{display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:10px}",
      ".lb-row:nth-child(odd){background:rgba(201,138,59,.12)}",
      ".lb-rank{width:2.2em;text-align:center;font-weight:700;color:#a5681f}",
      ".lb-name{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
      ".lb-score{font-weight:700;color:#7a4a12}",
      "#lb-input{width:100%;box-sizing:border-box;padding:11px 12px;border:2px solid #d9a55a;border-radius:12px;font-size:16px;outline:none;background:#fff;color:#3d2508}",
      "#lb-primary{width:100%;margin-top:12px;padding:11px 12px;border:0;border-radius:12px;background:#e2a33b;color:#fff;font-size:16px;font-weight:700;cursor:pointer;box-shadow:0 3px 0 #b97a20}",
      "#lb-primary:active{transform:translateY(1px);box-shadow:0 2px 0 #b97a20}",
      "#lb-skip{display:block;text-align:center;margin-top:10px;color:#8a6a3a;font-size:13px;cursor:pointer;text-decoration:underline}",
      "#lb-note{font-size:12px;color:#8a6a3a;margin-top:8px;line-height:1.5}",
      "#lb-me{display:flex;align-items:center;justify-content:space-between;font-size:13px;color:#6b4a1e;margin-bottom:8px}",
      "#lb-rename{color:#a5681f;text-decoration:underline;cursor:pointer}",
      "#lb-msg{font-size:13px;color:#8a6a3a;text-align:center;padding:14px 4px;line-height:1.6}"
    ].join("\n");
    document.head.appendChild(style);

    var bar = document.createElement("div");
    bar.id = "lb-bar";
    var openBtn = document.createElement("button");
    openBtn.id = "lb-open";
    openBtn.type = "button";
    openBtn.textContent = "排行榜";
    openBtn.addEventListener("click", openBoard);
    bar.appendChild(openBtn);
    document.body.appendChild(bar);

    var mask = document.createElement("div");
    mask.id = "lb-mask";
    mask.addEventListener("click", function (e) { if (e.target === mask) hide(); });
    var card = document.createElement("div");
    card.id = "lb-card";
    var head = document.createElement("div");
    head.id = "lb-head";
    var title = document.createElement("span");
    title.id = "lb-title";
    var x = document.createElement("button");
    x.id = "lb-x"; x.type = "button"; x.textContent = "\u00d7";
    x.addEventListener("click", hide);
    head.appendChild(title); head.appendChild(x);
    var body = document.createElement("div");
    body.id = "lb-body";
    card.appendChild(head); card.appendChild(body);
    mask.appendChild(card);
    document.body.appendChild(mask);

    el = { mask: mask, title: title, body: body };
  }

  function show() { build(); el.mask.classList.add("show"); }
  function hide() { if (el.mask) el.mask.classList.remove("show"); }

  function openName(first) {
    build();
    el.title.textContent = "取个昵称";
    el.body.textContent = "";
    var tip = document.createElement("div");
    tip.id = "lb-note";
    tip.textContent = "昵称只用于排行榜，不需要密码。最多 20 个字。";
    var input = document.createElement("input");
    input.id = "lb-input";
    input.maxLength = 20;
    input.placeholder = "输入你的昵称";
    input.value = getName();
    var btn = document.createElement("button");
    btn.id = "lb-primary"; btn.type = "button"; btn.textContent = "保存并继续";
    var skip = document.createElement("span");
    skip.id = "lb-skip"; skip.textContent = "以后再说";
    skip.addEventListener("click", hide);
    function save() {
      var v = (input.value || "").replace(/\s+/g, " ").trim();
      if (!v) { input.focus(); return; }
      setName(v.slice(0, 20));
      hide();
    }
    btn.addEventListener("click", save);
    input.addEventListener("keydown", function (e) { if (e.key === "Enter") save(); });
    el.body.appendChild(tip);
    el.body.appendChild(input);
    el.body.appendChild(btn);
    if (!first) el.body.appendChild(skip);
    show();
    setTimeout(function () { try { input.focus(); } catch (e) {} }, 120);
  }

  function renderRows(rows) {
    rows = (rows || []).filter(function (r) { return !/^__selftest/.test(String(r.name || "")); });
    el.body.textContent = "";
    var me = getName();
    var meRow = document.createElement("div");
    meRow.id = "lb-me";
    var label = document.createElement("span");
    label.textContent = me ? ("我的昵称：" + me) : "还没有昵称";
    var rename = document.createElement("span");
    rename.id = "lb-rename";
    rename.textContent = me ? "修改" : "设置昵称";
    rename.addEventListener("click", function () { openName(false); });
    meRow.appendChild(label); meRow.appendChild(rename);
    el.body.appendChild(meRow);

    if (!rows.length) {
      var empty = document.createElement("div");
      empty.id = "lb-msg";
      empty.textContent = "还没有成绩，快去玩一局吧！";
      el.body.appendChild(empty);
      return;
    }
    rows.forEach(function (r, i) {
      var row = document.createElement("div");
      row.className = "lb-row";
      var rank = document.createElement("div");
      rank.className = "lb-rank"; rank.textContent = String(i + 1);
      var nm = document.createElement("div");
      nm.className = "lb-name"; nm.textContent = String(r.name || "");
      var sc = document.createElement("div");
      sc.className = "lb-score"; sc.textContent = Number(r.score || 0).toLocaleString("zh-CN");
      row.appendChild(rank); row.appendChild(nm); row.appendChild(sc);
      el.body.appendChild(row);
    });
  }

  function msg(text) {
    el.body.textContent = "";
    var m = document.createElement("div");
    m.id = "lb-msg"; m.textContent = text;
    el.body.appendChild(m);
  }

  function openBoard() {
    build();
    el.title.textContent = "排行榜";
    if (!configured) { show(); msg("排行榜尚未配置（缺少 Supabase URL / anon key）。"); return; }
    show();
    msg("加载中…");
    var url = BASE + "/rest/v1/leaderboard?select=name,score&order=score.desc&limit=20&name=not.like.__selftest*";
    fetch(url, {
      headers: { apikey: KEY, Authorization: "Bearer " + KEY },
      cache: "no-store"
    }).then(function (r) {
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.json();
    }).then(function (rows) {
      renderRows(Array.isArray(rows) ? rows : []);
    }).catch(function () {
      msg("排行榜加载失败，请检查网络后重试。");
    });
  }

  function submit(score) {
    score = Math.floor(Number(score) || 0);
    var name = getName();
    if (!configured || !name || score <= 0) return;
    var now = Date.now();
    if (lastSubmit.score === score && now - lastSubmit.t < 5000) return;
    lastSubmit = { score: score, t: now };
    fetch(BASE + "/rest/v1/scores", {
      method: "POST",
      cache: "no-store",
      headers: {
        apikey: KEY,
        Authorization: "Bearer " + KEY,
        "Content-Type": "application/json",
        Prefer: "return=minimal"
      },
      body: JSON.stringify({ name: name, score: score })
    }).catch(function () {});
  }

  function init() {
    build();
    if (!getName()) setTimeout(function () { openName(true); }, 300);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  window.LB = { submit: submit, open: openBoard, name: getName };
})();
