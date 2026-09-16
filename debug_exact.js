const fs = require('fs');
const lines = fs.readFileSync('src/app/page.tsx.bak', 'utf8').split('\n');

let balance = 1;
for (let i = 1768; i <= 2338; i++) {
  const openDivs = (lines[i].match(/<div[\s>]/g) || []).length;
  const closeDivs = (lines[i].match(/<\/div>/g) || []).length;
  const prev = balance;
  balance += openDivs - closeDivs;
  if (balance !== prev) {
    console.log(`L${i+1} bal=${balance} (was ${prev}): ${lines[i].trim().substring(0, 100)}`);
  }
}
console.log('Balance at admin section:', balance);