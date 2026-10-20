/* 桌面覆盖层：宽度=游戏画布（碰撞范围）；纯色；加载完成前隐藏，避免加载时闪烁条纹 */
(function () {
  var style = document.createElement("style");
  style.textContent = "#bottom-table{position:fixed;z-index:6;pointer-events:none;background:#b07b3f;display:none;}";
  document.head.appendChild(style);

  var el = document.createElement("div");
  el.id = "bottom-table";
  document.body.appendChild(el);

  function layout() {
    var c = document.getElementById("GameCanvas");
    if (!c) { el.style.display = "none"; return; }
    var r = c.getBoundingClientRect();
    if (r.height < 300) { el.style.display = "none"; return; }
    var scene = (window.cc && cc.director && cc.director.getScene) ? cc.director.getScene() : null;
    if (!scene || scene.name !== "MainGameScene") { el.style.display = "none"; return; }

    var visH = (cc.view && cc.view.getVisibleSize) ? cc.view.getVisibleSize().height : 1560;
    var down = cc.find("Canvas/bgLayer/down");
    var frac = down ? (0.5 - (down.y + down.height / 2) / visH) : (0.5 + 528 / visH);
    if (frac < 0.7) frac = 0.7;
    if (frac > 0.95) frac = 0.95;

    var top = r.top + r.height * frac;
    var h = Math.max(0, r.bottom - top);
    el.style.left = Math.round(r.left) + "px";
    el.style.width = Math.round(r.width) + "px";
    el.style.top = Math.round(top) + "px";
    el.style.height = Math.round(h) + "px";
    el.style.display = "block";
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", layout);
  } else {
    layout();
  }
  window.addEventListener("resize", layout);
  window.addEventListener("orientationchange", layout);
  if (window.visualViewport) window.visualViewport.addEventListener("resize", layout);
  setInterval(layout, 500);
})();
