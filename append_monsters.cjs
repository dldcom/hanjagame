const fs = require('fs');
let js = '\nexport const LEVEL6_ENEMY_MONSTERS = [\n';
for(let i=1; i<=15; i++) {
  const names = ['그림자 정령', '모래 전갈', '맹독 늪지뱀', '고대 목각인형', '바람의 검객', '화염 사제', '강철 기계수', '서리 마녀', '대지의 코뿔소', '수정 골렘', '암흑 기사', '심해 괴수', '번개 드래곤', '환영 마술사', '지옥의 문지기'];
  const hp = 20 + i * 5; // 25 to 95 HP
  js += `  { id: 'enemy6_${i}', name: '${names[i-1]}', imageUrl: '/enemy6_${i}.webp', maxHp: ${hp}, requiredLevel: ${i} }${i<15 ? ',' : ''}\n`;
}
js += '];\n';
fs.appendFileSync('src/data/monsterData.js', js);
console.log('Appended LEVEL6_ENEMY_MONSTERS successfully.');
