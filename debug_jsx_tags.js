const fs = require('fs');
const code = fs.readFileSync('src/app/page.tsx', 'utf8');
const lines = code.split('\n');

let depth = 0;
let maxDepth = 0;
let inJsxExpr = 0;
let inTemplate = 0;
let inStr = null;
let inComment = 0;
let jsxTagStack = [];

for (let li = 0; li < lines.length; li++) {
  const line = lines[li];
  for (let ci = 0; ci < line.length; ci++) {
    const c = line[ci];
    const nc = line[ci+1];
    
    // Handle comments
    if (inComment === 2) {
      if (c === '*' && nc === '/') { inComment = 0; ci++; }
      continue;
    }
    if (inComment === 1) {
      continue;
    }
    // Handle strings
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
    // Track template literals
    if (c === '`') { inTemplate++; continue; }
    
    // JSX comment {/* */}
    if (c === '{' && nc === '/' && line[ci+2] === '*') {
      inJsxExpr++;
      // Find */}
      let end = line.indexOf('*/}', ci);
      if (end >= 0) {
        ci = end + 2;
        inJsxExpr--;
      } else {
        inComment = 2; // treat as block comment
      }
      continue;
    }
    
    if (inJsxExpr > 0) {
      if (c === '{') inJsxExpr++;
      if (c === '}') inJsxExpr--;
      continue;
    }
    
    // JSX tag detection (simplified)
    if (c === '<' && /[A-Z]/.test(nc)) {
      // Opening JSX tag
      let tagEnd = line.indexOf(' ', ci);
      let tagClose = line.indexOf('>', ci);
      let tagSelfClose = line.indexOf('/>', ci);
      
      if (tagSelfClose >= 0 && (tagSelfClose < tagClose || tagClose < 0)) {
        // Self-closing tag
        let tagName = line.substring(ci+1, tagSelfClose).replace(/\s.*$/, '').trim();
        // Don't report self-closing
        ci = tagSelfClose + 1;
      } else if (tagClose >= 0) {
        let beforeClose = line.substring(ci, tagClose);
        if (beforeClose.endsWith('/')) {
          // Self-closing with space before />
          ci = tagClose;
        } else {
          // Opening tag
          let tagName = line.substring(ci+1, Math.min(tagEnd >= 0 ? tagEnd : tagClose, ci + 30)).trim();
          tagName = tagName.split(/\s/)[0];
          if (tagName && /^[A-Z]/.test(tagName)) {
            jsxTagStack.push({ tag: tagName, line: li+1 });
            depth++;
            if (depth > maxDepth) maxDepth = depth;
          }
          ci = tagClose;
        }
      }
    }
    
    // Closing tag
    if (c === '<' && nc === '/') {
      let tagClose = line.indexOf('>', ci);
      if (tagClose >= 0) {
        let tagName = line.substring(ci+2, tagClose).trim();
        if (depth > 0) {
          let opened = jsxTagStack.pop();
          depth--;
          if (opened && opened.tag !== tagName) {
            console.log(`MISMATCH at line ${li+1}: opened <${opened.tag}> at line ${opened.line}, closing </${tagName}>`);
          }
        } else {
          console.log(`EXTRA CLOSE </${tagName}> at line ${li+1}, depth was 0`);
        }
        ci = tagClose;
      }
    }
  }
}

console.log(`\nMax depth: ${maxDepth}`);
console.log(`Remaining open tags (${depth}):`);
jsxTagStack.forEach(t => console.log(`  <${t.tag}> opened at line ${t.line}`));
