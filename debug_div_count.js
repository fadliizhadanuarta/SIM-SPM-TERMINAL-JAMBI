const fs = require('fs');
const code = fs.readFileSync('src/app/page.tsx.bak', 'utf8');
const lines = code.split('\n');

// Find the JSX return statement start
let jsxStart = -1;
for (let i = 1690; i < 1700; i++) {
  if (lines[i].includes('return (')) {
    jsxStart = i;
    break;
  }
}
console.log('JSX starts at line', jsxStart + 1);

// State machine to track JSX context
let inStr = null; // null, '"', "'"
let inTemplate = 0;
let inJsxExpr = 0; // depth of {} in JSX
let inComment = 0; // 0, 1=line, 2=block
let divDepth = 0;
let maxDivDepth = 0;
let divStack = [];

function isJsxContext() {
  return jsxStart >= 0 && !inStr && inTemplate === 0 && inJsxExpr === 0 && inComment === 0;
}

for (let li = 0; li < lines.length; li++) {
  const line = lines[li];
  for (let ci = 0; ci < line.length; ci++) {
    const c = line[ci];
    const nc = line[ci+1];
    const pc = ci > 0 ? line[ci-1] : '';
    
    // Comment handling
    if (inComment === 2) {
      if (c === '*' && nc === '/') { inComment = 0; ci++; }
      continue;
    }
    if (inComment === 1) {
      continue;
    }
    // String handling
    if (inStr) {
      if (c === '\\') { ci++; continue; }
      if (c === inStr) inStr = null;
      continue;
    }
    
    // Detect comments
    if (c === '/' && nc === '/') { inComment = 1; break; }
    if (c === '/' && nc === '*') { inComment = 2; ci++; continue; }
    // Detect strings
    if (c === '"' || c === "'") { inStr = c; continue; }
    // Template literal tracking (simplified)
    if (c === '`') { inTemplate = (inTemplate + 1) % 2; continue; }
    
    // JSX expression depth
    if (c === '{') {
      if (nc === '/' && line[ci+2] === '*') {
        // JSX comment {/* */}
        let end = line.indexOf('*/}', ci);
        if (end >= 0) { ci = end + 2; } else { inComment = 2; }
        continue;
      }
      inJsxExpr++;
      continue;
    }
    if (c === '}') {
      if (inJsxExpr > 0) inJsxExpr--;
      continue;
    }
    
    if (!isJsxContext()) continue;
    if (li < jsxStart) continue;
    
    // Track <div and </div>
    if (c === '<' && line.substring(ci+1, ci+5) === 'div ' || 
        (c === '<' && line.substring(ci+1, ci+5) === 'div>' && nc !== '/')) {
      // Check it's not </div>
      if (nc === 'd') {
        divDepth++;
        divStack.push(li+1);
        if (divDepth > maxDivDepth) maxDivDepth = divDepth;
        ci += 3; // skip 'div'
      }
    }
    
    if (c === '<' && nc === '/' && line.substring(ci+2, ci+6) === 'div>') {
      divDepth--;
      if (divDepth < 0) {
        console.log(`EXTRA </div> at line ${li+1}`);
        divDepth = 0;
      } else {
        divStack.pop();
      }
      ci += 5;
    }
  }
}

console.log(`\nMax div depth: ${maxDivDepth}`);
console.log(`Final div depth: ${divDepth}`);
console.log(`Unclosed divs (${divDepth}):`);
divStack.forEach(l => console.log(`  <div> at line ${l}`));
