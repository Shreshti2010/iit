// ===== STATE =====
const LECTURE_KEY = 'iit_lectures_v2';
const UPDATES_KEY = 'iit_updates_v2';
const AHA_KEY = 'iit_aha_v1';
let plannerData = [];
let completedLectures = {};
let dailyUpdates = [];
let ahaData = [];
let ahaCompleted = {};

const SUBJECTS = [
  { key: 'physics',     label: 'Physics',       cls: 'physics', short: 'PHY' },
  { key: 'physicalChem',label: 'Physical Chem',  cls: 'pchem',   short: 'PCH' },
  { key: 'organicChem', label: 'Organic Chem',   cls: 'ochem',   short: 'OCH' },
  { key: 'math',        label: 'Mathematics',    cls: 'math',    short: 'MAT' },
];

// ===== STORAGE =====
function loadStorage() {
  try { completedLectures = JSON.parse(localStorage.getItem(LECTURE_KEY)) || {}; } catch { completedLectures = {}; }
  try { dailyUpdates = JSON.parse(localStorage.getItem(UPDATES_KEY)) || []; } catch { dailyUpdates = []; }
  try { ahaCompleted = JSON.parse(localStorage.getItem(AHA_KEY)) || {}; } catch { ahaCompleted = {}; }
}
function saveLectures() { localStorage.setItem(LECTURE_KEY, JSON.stringify(completedLectures)); }
function saveUpdates() { localStorage.setItem(UPDATES_KEY, JSON.stringify(dailyUpdates)); }
function saveAha() { localStorage.setItem(AHA_KEY, JSON.stringify(ahaCompleted)); }

// ===== NAVIGATION =====
const PAGES = {
  dashboard: 'Dashboard', planner: 'Course Planner', updates: 'Daily Updates',
  progress: 'Progress', ahaguru: 'AhaGuru – Maths',
  'syllabus-jee': 'Syllabus – JEE', 'syllabus-1st': 'Syllabus – 1st Year',
  'syllabus-2nd': 'Syllabus – 2nd Year', 'syllabus-eapcet': 'Syllabus – EAPCET',
  'jee-superset': 'JEE Superset', yts: 'YTS', timetable: 'Timetable'
};
function initNav() {
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => switchPage(btn.dataset.page));
  });
  document.getElementById('topbarMenu').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('open');
  });
  // collapsible nav groups
  document.querySelectorAll('.nav-group-header').forEach(hdr => {
    hdr.addEventListener('click', () => {
      const id = hdr.dataset.group;
      const items = document.getElementById('group-' + id);
      hdr.classList.toggle('open');
      items.classList.toggle('open');
    });
  });
}
function switchPage(page) {
  Object.keys(PAGES).forEach(p => {
    const el = document.getElementById(p + 'Page');
    if (el) el.style.display = p === page ? '' : 'none';
  });
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.toggle('active', b.dataset.page === page));
  document.getElementById('pageTitle').textContent = PAGES[page];
  if (page === 'dashboard') renderDashboard();
  if (page === 'progress') renderProgress();
  if (page === 'planner') renderPlannerTable(getFilteredData());
  if (page === 'ahaguru') renderAhaGuru();
  if (page === 'jee-superset') renderSuperset();
  if (page === 'yts') renderYts();
  if (page === 'timetable') renderTimetable();
}

// ===== HELPERS =====
function today() { return new Date().toISOString().slice(0, 10); }
function fmtDate(iso) {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
}
function dayName(iso) {
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'long' });
}
function dateStr(iso) {
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}
function calcProgress() {
  let total = 0, done = 0;
  const bySubj = {};
  SUBJECTS.forEach(s => { bySubj[s.key] = { total: 0, done: 0 }; });
  plannerData.forEach(row => {
    SUBJECTS.forEach(s => {
      if (row[s.key]) {
        total++; bySubj[s.key].total++;
        if (completedLectures[row.date + '_' + s.key]) { done++; bySubj[s.key].done++; }
      }
    });
  });
  return { total, done, pending: total - done, pct: total ? (done / total * 100) : 0, bySubj };
}
function calcStreak() {
  const dates = [...new Set(plannerData.map(r => r.date))].sort().reverse();
  let streak = 0;
  for (const date of dates) {
    const row = plannerData.find(r => r.date === date);
    const anyDone = row && SUBJECTS.some(s => row[s.key] && completedLectures[date + '_' + s.key]);
    if (anyDone) streak++;
    else break;
  }
  return streak;
}

