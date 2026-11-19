// GTA VI trophy guide + tracker: 55 reported trophies, checklist in localStorage,
// export/import, filters, spoiler setting, roadmap, and per-trophy cited guides.
// Fully offline: the only file it fetches is its own data/trophies.json.
const KEY = 'gta6-trophy-checklist-v1';
const SPOILER_KEY = 'gta6-trophy-hide-spoilers-v1';
const params = new URLSearchParams(location.search);
const DEMO = params.get('demo') === '1';
const DEMO_EARNED = [2, 3, 4, 5, 8, 15, 16, 21, 35, 42, 46, 53];
// ?shot=roadmap|list frames one section at the top (deep-link views, also used for screenshots).
const SHOT = params.get('shot');
if (SHOT === 'roadmap' || SHOT === 'list') document.body.classList.add('shot-' + SHOT);

const $ = (id) => document.getElementById(id);
const doc = await (await fetch('data/trophies.json')).json();
const trophies = doc.trophies;
const byId = new Map(trophies.map((t) => [t.id, t]));
const sourceMap = doc.sources;

let earned = new Set(DEMO ? DEMO_EARNED : JSON.parse(localStorage.getItem(KEY) ?? '[]'));
let selected = 28; // featured: the one missable trophy
let hideSpoilers = localStorage.getItem(SPOILER_KEY) !== '0';

function save() {
  if (!DEMO) localStorage.setItem(KEY, JSON.stringify([...earned]));
}

function gradeLabel(g) {
  return g === 'platinum' ? 'Platinum' : g[0].toUpperCase() + g.slice(1);
}

function isHidden(t) {
  return hideSpoilers && t.spoiler && !earned.has(t.id);
}

function visibleTrophies() {
  const q = $('search').value.trim().toLowerCase();
  const grade = $('grade').value;
  const cat = $('category').value;
  const flag = $('flag').value;
  return trophies.filter((t) => {
    if (grade !== 'all' && t.grade !== grade) return false;
    if (cat !== 'all' && t.category !== cat) return false;
    if (flag === 'missable' && !t.missable) return false;
    if (flag === 'oneshot' && !t.oneshot) return false;
    if (flag === 'spoiler' && !t.spoiler) return false;
    if ($('earnedOnly').checked && !earned.has(t.id)) return false;
    if (q && !(t.name + ' ' + t.description + ' ' + t.guide).toLowerCase().includes(q)) return false;
    return true;
  });
}

function renderStats() {
  const counts = { platinum: 0, gold: 0, silver: 0, bronze: 0 };
  for (const t of trophies) counts[t.grade]++;
  const miss = trophies.filter((t) => t.missable).length;
  const one = trophies.filter((t) => t.oneshot).length;
  $('stats').innerHTML =
    `<span class="stat"><b>55</b> trophies</span>` +
    `<span class="stat"><b>1</b> platinum</span>` +
    `<span class="stat"><b>2</b> gold</span>` +
    `<span class="stat"><b>6</b> silver</span>` +
    `<span class="stat"><b>46</b> bronze</span>` +
    `<span class="stat"><b>${miss}</b> missable</span>` +
    `<span class="stat"><b>${one}</b> one-shot hunts</span>` +
    `<span class="stat"><b>~200 h</b> to platinum (est.)</span>`;
  $('missableName').textContent = byId.get(28).name + ' (#28)';
}

function renderProgress() {
  const n = earned.size;
  $('progressFill').style.width = `${(n / trophies.length) * 100}%`;
  $('progressText').textContent =
    `${n} of ${trophies.length} earned — ${trophies.length - n} to go` +
    (n === trophies.length ? ' — PLATINUM!' : '') +
    (DEMO ? ' (demo progress — your real progress saves in your browser)' : '');
}

