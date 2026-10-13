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
   data-home   URL of this dashboard's home page for the "Dashboard home" button. Without
               it the button points at the dashboard's explainer page, found by matching
               this page against the Hub's overview/sites.json; it stays hidden on the
               home page itself and when no home is found.
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
  if (!window.__ascendStats) {                    // site stats, see ascend-stats.js
    var st0 = document.createElement("script"); st0.async = true; st0.src = HUB + "ascend-stats.js"; document.head.appendChild(st0);
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
      '<div class="am-eyebrow">ICAHN SCHOOL OF MEDICINE AT MOUNT SINAI<br><span class="am-dept">OFFICE OF CURRICULAR AFFAIRS &middot; ASCEND CURRICULUM</span></div>' +
      '<span class="am-btns"><a class="am-hub am-home" id="am-home" href="#" hidden>&#8962; <span class="am-lg">Dashboard home</span><span class="am-sm">Home</span></a>' +
      '<a class="am-hub" href="' + HUB + '">&larr; <span class="am-lg">Back to ASCEND Hub</span><span class="am-sm">Hub</span></a></span></div>' +
      '<h1>' + esc(d.title || document.title) + '</h1>' +
      '<div class="am-motto"><span class="a">Climb higher.</span><span class="b">Reach further.</span><span class="c">Care deeper.</span></div></div>' +
      '<div class="am-util"><div class="in"><span>' + esc(d.site || "") + '</span>' +
      (nav.length ? '<span class="am-nav">' + nav.map(function (n) { return '<a href="' + esc(n.h) + '"' + (n.on ? ' class="on"' : '') + '>' + esc(n.l) + '</a>'; }).join("") + '</span>' : "") +
      '</div></div><div class="am-stripe"><i></i><i></i><i></i></div>';
    document.querySelectorAll("nav.cq-nav,nav.ss-nav,nav.pp-nav,nav.pl-nav").forEach(function (n) { n.remove(); });
    document.body.insertBefore(h, document.body.firstChild);
    findHome(function (u) { var a = document.getElementById("am-home"); if (!u || !a || same(u, location.href)) return; a.href = u; a.hidden = false; });
  }
  function same(a, b) { var n = function (u) { return String(u).split(/[?#]/)[0].replace(/\/index\.html$/, "/"); }; return n(a) === n(b); }
  // The dashboard's home: data-home, else the Hub explainer page whose site this page belongs to.
  function findHome(cb) {
    if (d.home) return cb(new URL(d.home, location.href).href);
    if (!window.fetch) return cb(null);
    var OV = HUB + "overview/", here = location.href.split(/[?#]/)[0];
    fetch(OV + "sites.json").then(function (r) { return r.json(); }).then(function (cfg) {
      var best = null, score = 0;
      (cfg.sites || []).forEach(function (s) {
        var urls = [s.primaryAbs || s.primary].concat((s.views || []).map(function (v) { return v.url; }));
        urls.forEach(function (u, i) {
          if (!u) return;
          u = /^(https?:|\.\.\/)/.test(u) ? new URL(u, OV).href : cfg.base + u;
          u = u.split(/[?#]/)[0];
          var sc = u === here ? 1e6 : (/\/$/.test(u) && here.indexOf(u) === 0 ? u.length : 0);   // exact page beats folder
          if (sc && i === 0) sc += 0.5;                       // a site's own primary beats another site's view of it
          if (sc > score) { score = sc; best = s; }
        });
      });
      cb(best ? OV + best.slug + ".html" : null);
    }).catch(function () { cb(null); });
  }
  if (document.body) render(); else document.addEventListener("DOMContentLoaded", render);
})();
