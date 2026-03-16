import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { directorsApi } from '../../api/directors.api';
import ProgramCard from '../../components/public/ProgramCard';
import type { Program, Director } from '../../types';

export default function DirectorProgramsPage() {
  const { id } = useParams<{ id: string }>();
  const [director, setDirector] = useState<Director | null>(null);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      directorsApi.getOne(Number(id)),
      directorsApi.getPrograms(Number(id)),
    ]).then(([dRes, pRes]) => {
      setDirector(dRes.data);
      setPrograms(pRes.data);
    }).finally(() => setLoading(false));
  }, [id]);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--white)' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, var(--black) 0%, #1a0000 100%)',
        padding: '60px 5% 80px',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, fontSize: 13 }}>
            <Link to="/" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>Trang chủ</Link>
            <span style={{ color: 'rgba(255,255,255,0.3)' }}>›</span>
            <span style={{ color: 'rgba(255,255,255,0.5)' }}>Đạo diễn</span>
            <span style={{ color: 'rgba(255,255,255,0.3)' }}>›</span>
            <span style={{ color: '#fff' }}>{director?.name}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{
              width: 72, height: 72, background: 'var(--primary)',
              borderRadius: '50%', display: 'flex', alignItems: 'center',
              justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 28,
              flexShrink: 0,
            }}>
              {director?.name?.[0] ?? '?'}
            </div>
            <div>
              <p style={{ color: 'var(--primary)', fontWeight: 600, fontSize: 13, letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 6px' }}>
                Đạo diễn
              </p>
              <h1 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 800, color: '#fff', margin: '0 0 8px', letterSpacing: '-1px' }}>
                {loading ? '...' : director?.name}
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.5)', margin: 0, fontSize: 15 }}>
                {programs.length} chương trình
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Programs Grid */}
      <div style={{ maxWidth: 1200, margin: '-40px auto 0', padding: '0 5% 80px' }}>
        <div style={{
          background: 'var(--white)', borderRadius: 'var(--radius-lg)',
          padding: '32px', boxShadow: 'var(--shadow-lg)',
          border: '1px solid var(--gray-100)', marginBottom: 40,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span style={{ fontSize: 15, color: 'var(--gray-700)' }}>
            Tất cả chương trình của <strong>{director?.name}</strong>
          </span>
          <Link to="/programs" style={{ color: 'var(--primary)', textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>
            Xem tất cả →
          </Link>
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
            {[1,2,3].map(i => <div key={i} style={{ height: 320, background: 'var(--gray-100)', borderRadius: 'var(--radius-md)' }} />)}
          </div>
        ) : programs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🎬</div>
            <h3 style={{ fontWeight: 600, color: 'var(--black)' }}>Chưa có chương trình nào</h3>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
            {programs.map(p => <ProgramCard key={p.id} program={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}