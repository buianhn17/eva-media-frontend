import { Link } from 'react-router-dom';
import type { Program } from '../../types';

interface Props {
  program: Program;
  size?: 'normal' | 'large';
}

export default function ProgramCard({ program, size = 'normal' }: Props) {
  return (
    <Link to={`/programs/${program.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
      <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', background: 'var(--white)', transition: 'var(--transition)', cursor: 'pointer' }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
          (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-lg)';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
          (e.currentTarget as HTMLElement).style.boxShadow = 'none';
        }}
      >
        {/* Square thumbnail – giống Chuối Media */}
        <div style={{ position: 'relative', paddingTop: '100%', background: 'var(--gray-100)', overflow: 'hidden' }}>
          {program.thumbnail ? (
            <img
              src={program.thumbnail}
              alt={program.title}
              style={{
                position: 'absolute', inset: 0,
                width: '100%', height: '100%', objectFit: 'cover',
                transition: 'transform 0.5s ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.07)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
            />
          ) : (
            <div style={{
              position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              background: 'linear-gradient(135deg, #f5f5f5, #e8e8e8)',
              color: 'var(--gray-400)', gap: 8,
            }}>
              <span style={{ fontSize: 36 }}>🎬</span>
              <span style={{ fontSize: 12 }}>EVA Media</span>
            </div>
          )}

          {/* Overlay on hover */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)',
            opacity: 0, transition: 'opacity 0.3s ease',
          }}
            className="card-overlay"
          />

          {/* View detail button */}
          <div style={{
            position: 'absolute', bottom: 16, left: 0, right: 0,
            display: 'flex', justifyContent: 'center',
            opacity: 0, transform: 'translateY(8px)',
            transition: 'all 0.3s ease',
          }}
            className="card-btn"
          >
            <span style={{
              background: 'var(--primary)', color: '#fff',
              borderRadius: 6, padding: '6px 18px', fontSize: 13, fontWeight: 600,
            }}>Xem chi tiết</span>
          </div>

          {/* Gallery count */}
          {program.images && program.images.length > 0 && (
            <div style={{
              position: 'absolute', top: 10, right: 10,
              background: 'rgba(0,0,0,0.55)', color: '#fff',
              borderRadius: 4, padding: '3px 8px', fontSize: 12,
              display: 'flex', alignItems: 'center', gap: 4,
            }}>
              📷 {program.images.length}
            </div>
          )}
        </div>

        {/* Card body */}
        <div style={{ padding: '14px 16px 16px' }}>
          <h3 style={{
            fontSize: size === 'large' ? 17 : 15,
            fontWeight: 700, color: 'var(--black)',
            margin: '0 0 8px', lineHeight: 1.4,
            display: '-webkit-box', WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {program.title}
          </h3>

          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {program.director && (
              <span style={{
                fontSize: 11, color: 'var(--primary)', fontWeight: 600,
                background: 'rgba(230,57,70,0.08)', borderRadius: 4, padding: '2px 8px',
              }}>
                {program.director.name}
              </span>
            )}
            {program.location && (
              <span style={{
                fontSize: 11, color: 'var(--gray-600)',
                background: 'var(--gray-100)', borderRadius: 4, padding: '2px 8px',
              }}>
                📍 {program.location.name}
              </span>
            )}
          </div>
        </div>
      </div>

      <style>{`
        a:hover .card-overlay { opacity: 1 !important; }
        a:hover .card-btn { opacity: 1 !important; transform: translateY(0) !important; }
      `}</style>
    </Link>
  );
}