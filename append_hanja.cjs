const fs = require('fs');
const data = JSON.parse(fs.readFileSync('level6_final.json', 'utf8'));
let js = '\nexport const LEVEL_6_HANJA = [\n';
data.forEach((d, i) => {
  if (i % 10 === 0) js += `  // --- 6급 난이도 ${i/10 + 1} ---\n`;
  js += `  { char: '${d.char}', meaning: '${d.meaning}', spell: '${d.spell}', effectType: '${d.effectType}' },\n`;
});
js += '];\n';
fs.appendFileSync('src/data/hanjaData.js', js);
console.log('Appended LEVEL_6_HANJA successfully.');
