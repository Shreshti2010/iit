// IIT Prep Planner App
// Modular, clean, vanilla JS

// --- State & Constants ---
const PAGES = ['dashboard', 'planner', 'updates', 'progress'];
const LECTURE_KEY = 'iit_lectures_completed_v1';
const UPDATES_KEY = 'iit_daily_updates_v1';
let plannerData = [];
let completedLectures = {};
let dailyUpdates = [];

// --- Navigation ---
const navBtns = document.querySelectorAll('.nav-btn');
const pageEls = {
  dashboard: document.getElementById('dashboardPage'),
  planner: document.getElementById('plannerPage'),
  updates: document.getElementById('updatesPage'),
  progress: document.getElementById('progressPage'),
  ahaMaths: document.getElementById('ahaMathsPage'),
  'syllabus-jee': document.getElementById('syllabus-jee'),
  'syllabus-1st': document.getElementById('syllabus-1st'),
  'syllabus-2nd': document.getElementById('syllabus-2nd'),
  'syllabus-eapcet': document.getElementById('syllabus-eapcet'),
  'jee-superset': document.getElementById('jee-superset'),
  yts: document.getElementById('yts'),
  timetable: document.getElementById('timetable'),
};
navBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    PAGES.forEach(p => {
      if(pageEls[p]) pageEls[p].style.display = (btn.dataset.page === p) ? '' : 'none';
    });
    navBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    if (btn.dataset.page === 'dashboard') renderDashboard();
    if (btn.dataset.page === 'progress') renderProgress();
    if (btn.dataset.page === 'ahaMaths') renderAhaMaths();
    if (btn.dataset.page === 'jee-superset') renderJeeSuperset();
    if (btn.dataset.page === 'yts') renderYtsTable();
    if (btn.dataset.page === 'timetable') renderTimetable();
  });
});
// Default page
navBtns[0].classList.add('active');

// --- Data Loading ---
function loadPlanner() {
  return fetch('screenshots.json')
    .then(r => r.json())
    .then(data => {
      plannerData = data;
      renderPlannerTable();
      renderDashboard();
      renderProgress();
    });
}
function loadCompletedLectures() {
  try {
    completedLectures = JSON.parse(localStorage.getItem(LECTURE_KEY)) || {};
  } catch { completedLectures = {}; }
}
function saveCompletedLectures() {
  localStorage.setItem(LECTURE_KEY, JSON.stringify(completedLectures));
}
function loadDailyUpdates() {
  try {
    dailyUpdates = JSON.parse(localStorage.getItem(UPDATES_KEY)) || [];
  } catch { dailyUpdates = []; }
}
function saveDailyUpdates() {
  localStorage.setItem(UPDATES_KEY, JSON.stringify(dailyUpdates));
}

