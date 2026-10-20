/* 全宽桌面覆盖层：盖住游戏内偏窄/偏移的桌子 */
(function () {
  var style = document.createElement("style");
  style.textContent = [
    "#bottom-table{position:fixed;left:0;right:0;z-index:6;pointer-events:none;",
    "background:repeating-linear-gradient(90deg,rgba(0,0,0,.05) 0 7px,rgba(255,255,255,.04) 7px 14px),linear-gradient(#d2ab70,#7b4a1d);",
    "box-shadow:inset 0 3px 0 rgba(0,0,0,.30),inset 0 7px 0 rgba(255,255,255,.07);}"
  ].join("");
  document.head.appendChild(style);

  var el = document.createElement("div");
  el.id = "bottom-table";
  document.body.appendChild(el);

  function layout() {
    var c = document.getElementById("GameCanvas");
    if (!c) return;
    var r = c.getBoundingClientRect();
    if (r.height <= 0) return;
    var vv = window.visualViewport;
    var top = r.top + r.height * 0.8382;
    var h = Math.max(0, r.bottom - top);
    el.style.top = Math.round(top) + "px";
    el.style.height = Math.round(h) + "px";
    el.style.left = (vv ? Math.round(vv.offsetLeft) : 0) + "px";
    el.style.width = Math.round(vv ? vv.width : window.innerWidth) + "px";
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", layout);
  } else {
    layout();
  }
  window.addEventListener("resize", layout);
  window.addEventListener("orientationchange", layout);
  if (window.visualViewport) window.visualViewport.addEventListener("resize", layout);
  setInterval(layout, 1000);
})();