// ===== DASHBOARD =====
function renderDashboard() {
  renderStats();
  renderTodayCard();
  renderStreakCard();
  renderProgressOverview();
  renderUpcoming();
}

function renderStats() {
  const { total, done, pending } = calcProgress();
  const streak = calcStreak();
  const statsData = [
    { icon: '📚', value: total, label: 'Total Lectures', color: '#6366f1', bg: 'rgba(99,102,241,0.12)' },
    { icon: '✅', value: done, label: 'Completed', color: '#22c55e', bg: 'rgba(34,197,94,0.12)' },
    { icon: '⏳', value: pending, label: 'Pending', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
    { icon: '🔥', value: streak, label: 'Day Streak', color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
  ];
  const row = document.getElementById('statsRow');
  row.innerHTML = statsData.map(s => `
    <div class="stat-card">
      <div class="stat-icon" style="background:${s.bg};color:${s.color}">${s.icon}</div>
      <div class="stat-info">
        <div class="stat-value" style="color:${s.color}">${s.value}</div>
        <div class="stat-label">${s.label}</div>
      </div>
    </div>`).join('');
}

function renderTodayCard() {
  const t = today();
  const row = plannerData.find(r => r.date === t);
  const badge = document.getElementById('todayDateBadge');
  badge.textContent = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });
  const ul = document.getElementById('todayLectures');
  if (!row || !SUBJECTS.some(s => row[s.key])) {
    ul.innerHTML = '<li class="no-lectures">No lectures scheduled today 🎉</li>';
    return;
  }
  ul.innerHTML = SUBJECTS.filter(s => row[s.key]).map(s => {
    const id = t + '_' + s.key;
    const done = !!completedLectures[id];
    return `<li class="today-item${done ? ' done' : ''}" id="ti_${id}">
      <span class="today-subj ${s.cls}">${s.short}</span>
      <span class="today-text">${row[s.key]}</span>
      <input type="checkbox" class="today-cb" ${done ? 'checked' : ''} data-id="${id}" data-li="ti_${id}">
    </li>`;
  }).join('');
  ul.querySelectorAll('.today-cb').forEach(cb => {
    cb.addEventListener('change', () => {
      completedLectures[cb.dataset.id] = cb.checked;
      saveLectures();
      const li = document.getElementById(cb.dataset.li);
      if (li) li.classList.toggle('done', cb.checked);
      renderStats();
      renderProgressOverview();
    });
  });
}

function renderStreakCard() {
  document.getElementById('studyStreak').textContent = calcStreak();
}

function renderProgressOverview() {
  const { pct, bySubj } = calcProgress();
  // Ring
  const r = 54, circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  document.getElementById('progressRingWrap').innerHTML = `
    <div class="ring-wrap-inner">
      <svg class="progress-ring-svg" width="130" height="130" viewBox="0 0 130 130">
        <defs>
          <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#6366f1"/>
            <stop offset="100%" stop-color="#818cf8"/>
          </linearGradient>
        </defs>
        <circle class="progress-ring-bg" cx="65" cy="65" r="${r}"/>
        <circle class="progress-ring-fill" cx="65" cy="65" r="${r}"
          stroke-dasharray="${circ}" stroke-dashoffset="${offset}"/>
      </svg>
      <div class="ring-center" style="position:absolute;text-align:center">
        <div class="ring-pct">${pct.toFixed(0)}%</div>
        <div class="ring-sub">done</div>
      </div>
    </div>`;
  // Subject bars
  const colors = { physics: '#38bdf8', physicalChem: '#f59e0b', organicChem: '#10b981', math: '#a78bfa' };
  document.getElementById('subjectBars').innerHTML = SUBJECTS.map(s => {
    const d = bySubj[s.key];
    const p = d.total ? (d.done / d.total * 100) : 0;
    return `<div class="subj-bar-row">
      <span class="subj-bar-label">${s.label}</span>
      <div class="subj-bar-track"><div class="subj-bar-fill" style="width:${p}%;background:${colors[s.key]}"></div></div>
      <span class="subj-bar-pct">${p.toFixed(0)}%</span>
    </div>`;
  }).join('');
}

