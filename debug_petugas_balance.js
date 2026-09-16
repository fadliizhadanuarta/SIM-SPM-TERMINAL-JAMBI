const fs = require('fs');
const lines = fs.readFileSync('src/app/page.tsx.bak', 'utf8').split('\n');

let balance = 1;
let started = false;
for (let i = 1768; i <= 2334; i++) {
  if (!started && lines[i].includes('PETUGAS DASHBOARD')) started = true;
  if (!started) continue;
  const openDivs = (lines[i].match(/<div[\s>]/g) || []).length;
  const closeDivs = (lines[i].match(/<\/div>/g) || []).length;
  const prev = balance;
  balance += openDivs - closeDivs;
  if (balance !== prev) {
    console.log(`L${i+1} bal=${balance} (was ${prev}): ${lines[i].trim().substring(0, 100)}`);
  }
}
console.log('\nPetugas section net change:', balance - 1);