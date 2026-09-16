const fs = require('fs');
const lines = fs.readFileSync('src/app/page.tsx.bak', 'utf8').split('\n');

let balance = 0;
for (let i = 0; i < lines.length; i++) {
  const openDivs = (lines[i].match(/<div[\s>]/g) || []).length;
  const closeDivs = (lines[i].match(/<\/div>/g) || []).length;
  const diff = openDivs - closeDivs;
  if (diff !== 0) {
    balance += diff;
    if (Math.abs(balance) > 2 || diff !== 0) {
      console.log(`Line ${i+1}: open=${openDivs} close=${closeDivs} diff=${diff} balance=${balance}`);
    }
  }
}
console.log(`\nFinal balance: ${balance}`);
