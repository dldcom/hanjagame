import React, { useState, useEffect } from 'react';
import HanjaPad from './components/HanjaPad';
import WizardMode from './components/WizardMode';
import VillageMode from './components/VillageMode';
import ProfileSetup from './components/ProfileSetup';
import Leaderboard from './components/Leaderboard';
import { LEVEL_8_HANJA, LEVEL_7_HANJA } from './data/hanjaData';
import { supabase } from './supabaseClient';
import './index.css';

function App() {
  const [currentMode, setCurrentMode] = useState('menu'); // 'menu', 'practice', 'wizard', 'village', 'leaderboard'
  const [selectedGrade, setSelectedGrade] = useState(null); // 8 or 7
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [currentHanjaIndex, setCurrentHanjaIndex] = useState(0);
  const [alertMessage, setAlertMessage] = useState(null);
  
  const customAlert = (msg) => {
    setAlertMessage(msg);
  };
  
  // Progression States for 8급
  const [maxUnlockedLevel8, setMaxUnlockedLevel8] = useState(() => {
    const old = localStorage.getItem('maxUnlockedLevel');
    if (old) {
      localStorage.setItem('maxUnlockedLevel8', old);
      localStorage.removeItem('maxUnlockedLevel');
      return parseInt(old);
    }
    return parseInt(localStorage.getItem('maxUnlockedLevel8') || '0');
  });
  const [completedHanja8, setCompletedHanja8] = useState(() => {
    const old = localStorage.getItem('completedHanja');
    if (old) {
      localStorage.setItem('completedHanja8', old);
      localStorage.removeItem('completedHanja');
      return JSON.parse(old);
    }
    return JSON.parse(localStorage.getItem('completedHanja8') || '[]');
  });

  // Progression States for 7급
  const [maxUnlockedLevel7, setMaxUnlockedLevel7] = useState(() => parseInt(localStorage.getItem('maxUnlockedLevel7') || '0'));
  const [completedHanja7, setCompletedHanja7] = useState(() => JSON.parse(localStorage.getItem('completedHanja7') || '[]'));

  const [sessionCompleted, setSessionCompleted] = useState([]);

  // Player States
  const [playerId, setPlayerId] = useState(() => localStorage.getItem('playerId'));
  const [currentProfile, setCurrentProfile] = useState(() => {
    const saved = localStorage.getItem('playerProfile');
    return saved ? JSON.parse(saved) : null;
  });
  const [playerExp, setPlayerExp] = useState(0);
  const [playerLevel, setPlayerLevel] = useState(1);

  // Gacha States
  const [practiceCount, setPracticeCount] = useState(() => parseInt(localStorage.getItem('practiceCount') || '0'));
  const [eggPieces, setEggPieces] = useState(() => parseInt(localStorage.getItem('eggPieces') || '0'));
  const [ownedMonsters, setOwnedMonsters] = useState(() => {
    const saved = localStorage.getItem('ownedMonsters');
    return saved ? JSON.parse(saved) : ['water_dragon'];
  });
  const [activeMonsterId, setActiveMonsterId] = useState(() => localStorage.getItem('activeMonsterId') || 'water_dragon');

  // Load from Supabase on startup
  useEffect(() => {
    if (playerId) {
      loadPlayerData();
    }
  }, [playerId]);

  const loadPlayerData = async () => {
    try {
      const { data, error } = await supabase
        .from('players')
        .select('exp, level')
        .eq('id', playerId)
        .single();
      
      if (data) {
        setPlayerExp(data.exp || 0);
        setPlayerLevel(data.level || 1);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const updateSupabaseExp = async (newExp, newLevel) => {
    if (playerId) {
      try {
        await supabase
          .from('players')
          .update({ exp: newExp, level: newLevel })
          .eq('id', playerId);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const gainExp = (amount) => {
    let newExp = playerExp + amount;
    let newLevel = playerLevel;
    let leveledUp = false;

    while (newExp >= newLevel * 10) {
      newExp -= newLevel * 10;
      newLevel += 1;
      leveledUp = true;
    }

    setPlayerExp(newExp);
    setPlayerLevel(newLevel);

    if (leveledUp) {
      setTimeout(() => customAlert(`🎉 레벨업! Level ${newLevel}이(가) 되었습니다! 🎉`), 500);
    }
  };

  useEffect(() => {
    localStorage.setItem('practiceCount', practiceCount);
    localStorage.setItem('eggPieces', eggPieces);
    localStorage.setItem('ownedMonsters', JSON.stringify(ownedMonsters));
    localStorage.setItem('activeMonsterId', activeMonsterId);
  }, [practiceCount, eggPieces, ownedMonsters, activeMonsterId]);

  const handleModeChange = (newMode) => {
    if (newMode === 'menu' || newMode === 'leaderboard') {
      updateSupabaseExp(playerExp, playerLevel);
    }
    if (newMode === 'menu') {
      setSelectedDifficulty(null);
      setSelectedGrade(null);
    }
    setCurrentMode(newMode);
  };

  const activeHanjaList = selectedGrade === 7 ? LEVEL_7_HANJA : LEVEL_8_HANJA;
  const currentHanja = activeHanjaList[currentHanjaIndex];

  const itemsPerLevel = 10;
  const totalLevels = Math.ceil(activeHanjaList.length / itemsPerLevel);

  const activeMaxUnlocked = selectedGrade === 7 ? maxUnlockedLevel7 : maxUnlockedLevel8;
  const setActiveMaxUnlocked = selectedGrade === 7 ? setMaxUnlockedLevel7 : setMaxUnlockedLevel8;
  const activeMaxUnlockedKey = selectedGrade === 7 ? 'maxUnlockedLevel7' : 'maxUnlockedLevel8';

  const activeCompleted = selectedGrade === 7 ? completedHanja7 : completedHanja8;
  const setActiveCompleted = selectedGrade === 7 ? setCompletedHanja7 : setCompletedHanja8;
  const activeCompletedKey = selectedGrade === 7 ? 'completedHanja7' : 'completedHanja8';

  const nextHanja = () => {
    if (selectedDifficulty === null) return;
    const minIdx = selectedDifficulty * itemsPerLevel;
    const maxIdx = Math.min((selectedDifficulty + 1) * itemsPerLevel, activeHanjaList.length) - 1;
    const levelSize = maxIdx - minIdx + 1;

    if (sessionCompleted.length >= levelSize) {
      if (selectedDifficulty < totalLevels - 1 && activeMaxUnlocked > selectedDifficulty) {
        customAlert('🎉 해당 난이도를 모두 완료하였습니다!\n다음 난이도가 열려있습니다!');
      } else {
        customAlert('🎉 해당 난이도를 모두 완료하였습니다!');
      }
      setSelectedDifficulty(null);
      return;
    }

    setCurrentHanjaIndex((prev) => (prev >= maxIdx ? minIdx : prev + 1));
  };

  const prevHanja = () => {
    if (selectedDifficulty === null) return;
    const minIdx = selectedDifficulty * itemsPerLevel;
    setCurrentHanjaIndex((prev) => (prev <= minIdx ? minIdx : prev - 1));
  };

  const handleComplete = () => {
    gainExp(1); // 한자 쓰면 +1 EXP

    const newCount = practiceCount + 1;
    if (newCount >= 10) {
      setPracticeCount(0);
      setEggPieces(prev => prev + 1);
      customAlert('축하합니다! 몬스터 알 조각 1개를 획득했어요!');
    } else {
      setPracticeCount(newCount);
    }

    if (selectedDifficulty === null) return;
    const minIdx = selectedDifficulty * itemsPerLevel;
    const maxIdx = Math.min((selectedDifficulty + 1) * itemsPerLevel, activeHanjaList.length) - 1;
    const levelSize = maxIdx - minIdx + 1;

    // Session progression
    const newSession = sessionCompleted.includes(currentHanjaIndex) ? sessionCompleted : [...sessionCompleted, currentHanjaIndex];
    setSessionCompleted(newSession);

    // Global progression
    if (!activeCompleted.includes(currentHanjaIndex)) {
      const newCompleted = [...activeCompleted, currentHanjaIndex];
      setActiveCompleted(newCompleted);
      localStorage.setItem(activeCompletedKey, JSON.stringify(newCompleted));

      let allCleared = true;
      for (let i = minIdx; i <= maxIdx; i++) {
        if (!newCompleted.includes(i)) {
          allCleared = false;
          break;
        }
      }
      
      if (allCleared && selectedDifficulty >= activeMaxUnlocked) {
        const nextLevel = selectedDifficulty + 1;
        setActiveMaxUnlocked(nextLevel);
        localStorage.setItem(activeMaxUnlockedKey, nextLevel.toString());
      }
    }
  };

  const handleBattleWin = () => {
    setEggPieces(prev => prev + 3);
    gainExp(10); // 배틀 이기면 +10 EXP
  };

  if (!playerId) {
    return <ProfileSetup onComplete={(id) => {
      setPlayerId(id);
      const profile = JSON.parse(localStorage.getItem('playerProfile'));
      setCurrentProfile(profile);
    }} />;
  }

  return (
    <div className="app-container">
      {/* Top Profile Bar */}
      {currentMode !== 'leaderboard' && currentProfile && (
        <div style={{ position: 'absolute', top: '10px', right: '20px', display: 'flex', gap: '1rem', alignItems: 'center', background: 'rgba(255,255,255,0.8)', padding: '0.5rem 1rem', borderRadius: '12px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              {currentProfile.school_name} {currentProfile.grade}학년 {currentProfile.class_name} {currentProfile.student_number}번
            </div>
            <div style={{ fontWeight: 'bold', color: 'var(--primary)' }}>
              Lv.{playerLevel} <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 'normal' }}>({playerExp}/{playerLevel * 10} EXP)</span>
            </div>
          </div>
        </div>
      )}

      {currentMode === 'menu' && (
        <div style={{ textAlign: 'center', marginTop: '5vh', width: '100%', maxWidth: '600px', boxSizing: 'border-box' }}>
          <h1 className="main-title">
            한자 마법사 & 마을
          </h1>
          <p className="main-subtitle">
            재미있게 한자를 그려보아요!
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center', width: '100%', boxSizing: 'border-box' }}>
            <button onClick={() => handleModeChange('practice')} className="menu-btn">
              ✍️ 기본 연습장
            </button>
            <button onClick={() => handleModeChange('wizard')} className="menu-btn" style={{ background: 'var(--accent)', color: '#4A4E69', boxShadow: '0 4px 0 #E6B800' }}>
              🧙‍♂️ 꼬마 마법사 RPG
            </button>
            <button onClick={() => handleModeChange('village')} className="menu-btn" style={{ background: 'var(--success)', color: 'white', boxShadow: '0 4px 0 #4CAF50' }}>
              🏡 한자 마을 (알 부화)
            </button>
            <button onClick={() => handleModeChange('leaderboard')} className="menu-btn-small" style={{ background: '#ccc', color: '#333', boxShadow: '0 4px 0 #999', marginTop: '0.5rem' }}>
              🏆 명예의 전당 (랭킹)
            </button>
          </div>
        </div>
      )}

      {currentMode === 'practice' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '600px' }}>
          <header className="practice-header">
            <button className="secondary practice-back-btn" onClick={() => {
              if (selectedDifficulty !== null) setSelectedDifficulty(null);
              else if (selectedGrade !== null) setSelectedGrade(null);
              else handleModeChange('menu');
            }}>
              <span className="back-btn-text-full">← {selectedDifficulty !== null ? '난이도 선택' : selectedGrade !== null ? '급수 선택' : '메인으로'}</span>
              <span className="back-btn-text-short">← 이전</span>
            </button>
            <h1 className="practice-title">한자 쓰기 연습</h1>
            <div className="card practice-info-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 'auto' }}>
              <div className="info-card-full" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ fontWeight: 'bold' }}>알 조각: {eggPieces}개</span>
                <span style={{ fontSize: '0.9rem' }}>진척도: {practiceCount}/10</span>
              </div>
              <div className="info-card-short">
                🥚 {eggPieces}개 | 📈 {practiceCount}/10
              </div>
            </div>
          </header>

          {selectedGrade === null ? (
            <div className="card" style={{ width: '100%', padding: '2rem' }}>
              <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--text-main)' }}>급수를 선택하세요</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <button 
                  onClick={() => setSelectedGrade(8)}
                  className="grade-select-btn"
                  style={{ background: 'var(--primary)', color: 'white' }}
                >
                  초보 마법사 (8급 50자)
                </button>
                <button 
                  onClick={() => {
                     if (maxUnlockedLevel8 < 5) {
                        customAlert('8급의 모든 난이도(1~5)를 다 깨야 7급에 진입할 수 있습니다!');
                     } else {
                        setSelectedGrade(7);
                     }
                  }}
                  className="grade-select-btn"
                  style={{ 
                    background: maxUnlockedLevel8 >= 5 ? 'var(--accent)' : '#e0e0e0',
                    color: maxUnlockedLevel8 >= 5 ? '#4A4E69' : '#999',
                    cursor: maxUnlockedLevel8 >= 5 ? 'pointer' : 'not-allowed'
                  }}
                >
                  {maxUnlockedLevel8 >= 5 ? '견습 마법사 (7급 100자)' : '🔒 견습 마법사 (8급 클리어 시 해금)'}
                </button>
              </div>
            </div>
          ) : selectedDifficulty === null ? (
            <div className="card" style={{ width: '100%', padding: '2rem' }}>
              <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--text-main)' }}>{selectedGrade}급 난이도를 선택하세요</h2>
              <div className="difficulty-grid">
                {Array.from({ length: totalLevels }).map((_, i) => {
                  const minIdx = i * itemsPerLevel;
                  const maxIdx = Math.min((i + 1) * itemsPerLevel, activeHanjaList.length) - 1;
                  const isLocked = i > activeMaxUnlocked;
                  return (
                    <button 
                      key={i} 
                      onClick={() => {
                        if (!isLocked) {
                          setSelectedDifficulty(i);
                          setCurrentHanjaIndex(minIdx);
                          setSessionCompleted([]);
                        }
                      }}
                      disabled={isLocked}
                      className="difficulty-btn"
                      style={{ 
                        opacity: isLocked ? 0.5 : 1,
                        cursor: isLocked ? 'not-allowed' : 'pointer',
                        background: isLocked ? '#e0e0e0' : undefined
                      }}
                    >
                      <span style={{ fontWeight: 'bold' }}>
                        {isLocked ? '🔒 난이도 ' + (i + 1) : '난이도 ' + (i + 1)}
                      </span>
                      <span style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.5rem' }}>
                        ({minIdx + 1} ~ {maxIdx + 1}번째)
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <main className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', gap: '0.5rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                  {currentHanjaIndex > selectedDifficulty * itemsPerLevel ? (
                    <button className="secondary" onClick={prevHanja} style={{ padding: '6px 16px', fontSize: '1.1rem' }}>이전</button>
                  ) : (
                    <div style={{ width: '60px' }} />
                  )}
                  <div style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: 'bold', background: '#f0f0f0', display: 'inline-block', padding: '0.2rem 0.8rem', borderRadius: '12px' }}>
                    진행도: {(currentHanjaIndex % itemsPerLevel) + 1} / {itemsPerLevel}
                  </div>
                  <div style={{ width: '60px' }} />
                </div>
                <h2 className="spell-text" style={{ fontSize: '2rem', margin: 0, textAlign: 'center' }}>{currentHanja.meaning}</h2>
              </div>

              <HanjaPad 
                key={currentHanja.char} 
                character={currentHanja.char} 
                meaning={currentHanja.meaning}
                onComplete={handleComplete} 
                onNext={nextHanja}
                autoAnimate={true}
              />
            </main>
          )}
        </div>
      )}

      {currentMode === 'wizard' && (
        <WizardMode 
          onBack={() => handleModeChange('menu')} 
          activeMonsterId={activeMonsterId}
          onBattleWin={handleBattleWin}
          maxUnlockedLevel8={maxUnlockedLevel8}
        />
      )}
      
      {currentMode === 'village' && (
        <VillageMode 
          onBack={() => handleModeChange('menu')}
          eggPieces={eggPieces}
          setEggPieces={setEggPieces}
          ownedMonsters={ownedMonsters}
          setOwnedMonsters={setOwnedMonsters}
          activeMonsterId={activeMonsterId}
          setActiveMonsterId={setActiveMonsterId}
        />
      )}

      {currentMode === 'leaderboard' && (
        <Leaderboard 
          onBack={() => handleModeChange('menu')}
          currentProfile={currentProfile}
        />
      )}

      {/* Custom Alert Modal */}
      {alertMessage && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
          justifyContent: 'center', alignItems: 'center', zIndex: 9999,
          backdropFilter: 'blur(2px)'
        }}>
          <div className="card" style={{ 
            padding: '2.5rem', 
            textAlign: 'center', 
            maxWidth: '400px', 
            animation: 'popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
          }}>
            <h3 style={{ marginBottom: '1.5rem', whiteSpace: 'pre-line', lineHeight: '1.5', fontSize: '1.3rem', color: 'var(--text-main)' }}>
              {alertMessage}
            </h3>
            <button 
              onClick={() => setAlertMessage(null)} 
              style={{ 
                padding: '0.8rem 2.5rem', 
                background: 'var(--primary)', 
                color: 'white', 
                fontSize: '1.2rem', 
                borderRadius: '12px',
                fontWeight: 'bold',
                boxShadow: '0 4px 10px rgba(255, 107, 107, 0.3)'
              }}
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
