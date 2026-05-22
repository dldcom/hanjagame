import React, { useState, useEffect } from 'react';
import HanjaPad from './HanjaPad';
import { LEVEL_8_HANJA } from '../data/hanjaData';
import { motion, AnimatePresence } from 'framer-motion';

const MONSTER = {
  name: '불 도깨비',
  imageUrl: '/fire_monster_bg.png',
  maxHp: 5,
};

const PLAYER_MONSTER = {
  name: '물 드래곤',
  imageUrl: '/player_monster_bg.png',
};

const getRandomSpell = () => LEVEL_8_HANJA[Math.floor(Math.random() * LEVEL_8_HANJA.length)];

export default function WizardMode({ onBack }) {
  const [playerHp, setPlayerHp] = useState(5);
  const [monsterHp, setMonsterHp] = useState(MONSTER.maxHp);
  const [turnState, setTurnState] = useState('player_attack'); // 'player_attack', 'monster_attack', 'end'
  
  const [currentSpell, setCurrentSpell] = useState(getRandomSpell()); 
  const [dialogue, setDialogue] = useState('야생의 불 도깨비가 나타났다!'); // Text in the dialogue box
  const [dialogueQueue, setDialogueQueue] = useState([]); // Queue of dialogues to show
  const [activeEffect, setActiveEffect] = useState(null); // { type: 'slash', target: 'monster' | 'player' }
  
  const [currentMaxTime, setCurrentMaxTime] = useState(8);
  const [timeLeft, setTimeLeft] = useState(8);

  const enqueueDialogue = (text, onFinished = null) => {
    setDialogueQueue(prev => [...prev, { text, onFinished }]);
  };

  useEffect(() => {
    if (!dialogue && dialogueQueue.length > 0) {
      const next = dialogueQueue[0];
      setDialogue(next.text);
    }
  }, [dialogue, dialogueQueue]);

  useEffect(() => {
    if (turnState !== 'end' && !dialogue && dialogueQueue.length === 0) {
      if (timeLeft <= 0) {
        takeDamage();
        return;
      }
      const timerId = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timerId);
    }
  }, [turnState, dialogue, dialogueQueue, timeLeft]);

  const handleDialogueClick = () => {
    if (!dialogue) return;
    const current = dialogueQueue[0];
    
    // Clear current dialogue
    setDialogue(null);
    setDialogueQueue(prev => prev.slice(1));
    
    // Execute callback if any
    if (current && current.onFinished) {
      current.onFinished();
    }
  };

  const handleComplete = () => {
    if (turnState === 'player_attack') {
      setActiveEffect({ type: currentSpell.effectType, target: 'monster' });
      setTimeout(() => setActiveEffect(null), 1000);
      enqueueDialogue(`[${currentSpell.meaning}] ${currentSpell.spell} 성공!`);
      enqueueDialogue('불 도깨비에게 데미지를 입혔다!', () => {
        setMonsterHp(prev => Math.max(0, prev - 1));
        if (monsterHp - 1 <= 0) {
          enqueueDialogue('불 도깨비를 물리쳤다!', () => setTurnState('end'));
        } else {
          const nextSpell = getRandomSpell();
          setCurrentSpell(nextSpell);
          const nextTime = Math.max(3, currentMaxTime - 0.5); // 턴이 지날수록 0.5초씩 감소 (최소 3초)
          setCurrentMaxTime(nextTime);
          setTimeLeft(nextTime);
          enqueueDialogue(`불 도깨비가 [${nextSpell.meaning}] 공격을 시도한다! 방어하자!`, () => {
             setTurnState('monster_attack');
          });
        }
      });
    } else if (turnState === 'monster_attack') {
      setActiveEffect({ type: currentSpell.effectType, target: 'player' });
      setTimeout(() => setActiveEffect(null), 1000);
      enqueueDialogue(`[${currentSpell.meaning}] ${currentSpell.spell} 방어 성공!`);
      enqueueDialogue('불 도깨비의 공격을 완벽하게 막아냈다!', () => {
        const nextSpell = getRandomSpell();
        setCurrentSpell(nextSpell);
        const nextTime = Math.max(3, currentMaxTime - 0.5);
        setCurrentMaxTime(nextTime);
        setTimeLeft(nextTime);
        enqueueDialogue(`내 턴이다! 제한시간이 짧아진다! [${nextSpell.meaning}] 공격을 준비하자!`, () => {
          setTurnState('player_attack');
        });
      });
    }
  };

  const handleMistake = () => {};

  const takeDamage = () => {
    enqueueDialogue('앗! 시간 초과! 마법 시전에 실패했다!');
    enqueueDialogue('마법사가 데미지를 입었다!', () => {
      setPlayerHp(prev => Math.max(0, prev - 1));
      if (playerHp - 1 <= 0) {
        enqueueDialogue('눈앞이 깜깜해졌다...', () => setTurnState('end'));
      } else {
        const nextSpell = getRandomSpell();
        setCurrentSpell(nextSpell);
        const nextTime = Math.max(3, currentMaxTime - 0.5);
        setCurrentMaxTime(nextTime);
        setTimeLeft(nextTime);
        enqueueDialogue(`다시 [${nextSpell.meaning}] 마법을 준비하자! 서둘러야 해!`, () => {
          setTurnState('player_attack');
        });
      }
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', maxWidth: '1000px', margin: '0 auto', height: '90vh' }}>
      <button className="secondary" onClick={onBack} style={{ alignSelf: 'flex-start', marginBottom: '1rem', zIndex: 10 }}>
        ← 도망치기
      </button>

      {turnState === 'end' && (
        <div className="card" style={{ textAlign: 'center', padding: '4rem', marginTop: '10vh' }}>
          <h1 style={{ fontSize: '3rem' }}>{playerHp > 0 ? '🎉 승리했습니다!' : '😭 패배...'}</h1>
          <button style={{ marginTop: '2rem' }} onClick={onBack}>마을로 돌아가기</button>
        </div>
      )}

      {turnState !== 'end' && (
        <div style={{ 
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          background: 'linear-gradient(to bottom, #e0f7fa 0%, #b2ebf2 100%)',
          borderRadius: '32px',
          boxShadow: 'inset 0 0 50px rgba(255,255,255,0.5)',
          overflow: 'hidden',
          position: 'relative'
        }}>
          
          {/* Battle Arena Area */}
          <div className="wizard-battle-area">
            
            {/* Top Left: Enemy Status */}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
              <div className="card" style={{ padding: '1rem 2rem', border: '4px solid #FFD23F', background: 'white', borderRadius: '24px 24px 24px 0', width: '90%' }}>
                <h2 style={{ margin: 0, color: 'var(--text-main)' }}>{MONSTER.name}</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
                  <span style={{ fontWeight: 'bold' }}>HP</span>
                  <div style={{ flex: 1, height: '16px', background: '#eee', borderRadius: '8px', overflow: 'hidden' }}>
                    <motion.div animate={{ width: `${(monsterHp / MONSTER.maxHp) * 100}%` }} style={{ height: '100%', background: 'var(--error)' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Top Right: Enemy Monster Image */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', position: 'relative' }}>
              <motion.img 
                src={MONSTER.imageUrl} 
                alt={MONSTER.name}
                animate={{ y: [0, -15, 0] }}
                transition={{ y: { repeat: Infinity, duration: 2, ease: "easeInOut" } }}
                className="wizard-monster-img"
              />
              <AnimatePresence>
                {activeEffect && activeEffect.target === 'monster' && (
                  <motion.img 
                    src={`/effect_${activeEffect.type}.png`}
                    initial={{ scale: 0.5, opacity: 0, rotate: -30 }}
                    animate={{ scale: 1.5, opacity: 1, rotate: 0 }}
                    exit={{ scale: 2, opacity: 0 }}
                    transition={{ duration: 0.5, type: 'spring' }}
                    style={{ position: 'absolute', top: '20%', zIndex: 20, width: '250px', height: '250px', objectFit: 'contain', pointerEvents: 'none' }}
                  />
                )}
              </AnimatePresence>
            </div>

            {/* Bottom Left: Player Monster Image & Status */}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', position: 'relative' }}>
              <div className="card" style={{ padding: '1rem 2rem', border: '4px solid var(--primary)', background: 'white', borderRadius: '24px', marginBottom: '-40px', zIndex: 10, width: '90%' }}>
                <h2 style={{ margin: 0, color: 'var(--primary)' }}>{PLAYER_MONSTER.name}</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
                  <span style={{ fontWeight: 'bold' }}>HP</span>
                  <div style={{ display: 'flex', gap: '5px', fontSize: '1.5rem' }}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i}>{i < playerHp ? '❤️' : '🖤'}</span>
                    ))}
                  </div>
                </div>
              </div>

               <motion.img 
                src={PLAYER_MONSTER.imageUrl} 
                alt={PLAYER_MONSTER.name}
                animate={{ y: [0, 10, 0] }}
                transition={{ y: { repeat: Infinity, duration: 2.5, ease: "easeInOut" } }}
                className="wizard-player-img" style={{ zIndex: 2 }}
              />
              <AnimatePresence>
                {activeEffect && activeEffect.target === 'player' && (
                  <motion.img 
                    src={`/effect_${activeEffect.type}.png`}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1.5, opacity: 1 }}
                    exit={{ scale: 2, opacity: 0 }}
                    transition={{ duration: 0.5, type: 'spring' }}
                    style={{ position: 'absolute', top: '25%', zIndex: 20, width: '250px', height: '250px', objectFit: 'contain', pointerEvents: 'none' }}
                  />
                )}
              </AnimatePresence>
            </div>

            {/* Bottom Right: Hanja Pad Input & Timer */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start' }}>
              
              {/* Timer Bar */}
              <div style={{ width: '80%', height: '12px', background: '#ccc', borderRadius: '6px', overflow: 'hidden', marginBottom: '1rem', marginTop: '-1rem' }}>
                <motion.div 
                  animate={{ width: `${(timeLeft / currentMaxTime) * 100}%` }}
                  style={{ height: '100%', background: timeLeft <= (currentMaxTime * 0.5) ? 'var(--error)' : 'var(--accent)' }}
                  transition={{ duration: 1, ease: 'linear' }}
                />
              </div>

              <h3 style={{ color: 'var(--text-main)', fontSize: '2.5rem', margin: '0 0 0.5rem 0', textShadow: '2px 2px 0px white', zIndex: 10 }}>
                {currentSpell.meaning}
              </h3>
              <div className="wizard-hanja-wrapper" style={{ pointerEvents: dialogue ? 'none' : 'auto', opacity: dialogue ? 0.5 : 1 }}>
                <HanjaPad 
                  key={`${turnState}-${currentSpell.char}-${monsterHp}-${playerHp}`}
                  character={currentSpell.char} 
                  onComplete={handleComplete} 
                  onMistake={handleMistake}
                  hideHint={true}
                  faintOutline={true}
                />
              </div>
            </div>

          </div>

          {/* Dialogue Box (Pokemon Style) */}
          <AnimatePresence>
            {dialogue && (
              <div 
                onClick={handleDialogueClick}
                style={{
                  position: 'absolute', top: 0, bottom: 0, left: 0, right: 0,
                  zIndex: 100, cursor: 'pointer'
                }}
              >
                <motion.div 
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 100, opacity: 0 }}
                  style={{ 
                    position: 'absolute', bottom: '0', left: '0', right: '0',
                    background: 'rgba(0, 0, 0, 0.8)', color: 'white',
                    padding: '2rem 3rem', borderTop: '6px solid var(--primary)',
                    fontSize: '2rem',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                  }}
                >
                  <span>{dialogue}</span>
                  <span style={{ fontSize: '1.5rem', animation: 'pulse 1s infinite' }}>▶ 아무데나 터치</span>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
          
        </div>
      )}
    </div>
  );
}
