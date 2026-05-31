import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import '../index.css';

function Leaderboard({ onBack, currentProfile }) {
  const [filter, setFilter] = useState('class'); // 'class', 'school', 'all'
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRankings();
  }, [filter]);

  const fetchRankings = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('players')
        .select('*')
        .order('level', { ascending: false })
        .order('exp', { ascending: false })
        .limit(50);

      if (filter === 'class' && currentProfile) {
        query = query
          .eq('school_name', currentProfile.school_name)
          .eq('grade', currentProfile.grade)
          .eq('class_name', currentProfile.class_name);
      } else if (filter === 'school' && currentProfile) {
        query = query.eq('school_name', currentProfile.school_name);
      }

      const { data, error } = await query;

      if (error) throw error;
      setRankings(data || []);
    } catch (error) {
      console.error('Error fetching rankings:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', marginBottom: '2rem' }}>
        <button className="secondary" onClick={onBack}>← 메인으로</button>
        <h1 style={{ fontSize: '2.5rem', color: 'var(--primary)', margin: 0 }}>🏆 명예의 전당</h1>
        <div style={{ width: '80px' }}></div> {/* Spacer */}
      </header>

      <div className="card" style={{ width: '100%', padding: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <button 
            className={filter === 'class' ? '' : 'secondary'} 
            onClick={() => setFilter('class')}
            style={{ flex: 1, padding: '0.5rem' }}
          >
            우리 반
          </button>
          <button 
            className={filter === 'school' ? '' : 'secondary'} 
            onClick={() => setFilter('school')}
            style={{ flex: 1, padding: '0.5rem' }}
          >
            우리 학교
          </button>
        </div>

        {loading ? (
          <p style={{ textAlign: 'center', padding: '2rem' }}>랭킹을 불러오는 중...</p>
        ) : rankings.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>아직 기록이 없습니다.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {rankings.map((player, index) => (
              <div 
                key={player.id} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  padding: '1rem', 
                  background: index < 3 ? 'var(--primary-light)' : '#f5f5f5',
                  borderRadius: '8px',
                  fontWeight: index < 3 ? 'bold' : 'normal',
                  border: index === 0 ? '2px solid gold' : index === 1 ? '2px solid silver' : index === 2 ? '2px solid #cd7f32' : 'none'
                }}
              >
                <div style={{ width: '40px', fontSize: '1.2rem', textAlign: 'center', marginRight: '1rem' }}>
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}위`}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    {player.school_name} {player.grade}학년 {player.class_name}
                  </div>
                  <div style={{ fontSize: '1.1rem' }}>
                    {player.student_number}번 학생
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '1.2rem' }}>Lv.{player.level}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{player.exp} EXP</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Leaderboard;
