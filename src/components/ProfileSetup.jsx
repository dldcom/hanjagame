import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import '../index.css';

function ProfileSetup({ onComplete, showAlert }) {
  const [school, setSchool] = useState('');
  const [grade, setGrade] = useState('');
  const [className, setClassName] = useState('');
  const [studentNumber, setStudentNumber] = useState('');
  const [loading, setLoading] = useState(false);
  
  // New states for step-by-step logic
  const [step, setStep] = useState(1); // 1: Input, 2: Action (Login/Signup)
  const [existingPlayer, setExistingPlayer] = useState(null);

  const resetStep = () => {
    if (step === 2) setStep(1);
  };

  const handleCheck = async (e) => {
    e.preventDefault();
    if (!school || !grade || !className || !studentNumber) {
      showAlert('모든 정보를 입력해주세요!');
      return;
    }

    setLoading(true);
    try {
      const { data: existingPlayers, error: searchError } = await supabase
        .from('players')
        .select('*')
        .eq('school_name', school + '초등학교')
        .eq('grade', parseInt(grade))
        .eq('class_name', className + '반')
        .eq('student_number', parseInt(studentNumber))
        .order('created_at', { ascending: false })
        .limit(1);

      if (searchError) throw searchError;

      if (existingPlayers && existingPlayers.length > 0) {
        setExistingPlayer(existingPlayers[0]);
      } else {
        setExistingPlayer(null);
      }
      setStep(2);
    } catch (error) {
      console.error('Error checking profile:', error);
      showAlert('계정 확인 중 오류: ' + (error.message || JSON.stringify(error)));
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    if (existingPlayer) {
      localStorage.setItem('playerId', existingPlayer.id);
      localStorage.setItem('playerProfile', JSON.stringify({
        school_name: existingPlayer.school_name,
        grade: existingPlayer.grade,
        class_name: existingPlayer.class_name,
        student_number: existingPlayer.student_number
      }));
      onComplete(existingPlayer.id);
    }
  };

  const handleSignup = async () => {
    setLoading(true);
    try {
      const { data: insertData, error: insertError } = await supabase
        .from('players')
        .insert([
          { 
            school_name: school + '초등학교', 
            grade: parseInt(grade), 
            class_name: className + '반', 
            student_number: parseInt(studentNumber),
            exp: 0,
            level: 1,
            progress_data: {}
          }
        ])
        .select();

      if (insertError) throw insertError;
      
      if (insertData && insertData.length > 0) {
        const targetPlayer = insertData[0];
        localStorage.setItem('playerId', targetPlayer.id);
        localStorage.setItem('playerProfile', JSON.stringify({
          school_name: targetPlayer.school_name,
          grade: targetPlayer.grade,
          class_name: targetPlayer.class_name,
          student_number: targetPlayer.student_number
        }));
        onComplete(targetPlayer.id);
      }
    } catch (error) {
      console.error('Error creating profile:', error);
      showAlert('회원가입 중 오류: ' + (error.message || JSON.stringify(error)));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100dvh', padding: '20px' }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}>
        <h2 style={{ textAlign: 'center', color: 'var(--primary)', marginBottom: '1.5rem' }}>입학 신청서</h2>
        <p style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--text-secondary)' }}>
          한자 마법학교에 오신 것을 환영합니다!<br />소속을 입력해주세요.
        </p>
        
        <form onSubmit={handleCheck} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input 
                type="text" 
                placeholder="예: 서울" 
                value={school}
                onChange={(e) => { setSchool(e.target.value); resetStep(); }}
                style={{ width: '150px', padding: '0.8rem', borderRadius: '8px', border: '2px solid #111', textAlign: 'center', fontSize: '1.1rem' }}
              />
              <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>초등학교</span>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input 
                type="number" 
                placeholder="3" 
                value={grade}
                onChange={(e) => { setGrade(e.target.value); resetStep(); }}
                style={{ width: '60px', padding: '0.8rem', borderRadius: '8px', border: '2px solid #111', textAlign: 'center', fontSize: '1.1rem' }}
              />
              <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>학년</span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input 
                type="number" 
                placeholder="1" 
                value={className}
                onChange={(e) => { setClassName(e.target.value); resetStep(); }}
                style={{ width: '60px', padding: '0.8rem', borderRadius: '8px', border: '2px solid #111', textAlign: 'center', fontSize: '1.1rem' }}
              />
              <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>반</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input 
                type="number" 
                placeholder="15" 
                value={studentNumber}
                onChange={(e) => { setStudentNumber(e.target.value); resetStep(); }}
                style={{ width: '60px', padding: '0.8rem', borderRadius: '8px', border: '2px solid #111', textAlign: 'center', fontSize: '1.1rem' }}
              />
              <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>번</span>
            </div>
          </div>

          {step === 1 && (
            <button 
              type="submit" 
              disabled={loading}
              style={{ marginTop: '1.5rem', width: '100%' }}
            >
              {loading ? '확인 중...' : '계정 확인'}
            </button>
          )}
        </form>

        {step === 2 && existingPlayer && (
          <div style={{ marginTop: '1.5rem', textAlign: 'center', animation: 'popIn 0.3s ease-out' }}>
            <p style={{ color: 'var(--success)', fontWeight: 'bold', marginBottom: '1rem', fontSize: '1.1rem' }}>✅ 기존 계정이 존재합니다!<br/>이어서 플레이할까요?</p>
            <button 
              type="button" 
              onClick={handleLogin} 
              disabled={loading} 
              style={{ width: '100%', background: 'var(--success)', boxShadow: '0 4px 0 #388E3C' }}
            >
              로그인
            </button>
          </div>
        )}

        {step === 2 && !existingPlayer && (
          <div style={{ marginTop: '1.5rem', textAlign: 'center', animation: 'popIn 0.3s ease-out' }}>
            <p style={{ color: 'var(--primary)', fontWeight: 'bold', marginBottom: '1rem', fontSize: '1.1rem' }}>✨ 새로운 학생이군요!<br/>새로 가입하시겠어요?</p>
            <button 
              type="button" 
              onClick={handleSignup} 
              disabled={loading} 
              style={{ width: '100%', background: 'var(--accent)', color: '#4A4E69', boxShadow: '0 4px 0 #E6B800' }}
            >
              {loading ? '가입 중...' : '회원가입'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfileSetup;
