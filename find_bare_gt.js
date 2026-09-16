const fs = require('fs');
const data = fs.readFileSync('src/app/page.tsx.bak', 'utf8');
const lines = data.split('\n');

let inSingleQuote = false;
let inDoubleQuote = false;
let inTemplate = false;
let inLineComment = false;
let inBlockComment = false;
let braceDepth = 0;
let parenDepth = 0;
let bracketDepth = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  inLineComment = false;
  
  for (let j = 0; j < line.length; j++) {
    const c = line[j];
    const next = line[j+1] || '';
    
    // Handle comments
    if (inLineComment) continue;
    if (inBlockComment) {
      if (c === '*' && next === '/') { inBlockComment = false; j++; }
      continue;
    }
    if (!inSingleQuote && !inDoubleQuote && !inTemplate && c === '/' && next === '/') {
      inLineComment = true;
      j++;
      continue;
    }
    if (!inSingleQuote && !inDoubleQuote && !inTemplate && c === '/' && next === '*') {
      inBlockComment = true;
      j++;
      continue;
    }
    
    // Handle strings
    if (inSingleQuote) {
      if (c === "'" && (j === 0 || line[j-1] !== '\\')) inSingleQuote = false;
      continue;
    }
    if (inDoubleQuote) {
      if (c === '"' && (j === 0 || line[j-1] !== '\\')) inDoubleQuote = false;
      continue;
    }
    if (inTemplate) {
      if (c === '`' && (j === 0 || line[j-1] !== '\\')) inTemplate = false;
      if (c === '$' && next === '{') { braceDepth++; j++; }
      continue;
    }
    
    // Not in any string/comment
    if (c === "'") { inSingleQuote = true; continue; }
    if (c === '"') { inDoubleQuote = true; continue; }
    if (c === '`') { inTemplate = true; continue; }
    
    if (c === '{') braceDepth++;
    if (c === '}') braceDepth--;
    if (c === '(') parenDepth++;
    if (c === ')') parenDepth--;
    if (c === '[') bracketDepth++;
    if (c === ']') bracketDepth--;
    
    // Check for bare > that could confuse JSX parser
    // A > is "bare" if we're at braceDepth 0 (i.e., in JSX text context)
    // and it's not part of a JSX tag (not preceded by / or alphanumeric)
    if (c === '>' && braceDepth === 0 && parenDepth === 0 && bracketDepth === 0) {
      // Check if this > is part of a JSX tag closing (preceded by alphanumeric, /, or *)
      const prev = j > 0 ? line[j-1] : '';
      const prevNonSpace = line.substring(0, j).trimEnd().slice(-1);
      if (prevNonSpace !== '/' && prevNonSpace !== '>' && !/[a-zA-Z0-9*="'`\-]/.test(prevNonSpace)) {
        // This > might be a comparison operator in JSX context!
        console.log(`Line ${i+1}, col ${j+1}: bare > with prev='${prevNonSpace}' context: ...${line.substring(Math.max(0,j-30), j+30)}...`);
      }
    }
  }
}

console.log('Done');
