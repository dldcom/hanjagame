import React, { useState } from 'react';
import { PLAYER_MONSTERS, getMonsterById } from '../data/monsterData';

export default function VillageMode({ 
  onBack, 
  eggPieces, 
  setEggPieces, 
  ownedMonsters, 
  setOwnedMonsters,
  activeMonsterId,
  setActiveMonsterId,
  showAlert,
  gainExp
}) {
  const [hatching, setHatching] = useState(false);
  const [hatchResult, setHatchResult] = useState(null);

  const handleHatch = () => {
    if (eggPieces < 20 || hatching) return;

    const unowned = PLAYER_MONSTERS.filter(m => !ownedMonsters.includes(m.id));
    
    if (unowned.length === 0) {
      showAlert("이미 모든 몬스터를 모았습니다!");
      return;
    }

    setEggPieces(prev => prev - 20);
    setHatching(true);
    setHatchResult(null);

    setTimeout(() => {
      const randomMonster = unowned[Math.floor(Math.random() * unowned.length)];
      setOwnedMonsters(prev => [...prev, randomMonster.id]);
      setHatchResult(randomMonster);
      setHatching(false);
    }, 1500);
  };

  const handleBuyExp = (amount) => {
    if (eggPieces < amount) {
      showAlert("알 조각이 부족합니다!");
      return;
    }
    setEggPieces(prev => prev - amount);
    gainExp(amount * 10);
    showAlert(`알 조각 ${amount}개를 소모하여 ${amount * 10} EXP를 얻었습니다! 🧪`);
  };

  return (
    <div className="village-container">
      <header style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', marginBottom: '2rem' }}>
        <button className="secondary" onClick={onBack}>← 메인으로</button>
        <h1 style={{ fontSize: '2.5rem', color: 'var(--primary)', margin: 0 }}>🏡 한자 마을</h1>
        <div className="card" style={{ padding: '0.5rem 1rem', width: 'auto', display: 'flex', gap: '1rem' }}>
          <span style={{ fontWeight: 'bold' }}>🥚 알 조각: {eggPieces}개</span>
        </div>
      </header>

      <div className="village-layout" style={{ display: 'flex', gap: '2rem', minHeight: '60vh' }}>
        
        {/* Left Side: Split into Top (Hatchery) and Bottom (EXP Potion) */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Top Row: Gacha System */}
          <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <h2 style={{ marginBottom: '1rem', color: 'var(--text-main)' }}>몬스터 뽑기</h2>
            <p style={{ marginBottom: '2rem', textAlign: 'center' }}>알 조각 20개로 몬스터 알을 부화시키세요!</p>

            {hatchResult && !hatching ? (
              <div style={{ textAlign: 'center', animation: 'bounce 0.5s' }}>
                <h3 style={{ color: 'var(--success)', marginBottom: '1rem' }}>{hatchResult.name} 등장!</h3>
                <img src={hatchResult.imageUrl} style={{ height: '150px', objectFit: 'contain' }} alt="New Monster" />
                <div style={{ marginTop: '1rem' }}>
                  <button onClick={() => setHatchResult(null)}>계속하기</button>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <div 
                  style={{ 
                    fontSize: '5rem', 
                    marginBottom: '1rem', 
                    animation: hatching ? 'shake 0.5s infinite' : 'none',
                    filter: eggPieces >= 20 ? 'none' : 'grayscale(100%)',
                    opacity: eggPieces >= 20 ? 1 : 0.5
                  }}
                >
                  🥚
                </div>
                <button 
                  onClick={handleHatch} 
                  disabled={eggPieces < 20 || hatching}
                  style={{ background: eggPieces >= 20 ? 'var(--accent)' : '#ccc', color: '#333' }}
                >
                  {hatching ? '부화하는 중...' : '🥚 일반 알 부화 (-20 조각)'}
                </button>
              </div>
            )}
          </div>

          {/* Bottom Row: EXP Potion */}
          <div className="card" style={{ flex: 'none', padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <h3 style={{ marginBottom: '0.5rem', color: 'var(--primary)', fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>🧪 EXP 물약 상점</h3>
            <p style={{ marginBottom: '1rem', textAlign: 'center', fontSize: '0.9rem' }}>남는 알 조각을 경험치로 교환하세요!</p>
            
            <div style={{ display: 'flex', gap: '1rem', width: '100%', padding: '0 1rem' }}>
              <button 
                className="secondary"
                onClick={() => handleBuyExp(1)} 
                disabled={eggPieces < 1}
                style={{ flex: 1, fontSize: '0.8rem', padding: '0.4rem' }}
              >
                1개 ➔ 10 EXP
              </button>
              <button 
                className="secondary"
                onClick={() => handleBuyExp(10)} 
                disabled={eggPieces < 10}
                style={{ flex: 1, fontSize: '0.8rem', padding: '0.4rem' }}
              >
                10개 ➔ 100 EXP
              </button>
            </div>
            <div style={{ width: '100%', padding: '0 1rem', marginTop: '0.5rem' }}>
              <button 
                onClick={() => handleBuyExp(eggPieces)} 
                disabled={eggPieces === 0}
                style={{ width: '100%', background: 'var(--success)', fontSize: '0.9rem', padding: '0.5rem' }}
              >
                전부 교환 ({eggPieces * 10} EXP)
              </button>
            </div>
          </div>

        </div>

        {/* Right Side: Collection System */}
        <div style={{ flex: 1, position: 'relative' }}>
          <div className="card" style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
            <h2 style={{ marginBottom: '1rem', color: 'var(--text-main)', textAlign: 'center' }}>내 몬스터 도감</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {PLAYER_MONSTERS.map(baseMonster => {
              const isOwned = ownedMonsters.includes(baseMonster.id);
              const isActive = activeMonsterId === baseMonster.id;
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
    </div>
  );
}
