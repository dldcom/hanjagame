import React, { useState } from 'react';
import { PLAYER_MONSTERS, getMonsterById, HIDDEN_MONSTERS } from '../data/monsterData';

export default function VillageMode({ 
  onBack, 
  eggPieces, 
  setEggPieces, 
  goldenEggPieces,
  setGoldenEggPieces,
  ownedMonsters, 
  setOwnedMonsters,
  activeMonsterId,
  setActiveMonsterId
}) {
  const [hatching, setHatching] = useState(false);
  const [hatchResult, setHatchResult] = useState(null);

  const handleHatch = () => {
    if (eggPieces < 10 || hatching) return;

    const unowned = PLAYER_MONSTERS.filter(m => !ownedMonsters.includes(m.id));
    
    if (unowned.length === 0) {
      alert("이미 모든 몬스터를 모았습니다!");
      return;
    }

    setEggPieces(prev => prev - 10);
    setHatching(true);
    setHatchResult(null);

    // Simple delay for animation feeling
    setTimeout(() => {
      const randomMonster = unowned[Math.floor(Math.random() * unowned.length)];
      setOwnedMonsters(prev => [...prev, randomMonster.id]);
      setHatchResult(randomMonster);
      setHatching(false);
    }, 1500);
  };

  const handleGoldenHatch = () => {
    if (goldenEggPieces < 10 || hatching) return;

    const unownedHidden = HIDDEN_MONSTERS.filter(m => !ownedMonsters.includes(m.id));

    if (unownedHidden.length === 0) {
      alert("이미 모든 히든 몬스터를 획득하셨습니다!");
      return;
    }

    setGoldenEggPieces(prev => prev - 10);
    setHatching(true);
    setHatchResult(null);

    setTimeout(() => {
      const randomHidden = unownedHidden[Math.floor(Math.random() * unownedHidden.length)];
      setOwnedMonsters(prev => [...prev, randomHidden.id]);
      setHatchResult(randomHidden);
      setHatching(false);
    }, 2500);
  };

  return (
    <div className="village-container">
      <header style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', marginBottom: '2rem' }}>
        <button className="secondary" onClick={onBack}>← 메인으로</button>
        <h1 style={{ fontSize: '2.5rem', color: 'var(--primary)', margin: 0 }}>🏡 한자 마을</h1>
        <div className="card" style={{ padding: '0.5rem 1rem', width: 'auto', display: 'flex', gap: '1rem' }}>
          <span style={{ fontWeight: 'bold' }}>🥚 알 조각: {eggPieces}개</span>
          <span style={{ fontWeight: 'bold', color: '#B8860B' }}>🌟 황금 알 조각: {goldenEggPieces}개</span>
        </div>
      </header>

      <div className="village-layout">
        
        {/* Left Side: Gacha System */}
        <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', minHeight: '300px' }}>
          <h2 style={{ marginBottom: '1rem', color: 'var(--text-main)' }}>몬스터 뽑기</h2>
          <p style={{ marginBottom: '2rem', textAlign: 'center' }}>알 조각 10개로 몬스터 알을 부화시키세요!</p>

          {hatchResult && !hatching ? (
            <div style={{ textAlign: 'center', animation: 'bounce 0.5s' }}>
              <h3 style={{ color: 'var(--success)', marginBottom: '1rem' }}>{hatchResult.name} 등장!</h3>
              <img src={hatchResult.imageUrl} style={{ height: '200px', objectFit: 'contain' }} alt="New Monster" />
              <div style={{ marginTop: '1rem' }}>
                <button onClick={() => setHatchResult(null)}>계속하기</button>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <div 
                style={{ 
                  fontSize: '6rem', 
                  marginBottom: '1rem', 
                  animation: hatching ? 'shake 0.5s infinite' : 'none',
                  filter: eggPieces >= 10 ? 'none' : 'grayscale(100%)',
                  opacity: eggPieces >= 10 ? 1 : 0.5
                }}
              >
                🥚
              </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', padding: '0 2rem' }}>
              <button 
                onClick={handleHatch} 
                disabled={eggPieces < 10 || hatching}
                style={{ background: eggPieces >= 10 ? 'var(--accent)' : '#ccc', color: '#333' }}
              >
                {hatching ? '부화하는 중...' : '🥚 일반 알 부화 (-10 조각)'}
              </button>
              
              <button 
                onClick={handleGoldenHatch} 
                disabled={goldenEggPieces < 10 || hatching || HIDDEN_MONSTERS.every(m => ownedMonsters.includes(m.id))}
                style={{ 
                  background: goldenEggPieces >= 10 && !HIDDEN_MONSTERS.every(m => ownedMonsters.includes(m.id)) ? 'linear-gradient(45deg, #FFD700, #FFA500)' : '#ccc', 
                  color: goldenEggPieces >= 10 ? '#fff' : '#666',
                  boxShadow: goldenEggPieces >= 10 ? '0 4px 15px rgba(255, 215, 0, 0.4)' : 'none',
                  border: 'none',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
                }}
              >
                {hatching ? '부화하는 중...' : HIDDEN_MONSTERS.every(m => ownedMonsters.includes(m.id)) ? '🌟 히든 몬스터 획득 완료' : '🌟 황금 알 부화 (-10 조각)'}
              </button>
            </div>
            </div>
          )}
        </div>

        {/* Right Side: Collection System */}
        <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', maxHeight: '70vh' }}>
          <h2 style={{ marginBottom: '1rem', color: 'var(--text-main)', textAlign: 'center' }}>내 몬스터 도감</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {[...PLAYER_MONSTERS, ...HIDDEN_MONSTERS].map(baseMonster => {
              const isOwned = ownedMonsters.includes(baseMonster.id);
              const isActive = activeMonsterId === baseMonster.id;
              // Get evolved form if applicable
              const displayMonster = getMonsterById(baseMonster.id);

              return (
                <div 
                  key={baseMonster.id}
                  onClick={() => isOwned && setActiveMonsterId(baseMonster.id)}
                  style={{
                    border: `3px solid ${isActive ? 'var(--primary)' : 'transparent'}`,
                    borderRadius: '12px',
                    padding: '1rem',
                    background: isOwned ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.1)',
                    cursor: isOwned ? 'pointer' : 'not-allowed',
                    textAlign: 'center',
                    filter: isOwned ? 'none' : 'grayscale(100%) brightness(50%)'
                  }}
                >
                  <img 
                    src={displayMonster.imageUrl} 
                    alt={displayMonster.name} 
                    style={{ width: '80px', height: '80px', objectFit: 'contain', marginBottom: '0.5rem' }} 
                  />
                  <div style={{ fontWeight: 'bold' }}>{isOwned ? displayMonster.name : '???'}</div>
                  
                  {isOwned && (
                    <div style={{ marginTop: '0.5rem', textAlign: 'left' }}>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>도감 등록 완료</div>
                    </div>
                  )}

                  {isActive && <div style={{ color: 'var(--primary)', fontSize: '0.8rem', marginTop: '0.5rem', fontWeight: 'bold' }}>⭐ 파트너</div>}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
