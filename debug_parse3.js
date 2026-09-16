const fs = require('fs');
const lines = fs.readFileSync('src/app/page.tsx', 'utf8').split('\n');
const swc = require('@swc/core');

function tryJSX(endIdx) {
  // Take all lines up to endIdx, add closing JSX + function close
  const testCode = lines.slice(0, endIdx).join('\n') + '\n    </div>\n  )\n}\nexport default SIMSPMApp\n';
  try {
    swc.parseSync(testCode, {syntax:'typescript',tsx:true});
    return true;
  } catch(e) {
    const m = e.message.match(/,-\[(\d+):/);
    return 'FAIL@L' + (m ? m[1] : '?');
  }
}

// First find a known good point
console.log('1700 lines:', tryJSX(1700));
console.log('2000 lines:', tryJSX(2000));
console.log('2500 lines:', tryJSX(2500));
console.log('3000 lines:', tryJSX(3000));
console.log('3500 lines:', tryJSX(3500));
console.log('4000 lines:', tryJSX(4000));
console.log('4080 lines:', tryJSX(4080));

// Binary search between 1700 and 4080
let lo = 1700, hi = 4080;
while (lo < hi) {
  let mid = Math.floor((lo + hi) / 2);
  let result = tryJSX(mid);
  console.log(mid, ':', result);
  if (result === true) {
    lo = mid + 1;
  } else {
    hi = mid;
  }
}
console.log('\nFirst failing line (0-indexed):', lo);
console.log('Original line number:', lo + 1);
for (let i = Math.max(0, lo-3); i <= Math.min(lines.length-1, lo+3); i++) {
  console.log(i+1, ':', lines[i].substring(0, 150));
}
