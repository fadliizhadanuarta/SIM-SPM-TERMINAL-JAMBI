const fs = require('fs');
const lines = fs.readFileSync('src/app/page.tsx.bak', 'utf8').split('\n');

let balance = 0;
for (let i = 2350; i <= 2725; i++) {
  const openDivs = (lines[i].match(/<div[\s>]/g) || []).length;
  const closeDivs = (lines[i].match(/<\/div>/g) || []).length;
  balance += openDivs - closeDivs;
}
console.log('Overview tab net change:', balance);