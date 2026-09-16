const fs = require('fs');
const lines = fs.readFileSync('src/app/page.tsx.bak', 'utf8').split('\n');

let balance = 3; // balance at </main>
for (let i = 3494; i < lines.length; i++) {
  const openDivs = (lines[i].match(/<div[\s>]/g) || []).length;
  const closeDivs = (lines[i].match(/<\/div>/g) || []).length;
  balance += openDivs - closeDivs;
  if (openDivs > 0 || closeDivs > 0) {
    console.log(`L${i+1} (+${openDivs} -${closeDivs}) bal=${balance}: ${lines[i].trim().substring(0, 100)}`);
  }
}
console.log('Final balance:', balance);
