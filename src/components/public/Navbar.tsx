import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => setMenuOpen(false), [location])

  return (
    <>
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,

          height: 70,
          padding: '0 6%',

          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',

          background: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(12px)',

          borderBottom: '1px solid rgba(0,0,0,0.05)',

          boxShadow: scrolled
            ? '0 6px 20px rgba(0,0,0,0.06)'
            : 'none',

          transition: 'all .3s ease',
        }}
      >

        {/* LOGO */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            textDecoration: 'none'
          }}
        >
          <img
            src="/Gemini_Generated_Image_8r13mo8r13mo8r13-removebg-preview.png"
            alt="EVA Media"
            style={{
              height: 110,
              objectFit: 'contain'
            }}
          />

          
        </Link>

        {/* DESKTOP MENU */}
        <div
          className="nav-desktop"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}
        >
          {[
            { to: '/', label: 'Trang Chủ' },
            { to: '/programs', label: 'Chương Trình' }
          ].map(item => {

            const active = location.pathname === item.to

            return (
              <Link
                key={item.to}
                to={item.to}
                style={{
                  textDecoration: 'none',
                  padding: '9px 18px',
                  borderRadius: 8,

                  fontSize: 14,
                  fontWeight: 600,

                  color: active ? 'var(--primary)' : '#333',

                  background: active
                    ? 'rgba(230,57,70,0.08)'
                    : 'transparent',

                  transition: 'all .2s'
                }}
                onMouseEnter={e => {
                  if (!active)
                    (e.currentTarget as HTMLElement).style.background =
                      '#f5f5f5'
                }}
                onMouseLeave={e => {
                  if (!active)
                    (e.currentTarget as HTMLElement).style.background =
                      'transparent'
                }}
              >
                {item.label}
              </Link>
            )
          })}

          {/* CTA */}
          <a
            href="tel:0123456789"
            style={{
              marginLeft: 14,
              textDecoration: 'none',

              display: 'flex',
              alignItems: 'center',
              gap: 8,

              background: 'var(--primary)',
              color: '#fff',

              padding: '10px 20px',
              borderRadius: 10,

              fontSize: 14,
              fontWeight: 700,

              boxShadow: '0 6px 16px rgba(230,57,70,0.3)',

              transition: 'all .25s'
            }}
            onMouseEnter={e => {
              const el = e.currentTarget
              el.style.transform = 'translateY(-1px)'
              el.style.boxShadow = '0 10px 22px rgba(230,57,70,.4)'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget
              el.style.transform = 'translateY(0)'
              el.style.boxShadow = '0 6px 16px rgba(230,57,70,0.3)'
            }}
          >
            📞 0903 250684
          </a>
        </div>

        {/* MOBILE BUTTON */}
        <button
          className="nav-mobile-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            display: 'none',
            flexDirection: 'column',
            gap: 5,
            border: 'none',
            background: 'none',
            cursor: 'pointer'
          }}
        >
          {[0, 1, 2].map(i => (
            <span
              key={i}
              style={{
                width: 22,
                height: 2,
                background: '#111',
                borderRadius: 2
              }}
            />
          ))}
        </button>
      </nav>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div
          style={{
            position: 'fixed',
            top: 70,
            left: 0,
            right: 0,
            zIndex: 999,

            background: '#fff',

            padding: '15px 6%',

            borderBottom: '1px solid #eee',

            boxShadow: '0 10px 25px rgba(0,0,0,.08)'
          }}
        >
          {[
            { to: '/', label: 'Trang Chủ' },
            { to: '/programs', label: 'Chương Trình' }
          ].map(item => (
            <Link
              key={item.to}
              to={item.to}
              style={{
                display: 'block',
                padding: '12px 0',

                fontSize: 15,
                fontWeight: 600,

                textDecoration: 'none',
                color: '#222',

                borderBottom: '1px solid #f2f2f2'
              }}
            >
              {item.label}
            </Link>
          ))}

          <a
            href="tel:0903 250684"
            style={{
              display: 'block',
              padding: '14px 0',

              fontWeight: 700,
              color: 'var(--primary)',

              textDecoration: 'none'
            }}
          >
            📞 0903 250684
          </a>
        </div>
      )}

      <div style={{ height: 70 }} />

      <style>{`
        @media (max-width:768px){
          .nav-desktop{display:none !important;}
          .nav-mobile-btn{display:flex !important;}
        }
      `}</style>
    </>
  )
}