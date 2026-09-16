const fs = require('fs');
let lines = fs.readFileSync('src/app/page.tsx', 'utf8').split('\n');
const swc = require('@swc/core');

const headerEnd = 1725; // line 1726 (1-indexed), 0-indexed 1725
const footerStart = 3497; // line 3498 (1-indexed), 0-indexed 3497

function testWithBody(endLine) {
  // Take: all code up to headerEnd, then lines from headerEnd+1 to endLine, then footer
  let testLines = [
    ...lines.slice(0, headerEnd + 1),
    ...lines.slice(headerEnd + 1, endLine),
    '      {null}',
    ...lines.slice(footerStart)
  ];
  try {
    swc.parseSync(testLines.join('\n'), {syntax:'typescript',tsx:true});
    return true;
  } catch(e) {
    return false;
  }
}

// Binary search
let lo = headerEnd + 1, hi = footerStart;
while (lo < hi) {
  let mid = Math.floor((lo + hi) / 2);
  if (testWithBody(mid)) {
    lo = mid + 1;
  } else {
    hi = mid;
  }
}

console.log('First failing line (0-indexed):', lo, '=> original line', lo + 1);
for (let i = Math.max(headerEnd, lo - 5); i <= Math.min(footerStart, lo + 5); i++) {
  console.log((i+1) + ':', lines[i].substring(0, 150));
}