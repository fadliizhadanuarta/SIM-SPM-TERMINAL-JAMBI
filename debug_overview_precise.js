const fs = require('fs');
const lines = fs.readFileSync('src/app/page.tsx.bak', 'utf8').split('\n');

let balance = 0;
let minBalance = 0;
let minLine = -1;
for (let i = 2350; i <= 2725; i++) {
  const openDivs = (lines[i].match(/<div[\s>]/g) || []).length;
  const closeDivs = (lines[i].match(/<\/div>/g) || []).length;
  balance += openDivs - closeDivs;
  if (balance < minBalance) { minBalance = balance; minLine = i + 1; }
}
console.log('Overview final balance:', balance);
console.log('Min balance:', minBalance, 'at line', minLine);
