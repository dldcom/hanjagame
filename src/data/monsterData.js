export const PLAYER_MONSTERS = [
  {
    id: 'water_dragon',
    name: '물 드래곤',
    imageUrl: '/player_monster.webp',
    element: 'water',
    rarity: 'common',
    evolvedForm: {
      name: '아쿠아 레비아탄',
      imageUrl: '/aqua_leviathan.webp'
    }
  },
  {
    id: 'leaf_spirit',
    name: '숲의 정령',
    imageUrl: '/leaf_monster.webp',
    element: 'nature',
    rarity: 'rare',
    evolvedForm: {
      name: '고대 숲의 수호자',
      imageUrl: '/ancient_forest_guardian.webp'
    }
  },
  {
    id: 'spark_cat',
    name: '번개 냥이',
    imageUrl: '/spark_monster.webp',
    element: 'electric',
    rarity: 'rare',
    evolvedForm: {
      name: '천둥 호랑이',
      imageUrl: '/thunder_tiger.webp'
    }
  },
  {
    id: 'rock_golem',
    name: '바위 골렘',
    imageUrl: '/rock_monster.webp',
    element: 'earth',
    rarity: 'epic',
    evolvedForm: {
      name: '대지 타이탄',
      imageUrl: '/earth_titan.webp'
    }
  },
  {
    id: 'hidden_sketch_monster',
    name: '환상의 스케치 요정',
    imageUrl: '/hidden_monster.webp',
    element: 'light',
    rarity: 'legendary'
  },
  {
    id: 'hidden_sketch_monster_2',
    name: '신비의 스케치 마법사',
    imageUrl: '/hidden_monster_2.webp',
    element: 'dark',
    rarity: 'legendary'
  },
  {
    id: 'hidden_sketch_monster_3',
    name: '전설의 스케치 기사',
    imageUrl: '/hidden_monster_3.webp',
    element: 'fire',
    rarity: 'legendary'
  },
  {
    id: 'wind_fairy',
    name: '바람개비 요정',
    imageUrl: '/wind_fairy.webp',
    element: 'wind',
    rarity: 'common'
  },
  {
    id: 'frost_penguin',
    name: '서리 펭귄',
    imageUrl: '/frost_penguin.webp',
    element: 'ice',
    rarity: 'common'
  },
  {
    id: 'earth_mole',
    name: '대지 두더지',
    imageUrl: '/earth_mole.webp',
    element: 'earth',
    rarity: 'common'
  },
  {
    id: 'fire_fox',
    name: '불꽃 여우',
    imageUrl: '/fire_fox.webp',
    element: 'fire',
    rarity: 'rare'
  },
  {
    id: 'wave_seahorse',
    name: '파도 해마',
    imageUrl: '/wave_seahorse.webp',
    element: 'water',
    rarity: 'rare'
  },
  {
    id: 'steel_knight',
    name: '강철 기사몽',
    imageUrl: '/steel_knight.webp',
    element: 'metal',
    rarity: 'rare'
  },
  {
    id: 'petal_bunny',
    name: '꽃잎 토끼',
    imageUrl: '/petal_bunny.webp',
    element: 'nature',
    rarity: 'epic'
  },
  {
    id: 'star_dragon',
    name: '별빛 아기 용',
    imageUrl: '/star_dragon.webp',
    element: 'light',
    rarity: 'epic'
  },
  {
    id: 'shadow_cat',
    name: '그림자 고양이',
    imageUrl: '/shadow_cat.webp',
    element: 'dark',
    rarity: 'epic'
  },
  {
    id: 'thunder_eagle',
    name: '천둥 독수리',
    imageUrl: '/thunder_eagle.webp',
    element: 'electric',
    rarity: 'legendary'
  }
];

export const getRandomMonster = () => {
  const randomIndex = Math.floor(Math.random() * PLAYER_MONSTERS.length);
  return PLAYER_MONSTERS[randomIndex];
};

export const getMonsterById = (id) => {
  const monster = PLAYER_MONSTERS.find(m => m.id === id);
  if (!monster) return null;
  return { ...monster, isEvolved: false };
};

export const ENEMY_MONSTERS = [
  { id: 'enemy_1', name: '불 도깨비', imageUrl: '/fire_monster.webp', maxHp: 2, requiredLevel: 1 },
  { id: 'enemy_2', name: '물 슬라임', imageUrl: '/water_monster.webp', maxHp: 4, requiredLevel: 2 },
  { id: 'enemy_3', name: '바람 박쥐', imageUrl: '/wind_monster.webp', maxHp: 6, requiredLevel: 3 },
  { id: 'enemy_4', name: '돌 골렘', imageUrl: '/earth_monster.webp', maxHp: 8, requiredLevel: 4 },
  { id: 'enemy_5', name: '어둠의 기사', imageUrl: '/dark_monster.webp', maxHp: 10, requiredLevel: 5 }
];

export const LEVEL7_ENEMY_MONSTERS = [
  { id: 'enemy7_1', name: '풀잎 애벌레', imageUrl: '/enemy7_1.webp', maxHp: 2, requiredLevel: 1 },
  { id: 'enemy7_2', name: '독버섯 요정', imageUrl: '/enemy7_2.webp', maxHp: 4, requiredLevel: 2 },
  { id: 'enemy7_3', name: '얼음 펭귄', imageUrl: '/enemy7_3.webp', maxHp: 6, requiredLevel: 3 },
  { id: 'enemy7_4', name: '모래 여우', imageUrl: '/enemy7_4.webp', maxHp: 8, requiredLevel: 4 },
  { id: 'enemy7_5', name: '번개 찌르레기', imageUrl: '/enemy7_5.webp', maxHp: 10, requiredLevel: 5 },
  { id: 'enemy7_6', name: '유령 호박', imageUrl: '/enemy7_6.webp', maxHp: 12, requiredLevel: 6 },
  { id: 'enemy7_7', name: '강철 꼬마로봇', imageUrl: '/enemy7_7.webp', maxHp: 14, requiredLevel: 7 },
  { id: 'enemy7_8', name: '마그마 하운드', imageUrl: '/enemy7_8.webp', maxHp: 16, requiredLevel: 8 },
  { id: 'enemy7_9', name: '수정 방패병', imageUrl: '/enemy7_9.webp', maxHp: 18, requiredLevel: 9 },
  { id: 'enemy7_10', name: '타락한 꼬마 드래곤', imageUrl: '/enemy7_10.webp', maxHp: 20, requiredLevel: 10 }
];
