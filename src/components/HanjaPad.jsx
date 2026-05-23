import React, { useEffect, useRef, useState } from 'react';
import HanziWriter from 'hanzi-writer';

export default function HanjaPad({ character, meaning, onComplete, onMistake, onNext, hideHint, autoAnimate, faintOutline, showOutline = true }) {
  const padRef = useRef(null);
  const writerRef = useRef(null);
  const [status, setStatus] = useState('그려보세요!');
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (!padRef.current) return;

    // Clear any existing SVGs to prevent duplicates from React Strict Mode
    padRef.current.innerHTML = '';
    setIsCompleted(false);

    // Measure initial width of container
    const initialWidth = padRef.current.clientWidth || 400;

    // Initialize HanziWriter
    writerRef.current = HanziWriter.create(padRef.current, character, {
      width: initialWidth,
      height: initialWidth,
      padding: Math.max(10, initialWidth * 0.05),
      strokeAnimationSpeed: 2,
      delayBetweenStrokes: 100,
      showOutline: showOutline,
      strokeColor: '#FF6B6B', // Bright red/coral
      highlightColor: '#FFD700', // Gold
      outlineColor: faintOutline ? 'rgba(200, 200, 200, 0.3)' : '#87CEEB',
      drawingColor: '#2C3E50',
      drawingWidth: 16,
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

    // Set up ResizeObserver to handle zoom, mobile screen sizes, and dynamic layout changes
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const newSize = entry.contentRect.width;
        if (newSize > 0 && writerRef.current) {
          writerRef.current.updateDimensions({
            width: newSize,
            height: newSize,
            padding: Math.max(10, newSize * 0.05)
          });
        }
      }
    });

    resizeObserver.observe(padRef.current);

    return () => {
      resizeObserver.disconnect();
      if (padRef.current) padRef.current.innerHTML = '';
    };
  }, [character, autoAnimate]); // Only recreate when character changes

  useEffect(() => {
    if (!writerRef.current) return;
    if (showOutline) {
      writerRef.current.showOutline();
    } else {
      writerRef.current.hideOutline();
    }
  }, [showOutline]);

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
        setStatus('성공! exp +1 ✨');
        setIsCompleted(true);
        if (onComplete) onComplete(summaryData);
      }
    });
  };

  const handleReplay = () => {
    if (writerRef.current) {
      setStatus('애니메이션으로 획순을 먼저 보세요!');
      writerRef.current.animateCharacter({
        onComplete: startQuiz
      });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', width: '100%' }}>
      {!hideHint && <h2 className="hanja-status-text">{status}</h2>}
      <div className="hanja-pad-wrapper">
        {/* 워터마크처럼 패드 안쪽 상단에 뜻/음 표시 */}
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '0',
          width: '100%',
          textAlign: 'center',
          fontSize: '2rem',
          fontWeight: 'bold',
          color: 'rgba(0, 0, 0, 0.3)', // 너무 진하면 그리기 방해되므로 반투명하게
          pointerEvents: 'none', // 글씨 위에도 그림이 그려지도록
          zIndex: 5
        }}>
          {meaning}
        </div>

        <div 
          ref={padRef} 
          style={{
            width: '100%',
            height: '100%',
            background: 'white',
            borderRadius: '32px',
            boxShadow: '0 10px 30px rgba(255, 154, 158, 0.3)',
            border: '4px solid var(--secondary)',
            cursor: 'crosshair',
            // Prevent scroll while drawing
            touchAction: 'none'
          }}
        ></div>

        {isCompleted && (
          <div 
            onClick={onNext}
            style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'transparent',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            alignItems: 'center',
            paddingBottom: '0.5rem',
            zIndex: 10,
            cursor: 'pointer'
          }}>
            <div style={{ textAlign: 'center', animation: 'popIn 0.3s ease-out' }}>
              <div style={{ fontSize: '2rem', color: 'var(--success)', fontWeight: 'bold', textShadow: '2px 2px 0px white, -2px -2px 0px white, 2px -2px 0px white, -2px 2px 0px white' }}>
                성공!
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.2rem', textShadow: '1px 1px 0px white, -1px -1px 0px white', animation: 'pulse 1.5s infinite' }}>
                (화면을 클릭하면 다음으로 이동)
              </div>
            </div>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: '1rem' }}>
        {!hideHint && (
          <button onClick={handleReplay} className="secondary">
            다시 보기
          </button>
        )}
      </div>
    </div>
  );
}
