// Walk-through test for the Waypoint prototype in app/.
// It drives a real browser through the student and staff views and the brand packs.
//
//   ./serve.sh 8765                      (in another terminal)
//   npm install playwright               (once, anywhere; or point WP_PLAYWRIGHT at an existing copy)
//   node tools/app-walk.cjs
//
// Settings (environment variables):
//   WP_URL         app address            default http://127.0.0.1:8765/app/
//   WP_PLAYWRIGHT  module to require      default "playwright"
//   WP_CHROME      browser executable     default: Playwright's own Chromium
//   WP_SHOTS       folder for screenshots default: none taken
//   WP_BRANDS      extra local packs to check, comma separated (for example "larkspur")
const { chromium } = require(process.env.WP_PLAYWRIGHT || 'playwright');
const U = process.env.WP_URL || 'http://127.0.0.1:8765/app/';
const SHOTS = process.env.WP_SHOTS || '';
const EXTRA = (process.env.WP_BRANDS || '').split(',').map(s => s.trim()).filter(Boolean);
const errs = []; let fails = 0, n = 0;
const ok = (c, m) => { n++; console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
const STUDENT = ['home', 'explore', 'activity/a1', 'activity/a6', 'activity/a8', 'activity/s1', 'activity/a3', 'record', 'transcript', 'orgs', 'org/o2', 'board'];
const STAFF = ['staff/overview', 'staff/approvals', 'staff/activities', 'staff/new', 'staff/edit/a6', 'staff/edit/a3', 'staff/event/a1', 'staff/students', 'staff/student'];
const ALL = STUDENT.concat(STAFF);
const SIZES = [[390, 844, 'light'], [1400, 900, 'light'], [390, 844, 'dark'], [1400, 900, 'dark']];

// WCAG contrast between two CSS colours given as "rgb(r, g, b)" or "#rrggbb".
function rgb(c) {
  c = c.trim();
  if (c[0] === '#') return [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16));
  return c.match(/[\d.]+/g).slice(0, 3).map(Number);
}
function lum(c) { const [r, g, b] = rgb(c).map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; }
function contrast(a, b) { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); }
const TEXT_PAIRS = [['--ink', '--bg'], ['--ink', '--surface'], ['--muted', '--bg'], ['--muted', '--surface'], ['--brand', '--surface'], ['--brand', '--bg'],
  ['--brand-ink', '--brand'], ['--brand', '--brand-soft'], ['--accent', '--surface'], ['--accent', '--bg'], ['--accent', '--accent-soft'],
  ['--ok', '--ok-soft'], ['--warn', '--warn-soft'], ['--off', '--off-soft'], ['--hero-ink', '--hero-bg']];

