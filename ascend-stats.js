/* ASCEND site stats — GoatCounter (https://sinaiascend.goatcounter.com).
   No cookies and no personal data: one count per page view, by path.
   ascend-mast.js loads this on every dashboard that wears the masthead; the
   Hub's own pages include it directly. Load it any number of times; it counts once.

   Paths are recorded without query strings or hashes, so nothing typed into
   a dashboard (a search, a student code) reaches the stats. Pages off
   sinaiascend.github.io (Governance on Vercel) are prefixed with their host.
   Student Performance is never counted. */
(function () {
  if (window.__ascendStats) return; window.__ascendStats = 1;
  var host = location.hostname, path = location.pathname;
  if (location.protocol !== "https:") return;                 // local copies and previews
  if (/student[_-]?performance/i.test(path)) return;
  var strip = function (u) { return String(u || "").split(/[?#]/)[0]; };
  window.goatcounter = {
    path: (host === "sinaiascend.github.io" ? "" : host) + path,
    referrer: function (r) { return strip(r); }
  };
  var s = document.createElement("script");
  s.async = true;
  s.src = "https://gc.zgo.at/count.v4.js";
  s.integrity = "sha384-nRw6qfbWyJha9LhsOtSb2YJDyZdKvvCFh0fJYlkquSFjUxp9FVNugbfy8q1jdxI+";
  s.crossOrigin = "anonymous";
  s.setAttribute("data-goatcounter", "https://sinaiascend.goatcounter.com/count");
  (document.head || document.documentElement).appendChild(s);
})();
