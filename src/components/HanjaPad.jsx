import React, { useEffect, useRef, useState } from 'react';
import HanziWriter from 'hanzi-writer';

export default function HanjaPad({ character, onComplete, onMistake, hideHint, autoAnimate, faintOutline }) {
  const padRef = useRef(null);
  const writerRef = useRef(null);
  const [status, setStatus] = useState('그려보세요!');

  useEffect(() => {
    if (!padRef.current) return;

    // Clear any existing SVGs to prevent duplicates from React Strict Mode
    padRef.current.innerHTML = '';

    // Initialize HanziWriter
    writerRef.current = HanziWriter.create(padRef.current, character, {
      width: 400,
      height: 400,
      padding: 20,
      strokeAnimationSpeed: 2,
      delayBetweenStrokes: 100,
      showOutline: true,
      strokeColor: '#FF9A9E', // Our primary color
      highlightColor: '#FFD23F',
      outlineColor: faintOutline ? '#F4F4F4' : '#FECFEF',
      drawingColor: '#4A4E69',
      drawingWidth: 20,
      showCharacter: false, // Hide initially for quiz
    });

    if (autoAnimate) {
      setStatus('애니메이션으로 획순을 먼저 보세요!');
      writerRef.current.animateCharacter({
        onComplete: startQuiz
      });
    } else {
      startQuiz();
    }

    return () => {
      if (padRef.current) padRef.current.innerHTML = '';
    };
  }, [character, autoAnimate]);

  const startQuiz = () => {
    if (!writerRef.current) return;
    
    setStatus('획순에 맞게 그려보세요!');
    
    writerRef.current.quiz({
      onMistake: (strokeData) => {
        setStatus('앗, 다시 그려볼까요?');
        if (onMistake) onMistake(strokeData);
        // Highlight correct stroke after mistake
        writerRef.current.highlightStroke(strokeData.strokeNum);
      },
      onComplete: (summaryData) => {
        setStatus('참 잘했어요! ✨');
        if (onComplete) onComplete(summaryData);
      }
    });
  };

  const handleAnimate = () => {
    if (writerRef.current) {
      writerRef.current.animateCharacter();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
      {!hideHint && <h2 style={{ color: 'var(--primary)', fontSize: '2rem', height: '2.5rem' }}>{status}</h2>}
      
      <div 
        ref={padRef} 
        style={{
          background: 'white',
          borderRadius: '32px',
          boxShadow: '0 10px 30px rgba(255, 154, 158, 0.3)',
          border: '4px solid var(--secondary)',
          cursor: 'crosshair',
          // Prevent scroll while drawing
          touchAction: 'none'
        }}
      ></div>

      <div style={{ display: 'flex', gap: '1rem' }}>
        {!hideHint && (
          <button onClick={handleAnimate} className="secondary">
            정답 보기 (애니메이션)
          </button>
        )}
        <button onClick={startQuiz}>
          다시 쓰기
        </button>
      </div>
    </div>
  );
}