(async () => {
  const b = await chromium.launch(process.env.WP_CHROME ? { executablePath: process.env.WP_CHROME, chromiumSandbox: true, headless: true } : { headless: true });
  const watch = p => { p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); }); p.on('pageerror', e => errs.push(String(e))); };

  // Every screen fits its width, in a given brand.
  async function fits(brand) {
    for (const [w, h, scheme] of SIZES) {
      const cx = await b.newContext({ viewport: { width: w, height: h }, colorScheme: scheme });
      const p = await cx.newPage(); watch(p);
      await p.goto(U + '?brand=' + brand + '#/home'); await p.waitForTimeout(250);
      let bad = 0;
      for (const r of ALL) {
        await p.goto(U + '#/' + r); await p.waitForTimeout(120);
        const [sw, cw] = await p.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth]);
        if (sw > cw) { bad++; console.log(`  overflow ${brand} ${w}px ${scheme} ${r}: ${sw} > ${cw}`); }
        if (SHOTS && ['home', 'transcript', 'staff/overview', 'staff/approvals', 'activity/a6'].includes(r)) await p.screenshot({ path: `${SHOTS}/${brand}-${w}-${scheme}-${r.replace(/\//g, '_')}.png` });
      }
      ok(bad === 0, `[${brand}] ${ALL.length} screens fit at ${w}px ${scheme}`);
      const tok = await p.evaluate(names => { const cs = getComputedStyle(document.documentElement); const o = {}; names.forEach(k => { o[k] = cs.getPropertyValue(k); }); return o; }, [...new Set(TEXT_PAIRS.flat())]);
      const low = TEXT_PAIRS.map(([f, g]) => [f, g, contrast(tok[f], tok[g])]).filter(x => x[2] < 4.5).map(x => `${x[0]} on ${x[1]} ${x[2].toFixed(2)}`);
      if (w === 1400) ok(low.length === 0, `[${brand}] text colours reach 4.5:1 in ${scheme}` + (low.length ? ': ' + low.join(', ') : ''));
      await cx.close();
    }
  }
  await fits('default');

  const cx = await b.newContext({ viewport: { width: 1200, height: 900 } });
  const p = await cx.newPage(); watch(p);
  const go = async r => { await p.goto(U + '#/' + r); await p.waitForTimeout(80); };
  const pts = async () => { await go('home'); return +(await p.textContent('.hero .big')); };
  const txt = async s => (await p.textContent(s)) || '';
  const waiting = async () => { await go('staff/approvals'); return p.locator('article.card').count(); };
  await p.goto(U + '?brand=default#/home'); await p.waitForTimeout(200);

  // ----- student: check in, submit -----
  ok(await pts() === 95, 'student starts at 95 points');
  await go('activity/a2'); await p.fill('#code', 'WRONG'); await p.click('form .btn');
  ok(await p.isVisible('.err'), 'wrong check-in code refused');
  await p.fill('#code', 'heron-9'); await p.click('form .btn');
  ok(await pts() === 170, 'check-in + set completion gives 170');
  await go('activity/a6'); await p.fill('#text', 'too short'); await p.click('form .btn');
  ok(await p.isVisible('.err') && await p.inputValue('#text') === 'too short', 'short reflection refused, text kept');
  await p.fill('#text', Array(45).fill('word').join(' ')); await p.click('form .btn');
  ok(await p.isVisible('.pill.warn') && !(await p.isVisible('[data-action=approve]')), 'reflection waits for approval; no self-approve button');
  ok(await pts() === 170, 'no points while waiting');

  // ----- staff: approvals -----
  ok(await waiting() === 5, 'staff sees 5 waiting (1 from the demo student + 4 others)');
  ok((await txt('#nav')).includes('Approvals5'), 'nav shows the waiting count');
  ok((await txt('article.card >> nth=0')).includes('Riley Okafor') && (await txt('article.card >> nth=0')).includes('45 words · minimum 40'), 'the reflection shows with its word count');
  await p.click('[data-action=s-back-open][data-key="me:a6"]'); await p.click('form[data-form=s-back] .btn');
  ok(await p.isVisible('#s-back-err'), 'send back needs a note');
  await p.fill('#note', 'Say what you will do next.'); await p.click('form[data-form=s-back] .btn');
  ok(await p.locator('article.card').count() === 4, 'sent back: 4 left waiting');
  await go('activity/a6');
  ok((await txt('main')).includes('Say what you will do next.') && (await p.inputValue('#text')).startsWith('word word'), 'student sees the note and their text to fix');
  await go('home'); ok((await txt('main')).includes('Sent back for changes'), 'student home flags the sent-back item');
  await go('activity/a6'); await p.fill('#text', Array(50).fill('better').join(' ')); await p.click('form .btn');
  await go('staff/approvals'); await p.click('[data-action=s-approve][data-key="me:a6"]');
  ok(await pts() === 195, 'staff approval gives the student 25 points (195)');
  await go('staff/approvals');
  await p.check('[data-action=s-sel][data-key=q1]'); await p.check('[data-action=s-sel][data-key=q2]');
  ok((await txt('#s-bulk')).includes('(2)') && await p.isEnabled('#s-bulk'), 'bulk button counts 2 selected');
  await p.click('#s-bulk');
  ok(await p.locator('article.card').count() === 2, 'bulk approve leaves 2 waiting');
  await p.check('#s-all'); ok((await txt('#s-bulk')).includes('(2)'), 'select all selects both');
  await p.uncheck('#s-all');
  await p.click('[data-action=s-back-open][data-key=q4]'); await p.fill('#note', 'This describes attending a group, not leading one.'); await p.click('form[data-form=s-back] .btn');
  ok(await p.locator('article.card').count() === 1, 'other student sent back: 1 waiting');
  await go('board'); const board = await txt('.board');
  ok(board.includes('Mei Tanaka290') && board.includes('Tom Reyes200'), 'approved students gained points on the leaderboard');
  await go('staff/overview'); const ov = await txt('main');
  ok(ov.includes('Sent back') && ov.includes('attending a group') && ov.includes('Approved'), 'overview logs the decisions');
  ok((await txt('.tiles')).startsWith('1waiting'), 'overview tile shows 1 waiting');

  // ----- staff: create, draft, publish, edit -----
  await go('staff/new'); await p.click('button[value=live]');
  ok((await txt('#s-err')).includes('title') && await p.evaluate(() => document.activeElement.id) === 'f-title', 'empty form: error names the title and focuses it');
  await p.fill('#f-title', 'Night hike to Carrow Ridge'); await p.fill('#f-blurb', 'A guided walk after dark. Bring a torch.');
  await p.click('button[value=live]'); ok((await txt('#s-err')).includes('competency'), 'needs a competency');
  await p.check('input[name=comps][value=lead]'); await p.selectOption('#f-depth', '2');
  ok(await p.inputValue('#f-points') === '25', 'points fill in from depth');
  await p.click('button[value=live]'); ok((await txt('#s-err')).includes('when'), 'event needs a time');
  await p.fill('#f-when', 'Today, 8:00 pm'); await p.fill('#f-where', 'North gate'); await p.selectOption('#f-window', 'open');
  const before = await p.inputValue('#f-code'); await p.click('[data-action=s-newcode]');
  ok(/^[A-Z]+-\d\d$/.test(before) && /^[A-Z]+-\d\d$/.test(await p.inputValue('#f-code')), 'check-in code generated: ' + before);
  await p.fill('#f-code', 'owl-77'); await p.click('button[value=live]'); await p.waitForTimeout(150);
  ok(p.url().endsWith('#/staff/activities') && (await txt('#s-list')).includes('Night hike to Carrow Ridge'), 'published; back on the list');
  await go('explore'); ok((await txt('#count')).endsWith('of 15 activities') && (await txt('#results')).includes('Night hike'), 'student sees the new event (15 activities)');
  await p.click('a.act:has-text("Night hike")'); await p.fill('#code', 'OWL-77'); await p.click('form .btn');
  ok(await pts() === 220, 'student checks in to the new event (220)');

  await go('staff/new'); await p.check('input[name=type][value=task]');
  ok(await p.isHidden('#fs-event') && await p.isVisible('#fs-task'), 'task type swaps the detail fields');
  await p.fill('#f-title', 'Volunteer log'); await p.fill('#f-blurb', 'Log your hours.'); await p.check('input[name=comps][value=comm2]');
  await p.selectOption('#f-proof', 'file'); ok(await p.isHidden('#row-min'), 'file proof hides minimum words');
  await p.click('button[value=draft]'); await p.waitForTimeout(150);
  ok((await txt('#s-list li:has-text("Volunteer log")')).includes('Draft'), 'saved as a draft');
  await go('explore'); ok((await txt('#count')).endsWith('of 15 activities'), 'student cannot see the draft');
  await go('staff/activities'); await p.click('li:has-text("Volunteer log") [data-action=s-toggle-live]');
  await go('explore'); ok((await txt('#count')).endsWith('of 16 activities'), 'publishing shows it to students (16)');

  await go('staff/edit/a3'); await p.fill('#f-title', 'Debate night: can growth be green?'); await p.click('button[value=live]'); await p.waitForTimeout(150);
  await go('activity/a3'); ok((await txt('h1')).includes('can growth be green'), 'edit to a built-in activity reaches the student');
  await go('staff/edit/s1'); ok((await txt('main')).includes('cannot be edited'), 'sets are read-only');
  await go('staff/activities'); await p.fill('#s-q', 'debate');
  ok((await txt('#s-count')).startsWith('1 of') && await p.evaluate(() => document.activeElement.id) === 's-q', 'activity search filters and keeps focus');

  // ----- staff: door view -----
  await go('activity/a3'); ok(!(await p.isVisible('#code')), 'upcoming event: student cannot check in yet');
  await go('staff/event/a3'); ok((await txt('.codebig')).includes('ASPEN-63'), 'door view shows the code');
  await p.click('[data-action=s-window]');
  await go('activity/a3'); ok(await p.isVisible('#code'), 'opening check-in lets the student check in');
  await go('staff/event/a4'); const c0 = +(await txt('.tile .n >> nth=0'));
  await p.check('[data-action=s-credit-sel][data-name="Riley Okafor"]'); await p.check('[data-action=s-credit-sel][data-name="Kofi Mensah"]');
  ok((await txt('#s-credit')).includes('(2)'), 'credit button counts 2');
  await p.click('#s-credit');
  ok(+(await txt('.tile .n >> nth=0')) === c0 + 2 && (await p.locator('.people .pill.ok').count()) === 2, 'credit given to 2; count rose by 2');
  ok(await pts() === 230, 'hand credit reaches the student (230)');
  await go('activity/a4'); ok((await txt('main')).includes('Completed'), 'student sees the credited event as completed');

  // ----- staff: students -----
  await go('staff/students');
  ok((await txt('tbody tr:has-text("Riley Okafor")')).includes('230') && (await p.locator('.pill.warn:has-text("Quiet")').count()) === 2, 'roster shows live points and 2 quiet students');
  await p.fill('#s-sq', 'chem'); ok((await txt('#s-scount')).startsWith('1 of 11'), 'student search filters');
  await p.fill('#s-sq', ''); await p.click('a:has-text("Riley Okafor")'); await p.waitForTimeout(150);
  ok((await txt('main')).includes('Completed') && (await txt('.tiles')).startsWith('230'), 'student record opens for staff');

  // ----- role switch, persistence, reset -----
  await p.click('#role a:has-text("Student")'); await p.waitForTimeout(150);
  ok(p.url().endsWith('#/home') && (await txt('#nav')).includes('Explore'), 'role switch returns to the student side');
  ok(await p.getAttribute('html', 'data-role') === 'student', 'role attribute follows the view');
  await p.reload(); ok(await pts() === 230, 'state survives a reload');
  await p.click('.side [data-action=reset]');
  ok(await pts() === 95 && await waiting() === 4, 'reset: 95 points and 4 waiting');
  await go('explore'); ok((await txt('#count')).endsWith('of 14 activities'), 'reset: catalog back to 14');
  ok(errs.length === 0, 'no console errors in the default look' + (errs.length ? ': ' + errs.slice(0, 3).join(' | ') : ''));

  // ----- brand packs -----
  const brandOf = () => p.getAttribute('html', 'data-brand');
  await go('home'); ok(await brandOf() === null && (await txt('#college')) === 'Northfield College', 'no brand by default');
  await p.goto(U + '?brand=example#/home'); await p.waitForTimeout(250);
  ok(await brandOf() === 'example', 'the example pack loads with ?brand=example');
  ok(await p.evaluate(() => { const i = document.querySelector('.brandlogo'); return !!i && i.complete && i.naturalWidth > 0; }), 'its logo shows in the sidebar');
  await go('explore'); ok((await txt('main')).includes('Larkspur University') && !(await txt('main')).includes('Northfield'), 'the college name changes throughout');
  ok((await txt('main .foot')).includes('Example brand pack'), 'the pack\'s note shows at the foot of the screen');
  await go('transcript'); ok(await p.isVisible('.paperlogo') && (await txt('.paper')).includes('Sample'), 'the transcript carries the logo and still says Sample');
  ok(await p.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--brand').trim()) === '#1f3f8f', 'the pack\'s colours apply');
  await p.goto(U + '#/home'); await p.waitForTimeout(250); ok(await brandOf() === 'example', 'the choice is remembered without the parameter');
  await p.click('.side [data-action=reset]'); ok(await brandOf() === 'example', 'resetting the demo keeps the brand');
  const before404 = errs.length;
  await p.goto(U + '?brand=no-such-pack#/home'); await p.waitForTimeout(300);
  ok(await brandOf() === null && await pts() === 95, 'a missing pack falls back to the default look');
  errs.length = before404; // the browser logs the 404 for the missing pack; that one is expected
  await p.goto(U + '?brand=default#/home'); await p.waitForTimeout(200); ok(await brandOf() === null, '?brand=default goes back');
  ok(errs.length === 0, 'no console errors with brand packs' + (errs.length ? ': ' + errs.slice(0, 3).join(' | ') : ''));
  await cx.close();

  await fits('example');
  for (const id of EXTRA) {
    await fits(id);
    const c2 = await b.newContext({ viewport: { width: 1200, height: 900 } }); const q = await c2.newPage(); watch(q);
    await q.goto(U + '?brand=' + id + '#/transcript'); await q.waitForTimeout(300);
    ok(await q.getAttribute('html', 'data-brand') === id, `[${id}] local pack loads`);
    ok(await q.evaluate(() => [...document.querySelectorAll('.brandlogo, .paperlogo')].every(i => i.complete && i.naturalWidth > 0) && document.querySelectorAll('.brandlogo, .paperlogo').length === 2), `[${id}] logo shows in the sidebar and on the transcript`);
    ok(!(await q.textContent('body')).includes('Northfield'), `[${id}] no trace of the default college's name`);
    await c2.close();
  }
  ok(errs.length === 0, 'no console errors at the end' + (errs.length ? ': ' + errs.slice(0, 3).join(' | ') : ''));
  await b.close(); console.log(fails ? `${fails} of ${n} FAILED` : `ALL ${n} PASSED`); process.exit(fails ? 1 : 0);
})();