function renderUpcoming() {
  const t = today();
  const upcoming = plannerData.filter(r => r.date >= t && SUBJECTS.some(s => r[s.key] && !completedLectures[r.date + '_' + s.key])).slice(0, 10);
  document.getElementById('upcomingCount').textContent = upcoming.length + ' lectures';
  const ul = document.getElementById('upcomingLectures');
  if (!upcoming.length) { ul.innerHTML = '<li class="no-lectures">All caught up!</li>'; return; }
  ul.innerHTML = upcoming.flatMap(row =>
    SUBJECTS.filter(s => row[s.key] && !completedLectures[row.date + '_' + s.key]).map(s => `
      <li class="upcoming-item">
        <span class="subj-dot ${s.cls}"></span>
        <span class="upcoming-text">${row[s.key]}</span>
        <span class="upcoming-date">${fmtDate(row.date)}</span>
      </li>`)
  ).join('');
}

// ===== PLANNER TABLE =====
let currentFilter = 'all';
let currentSearch = '';

function renderPlannerTable(data) {
  const t = today();
  const tbody = document.getElementById('plannerTableBody');
  tbody.innerHTML = '';
  data.forEach(row => {
    const hasAny = SUBJECTS.some(s => row[s.key]);
    if (!hasAny) return;
    const isToday = row.date === t;
    const tr = document.createElement('tr');
    if (isToday) tr.classList.add('today-row');
    tr.innerHTML = `<td class="td-date">
      <span class="day-name">${dayName(row.date)}</span>
      <span class="date-str">${dateStr(row.date)}</span>
    </td>`;
    SUBJECTS.forEach(s => {
      const td = document.createElement('td');
      if (row[s.key]) {
        const id = row.date + '_' + s.key;
        const done = !!completedLectures[id];
        const label = document.createElement('label');
        label.className = 'lecture-label' + (done ? ' done' : '');
        label.innerHTML = `<input type="checkbox" ${done ? 'checked' : ''} data-id="${id}">
          <span class="lecture-chip ${s.cls}">${row[s.key]}</span>`;
        label.querySelector('input').addEventListener('change', e => {
          completedLectures[id] = e.target.checked;
          saveLectures();
          label.classList.toggle('done', e.target.checked);
          renderStats && renderStats();
        });
        td.appendChild(label);
      }
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
}

function getFilteredData() {
  return plannerData.filter(row => {
    const matchSearch = !currentSearch || SUBJECTS.some(s =>
      row[s.key] && row[s.key].toLowerCase().includes(currentSearch.toLowerCase())
    ) || row.date.includes(currentSearch);
    const matchFilter = currentFilter === 'all' ? true :
      SUBJECTS.some(s => {
        if (!row[s.key]) return false;
        const done = !!completedLectures[row.date + '_' + s.key];
        return currentFilter === 'completed' ? done : !done;
      });
    return matchSearch && matchFilter;
  });
}

function initPlanner() {
  document.getElementById('plannerSearch').addEventListener('input', e => {
    currentSearch = e.target.value;
    renderPlannerTable(getFilteredData());
  });
  document.querySelectorAll('.filter-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentFilter = tab.dataset.filter;
      renderPlannerTable(getFilteredData());
    });
  });
}

// ===== UPDATES =====
function renderUpdates() {
  const ul = document.getElementById('updatesList');
  ul.innerHTML = dailyUpdates.length ? [...dailyUpdates].reverse().map(u => `
    <li class="update-item">
      <div class="update-item-date">${new Date(u.date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</div>
      <div class="update-item-text">${u.text}</div>
    </li>`).join('') : '<li class="no-lectures">No updates yet. Start logging your study sessions!</li>';
}

function initUpdates() {
  document.getElementById('dailyUpdateForm').addEventListener('submit', e => {
    e.preventDefault();
    const text = document.getElementById('updateText').value.trim();
    if (!text) return;
    dailyUpdates.push({ date: today(), text });
    saveUpdates();
    document.getElementById('updateText').value = '';
    renderUpdates();
  });
}

// ===== PROGRESS PAGE =====
function renderProgress() {
  const { total, done, pending, pct, bySubj } = calcProgress();
  const streak = calcStreak();
  const statsData = [
    { icon: '📚', value: total, label: 'Total Lectures', color: '#6366f1', bg: 'rgba(99,102,241,0.12)' },
    { icon: '✅', value: done, label: 'Completed', color: '#22c55e', bg: 'rgba(34,197,94,0.12)' },
    { icon: '⏳', value: pending, label: 'Remaining', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
    { icon: '📈', value: pct.toFixed(1) + '%', label: 'Completion', color: '#a78bfa', bg: 'rgba(167,139,250,0.12)' },
  ];
  document.getElementById('progressStatsRow').innerHTML = statsData.map(s => `
    <div class="stat-card">
      <div class="stat-icon" style="background:${s.bg};color:${s.color}">${s.icon}</div>
      <div class="stat-info">
        <div class="stat-value" style="color:${s.color}">${s.value}</div>
        <div class="stat-label">${s.label}</div>
      </div>
    </div>`).join('');

  const colors = { physics: '#38bdf8', physicalChem: '#f59e0b', organicChem: '#10b981', math: '#a78bfa' };
  document.getElementById('subjectProgressBars').innerHTML = SUBJECTS.map(s => {
    const d = bySubj[s.key];
    const p = d.total ? (d.done / d.total * 100) : 0;
    return `<div class="subj-prog-row">
      <div class="subj-prog-header">
        <span class="subj-prog-name" style="color:${colors[s.key]}">${s.label}</span>
        <span class="subj-prog-count">${d.done} / ${d.total}</span>
      </div>
      <div class="subj-prog-track">
        <div class="subj-prog-fill" style="width:${p}%;background:${colors[s.key]}"></div>
      </div>
    </div>`;
  }).join('');

  // Monthly breakdown
  const months = {};
  plannerData.forEach(row => {
    const m = row.date.slice(0, 7);
    if (!months[m]) months[m] = { total: 0, done: 0 };
    SUBJECTS.forEach(s => {
      if (row[s.key]) {
        months[m].total++;
        if (completedLectures[row.date + '_' + s.key]) months[m].done++;
      }
    });
  });
  const maxTotal = Math.max(...Object.values(months).map(m => m.total), 1);
  document.getElementById('monthlyBreakdown').innerHTML = Object.entries(months).map(([m, d]) => {
    const label = new Date(m + '-01').toLocaleDateString('en-IN', { month: 'short', year: '2-digit' });
    const w = (d.total / maxTotal * 100).toFixed(1);
    return `<div class="month-row">
      <span class="month-name">${label}</span>
      <div class="month-bar-track"><div class="month-bar-fill" style="width:${w}%"></div></div>
      <span class="month-count">${d.done}/${d.total}</span>
    </div>`;
  }).join('');
}

// ===== TOPBAR DATE =====
function setTopbarDate() {
  document.getElementById('topbarDate').textContent =
    new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

// ===== AHAGURU =====
function renderAhaGuru() {
  const total = ahaData.length;
  const done = ahaData.filter(l => ahaCompleted[l.id]).length;
  const pct = total ? (done / total * 100) : 0;

  document.getElementById('ahaProgressFill').style.width = pct.toFixed(1) + '%';
  document.getElementById('ahaProgressPct').textContent = pct.toFixed(0) + '%';
  document.getElementById('ahaStatsMini').innerHTML = `
    <div class="aha-stat"><div class="aha-stat-val">${total}</div><div class="aha-stat-lbl">Lessons</div></div>
    <div class="aha-stat"><div class="aha-stat-val" style="color:var(--success)">${done}</div><div class="aha-stat-lbl">Done</div></div>
    <div class="aha-stat"><div class="aha-stat-val" style="color:var(--pchem)">${total - done}</div><div class="aha-stat-lbl">Remaining</div></div>`;

  const list = document.getElementById('ahaLessonList');
  list.innerHTML = '';
  ahaData.forEach(lesson => {
    const isDone = !!ahaCompleted[lesson.id];
    const hasChapters = lesson.chapters && lesson.chapters.length;

    const div = document.createElement('div');
    div.className = 'aha-lesson' + (isDone ? ' done' : '');

    const header = document.createElement('div');
    header.className = 'aha-lesson-header';
    header.innerHTML = `
      <span class="aha-lesson-num">${lesson.id}</span>
      <span class="aha-lesson-title">${lesson.title}</span>
      ${hasChapters ? '<span class="aha-expand-icon">▼</span>' : ''}
      <span class="aha-lesson-check ${isDone ? 'checked' : ''}" data-id="${lesson.id}" title="Mark complete">${isDone ? '✓' : ''}</span>`;

    // toggle expand
    if (hasChapters) {
      header.addEventListener('click', e => {
        if (e.target.classList.contains('aha-lesson-check')) return;
        div.classList.toggle('expanded');
      });
    }

    // check button
    header.querySelector('.aha-lesson-check').addEventListener('click', e => {
      e.stopPropagation();
      const id = e.currentTarget.dataset.id;
      ahaCompleted[id] = !ahaCompleted[id];
      saveAha();
      renderAhaGuru();
    });

    div.appendChild(header);

    if (hasChapters) {
      const chapDiv = document.createElement('div');
      chapDiv.className = 'aha-chapters';
      chapDiv.innerHTML = lesson.chapters.map(ch => {
        const isPE = ch.id === 'PE';
        const isSE = ch.id.startsWith('SE');
        const badgeCls = isPE ? 'practice' : isSE ? 'solved' : 'chapter';
        const badgeLabel = isPE ? 'Practice' : isSE ? 'Solved' : ch.id;
        const meta = ch.questions ? `${ch.questions} questions` : ch.slides ? `${ch.slides} slide${ch.slides > 1 ? 's' : ''}` : '';
        return `<div class="aha-chapter">
          <span class="aha-chapter-badge ${badgeCls}">${badgeLabel}</span>
          <span class="aha-chapter-title">${ch.title}</span>
          <span class="aha-chapter-meta">${meta}</span>
        </div>`;
      }).join('');
      div.appendChild(chapDiv);
    }

    list.appendChild(div);
  });
}

// ===== INIT =====
loadStorage();
initNav();
initPlanner();
initUpdates();
setTopbarDate();
initSuperset();
initYts();
initTimetable();

fetch('courseplanner.json')
  .then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })
  .then(data => {
    plannerData = data;
    renderDashboard();
    renderPlannerTable(getFilteredData());
    renderUpdates();
  })
  .catch(() => {
    // fallback to inline data (works when opened via file://)
    plannerData = window.COURSE_PLANNER_DATA || [];
    renderDashboard();
    renderPlannerTable(getFilteredData());
    renderUpdates();
  });

fetch('aha-maths.json')
  .then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })
  .then(data => {
    ahaData = data;
    if (document.getElementById('ahaguruPage').style.display !== 'none') renderAhaGuru();
  })
  .catch(() => {
    // fallback to inline data (works when opened via file://)
    ahaData = window.AHA_MATHS_DATA || [];
    if (document.getElementById('ahaguruPage').style.display !== 'none') renderAhaGuru();
  });

