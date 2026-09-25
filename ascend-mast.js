/* ASCEND masthead injector — the Programmatic Assessment house style for any
   ASCEND page, from one file. Include once, at the end of <body>:

     <script src="https://sinaiascend.github.io/Dashboard---HUB/ascend-mast.js"
             data-title="Clerkship Quality"
             data-site="Clerkship Quality · LCME monitoring"
             data-nav='[{"l":"LCME monitoring","h":"./","on":1},{"l":"Site reports","h":"sites/"}]'
             data-hide="header.old, .old-topbar"></script>

   data-title  masthead <h1> (defaults to document.title)
   data-site   left text of the utility row (site · view)
   data-nav    JSON list of section links for the utility row; "on" marks the current one
   data-hide   CSS selector(s) for the page's own header, hidden so there is one masthead
   data-full   present = full-height masthead instead of the compact variant
   It loads ascend-mast.css, removes any earlier ad-hoc section bars, and puts the
   masthead first in <body>. The masthead carries the Back-to-Hub link, so pages
   using it do not need hub-back.js. */
(function () {
  var s = document.currentScript; if (!s) return;
  var d = s.dataset, HUB = "https://sinaiascend.github.io/Dashboard---HUB/";
  var esc = function (t) { return String(t == null ? "" : t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;" }[c]; }); };
  if (!document.querySelector('link[href$="ascend-mast.css"]')) {
    var css = document.createElement("link"); css.rel = "stylesheet"; css.href = HUB + "ascend-mast.css"; document.head.appendChild(css);
  }
  if (d.hide) { var st = document.createElement("style"); st.textContent = d.hide + "{display:none!important}"; document.head.appendChild(st); }
  function render() {
    if (document.getElementById("ascend-masthead")) return;
    var nav = []; try { nav = JSON.parse(d.nav || "[]"); } catch (e) {}
    var h = document.createElement("header");
    h.id = "ascend-masthead"; h.className = "ascend-mast" + (d.full != null ? "" : " ascend-mast--compact");
    h.innerHTML =
      '<img class="am-logo" src="' + HUB + 'oca-mountain.png" alt="">' +
      '<div class="am-wrap"><div class="am-top"><span class="am-dot"></span>' +
      '<div class="am-eyebrow">ICAHN SCHOOL OF MEDICINE AT MOUNT SINAI<br>OFFICE OF CURRICULAR AFFAIRS &middot; ASCEND CURRICULUM</div>' +
      '<a class="am-hub" href="' + HUB + '">&larr; Back to ASCEND Hub</a></div>' +
      '<h1>' + esc(d.title || document.title) + '</h1>' +
      '<div class="am-motto"><span class="a">Climb higher.</span><span class="b">Reach further.</span><span class="c">Care deeper.</span></div></div>' +
      '<div class="am-util"><div class="in"><span>' + esc(d.site || "") + '</span>' +
      (nav.length ? '<span class="am-nav">' + nav.map(function (n) { return '<a href="' + esc(n.h) + '"' + (n.on ? ' class="on"' : '') + '>' + esc(n.l) + '</a>'; }).join("") + '</span>' : "") +
      '</div></div><div class="am-stripe"><i></i><i></i><i></i></div>';
    document.querySelectorAll("nav.cq-nav,nav.ss-nav,nav.pp-nav,nav.pl-nav").forEach(function (n) { n.remove(); });
    document.body.insertBefore(h, document.body.firstChild);
  }
  if (document.body) render(); else document.addEventListener("DOMContentLoaded", render);
})();
