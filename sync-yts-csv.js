const fs = require('fs');

// Read CSV and convert to JSON
const lines = fs.readFileSync('data/yts.csv', 'utf8').trim().split('\n');
const headers = lines[0].split(',').map(h => h.trim());

const data = [];
for (let i = 1; i < lines.length; i++) {
  const values = lines[i].split(',').map(v => v.trim());
  const row = {};
  
  headers.forEach((header, idx) => {
    let value = values[idx] || '';
    
    // Map CSV columns to JSON keys
    if (header === 'S.No') row.sno = parseInt(value) || i;
    else if (header === 'Song') row.song = value;
    else if (header === 'Recoreded') row.recorded = value.toLowerCase() === 'yes' ? 'yes' : '';
    else if (header === 'Insta') row.insta = value;
    else if (header === 'YouTube') row.youtube = value;
  });
  
  if (row.song) data.push(row);
}

// Write to JSON
fs.writeFileSync('public/data/yts.json', JSON.stringify(data, null, 2));
console.log(`✅ Synced YTS data from CSV`);
console.log(`📊 Total Songs: ${data.length}`);
