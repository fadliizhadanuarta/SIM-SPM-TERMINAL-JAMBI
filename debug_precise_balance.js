const fs = require('fs');
const lines = fs.readFileSync('src/app/page.tsx.bak', 'utf8').split('\n');

let balance = 1; // starting after sub-header
for (let i = 1766; i <= 2349; i++) {
  const openDivs = (lines[i].match(/<div[\s>]/g) || []).length;
  const closeDivs = (lines[i].match(/<\/div>/g) || []).length;
  const prev = balance;
  balance += openDivs - closeDivs;
  if (balance !== prev) {
    console.log(`L${i+1} bal=${balance} (was ${prev}): ${lines[i].trim().substring(0, 120)}`);
  }
}
console.log('\nFinal:', balance);