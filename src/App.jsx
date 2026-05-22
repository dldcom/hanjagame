import React, { useState } from 'react';
import HanjaPad from './components/HanjaPad';
import WizardMode from './components/WizardMode';
import { LEVEL_8_HANJA } from './data/hanjaData';
import './index.css';

function App() {
  const [currentMode, setCurrentMode] = useState('menu'); // 'menu', 'practice', 'wizard', 'village'
  const [currentHanjaIndex, setCurrentHanjaIndex] = useState(0);

  const currentHanja = LEVEL_8_HANJA[currentHanjaIndex];

  const nextHanja = () => {
    setCurrentHanjaIndex((prev) => (prev + 1) % LEVEL_8_HANJA.length);
  };

  const prevHanja = () => {
    setCurrentHanjaIndex((prev) => (prev - 1 + LEVEL_8_HANJA.length) % LEVEL_8_HANJA.length);
  };

  const handleComplete = () => {
    console.log('완료!');
  };

  return (
    <div className="app-container">
      {currentMode === 'menu' && (
        <div style={{ textAlign: 'center', marginTop: '10vh' }}>
          <h1 style={{ fontSize: '4rem', color: 'var(--primary)', marginBottom: '1rem', textShadow: '2px 2px 0px var(--secondary)' }}>
            한자 마법사 & 마을
          </h1>
          <p style={{ fontSize: '1.5rem', color: 'var(--text-main)', marginBottom: '4rem' }}>
            재미있게 한자를 그려보아요!
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'center' }}>
            <button onClick={() => setCurrentMode('practice')} style={{ fontSize: '2rem', padding: '1rem 4rem' }}>
              ✍️ 기본 연습장
            </button>
            <button onClick={() => setCurrentMode('wizard')} style={{ fontSize: '2rem', padding: '1rem 4rem', background: 'var(--accent)', color: '#4A4E69', boxShadow: '0 4px 0 #E6B800' }}>
              🧙‍♂️ 꼬마 마법사 RPG
            </button>
            <button disabled style={{ fontSize: '2rem', padding: '1rem 4rem', background: '#ccc', boxShadow: 'none', cursor: 'not-allowed' }}>
              🏡 한자 마을 (준비중)
            </button>
          </div>
        </div>
      )}

      {currentMode === 'practice' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '600px' }}>
          <header style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', marginBottom: '2rem' }}>
            <button className="secondary" onClick={() => setCurrentMode('menu')}>← 메인으로</button>
            <h1 style={{ fontSize: '2.5rem', color: 'var(--primary)' }}>한자 쓰기 연습</h1>
            <div style={{ width: '100px' }}></div>
          </header>

          <main className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', marginBottom: '1rem' }}>
              <button className="secondary" onClick={prevHanja}>이전</button>
              <div style={{ textAlign: 'center' }}>
                <h2 style={{ fontSize: '2.5rem', color: 'var(--accent)' }}>{currentHanja.meaning}</h2>
              </div>
              <button className="secondary" onClick={nextHanja}>다음</button>
            </div>

            <HanjaPad 
              key={currentHanja.char} 
              character={currentHanja.char} 
              onComplete={handleComplete} 
              autoAnimate={true}
            />
          </main>
        </div>
      )}

      {currentMode === 'wizard' && (
        <WizardMode onBack={() => setCurrentMode('menu')} />
      )}
    </div>
  );
}

export default App;