// ===== JEE SUPERSET =====
const SUPERSET_KEY = 'iit_superset_v1';
let supersetData = { jee: [], yr1: [], yr2: [], eapcet: [] };
function loadSuperset() {
  try { supersetData = JSON.parse(localStorage.getItem(SUPERSET_KEY)) || { jee: [], yr1: [], yr2: [], eapcet: [] }; } catch { supersetData = { jee: [], yr1: [], yr2: [], eapcet: [] }; }
}
function saveSuperset() { localStorage.setItem(SUPERSET_KEY, JSON.stringify(supersetData)); }

function renderSupersetCol(bodyId, key, isChecklist) {
  const body = document.getElementById(bodyId);
  if (!body) return;
  if (supersetData[key].length === 0) {
    body.innerHTML = `<div style="padding:16px;color:var(--text-muted);font-size:0.85em">No items yet</div>`;
    return;
  }
  body.innerHTML = supersetData[key].map((item, i) => isChecklist
    ? `<div class="superset-check-item${item.done ? ' done' : ''}">
        <input type="checkbox" ${item.done ? 'checked' : ''} data-key="${key}" data-i="${i}">
        <span>${supersetData.jee[i] ? supersetData.jee[i].text : ''}</span>
       </div>`
    : `<div class="superset-jee-item">
        <span class="superset-num">${i + 1}.</span>
        <span>${item.text}</span>
       </div>`
  ).join('');
  if (isChecklist) {
    body.querySelectorAll('input[type=checkbox]').forEach(cb => {
      cb.addEventListener('change', () => {
        supersetData[cb.dataset.key][cb.dataset.i].done = cb.checked;
        saveSuperset();
        renderSupersetCol(bodyId, key, true);
      });
    });
  }
}

