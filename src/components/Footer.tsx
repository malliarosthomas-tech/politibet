import React from 'react';

interface FooterProps {
  onOpenMethodology: () => void;
}

const Footer: React.FC<FooterProps> = ({ onOpenMethodology }) => {
  return (
    <footer style={{
      background: '#1A1D23',
      borderTop: '1px solid rgba(255,255,255,0.06)',
      padding: '20px',
      fontFamily: "'Barlow', sans-serif",
    }}>
      <div style={{
        maxWidth: 1280, margin: '0 auto',
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
      }}>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', margin: 0 }}>
          © {new Date().getFullYear()} Politibet — Pronostics Présidentielle 2027. Tous droits réservés.
        </p>
        <button
          onClick={onOpenMethodology}
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 12, fontWeight: 600,
            letterSpacing: '0.08em', textTransform: 'uppercase',
            background: 'none', border: 'none',
            color: 'rgba(255,255,255,0.35)',
            cursor: 'pointer', padding: 0, transition: 'color 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = '#E8380D')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.35)')}
        >
          Comment sont calculées les cotes ?
        </button>
      </div>
    </footer>
  );
};

export default Footer;
