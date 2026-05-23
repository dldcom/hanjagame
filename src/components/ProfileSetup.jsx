import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import '../index.css';

function ProfileSetup({ onComplete }) {
  const [school, setSchool] = useState('');
  const [grade, setGrade] = useState('');
  const [className, setClassName] = useState('');
  const [studentNumber, setStudentNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!school || !grade || !className || !studentNumber) {
      alert('모든 정보를 입력해주세요!');
      return;
    }

    setLoading(true);
    try {
      // 1. Insert into Supabase
      const { data, error } = await supabase
        .from('players')
        .insert([
          { 
            school_name: school + '초등학교', 
            grade: parseInt(grade), 
            class_name: className + '반', 
            student_number: parseInt(studentNumber),
            exp: 0,
            level: 1
          }
        ])
        .select();

      if (error) throw error;

      if (data && data.length > 0) {
        const newPlayer = data[0];
        // 2. Save to localStorage
        localStorage.setItem('playerId', newPlayer.id);
        localStorage.setItem('playerProfile', JSON.stringify({
          school_name: newPlayer.school_name,
          grade: newPlayer.grade,
          class_name: newPlayer.class_name,
          student_number: newPlayer.student_number
        }));
        
        onComplete(newPlayer.id);
      }
    } catch (error) {
      console.error('Error creating profile:', error);
      alert('프로필 생성 중 오류: ' + (error.message || JSON.stringify(error)));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '20px' }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}>
        <h2 style={{ textAlign: 'center', color: 'var(--primary)', marginBottom: '1.5rem' }}>입학 신청서</h2>
        <p style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--text-secondary)' }}>
          한자 마법학교에 오신 것을 환영합니다!<br />소속을 입력해주세요.
        </p>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input 
                type="text" 
                placeholder="예: 서울" 
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                style={{ width: '150px', padding: '0.8rem', borderRadius: '8px', border: '2px solid var(--primary-light)', textAlign: 'center', fontSize: '1.1rem' }}
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
                onChange={(e) => setGrade(e.target.value)}
                style={{ width: '60px', padding: '0.8rem', borderRadius: '8px', border: '2px solid var(--primary-light)', textAlign: 'center', fontSize: '1.1rem' }}
              />
              <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>학년</span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input 
                type="number" 
                placeholder="1" 
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                style={{ width: '60px', padding: '0.8rem', borderRadius: '8px', border: '2px solid var(--primary-light)', textAlign: 'center', fontSize: '1.1rem' }}
              />
              <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>반</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input 
                type="number" 
                placeholder="15" 
                value={studentNumber}
                onChange={(e) => setStudentNumber(e.target.value)}
                style={{ width: '60px', padding: '0.8rem', borderRadius: '8px', border: '2px solid var(--primary-light)', textAlign: 'center', fontSize: '1.1rem' }}
              />
              <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>번</span>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              marginTop: '1.5rem', 
              padding: '1rem', 
              fontSize: '1.2rem', 
              background: loading ? 'gray' : 'var(--primary)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
              boxShadow: loading ? 'none' : '0 4px 0 var(--secondary)'
            }}
          >
            {loading ? '등록 중...' : '입학하기'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ProfileSetup;
