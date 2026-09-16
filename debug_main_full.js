const fs = require('fs');
const lines = fs.readFileSync('src/app/page.tsx.bak', 'utf8').split('\n');

let balance = 1;
for (let i = 1766; i <= 3494; i++) {
  const openDivs = (lines[i].match(/<div[\s>]/g) || []).length;
  const closeDivs = (lines[i].match(/<\/div>/g) || []).length;
  balance += openDivs - closeDivs;
}
console.log('Balance after main section:', balance);