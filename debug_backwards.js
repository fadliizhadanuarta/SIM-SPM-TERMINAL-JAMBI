const fs = require('fs');
let lines = fs.readFileSync('src/app/page.tsx', 'utf8').split('\n');
const swc = require('@swc/core');

// Strategy: remove lines from the END and see when it starts parsing
// The file should have matching braces/parens/brackets/tags
// If removing some lines from the end makes it parse, those lines had unmatched opens

function testFirstN(n) {
  // Add closing tokens to make it parseable
  let testCode = lines.slice(0, n).join('\n') + '\n  )\n}\n';
  try {
    swc.parseSync(testCode, {syntax:'typescript',tsx:true});
    return true;
  } catch(e) {
    return false;
  }
}

// Binary search from the end
let lo = 1000, hi = lines.length;
while (lo < hi) {
  let mid = Math.floor((lo + hi) / 2);
  if (testFirstN(mid)) {
    lo = mid + 1;
  } else {
    hi = mid;
  }
}
console.log('Last line that still parses when taken alone:', lo);
console.log('First line that breaks:', lo + 1);
for (let i = Math.max(0, lo-3); i <= Math.min(lines.length-1, lo+3); i++) {
  console.log((i+1) + ':', lines[i].substring(0, 150));
}
