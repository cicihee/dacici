/* 桌面覆盖层：宽度=游戏画布/碰撞范围，纯色，无条纹 */
(function () {
  var style = document.createElement("style");
  style.textContent = "#bottom-table{position:fixed;z-index:6;pointer-events:none;background:#b07b3f;}";
  document.head.appendChild(style);

  var el = document.createElement("div");
  el.id = "bottom-table";
  document.body.appendChild(el);

  function layout() {
    var c = document.getElementById("GameCanvas");
    if (!c) return;
    var r = c.getBoundingClientRect();
    if (r.height <= 0) return;
    var top = r.top + r.height * 0.8382;
    var h = Math.max(0, r.bottom - top);
    el.style.left = Math.round(r.left) + "px";
    el.style.width = Math.round(r.width) + "px";
    el.style.top = Math.round(top) + "px";
    el.style.height = Math.round(h) + "px";
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
