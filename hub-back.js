/* ASCEND — "Back to ASCEND Hub" pill.
   Drop one line into any ASCEND site, just before </body>:
     <script src="https://sinaiascend.github.io/Dashboard---HUB/hub-back.js"></script>

   Options (attributes on that <script> tag):
     data-pos="bottom-left" | "bottom-right" | "top-left" | "top-right"   default: bottom-left
     data-label="Back to ASCEND Hub"                                      default: as shown

   Rendered in a shadow root, so the host page's CSS cannot restyle or
   collapse it, and it cannot leak styles into the host page.
   Maintained in Dashboard---HUB; every site picks up changes automatically. */
(function () {
  var HUB = 'https://sinaiascend.github.io/Dashboard---HUB/';

  // Never show it on the hub's own front page, or inside an embed.
  // (Sub-pages inside the hub repo DO get it — it takes them back to the index.)
  if (/\/Dashboard---HUB\/(index\.html)?$/.test(location.pathname)) return;
  try { if (window.top !== window.self) return; } catch (e) { return; }
  if (document.getElementById('ascend-hub-back')) return;

  var me = document.currentScript;
  var pos = (me && me.getAttribute('data-pos')) || 'bottom-left';
  if (['bottom-left','bottom-right','top-left','top-right'].indexOf(pos) === -1) pos = 'bottom-left';
  var label = (me && me.getAttribute('data-label')) || 'Back to ASCEND Hub';


  /* Many ASCEND sites carry a fixed bottom tab bar or footer. Measure anything
     pinned to the viewport edge under the pill and float clear of it, so the
     pill never lands on top of another site's navigation. */
  var EDGE = 18, PILL_W = 260, MAXCLEAR = 220;

  function clearance() {
    if (pos.indexOf('bottom') !== 0) return 0;
    var vh = window.innerHeight, best = 0;
    var els = document.body ? document.body.getElementsByTagName('*') : [];
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      if (el.id === 'ascend-hub-back') continue;
      var cs;
      try { cs = getComputedStyle(el); } catch (e) { continue; }
      if (cs.position !== 'fixed' && cs.position !== 'sticky') continue;
      if (cs.visibility === 'hidden' || cs.display === 'none' || cs.opacity === '0') continue;
      var r = el.getBoundingClientRect();
      if (!r.width || !r.height) continue;
      if (r.bottom < vh - 4 || r.top > vh) continue;        // not pinned to the bottom edge
      if (r.height > MAXCLEAR) continue;                     // full-screen overlay, not a bar
      var left = pos === 'bottom-left' ? 0 : window.innerWidth - PILL_W;
      if (r.right < left || r.left > left + PILL_W) continue; // not under the pill
      best = Math.max(best, vh - r.top);
    }
    return Math.min(best, MAXCLEAR);
  }

  function place(host) {
    var side = pos.indexOf('left') !== -1 ? 'left' : 'right';
    if (pos.indexOf('top') === 0) {
      host.style.cssText = 'position:fixed;z-index:2147483000;top:calc(' + EDGE +
        'px + env(safe-area-inset-top));' + side + ':calc(' + EDGE + 'px + env(safe-area-inset-' + side + '));';
    } else {
      host.style.cssText = 'position:fixed;z-index:2147483000;bottom:calc(' + (EDGE + clearance()) +
        'px + env(safe-area-inset-bottom));' + side + ':calc(' + EDGE + 'px + env(safe-area-inset-' + side + '));';
    }
  }

  function mount() {
    var host = document.createElement('div');
    host.id = 'ascend-hub-back';
    host.setAttribute('role', 'navigation');
    host.setAttribute('aria-label', 'ASCEND Hub');
    var root = host.attachShadow ? host.attachShadow({ mode: 'open' }) : host;

    var css = document.createElement('style');
    css.textContent =
      ':host{all:initial;}' +
      'a{display:inline-flex;align-items:center;gap:8px;' +
        'font:600 13px/1 "Helvetica Neue",-apple-system,"Segoe UI",Roboto,Arial,sans-serif;' +
        'letter-spacing:.01em;text-decoration:none;white-space:nowrap;' +
        'padding:10px 18px;border-radius:999px;' +
        'color:#fff;background:#0A1F44;border:1px solid rgba(255,255,255,.28);' +
        'box-shadow:0 6px 22px rgba(2,10,30,.30);' +
        'transition:background .15s ease,transform .15s ease;}' +
      'a:hover{background:#D6177F;transform:translateY(-1px);}' +
      'a:focus-visible{outline:3px solid #00A0C8;outline-offset:3px;}' +
      'svg{flex:none;}' +
      '@media (max-width:640px){a{padding:9px 14px;font-size:12px;}}' +
      '@media (prefers-reduced-motion:reduce){a{transition:none;}a:hover{transform:none;}}' +
      '@media print{:host{display:none;}}';

    var a = document.createElement('a');
    a.href = HUB;
    a.title = label;
    a.innerHTML =
      '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
      '<path d="M15 5l-7 7 7 7" stroke="currentColor" stroke-width="2.4" ' +
      'stroke-linecap="round" stroke-linejoin="round"/></svg>';
    a.appendChild(document.createTextNode(label));

    root.appendChild(css);
    root.appendChild(a);
    document.body.appendChild(host);

    place(host);
    var reflow = function () { place(host); };
    window.addEventListener('resize', reflow);
    window.addEventListener('load', reflow);
    setTimeout(reflow, 600);   // after late-rendering bars settle
    setTimeout(reflow, 2000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
