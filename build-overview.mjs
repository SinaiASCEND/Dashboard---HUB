#!/usr/bin/env node
/* Builds overview/<slug>.html from overview/sites.json.  Run: node build-overview.mjs
   Each consolidated site opens on one of these pages: what it holds, who it is
   for, and a button into each view. Edit sites.json, rebuild, commit. */
import { readFileSync, writeFileSync } from "node:fs";
const cfg = JSON.parse(readFileSync("overview/sites.json", "utf8"));
const esc = s => String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
const abs = u => !u ? "" : /^(https?:|\.\.\/)/.test(u) ? u : cfg.base + u;
for (const s of cfg.sites) {
  const primary = s.primaryAbs || abs(s.primary);
  const views = s.views.map((v, i) => `
      <div class="vcard">
        <div class="vk">${String(i+1).padStart(2,"0")}</div>
        <div class="vt">${esc(v.title)}</div>
        <div class="vb">${esc(v.blurb)}</div>
        ${v.url ? `<a class="vgo" href="${esc(abs(v.url))}">Open &rarr;</a>` : ""}
      </div>`).join("");
  const html = `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(s.title)} · ASCEND</title>
<link rel="stylesheet" href="../ascend-mast.css">
<style>
:root{--navy:#0A1F44;--navy2:#0E2C5C;--ink:#1d2433;--bg:#eef1f6;--line:#d7dde8;--muted:#5b6678;--soft:#f6f8fc;--magenta:#D6177F;--cyan:#00A0C8;--radius:14px;
  --sans:"Helvetica Neue",-apple-system,"Segoe UI",Roboto,Arial,sans-serif}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font-family:var(--sans);-webkit-font-smoothing:antialiased}
.wrap{max-width:980px;margin:0 auto;padding:0 22px}
.intro{background:#fff;border:1px solid var(--line);border-radius:var(--radius);padding:26px 26px 22px;margin:26px auto 0;box-shadow:0 2px 12px rgba(10,31,68,.06)}
.lead{font-size:16px;line-height:1.6;margin:0;color:var(--ink);max-width:760px}
.btn{display:inline-block;margin-top:18px;background:var(--navy);color:#fff;text-decoration:none;font-weight:700;font-size:14px;padding:12px 20px;border-radius:999px}
.btn:hover{background:var(--magenta)}
h2{font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:var(--muted);font-weight:800;margin:30px 0 12px}
.vgrid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.vcard{background:#fff;border:1px solid var(--line);border-top:3px solid var(--magenta);border-radius:var(--radius);padding:20px 20px 18px;position:relative}
.vcard:nth-child(even){border-top-color:var(--cyan)}
.vk{font-size:10.5px;letter-spacing:.16em;font-weight:800;color:var(--muted)}
.vt{font-size:17px;font-weight:800;color:var(--navy);margin:6px 0 6px;line-height:1.25}
.vb{font-size:13.5px;color:var(--muted);line-height:1.5}
.vgo{display:inline-block;margin-top:12px;font-weight:700;font-size:13px;color:var(--magenta);text-decoration:none}
.vcard:nth-child(even) .vgo{color:var(--cyan)}
.aud{margin:28px 0 40px;font-size:13px;color:var(--muted);line-height:1.6;border-left:3px solid var(--line);padding-left:14px}
.aud b{color:var(--navy)}
@media (max-width:680px){.vgrid{grid-template-columns:1fr}.wrap{padding:0 16px}}
</style></head><body>
<header class="ascend-mast ascend-mast--compact">
  <img class="am-logo" src="../oca-mountain.png" alt="">
  <div class="am-wrap">
    <div class="am-top"><span class="am-dot"></span>
      <div class="am-eyebrow">ICAHN SCHOOL OF MEDICINE AT MOUNT SINAI<br>OFFICE OF CURRICULAR AFFAIRS &middot; ASCEND DASHBOARD HUB</div>
      <a class="am-hub" href="../">&larr; Back to ASCEND Hub</a></div>
    <h1>${esc(s.title)}</h1>
    <div class="am-motto"><span class="a">Climb higher.</span><span class="b">Reach further.</span><span class="c">Care deeper.</span></div>
  </div>
  <div class="am-util"><div class="in">${esc(s.kicker)} <span>&middot; ${s.public ? "Open to everyone" : "Access-code dashboard"}</span></div></div>
  <div class="am-stripe"><i></i><i></i><i></i></div>
</header>
<main class="wrap">
  <section class="intro">
    <p class="lead">${esc(s.intro)}</p>
    <a class="btn" href="${esc(primary)}">Open ${esc(s.short)} &rarr;</a>
  </section>
  <h2>What you will find</h2>
  <div class="vgrid">${views}
  </div>
  <div class="aud"><b>Who this is for.</b> ${esc(s.audience)}</div>
</main>
</body></html>
`;
  writeFileSync(`overview/${s.slug}.html`, html);
  console.log("wrote overview/" + s.slug + ".html");
}
