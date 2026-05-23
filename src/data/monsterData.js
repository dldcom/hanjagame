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
  { id: 'enemy_1', name: '불 도깨비', imageUrl: '/fire_monster.png', maxHp: 1, requiredLevel: 1 },
  { id: 'enemy_2', name: '물 슬라임', imageUrl: '/water_monster.png', maxHp: 2, requiredLevel: 2 },
  { id: 'enemy_3', name: '바람 박쥐', imageUrl: '/wind_monster.png', maxHp: 3, requiredLevel: 3 },
  { id: 'enemy_4', name: '돌 골렘', imageUrl: '/earth_monster.png', maxHp: 4, requiredLevel: 4 },
  { id: 'enemy_5', name: '어둠의 기사', imageUrl: '/dark_monster.png', maxHp: 5, requiredLevel: 5 }
];
