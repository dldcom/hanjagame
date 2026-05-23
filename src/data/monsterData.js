export const PLAYER_MONSTERS = [
  {
    id: 'water_dragon',
    name: '물 드래곤',
    imageUrl: '/player_monster.png',
    element: 'water',
    rarity: 'common',
    evolvedForm: {
      name: '아쿠아 레비아탄',
      imageUrl: '/aqua_leviathan.png'
    }
  },
  {
    id: 'leaf_spirit',
    name: '숲의 정령',
    imageUrl: '/leaf_monster.png',
    element: 'nature',
    rarity: 'rare',
    evolvedForm: {
      name: '고대 숲의 수호자',
      imageUrl: '/ancient_forest_guardian.png'
    }
  },
  {
    id: 'spark_cat',
    name: '번개 냥이',
    imageUrl: '/spark_monster.png',
    element: 'electric',
    rarity: 'rare',
    evolvedForm: {
      name: '천둥 호랑이',
      imageUrl: '/thunder_tiger.png'
    }
  },
  {
    id: 'rock_golem',
    name: '바위 골렘',
    imageUrl: '/rock_monster.png',
    element: 'earth',
    rarity: 'epic',
    evolvedForm: {
      name: '대지 타이탄',
      imageUrl: '/earth_titan.png'
    }
  }
];

export const HIDDEN_MONSTERS = [
  {
    id: 'hidden_sketch_monster',
    name: '환상의 스케치 요정',
    imageUrl: '/hidden_monster.png',
    element: 'light',
    rarity: 'legendary'
  },
  {
    id: 'hidden_sketch_monster_2',
    name: '신비의 스케치 마법사',
    imageUrl: '/hidden_monster_2.png',
    element: 'dark',
    rarity: 'legendary'
  },
  {
    id: 'hidden_sketch_monster_3',
    name: '전설의 스케치 기사',
    imageUrl: '/hidden_monster_3.png',
    element: 'fire',
    rarity: 'legendary'
  }
];

export const getRandomMonster = () => {
  const randomIndex = Math.floor(Math.random() * PLAYER_MONSTERS.length);
  return PLAYER_MONSTERS[randomIndex];
};

export const getMonsterById = (id) => {
  const hiddenMonster = HIDDEN_MONSTERS.find(m => m.id === id);
  if (hiddenMonster) return { ...hiddenMonster, isEvolved: false };
  const monster = PLAYER_MONSTERS.find(m => m.id === id);
  if (!monster) return null;
  return { ...monster, isEvolved: false };
};

export const ENEMY_MONSTERS = [
  { id: 'enemy_1', name: '불 도깨비', imageUrl: '/fire_monster.png', maxHp: 1, requiredLevel: 1 },
  { id: 'enemy_2', name: '물 슬라임', imageUrl: '/water_monster.png', maxHp: 2, requiredLevel: 2 },
  { id: 'enemy_3', name: '바람 박쥐', imageUrl: '/wind_monster.png', maxHp: 3, requiredLevel: 3 },
  { id: 'enemy_4', name: '돌 골렘', imageUrl: '/earth_monster.png', maxHp: 4, requiredLevel: 4 },
  { id: 'enemy_5', name: '어둠의 기사', imageUrl: '/dark_monster.png', maxHp: 5, requiredLevel: 5 }
];

export const LEVEL7_ENEMY_MONSTERS = [
  { id: 'enemy7_1', name: '풀잎 애벌레', imageUrl: '/enemy7_1.png', maxHp: 1, requiredLevel: 1 },
  { id: 'enemy7_2', name: '독버섯 요정', imageUrl: '/enemy7_2.png', maxHp: 2, requiredLevel: 2 },
  { id: 'enemy7_3', name: '얼음 펭귄', imageUrl: '/enemy7_3.png', maxHp: 3, requiredLevel: 3 },
  { id: 'enemy7_4', name: '모래 여우', imageUrl: '/enemy7_4.png', maxHp: 4, requiredLevel: 4 },
  { id: 'enemy7_5', name: '번개 찌르레기', imageUrl: '/enemy7_5.png', maxHp: 5, requiredLevel: 5 },
  { id: 'enemy7_6', name: '유령 호박', imageUrl: '/enemy7_6.png', maxHp: 6, requiredLevel: 6 },
  { id: 'enemy7_7', name: '강철 꼬마로봇', imageUrl: '/enemy7_7.png', maxHp: 7, requiredLevel: 7 },
  { id: 'enemy7_8', name: '마그마 하운드', imageUrl: '/enemy7_8.png', maxHp: 8, requiredLevel: 8 },
  { id: 'enemy7_9', name: '수정 방패병', imageUrl: '/enemy7_9.png', maxHp: 9, requiredLevel: 9 },
  { id: 'enemy7_10', name: '타락한 꼬마 드래곤', imageUrl: '/enemy7_10.png', maxHp: 10, requiredLevel: 10 }
];