// --- Planner Table ---
function renderPlannerTable() {
  const tbody = document.getElementById('plannerTableBody');
  tbody.innerHTML = '';
  plannerData.forEach((row, idx) => {
    const tr = document.createElement('tr');
    // Date
    const tdDate = document.createElement('td');
    tdDate.textContent = row.date;
    tr.appendChild(tdDate);
    // For each subject
    ['physics','physicalChem','organicChem','math'].forEach(subj => {
      const td = document.createElement('td');
      if (row[subj]) {
        const id = `${row.date}_${subj}`;
        const checked = completedLectures[id];
        const label = document.createElement('label');
        label.className = checked ? 'lecture-completed' : 'lecture-pending';
        const cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.className = 'lecture-checkbox';
        cb.checked = !!checked;
        cb.addEventListener('change', () => toggleLectureComplete(id, cb, label));
        label.appendChild(cb);
        label.appendChild(document.createTextNode(row[subj]));
        td.appendChild(label);
      }
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
}
function toggleLectureComplete(id, cb, label) {
  completedLectures[id] = cb.checked;
  saveCompletedLectures();
  label.className = cb.checked ? 'lecture-completed' : 'lecture-pending';
  renderDashboard();
  renderProgress();
}

// --- Daily Updates ---
function renderDailyUpdates() {
  loadDailyUpdates();
  const list = document.getElementById('updatesList');
  list.innerHTML = '';
  dailyUpdates.slice().reverse().forEach(update => {
    const li = document.createElement('li');
    const date = document.createElement('div');
    date.className = 'update-date';
    date.textContent = update.date;
    const text = document.createElement('div');
    text.textContent = update.text;
    li.appendChild(date);
    li.appendChild(text);
    list.appendChild(li);
  });
}
document.getElementById('dailyUpdateForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const text = document.getElementById('updateText').value.trim();
  if (!text) return;
  const today = new Date().toISOString().slice(0,10);
  dailyUpdates.push({ date: today, text });
  saveDailyUpdates();
  document.getElementById('updateText').value = '';
  renderDailyUpdates();
});

// --- Dashboard ---
function renderDashboard() {
  // Today's lectures
  const today = new Date().toISOString().slice(0,10);
  const todayRow = plannerData.find(r => r.date === today);
  const todayLectures = document.getElementById('todayLectures');
  todayLectures.innerHTML = '';
  if (todayRow) {
    ['physics','physicalChem','organicChem','math'].forEach(subj => {
      if (todayRow[subj]) {
        const id = `${todayRow.date}_${subj}`;
        const li = document.createElement('li');
        li.textContent = todayRow[subj];
        if (completedLectures[id]) li.className = 'lecture-completed';
        todayLectures.appendChild(li);
      }
    });
  } else {
    todayLectures.innerHTML = '<li>No lectures scheduled today.</li>';
  }
  // Completed lectures
  const completed = Object.keys(completedLectures).filter(k => completedLectures[k]);
  const completedLecturesList = document.getElementById('completedLectures');
  completedLecturesList.innerHTML = '';
  completed.forEach(id => {
    const [date, subj] = id.split('_');
    const row = plannerData.find(r => r.date === date);
    if (row && row[subj]) {
      const li = document.createElement('li');
      li.textContent = `${row[subj]} (${date})`;
      li.className = 'lecture-completed';
      completedLecturesList.appendChild(li);
    }
  });
  // Pending lectures
  const pendingLecturesList = document.getElementById('pendingLectures');
  pendingLecturesList.innerHTML = '';
  plannerData.forEach(row => {
    ['physics','physicalChem','organicChem','math'].forEach(subj => {
      if (row[subj]) {
        const id = `${row.date}_${subj}`;
        if (!completedLectures[id]) {
          const li = document.createElement('li');
          li.textContent = `${row[subj]} (${row.date})`;
          li.className = 'lecture-pending';
          pendingLecturesList.appendChild(li);
        }
      }
    });
  });
  // Study streak
  const streak = calculateStreak();
  document.getElementById('studyStreak').textContent = streak + ' days';
  // Progress bar
  const { percent } = calculateProgress();
  document.getElementById('dashboardProgressBar').style.width = percent + '%';
  document.getElementById('dashboardProgressText').textContent = percent.toFixed(1) + '% completed';
}

// --- Progress Page ---
function renderProgress() {
  const { total, completed, pending, percent } = calculateProgress();
  document.getElementById('totalLectures').textContent = total;
  document.getElementById('completedLecturesCount').textContent = completed;
  document.getElementById('pendingLecturesCount').textContent = pending;
  document.getElementById('mainProgressBar').style.width = percent + '%';
  document.getElementById('mainProgressText').textContent = percent.toFixed(1) + '% completed';
}

// --- Progress Calculation ---
function calculateProgress() {
  let total = 0, completed = 0;
  plannerData.forEach(row => {
    ['physics','physicalChem','organicChem','math'].forEach(subj => {
      if (row[subj]) {
        total++;
        const id = `${row.date}_${subj}`;
        if (completedLectures[id]) completed++;
      }
    });
  });
  const pending = total - completed;
  const percent = total ? (completed / total) * 100 : 0;
  return { total, completed, pending, percent };
}

// --- Study Streak Calculation ---
function calculateStreak() {
  // Count consecutive days with at least one lecture completed
  const dates = plannerData.map(r => r.date).sort();
  let streak = 0;
  for (let i = dates.length - 1; i >= 0; i--) {
    const date = dates[i];
    let anyCompleted = false;
    ['physics','physicalChem','organicChem','math'].forEach(subj => {
      const id = `${date}_${subj}`;
      if (completedLectures[id]) anyCompleted = true;
    });
    if (anyCompleted) streak++;
    else break;
  }
  return streak;
}

// --- Aha Guru Maths Syllabus ---
function renderAhaMaths() {
  const el = document.getElementById('ahaMathsSyllabus');
  el.innerHTML = `
    <div class="aha-section-title">Trigonometry</div>
    <ul class="aha-list">
      <li class="aha-topic">L1 Trigonometry I</li>
      <li class="aha-topic">L2 Trigonometry II</li>
      <li class="aha-topic">L3 Trigonometry Extra Practice</li>
      <li class="aha-topic">L4 Trigonometry III</li>
      <li class="aha-topic">L5 Trigonometry IV</li>
      <li class="aha-topic">C1: General Solution of Trigonometric Equations (1 slide)</li>
      <li class="aha-topic">C1: Solved Examples (4 slides)</li>
      <li class="aha-topic">C2: Equations of the form a cosθ + b sinθ = c (1 slide)</li>
      <li class="aha-topic">C2: Solved Examples (4 slides)</li>
      <li class="aha-topic">C3: General theorem using Tangent and Euler’s formula [JEE] (1 slide)</li>
      <li class="aha-topic">C3: Solved Examples (5 slides)</li>
      <li class="aha-topic">C4: Trigonometric Series [JEE] (3 slides)</li>
      <li class="aha-topic">C4: Solved Examples (3 slides)</li>
      <li class="aha-topic">PE: Practice Exercise (15 questions)</li>
    </ul>
    <div class="aha-section-title">Algebra &amp; Series</div>
    <ul class="aha-list">
      <li class="aha-topic">L6 Solution of Triangles</li>
      <li class="aha-topic">L7 Logarithms</li>
      <li class="aha-topic">L8 Sequence and Series</li>
      <li class="aha-topic">L9 Sequence and Series I – Arithmetic Progression</li>
      <li class="aha-topic">L10 Sequence and Series II – Geometric Progression (Extra Lesson)</li>
      <li class="aha-topic">L11 Sequence and Series III (Extra Lesson)</li>
      <li class="aha-topic">L12 Complex Numbers I</li>
      <li class="aha-topic">L13 Complex Numbers II</li>
      <li class="aha-topic">L14 Complex Numbers III</li>
      <li class="aha-topic">L15 Complex Numbers IV</li>
      <li class="aha-topic">L16 Quadratic Equations I</li>
      <li class="aha-topic">L17 Quadratic Equations II</li>
      <li class="aha-topic">L18 Quadratic Equations III</li>
    </ul>
    <div class="aha-section-title">Coordinate Geometry</div>
    <ul class="aha-list">
      <li class="aha-topic">L19 Coordinate Geometry - Straight lines I</li>
      <li class="aha-topic">L20 Coordinate Geometry - Straight lines II</li>
      <li class="aha-topic">L21 Coordinate Geometry - Straight lines III</li>
    </ul>
    <div class="aha-section-title">More Topics</div>
    <ul class="aha-list">
      <li class="aha-topic">L22 Binomial Theorem</li>
      <li class="aha-topic">L23 Inequalities</li>
      <li class="aha-topic">L24 Linear Inequalities</li>
      <li class="aha-topic">L25 Mathematical Induction</li>
      <li class="aha-topic">L26 Mathematical Reasoning</li>
      <li class="aha-topic">L27 Limits I</li>
      <li class="aha-topic">L28 Limits II</li>
      <li class="aha-topic">L29 Differentiation in Limits</li>
      <li class="aha-topic">L30 Fun with Differentiation I</li>
      <li class="aha-topic">L31 Fun with Differentiation II</li>
      <li class="aha-topic">L32 Sets</li>
      <li class="aha-topic">L33 Relations</li>
      <li class="aha-topic">L34 Functions</li>
      <li class="aha-topic">L35 Sets, Relations and Functions (Extra Lesson)</li>
      <li class="aha-topic">L36 Permutations</li>
      <li class="aha-topic">L37 Combinations</li>
      <li class="aha-topic">L38 Permutations and Combinations I (Extra Lesson)</li>
      <li class="aha-topic">L39 Permutations and Combinations II (Extra Lesson)</li>
      <li class="aha-topic">L40 Permutations and Combinations III (Extra Lesson)</li>
      <li class="aha-topic">L41 Circles I</li>
      <li class="aha-topic">L42 Circles II</li>
      <li class="aha-topic">L43 Conics I</li>
      <li class="aha-topic">L44 Conics II</li>
      <li class="aha-topic">L45 Conics (Extra Lesson)</li>
      <li class="aha-topic">L46 Introduction to 3D Geometry</li>
      <li class="aha-topic">L47 Probability</li>
    </ul>
    <div class="aha-section-title">Probability &amp; Statistics</div>
    <ul class="aha-list">
      <li class="aha-topic">C1: Probability of an event (1 slide)</li>
      <li class="aha-topic">C1: Solved Examples (3 slides)</li>
      <li class="aha-topic">C2: Rules of Probability (2 slides)</li>
      <li class="aha-topic">C2: Solved Examples (7 slides)</li>
      <li class="aha-topic">PE: Practice Exercise (8 questions)</li>
      <li class="aha-topic">L48 Theory of Equations</li>
      <li class="aha-topic">C1: Solving Quadratic Equations (1 slide)</li>
      <li class="aha-topic">C2: Complex roots of Quadratic Equations (1 slide)</li>
      <li class="aha-topic">SE: Solved Examples (8 slides)</li>
      <li class="aha-topic">C3: Plotting graph of Quadratic Equation (1 slide)</li>
      <li class="aha-topic">C4: Solving Quadratic Inequalities (1 slide)</li>
      <li class="aha-topic">C5: Range of Quadratic Expressions (1 slide)</li>
      <li class="aha-topic">SE: Solved Examples (6 slides)</li>
      <li class="aha-topic">C6: Solution of other types of equations (1 slide)</li>
      <li class="aha-topic">C7: Equations with absolute value (1 slide)</li>
      <li class="aha-topic">C8: Solving special fourth degree equations (1 slide)</li>
      <li class="aha-topic">SE: Solved Examples (7 slides)</li>
      <li class="aha-topic">PE: Practice Exercise (13 questions)</li>
      <li class="aha-topic">L49 Statistics</li>
      <li class="aha-topic">C1: Mean deviation about Mean and Median (1 slide)</li>
      <li class="aha-topic">C1: Solved Examples (6 slides)</li>
      <li class="aha-topic">C2: Variance and Standard Deviation (1 slide)</li>
      <li class="aha-topic">C2: Solved Examples (8 slides)</li>
      <li class="aha-topic">C3: Coefficient of Variation (1 slide)</li>
      <li class="aha-topic">C3: Solved Examples (3 slides)</li>
      <li class="aha-topic">PE: Practice Exercise (7 questions)</li>
    </ul>
  `;
}

// --- JEE Superset Table ---
function renderJeeSuperset() {
  const el = document.getElementById('jeeSupersetTable');
  // 20 empty rows for user to fill topics and checklists
  let html = `<table class="superset-table"><thead><tr><th style="width:40px">#</th><th style="min-width:220px">JEE Topic</th><th>1st Year</th><th>2nd Year</th><th>EAPCET</th></tr></thead><tbody>`;
  for(let i=1; i<=20; i++) {
    html += `<tr><td>${i}.</td><td contenteditable="true" class="jee-topic-cell"></td>`;
    ['y1','y2','eapcet'].forEach(() => {
      html += `<td class="check-col"><input type="checkbox"></td>`;
    });
    html += `</tr>`;
  }
  html += `</tbody></table>`;
  el.innerHTML = html;
}

// --- YTS Table ---
function renderYtsTable() {
  const el = document.getElementById('ytsTable');
  // Example data, replace with your own
  const rows = [
    { song: 'Song 1', blank: '', vg: '', recorded: true, uploaded: false, yts: true, insta: false },
    { song: 'Song 2', blank: '', vg: '', recorded: false, uploaded: false, yts: false, insta: false },
    { song: 'Song 3', blank: '', vg: '', recorded: true, uploaded: true, yts: true, insta: true },
  ];
  let html = `<table class="yts-table"><thead><tr><th>Songs</th><th></th><th>V/G?</th><th>Recorded?</th><th>Uploaded?</th><th>YTS</th><th>Insta</th></tr></thead><tbody>`;
  rows.forEach(row => {
    html += `<tr><td>${row.song}</td><td></td>`;
    // V/G select
    html += `<td><select><option value=""></option><option value="V">V</option><option value="G">G</option></select></td>`;
    ['recorded','uploaded','yts','insta'].forEach(col => {
      html += `<td><input type="checkbox" disabled ${row[col] ? 'checked' : ''}></td>`;
    });
    html += `</tr>`;
  });
  html += `</tbody></table>`;
  el.innerHTML = html;
}
