# How the evidence was made

Everything ran on the Bizon on 2026-11-11, against public pages only. There was no login, no account, no form and no API call, and `robots.txt` was respected.

## 1. Suitable's own pages
- [`pages.txt`](pages.txt) lists the 34 paths fetched from `https://www.suitable.co`. They were fetched with `curl`, one at a time, 3 seconds apart.
- [`html2text.py`](html2text.py) turns each saved page into text.
- Lines that appear on 17 or more pages (the shared navigation) were then removed, which gives the `.clean.txt` files that `facts.md` cites.
- The raw pages stay on the box, in `~/agent-research/evidence/suitable/raw/`.

## 2. REA on the app's login page and the NACE page

**Browser.** Use system Chrome (`/usr/bin/google-chrome`), headless. It keeps its setuid sandbox; Playwright's bundled Chromium has no usable sandbox on this box. Give it a throwaway profile and a loopback debugging port, record its PID, and stop it by that PID only:

```bash
google-chrome --headless=new --remote-debugging-address=127.0.0.1 --remote-debugging-port=9471 \
  --user-data-dir=<throwaway> about:blank &
```

**Open the page.** `curl -X PUT "http://127.0.0.1:9471/json/new?https://app.suitable.co/"`.

**Find the script origins.** [`origins.cjs`](origins.cjs) lists where the page's scripts came from. Run it with Node 24 and Playwright. The app's scripts come from a CloudFront CDN, so that origin has to be allowed in the next step.

**Run REA** (`rea-agents` 6.5.0 under `~/.local/node-24/bin`):

```bash
rea inspect-web-page http://127.0.0.1:9471 <targetId> \
  --allowed-origins https://app.suitable.co --allowed-origins https://<cdn-origin> \
  --observation-ms 3000 --include-script-sources --include-accessibility-text --format json > app-page.json
rea export-web-scripts app-page.json app-scripts
rea analyze-javascript-application app-scripts/files --format json > app-analysis.json
```

Two traps:
- `analyze-web-bundle` sees no scripts on a page that has already loaded.
- REA's structured findings are aimed at desktop (Electron) apps, so for a web bundle the useful layer is the exported scripts themselves.

## 3. The inventories
- [`extract.py`](extract.py) reads the exported webpack folder. It writes `api-surface.tsv` (each API client method, its HTTP verb and path) and `screens.tsv` (each named route and its page title).
- [`ctx.py`](ctx.py) prints the code around a search term. It was used to read the "Suity" chat call and the route map.
