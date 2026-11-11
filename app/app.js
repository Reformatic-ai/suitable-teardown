(function () {
  'use strict';
  var D = window.WP_DATA;
  var KEY = 'waypoint-demo-v2';
  var main = document.getElementById('main');
  var ui = { q: '', comp: '', depth: '', type: '', board: 'students', formError: '' };

  // ---------- state ----------
  function fresh() { return JSON.parse(JSON.stringify(D.seed)); }
  function load() {
    try { var s = JSON.parse(localStorage.getItem(KEY)); if (s && s.completions) return s; } catch (e) {}
    return fresh();
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} }
  var state = load();

  // ---------- helpers ----------
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function act(id) { return D.activities.filter(function (a) { return a.id === id; })[0]; }
  function comp(id) { return D.competencies.filter(function (c) { return c.id === id; })[0]; }
  function today() { return new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }); }
  function words(t) { return (t.trim().match(/\S+/g) || []).length; }

  function status(a) { // 'done' | 'pending' | 'open'
    if (a.type === 'set') return a.parts.every(function (p) { return status(act(p)) === 'done'; }) ? 'done' : 'open';
    var c = state.completions[a.id];
    return c ? c.status : 'open';
  }
  // Order of completion: a set counts as finished when its last part was.
  function seq(a) {
    if (a.type === 'set') return Math.max.apply(null, a.parts.map(function (p) { return seq(act(p)); })) + 0.5;
    return (state.completions[a.id] || {}).seq || 0;
  }
  function doneList() {
    return D.activities.filter(function (a) { return status(a) === 'done'; }).sort(function (x, y) { return seq(x) - seq(y); });
  }
  function points() { return doneList().reduce(function (n, a) { return n + a.points; }, 0); }
  function level(p) {
    var cur = D.levels[0], next = null;
    D.levels.forEach(function (l, i) { if (p >= l.min) { cur = l; next = D.levels[i + 1] || null; } });
    return { cur: cur, next: next, pct: next ? Math.round(100 * (p - cur.min) / (next.min - cur.min)) : 100 };
  }
  function compCounts() {
    var m = {}; D.competencies.forEach(function (c) { m[c.id] = 0; });
    doneList().forEach(function (a) { a.comps.forEach(function (c) { m[c]++; }); });
    return m;
  }
  function badgeProgress(b) { // {have, need}
    var r = b.rule, done = doneList(), cc = compCounts();
    if (r.anyCount) return { have: Math.min(done.length, r.anyCount), need: r.anyCount };
    if (r.comp) return { have: Math.min(cc[r.comp], r.count), need: r.count };
    if (r.activity) {
      var a = act(r.activity);
      if (a.type === 'set') return { have: a.parts.filter(function (p) { return status(act(p)) === 'done'; }).length, need: a.parts.length };
      return { have: status(a) === 'done' ? 1 : 0, need: 1 };
    }
    if (r.depth) return { have: Math.min(done.filter(function (x) { return x.depth === r.depth; }).length, r.count), need: r.count };
    if (r.allComps) return { have: D.competencies.filter(function (c) { return cc[c.id] > 0; }).length, need: D.competencies.length };
    return { have: 0, need: 1 };
  }
  function earned() { return D.badges.filter(function (b) { var p = badgeProgress(b); return p.have >= p.need; }); }
  function completedAt(a) {
    if (a.type === 'set') return completedAt(a.parts.map(act).sort(function (x, y) { return seq(y) - seq(x); })[0]);
    return (state.completions[a.id] || {}).at || '';
  }

  var toastTimer;
  function toast(msg) {
    var t = document.getElementById('toast'); t.textContent = msg; t.classList.add('show');
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { t.classList.remove('show'); }, 2600);
  }
  // Run a change, then announce anything newly earned.
  function change(fn, msg) {
    var before = { p: points(), l: level(points()).cur.n, b: earned().map(function (b) { return b.id; }) };
    fn(); save();
    var p = points(), l = level(p).cur, nb = earned().filter(function (b) { return before.b.indexOf(b.id) < 0; });
    var parts = [msg];
    if (p > before.p) parts.push('+' + (p - before.p) + ' points');
    if (nb.length) parts.push('Badge earned: ' + nb.map(function (b) { return b.name; }).join(', '));
    if (l.n > before.l) parts.push('You reached ' + l.name);
    render(); toast(parts.filter(Boolean).join(' · '));
  }

  // ---------- small pieces ----------
  var ICON = {
    home: '<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
    explore: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.5-4.5"/>',
    record: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    transcript: '<path d="M6 3h9l4 4v14H6z"/><path d="M9 12h7M9 16h7M9 8h3"/>',
    orgs: '<circle cx="8" cy="9" r="3"/><circle cx="17" cy="10" r="2.5"/><path d="M2 20c0-3 3-5 6-5s6 2 6 5M15 15c3 0 6 1.500 6 4.500"/>',
    board: '<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0zM7 6H4c0 3 1.500 4 3 4M17 6h3c0 3-1.500 4-3 4"/>',
  };
  function icon(n) { return '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.800" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICON[n] + '</svg>'; }
  var NAV = [['home', 'Home'], ['explore', 'Explore'], ['record', 'My record'], ['transcript', 'Transcript'], ['orgs', 'Organizations'], ['board', 'Leaderboard']];
  var TABS = [['home', 'Home'], ['explore', 'Explore'], ['record', 'Record'], ['orgs', 'Orgs'], ['board', 'Board']];

  function compTags(ids) {
    return ids.map(function (id) { var c = comp(id); return '<span class="comp"><i class="dot" style="background:' + c.color + '"></i>' + esc(c.name) + '</span>'; }).join(' ');
  }
  function statusPill(a) {
    var s = status(a);
    if (s === 'done') return '<span class="pill ok">Completed</span>';
    if (s === 'pending') return '<span class="pill warn">Waiting for approval</span>';
    if (a.type === 'event') return a.window === 'open' ? '<span class="pill live">Check-in open</span>' : a.window === 'upcoming' ? '<span class="pill">Upcoming</span>' : '<span class="pill">Ended</span>';
    return '';
  }
  var TYPE = { event: 'Event', task: 'Task', set: 'Set' };
  function card(a) {
    return '<a class="card act" href="#/activity/' + a.id + '">' +
      '<div class="row between"><span class="pill accent">' + TYPE[a.type] + ' · ' + esc(D.depths[a.depth]) + '</span><span class="pts">' + a.points + ' pts</span></div>' +
      '<h3>' + esc(a.title) + '</h3>' +
      '<div class="meta">' + esc(a.host) + (a.when ? ' · ' + esc(a.when) : '') + '</div>' +
      '<div class="row">' + compTags(a.comps) + '</div>' +
      '<div>' + statusPill(a) + '</div></a>';
  }

  // ---------- screens ----------
  function home() {
    var p = points(), L = level(p), cc = compCounts();
    var open = D.activities.filter(function (a) { return status(a) === 'open' && a.window !== 'closed'; });
    // Suggest what fills the thinnest competencies first.
    var next = open.slice().sort(function (x, y) {
      function need(a) { return Math.min.apply(null, a.comps.map(function (c) { return cc[c]; })); }
      return need(x) - need(y) || y.points - x.points;
    }).slice(0, 3);
    var soon = D.activities.filter(function (a) { return a.type === 'event' && a.window !== 'closed' && status(a) !== 'done'; }).slice(0, 3);
    var pend = D.activities.filter(function (a) { return status(a) === 'pending'; });
    return '<div class="stack">' +
      '<div class="head"><div><h1>Hello, ' + esc(D.me.name.split(' ')[0]) + '</h1><p class="sub">' + esc(D.me.program) + ' · ' + esc(D.me.year) + '</p></div></div>' +
      '<div class="card hero"><div class="row between"><div><div class="sub">Level ' + L.cur.n + '</div><h2>' + esc(L.cur.name) + '</h2></div>' +
        '<div style="text-align:right"><div class="big">' + p + '</div><div class="sub">points</div></div></div>' +
        '<div class="bar" style="margin:14px 0 8px" role="progressbar" aria-label="Progress to next level" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + L.pct + '"><i style="width:' + L.pct + '%"></i></div>' +
        '<div class="sub">' + (L.next ? (L.next.min - p) + ' points to ' + esc(L.next.name) : 'Top level reached') + ' · ' + earned().length + ' of ' + D.badges.length + ' badges</div></div>' +
      (pend.length ? '<div class="note">' + pend.length + ' submission' + (pend.length > 1 ? 's are' : ' is') + ' waiting for staff approval: ' + pend.map(function (a) { return '<a href="#/activity/' + a.id + '">' + esc(a.title) + '</a>'; }).join(', ') + '.</div>' : '') +
      '<section class="sect"><h2>Good next steps</h2><p class="sub" style="margin:-6px 0 10px">Picked to fill the competencies you have done least.</p><div class="grid">' + next.map(card).join('') + '</div></section>' +
      '<section class="sect"><div class="row between"><h2>Coming up</h2><a href="#/explore">See everything</a></div><div class="grid" style="margin-top:10px">' + soon.map(card).join('') + '</div></section>' +
      '</div>';
  }

  function matches(a) {
    var q = ui.q.trim().toLowerCase();
    return (!q || (a.title + ' ' + a.host + ' ' + a.blurb).toLowerCase().indexOf(q) >= 0) &&
      (!ui.comp || a.comps.indexOf(ui.comp) >= 0) && (!ui.depth || String(a.depth) === ui.depth) && (!ui.type || a.type === ui.type);
  }
  function results() {
    var list = D.activities.filter(matches);
    return '<p class="sub" id="count">' + list.length + ' of ' + D.activities.length + ' activities</p>' +
      (list.length ? '<div class="grid">' + list.map(card).join('') + '</div>' : '<div class="card">Nothing matches. Try removing a filter.</div>');
  }
  function opt(v, label, cur) { return '<option value="' + v + '"' + (cur === v ? ' selected' : '') + '>' + esc(label) + '</option>'; }
  function explore() {
    return '<div class="stack"><div class="head"><div><h1>Explore</h1><p class="sub">Everything you can do at ' + esc(D.college) + ' outside class.</p></div></div>' +
      '<div class="card"><div class="filters">' +
        '<div><label for="q">Search</label><input id="q" type="search" data-f="q" value="' + esc(ui.q) + '" placeholder="Title, host or keyword"></div>' +
        '<div><label for="fc">Competency</label><select id="fc" data-f="comp">' + opt('', 'All', ui.comp) + D.competencies.map(function (c) { return opt(c.id, c.name, ui.comp); }).join('') + '</select></div>' +
        '<div><label for="fd">Depth</label><select id="fd" data-f="depth">' + opt('', 'All', ui.depth) + Object.keys(D.depths).map(function (k) { return opt(k, D.depths[k], ui.depth); }).join('') + '</select></div>' +
        '<div><label for="ft">Type</label><select id="ft" data-f="type">' + opt('', 'All', ui.type) + opt('event', 'Events', ui.type) + opt('task', 'Tasks', ui.type) + opt('set', 'Sets', ui.type) + '</select></div>' +
      '</div></div><div id="results" class="stack" aria-live="polite">' + results() + '</div></div>';
  }

  function howTo(a) {
    var s = status(a), c = state.completions[a.id] || {};
    if (s === 'done') {
      return '<div class="card"><span class="pill ok">Completed</span><p style="margin-top:8px">You earned ' + a.points + ' points' + (completedAt(a) ? ' on ' + esc(completedAt(a)) : '') + '.</p>' +
        (c.text ? '<p class="hint">Your reflection: “' + esc(c.text) + '”</p>' : '') + (c.file ? '<p class="hint">Your file: ' + esc(c.file) + '</p>' : '') + '</div>';
    }
    if (s === 'pending') {
      return '<div class="card"><span class="pill warn">Waiting for approval</span><p style="margin-top:8px">Staff at ' + esc(a.host) + ' will review what you sent. Points arrive when they approve.</p>' +
        (c.text ? '<p class="hint">You wrote: “' + esc(c.text) + '”</p>' : '') + (c.file ? '<p class="hint">You sent: ' + esc(c.file) + '</p>' : '') +
        '<div class="note" style="margin-top:12px"><strong>Demo only.</strong> There is no staff side in this prototype, so you can stand in for them. <div style="margin-top:8px"><button class="btn ghost" data-action="approve" data-id="' + a.id + '">Approve as staff</button></div></div></div>';
    }
    var err = ui.formError ? '<p class="err" role="alert">' + esc(ui.formError) + '</p>' : '';
    if (a.type === 'set') {
      return '<div class="card"><h2>Parts of this set</h2><div class="grid" style="margin-top:10px">' + a.parts.map(function (p) { return card(act(p)); }).join('') + '</div></div>';
    }
    if (a.type === 'event') {
      if (a.window !== 'open') {
        return '<div class="card"><h2>Check in</h2><p class="sub" style="margin-top:6px">' + (a.window === 'upcoming' ? 'Check-in opens when the event starts. The code is shown at the door.' : 'This event has ended, so check-in is closed. If you were there, ask ' + esc(a.host) + ' to give you credit.') + '</p></div>';
      }
      return '<form class="card" data-form="checkin" data-id="' + a.id + '"><h2>Check in</h2><p class="sub" style="margin:6px 0 12px">Enter the code shown at the event. It only works while the event is on.</p>' +
        '<label for="code">Event code</label><input id="code" name="code" type="text" autocomplete="off" autocapitalize="characters" placeholder="For example MAPLE-12" required>' + err +
        '<p class="hint">Demo: the code for this event is <strong>' + esc(a.code) + '</strong>.</p><div style="margin-top:12px"><button class="btn">Check in</button></div></form>';
    }
    if (a.proof === 'file') {
      return '<form class="card" data-form="file" data-id="' + a.id + '"><h2>Send your work</h2><p class="sub" style="margin:6px 0 12px">Upload one file. ' + esc(a.host) + ' will review it.</p>' +
        '<label for="file">File</label><input id="file" name="file" type="file" required>' + err +
        '<p class="hint">Demo: the file stays on your device. Only its name is kept.</p><div style="margin-top:12px"><button class="btn">Send for approval</button></div></form>';
    }
    return '<form class="card" data-form="reflect" data-id="' + a.id + '"><h2>Write your reflection</h2><p class="sub" style="margin:6px 0 12px">At least ' + a.minWords + ' words. ' + (a.approval ? esc(a.host) + ' will review it.' : 'Credit is given as soon as you submit.') + '</p>' +
      '<label for="text">Reflection</label><textarea id="text" name="text" required></textarea><p class="hint" id="wc">0 words</p>' + err +
      '<div style="margin-top:12px"><button class="btn">' + (a.approval ? 'Send for approval' : 'Submit') + '</button></div></form>';
  }
  function activity(id) {
    var a = act(id); if (!a) return '<div class="card">That activity was not found. <a href="#/explore">Back to Explore</a></div>';
    var inSets = D.activities.filter(function (s) { return s.type === 'set' && s.parts.indexOf(a.id) >= 0; });
    return '<div class="stack"><div><a class="back" href="#/explore">← Explore</a>' +
      '<div class="row" style="margin-bottom:8px"><span class="pill accent">' + TYPE[a.type] + ' · ' + esc(D.depths[a.depth]) + '</span>' + statusPill(a) + '</div>' +
      '<h1>' + esc(a.title) + '</h1><p class="sub" style="margin-top:4px">' + esc(a.host) + '</p></div>' +
      '<div class="card stack"><p>' + esc(a.blurb) + '</p>' +
        (a.when ? '<div><strong>When</strong><br>' + esc(a.when) + '</div><div><strong>Where</strong><br>' + esc(a.where) + '</div>' : '') +
        '<div><strong>Builds</strong><br><span class="row" style="margin-top:4px">' + compTags(a.comps) + '</span></div>' +
        '<div><strong>Worth</strong><br><span class="pts">' + a.points + ' points</span></div>' +
        (inSets.length ? '<div><strong>Part of</strong><br>' + inSets.map(function (s) { return '<a href="#/activity/' + s.id + '">' + esc(s.title) + '</a>'; }).join(', ') + '</div>' : '') +
      '</div>' + howTo(a) + '</div>';
  }

  function record() {
    var cc = compCounts(), max = Math.max.apply(null, Object.keys(cc).map(function (k) { return cc[k]; }).concat([4]));
    var done = doneList();
    return '<div class="stack"><div class="head"><div><h1>My record</h1><p class="sub">' + points() + ' points · ' + done.length + ' completed</p></div><a class="btn ghost" href="#/transcript">Open transcript</a></div>' +
      '<section class="card"><h2>Competency map</h2><div class="cmap" style="margin-top:12px">' + D.competencies.map(function (c) {
        return '<div class="line"><span>' + esc(c.name) + '</span><div class="bar" role="img" aria-label="' + esc(c.name) + ': ' + cc[c.id] + ' completed"><i style="width:' + Math.round(100 * cc[c.id] / max) + '%;background:' + c.color + '"></i></div><strong>' + cc[c.id] + '</strong></div>';
      }).join('') + '</div></section>' +
      '<section class="sect"><h2>Badges</h2><div class="grid">' + D.badges.map(function (b) {
        var p = badgeProgress(b), got = p.have >= p.need;
        return '<div class="card badge' + (got ? ' got' : '') + '"><div class="medal" aria-hidden="true">' + esc(b.name.charAt(0)) + '</div><div><h3>' + esc(b.name) + '</h3><p class="sub" style="font-size:14px">' + esc(b.desc) + '</p>' +
          (got ? '<span class="pill ok" style="margin-top:6px">Earned</span>' : '<div class="bar" style="margin-top:8px"><i style="width:' + Math.round(100 * p.have / p.need) + '%"></i></div><p class="hint">' + p.have + ' of ' + p.need + '</p>') + '</div></div>';
      }).join('') + '</div></section>' +
      '<section class="card"><h2>Timeline</h2>' + (done.length ? '<ul class="tl" style="margin-top:6px">' + done.slice().reverse().map(function (a) {
        return '<li><span class="d">' + esc(completedAt(a)) + '</span><a href="#/activity/' + a.id + '">' + esc(a.title) + '</a><span class="pts">+' + a.points + '</span></li>';
      }).join('') + '</ul>' : '<p class="sub">Nothing yet. <a href="#/explore">Find something to do.</a></p>') + '</section></div>';
  }

  function transcript() {
    var done = doneList(), cc = compCounts(), L = level(points());
    return '<div class="stack"><div class="head noprint"><div><h1>Transcript</h1><p class="sub">Your official record of what you did outside class.</p></div>' +
      '<button class="btn" data-action="print">Print or save as PDF</button></div>' +
      '<div class="card noprint"><label class="switch"><input type="checkbox" data-action="share"' + (state.share ? ' checked' : '') + '> Share with a link</label>' +
        (state.share ? '<p class="hint">Anyone with this link can view your transcript: <strong>waypoint.example/t/riley-okafor-7f3k</strong> (demo link, not live)</p>' : '<p class="hint">Off. Only you and college staff can see it.</p>') + '</div>' +
      '<div class="paper"><div class="row between"><div><h2>' + esc(D.college) + '</h2><div class="muted">Co-curricular transcript</div></div><div class="muted" style="text-align:right">Issued ' + esc(today()) + '<br>Sample — not an official document</div></div><hr class="rule">' +
        '<h3>' + esc(D.me.name) + '</h3><div class="muted">' + esc(D.me.program) + ' · ' + esc(D.me.year) + '</div>' +
        '<p style="margin-top:10px"><strong>' + points() + '</strong> points · Level ' + L.cur.n + ', ' + esc(L.cur.name) + ' · <strong>' + done.length + '</strong> ' + (done.length === 1 ? 'activity' : 'activities') + ' · <strong>' + earned().length + '</strong> ' + (earned().length === 1 ? 'badge' : 'badges') + '</p>' +
        '<h3 style="margin-top:18px">Competencies</h3><p class="muted">' + D.competencies.map(function (c) { return esc(c.name) + ' (' + cc[c.id] + ')'; }).join(' · ') + '</p>' +
        '<h3 style="margin-top:18px">Badges</h3><p>' + (earned().map(function (b) { return esc(b.name); }).join(' · ') || '<span class="muted">None yet</span>') + '</p>' +
        '<h3 style="margin-top:18px">Verified activities</h3><div class="scroll"><table><thead><tr><th>Date</th><th>Activity</th><th>Host</th><th>Depth</th><th>Competencies</th><th>Points</th></tr></thead><tbody>' +
        (done.map(function (a) { return '<tr><td>' + esc(completedAt(a)) + '</td><td>' + esc(a.title) + '</td><td>' + esc(a.host) + '</td><td>' + esc(D.depths[a.depth]) + '</td><td>' + a.comps.map(function (c) { return esc(comp(c).name); }).join(', ') + '</td><td>' + a.points + '</td></tr>'; }).join('') || '<tr><td colspan="6" class="muted">No completed activities yet.</td></tr>') +
        '</tbody></table></div></div></div>';
  }

  function orgs() {
    return '<div class="stack"><div class="head"><div><h1>Organizations</h1><p class="sub">' + D.orgs.length + ' student groups at ' + esc(D.college) + '</p></div></div><div class="grid">' + D.orgs.map(function (o) {
      var j = state.joined.indexOf(o.id) >= 0;
      return '<a class="card act" href="#/org/' + o.id + '"><div class="row between"><span class="pill">' + esc(o.kind) + '</span>' + (j ? '<span class="pill ok">Member</span>' : '') + '</div><h3>' + esc(o.name) + '</h3><p class="meta">' + esc(o.about) + '</p><div class="meta">' + (o.members + (j ? 1 : 0)) + ' members</div></a>';
    }).join('') + '</div></div>';
  }
  function org(id) {
    var o = D.orgs.filter(function (x) { return x.id === id; })[0]; if (!o) return '<div class="card">That organization was not found. <a href="#/orgs">Back</a></div>';
    var j = state.joined.indexOf(o.id) >= 0;
    return '<div class="stack"><div><a class="back" href="#/orgs">← Organizations</a><div class="head"><div><span class="pill">' + esc(o.kind) + '</span><h1 style="margin-top:8px">' + esc(o.name) + '</h1><p class="sub">' + (o.members + (j ? 1 : 0)) + ' members</p></div>' +
      '<button class="btn' + (j ? ' ghost' : '') + '" data-action="join" data-id="' + o.id + '" aria-pressed="' + j + '">' + (j ? 'Leave' : 'Join') + '</button></div></div>' +
      '<div class="card"><p>' + esc(o.about) + '</p></div>' +
      '<section class="card"><h2>People</h2><ul class="people" style="margin-top:10px">' + o.people.map(function (p) {
        return '<li><span class="avatar" aria-hidden="true">' + esc(p[0].split(' ').map(function (w) { return w.charAt(0); }).join('')) + '</span><span><strong>' + esc(p[0]) + '</strong><br><span class="sub">' + esc(p[1]) + '</span></span></li>';
      }).join('') + (j ? '<li><span class="avatar" aria-hidden="true">' + esc(D.me.initials) + '</span><span><strong>' + esc(D.me.name) + '</strong> (you)<br><span class="sub">Member</span></span></li>' : '') + '</ul></section>' +
      '<section class="sect"><h2>Activities from this group</h2>' + (o.events.length ? '<div class="grid">' + o.events.map(function (e) { return card(act(e)); }).join('') + '</div>' : '<div class="card sub">Nothing listed right now.</div>') + '</section></div>';
  }

  function board() {
    var rows, students = ui.board === 'students';
    if (students) {
      rows = D.peers.map(function (p) { return { name: p.name, points: p.points }; });
      if (!state.optOut) rows.push({ name: D.me.name + ' (you)', points: points(), me: true });
    } else rows = D.groups.slice();
    rows.sort(function (a, b) { return b.points - a.points; });
    return '<div class="stack"><div class="head"><div><h1>Leaderboard</h1><p class="sub">This term at ' + esc(D.college) + '</p></div>' +
      '<div class="seg" role="group" aria-label="Board"><button data-action="seg" data-v="students" aria-pressed="' + students + '">Students</button><button data-action="seg" data-v="groups" aria-pressed="' + !students + '">Groups</button></div></div>' +
      '<div class="card"><label class="switch"><input type="checkbox" data-action="optout"' + (state.optOut ? ' checked' : '') + '> Hide me from the leaderboard</label>' +
        '<p class="hint">' + (state.optOut ? 'You are hidden. You still earn points, levels and badges.' : 'Other students can see your name and points here.') + '</p></div>' +
      '<div class="card"><ol class="board">' + rows.map(function (r) { return '<li' + (r.me ? ' class="me"' : '') + '><span>' + esc(r.name) + '</span><span class="pts">' + r.points + '</span></li>'; }).join('') + '</ol></div></div>';
  }

  // ---------- routing ----------
  function route() { var h = location.hash.replace(/^#\/?/, '').split('/'); return { name: h[0] || 'home', id: h[1] }; }
  function render(keepScroll) {
    var r = route(), html;
    if (r.name === 'explore') html = explore();
    else if (r.name === 'activity') html = activity(r.id);
    else if (r.name === 'record') html = record();
    else if (r.name === 'transcript') html = transcript();
    else if (r.name === 'orgs') html = orgs();
    else if (r.name === 'org') html = org(r.id);
    else if (r.name === 'board') html = board();
    else { r.name = 'home'; html = home(); }
    main.innerHTML = html;
    var sect = { activity: 'explore', org: 'orgs' }[r.name] || r.name;
    function links(list, withIcon) {
      return list.map(function (n) {
        var on = n[0] === sect || (list === TABS && sect === 'transcript' && n[0] === 'record');
        return '<a href="#/' + n[0] + '"' + (on ? ' class="on" aria-current="page"' : '') + '>' + icon(n[0]) + '<span>' + n[1] + '</span></a>';
      }).join('');
    }
    document.getElementById('nav').innerHTML = links(NAV);
    document.getElementById('tabs').innerHTML = links(TABS);
    document.title = D.appName;
  }
  function go() { ui.formError = ''; render(); window.scrollTo(0, 0); main.focus({ preventScroll: true }); }

  // ---------- events ----------
  function applyTheme() { if (state.theme) document.documentElement.setAttribute('data-theme', state.theme); else document.documentElement.removeAttribute('data-theme'); }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-action]'); if (!b || b.tagName === 'INPUT') return;
    var a = b.getAttribute('data-action'), id = b.getAttribute('data-id');
    if (a === 'theme') {
      var dark = state.theme ? state.theme === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
      state.theme = dark ? 'light' : 'dark'; save(); applyTheme();
    } else if (a === 'reset') {
      var th = state.theme; state = fresh(); state.theme = th; save(); ui.formError = ''; render(); toast('Demo reset to its starting point');
    } else if (a === 'approve') {
      change(function () { state.completions[id].status = 'done'; state.completions[id].at = today(); state.completions[id].seq = Date.now(); }, 'Approved');
    } else if (a === 'join') {
      var i = state.joined.indexOf(id), name = D.orgs.filter(function (o) { return o.id === id; })[0].name;
      if (i >= 0) state.joined.splice(i, 1); else state.joined.push(id);
      save(); render(); toast((i >= 0 ? 'You left ' : 'You joined ') + name);
    } else if (a === 'seg') { ui.board = b.getAttribute('data-v'); render(); }
    else if (a === 'print') window.print();
  });
  document.addEventListener('change', function (e) {
    var t = e.target, a = t.getAttribute('data-action');
    if (a === 'optout') { state.optOut = t.checked; save(); render(); toast(t.checked ? 'You are hidden from the leaderboard' : 'You are back on the leaderboard'); }
    else if (a === 'share') { state.share = t.checked; save(); render(); toast(t.checked ? 'Sharing is on' : 'Sharing is off'); }
    else if (t.getAttribute('data-f')) { ui[t.getAttribute('data-f')] = t.value; document.getElementById('results').innerHTML = results(); }
  });
  document.addEventListener('input', function (e) {
    var t = e.target;
    if (t.getAttribute('data-f') === 'q') { ui.q = t.value; document.getElementById('results').innerHTML = results(); }
    if (t.id === 'text') document.getElementById('wc').textContent = words(t.value) + ' words';
  });
  document.addEventListener('submit', function (e) {
    var f = e.target, kind = f.getAttribute('data-form'); if (!kind) return;
    e.preventDefault();
    var a = act(f.getAttribute('data-id'));
    function fail(msg, field) { ui.formError = msg; render(); var el = document.getElementById(field); if (el) el.focus(); }
    if (kind === 'checkin') {
      var code = f.code.value.trim().toUpperCase();
      if (code !== a.code) return fail('That code does not match this event. Check the code at the door and try again.', 'code');
      ui.formError = '';
      change(function () { state.completions[a.id] = { status: 'done', at: today(), seq: Date.now() }; }, 'Checked in');
    } else if (kind === 'reflect') {
      var text = f.text.value.trim(), n = words(text);
      if (n < a.minWords) { var keep = f.text.value; fail('Your reflection has ' + n + ' words. It needs at least ' + a.minWords + '.', 'text'); var ta = document.getElementById('text'); if (ta) { ta.value = keep; document.getElementById('wc').textContent = n + ' words'; } return; }
      ui.formError = '';
      change(function () { state.completions[a.id] = { status: a.approval ? 'pending' : 'done', at: today(), seq: Date.now(), text: text }; }, a.approval ? 'Sent for approval' : 'Submitted');
    } else if (kind === 'file') {
      var file = f.file.files && f.file.files[0];
      if (!file) return fail('Choose a file first.', 'file');
      ui.formError = '';
      change(function () { state.completions[a.id] = { status: 'pending', at: today(), seq: Date.now(), file: file.name }; }, 'Sent for approval');
    }
  });
  window.addEventListener('hashchange', go);

  // ---------- start ----------
  document.getElementById('brandName').textContent = D.appName;
  document.getElementById('brandName2').textContent = D.appName;
  document.getElementById('college').textContent = D.college;
  applyTheme();
  render();
})();
