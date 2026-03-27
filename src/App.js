import React, { useEffect, useState } from 'react';
import './App.css';

// All Weeks Schedule Component - Single Page View
function AllWeeksSchedule({ subject, expandedWeek, setExpandedWeek }) {
  // AhaGuru Mathematics Lesson Sequence aligned with 31-week curriculum (March 30 - October 31)
  // Distributing 49 AhaGuru lessons (L1-L49) across 31 weeks
  const mathsWeeklyPlan = {
    0: { topic: 'Week 1: Trigonometry I-II (L1-L2)', subtopic: 'Trig Ratios, Angles, Identities', days: ['L1: Trig Ratios', 'L1: Complementary Angles', 'L2: Sum to Product', 'L2: Double/Triple Angles', 'L2: Special Angles', 'Practice & Test'] },
    1: { topic: 'Week 2: Trigonometry III-IV (L3-L4)', subtopic: 'Trig Equations, Series, Tricks', days: ['L3: Extra Trig Practice', 'L4: Angles in AP', 'L4: Angles in GP', 'L4: tan Problems', 'L4: Series with Powers', 'Weekly Test'] },
    2: { topic: 'Week 3: Trigonometry IV & Solution of Triangles (L5-L6)', subtopic: 'Trig Equations, Triangles', days: ['L5: General Solution', 'L5: Equations a·cos+b·sin=c', 'L5: Trig Series', 'L6: Sine Rule', 'L6: Cosine Rule', 'Practice & Test'] },
    3: { topic: 'Week 4: Logarithms (L7)', subtopic: 'Exponents, Logarithms, Change of Base', days: ['L7: Review of Exponents', 'L7: Logarithms Intro', 'L7: Change of Base', 'L7: Log Properties', 'L7: Log Applications', 'Weekly Test'] },
    4: { topic: 'Week 5: Sequences and Series I-II (L8-L9)', subtopic: 'A.P. & G.P. Fundamentals', days: ['L8: Intro to Sequence', 'L8: A.P. & G.P. Relations', 'L9: A.P. Introduction', 'L9: A.P. Formulas', 'L9: A.P. Problems', 'Practice & Test'] },
    5: { topic: 'Week 6: Sequences II-III (L10-L11)', subtopic: 'G.P., H.P., Means', days: ['L10: Geometric Progression', 'L10: Convergent G.P.', 'L11: Harmonic Progression', 'L11: Harmonic Mean', 'L11: A.G.P. Sequence', 'Weekly Test'] },
    6: { topic: 'Week 7: Complex Numbers I-II (L12-L13)', subtopic: 'Complex Basics, Argand Plane', days: ['L12: Complex Intro', 'L12: Operations', 'L13: Argand Plane', 'L13: Complex Conjugates', 'L13: Triangle Inequality', 'Practice & Test'] },
    7: { topic: 'Week 8: Complex Numbers III-IV (L14-L15)', subtopic: 'Polar Form, DeMoivre, Roots', days: ['L14: Polar Form', 'L14: De Moivre\'s Theorem', 'L14: Euler\'s Formula', 'L15: Operations Euler', 'L15: Roots of Complex', 'Weekly Test'] },
    8: { topic: 'Week 9: Quadratic Equations I (L16)', subtopic: 'Nature of Roots, Sum/Product', days: ['L16: Quadratic Intro', 'L16: Complex Roots', 'L16: Sum of Roots', 'L16: Product of Roots', 'L16: Applications', 'Practice & Test'] },
    9: { topic: 'Week 10: Quadratic Equations II (L17)', subtopic: 'Polynomials, Graphs, Location', days: ['L17: Polynomials & Identities', 'L17: Nature via Graphs', 'L17: Location of Roots', 'L17: Descartes Rule', 'L17: Modulus Equations', 'Weekly Test'] },
    10: { topic: 'Week 11: Quadratic Equations III (L18)', subtopic: 'Common Roots, Graphs, Solutions', days: ['L18: Componendo/Dividendo', 'L18: Condition Common Root', 'L18: Graph of Polynomial', 'L18: No Solution Intervals', 'L18: Advanced Problems', 'Practice & Test'] },
    11: { topic: 'Week 12: Coordinate Geometry Lines I (L19)', subtopic: 'Distance, Locus, Intro', days: ['L19: Intro to CoordGeom', 'L19: Midpoint Formula', 'L19: Section Formula', 'L19: Locus Concept', 'L19: Locus Examples', 'Weekly Test'] },
    12: { topic: 'Week 13: Coordinate Geometry Lines II (L20)', subtopic: 'Slopes, Equations, Forms', days: ['L20: Slope & Equations', 'L20: Intersection of Lines', 'L20: Slope-point Form', 'L20: Two-point Form', 'L20: Intercept Form', 'Practice & Test'] },
    13: { topic: 'Week 14: Coordinate Geometry Lines III (L21)', subtopic: 'Perpendiculars, Area, Angles', days: ['L20: Perpendicular Form', 'L21: Length of Perp', 'L21: Area of Polygons', 'L21: Foot of Perp', 'L21: Angle Bisectors', 'Weekly Test'] },
    14: { topic: 'Week 15: Binomial Theorem (L22)', subtopic: 'Expansion, Terms, Series', days: ['L22: Binomial Theorem', 'L22: General Term', 'L22: Middle Term', 'L22: Binomial Series', 'L22: Special Results', 'Practice & Test'] },
    15: { topic: 'Week 16: Inequalities (L23-L24)', subtopic: 'Rules, Linear, 2D Systems', days: ['L23: Rules of Inequality', 'L23: Useful Results', 'L24: Linear Inequality', 'L24: 2D Systems', 'L24: Graphical Solutions', 'Weekly Test'] },
    16: { topic: 'Week 17: Mathematical Induction & Reasoning (L25-L26)', subtopic: 'Induction, Logical Reasoning', days: ['L25: What is Induction', 'L25: Induction Examples', 'L26: Math Reasoning Intro', 'L26: Validating Statements', 'L26: Logic Concepts', 'Practice & Test'] },
    17: { topic: 'Week 18: Limits I (L27)', subtopic: 'Limits Fundamentals, Algebraic', days: ['L27: Intro Limits', 'L27: Indeterminate Forms', 'L27: Zeroes & Infinities', 'L27: Algebraic Limits', 'L27: Approximation', 'Weekly Test'] },
    18: { topic: 'Week 19: Limits II (L28)', subtopic: 'Trig, Sandwich, Exponential, Logs', days: ['L28: Trigonometric Limits', 'L28: Sandwich Theorem', 'L28: Exponential Limits', 'L28: Log Functions', 'L28: Graphing Functions', 'Practice & Test'] },
    19: { topic: 'Week 20: Differentiation in Limits (L29)', subtopic: 'Introduction to Derivatives', days: ['L29: Approximation', 'L29: Intro Derivatives', 'L29: Slope of Curve', 'L29: Rules of Derivatives', 'L29: Chain Rule', 'Weekly Test'] },
    20: { topic: 'Week 21: Fun with Differentiation I (L30)', subtopic: 'Basic Diff, Chain Rule, Formulas', days: ['L30: Basic Differentiation', 'L30: Chain Rule', 'L30: Useful Formulas', 'L30: Product & Quotient', 'L30: Practice', 'Practice & Test'] },
    21: { topic: 'Week 22: Fun with Differentiation II (L31)', subtopic: 'u/v Method, Inverse Trig, Complex', days: ['L31: u/v Method', 'L31: Inverse Trig Diff', 'L31: Complex Diff I', 'L31: Complex Diff II', 'L31: Advanced Diff', 'Weekly Test'] },
    22: { topic: 'Week 23: Sets (L32)', subtopic: 'Set Theory, Types, Operations', days: ['L32: Intro to Sets', 'L32: Types of Sets', 'L32: Sets containing Sets', 'L32: Operations on Sets', 'L32: Laws of Operations', 'Practice & Test'] },
    23: { topic: 'Week 24: Relations & Functions (L33-L34)', subtopic: 'Cartesian Product, Domain, Range', days: ['L32: Difference of Sets', 'L33: Cartesian Product', 'L33: Relations Intro', 'L34: Functions', 'L34: Domain & Range', 'Weekly Test'] },
    24: { topic: 'Week 25: Sets, Relations, Functions Extra (L35)', subtopic: 'Comprehensive Review Lesson', days: ['L35: Set Theory Review', 'L35: Subsets', 'L35: Cartesian Product', 'L35: Types of Relations', 'L35: Functions Deep Dive', 'Practice & Test'] },
    25: { topic: 'Week 26: Permutations (L36)', subtopic: 'Factorials, Counting, Arrangements', days: ['L36: Factorial', 'L36: Counting Principle', 'L36: Arrangements', 'L36: nPr Formula', 'L36: With Repetition', 'Weekly Test'] },
    26: { topic: 'Week 27: Combinations (L37)', subtopic: 'nCr, Selection, Properties', days: ['L37: Combinations Intro', 'L37: Properties of nCr', 'L37: Selection Problems', 'L37: Repetition Cases', 'L37: Applications', 'Practice & Test'] },
    27: { topic: 'Week 28: Permutations & Combinations I Extra (L38)', subtopic: 'Counting Tips & Tricks', days: ['L38: Counting Tip 1', 'L38: Counting Tip 2-3', 'L38: Counting Tip 4-7', 'L38: Counting Tip 8-10', 'L38: Advanced Problems', 'Weekly Test'] },
    28: { topic: 'Week 29: Permutations & Combinations II Extra (L39)', subtopic: 'Linear & Circular Arrangements', days: ['L39: Linear Permutation', 'L39: Circular Permutation', 'L39: General Formulas', 'L39: Complex Arrangements', 'L39: Problem Solving', 'Practice & Test'] },
    29: { topic: 'Week 30: Permutations & Combinations III Extra (L40)', subtopic: 'Grouping, Selection, Rank', days: ['L40: Forming/Grouping', 'L40: Inclusion-Exclusion', 'L40: Rank Concept', 'L40: Group Selection', 'L40: Configurations', 'Weekly Test'] },
    30: { topic: 'Week 31: Circles, Conics & Final Review (L41-L49)', subtopic: 'Complete Final Coverage', days: ['L41: Circle Equation', 'L42-43: Tangents & Parabola', 'L44-45: Ellipse & Hyperbola', 'L46-47: 3D & Probability', 'Final Comprehensive Test'] }
  };

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat-Sun'];
  const getWeekDate = (weekNum) => {
    const startDate = new Date(2026, 2, 30); // March 30, 2026 (Monday)
    startDate.setDate(startDate.getDate() + weekNum * 7);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 6);
    return { start: startDate, end: endDate };
  };

  return (
    <div style={{ display: 'grid', gap: '12px' }}>
      {Array.from({ length: 31 }, (_, idx) => {
        const weekPlan = mathsWeeklyPlan[idx];
        const isExpanded = expandedWeek === idx;
        const dateRange = getWeekDate(idx);
        const weekStart = dateRange.start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const weekEnd = dateRange.end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

        return (
          <div key={idx} style={{
            border: '2px solid #e5e7eb',
            borderRadius: '8px',
            overflow: 'hidden',
            backgroundColor: '#ffffff'
          }}>
            {/* Week Header - Always Visible */}
            <div 
              onClick={() => setExpandedWeek(isExpanded ? -1 : idx)}
              style={{
                padding: '16px',
                backgroundColor: isExpanded ? '#dbeafe' : '#f3f4f6',
                borderBottom: isExpanded ? '2px solid #3b82f6' : 'none',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                transition: 'background-color 0.2s'
              }}
            >
              <div>
                <strong style={{ fontSize: '1.05em', color: '#1f2937' }}>Week {idx + 1}</strong>
                <span style={{ color: 'var(--muted)', marginLeft: '12px', fontSize: '0.9em' }}>({weekStart} - {weekEnd})</span>
                <p style={{ margin: '4px 0 0 0', color: '#3b82f6', fontWeight: '600', fontSize: '0.95em' }}>
                  {weekPlan.topic}
                </p>
              </div>
              <span style={{
                fontSize: '1.2em',
                color: '#3b82f6',
                transition: 'transform 0.2s',
                transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'
              }}>
                ▼
              </span>
            </div>

            {/* Week Details - Expandable */}
            {isExpanded && (
              <div style={{ padding: '16px', backgroundColor: '#ffffff', borderTop: '2px solid #e5e7eb' }}>
                <p style={{ color: 'var(--muted)', marginTop: 0 }}><strong>Topics:</strong> {weekPlan.subtopic}</p>
                
                <div style={{ marginTop: '16px' }}>
                  <strong style={{ color: '#1f2937', marginBottom: '8px', display: 'block' }}>📅 Daily Schedule:</strong>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '8px' }}>
                    {days.map((day, dayIdx) => (
                      <div key={dayIdx} style={{
                        padding: '12px',
                        backgroundColor: dayIdx < 5 ? '#f0f9ff' : '#d1fae5',
                        borderRadius: '6px',
                        borderLeft: dayIdx < 5 ? '4px solid #3b82f6' : '4px solid #10b981'
                      }}>
                        <div style={{ fontWeight: '600', color: dayIdx < 5 ? '#1e40af' : '#065f46', fontSize: '0.9em' }}>{day}</div>
                        <div style={{ fontSize: '0.85em', color: 'var(--muted)', marginTop: '4px' }}>
                          {weekPlan.days[dayIdx]}
                        </div>
                        <div style={{ fontSize: '0.8em', color: 'var(--muted)', marginTop: '4px' }}>
                          <strong>{dayIdx < 5 ? '6h' : '5h'} + 1h Test</strong>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#f9fafb', borderRadius: '6px', fontSize: '0.9em', color: 'var(--muted)' }}>
                  <strong style={{ color: '#1f2937' }}>📝 Testing:</strong> Daily quizzes (Mon-Fri) + Weekly comprehensive test (Sat-Sun)
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// Daily Timetable Component
function DailyTimetable() {
  const schedule = [
    { time: '6:00 - 8:00 AM', activity: '🛏️ Morning Routine', details: 'Wake up, freshen up, breakfast, get ready', color: '#e0f2fe', icon: '🌅' },
    { time: '8:00 - 10:00 AM', activity: '📐 Mathematics', details: 'AhaGuru Lessons - Concepts & Theory', color: '#dbeafe', icon: '✍️', subject: 'math', hours: 2 },
    { time: '10:00 - 10:15 AM', activity: '☕ Short Break', details: 'Stretch, hydrate, prepare for next session', color: '#dcfce7', icon: '💧' },
    { time: '10:15 - 11:45 AM', activity: '📐 Mathematics', details: 'Examples, Practice Problems', color: '#dbeafe', icon: '🔢', subject: 'math', hours: 1.5 },
    { time: '11:45 AM - 12:00 PM', activity: '☕ Break after Maths', details: 'Rest & refresh after completing mathematics', color: '#dcfce7', icon: '💧' },
    { time: '12:00 - 12:30 PM', activity: '⚡ Physics', details: 'AhaGuru Lessons - Concepts', color: '#fef3c7', icon: '⚛️', subject: 'physics', hours: 0.5 },
    { time: '12:30 - 1:00 PM', activity: '🍽️ Lunch', details: 'Meal time + Quick Rest', color: '#fecaca', icon: '🍴' },
    { time: '1:00 - 2:00 PM', activity: '⚡ Physics', details: 'Problems, Applications, Practice', color: '#fef3c7', icon: '🔬', subject: 'physics', hours: 1 },
    { time: '2:00 - 2:15 PM', activity: '☕ Short Break', details: 'Quick break, refresh', color: '#dcfce7', icon: '🚶' },
    { time: '2:15 - 4:30 PM', activity: '🧪 Chemistry', details: 'AhaGuru Lessons - Concepts, Reactions, Calculations, Deep Dive & Applications', color: '#f5e6ff', icon: '🧫', subject: 'chemistry', hours: 2.25 },
    { time: '4:30 PM+', activity: '🎯 Evening Time', details: 'Personal time, recreation, revision notes', color: '#fef08a', icon: '🌆' },
  ];

  const mathTotal = 3.5;
  const physicsTotal = 1.5;
  const chemistryTotal = 2.25;

  return (
    <div>
      <h1>📅 Daily Timetable</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        <div className="card" style={{ backgroundColor: '#dbeafe', borderLeft: '4px solid #3b82f6' }}>
          <div style={{ fontSize: '0.9em', color: '#064e3b' }}>Mathematics</div>
          <div style={{ fontSize: '2em', fontWeight: 'bold', color: '#3b82f6', marginTop: '4px' }}>{mathTotal} hrs</div>
          <div style={{ fontSize: '0.85em', color: 'var(--muted)', marginTop: '8px' }}>Ratio: 4 parts</div>
        </div>
        <div className="card" style={{ backgroundColor: '#fef3c7', borderLeft: '4px solid #f59e0b' }}>
          <div style={{ fontSize: '0.9em', color: '#064e3b' }}>Physics</div>
          <div style={{ fontSize: '2em', fontWeight: 'bold', color: '#f59e0b', marginTop: '4px' }}>1.5 hrs</div>
          <div style={{ fontSize: '0.85em', color: 'var(--muted)', marginTop: '8px' }}>Reduced for Chemistry focus</div>
        </div>
        <div className="card" style={{ backgroundColor: '#f5e6ff', borderLeft: '4px solid #a855f7' }}>
          <div style={{ fontSize: '0.9em', color: '#064e3b' }}>Chemistry</div>
          <div style={{ fontSize: '2em', fontWeight: 'bold', color: '#a855f7', marginTop: '4px' }}>{chemistryTotal} hrs</div>
          <div style={{ fontSize: '0.85em', color: 'var(--muted)', marginTop: '8px' }}>+1 hour extra (extended study)</div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '24px', padding: '20px', backgroundColor: '#f3f4f6' }}>
        <p><strong>⏰ Study Duration:</strong> 8 AM to 4:30 PM (8.5 hours with 30-min lunch + breaks)</p>
        <p style={{ marginTop: '8px', fontSize: '0.9em', color: 'var(--muted)' }}>Daily active study time: 7.25 hours (Math 3.5h + Physics 1.5h + Chemistry 2.25h) | Breaks: 45 mins</p>
      </div>

      <h2 style={{ marginTop: '32px', marginBottom: '20px' }}>📊 Hour-by-Hour Schedule</h2>
      <div style={{ display: 'grid', gap: '12px' }}>
        {schedule.map((slot, idx) => (
          <div 
            key={idx}
            style={{
              padding: '16px',
              backgroundColor: slot.color,
              borderRadius: '8px',
              borderLeft: slot.subject ? `4px solid ${slot.subject === 'math' ? '#3b82f6' : slot.subject === 'physics' ? '#f59e0b' : '#a855f7'}` : 'none',
              display: 'grid',
              gridTemplateColumns: '120px 1fr auto',
              gap: '16px',
              alignItems: 'center'
            }}
          >
            <div style={{ fontWeight: '600', fontSize: '0.95em', color: '#1f2937' }}>
              {slot.time}
            </div>
            <div>
              <div style={{ fontWeight: '600', fontSize: '1em', color: '#1f2937', marginBottom: '4px' }}>
                {slot.icon} {slot.activity}
              </div>
              <div style={{ fontSize: '0.9em', color: 'var(--muted)' }}>
                {slot.details}
              </div>
            </div>
            {slot.hours && (
              <div style={{ 
                padding: '8px 12px', 
                backgroundColor: 'rgba(255,255,255,0.7)', 
                borderRadius: '6px',
                fontWeight: '600',
                color: '#064e3b',
                fontSize: '0.95em',
                minWidth: '60px',
                textAlign: 'center'
              }}>
                {slot.hours}h
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ marginTop: '32px', padding: '16px', backgroundColor: '#f0fdf4', borderRadius: '8px', borderLeft: '4px solid #10b981' }}>
        <strong style={{ color: '#065f46' }}>💡 Tips for Success:</strong>
        <ul style={{ marginTop: '12px', color: 'var(--muted)', fontSize: '0.95em', lineHeight: '1.8' }}>
          <li>✓ Start morning routine by 6 AM to be fresh and ready by 8 AM</li>
          <li>✓ Take short breaks to stretch and hydrate - boosts focus</li>
          <li>✓ Mathematics early while mind is fresh (8-12 PM)</li>
          <li>✓ Physics after lunch when energy is moderate (1-3 PM)</li>
          <li>✓ Chemistry in final slot with quick problems/applications (3-4 PM)</li>
          <li>✓ Maintain consistency - same schedule daily for better retention</li>
        </ul>
      </div>
    </div>
  );
}

// SuperSet Table Component
function SuperSetTable({ jeeData, eapcetData, inter1Data, inter2Data, ahaGuruData, activeSubject }) {
  const [hoveredRowIdx, setHoveredRowIdx] = useState(null);

  const getTopicsForSubject = (data, subject) => {
    const subjectId = subject === 'physics' ? 'physics' : 
                      subject === 'chemistry' ? 'chemistry' : 
                      'mathematics';
    const item = data.find(d => d.id === subjectId || 
                                 d.id.includes(subjectId) ||
                                 (subjectId === 'mathematics' && d.id.includes('math')));
    return item?.topics || [];
  };

  const getAhaGuruTopics = (data) => {
    if (!data || data.length === 0) return [];
    const topics = [];
    data.forEach(lesson => {
      if (lesson.chapters) {
        lesson.chapters.forEach(chapter => {
          topics.push({ name: chapter.title, type: 'chapter' });
        });
      }
      if (lesson.title) {
        topics.push({ name: lesson.title, type: 'lesson' });
      }
    });
    return topics;
  };

  const jeeTopics = getTopicsForSubject(jeeData, activeSubject);
  const eapcetTopics = getTopicsForSubject(eapcetData, activeSubject);
  const inter1Topics = getTopicsForSubject(inter1Data, activeSubject);
  const inter2Topics = getTopicsForSubject(inter2Data, activeSubject);
  const ahaGuruTopics = activeSubject === 'mathematics' ? getAhaGuruTopics(ahaGuruData) : [];

  // Consolidate all unique topics from all 4 boards with their subtopics
  const allTopics = new Map();
  
  inter1Topics.forEach(t => {
    if (!allTopics.has(t.name)) {
      allTopics.set(t.name, { name: t.name, subtopics: t.subtopics, source: 'inter1' });
    }
  });
  
  inter2Topics.forEach(t => {
    if (!allTopics.has(t.name)) {
      allTopics.set(t.name, { name: t.name, subtopics: t.subtopics, source: 'inter2' });
    }
  });
  
  eapcetTopics.forEach(t => {
    if (!allTopics.has(t.name)) {
      allTopics.set(t.name, { name: t.name, subtopics: t.subtopics, source: 'eapcet' });
    }
  });
  
  jeeTopics.forEach(t => {
    if (!allTopics.has(t.name)) {
      allTopics.set(t.name, { name: t.name, subtopics: t.subtopics, source: 'jee' });
    }
  });

  const consolidatedTopics = Array.from(allTopics.values());

  const topicExists = (topicName, topicsArray) => {
    return topicsArray.some(t => {
      const tName = t.name ? t.name.toLowerCase() : '';
      const topName = topicName.toLowerCase();
      return tName.includes(topName) || topName.includes(tName);
    });
  };

  const getSubtopicsForTopic = (topicName) => {
    const topicData = allTopics.get(topicName);
    return topicData?.subtopics || '';
  };

  const colorMap = {
    physics: { bg: '#fef3c7', text: '#b45309' },
    chemistry: { bg: '#fee2e2', text: '#991b1b' },
    mathematics: { bg: '#f0f9ff', text: '#1e40af' }
  };

  const colors = colorMap[activeSubject] || { bg: '#f3f4f6', text: '#374151' };

  return (
    <div>
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        marginTop: '16px'
      }}>
        <thead>
          <tr style={{ backgroundColor: colors.bg, borderBottom: `3px solid ${colors.text}` }}>
            <th style={{
              padding: '12px',
              textAlign: 'left',
              fontWeight: '600',
              color: colors.text,
              borderRight: `1px solid ${colors.text}`,
              maxWidth: '250px'
            }}>Topic (Consolidated)</th>
            <th style={{
              padding: '12px',
              textAlign: 'center',
              fontWeight: '600',
              color: colors.text,
              width: '85px',
              borderRight: `1px solid ${colors.text}`,
              fontSize: '0.9em'
            }}>🚀 JEE</th>
            <th style={{
              padding: '12px',
              textAlign: 'center',
              fontWeight: '600',
              color: colors.text,
              width: '85px',
              borderRight: `1px solid ${colors.text}`,
              fontSize: '0.9em'
            }}>🎯 EAPCET</th>
            <th style={{
              padding: '12px',
              textAlign: 'center',
              fontWeight: '600',
              color: colors.text,
              width: '85px',
              borderRight: `1px solid ${colors.text}`,
              fontSize: '0.9em'
            }}>📚 1st Yr</th>
            <th style={{
              padding: '12px',
              textAlign: 'center',
              fontWeight: '600',
              color: colors.text,
              width: '85px',
              borderRight: activeSubject === 'mathematics' ? `1px solid ${colors.text}` : 'none',
              fontSize: '0.9em'
            }}>📚 2nd Yr</th>
            {activeSubject === 'mathematics' && (
              <th style={{
                padding: '12px',
                textAlign: 'center',
                fontWeight: '600',
                color: '#10b981',
                width: '85px',
                fontSize: '0.9em'
              }}>🎓 AG1</th>
            )}
          </tr>
        </thead>
        <tbody>
          {consolidatedTopics.map((topic, idx) => {
            const inJee = topicExists(topic.name, jeeTopics);
            const inEapcet = topicExists(topic.name, eapcetTopics);
            const inInter1 = topicExists(topic.name, inter1Topics);
            const inInter2 = topicExists(topic.name, inter2Topics);
            const inAG1 = activeSubject === 'mathematics' ? topicExists(topic.name, ahaGuruTopics) : false;
            const isHovered = hoveredRowIdx === idx;

            return (
              <tr key={idx} style={{
                backgroundColor: isHovered ? colors.bg : (idx % 2 === 0 ? '#ffffff' : '#f9fafb'),
                borderBottom: '1px solid #e5e7eb',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={() => setHoveredRowIdx(idx)}
              onMouseLeave={() => setHoveredRowIdx(null)}
              >
                <td style={{
                  padding: '12px',
                  borderRight: `1px solid #e5e7eb`,
                  fontWeight: '500',
                  color: colors.text,
                  fontSize: '0.9em',
                  position: 'relative',
                  maxWidth: '250px',
                  wordWrap: 'break-word'
                }}>
                  {topic.name}
                  {isHovered && (
                    <div style={{
                      position: 'absolute',
                      left: '12px',
                      top: '100%',
                      backgroundColor: 'white',
                      border: `2px solid ${colors.text}`,
                      borderRadius: '8px',
                      padding: '12px',
                      marginTop: '8px',
                      minWidth: '300px',
                      maxWidth: '400px',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                      zIndex: 1000,
                      fontSize: '0.85em',
                      color: 'var(--muted)',
                      lineHeight: '1.6'
                    }}>
                      <div style={{ fontWeight: '600', color: colors.text, marginBottom: '8px', borderBottom: `1px solid ${colors.bg}`, paddingBottom: '8px' }}>
                        📋 Subtopics:
                      </div>
                      <div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
                        {getSubtopicsForTopic(topic.name) || 'No subtopics available'}
                      </div>
                    </div>
                  )}
                </td>
                <td style={{
                  padding: '12px',
                  textAlign: 'center',
                  borderRight: `1px solid #e5e7eb`,
                  fontSize: '1.1em'
                }}>
                  <span style={{
                    display: 'inline-block',
                    padding: '4px 6px',
                    borderRadius: '4px',
                    backgroundColor: inJee ? '#dbeafe' : '#fee2e2',
                    color: inJee ? '#1e40af' : '#991b1b',
                    fontWeight: 'bold',
                    fontSize: '0.9em'
                  }}>
                    {inJee ? '✓' : '✗'}
                  </span>
                </td>
                <td style={{
                  padding: '12px',
                  textAlign: 'center',
                  borderRight: `1px solid #e5e7eb`,
                  fontSize: '1.1em'
                }}>
                  <span style={{
                    display: 'inline-block',
                    padding: '4px 6px',
                    borderRadius: '4px',
                    backgroundColor: inEapcet ? '#fef3c7' : '#fee2e2',
                    color: inEapcet ? '#b45309' : '#991b1b',
                    fontWeight: 'bold',
                    fontSize: '0.9em'
                  }}>
                    {inEapcet ? '✓' : '✗'}
                  </span>
                </td>
                <td style={{
                  padding: '12px',
                  textAlign: 'center',
                  borderRight: `1px solid #e5e7eb`,
                  fontSize: '1.1em'
                }}>
                  <span style={{
                    display: 'inline-block',
                    padding: '4px 6px',
                    borderRadius: '4px',
                    backgroundColor: inInter1 ? '#d1fae5' : '#fee2e2',
                    color: inInter1 ? '#065f46' : '#991b1b',
                    fontWeight: 'bold',
                    fontSize: '0.9em'
                  }}>
                    {inInter1 ? '✓' : '✗'}
                  </span>
                </td>
                <td style={{
                  padding: '12px',
                  textAlign: 'center',
                  borderRight: activeSubject === 'mathematics' ? `1px solid #e5e7eb` : 'none',
                  fontSize: '1.1em'
                }}>
                  <span style={{
                    display: 'inline-block',
                    padding: '4px 6px',
                    borderRadius: '4px',
                    backgroundColor: inInter2 ? '#d1fae5' : '#fee2e2',
                    color: inInter2 ? '#065f46' : '#991b1b',
                    fontWeight: 'bold',
                    fontSize: '0.9em'
                  }}>
                    {inInter2 ? '✓' : '✗'}
                  </span>
                </td>
                {activeSubject === 'mathematics' && (
                  <td style={{
                    padding: '12px',
                    textAlign: 'center',
                    fontSize: '1.1em'
                  }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '4px 6px',
                      borderRadius: '4px',
                      backgroundColor: inAG1 ? '#d1fae5' : '#fee2e2',
                      color: inAG1 ? '#065f46' : '#991b1b',
                      fontWeight: 'bold',
                      fontSize: '0.9em'
                    }}>
                      {inAG1 ? '✓' : '✗'}
                    </span>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// Syllabus Section Component with Sub-tabs
function SyllabusSection({ boardName, boardColor, boardBgColor, boardBorder, syllabus, activeSubject }) {
  const [activeSubtab, setActiveSubtab] = useState(0);
  
  const currentSubject = syllabus.find(s => {
    const subjName = s.id.includes('physics') ? 'physics' : 
                      s.id.includes('chemistry') ? 'chemistry' : 
                      s.id.includes('mathematics') || s.id.includes('math') ? 'mathematics' : null;
    return subjName === activeSubject;
  });

  if (!currentSubject) return null;

  // Group topics into logical subtabs
  const subtabs = currentSubject.topics.map((topic, idx) => ({
    id: idx,
    name: topic.name,
    subtopics: topic.subtopics
  }));

  const itemsPerTab = Math.ceil(subtabs.length / 3) || 1;
  const groupedTabs = [];
  for (let i = 0; i < subtabs.length; i += itemsPerTab) {
    groupedTabs.push(subtabs.slice(i, i + itemsPerTab));
  }

  const colorMap = {
    physics: { text: '#b45309', bg: '#fef3c7', icon: '⚡' },
    chemistry: { text: '#991b1b', bg: '#fee2e2', icon: '🧪' },
    mathematics: { text: '#1e40af', bg: '#f0f9ff', icon: '📐' }
  };

  const color = colorMap[activeSubject] || { text: boardColor, bg: boardBgColor, icon: '📌' };

  return (
    <div>
      <h2 style={{ color: boardColor, marginBottom: '16px' }}>{boardName}</h2>
      <div style={{ padding: '16px', backgroundColor: boardBgColor, borderRadius: 'var(--radius)', borderLeft: `4px solid ${boardBorder}`, marginBottom: '20px' }}>
        <p><strong>{currentSubject.title}</strong> - {subtabs.length} topics covered</p>
      </div>

      {/* Sub-tabs for grouping topics */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', borderBottom: '2px solid var(--border)', paddingBottom: '8px', flexWrap: 'wrap' }}>
        {groupedTabs.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActiveSubtab(idx)}
            style={{
              padding: '10px 18px',
              border: 'none',
              borderBottom: activeSubtab === idx ? `3px solid ${color.text}` : 'none',
              backgroundColor: 'transparent',
              color: activeSubtab === idx ? color.text : 'var(--muted)',
              cursor: 'pointer',
              fontSize: '0.95em',
              fontWeight: activeSubtab === idx ? '600' : '400',
              transition: 'all 0.3s'
            }}
          >
            Part {idx + 1} ({groupedTabs[idx].length} topics)
          </button>
        ))}
      </div>

      {/* Display topics for active subtab */}
      <div style={{ display: 'grid', gap: '12px' }}>
        {groupedTabs[activeSubtab]?.map((topic, idx) => (
          <div key={idx} style={{ padding: '16px', backgroundColor: color.bg, borderRadius: '8px', borderLeft: `4px solid ${color.text}` }}>
            <div style={{ fontWeight: '600', color: color.text, marginBottom: '8px', fontSize: '1.05em' }}>
              {color.icon} {topic.name}
            </div>
            <div style={{ fontSize: '0.95em', color: 'var(--muted)', lineHeight: '1.6' }}>
              {topic.subtopics}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [maths, setMaths] = useState([]);
  const [physics, setPhysics] = useState([]);
  const [chemistry, setChemistry] = useState([]);
  const [planner, setPlanner] = useState([]);
  const [yts, setYts] = useState([]);
  const [expandedLessons, setExpandedLessons] = useState({});
  const [filterDropdown, setFilterDropdown] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [ahaGuruSubject, setAhaGuruSubject] = useState('maths');
  const [activeSyllabusTab, setActiveSyllabusTab] = useState('inter1');
  const [inter1Syllabus, setInter1Syllabus] = useState([]);
  const [inter2Syllabus, setInter2Syllabus] = useState([]);
  const [eapcetSyllabus, setEapcetSyllabus] = useState([]);
  const [jeeSyllabus, setJeeSyllabus] = useState([]);
  const [syllabusBoardSubject, setSyllabusBoardSubject] = useState({ board: 'inter1', subject: 'physics' });
  const [jeeSupersetSubject, setJeeupersetSubject] = useState('mathematics');
  const [prepScheduleTab, setPrepScheduleTab] = useState('mathematics');
  const [expandedWeek, setExpandedWeek] = useState(0);
  const [prepTab, setPrepTab] = useState('schedule');

  useEffect(() => {
    fetch(process.env.PUBLIC_URL + '/data/aha-maths.json')
      .then(res => res.json())
      .then(setMaths);
    fetch(process.env.PUBLIC_URL + '/data/aha-physics.json')
      .then(res => res.json())
      .then(setPhysics);
    fetch(process.env.PUBLIC_URL + '/data/aha-chemistry.json')
      .then(res => res.json())
      .then(setChemistry);
    fetch(process.env.PUBLIC_URL + '/data/courseplanner.json')
      .then(res => res.json())
      .then(setPlanner);
    fetch(process.env.PUBLIC_URL + '/data/yts.json')
      .then(res => res.json())
      .then(setYts);
    fetch(process.env.PUBLIC_URL + '/data/inter1-syllabus.json')
      .then(res => res.json())
      .then(setInter1Syllabus);
    fetch(process.env.PUBLIC_URL + '/data/inter2-syllabus.json')
      .then(res => res.json())
      .then(setInter2Syllabus);
    fetch(process.env.PUBLIC_URL + '/data/eapcet-syllabus.json')
      .then(res => res.json())
      .then(setEapcetSyllabus);
    fetch(process.env.PUBLIC_URL + '/data/jee-syllabus.json')
      .then(res => res.json())
      .then(setJeeSyllabus);
  }, []);

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
    { id: 'guru', label: 'Aha Guru', icon: '🎓' },
    { id: 'syllabus', label: 'Syllabus', icon: '📖' },
    { id: 'jee-superset', label: 'JEE-SuperSet', icon: '⭐' },
    { id: 'preparation', label: 'Preparation', icon: '📋' },
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
              <h2>⚡ Physics Lessons</h2>
              <div className="stat-box">
                <div className="stat-number">{physics.length}</div>
                <div className="stat-label">Total Lessons Available</div>
              </div>
              <ul style={{ marginTop: '20px' }}>
                {physics.slice(0, 5).map(lesson => (
                  <li key={lesson.id} style={{ paddingLeft: '8px' }}>
                    <strong>{lesson.title}</strong>
                    <div style={{ fontSize: '0.9em', color: 'var(--muted)', marginTop: '4px' }}>
                      {lesson.chapters.length} chapters
                    </div>
                  </li>
                ))}
              </ul>
              {physics.length > 5 && (
                <div style={{ color: '#f59e0b', marginTop: '16px', fontSize: '0.95em', fontWeight: 'bold' }}>
                  +{physics.length - 5} more lessons →
                </div>
              )}
            </div>

            <div className="card">
              <h2>🧪 Chemistry Lessons</h2>
              <div className="stat-box">
                <div className="stat-number">{chemistry.length}</div>
                <div className="stat-label">Total Lessons Available</div>
              </div>
              <ul style={{ marginTop: '20px' }}>
                {chemistry.slice(0, 5).map(lesson => (
                  <li key={lesson.id} style={{ paddingLeft: '8px' }}>
                    <strong>{lesson.title}</strong>
                    <div style={{ fontSize: '0.9em', color: 'var(--muted)', marginTop: '4px' }}>
                      {lesson.chapters.length} chapters
                    </div>
                  </li>
                ))}
              </ul>
              {chemistry.length > 5 && (
                <div style={{ color: '#ef4444', marginTop: '16px', fontSize: '0.95em', fontWeight: 'bold' }}>
                  +{chemistry.length - 5} more lessons →
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

        {/* Aha Guru Page */}
        <div className={`page ${activePage === 'guru' ? 'active' : ''}`}>
          <h1>🎓 Aha Guru</h1>
          
          {/* Subject Tabs */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', borderBottom: '2px solid var(--border)', paddingBottom: '8px', flexWrap: 'wrap' }}>
            {[
              { id: 'maths', label: '📐 Mathematics', data: maths },
              { id: 'physics', label: '⚡ Physics', data: physics },
              { id: 'chemistry', label: '🧪 Chemistry', data: chemistry }
            ].map(subj => (
              <button
                key={subj.id}
                onClick={() => setAhaGuruSubject(subj.id)}
                style={{
                  padding: '12px 20px',
                  border: 'none',
                  borderBottom: ahaGuruSubject === subj.id ? '3px solid var(--accent)' : 'none',
                  backgroundColor: 'transparent',
                  color: ahaGuruSubject === subj.id ? 'var(--accent)' : 'var(--muted)',
                  cursor: 'pointer',
                  fontSize: '1em',
                  fontWeight: ahaGuruSubject === subj.id ? '600' : '400',
                  transition: 'all 0.3s'
                }}
              >
                {subj.label}
              </button>
            ))}
          </div>

          {/* Content */}
          {ahaGuruSubject === 'maths' && (
            <>
              <div style={{ marginBottom: '20px', padding: '16px', backgroundColor: '#dbeafe', borderRadius: 'var(--radius)', borderLeft: '4px solid var(--accent)', color: '#0c2d6b' }}>
                <strong>{maths.length} Comprehensive Lessons</strong> with {maths.reduce((sum, l) => sum + l.chapters.length, 0)} chapters covering all topics
              </div>
              {maths.map((lesson, idx) => (
                <div key={lesson.id} className="expandable-section">
                  <div
                    className={`expandable-header ${expandedLessons[lesson.id] ? 'expanded' : ''}`}
                    onClick={() => toggleExpanded(lesson.id)}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '1.2em' }}>L{idx + 1}</span>
                      <span>{lesson.title}</span>
                    </span>
                    <span className="expandable-toggle">▼</span>
                  </div>
                  <div className={`expandable-content ${expandedLessons[lesson.id] ? 'expanded' : ''}`}>
                    <ul className="chapter-list">
                      {lesson.chapters.map((chap, chapIdx) => (
                        <li key={chap.id} className="chapter-item">
                          <div className="chapter-name">
                            <span style={{ color: 'var(--muted)', marginRight: '12px', fontSize: '0.9em' }}>
                              C{chapIdx + 1}
                            </span>
                            {chap.title}
                          </div>
                          <div className="chapter-meta">
                            {chap.slides && `${chap.slides} slides`}
                            {chap.questions && `${chap.questions} Qs`}
                            {!chap.slides && !chap.questions && '∀'}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </>
          )}

          {ahaGuruSubject === 'physics' && (
            <>
              <div style={{ marginBottom: '20px', padding: '16px', backgroundColor: '#fef3c7', borderRadius: 'var(--radius)', borderLeft: '4px solid #f59e0b', color: '#92400e' }}>
                <strong>{physics.length} Physics Lessons</strong> with {physics.reduce((sum, l) => sum + l.chapters.length, 0)} chapters
              </div>
              {physics.map((lesson, idx) => (
                <div key={lesson.id} className="expandable-section">
                  <div
                    className={`expandable-header ${expandedLessons[lesson.id] ? 'expanded' : ''}`}
                    onClick={() => toggleExpanded(lesson.id)}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '1.2em' }}>L{idx + 1}</span>
                      <span>{lesson.title}</span>
                    </span>
                    <span className="expandable-toggle">▼</span>
                  </div>
                  <div className={`expandable-content ${expandedLessons[lesson.id] ? 'expanded' : ''}`}>
                    <ul className="chapter-list">
                      {lesson.chapters.map((chap, chapIdx) => (
                        <li key={chap.id} className="chapter-item">
                          <div className="chapter-name">
                            <span style={{ color: 'var(--muted)', marginRight: '12px', fontSize: '0.9em' }}>
                              C{chapIdx + 1}
                            </span>
                            {chap.title}
                          </div>
                          <div className="chapter-meta">
                            {chap.slides && `${chap.slides} slides`}
                            {chap.questions && `${chap.questions} Qs`}
                            {!chap.slides && !chap.questions && '∀'}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </>
          )}

          {ahaGuruSubject === 'chemistry' && (
            <>
              <div style={{ marginBottom: '20px', padding: '16px', backgroundColor: '#fecdd3', borderRadius: 'var(--radius)', borderLeft: '4px solid #ef4444', color: '#7f1d1d' }}>
                <strong>{chemistry.length} Chemistry Lessons</strong> with {chemistry.reduce((sum, l) => sum + l.chapters.length, 0)} chapters
              </div>
              {chemistry.map((lesson, idx) => (
                <div key={lesson.id} className="expandable-section">
                  <div
                    className={`expandable-header ${expandedLessons[lesson.id] ? 'expanded' : ''}`}
                    onClick={() => toggleExpanded(lesson.id)}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '1.2em' }}>L{idx + 1}</span>
                      <span>{lesson.title}</span>
                    </span>
                    <span className="expandable-toggle">▼</span>
                  </div>
                  <div className={`expandable-content ${expandedLessons[lesson.id] ? 'expanded' : ''}`}>
                    <ul className="chapter-list">
                      {lesson.chapters.map((chap, chapIdx) => (
                        <li key={chap.id} className="chapter-item">
                          <div className="chapter-name">
                            <span style={{ color: 'var(--muted)', marginRight: '12px', fontSize: '0.9em' }}>
                              C{chapIdx + 1}
                            </span>
                            {chap.title}
                          </div>
                          <div className="chapter-meta">
                            {chap.slides && `${chap.slides} slides`}
                            {chap.questions && `${chap.questions} Qs`}
                            {!chap.slides && !chap.questions && '∀'}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </>
          )}
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

        {/* Preparation Schedule Page */}
        <div className={`page ${activePage === 'preparation' ? 'active' : ''}`}>
          <h1>📋 Preparation</h1>
          
          {/* Prep Tabs - Schedule vs Timetable */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', borderBottom: '2px solid var(--border)', paddingBottom: '8px', flexWrap: 'wrap' }}>
            {[
              { id: 'schedule', label: '📊 Study Schedule', color: '#3b82f6' },
              { id: 'timetable', label: '⏰ Daily Timetable', color: '#10b981' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setPrepTab(tab.id)}
                style={{
                  padding: '10px 18px',
                  border: 'none',
                  borderBottom: prepTab === tab.id ? `3px solid ${tab.color}` : 'none',
                  backgroundColor: 'transparent',
                  color: prepTab === tab.id ? tab.color : 'var(--muted)',
                  cursor: 'pointer',
                  fontSize: '0.95em',
                  fontWeight: prepTab === tab.id ? '600' : '400',
                  transition: 'all 0.3s'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Schedule Tab */}
          {prepTab === 'schedule' && (
            <>
              {/* Subject Tabs */}
              <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', borderBottom: '2px solid var(--border)', paddingBottom: '8px', flexWrap: 'wrap' }}>
                {[
                  { id: 'mathematics', label: '📐 Mathematics', color: '#3b82f6' }
                ].map(subject => (
                  <button
                    key={subject.id}
                    onClick={() => setPrepScheduleTab(subject.id)}
                    style={{
                      padding: '10px 18px',
                      border: 'none',
                      borderBottom: prepScheduleTab === subject.id ? `3px solid ${subject.color}` : 'none',
                      backgroundColor: 'transparent',
                      color: prepScheduleTab === subject.id ? subject.color : 'var(--muted)',
                      cursor: 'pointer',
                      fontSize: '0.95em',
                      fontWeight: prepScheduleTab === subject.id ? '600' : '400',
                      transition: 'all 0.3s'
                    }}
                  >
                    {subject.label} (Aha Guru 1st Year)
                  </button>
                ))}
              </div>

              <div className="card">
                <div style={{ marginBottom: '20px', padding: '16px', backgroundColor: '#f3f4f6', borderRadius: 'var(--radius)' }}>
                  <p><strong>Target: Complete by October 31, 2026</strong> | March 30 (Monday) to October 31 = 31 weeks</p>
                  <p style={{ fontSize: '0.9em', color: 'var(--muted)', marginTop: '8px' }}>Daily Study: 6 hours | Daily Test: 1 hour | Weekend Review: 5 hours + 1 hour test</p>
                </div>

                {/* All Weeks on Single Page */}
                <AllWeeksSchedule subject={prepScheduleTab} expandedWeek={expandedWeek} setExpandedWeek={setExpandedWeek} />
              </div>
            </>
          )}

          {/* Timetable Tab */}
          {prepTab === 'timetable' && (
            <DailyTimetable />
          )}
        </div>

        {/* JEE-SuperSet Page */}
        <div className={`page ${activePage === 'jee-superset' ? 'active' : ''}`}>
          <h1>⭐ JEE-SuperSet: Complete Topic Consolidation</h1>
          
          {/* Subject Tabs */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', borderBottom: '2px solid var(--border)', paddingBottom: '8px', flexWrap: 'wrap' }}>
            {[
              { id: 'mathematics', label: '📐 Mathematics', color: '#3b82f6' },
              { id: 'physics', label: '⚡ Physics', color: '#f59e0b' },
              { id: 'chemistry', label: '🧪 Chemistry', color: '#ef4444' }
            ].map(subject => (
              <button
                key={subject.id}
                onClick={() => setJeeupersetSubject(subject.id)}
                style={{
                  padding: '10px 18px',
                  border: 'none',
                  borderBottom: jeeSupersetSubject === subject.id ? `3px solid ${subject.color}` : 'none',
                  backgroundColor: 'transparent',
                  color: jeeSupersetSubject === subject.id ? subject.color : 'var(--muted)',
                  cursor: 'pointer',
                  fontSize: '0.95em',
                  fontWeight: jeeSupersetSubject === subject.id ? '600' : '400',
                  transition: 'all 0.3s'
                }}
              >
                {subject.label}
              </button>
            ))}
          </div>

          {/* SuperSet Table */}
          <div className="card">
            <div style={{ marginBottom: '20px', padding: '16px', backgroundColor: '#f3f4f6', borderRadius: 'var(--radius)' }}>
              <p><strong>Consolidated topics from all 4 boards</strong> | Shows which topics appear in JEE, EAPCET, Inter 1st Year, and Inter 2nd Year</p>
              <p style={{ fontSize: '0.9em', color: 'var(--muted)', marginTop: '8px' }}>✓ = Topic present | ✗ = Topic not covered | AG1 = Coverage in Aha Guru 1st Year (Mathematics only)</p>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <SuperSetTable 
                jeeData={jeeSyllabus}
                eapcetData={eapcetSyllabus}
                inter1Data={inter1Syllabus}
                inter2Data={inter2Syllabus}
                ahaGuruData={jeeSupersetSubject === 'physics' ? physics : jeeSupersetSubject === 'chemistry' ? chemistry : maths}
                activeSubject={jeeSupersetSubject}
              />
            </div>
          </div>
        </div>

        {/* Syllabus Page */}
        <div className={`page ${activePage === 'syllabus' ? 'active' : ''}`}>
          <h1>📖 Syllabus</h1>
          
          {/* Board Tabs */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', borderBottom: '2px solid var(--border)', paddingBottom: '8px', flexWrap: 'wrap' }}>
            {[
              { id: 'inter1', label: '📚 Inter 1st Year TG Board', color: '#3b82f6' },
              { id: 'inter2', label: '📚 Inter 2nd Year TG Board', color: '#8b5cf6' },
              { id: 'eapcet', label: '🎯 Telangana EAPCET', color: '#f59e0b' },
              { id: 'jee', label: '🚀 IIT JEE', color: '#ef4444' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveSyllabusTab(tab.id)}
                style={{
                  padding: '12px 20px',
                  border: 'none',
                  borderBottom: activeSyllabusTab === tab.id ? `3px solid ${tab.color}` : 'none',
                  backgroundColor: 'transparent',
                  color: activeSyllabusTab === tab.id ? tab.color : 'var(--muted)',
                  cursor: 'pointer',
                  fontSize: '1em',
                  fontWeight: activeSyllabusTab === tab.id ? '600' : '400',
                  transition: 'all 0.3s'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Subject Tabs */}
          {activeSyllabusTab && (
            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', borderBottom: '2px solid var(--border)', paddingBottom: '8px', flexWrap: 'wrap' }}>
              {[
                { id: 'physics', label: '⚡ Physics', color: '#f59e0b' },
                { id: 'chemistry', label: '🧪 Chemistry', color: '#ef4444' },
                { id: 'mathematics', label: '📐 Mathematics', color: '#3b82f6' }
              ].map(subject => (
                <button
                  key={subject.id}
                  onClick={() => setSyllabusBoardSubject({ board: activeSyllabusTab, subject: subject.id })}
                  style={{
                    padding: '10px 18px',
                    border: 'none',
                    borderBottom: syllabusBoardSubject.subject === subject.id && syllabusBoardSubject.board === activeSyllabusTab ? `3px solid ${subject.color}` : 'none',
                    backgroundColor: 'transparent',
                    color: syllabusBoardSubject.subject === subject.id && syllabusBoardSubject.board === activeSyllabusTab ? subject.color : 'var(--muted)',
                    cursor: 'pointer',
                    fontSize: '0.95em',
                    fontWeight: syllabusBoardSubject.subject === subject.id && syllabusBoardSubject.board === activeSyllabusTab ? '600' : '400',
                    transition: 'all 0.3s'
                  }}
                >
                  {subject.label}
                </button>
              ))}
            </div>
          )}

          {/* Syllabus Content with Sub-tabs */}
          <div className="card">
            {activeSyllabusTab === 'inter1' && inter1Syllabus.length > 0 && (
              <SyllabusSection 
                boardName="Inter 1st Year Telangana Board"
                boardColor="#3b82f6"
                boardBgColor="#eff6ff"
                boardBorder="#3b82f6"
                syllabus={inter1Syllabus}
                activeSubject={syllabusBoardSubject.subject}
              />
            )}

            {activeSyllabusTab === 'inter2' && inter2Syllabus.length > 0 && (
              <SyllabusSection 
                boardName="Inter 2nd Year Telangana Board"
                boardColor="#8b5cf6"
                boardBgColor="#faf5ff"
                boardBorder="#8b5cf6"
                syllabus={inter2Syllabus}
                activeSubject={syllabusBoardSubject.subject}
              />
            )}

            {activeSyllabusTab === 'eapcet' && eapcetSyllabus.length > 0 && (
              <SyllabusSection 
                boardName="Telangana EAPCET (Engineering, Agriculture & Medical Entrance Test)"
                boardColor="#f59e0b"
                boardBgColor="#fffbeb"
                boardBorder="#f59e0b"
                syllabus={eapcetSyllabus}
                activeSubject={syllabusBoardSubject.subject}
              />
            )}

            {activeSyllabusTab === 'jee' && jeeSyllabus.length > 0 && (
              <SyllabusSection 
                boardName="IIT JEE (Joint Entrance Examination)"
                boardColor="#ef4444"
                boardBgColor="#fef2f2"
                boardBorder="#ef4444"
                syllabus={jeeSyllabus}
                activeSubject={syllabusBoardSubject.subject}
              />
            )}

            {((activeSyllabusTab === 'inter1' && inter1Syllabus.length === 0) ||
              (activeSyllabusTab === 'inter2' && inter2Syllabus.length === 0) ||
              (activeSyllabusTab === 'eapcet' && eapcetSyllabus.length === 0) ||
              (activeSyllabusTab === 'jee' && jeeSyllabus.length === 0)) && (
              <div style={{ padding: '24px', textAlign: 'center', color: 'var(--muted)' }}>
                <p>Loading syllabus data...</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
