const { chromium } = require(process.env.HOME + '/reformatic-website-console/node_modules/playwright');
(async () => {
  const b = await chromium.connectOverCDP('http://127.0.0.1:9471');
  for (const c of b.contexts()) for (const p of c.pages()) {
    if (!p.url().includes(process.argv[2]||'suitable')) continue;
    const r = await p.evaluate(() => performance.getEntriesByType('resource').map(e => [e.initiatorType, e.name.split('?')[0]]));
    const by = {};
    for (const [t, u] of r) { const o = new URL(u).origin; by[o] = by[o] || {}; by[o][t] = (by[o][t] || 0) + 1; }
    console.log(p.url(), JSON.stringify(by, null, 1));
    console.log(r.filter(x => x[0] === 'script').map(x => x[1]).slice(0, 60).join('\n'));
  }
  // disconnect only; never close the external browser
  process.exit(0);
})();