function renderSuperset() {
  loadSuperset();
  renderSupersetCol('supersetJeeBody', 'jee', false);
  // checklist cols mirror JEE topics
  ['yr1','yr2','eapcet'].forEach(key => {
    // sync: ensure same length as jee
    while (supersetData[key].length < supersetData.jee.length) {
      supersetData[key].push({ done: false });
    }
  });
  renderSupersetCol('superset1stBody', 'yr1', true);
  renderSupersetCol('superset2ndBody', 'yr2', true);
  renderSupersetCol('supersetEapcetBody', 'eapcet', true);
}

function initSuperset() {
  const btn = document.getElementById('supersetJeeAdd');
  const inp = document.getElementById('supersetJeeInput');
  if (!btn || !inp) return;
  const add = () => {
    const val = inp.value.trim();
    if (!val) return;
    supersetData.jee.push({ text: val });
    saveSuperset();
    inp.value = '';
    renderSuperset(); // re-render all cols so ticklists sync
  };
  btn.addEventListener('click', add);
  inp.addEventListener('keydown', e => { if (e.key === 'Enter') add(); });
}

// ===== YTS =====
const YTS_KEY = 'iit_yts_v1';
let ytsSongs = [];
function loadYts() { try { ytsSongs = JSON.parse(localStorage.getItem(YTS_KEY)) || []; } catch { ytsSongs = []; } }
function saveYts() { localStorage.setItem(YTS_KEY, JSON.stringify(ytsSongs)); }

