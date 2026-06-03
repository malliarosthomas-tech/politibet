import React from 'react';

const Header = ({ user, onLogout }: any) => (
  <header>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800&family=Barlow:wght@400;500;600&family=Oswald:wght@500;600&display=swap');
      .pb-logout:hover { color: #E8380D !important; }
    `}</style>
    <div style={{ background: '#1A1D23', padding: '0 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0 10px', maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ background: '#E8380D', color: '#fff', fontFamily: "'Oswald',sans-serif", fontSize: 20, fontWeight: 600, letterSpacing: '0.06em', padding: '5px 12px', borderRadius: 4, lineHeight: 1 }}>PB</div>
          <div>
            <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 22, fontWeight: 800, letterSpacing: '0.04em', color: '#fff', lineHeight: 1 }}>POLITIBET</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Présidentielle 2027 · Paris &amp; Pronostics</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 3 }}>
          {['#002395', '#fff', '#ED2939'].map((c, i) => <span key={i} style={{ display: 'block', width: 8, height: 22, borderRadius: 2, background: c, border: c === '#fff' ? '1px solid rgba(255,255,255,0.2)' : 'none' }} />)}
        </div>
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#2D3240', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Barlow Condensed',sans-serif", fontSize: 12, fontWeight: 700, color: '#fff', textTransform: 'uppercase' }}>{user.username.charAt(0)}</div>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>{user.username}</span>
            <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.15)' }} />
            <button className="pb-logout" onClick={onLogout} style={{ fontFamily: "'Barlow',sans-serif", fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.4)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, transition: 'color 0.15s' }}>Déconnexion</button>
          </div>
        )}
      </div>
    </div>
    <div style={{ background: '#E8380D', padding: '6px 20px' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 10, fontFamily: "'Barlow Condensed',sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#fff' }}>
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#fff', display: 'inline-block' }} />
        <span>Cotes en direct</span>
        <span style={{ opacity: 0.4 }}>·</span>
        <span style={{ fontWeight: 400, opacity: 0.85, textTransform: 'none', letterSpacing: 0 }}>Actualisées à chaque sondage publié</span>
      </div>
    </div>
  </header>
);

export default Header;
