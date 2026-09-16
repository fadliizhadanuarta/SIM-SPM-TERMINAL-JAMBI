const fs = require('fs');
let lines = fs.readFileSync('src/app/page.tsx', 'utf8').split('\n');
const swc = require('@swc/core');

const headerEnd = 1725; // 0-indexed line 1725 = </header>
const footerStart = 3497; // 0-indexed line 3497 = <footer

function testUpTo(endIdx) {
  let testLines = [
    ...lines.slice(0, headerEnd + 1),
    ...lines.slice(headerEnd + 1, endIdx),
    '      {null}',
    ...lines.slice(footerStart)
  ];
  try {
    swc.parseSync(testLines.join('\n'), {syntax:'typescript',tsx:true});
    return true;
  } catch(e) {
    const m = e.message.match(/,-\[(\d+):/);
    return 'FAIL@' + (m ? m[1] : '?');
  }
}

console.log('Up to 1726 (blank):', testUpTo(1726));
console.log('Up to 1727 (comment):', testUpTo(1727));
console.log('Up to 1728 (sub-header div):', testUpTo(1728));
console.log('Up to 1729 (inner div):', testUpTo(1729));
