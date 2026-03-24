import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [maths, setMaths] = useState([]);
  const [planner, setPlanner] = useState([]);

  useEffect(() => {
    fetch(process.env.PUBLIC_URL + '/data/aha-maths.json')
      .then(res => res.json())
      .then(setMaths);
    fetch(process.env.PUBLIC_URL + '/data/courseplanner.json')
      .then(res => res.json())
      .then(setPlanner);
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>IIT Course Dashboard</h1>
      </header>
      <main style={{padding: '2rem'}}>
        <section>
          <h2>Math Lessons</h2>
          {maths.map(lesson => (
            <div key={lesson.id} style={{marginBottom: '1.5rem', border: '1px solid #eee', borderRadius: 8, padding: '1rem'}}>
              <h3>{lesson.title}</h3>
              <ul>
                {lesson.chapters.map(chap => (
                  <li key={chap.id}>{chap.title} {chap.slides ? `(Slides: ${chap.slides})` : chap.questions ? `(Questions: ${chap.questions})` : ''}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>
        <section>
          <h2>Course Planner</h2>
          <div style={{overflowX: 'auto'}}>
            <table style={{borderCollapse: 'collapse', width: '100%'}}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Physics</th>
                  <th>Organic Chem</th>
                  <th>Physical Chem</th>
                  <th>Math</th>
                </tr>
              </thead>
              <tbody>
                {planner.map((row, i) => (
                  <tr key={i}>
                    <td>{row.date}</td>
                    <td>{row.physics || ''}</td>
                    <td>{row.organicChem || ''}</td>
                    <td>{row.physicalChem || ''}</td>
                    <td>{row.math || ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
