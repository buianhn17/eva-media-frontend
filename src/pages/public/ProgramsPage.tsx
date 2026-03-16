import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { programsApi } from '../../api/programs.api';
import { directorsApi } from '../../api/directors.api';
import { locationsApi } from '../../api/locations.api';
import ProgramCard from '../../components/public/ProgramCard';
import type { Program, Director, Location } from '../../types';

export default function ProgramsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [directors, setDirectors] = useState<Director[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const search = searchParams.get('search') || '';
  const directorId = searchParams.get('director') ? Number(searchParams.get('director')) : undefined;
  const locationId = searchParams.get('location') ? Number(searchParams.get('location')) : undefined;
  const limit = 9;

  useEffect(() => {
    directorsApi.getAll().then(r => setDirectors(r.data));
    locationsApi.getAll().then(r => setLocations(r.data));
  }, []);

  useEffect(() => {
    setLoading(true);
    programsApi.getAll({ page, limit, search: search || undefined, director: directorId, location: locationId })
      .then(res => {
        const data = res.data as any;
        setPrograms(Array.isArray(data) ? data : data.data ?? []);
        setTotal(Array.isArray(data) ? data.length : data.total ?? 0);
      })
      .finally(() => setLoading(false));
  }, [page, search, directorId, locationId]);

  const activeFilter = directorId
    ? `Đạo diễn: ${directors.find(d => d.id === directorId)?.name}`
    : locationId
      ? `Địa điểm: ${locations.find(l => l.id === locationId)?.name}`
      : null;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--white)' }}>
      {/* Page Header */}
      <div style={{
        background: 'linear-gradient(135deg, var(--black) 0%, #1a0000 100%)',
        padding: '60px 5% 80px', textAlign: 'center',
      }}>
        <p style={{ color: 'var(--primary)', fontWeight: 600, fontSize: 13, letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 12px' }}>
          Danh mục
        </p>
        <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 800, color: '#fff', margin: '0 0 16px', letterSpacing: '-1px' }}>
          Tất cả chương trình
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 16, margin: 0 }}>
          Khám phá các dự án truyền thông và sự kiện của EVA Media
        </p>
      </div>

      <div style={{ maxWidth: 1200, margin: '-40px auto 0', padding: '0 5% 80px' }}>
        {/* Search & Filter Box */}
        <div style={{
          background: 'var(--white)', borderRadius: 'var(--radius-lg)',
          padding: '24px 28px', boxShadow: 'var(--shadow-lg)',
          marginBottom: 48, border: '1px solid var(--gray-100)',
        }}>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {/* Search */}
            <div style={{ flex: '1 1 200px', position: 'relative' }}>
              <span style={{
                position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                color: 'var(--gray-500)', fontSize: 16,
              }}>🔍</span>
              <input
                placeholder="Tìm kiếm chương trình..."
                defaultValue={search}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    const val = (e.target as HTMLInputElement).value;
                    setSearchParams(prev => { val ? prev.set('search', val) : prev.delete('search'); return prev; });
                    setPage(1);
                  }
                }}
                style={{
                  width: '100%', padding: '12px 14px 12px 42px',
                  border: '1px solid var(--gray-300)', borderRadius: 10,
                  fontSize: 15, outline: 'none', boxSizing: 'border-box',
                  transition: 'var(--transition)',
                }}
                onFocus={e => (e.target.style.borderColor = 'var(--primary)')}
                onBlur={e => (e.target.style.borderColor = 'var(--gray-300)')}
              />
            </div>

            {/* Director filter */}
            <select
              value={directorId || ''}
              onChange={e => {
                e.target.value
                  ? setSearchParams(prev => { prev.set('director', e.target.value); prev.delete('location'); return prev; })
                  : setSearchParams(prev => { prev.delete('director'); return prev; });
                setPage(1);
              }}
              style={{
                flex: '1 1 160px', padding: '12px 14px',
                border: '1px solid var(--gray-300)', borderRadius: 10,
                fontSize: 15, background: 'var(--white)', cursor: 'pointer', outline: 'none',
              }}
            >
              <option value="">Tất cả đạo diễn</option>
              {directors.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>

            {/* Location filter */}
            <select
              value={locationId || ''}
              onChange={e => {
                e.target.value
                  ? setSearchParams(prev => { prev.set('location', e.target.value); prev.delete('director'); return prev; })
                  : setSearchParams(prev => { prev.delete('location'); return prev; });
                setPage(1);
              }}
              style={{
                flex: '1 1 160px', padding: '12px 14px',
                border: '1px solid var(--gray-300)', borderRadius: 10,
                fontSize: 15, background: 'var(--white)', cursor: 'pointer', outline: 'none',
              }}
            >
              <option value="">Tất cả địa điểm</option>
              {locations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
            </select>

            {/* Clear */}
            {(search || directorId || locationId) && (
              <button
                onClick={() => { setSearchParams({}); setPage(1); }}
                style={{
                  padding: '12px 20px', background: 'var(--gray-100)',
                  border: 'none', borderRadius: 10, cursor: 'pointer',
                  fontSize: 14, color: 'var(--gray-700)', fontWeight: 500,
                  transition: 'var(--transition)',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--gray-300)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'var(--gray-100)')}
              >
                ✕ Xóa lọc
              </button>
            )}
          </div>

          {/* Active filter badge */}
          {activeFilter && (
            <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 13, color: 'var(--gray-500)' }}>Đang lọc:</span>
              <span style={{
                background: 'rgba(230,57,70,0.1)', color: 'var(--primary)',
                borderRadius: 6, padding: '3px 10px', fontSize: 13, fontWeight: 600,
              }}>{activeFilter}</span>
            </div>
          )}
        </div>

        {/* Results count */}
        <p style={{ color: 'var(--gray-500)', fontSize: 14, marginBottom: 24 }}>
          Hiển thị <strong style={{ color: 'var(--black)' }}>{programs.length}</strong> chương trình
        </p>

        {/* Grid */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
            {[1,2,3,4,5,6].map(i => (
              <div key={i} style={{ height: 320, background: 'var(--gray-100)', borderRadius: 'var(--radius-md)' }} />
            ))}
          </div>
        ) : programs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🎬</div>
            <h3 style={{ fontSize: 22, fontWeight: 600, color: 'var(--black)', margin: '0 0 8px' }}>
              Không tìm thấy chương trình
            </h3>
            <p style={{ color: 'var(--gray-500)' }}>Thử thay đổi từ khóa hoặc bộ lọc</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
            {programs.map(p => <ProgramCard key={p.id} program={p} />)}
          </div>
        )}

        {/* Pagination */}
        {total > limit && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 48 }}>
            {Array.from({ length: Math.ceil(total / limit) }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                style={{
                  width: 40, height: 40, borderRadius: 8, border: 'none',
                  background: p === page ? 'var(--primary)' : 'var(--gray-100)',
                  color: p === page ? '#fff' : 'var(--gray-700)',
                  fontWeight: p === page ? 700 : 400,
                  cursor: 'pointer', fontSize: 15, transition: 'var(--transition)',
                }}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}