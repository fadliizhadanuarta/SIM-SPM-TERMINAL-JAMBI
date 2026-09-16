const fs = require('fs');
let lines = fs.readFileSync('src/app/page.tsx', 'utf8').split('\n');
const swc = require('@swc/core');

// The main JSX structure is:
// line 1692: return (
// line 1693: <div className="min-h-screen...">
// line 1694:   {/* Header */}
// line 1695:   <header ...>
// ... header ...
// line 1729:   </header>
// line 1730: (blank or content)
// ... main content ...
// line 3497:   </main>
// line 3498:   <footer ...>
// ... footer ...
// line ~4070: </footer>
// line ~4071: </div>
// line ~4072: )

// Find the main content area (after header, before footer)
// Let's replace the entire main content with just {null}

// Find </header>
let headerEnd = -1;
for (let i = 1720; i < 1740; i++) {
  if (lines[i].includes('</header>')) {
    headerEnd = i;
    break;
  }
}
console.log('Header ends at line:', headerEnd + 1);

// Find <footer
let footerStart = -1;
for (let i = 3490; i < 3510; i++) {
  if (lines[i].includes('<footer')) {
    footerStart = i;
    break;
  }
}
console.log('Footer starts at line:', footerStart + 1);

// Replace everything between header and footer with {null}
let testLines = [...lines.slice(0, headerEnd + 1), '      {null}', ...lines.slice(footerStart)];
try {
  swc.parseSync(testLines.join('\n'), {syntax:'typescript',tsx:true});
  console.log('With {null} body: OK');
} catch(e) {
  const m = e.message.match(/,-\[(\d+):/);
  console.log('With {null} body: FAIL at', m ? m[1] : '?');
  // Show error details
  console.log(e.message.split('\n').slice(0, 8).join('\n'));
}

// Now try with just the footer removed too
let testLines2 = [...lines.slice(0, headerEnd + 1), '      {null}', '    </div>', '  )', '}'];
try {
  swc.parseSync(testLines2.join('\n'), {syntax:'typescript',tsx:true});
  console.log('With {null} body, no footer: OK');
} catch(e) {
  const m = e.message.match(/,-\[(\d+):/);
  console.log('With {null} body, no footer: FAIL at', m ? m[1] : '?');
  console.log(e.message.split('\n').slice(0, 8).join('\n'));
}
