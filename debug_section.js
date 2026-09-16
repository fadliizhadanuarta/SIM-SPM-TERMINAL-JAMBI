const fs = require('fs');
let lines = fs.readFileSync('src/app/page.tsx', 'utf8').split('\n');
const swc = require('@swc/core');

function testParse() {
  try {
    swc.parseSync(lines.join('\n'), {syntax:'typescript',tsx:true});
    return true;
  } catch(e) {
    return false;
  }
}

// Start by checking if the original fails
console.log('Original:', testParse() ? 'OK' : 'FAIL');

// Now try removing the footer section (lines 3497-end)
// The footer starts around 'footer' tag
let footerStart = -1;
for (let i = 3400; i < lines.length; i++) {
  if (lines[i].includes('<footer')) {
    footerStart = i;
    break;
  }
}
console.log('Footer at line:', footerStart + 1);

// Try removing the format picker dialog
let dialogStart = -1;
for (let i = 2300; i < 2800; i++) {
  if (lines[i].includes('showFormatPicker') && lines[i].includes('Dialog')) {
    dialogStart = i;
    break;
  }
}
console.log('Format picker dialog around line:', dialogStart + 1);

// Try removing the entire settings TabsContent (the last one)
// Find the Pengaturan TabsContent
let settingsStart = -1;
for (let i = 3100; i < 3200; i++) {
  if (lines[i].includes('TabsContent') && lines[i].includes('pengaturan')) {
    settingsStart = i;
    break;
  }
}
console.log('Settings tab at line:', settingsStart + 1);

// Remove the settings tab and everything after (just before footer)
if (settingsStart > 0 && footerStart > 0) {
  let testLines = [...lines.slice(0, settingsStart), '              {null}', ...lines.slice(footerStart)];
  const testCode = testLines.join('\n');
  try {
    swc.parseSync(testCode, {syntax:'typescript',tsx:true});
    console.log('Without settings tab: OK');
  } catch(e) {
    const m = e.message.match(/,-\[(\d+):/);
    console.log('Without settings tab: FAIL at', m ? m[1] : '?');
  }
}

// Try removing the Laporan tab entirely
let laporanStart = -1;
for (let i = 2600; i < 2700; i++) {
  if (lines[i].includes('TabsContent') && lines[i].includes('laporan')) {
    laporanStart = i;
    break;
  }
}
console.log('Laporan tab at line:', laporanStart + 1);

if (laporanStart > 0 && settingsStart > 0) {
  let testLines = [...lines.slice(0, laporanStart), '              {null}', ...lines.slice(settingsStart)];
  const testCode = testLines.join('\n');
  try {
    swc.parseSync(testCode, {syntax:'typescript',tsx:true});
    console.log('Without laporan tab: OK');
  } catch(e) {
    const m = e.message.match(/,-\[(\d+):/);
    console.log('Without laporan tab: FAIL at', m ? m[1] : '?');
  }
}

// Try removing Indikator tab
let indikatorStart = -1;
for (let i = 2050; i < 2150; i++) {
  if (lines[i].includes('TabsContent') && lines[i].includes('indikator')) {
    indikatorStart = i;
    break;
  }
}
console.log('Indikator tab at line:', indikatorStart + 1);
