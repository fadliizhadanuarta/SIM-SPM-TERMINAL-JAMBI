const fs = require('fs');
const lines = fs.readFileSync('src/app/page.tsx.bak', 'utf8').split('\n');

let balance = 0;
for (let i = 1770; i <= 2333; i++) {
  const openDivs = (lines[i].match(/<div[\s>]/g) || []).length;
  const closeDivs = (lines[i].match(/<\/div>/g) || []).length;
  balance += openDivs - closeDivs;
}
console.log('Petugas wrapper net change:', balance);
