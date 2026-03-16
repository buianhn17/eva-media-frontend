import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { programsApi } from '../../api/programs.api';
import { directorsApi } from '../../api/directors.api';
import { locationsApi } from '../../api/locations.api';
import ProgramCard from '../../components/public/ProgramCard';
import type { Program, Director, Location } from '../../types';

// Placeholder hero slides khi chưa có data
const HERO_PLACEHOLDERS = [
  'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1600&q=80',
  'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1600&q=80',
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600&q=80',
];

export default function HomePage() {
  const navigate = useNavigate();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [directors, setDirectors] = useState<Director[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [slide, setSlide] = useState(0);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    Promise.all([
      programsApi.getAll({ page: 1, limit: 8 }),
      directorsApi.getAll(),
      locationsApi.getAll(),
    ]).then(([pRes, dRes, lRes]) => {
      const pData = pRes.data as any;
      setPrograms(Array.isArray(pData) ? pData : pData.data ?? []);
      setDirectors(dRes.data);
      setLocations(lRes.data);
    }).finally(() => setLoading(false));
  }, []);

  // Hero slideshow – dùng thumbnail của programs hoặc placeholder
  const heroSlides = programs.filter(p => p.thumbnail).slice(0, 5).map(p => p.thumbnail as string);
  const slides = heroSlides.length >= 3 ? heroSlides : HERO_PLACEHOLDERS;

  useEffect(() => {
    timerRef.current = setInterval(() => setSlide(s => (s + 1) % slides.length), 4000);
    return () => clearInterval(timerRef.current);
  }, [slides.length]);

  return (
    <div style={{ background: 'var(--white)' }}>

      {/* ══════════════════════════════
          HERO – Fullscreen Slideshow
      ══════════════════════════════ */}
      <section style={{ position: 'relative', height: 'calc(100vh - 64px)', overflow: 'hidden', background: 'var(--black)' }}>
        {/* Slides */}
        {slides.map((src, i) => (
          <div key={i} style={{
            position: 'absolute', inset: 0,
            backgroundImage: `url(${src})`,
            backgroundSize: 'cover', backgroundPosition: 'center',
            opacity: i === slide ? 1 : 0,
            transition: 'opacity 1s ease',
          }} />
        ))}

        {/* Dark overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.6) 100%)',
        }} />

        {/* Text content */}
        <div style={{
          position: 'absolute', inset: 0, display: 'flex',
          flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          textAlign: 'center', padding: '0 5%',
          animation: 'fadeInUp 1s ease',
        }}>
          <p style={{
            color: 'var(--primary)', fontWeight: 700, fontSize: 13,
            letterSpacing: '3px', textTransform: 'uppercase', margin: '0 0 16px',
            background: 'rgba(230,57,70,0.15)', border: '1px solid rgba(230,57,70,0.4)',
            borderRadius: 20, padding: '6px 20px',
          }}>
            Chuyên Nghiệp · Sáng Tạo · Tận Tâm
          </p>

          <h1 style={{
            fontSize: 'clamp(36px, 6vw, 80px)', fontWeight: 900, color: '#fff',
            margin: '0 0 20px', lineHeight: 1.05, letterSpacing: '-2px',
            maxWidth: 800,
          }}>
            Ghi Dấu Từng<br />
            <span style={{ color: 'var(--primary)' }}>Khoảnh Khắc</span>
          </h1>

          <p style={{
            fontSize: 'clamp(15px, 2vw, 19px)', color: 'rgba(255,255,255,0.75)',
            margin: '0 0 40px', maxWidth: 520, lineHeight: 1.7,
          }}>
            EVA Media – Đơn vị sản xuất nội dung truyền thông, quay chụp chuyên nghiệp và tổ chức sự kiện sân khấu hàng đầu.
          </p>

          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
            <button onClick={() => navigate('/programs')}
              style={{
                background: 'var(--primary)', color: '#fff', border: 'none',
                borderRadius: 8, padding: '14px 36px', fontSize: 16, fontWeight: 700,
                cursor: 'pointer', transition: 'var(--transition)',
                letterSpacing: '0.3px',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--primary-dark)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'var(--primary)')}
            >
              Xem Chương Trình
            </button>
            <a href="tel:0123456789"
              style={{
                background: 'rgba(255,255,255,0.12)', color: '#fff',
                border: '2px solid rgba(255,255,255,0.4)',
                borderRadius: 8, padding: '14px 36px', fontSize: 16, fontWeight: 600,
                textDecoration: 'none', transition: 'var(--transition)',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.2)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.12)')}
            >
              📞 Liên Hệ Ngay
            </a>
          </div>
        </div>

        {/* Slide dots */}
        <div style={{
          position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)',
          display: 'flex', gap: 8,
        }}>
          {slides.map((_, i) => (
            <button key={i} onClick={() => setSlide(i)} style={{
              width: i === slide ? 24 : 8, height: 8, borderRadius: 4,
              background: i === slide ? 'var(--primary)' : 'rgba(255,255,255,0.4)',
              border: 'none', cursor: 'pointer', transition: 'var(--transition)', padding: 0,
            }} />
          ))}
        </div>
      </section>

      {/* ══════════════════════════════
          STATS BAR
      ══════════════════════════════ */}
      <section style={{ background: 'var(--black)', padding: '28px 5%' }}>
        <div style={{
          maxWidth: 1100, margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: 1, background: 'rgba(255,255,255,0.06)', borderRadius: 10, overflow: 'hidden',
        }}>
          {[
            { n: programs.length + '+', l: 'Chương Trình' },
            { n: directors.length + '+', l: 'Đạo Diễn' },
            { n: locations.length + '+', l: 'Địa Điểm' },
            { n: '10+', l: 'Năm Kinh Nghiệm' },
            { n: '500+', l: 'Khách Hàng' },
          ].map((s, i) => (
            <div key={i} style={{ padding: '24px 16px', textAlign: 'center', background: 'var(--black)' }}>
              <div style={{ fontSize: 32, fontWeight: 900, color: 'var(--primary)', lineHeight: 1 }}>{s.n}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 6, letterSpacing: '0.5px' }}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════
          SERVICES – Kiểu Chuối Media
      ══════════════════════════════ */}
      <section style={{ padding: '72px 5%', background: 'var(--white)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <p style={{ color: 'var(--primary)', fontWeight: 700, fontSize: 12, letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 10px' }}>
              Dịch Vụ
            </p>
            <h2 style={{ fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 800, color: 'var(--black)', letterSpacing: '-1px', margin: '0 0 12px' }}>
              DỊCH VỤ TẠI EVA MEDIA
            </h2>
            <p style={{ color: 'var(--gray-600)', fontSize: 15, maxWidth: 500, margin: '0 auto' }}>
              Đội ngũ chuyên nghiệp – Thiết bị hiện đại – Dịch vụ trọn gói
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 20 }}>
            {[
              { icon: '🎬', name: 'Quay Phim Sự Kiện' },
              { icon: '📸', name: 'Chụp Ảnh Chuyên Nghiệp' },
              { icon: '🎤', name: 'Âm Thanh Ánh Sáng' },
              { icon: '🎭', name: 'Tổ Chức Sân Khấu' },
              { icon: '📺', name: 'Sản Xuất TV Show' },
            ].map((s, i) => (
              <div key={i}
                onClick={() => navigate('/programs')}
                style={{
                  background: 'var(--white)', border: '1px solid var(--gray-200)',
                  borderRadius: 'var(--radius-md)', padding: '28px 16px',
                  textAlign: 'center', cursor: 'pointer', transition: 'var(--transition)',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--primary)';
                  (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-md)';
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--gray-200)';
                  (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                }}
              >
                <div style={{ fontSize: 36, marginBottom: 12 }}>{s.icon}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--black)', lineHeight: 1.3 }}>{s.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          ALBUM NỔI BẬT – Grid vuông
      ══════════════════════════════ */}
      <section style={{ padding: '72px 5%', background: 'var(--gray-100)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 36 }}>
            <div>
              <p style={{ color: 'var(--primary)', fontWeight: 700, fontSize: 12, letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 8px' }}>
                EVA MEDIA
              </p>
              <h2 style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 800, color: 'var(--black)', letterSpacing: '-0.5px', margin: 0 }}>
                CHƯƠNG TRÌNH NỔI BẬT
              </h2>
            </div>
            <Link to="/programs" style={{
              color: 'var(--primary)', textDecoration: 'none', fontWeight: 700,
              fontSize: 14, display: 'flex', alignItems: 'center', gap: 4,
              whiteSpace: 'nowrap',
            }}>
              Xem thêm →
            </Link>
          </div>

          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20 }}>
              {[1,2,3,4].map(i => (
                <div key={i} style={{ paddingTop: '100%', background: 'var(--gray-200)', borderRadius: 'var(--radius-md)', animation: 'pulse 1.5s infinite' }} />
              ))}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20 }}>
              {programs.slice(0, 8).map(p => <ProgramCard key={p.id} program={p} />)}
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: 36 }}>
            <button onClick={() => navigate('/programs')} style={{
              background: 'var(--primary)', color: '#fff', border: 'none',
              borderRadius: 8, padding: '12px 40px', fontSize: 15, fontWeight: 700,
              cursor: 'pointer', transition: 'var(--transition)',
            }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--primary-dark)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'var(--primary)')}
            >
              Xem Tất Cả Chương Trình
            </button>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          DIRECTORS
      ══════════════════════════════ */}
      {directors.length > 0 && (
        <section style={{ padding: '72px 5%', background: 'var(--white)' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
              <p style={{ color: 'var(--primary)', fontWeight: 700, fontSize: 12, letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 8px' }}>
                Đội Ngũ
              </p>
              <h2 style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 800, color: 'var(--black)', letterSpacing: '-0.5px', margin: 0 }}>
                ĐẠO DIỄN
              </h2>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
              {directors.map(d => (
                <Link key={d.id} to={`/directors/${d.id}`} style={{ textDecoration: 'none' }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    border: '1px solid var(--gray-200)', borderRadius: 40,
                    padding: '10px 20px 10px 10px', transition: 'var(--transition)',
                    background: 'var(--white)',
                  }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = 'var(--primary)';
                      (e.currentTarget as HTMLElement).style.background = 'rgba(230,57,70,0.04)';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = 'var(--gray-200)';
                      (e.currentTarget as HTMLElement).style.background = 'var(--white)';
                    }}
                  >
                    <div style={{
                      width: 36, height: 36, borderRadius: '50%',
                      background: 'var(--primary)', color: '#fff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 800, fontSize: 15,
                    }}>{d.name[0]}</div>
                    <span style={{ fontWeight: 600, color: 'var(--black)', fontSize: 14 }}>{d.name}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════
          LOCATIONS
      ══════════════════════════════ */}
      {locations.length > 0 && (
        <section style={{ padding: '72px 5%', background: 'var(--gray-100)' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
              <p style={{ color: 'var(--primary)', fontWeight: 700, fontSize: 12, letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 8px' }}>
                Địa Điểm
              </p>
              <h2 style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 800, color: 'var(--black)', letterSpacing: '-0.5px', margin: 0 }}>
                KHU VỰC HOẠT ĐỘNG
              </h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
              {locations.map(l => (
                <Link key={l.id} to={`/locations/${l.id}`} style={{ textDecoration: 'none' }}>
                  <div style={{
                    background: 'var(--white)', border: '1px solid var(--gray-200)',
                    borderRadius: 'var(--radius-md)', padding: '28px 16px',
                    textAlign: 'center', transition: 'var(--transition)',
                  }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = 'var(--primary)';
                      (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)';
                      (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-md)';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = 'var(--gray-200)';
                      (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                      (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                    }}
                  >
                    <div style={{ fontSize: 32, marginBottom: 10 }}>📍</div>
                    <div style={{ fontWeight: 700, color: 'var(--black)', fontSize: 14 }}>{l.name}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════
          CTA LIÊN HỆ
      ══════════════════════════════ */}
      <section style={{
        padding: '80px 5%',
        background: 'var(--black)',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <p style={{ color: 'var(--primary)', fontWeight: 700, fontSize: 12, letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 16px' }}>
            Liên Hệ
          </p>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 900, color: '#fff', margin: '0 0 16px', letterSpacing: '-1px' }}>
            Sẵn Sàng Hợp Tác?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 16, margin: '0 0 36px', lineHeight: 1.7 }}>
            Liên hệ ngay để được tư vấn miễn phí và nhận báo giá tốt nhất.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="tel:0903 250684" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'var(--primary)', color: '#fff', textDecoration: 'none',
              borderRadius: 8, padding: '14px 32px', fontSize: 16, fontWeight: 700,
              transition: 'var(--transition)',
            }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--primary-dark)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'var(--primary)')}
            >
              📞 0903 250684
            </a>
            <a href="mailto:info@evamedia.vn" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'transparent', color: '#fff', textDecoration: 'none',
              borderRadius: 8, padding: '14px 32px', fontSize: 16, fontWeight: 600,
              border: '1px solid rgba(255,255,255,0.25)', transition: 'var(--transition)',
            }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)')}
            >
              ✉️ Gửi Email
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}