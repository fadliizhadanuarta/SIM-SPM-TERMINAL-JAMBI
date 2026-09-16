const fs = require('fs');
const lines = fs.readFileSync('src/app/page.tsx.bak', 'utf8').split('\n');

let balance = 1; // starting balance (outer div from 1693)
for (let i = 1766; i <= 3494; i++) {
  const openDivs = (lines[i].match(/<div[\s>]/g) || []).length;
  const closeDivs = (lines[i].match(/<\/div>/g) || []).length;
  balance += openDivs - closeDivs;
  // Show at TabsContent boundaries
  if (lines[i].includes('TabsContent') || lines[i].includes('</TabsContent>')) {
    console.log(`L${i+1} bal=${balance}: ${lines[i].trim().substring(0, 80)}`);
  }
}
console.log('Balance at </main>:', balance);
