# Dashboard---HUB

The ASCEND Dashboard Hub. Live at https://sinaiascend.github.io/Dashboard---HUB/

## How it is organised
- `index.html` — the Hub. Four public tiles (Curriculum Navigator, Electives & NEXUS, Baby Bates, People) and an access-code gate with seven codes: ASCEND (OCA leadership), EEC, PCCS, CCS, CIS, CCM (Clinical Competency Mentors), RPS (student performance only). Codes are stored as SHA-256 hashes of the upper-cased code in `TIERS`; cards are defined in `DASHBOARDS`.
- `overview/<site>.html` — one explainer page per dashboard site. Every Hub card and tile opens its explainer first: what the site holds, who it is for, and a button into each view. Generated from `overview/sites.json` by `node build-overview.mjs`; edit the JSON, rebuild, commit.
- `Student_Performance.html` — the de-identified student performance dashboard (RPS code). Ships synthetic sample data; real data is loaded locally by the pipeline in `ascend-student-data-tools`.
- `ascend-mast.css`, `hub-back.js`, `oca-mountain.png` — shared masthead, back-to-Hub pill, and logo that the other sites load from here.

## Changing a code
Upper-case the new code, SHA-256 it, and replace the key in `TIERS`.