function renderYts() {
  loadYts();
  const tbody = document.getElementById('ytsTableBody');
  tbody.innerHTML = ytsSongs.length === 0
    ? `<tr><td colspan="7" style="padding:24px;text-align:center;color:var(--text-muted)">No songs yet. Add one above.</td></tr>`
    : ytsSongs.map((s, i) => `
      <tr>
        <td class="col-song">${s.title}</td>
        <td class="col-blank"></td>
        <td><input type="checkbox" ${s.recorded?'checked':''} data-i="${i}" data-f="recorded"></td>
        <td><input type="checkbox" ${s.uploaded?'checked':''} data-i="${i}" data-f="uploaded"></td>
        <td><input type="checkbox" ${s.yts?'checked':''} data-i="${i}" data-f="yts"></td>
        <td><input type="checkbox" ${s.insta?'checked':''} data-i="${i}" data-f="insta"></td>
        <td><button class="yts-del-btn" data-i="${i}" title="Delete">✕</button></td>
      </tr>`).join('');
  tbody.querySelectorAll('input[type=checkbox]').forEach(cb => {
    cb.addEventListener('change', () => {
      ytsSongs[cb.dataset.i][cb.dataset.f] = cb.checked;
      saveYts();
    });
  });
  tbody.querySelectorAll('.yts-del-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      ytsSongs.splice(btn.dataset.i, 1);
      saveYts(); renderYts();
    });
  });
}