function renderList() {
  const list = visibleTrophies();
  const ul = $('trophyList');
  ul.replaceChildren();
  $('countText').textContent = `Showing ${list.length} of ${trophies.length} trophies` +
    (DEMO ? ' · demo progress on' : '');
  for (const t of list) {
    const li = document.createElement('li');
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'trophy' + (earned.has(t.id) ? ' earned' : '') + (t.id === selected ? ' selected' : '');
    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = earned.has(t.id);
    box.setAttribute('aria-label', 'Mark ' + t.name + ' earned');
    box.addEventListener('click', (e) => {
      e.stopPropagation();
      if (box.checked) earned.add(t.id); else earned.delete(t.id);
      save();
      renderProgress();
      renderList();
      renderDetail();
    });
    const mid = document.createElement('span');
    if (isHidden(t)) {
      const name = document.createElement('span');
      name.className = 't-name';
      name.textContent = 'Hidden trophy #' + t.id;
      const desc = document.createElement('span');
      desc.className = 't-desc spoiled';
      desc.textContent = 'Story / secret trophy — hidden by the spoiler setting. Earn it (or turn spoilers off) to reveal it.';
      const flags = document.createElement('span');
      flags.className = 't-flags';
      flags.innerHTML = '<span class="flag secret">Spoiler</span>';
      mid.append(name, document.createElement('br'), desc, flags);
    } else {
      const name = document.createElement('span');
      name.className = 't-name';
      name.textContent = '#' + t.id + ' ' + t.name;
      const desc = document.createElement('span');
      desc.className = 't-desc';
      desc.textContent = t.description;
      const flags = document.createElement('span');
      flags.className = 't-flags';
      if (t.missable) flags.innerHTML += '<span class="flag missable">Missable</span>';
      if (t.oneshot) flags.innerHTML += '<span class="flag oneshot">One-shot</span>';
      if (t.spoiler) flags.innerHTML += '<span class="flag story">Story / secret</span>';
      mid.append(name, document.createElement('br'), desc, flags);
    }
    const badge = document.createElement('span');
    badge.className = 'grade-badge grade-' + t.grade;
    badge.textContent = gradeLabel(t.grade);
    btn.append(box, mid, badge);
    btn.addEventListener('click', () => {
      selected = t.id;
      renderList();
      renderDetail();
      history.replaceState(null, '', '#trophy-' + t.id);
    });
    li.append(btn);
    ul.append(li);
  }
  if (!list.length) {
    const p = document.createElement('p');
    p.className = 'empty';
    p.textContent = 'No trophies match these filters.';
    ul.append(p);
  }
}

function renderDetail() {
  const t = byId.get(selected) ?? trophies[0];
  const box = $('detail');
  box.replaceChildren();
  const h = document.createElement('h3');
  if (isHidden(t)) {
    h.textContent = 'Hidden trophy #' + t.id;
    const p = document.createElement('p');
    p.className = 'guide';
    p.textContent = 'This is a story or secret trophy and the spoiler setting is on. Tick it off when you earn it in-game, or turn the spoiler setting off to read its guide now.';
    box.append(h, p);
    return;
  }
  h.textContent = '#' + t.id + ' — ' + t.name;
  const desc = document.createElement('p');
  desc.className = 't-desc';
  desc.textContent = 'Official (reported) description: ' + t.description;
  const meta = document.createElement('div');
  meta.className = 'meta';
  const badge = document.createElement('span');
  badge.className = 'grade-badge grade-' + t.grade;
  badge.textContent = gradeLabel(t.grade);
  meta.append(badge);
  if (t.missable) {
    const w = document.createElement('div');
    w.className = 'warn';
    w.textContent = 'MISSABLE — Lucia\u2019s balcony meditation in Chapter 1 disappears after the chapter, and there is reportedly no mission replay. Do it before Chapter 1 ends.';
    box.append(h, desc, meta, w);
  } else {
    box.append(h, desc, meta);
  }
  if (t.oneshot) {
    const w = document.createElement('div');
    w.className = 'warn';
    w.textContent = 'ONE-SHOT — this must be done in a single attempt or a single story moment. Save first, attempt, and reload the save if it fails.';
    box.append(w);
  }
  const gh = document.createElement('h4');
  gh.textContent = 'How to get it';
  const g = document.createElement('p');
  g.className = 'guide';
  g.textContent = t.guide;
  box.append(gh, g);
  const sh = document.createElement('h4');
  sh.textContent = 'Sources';
  const sl = document.createElement('ul');
  sl.className = 'sources-list';
  for (const key of t.source) {
    const s = sourceMap[key];
    if (!s) continue;
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = s.url;
    a.target = '_blank';
    a.rel = 'noopener';
    a.textContent = s.name;
    li.append(a);
    sl.append(li);
  }
  box.append(sh, sl);
  const note = document.createElement('p');
  note.className = 'fineprint';
  note.textContent = 'Reported list, 18–19 Nov 2026 — not yet confirmed by Rockstar or PlayStation. Verify against your console at launch.';
  box.append(note);
  if (DEMO) {
    const d = document.createElement('p');
    d.className = 'demo-note';
    d.textContent = 'Demo progress is on (?demo=1): 12 trophies ticked so you can see the tracker at work. Your real progress is saved in your browser.';
    box.append(d);
  }
}

