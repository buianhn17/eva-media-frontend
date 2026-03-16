import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { programsApi } from '../../api/programs.api';
import ProgramCard from '../../components/public/ProgramCard';
import type { Program } from '../../types';
import { getYoutubeEmbedUrl } from '../../utils/youtube';

export default function ProgramDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [program, setProgram] = useState<Program | null>(null);
  const [related, setRelated] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState<{ url: string; index: number } | null>(null);

  useEffect(() => {
    if (!slug) return;

    window.scrollTo(0, 0);

    programsApi
      .getBySlug(slug)
      .then(async (res) => {
        const p = res.data;
        setProgram(p);

        const relRes = await programsApi.getAll({
          page: 1,
          limit: 20,
          director: p.directorId,
        });

        const relData = relRes.data as any;
        const all: Program[] = Array.isArray(relData) ? relData : relData.data ?? [];

        setRelated(all.filter((r: Program) => r.slug !== slug).slice(0, 6));
      })
      .catch(() => navigate('/programs'))
      .finally(() => setLoading(false));
  }, [slug, navigate]);

  useEffect(() => {
    if (!lightbox || !program?.images) return;

    const fn = (e: KeyboardEvent) => {
      const imgs = program.images!;

      if (e.key === 'Escape') setLightbox(null);

      if (e.key === 'ArrowRight') {
        const next = (lightbox.index + 1) % imgs.length;
        setLightbox({ url: imgs[next].url, index: next });
      }

      if (e.key === 'ArrowLeft') {
        const prev = (lightbox.index - 1 + imgs.length) % imgs.length;
        setLightbox({ url: imgs[prev].url, index: prev });
      }
    };

    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [lightbox, program]);

  if (loading)
    return (
      <div
        style={{
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            border: '3px solid var(--gray-200)',
            borderTopColor: 'var(--primary)',
            animation: 'spin 0.8s linear infinite',
          }}
        />
      </div>
    );

  if (!program) return null;

  const images = program.images ?? [];

  return (
    <div style={{ background: 'var(--white)', minHeight: '100vh' }}>

{/* TITLE + META */}
<div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 5% 0' }}>

  {/* TITLE */}
  <h1
    style={{
      fontSize: 'clamp(26px,4vw,44px)',
      fontWeight: 900,
      marginBottom: 20,
      letterSpacing: '-0.5px'
    }}
  >
    {program.title}
  </h1>

  {/* DIRECTOR + LOCATION */}
  <div
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      flexWrap: 'wrap',
      gap: 20,
      marginBottom: 24
    }}
  >

    {/* DIRECTOR LEFT */}
    {program.director && (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: 'var(--gray-400)',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}
        >
          Đạo diễn
        </span>

        <Link to={`/directors/${program.director.id}`} style={{ textDecoration: 'none' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: 'var(--primary)',
              color: '#fff',
              borderRadius: 8,
              padding: '8px 16px',
              fontSize: 14,
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'var(--transition)'
            }}
          >
            🎬 {program.director.name}
          </div>
        </Link>
      </div>
    )}

    {/* LOCATION RIGHT */}
    {program.location && (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
          alignItems: 'flex-end'
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: 'var(--gray-400)',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}
        >
          Địa điểm tổ chức
        </span>

        <Link to={`/locations/${program.location.id}`} style={{ textDecoration: 'none' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: 'var(--gray-100)',
              color: 'var(--gray-800)',
              border: '1px solid var(--gray-200)',
              borderRadius: 8,
              padding: '8px 16px',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'var(--transition)'
            }}
          >
            📍 {program.location.name}
          </div>
        </Link>
      </div>
    )}

  </div>

  {/* Divider đỏ */}
  <div
    style={{
      height: 3,
      width: 48,
      background: 'var(--primary)',
      borderRadius: 2,
      marginBottom: 24
    }}
  />

  {/* CONTENT */}
  {program.content && (
    <p
      style={{
        fontSize: 16,
        lineHeight: 1.8,
        color: 'var(--gray-600)',
        maxWidth: 780,
        whiteSpace: 'pre-line',
        marginBottom: 40
      }}
    >
      {program.content}
    </p>
  )}

</div>

      {/* THUMBNAIL */}
      {program.thumbnail && (
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 5%' }}>
          <img
            src={program.thumbnail}
            alt={program.title}
            style={{
              width: '100%',
              borderRadius: 12,
              objectFit: 'cover',
              maxHeight: 560,
            }}
          />
        </div>
      )}

      {/* GALLERY */}
      {images.length > 0 && (
        <div style={{ maxWidth: 1100, margin: '40px auto', padding: '0 5%' }}>


          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))',
              gap: 10,
            }}
          >
            {images.map((img, i) => (
              <div
                key={img.id}
                onClick={() => setLightbox({ url: img.url, index: i })}
                style={{
                  position: 'relative',
                  paddingTop: '100%',
                  cursor: 'pointer',
                  overflow: 'hidden',
                }}
              >
                <img
                  src={img.url}
                  alt=""
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIDEO */}
      {program.videoUrl && getYoutubeEmbedUrl(program.videoUrl) && (
        <div style={{ maxWidth: 1100, margin: '40px auto', padding: '0 5%' }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 20 }}>
            VIDEO
          </h2>

          <div
            style={{
              position: 'relative',
              paddingTop: '56.25%',
              borderRadius: 12,
              overflow: 'hidden',
            }}
          >
            <iframe
              src={getYoutubeEmbedUrl(program.videoUrl)}
              title={program.title}
              allowFullScreen
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                border: 'none',
              }}
            />
          </div>
        </div>
      )}

      {/* CTA */}
      <div style={{ maxWidth: 1100, margin: '40px auto', padding: '0 5%' }}>
        <div
          style={{
            background: 'var(--black)',
            padding: 40,
            borderRadius: 12,
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 20,
          }}
        >
          <div>
            <h3 style={{ color: '#fff', fontSize: 22, marginBottom: 6 }}>
              Bạn muốn thực hiện dự án tương tự?
            </h3>

            <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0 }}>
              Liên hệ để được tư vấn miễn phí.
            </p>
          </div>

          <a
            href="tel:0903 250684"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              background: 'var(--primary)',
              color: '#fff',
              textDecoration: 'none',
              padding: '12px 28px',
              borderRadius: 8,
              fontWeight: 700,
            }}
          >
            📞 0903 250684
          </a>
        </div>
      </div>

      {/* RELATED */}
      {related.length > 0 && (
        <div style={{ maxWidth: 1100, margin: '40px auto', padding: '0 5%' }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 20 }}>
            THAM KHẢO THÊM
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))',
              gap: 16,
            }}
          >
            {related.map((p) => (
              <ProgramCard key={p.id} program={p} />
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 30 }}>
            <Link to="/programs">Xem tất cả chương trình →</Link>
          </div>
        </div>
      )}

      {/* LIGHTBOX */}
      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}
        >
          <img
            src={lightbox.url}
            style={{
              maxWidth: '90vw',
              maxHeight: '90vh',
              objectFit: 'contain',
            }}
          />
        </div>
      )}
    </div>
  );
}