function initYts() {
  const inp = document.getElementById('ytsSongInput');
  const btn = document.getElementById('ytsAddBtn');
  if (!btn || !inp) return;
  const add = () => {
    const val = inp.value.trim();
    if (!val) return;
    ytsSongs.push({ title: val, recorded: false, uploaded: false, yts: false, insta: false });
    saveYts(); inp.value = ''; renderYts();
  };
  btn.addEventListener('click', add);
  inp.addEventListener('keydown', e => { if (e.key === 'Enter') add(); });
}

// ===== TIMETABLE =====
const TT_KEY = 'iit_timetable_v1';
const TT_DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
let ttRows = [];
function loadTt() { try { ttRows = JSON.parse(localStorage.getItem(TT_KEY)) || []; } catch { ttRows = []; }
  if (!ttRows.length) ttRows = [
    { time: '6:00 AM', cells: Array(7).fill('') },
    { time: '8:00 AM', cells: Array(7).fill('') },
    { time: '10:00 AM', cells: Array(7).fill('') },
    { time: '12:00 PM', cells: Array(7).fill('') },
    { time: '2:00 PM', cells: Array(7).fill('') },
    { time: '4:00 PM', cells: Array(7).fill('') },
    { time: '6:00 PM', cells: Array(7).fill('') },
    { time: '8:00 PM', cells: Array(7).fill('') },
  ];
}
function saveTt() { localStorage.setItem(TT_KEY, JSON.stringify(ttRows)); }

function renderTimetable() {
  loadTt();
  const tbody = document.getElementById('ttTableBody');
  tbody.innerHTML = ttRows.map((row, ri) => `
    <tr>
      <td>${row.time}</td>
      ${row.cells.map((cell, ci) => `
        <td><input class="tt-cell-input" value="${cell}" data-ri="${ri}" data-ci="${ci}" placeholder="—"></td>
      `).join('')}
    </tr>`).join('');
  tbody.querySelectorAll('.tt-cell-input').forEach(inp => {
    inp.addEventListener('change', () => {
      ttRows[inp.dataset.ri].cells[inp.dataset.ci] = inp.value;
      saveTt();
    });
  });
}

function initTimetable() {
  const inp = document.getElementById('ttSlotInput');
  const btn = document.getElementById('ttAddSlotBtn');
  const addRowBtn = document.getElementById('ttAddRowBtn');
  if (btn && inp) {
    const add = () => {
      const val = inp.value.trim();
      if (!val) return;
      ttRows.push({ time: val, cells: Array(7).fill('') });
      saveTt(); inp.value = ''; renderTimetable();
    };
    btn.addEventListener('click', add);
    inp.addEventListener('keydown', e => { if (e.key === 'Enter') add(); });
  }
  if (addRowBtn) {
    addRowBtn.addEventListener('click', () => {
      ttRows.push({ time: 'New Slot', cells: Array(7).fill('') });
      saveTt(); renderTimetable();
    });
  }
}

