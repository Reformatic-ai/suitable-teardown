// The staff side: overview, approvals, activities (create, edit, door view) and students.
// It shares state with the student side through window.WP (see the end of app.js),
// so a decision made here shows up for the student straight away.
(function () {
  'use strict';
  var WP = window.WP, D = WP.D, esc = WP.esc;
  var sui = { back: null, sel: {}, credit: {}, q: '', sq: '' };
  var TREES = ['OAK', 'BIRCH', 'ROWAN', 'ALDER', 'HAZEL', 'LARCH', 'WILLOW', 'YEW', 'MAPLE', 'LINDEN'];

  WP.ICON.overview = '<rect x="3" y="3" width="8" height="8" rx="1.500"/><rect x="13" y="3" width="8" height="5" rx="1.500"/><rect x="13" y="12" width="8" height="9" rx="1.500"/><rect x="3" y="15" width="8" height="6" rx="1.500"/>';
  WP.ICON.approvals = '<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 12l3 3 5-6"/>';
  WP.ICON.activities = '<path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.500" cy="6" r="1"/><circle cx="4.500" cy="12" r="1"/><circle cx="4.500" cy="18" r="1"/>';
  WP.ICON.students = WP.ICON.orgs;

  // ---------- helpers ----------
  function S() { return WP.s(); }
  function el(id) { return document.getElementById(id); }
  function plural(n, one, many) { return n + ' ' + (n === 1 ? one : many); }
  function newCode() { return TREES[Math.floor(Math.random() * TREES.length)] + '-' + (10 + Math.floor(Math.random() * 90)); }
  function isLive(a) { return a.live !== false; }
  function notFound(msg) { return '<div class="card">' + msg + ' <a href="#/staff/activities">Back to Activities</a></div>'; }
  function typeLine(a) { return WP.TYPE[a.type] + ' · ' + esc(D.depths[a.depth]) + ' · ' + a.points + ' pts'; }
  function done(msg) { WP.save(); WP.render(); WP.toast(msg); el('main').focus({ preventScroll: true }); }

  // Everything waiting for a decision: the demo student's own submissions, then other students'.
  function queue() {
    var s = S();
    var mine = Object.keys(s.completions).filter(function (id) { return s.completions[id].status === 'pending' && WP.act(id); }).map(function (id) {
      var c = s.completions[id];
      return { key: 'me:' + id, me: true, student: D.me.name, activity: id, at: c.at, text: c.text, file: c.file };
    });
    return mine.concat(s.queue.map(function (q) { return { key: q.id, student: q.student, activity: q.activity, at: q.at, text: q.text, file: q.file }; }));
  }
  function item(key) { return queue().filter(function (q) { return q.key === key; })[0]; }
  function log(student, a, decision, note) {
    var s = S();
    s.log.unshift({ at: WP.today(), student: student, title: a.title, decision: decision, note: note || '' });
    s.log = s.log.slice(0, 20);
  }
  function creditOther(name, a) {
    var s = S();
    (s.others[a.id] = s.others[a.id] || []).push(name);
    s.peerBonus[name] = (s.peerBonus[name] || 0) + a.points;
  }
  function approve(q) {
    var s = S(), a = WP.act(q.activity);
    if (q.me) { var c = s.completions[q.activity]; c.status = 'done'; c.at = WP.today(); c.seq = Date.now(); delete c.note; }
    else { s.queue = s.queue.filter(function (x) { return x.id !== q.key; }); creditOther(q.student, a); }
    log(q.student, a, 'Approved');
  }
  function sendBack(q, note) {
    var s = S(), a = WP.act(q.activity);
    if (q.me) { var c = s.completions[q.activity]; c.status = 'returned'; c.note = note; }
    else s.queue = s.queue.filter(function (x) { return x.id !== q.key; });
    log(q.student, a, 'Sent back', note);
  }
  function doneCount(a) { return (D.baseDone[a.id] || 0) + (S().others[a.id] || []).length + (WP.status(a) === 'done' ? 1 : 0); }
  function roster() {
    var s = S();
    var me = { name: D.me.name, program: D.me.program, points: WP.points(), last: 'Today', me: true };
    return [me].concat(D.peers.map(function (x) {
      return { name: x.name, program: x.program, points: x.points + (s.peerBonus[x.name] || 0), last: x.last, quiet: !!x.quiet };
    })).sort(function (a, b) { return b.points - a.points; });
  }
  // Change fields of an activity, whether built-in or created by staff.
  function setFields(id, f) {
    var s = S(), i = s.custom.map(function (a) { return a.id; }).indexOf(id);
    if (i >= 0) s.custom[i] = Object.assign({}, s.custom[i], f);
    else s.edits[id] = Object.assign({}, s.edits[id] || {}, f);
  }

  // ---------- overview ----------
  function tile(n, label, href) {
    return '<a class="card tile" href="' + href + '"><div class="n">' + n + '</div><div class="l">' + label + '</div></a>';
  }
  function overview() {
    var q = queue(), all = WP.acts(), liveA = all.filter(isLive), drafts = all.length - liveA.length;
    var total = all.reduce(function (n, a) { return n + doneCount(a); }, 0);
    var r = roster(), quiet = r.filter(function (x) { return x.quiet; });
    var doors = liveA.filter(function (a) { return a.type === 'event' && a.window === 'open'; });
    var cover = D.competencies.map(function (c) { return { c: c, n: liveA.filter(function (a) { return a.comps.indexOf(c.id) >= 0; }).length }; });
    var ns = cover.map(function (x) { return x.n; }), max = Math.max.apply(null, ns.concat([1])), min = Math.min.apply(null, ns);
    var todo = [];
    doors.forEach(function (a) { todo.push(['Check-in is open for <strong>' + esc(a.title) + '</strong>', '#/staff/event/' + a.id, 'Door view']); });
    if (q.length) todo.push([plural(q.length, 'submission is', 'submissions are') + ' waiting for a decision', '#/staff/approvals', 'Review']);
    if (quiet.length) todo.push([plural(quiet.length, 'student has', 'students have') + ' done nothing for 30 days or more', '#/staff/students', 'See students']);
    if (drafts) todo.push([plural(drafts, 'activity is', 'activities are') + ' saved as a draft', '#/staff/activities', 'See drafts']);
    var lg = S().log;
    return '<div class="stack">' +
      '<div class="head"><div><h1>Staff overview</h1><p class="sub">' + esc(D.staff.name) + ' · ' + esc(D.staff.unit) + ' · ' + esc(D.college) + '</p></div>' +
        '<a class="btn" href="#/staff/new">New activity</a></div>' +
      '<div class="tiles">' + tile(q.length, 'waiting for approval', '#/staff/approvals') + tile(liveA.length, 'live activities', '#/staff/activities') +
        tile(total, 'completions this term', '#/staff/activities') + tile(r.length, 'students', '#/staff/students') + '</div>' +
      '<section class="card"><h2>Right now</h2>' + (todo.length ? '<ul class="todo">' + todo.map(function (t) {
        return '<li><span>' + t[0] + '</span><a class="btn ghost sm" href="' + t[1] + '">' + t[2] + '</a></li>';
      }).join('') + '</ul>' : '<p class="sub" style="margin-top:6px">Nothing needs you right now.</p>') + '</section>' +
      '<section class="card"><h2>What the catalog covers</h2><p class="sub" style="margin:4px 0 12px">Live activities that build each competency. A short bar is a gap to fill.</p><div class="cmap">' + cover.map(function (x) {
        return '<div class="line"><span>' + esc(x.c.name) + (x.n === min ? ' <span class="pill warn">Thinnest</span>' : '') + '</span><div class="bar" role="img" aria-label="' + esc(x.c.name) + ': ' + x.n + ' activities"><i style="width:' + Math.round(100 * x.n / max) + '%;background:' + x.c.color + '"></i></div><strong>' + x.n + '</strong></div>';
      }).join('') + '</div></section>' +
      '<section class="card"><h2>Recent decisions</h2>' + (lg.length ? '<ul class="tl" style="margin-top:6px">' + lg.slice(0, 6).map(function (l) {
        return '<li><span class="d">' + esc(l.at) + '</span><span><strong>' + esc(l.student) + '</strong> · ' + esc(l.title) + (l.note ? '<br><span class="sub">“' + esc(l.note) + '”</span>' : '') + '</span>' +
          '<span class="pill ' + (l.decision === 'Sent back' ? 'warn' : 'ok') + '">' + esc(l.decision) + '</span></li>';
      }).join('') + '</ul>' : '<p class="sub" style="margin-top:6px">No decisions yet.</p>') + '</section>' +
      '<p class="fine">Prototype: anyone can open this view. A real build puts it behind a staff sign-in and records who decided what.</p></div>';
  }

  // ---------- approvals ----------
  function approvals() {
    var q = queue(), nsel = q.filter(function (x) { return sui.sel[x.key]; }).length;
    var head = '<div class="head"><div><h1>Approvals</h1><p class="sub">' + plural(q.length, 'submission', 'submissions') + ' waiting</p></div></div>';
    if (!q.length) return '<div class="stack">' + head + '<div class="card">Nothing is waiting. New submissions appear here as students send them.</div></div>';
    return '<div class="stack">' + head +
      '<div class="card row between"><label class="switch"><input type="checkbox" id="s-all" data-action="s-all"' + (nsel === q.length ? ' checked' : '') + '> Select all</label>' +
        '<button class="btn" id="s-bulk" data-action="s-approve-sel"' + (nsel ? '' : ' disabled') + '>Approve selected (' + nsel + ')</button></div>' +
      q.map(function (x) {
        var a = WP.act(x.activity), n = x.text ? WP.words(x.text) : 0;
        return '<article class="card stack">' +
          '<div class="row between"><label class="switch"><input type="checkbox" data-action="s-sel" data-key="' + x.key + '"' + (sui.sel[x.key] ? ' checked' : '') + '>' +
            '<span><strong>' + esc(x.student) + '</strong> · ' + esc(a.title) + '</span></label><span class="pts">' + a.points + ' pts</span></div>' +
          '<div class="row"><span class="pill accent">' + WP.TYPE[a.type] + ' · ' + esc(D.depths[a.depth]) + '</span><span class="meta">Sent ' + esc(x.at) + '</span>' + WP.compTags(a.comps) + '</div>' +
          '<p class="hint" style="margin:0"><strong>Asked for:</strong> ' + esc(a.blurb) + '</p>' +
          (x.text ? '<blockquote class="q">' + esc(x.text) + '</blockquote><p class="hint" style="margin:0">' + n + ' words' + (a.minWords ? ' · minimum ' + a.minWords : '') + '</p>'
                  : '<p>File: <strong>' + esc(x.file) + '</strong> <span class="hint">(demo: files are not stored, only the name)</span></p>') +
          (sui.back === x.key
            ? '<form data-form="s-back" data-key="' + x.key + '"><label for="note">What should ' + esc(x.student.split(' ')[0]) + ' change?</label>' +
              '<textarea id="note" name="note" style="min-height:90px"></textarea><p class="err" id="s-back-err" role="alert" hidden></p>' +
              '<div class="row" style="margin-top:10px"><button class="btn">Send back</button><button type="button" class="btn ghost" data-action="s-back-cancel">Cancel</button></div></form>'
            : '<div class="row"><button class="btn" data-action="s-approve" data-key="' + x.key + '">Approve</button>' +
              '<button class="btn ghost" data-action="s-back-open" data-key="' + x.key + '">Send back</button></div>') +
          '</article>';
      }).join('') + '</div>';
  }
  function syncBulk() {
    var q = queue(), n = q.filter(function (x) { return sui.sel[x.key]; }).length, btn = el('s-bulk'), all = el('s-all');
    if (btn) { btn.disabled = !n; btn.textContent = 'Approve selected (' + n + ')'; }
    if (all) all.checked = q.length > 0 && n === q.length;
  }

  // ---------- activities ----------
  function manageList() {
    var q = sui.q.trim().toLowerCase(), all = WP.acts();
    var list = all.filter(function (a) { return !q || (a.title + ' ' + a.host).toLowerCase().indexOf(q) >= 0; });
    return '<p class="sub" id="s-count">' + list.length + ' of ' + all.length + ' activities</p>' + (list.length ? '<ul class="rows">' + list.map(function (a) {
      var canEdit = a.type !== 'set';
      return '<li class="card rowitem"><div class="grow"><h3>' + (canEdit ? '<a href="#/staff/edit/' + a.id + '">' + esc(a.title) + '</a>' : esc(a.title)) + '</h3>' +
        '<div class="meta">' + typeLine(a) + ' · ' + esc(a.host) + (a.when ? ' · ' + esc(a.when) : '') + '</div>' +
        '<div class="row" style="margin-top:8px">' + (isLive(a) ? '<span class="pill ok">Live</span>' : '<span class="pill">Draft</span>') +
          (a.type === 'event' ? (a.window === 'open' ? '<span class="pill live">Check-in open</span>' : a.window === 'upcoming' ? '<span class="pill">Check-in not open yet</span>' : '<span class="pill">Check-in closed</span>') : '') +
          '<span class="meta">' + doneCount(a) + ' completed</span></div></div>' +
        '<div class="row">' + (a.type === 'event' ? '<a class="btn ghost sm" href="#/staff/event/' + a.id + '">Door view</a>' : '') +
          (canEdit ? '<a class="btn ghost sm" href="#/staff/edit/' + a.id + '">Edit</a>' : '') +
          '<button class="btn ghost sm" data-action="s-toggle-live" data-id="' + a.id + '">' + (isLive(a) ? 'Unpublish' : 'Publish') + '</button></div></li>';
    }).join('') + '</ul>' : '<div class="card">Nothing matches that search.</div>');
  }
  function manage() {
    return '<div class="stack"><div class="head"><div><h1>Activities</h1><p class="sub">Everything in the catalog, live and draft.</p></div><a class="btn" href="#/staff/new">New activity</a></div>' +
      '<div class="card"><label for="s-q">Search</label><input id="s-q" type="search" value="' + esc(sui.q) + '" placeholder="Title or host"></div>' +
      '<div id="s-list" class="stack" aria-live="polite">' + manageList() + '</div></div>';
  }

  // ---------- new / edit ----------
  function field(id, label, html, hint) {
    return '<div><label for="' + id + '">' + label + '</label>' + html + (hint ? '<p class="hint">' + hint + '</p>' : '') + '</div>';
  }
  function form(id) {
    var a = id ? WP.act(id) : null;
    if (id && !a) return notFound('That activity was not found.');
    if (a && a.type === 'set') return notFound('Sets cannot be edited in this prototype.');
    var v = a || { type: 'event', title: '', host: D.staff.unit, blurb: '', comps: [], depth: 1, points: D.depthPoints[1] };
    var ev = v.type === 'event', proof = v.proof || 'reflection', win = v.window || 'upcoming';
    return '<div class="stack"><div><a class="back" href="#/staff/activities">← Activities</a><h1>' + (a ? 'Edit activity' : 'New activity') + '</h1>' +
      (a ? '<p class="sub">' + (isLive(a) ? 'Live: students can see it.' : 'Draft: students cannot see it.') + '</p>' : '') + '</div>' +
      '<form class="stack" data-form="s-activity" data-id="' + (a ? a.id : '') + '" novalidate>' +
      '<div class="card stack">' +
        (a ? '<input type="hidden" name="type" value="' + v.type + '"><div><strong>Type</strong><br>' + WP.TYPE[v.type] + '</div>'
           : '<fieldset><legend>Type</legend><div class="checks"><label><input type="radio" name="type" value="event" checked> Event: students check in with a code</label>' +
             '<label><input type="radio" name="type" value="task"> Task: students send a reflection or a file</label></div></fieldset>') +
        field('f-title', 'Title', '<input id="f-title" name="title" type="text" value="' + esc(v.title) + '">') +
        field('f-host', 'Host', '<input id="f-host" name="host" type="text" value="' + esc(v.host) + '">', 'The office or group running it.') +
        field('f-blurb', 'What students do', '<textarea id="f-blurb" name="blurb" style="min-height:100px">' + esc(v.blurb) + '</textarea>') +
      '</div>' +
      '<div class="card stack">' +
        '<fieldset><legend>Competencies it builds</legend><div class="checks">' + D.competencies.map(function (c, i) {
          return '<label><input type="checkbox" name="comps" value="' + c.id + '"' + (i === 0 ? ' id="f-comps"' : '') + (v.comps.indexOf(c.id) >= 0 ? ' checked' : '') + '> ' + esc(c.name) + '</label>';
        }).join('') + '</div></fieldset>' +
        '<div class="fgrid">' +
          field('f-depth', 'Depth', '<select id="f-depth" name="depth">' + Object.keys(D.depths).map(function (k) { return WP.opt(k, D.depths[k], String(v.depth)); }).join('') + '</select>', 'How much the student puts in.') +
          field('f-points', 'Points', '<input id="f-points" name="points" type="number" min="1" max="500" value="' + v.points + '">', 'Filled in from the depth. You can change it.') +
        '</div></div>' +
      '<fieldset class="card" id="fs-event"' + (ev ? '' : ' hidden') + '><legend>Event details</legend><div class="fgrid">' +
        field('f-when', 'When', '<input id="f-when" name="when" type="text" value="' + esc(v.when || '') + '" placeholder="Thu 20 Nov, 6:00 pm">') +
        field('f-where', 'Where', '<input id="f-where" name="where" type="text" value="' + esc(v.where || '') + '">') +
        field('f-window', 'Check-in', '<select id="f-window" name="window">' + WP.opt('upcoming', 'Not open yet', win) + WP.opt('open', 'Open now', win) + WP.opt('closed', 'Closed', win) + '</select>') +
        field('f-code', 'Check-in code', '<div class="row" style="flex-wrap:nowrap"><input id="f-code" name="code" type="text" autocapitalize="characters" value="' + esc(v.code || newCode()) + '"><button type="button" class="btn ghost sm" data-action="s-newcode">New code</button></div>', 'Shown at the door. Students type it to check in.') +
      '</div></fieldset>' +
      '<fieldset class="card" id="fs-task"' + (ev ? ' hidden' : '') + '><legend>Task details</legend><div class="stack"><div class="fgrid">' +
        field('f-proof', 'Students send', '<select id="f-proof" name="proof">' + WP.opt('reflection', 'A written reflection', proof) + WP.opt('file', 'A file', proof) + '</select>') +
        '<div id="row-min"' + (proof === 'file' ? ' hidden' : '') + '>' + field('f-min', 'Minimum words', '<input id="f-min" name="minWords" type="number" min="1" max="2000" value="' + (v.minWords || 40) + '">') + '</div></div>' +
        '<div id="row-approval"' + (proof === 'file' ? ' hidden' : '') + '><label class="switch"><input type="checkbox" name="approval"' + (v.approval === false ? '' : ' checked') + '> Staff must approve before points are given</label></div>' +
        '<p class="hint" style="margin:0">A file always needs staff approval.</p></div></fieldset>' +
      '<p class="err" id="s-err" role="alert" hidden></p>' +
      '<div class="row"><button class="btn" name="go" value="live">Save and publish</button><button class="btn ghost" name="go" value="draft">Save as draft</button><a href="#/staff/activities">Cancel</a></div>' +
      '</form></div>';
  }
  function saveActivity(f, e) {
    function val(n) { return f.elements.namedItem(n); }
    var id = f.getAttribute('data-id'), type = val('type').value, bad = null;
    function need(ok, msg, fid) { if (!ok && !bad) bad = [msg, fid]; }
    var title = val('title').value.trim(), host = val('host').value.trim(), blurb = val('blurb').value.trim();
    var comps = [].slice.call(f.querySelectorAll('input[name=comps]:checked')).map(function (c) { return c.value; });
    var pts = Number(val('points').value), proof = val('proof').value, min = Number(val('minWords').value);
    var when = val('when').value.trim(), where = val('where').value.trim(), code = val('code').value.trim().toUpperCase();
    need(title, 'Give the activity a title.', 'f-title');
    need(host, 'Say who hosts it.', 'f-host');
    need(blurb, 'Tell students what to do.', 'f-blurb');
    need(comps.length, 'Choose at least one competency.', 'f-comps');
    need(Number.isInteger(pts) && pts >= 1 && pts <= 500, 'Points must be a whole number from 1 to 500.', 'f-points');
    if (type === 'event') {
      need(when, 'Say when the event is.', 'f-when');
      need(where, 'Say where the event is.', 'f-where');
      need(code.length >= 3, 'The check-in code needs at least 3 characters.', 'f-code');
    } else if (proof === 'reflection') need(Number.isInteger(min) && min >= 1, 'Minimum words must be a whole number, 1 or more.', 'f-min');
    if (bad) { var er = el('s-err'); er.textContent = bad[0]; er.hidden = false; el(bad[1]).focus(); return; }
    var obj = { type: type, title: title, host: host, blurb: blurb, comps: comps, depth: Number(val('depth').value), points: pts,
      live: !(e.submitter && e.submitter.value === 'draft') };
    if (type === 'event') { obj.when = when; obj.where = where; obj.window = val('window').value; obj.code = code; }
    else { obj.proof = proof; obj.approval = proof === 'file' ? true : val('approval').checked; if (proof === 'reflection') obj.minWords = min; }
    if (id) setFields(id, obj); else { obj.id = 'c' + Date.now().toString(36); S().custom.push(obj); }
    WP.save(); WP.toast((obj.live ? 'Published: ' : 'Saved as draft: ') + title);
    location.hash = '#/staff/activities';
  }

  // ---------- door view ----------
  function hasCredit(name, a) { return name === D.me.name ? WP.status(a) === 'done' : (S().others[a.id] || []).indexOf(name) >= 0; }
  function door(id) {
    var a = WP.act(id);
    if (!a || a.type !== 'event') return notFound('That event was not found.');
    var open = a.window === 'open', names = roster().map(function (x) { return x.name; }).sort();
    var nsel = names.filter(function (n) { return sui.credit[n] && !hasCredit(n, a); }).length;
    return '<div class="stack"><div><a class="back" href="#/staff/activities">← Activities</a><h1>' + esc(a.title) + '</h1>' +
      '<p class="sub">' + esc(a.host) + ' · ' + esc(a.when) + ' · ' + esc(a.where) + '</p></div>' +
      '<section class="card" style="text-align:center"><div class="row" style="justify-content:center">' +
          (open ? '<span class="pill live">Check-in open</span>' : a.window === 'upcoming' ? '<span class="pill">Check-in not open yet</span>' : '<span class="pill">Check-in closed</span>') +
          (isLive(a) ? '' : '<span class="pill warn">Draft: students cannot see this event</span>') + '</div>' +
        '<div class="codebig" aria-label="Check-in code">' + esc(a.code) + '</div>' +
        '<p class="sub">Put this on a screen at the door. Students type it in the app while check-in is open.</p>' +
        '<div class="row" style="justify-content:center;margin-top:12px">' +
          (open ? '<button class="btn ghost" data-action="s-window" data-id="' + a.id + '" data-v="closed">Close check-in</button>'
                : '<button class="btn" data-action="s-window" data-id="' + a.id + '" data-v="open">Open check-in</button>') +
          '<a class="btn ghost" href="#/staff/edit/' + a.id + '">Edit event</a></div></section>' +
      '<div class="tiles"><div class="card tile"><div class="n">' + doneCount(a) + '</div><div class="l">checked in or given credit</div></div>' +
        '<div class="card tile"><div class="n">' + a.points + '</div><div class="l">points each</div></div></div>' +
      '<section class="card"><h2>Give credit by hand</h2><p class="sub" style="margin:4px 0 12px">For students who were there but could not check in.</p>' +
        '<ul class="people">' + names.map(function (n) {
          return '<li>' + (hasCredit(n, a) ? '<span class="pill ok">Has credit</span> <span>' + esc(n) + '</span>'
            : '<label class="switch"><input type="checkbox" data-action="s-credit-sel" data-name="' + esc(n) + '"' + (sui.credit[n] ? ' checked' : '') + '> ' + esc(n) + '</label>') + '</li>';
        }).join('') + '</ul>' +
        '<div style="margin-top:14px"><button class="btn" id="s-credit" data-action="s-credit" data-id="' + a.id + '"' + (nsel ? '' : ' disabled') + '>Give credit (' + nsel + ')</button></div></section></div>';
  }

  // ---------- students ----------
  function studentRows() {
    var q = sui.sq.trim().toLowerCase(), pend = queue();
    var list = roster().filter(function (x) { return !q || (x.name + ' ' + x.program).toLowerCase().indexOf(q) >= 0; });
    return '<p class="sub" id="s-scount">' + list.length + ' of ' + (D.peers.length + 1) + ' students</p>' +
      '<div class="card scroll"><table class="tbl"><thead><tr><th>Name</th><th>Programme</th><th>Points</th><th>Level</th><th>Last active</th><th>Notes</th></tr></thead><tbody>' +
      (list.map(function (x) {
        var L = WP.level(x.points).cur, w = pend.filter(function (p) { return p.student === x.name; }).length;
        return '<tr><td>' + (x.me ? '<a href="#/staff/student">' + esc(x.name) + '</a>' : esc(x.name)) + '</td><td>' + esc(x.program) + '</td><td><strong>' + x.points + '</strong></td>' +
          '<td>' + L.n + ' · ' + esc(L.name) + '</td><td>' + esc(x.last) + '</td><td>' + (x.quiet ? '<span class="pill warn">Quiet 30+ days</span> ' : '') + (w ? '<span class="pill">' + w + ' waiting</span>' : '') + '</td></tr>';
      }).join('') || '<tr><td colspan="6" class="sub">No student matches that search.</td></tr>') + '</tbody></table></div>';
  }
  function students() {
    return '<div class="stack"><div class="head"><div><h1>Students</h1><p class="sub">Who is taking part, and who has gone quiet.</p></div></div>' +
      '<div class="card"><label for="s-sq">Search</label><input id="s-sq" type="search" value="' + esc(sui.sq) + '" placeholder="Name or programme"></div>' +
      '<div id="s-students" class="stack" aria-live="polite">' + studentRows() + '</div>' +
      '<p class="fine">Sample roster. A full record opens for ' + esc(D.me.name) + ', the demo student.</p></div>';
  }
  function student() {
    var p = WP.points(), L = WP.level(p), cc = WP.compCounts(), dn = WP.doneList(), s = S();
    var max = Math.max.apply(null, D.competencies.map(function (c) { return cc[c.id]; }).concat([4]));
    var open = Object.keys(s.completions).filter(function (id) { var st = s.completions[id].status; return (st === 'pending' || st === 'returned') && WP.act(id); });
    return '<div class="stack"><div><a class="back" href="#/staff/students">← Students</a><h1>' + esc(D.me.name) + '</h1><p class="sub">' + esc(D.me.program) + ' · ' + esc(D.me.year) + '</p></div>' +
      '<div class="tiles"><div class="card tile"><div class="n">' + p + '</div><div class="l">points</div></div>' +
        '<div class="card tile"><div class="n">' + L.cur.n + '</div><div class="l">level: ' + esc(L.cur.name) + '</div></div>' +
        '<div class="card tile"><div class="n">' + dn.length + '</div><div class="l">completed</div></div>' +
        '<div class="card tile"><div class="n">' + WP.earned().length + '</div><div class="l">badges</div></div></div>' +
      (open.length ? '<section class="card"><h2>In progress</h2><ul class="todo">' + open.map(function (id) {
        var a = WP.act(id), st = s.completions[id].status;
        return '<li><span>' + esc(a.title) + '</span>' + (st === 'pending' ? '<a class="btn ghost sm" href="#/staff/approvals">Waiting for you: review</a>' : '<span class="pill warn">Sent back to the student</span>') + '</li>';
      }).join('') + '</ul></section>' : '') +
      '<section class="card"><h2>Competencies</h2><div class="cmap" style="margin-top:12px">' + D.competencies.map(function (c) {
        return '<div class="line"><span>' + esc(c.name) + '</span><div class="bar" role="img" aria-label="' + esc(c.name) + ': ' + cc[c.id] + ' completed"><i style="width:' + Math.round(100 * cc[c.id] / max) + '%;background:' + c.color + '"></i></div><strong>' + cc[c.id] + '</strong></div>';
      }).join('') + '</div></section>' +
      '<section class="card"><h2>Completed</h2>' + (dn.length ? '<ul class="tl" style="margin-top:6px">' + dn.slice().reverse().map(function (a) {
        return '<li><span class="d">' + esc(WP.completedAt(a)) + '</span><span>' + esc(a.title) + '</span><span class="pts">+' + a.points + '</span></li>';
      }).join('') + '</ul>' : '<p class="sub">Nothing completed yet.</p>') + '</section></div>';
  }

  // ---------- wiring ----------
  function section(parts) {
    var k = parts[0] || 'overview';
    return { 'new': 'activities', edit: 'activities', event: 'activities', student: 'students' }[k] || k;
  }
  function screen(parts) {
    var k = parts[0] || 'overview';
    if (k === 'approvals') return approvals();
    if (k === 'activities') return manage();
    if (k === 'new') return form();
    if (k === 'edit') return form(parts[1]);
    if (k === 'event') return door(parts[1]);
    if (k === 'students') return students();
    if (k === 'student') return student();
    return overview();
  }
  function nav() { return [['overview', 'Overview'], ['approvals', 'Approvals', queue().length || ''], ['activities', 'Activities'], ['students', 'Students']]; }

  function click(a, b) {
    if (a.indexOf('s-') !== 0) return false;
    var key = b.getAttribute('data-key'), id = b.getAttribute('data-id'), q, act;
    if (a === 's-approve') {
      q = item(key); if (!q) return true;
      approve(q); delete sui.sel[key];
      done('Approved: ' + q.student + ' · ' + WP.act(q.activity).title);
    } else if (a === 's-approve-sel') {
      var list = queue().filter(function (x) { return sui.sel[x.key]; });
      if (!list.length) return true;
      list.forEach(approve); sui.sel = {};
      done('Approved ' + plural(list.length, 'submission', 'submissions'));
    } else if (a === 's-back-open') {
      sui.back = key; WP.render(); el('note').focus();
    } else if (a === 's-back-cancel') {
      sui.back = null; WP.render();
    } else if (a === 's-toggle-live') {
      act = WP.act(id); setFields(id, { live: !isLive(act) });
      done((isLive(act) ? 'Unpublished: ' : 'Published: ') + act.title);
    } else if (a === 's-newcode') {
      el('f-code').value = newCode();
    } else if (a === 's-window') {
      setFields(id, { window: b.getAttribute('data-v') });
      done(b.getAttribute('data-v') === 'open' ? 'Check-in is open' : 'Check-in is closed');
    } else if (a === 's-credit') {
      act = WP.act(id);
      var names = Object.keys(sui.credit).filter(function (n) { return sui.credit[n] && !hasCredit(n, act); });
      if (!names.length) return true;
      names.forEach(function (n) {
        if (n === D.me.name) S().completions[act.id] = { status: 'done', at: WP.today(), seq: Date.now(), by: 'staff' };
        else creditOther(n, act);
        log(n, act, 'Given credit');
      });
      sui.credit = {};
      done('Credit given to ' + plural(names.length, 'student', 'students'));
    }
    return true;
  }
  function change(t) {
    var a = t.getAttribute('data-action') || '', f = t.form && t.form.getAttribute('data-form');
    if (a === 's-sel') { sui.sel[t.getAttribute('data-key')] = t.checked; syncBulk(); return true; }
    if (a === 's-all') {
      queue().forEach(function (q) { sui.sel[q.key] = t.checked; });
      [].forEach.call(document.querySelectorAll('[data-action="s-sel"]'), function (c) { c.checked = t.checked; });
      syncBulk(); return true;
    }
    if (a === 's-credit-sel') {
      sui.credit[t.getAttribute('data-name')] = t.checked;
      var n = document.querySelectorAll('[data-action="s-credit-sel"]:checked').length, btn = el('s-credit');
      btn.disabled = !n; btn.textContent = 'Give credit (' + n + ')';
      return true;
    }
    if (f === 's-activity') {
      if (t.name === 'type') { el('fs-event').hidden = t.value !== 'event'; el('fs-task').hidden = t.value === 'event'; }
      if (t.id === 'f-depth') el('f-points').value = D.depthPoints[t.value];
      if (t.id === 'f-proof') { el('row-min').hidden = t.value === 'file'; el('row-approval').hidden = t.value === 'file'; }
      return true;
    }
    return false;
  }
  function input(t) {
    if (t.id === 's-q') { sui.q = t.value; el('s-list').innerHTML = manageList(); return true; }
    if (t.id === 's-sq') { sui.sq = t.value; el('s-students').innerHTML = studentRows(); return true; }
    return false;
  }
  function submit(kind, f, e) {
    if (kind === 's-back') {
      var q = item(f.getAttribute('data-key')), note = f.elements.namedItem('note').value.trim();
      if (!q) return true;
      if (!note) { var er = el('s-back-err'); er.textContent = 'Say what should change, so the student knows what to fix.'; er.hidden = false; el('note').focus(); return true; }
      sendBack(q, note); sui.back = null; delete sui.sel[q.key];
      done('Sent back to ' + q.student);
      return true;
    }
    if (kind === 's-activity') { saveActivity(f, e); return true; }
    return false;
  }
  function reset() { sui.back = null; sui.sel = {}; sui.credit = {}; }

  WP.staff = { screen: screen, section: section, nav: nav, click: click, change: change, input: input, submit: submit, reset: reset };
})();
