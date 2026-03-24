import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [maths, setMaths] = useState([]);
  const [planner, setPlanner] = useState([]);
  const [yts, setYts] = useState([]);
  const [expandedLessons, setExpandedLessons] = useState({});
  const [filterDropdown, setFilterDropdown] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('all');

  useEffect(() => {
    fetch(process.env.PUBLIC_URL + '/data/aha-maths.json')
      .then(res => res.json())
      .then(setMaths);
    fetch(process.env.PUBLIC_URL + '/data/courseplanner.json')
      .then(res => res.json())
      .then(setPlanner);
    fetch(process.env.PUBLIC_URL + '/data/yts.json')
      .then(res => res.json())
      .then(setYts);
  }, []);

  const toggleLesson = (lessonId) => {
    setExpandedLessons(prev => ({
      ...prev,
      [lessonId]: !prev[lessonId]
    }));
  };

  const toggleExpanded = (lessonId) => {
    setExpandedLessons(prev => ({
      ...prev,
      [lessonId]: !prev[lessonId]
    }));
  };

  const subjects = ['Physics', 'Organic Chem', 'Physical Chem', 'Math'];

  const filteredPlanner = selectedSubject === 'all' 
    ? planner 
    : planner.filter(row => {
        const subjectKey = selectedSubject.toLowerCase().replace(/ /g, '');
        return row[subjectKey] || row[selectedSubject];
      });

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
    { id: 'planner', label: 'Course Planner', icon: '📅' },
    { id: 'maths', label: 'Aha Maths', icon: '📐' },
    { id: 'yts', label: 'YTS', icon: '🎬' },
  ];

  return (
    <div className="App">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="brand">IIT</div>
        <nav className="nav">
          {navItems.map(item => (
            <button
              key={item.id}
              className={`nav-btn ${activePage === item.id ? 'active' : ''}`}
              onClick={() => setActivePage(item.id)}
              title={item.label}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main">
        {/* Dashboard Page */}
        <div className={`page ${activePage === 'dashboard' ? 'active' : ''}`}>
          <h1>Dashboard</h1>
          <div className="dashboard-grid">
            <div className="card">
              <h2>📚 Math Lessons</h2>
              <div className="stat-box">
                <div className="stat-number">{maths.length}</div>
                <div className="stat-label">Total Lessons Available</div>
              </div>
              <ul style={{ marginTop: '20px' }}>
                {maths.slice(0, 5).map(lesson => (
                  <li key={lesson.id} style={{ paddingLeft: '8px' }}>
                    <strong>{lesson.title}</strong>
                    <div style={{ fontSize: '0.9em', color: 'var(--muted)', marginTop: '4px' }}>
                      {lesson.chapters.length} chapters
                    </div>
                  </li>
                ))}
              </ul>
              {maths.length > 5 && (
                <div style={{ color: 'var(--accent)', marginTop: '16px', fontSize: '0.95em', fontWeight: 'bold' }}>
                  +{maths.length - 5} more lessons →
                </div>
              )}
            </div>

            <div className="card">
              <h2>📅 Course Schedule</h2>
              <div className="stat-box">
                <div className="stat-number">{planner.length}</div>
                <div className="stat-label">Planned Sessions</div>
              </div>
              <div style={{ fontSize: '0.95em', lineHeight: '1.8', marginTop: '20px' }}>
                <div style={{ marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid var(--border)' }}>
                  <strong style={{ color: 'var(--accent)' }}>Subjects:</strong>
                  <div style={{ marginTop: '8px', color: 'var(--muted)' }}>
                    Physics, Chemistry, Math
                  </div>
                </div>
                <div>
                  <strong style={{ color: 'var(--accent)' }}>Status:</strong>{' '}
                  <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>✓ Active</span>
                </div>
              </div>
            </div>

            <div className="card">
              <h2>⚡ Quick Stats</h2>
              <div className="stat-box">
                <div className="stat-number">
                  {maths.reduce((sum, l) => sum + l.chapters.length, 0)}
                </div>
                <div className="stat-label">Total Chapters</div>
              </div>
              <ul style={{ marginTop: '20px' }}>
                <li style={{ paddingLeft: '8px' }}>
                  <strong>Lessons:</strong> {maths.length}
                </li>
                <li style={{ paddingLeft: '8px' }}>
                  <strong>Sessions:</strong> {planner.length}
                </li>
                <li style={{ paddingLeft: '8px' }}>
                  <strong>Status:</strong> <span style={{ color: 'var(--success)' }}>Ready</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Course Planner Page */}
        <div className={`page ${activePage === 'planner' ? 'active' : ''}`}>
          <h1>Course Planner</h1>
          
          {/* Dropdown Filter */}
          <div className="card" style={{ marginBottom: '24px' }}>
            <div className="dropdown">
              <button
                className={`dropdown-trigger ${filterDropdown ? 'active' : ''}`}
                onClick={() => setFilterDropdown(!filterDropdown)}
              >
                <span>📌 {selectedSubject === 'all' ? 'All Subjects' : selectedSubject}</span>
                <span className="dropdown-arrow">▼</span>
              </button>
              <div className={`dropdown-menu ${filterDropdown ? 'expanded' : ''}`}>
                <div
                  className="dropdown-item"
                  onClick={() => {
                    setSelectedSubject('all');
                    setFilterDropdown(false);
                  }}
                >
                  All Subjects
                </div>
                {subjects.map(subject => (
                  <div
                    key={subject}
                    className="dropdown-item"
                    onClick={() => {
                      setSelectedSubject(subject);
                      setFilterDropdown(false);
                    }}
                  >
                    {subject}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="card">
            <div style={{ overflowX: 'auto' }}>
              <table className="planner-table">
                <thead>
                  <tr>
                    <th>📅 Date</th>
                    <th>⚛️ Physics</th>
                    <th>🧪 Organic Chem</th>
                    <th>🔬 Physical Chem</th>
                    <th>📐 Math</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPlanner.map((row, i) => (
                    <tr key={i}>
                      <td><strong>{row.date}</strong></td>
                      <td>{row.physics || '—'}</td>
                      <td>{row.organicChem || '—'}</td>
                      <td>{row.physicalChem || '—'}</td>
                      <td>{row.math || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ marginTop: '20px', padding: '16px', backgroundColor: '#f3f4f6', borderRadius: 'var(--radius)', color: 'var(--muted)', fontSize: '0.95em' }}>
              📌 Showing <strong style={{ color: 'var(--accent)' }}>{filteredPlanner.length}</strong> sessions
              {selectedSubject !== 'all' && ` for ${selectedSubject}`}
            </div>
          </div>
        </div>

        {/* Aha Maths Page */}
        <div className={`page ${activePage === 'maths' ? 'active' : ''}`}>
          <h1>📐 Aha Guru Mathematics</h1>
          
          {maths.map(lesson => (
            <div key={lesson.id} className="expandable-section">
              <div
                className={`expandable-header ${expandedLessons[lesson.id] ? 'expanded' : ''}`}
                onClick={() => toggleExpanded(lesson.id)}
              >
                <span>{lesson.title}</span>
                <span className="expandable-toggle">▼</span>
              </div>
              <div className={`expandable-content ${expandedLessons[lesson.id] ? 'expanded' : ''}`}>
                <ul className="chapter-list">
                  {lesson.chapters.map(chap => (
                    <li key={chap.id} className="chapter-item">
                      <div className="chapter-name">
                        {chap.title}
                      </div>
                      <div className="chapter-meta">
                        {chap.slides && `${chap.slides} slides`}
                        {chap.questions && `${chap.questions} Q`}
                        {!chap.slides && !chap.questions && 'Content'}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* YTS Page */}
        <div className={`page ${activePage === 'yts' ? 'active' : ''}`}>
          <h1>🎬 YouTube Shorts (YTS)</h1>
          <div className="card">
            <div style={{ overflowX: 'auto' }}>
              <table className="yts-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Song Name</th>
                    <th>Recorded</th>
                    <th>Instagram</th>
                    <th>YouTube</th>
                  </tr>
                </thead>
                <tbody>
                  {yts.map((row, i) => (
                    <tr key={i}>
                      <td className="yts-sno"><strong>{row.sno}</strong></td>
                      <td className="yts-song"><strong>{row.song}</strong></td>
                      <td className="yts-status">
                        <span className={`status-badge ${row.recorded === 'yes' ? 'status-yes' : 'status-no'}`}>
                          {row.recorded === 'yes' ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td className="yts-status">
                        <span className={`status-badge ${row.insta === 'uploaded' ? 'status-uploaded' : 'status-pending'}`}>
                          {row.insta === 'uploaded' ? 'Uploaded' : row.insta || '—'}
                        </span>
                      </td>
                      <td className="yts-status">
                        <span className={`status-badge ${row.youtube === 'uploaded' ? 'status-uploaded' : 'status-pending'}`}>
                          {row.youtube === 'uploaded' ? 'Uploaded' : row.youtube || '—'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ marginTop: '20px', padding: '16px', backgroundColor: '#f3f4f6', borderRadius: 'var(--radius)', color: 'var(--muted)', fontSize: '0.95em' }}>
              📊 Total Songs: <strong style={{ color: 'var(--accent)' }}>{yts.length}</strong> | 
              Recorded: <strong style={{ color: 'var(--success)' }}>{yts.filter(s => s.recorded === 'yes').length}</strong> | Status: <strong style={{ color: 'var(--success)' }}>Active</strong>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
