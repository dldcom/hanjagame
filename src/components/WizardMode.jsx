import React, { useState, useEffect, useCallback, useRef } from 'react';
import HanjaPad from './HanjaPad';
import { LEVEL_8_HANJA, LEVEL_7_HANJA } from '../data/hanjaData';
import { getMonsterById, ENEMY_MONSTERS, LEVEL7_ENEMY_MONSTERS } from '../data/monsterData';
import { motion, AnimatePresence } from 'framer-motion';

const getSpellPool = (requiredLevel, grade = 8) => {
  const sourceList = grade === 7 ? LEVEL_7_HANJA : LEVEL_8_HANJA;
  if (!requiredLevel) return [...sourceList];
  const itemsPerLevel = 10;
  const minIdx = (requiredLevel - 1) * itemsPerLevel;
  const maxIdx = Math.min(requiredLevel * itemsPerLevel, sourceList.length);
  return sourceList.slice(minIdx, maxIdx);
};

const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export default function WizardMode({ onBack, activeMonsterId, onBattleWin, maxUnlockedLevel8, maxUnlockedLevel7 = 0 }) {
  const PLAYER_MONSTER = getMonsterById(activeMonsterId || 'water_dragon');
  const [selectedEnemy, setSelectedEnemy] = useState(null);
  const [selectedGradeTab, setSelectedGradeTab] = useState(8);

  const [playerHp, setPlayerHp] = useState(5);
  const [monsterHp, setMonsterHp] = useState(1);
  const [turnState, setTurnState] = useState('player_attack'); 
  const [fakeSpell, setFakeSpell] = useState(null);
  const [illusionOrder, setIllusionOrder] = useState(0);
  const [droppedGoldenEgg, setDroppedGoldenEgg] = useState(false);
  const [currentSpell, setCurrentSpell] = useState(null); 
  const [dialogue, setDialogue] = useState(null); 
  const [dialogueQueue, setDialogueQueue] = useState([]); 
  const [activeEffect, setActiveEffect] = useState(null); 
  const [currentMaxTime, setCurrentMaxTime] = useState(10);
  const [timeLeft, setTimeLeft] = useState(10);

  const spellPoolRef = useRef([]);

  const drawFromPool = (level, grade) => {
    if (spellPoolRef.current.length === 0) {
      spellPoolRef.current = shuffle(getSpellPool(level, grade));
    }
    return spellPoolRef.current.pop();
  };

  const rollSpells = (level, grade) => {
    const real = drawFromPool(level, grade);
    let fake = drawFromPool(level, grade);
    if (fake.char === real.char) {
      fake = drawFromPool(level, grade);
      if (fake && fake.char === real.char) {
        // 극단적인 경우: 풀에서 못 찾으면 랜덤 폴백
        const pool = getSpellPool(level, grade);
        fake = pool.find(s => s.char !== real.char) || pool[0];
      }
    }
    if (!fake) {
      const pool = getSpellPool(level, grade);
      fake = pool.find(s => s.char !== real.char) || pool[0];
    }
    setCurrentSpell(real);
    setFakeSpell(fake);
    setIllusionOrder(Math.random() > 0.5 ? 1 : 0);
  };

  const enqueueDialogue = useCallback((text, onFinished = null) => {
    setDialogueQueue(prev => [...prev, { text, onFinished }]);
  }, []);

  const handleSelectEnemy = (enemy, grade) => {
    setSelectedEnemy({ ...enemy, grade });
    setMonsterHp(enemy.maxHp);
    setPlayerHp(5);
    setTurnState('player_attack');
    spellPoolRef.current = shuffle(getSpellPool(enemy.requiredLevel, grade));
    rollSpells(enemy.requiredLevel, grade);
    setDialogue(`야생의 ${enemy.name}이(가) 나타났다! 내 턴이다, 공격하자!`);
    setDialogueQueue([]);
    setActiveEffect(null);
    setDroppedGoldenEgg(false);
    setCurrentMaxTime(10);
    setTimeLeft(10);
  };

  useEffect(() => {
    if (!dialogue && dialogueQueue.length > 0) {
      const next = dialogueQueue[0];
      setDialogue(next.text);
    }
  }, [dialogue, dialogueQueue]);

  useEffect(() => {
    if (selectedEnemy && (turnState === 'player_attack' || turnState === 'monster_attack') && !dialogue && dialogueQueue.length === 0) {
      if (timeLeft <= 0) {
        takeDamage('앗! 시간 초과! 마법 시전에 실패했다!');
        return;
      }
      const timerId = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timerId);
    }
  }, [selectedEnemy, turnState, dialogue, dialogueQueue, timeLeft]);

  const handleDialogueClick = () => {
    if (!dialogue) return;
    const current = dialogueQueue[0];
    setDialogue(null);
    setDialogueQueue(prev => prev.slice(1));
    if (current && current.onFinished) {
      current.onFinished();
    }
  };

  const handleComplete = () => {
    if (turnState === 'player_attack') {
      setActiveEffect({ type: currentSpell.effectType || 'magic', target: 'monster' });
      setTimeout(() => setActiveEffect(null), 1000);
      enqueueDialogue(`[${currentSpell.meaning}] 마법 시전 성공!`);
      
      enqueueDialogue(`${selectedEnemy.name}에게 데미지를 입혔다!`, () => {
        const nextMonsterHp = Math.max(0, monsterHp - 1);
        setMonsterHp(nextMonsterHp);
        
        if (nextMonsterHp <= 0) {
          enqueueDialogue(`${selectedEnemy.name}을(를) 물리쳤다!`, () => {
            setDroppedGoldenEgg(false);
            if (onBattleWin) onBattleWin(3, 20, false);
            setTurnState('end');
          });
        } else {
          rollSpells(selectedEnemy.requiredLevel, selectedEnemy.grade);
          const nextTime = Math.max(5, currentMaxTime - 0.5); 
          setCurrentMaxTime(nextTime);
          setTimeLeft(nextTime);
          enqueueDialogue(`${selectedEnemy.name}이(가) 반격한다! [${nextSpell.meaning}] 방패 마법을 준비해!`, () => {
             setTurnState('monster_attack');
          });
        }
      });
    } else if (turnState === 'monster_attack') {
      setActiveEffect({ type: currentSpell.effectType || 'magic', target: 'player' });
      setTimeout(() => setActiveEffect(null), 1000);
      
      enqueueDialogue(`[${currentSpell.meaning}] 완벽한 방어 마법 전개!`);
      enqueueDialogue(`${selectedEnemy.name}의 공격을 완벽하게 튕겨냈다!`, () => {
        rollSpells(selectedEnemy.requiredLevel, selectedEnemy.grade);
        const nextTime = Math.max(5, currentMaxTime - 0.5); 
        setCurrentMaxTime(nextTime);
        setTimeLeft(nextTime);
        enqueueDialogue(`내 턴이다! [${nextSpell.meaning}] 마법으로 공격하자!`, () => {
          setTurnState('player_attack');
        });
      });
    }
  };

  const takeDamage = (reason = '앗! 시간 초과! 마법 시전에 실패했다!') => {
    enqueueDialogue(reason);
    enqueueDialogue(`마법사가 공격을 받았다!`, () => {
      const nextPlayerHp = Math.max(0, playerHp - 1);
      setPlayerHp(nextPlayerHp);
      if (nextPlayerHp <= 0) {
        enqueueDialogue('눈앞이 깜깜해졌다...', () => setTurnState('end'));
      } else {
        rollSpells(selectedEnemy.requiredLevel, selectedEnemy.grade);
        const nextTime = Math.max(5, currentMaxTime - 0.5); 
        setCurrentMaxTime(nextTime);
        setTimeLeft(nextTime);
        if (turnState === 'player_attack') {
          enqueueDialogue(`${selectedEnemy.name}이(가) 반격한다! [${nextSpell.meaning}] 방패 마법을 준비해!`, () => {
             setTurnState('monster_attack');
          });
        } else {
          enqueueDialogue(`내 턴이다! [${nextSpell.meaning}] 마법으로 공격하자!`, () => {
            setTurnState('player_attack');
          });
        }
      }
    });
  };

  if (!selectedEnemy) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%', maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
        <button className="secondary" onClick={onBack} style={{ alignSelf: 'flex-start', marginBottom: '2rem' }}>
          ← 마을로 돌아가기
        </button>
        <h1 style={{ textAlign: 'center', color: 'var(--primary)', marginBottom: '1rem', textShadow: '2px 2px 0px var(--secondary)' }}>
          전투할 몬스터를 선택하세요
        </h1>

        {/* Grade Selection Tabs */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <button 
            onClick={() => setSelectedGradeTab(8)}
            style={{
              padding: '0.8rem 2rem',
              borderRadius: '20px',
              fontWeight: 'bold',
              background: selectedGradeTab === 8 ? 'var(--primary)' : '#e0e0e0',
              color: selectedGradeTab === 8 ? 'white' : '#666',
              boxShadow: selectedGradeTab === 8 ? '0 4px 10px rgba(0,0,0,0.2)' : 'none',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            8급 몬스터 (초보)
          </button>
          <button 
            onClick={() => {
              if (maxUnlockedLevel8 < 5) {
                alert('8급의 모든 난이도(1~5)를 다 깨야 7급 몬스터에 도전할 수 있습니다!');
              } else {
                setSelectedGradeTab(7);
              }
            }}
            style={{
              padding: '0.8rem 2rem',
              borderRadius: '20px',
              fontWeight: 'bold',
              background: selectedGradeTab === 7 ? 'var(--accent)' : '#e0e0e0',
              color: selectedGradeTab === 7 ? '#4A4E69' : '#999',
              boxShadow: selectedGradeTab === 7 ? '0 4px 10px rgba(0,0,0,0.2)' : 'none',
              border: 'none',
              cursor: maxUnlockedLevel8 >= 5 ? 'pointer' : 'not-allowed',
              opacity: maxUnlockedLevel8 >= 5 ? 1 : 0.6
            }}
          >
            {maxUnlockedLevel8 >= 5 ? '7급 몬스터 (정예)' : '🔒 7급 몬스터'}
          </button>
        </div>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', justifyContent: 'center' }}>
          {(selectedGradeTab === 8 ? ENEMY_MONSTERS : LEVEL7_ENEMY_MONSTERS).map((enemy) => {
            const isUnlocked = selectedGradeTab === 8 ? (maxUnlockedLevel8 >= enemy.requiredLevel) : (maxUnlockedLevel7 >= enemy.requiredLevel);
            return (
              <div 
                key={enemy.id}
                className="card"
                onClick={() => isUnlocked && handleSelectEnemy(enemy, selectedGradeTab)}
                style={{
                  width: '200px',
                  textAlign: 'center',
                  cursor: isUnlocked ? 'pointer' : 'not-allowed',
                  opacity: isUnlocked ? 1 : 0.6,
                  filter: isUnlocked ? 'none' : 'grayscale(100%)',
                  background: isUnlocked ? 'white' : '#f5f5f5',
                  transform: isUnlocked ? 'scale(1)' : 'scale(0.95)',
                  transition: 'all 0.2s',
                  boxShadow: isUnlocked ? '0 10px 20px rgba(0,0,0,0.1)' : 'none'
                }}
              >
                <div style={{ fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '1rem', color: isUnlocked ? 'var(--text-main)' : '#999' }}>
                  {isUnlocked ? enemy.name : '???'}
                </div>
                <img src={enemy.imageUrl} alt={enemy.name} style={{ width: '120px', height: '120px', objectFit: 'contain' }} />
                <div style={{ marginTop: '1rem', color: 'var(--error)', fontWeight: 'bold', fontSize: '1.2rem' }}>
                  HP: {enemy.maxHp}
                </div>
                {!isUnlocked && (
                  <div style={{ marginTop: '0.5rem', color: '#666', fontSize: '0.9rem', fontWeight: 'bold' }}>
                    ({selectedGradeTab}급 난이도 {enemy.requiredLevel} 클리어 필요)
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', maxWidth: '1000px', margin: '0 auto', minHeight: '90vh' }}>
      <button className="secondary" onClick={() => setSelectedEnemy(null)} style={{ alignSelf: 'flex-start', marginBottom: '1rem', zIndex: 10 }}>
        ← 도망치기
      </button>

      {turnState === 'end' && (
        <div className="card" style={{ textAlign: 'center', padding: '4rem', marginTop: '10vh' }}>
          <h1 style={{ fontSize: '3rem' }}>{playerHp > 0 ? '🎉 전투 승리!' : '😭 전투 패배...'}</h1>
          {playerHp > 0 && (
            <div style={{ margin: '2rem 0', fontSize: '1.5rem', color: 'var(--primary)', fontWeight: 'bold' }}>
              <p>🎁 몬스터 알 조각 +3 획득!</p>
              <p>✨ 경험치 +20 획득!!</p>
              {droppedGoldenEgg && <p style={{color: '#FFD700', marginTop: '1rem', textShadow: '1px 1px 2px #000'}}>🌟 황금 알 조각 +1 획득! 🌟</p>}
            </div>
          )}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
            <button onClick={() => setSelectedEnemy(null)}>다른 몬스터 선택</button>
            <button className="secondary" onClick={onBack}>마 마을로 돌아가기</button>
          </div>
        </div>
      )}

      {turnState !== 'end' && (
        <div className="card" style={{ 
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          overflow: 'hidden',
          position: 'relative',
          padding: 0
        }}>
          
          <div className="wizard-battle-container">
            
            {/* 1. Battle Stage (Top Section) */}
            <div className="wizard-battle-stage">
              
              {/* Player Participant */}
              <div className="battle-participant player">
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <motion.img 
                    src={PLAYER_MONSTER?.imageUrl || '/player_monster.png'} 
                    alt={PLAYER_MONSTER?.name || 'Player'}
                    animate={{ y: [0, 5, 0] }}
                    transition={{ y: { repeat: Infinity, duration: 2.5, ease: "easeInOut" } }}
                    className="battle-avatar"
                  />
                  {/* Hit effect on Player Avatar */}
                  <AnimatePresence>
                    {activeEffect && activeEffect.target === 'player' && (
                      <motion.img 
                        src={`/effect_${activeEffect.type}.png`}
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1.3, opacity: 1 }}
                        exit={{ scale: 1.6, opacity: 0 }}
                        transition={{ duration: 0.5, type: 'spring' }}
                        style={{
                          position: 'absolute',
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain',
                          pointerEvents: 'none',
                          zIndex: 30
                        }}
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    )}
                  </AnimatePresence>
                </div>
                <div className="participant-info">
                  <span className="participant-name">{PLAYER_MONSTER?.name || '꼬마 마법사'}</span>
                  <div className="hp-bar-container">
                    <span className="hp-label">HP</span>
                    <div className="hp-bar">
                      <motion.div animate={{ width: `${(playerHp / 5) * 100}%` }} style={{ height: '100%', background: 'var(--success)' }} />
                    </div>
                    <span className="hp-text">{playerHp}/5</span>
                  </div>
                </div>
              </div>

              {/* VS Text Divider */}
              <div className="battle-vs">VS</div>

              {/* Enemy Participant */}
              <div className="battle-participant enemy">
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <motion.img 
                    src={selectedEnemy.imageUrl} 
                    alt={selectedEnemy.name}
                    animate={{ y: [0, -5, 0] }}
                    transition={{ y: { repeat: Infinity, duration: 2, ease: "easeInOut" } }}
                    className="battle-avatar"
                  />
                  {/* Hit effect on Enemy Avatar */}
                  <AnimatePresence>
                    {activeEffect && activeEffect.target === 'monster' && (
                      <motion.img 
                        src={`/effect_${activeEffect.type}.png`}
                        initial={{ scale: 0.5, opacity: 0, rotate: -30 }}
                        animate={{ scale: 1.3, opacity: 1, rotate: 0 }}
                        exit={{ scale: 1.6, opacity: 0 }}
                        transition={{ duration: 0.5, type: 'spring' }}
                        style={{
                          position: 'absolute',
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain',
                          pointerEvents: 'none',
                          zIndex: 30
                        }}
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    )}
                  </AnimatePresence>
                </div>
                <div className="participant-info">
                  <span className="participant-name">{selectedEnemy.name}</span>
                  <div className="hp-bar-container">
                    <span className="hp-label">HP</span>
                    <div className="hp-bar">
                      <motion.div animate={{ width: `${(monsterHp / selectedEnemy.maxHp) * 100}%` }} style={{ height: '100%', background: 'var(--error)' }} />
                    </div>
                    <span className="hp-text">{monsterHp}/{selectedEnemy.maxHp}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Action Area (Bottom Section) */}
            <div className="wizard-action-stage">
              
              <AnimatePresence>
                {dialogue && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    style={{
                      position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                      background: 'rgba(0,0,0,0.85)', color: 'white', padding: '1.5rem',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      zIndex: 50, cursor: 'pointer', textAlign: 'center', borderRadius: '24px',
                      fontSize: '1.3rem', lineHeight: '1.5'
                    }}
                    onClick={handleDialogueClick}
                  >
                    {dialogue}
                    <div style={{ position: 'absolute', bottom: '0.8rem', right: '1rem', fontSize: '0.9rem', animation: 'pulse 1s infinite' }}>
                      터치해서 진행 ▶
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div style={{ width: '90%', height: '12px', background: '#ccc', borderRadius: '6px', overflow: 'hidden', marginBottom: '1rem' }}>
                <motion.div 
                  animate={{ width: `${(timeLeft / currentMaxTime) * 100}%` }}
                  style={{ height: '100%', background: timeLeft <= (currentMaxTime * 0.5) ? 'var(--error)' : 'var(--accent)' }}
                  transition={{ duration: 1, ease: 'linear' }}
                />
              </div>

              {currentSpell && fakeSpell && (
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <h3 className="spell-text" style={{ zIndex: 10, fontSize: '1.6rem', marginBottom: '0.5rem' }}>
                    {turnState === 'player_attack' ? `공격 마법: ${currentSpell.meaning}` : `방패 마법: ${currentSpell.meaning}`}
                  </h3>

                  <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center' }}>
                    
                    {illusionOrder === 1 && (
                      <div className="wizard-hanja-wrapper" style={{ position: 'relative', pointerEvents: dialogue ? 'none' : 'auto', opacity: dialogue ? 0.5 : 1 }}>
                        <HanjaPad 
                          key={`fake-${turnState}-${fakeSpell.char}-${monsterHp}-${playerHp}`}
                          character={fakeSpell.char} 
                          onComplete={() => takeDamage('환영에 속아 가짜 마법을 건드렸다!')} 
                          onMistake={() => {}}
                          hideHint={true}
                          faintOutline={true}
                          showOutline={true}
                        />
                      </div>
                    )}

                    <div className="wizard-hanja-wrapper" style={{ position: 'relative', pointerEvents: dialogue ? 'none' : 'auto', opacity: dialogue ? 0.5 : 1 }}>
                      <HanjaPad 
                        key={`real-${turnState}-${currentSpell.char}-${monsterHp}-${playerHp}`}
                        character={currentSpell.char} 
                        onComplete={handleComplete} 
                        onMistake={() => {}}
                        hideHint={true}
                        faintOutline={true}
                        showOutline={true}
                      />
                    </div>
                    
                    {illusionOrder === 0 && (
                      <div className="wizard-hanja-wrapper" style={{ position: 'relative', pointerEvents: dialogue ? 'none' : 'auto', opacity: dialogue ? 0.5 : 1 }}>
                        <HanjaPad 
                          key={`fake-${turnState}-${fakeSpell.char}-${monsterHp}-${playerHp}`}
                          character={fakeSpell.char} 
                          onComplete={() => takeDamage('환영에 속아 가짜 마법을 건드렸다!')} 
                          onMistake={() => {}}
                          hideHint={true}
                          faintOutline={true}
                          showOutline={true}
                        />
                      </div>
                    )}

                  </div>
                </div>
              )}
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}