function renderRoadmap() {
  const ol = $('phases');
  ol.replaceChildren();
  for (const p of doc.roadmap) {
    const li = document.createElement('li');
    li.className = 'phase';
    const h = document.createElement('h3');
    const n = document.createElement('span');
    n.className = 'n';
    n.textContent = p.phase;
    h.append(n, document.createTextNode(' ' + p.title));
    const note = document.createElement('p');
    note.textContent = p.note;
    const list = document.createElement('p');
    list.className = 'trophies';
    list.innerHTML = '<b>' + p.trophies.length + ' trophies:</b> ' +
      p.trophies.map((id) => {
        const t = byId.get(id);
        const done = earned.has(id) ? ' ✓' : '';
        return '#' + id + ' ' + t.name + done;
      }).join(' · ');
    li.append(h, note, list);
    ol.append(li);
  }
}

function renderSources() {
  const ul = $('sourceList');
  ul.replaceChildren();
  for (const [key, s] of Object.entries(sourceMap)) {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = s.url;
    a.target = '_blank';
    a.rel = 'noopener';
    a.textContent = s.name;
    li.append(a);
    ul.append(li);
  }
  const li = document.createElement('li');
  li.textContent = 'List status note: GTASnaps reports that Rockstar, Sony and Microsoft had published no GTA 6 trophy list before launch, and that the PSNProfiles community called the circulating named list “probably fake”. This guide keeps the widely reported 55 and marks them as reported, not confirmed.';
  ul.append(li);
}

function renderAll() {
  renderStats();
  renderProgress();
  renderList();
  renderDetail();
  renderRoadmap();
  renderSources();
}

function applyHash() {
  const h = location.hash;
  const m = h.match(/^#trophy-(\d+)$/);
  if (m && byId.has(Number(m[1]))) {
    selected = Number(m[1]);
    renderList();
    renderDetail();
    return;
  }
  const f = h.match(/^#filter=(missable|oneshot|spoiler)$/);
  if (f) {
    $('flag').value = f[1];
    if (f[1] === 'oneshot') selected = 33;
    if (f[1] === 'missable') selected = 28;
    renderList();
    renderDetail();
    return;
  }
  const g = h.match(/^#grade=(platinum|gold|silver|bronze)$/);
  if (g) {
    $('grade').value = g[1];
    if (g[1] === 'gold') selected = 14;
    renderList();
    renderDetail();
  }
}

$('search').addEventListener('input', renderList);
$('grade').addEventListener('change', renderList);
$('category').addEventListener('change', renderList);
$('flag').addEventListener('change', renderList);
$('earnedOnly').addEventListener('change', renderList);
$('hideSpoilers').addEventListener('change', (e) => {
  hideSpoilers = e.target.checked;
  if (!DEMO) localStorage.setItem(SPOILER_KEY, hideSpoilers ? '1' : '0');
  renderList();
  renderDetail();
});
$('exportBtn').addEventListener('click', () => {
  const data = { game: 'Grand Theft Auto VI', exported: new Date().toISOString(), earned: [...earned].sort((a, b) => a - b) };
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
  a.download = 'gta6-trophy-progress.json';
  a.click();
  URL.revokeObjectURL(a.href);
});
$('importFile').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    const ids = Array.isArray(data) ? data : data.earned;
    const next = new Set(ids.filter((id) => byId.has(id)));
    earned = next;
    save();
    renderAll();
  } catch {
    alert('That file could not be read as trophy progress JSON.');
  }
  e.target.value = '';
});
$('resetBtn').addEventListener('click', () => {
  if (!confirm('Clear all earned ticks? Export first if you want a backup.')) return;
  earned = new Set();
  save();
  renderAll();
});

$('hideSpoilers').checked = hideSpoilers;
renderAll();
applyHash();
window.addEventListener('hashchange', applyHash);
