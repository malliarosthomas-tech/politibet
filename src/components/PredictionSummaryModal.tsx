import React from 'react';
import type { PredictionSummary } from '../types';

interface Props {
  summary: PredictionSummary;
  onClose: () => void;
}

const PredictionSummaryModal: React.FC<Props> = ({ summary, onClose }) => {
  const participating = summary.candidates
    .filter(c => summary.predictions[c.id]?.participates)
    .sort((a, b) => summary.predictions[b.id].score - summary.predictions[a.id].score);

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(10,13,20,0.75)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 16, zIndex: 50, animation: 'pbMdlIn 0.2s ease-out',
      fontFamily: "'Barlow', sans-serif",
    }}>
      <style>{`
        @keyframes pbMdlIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:none; } }
        .pb-sm-scroll { overflow-y:auto; }
        .pb-sm-scroll::-webkit-scrollbar { width:4px; }
        .pb-sm-scroll::-webkit-scrollbar-thumb { background:#CBD0D8; border-radius:2px; }
        .pb-sm-close:hover { color:#E8380D !important; }
      `}</style>

      <div style={{
        background: '#fff', borderRadius: 10,
        width: '100%', maxWidth: 600, maxHeight: '90vh',
        display: 'flex', flexDirection: 'column',
        border: '1.5px solid #E8EBF0', overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          background: '#1A1D23', borderBottom: '3px solid #E8380D',
          padding: '18px 24px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div>
            <div style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: 20, fontWeight: 800, color: '#fff',
            }}>Récapitulatif du pronostic</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>
              Déposé le {summary.date}
            </div>
          </div>
          <button className="pb-sm-close" onClick={onClose} style={{
            background: 'none', border: 'none', fontSize: 26, lineHeight: 1,
            color: 'rgba(255,255,255,0.3)', cursor: 'pointer', padding: '0 0 0 16px',
            transition: 'color 0.15s',
          }}>×</button>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, padding: '20px 24px 0' }}>
          {[
            { label: "Score d'audace", value: summary.boldnessScore, accent: true, sub: 'Plus élevé = plus audacieux' },
            { label: 'Candidats en lice', value: participating.length, accent: false, sub: 'que vous voyez participer' },
          ].map(({ label, value, accent, sub }) => (
            <div key={label} style={{
              background: accent ? '#1A1D23' : '#F7F8FA',
              borderRadius: 8, padding: 16, textAlign: 'center',
              border: accent ? 'none' : '1.5px solid #E8EBF0',
            }}>
              <div style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
                color: accent ? 'rgba(255,255,255,0.45)' : '#999', marginBottom: 6,
              }}>{label}</div>
              <div style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: 40, fontWeight: 800, lineHeight: 1,
                color: accent ? '#E8380D' : '#1A1D23',
              }}>{value}</div>
              <div style={{ fontSize: 11, marginTop: 5, color: accent ? 'rgba(255,255,255,0.3)' : '#bbb' }}>{sub}</div>
            </div>
          ))}
        </div>

        {/* List */}
        <div style={{ padding: '16px 24px 4px' }}>
          <div style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 11, fontWeight: 700, letterSpacing: '0.12em',
            textTransform: 'uppercase', color: '#999',
          }}>Pronostics de score</div>
        </div>

        <div className="pb-sm-scroll" style={{ padding: '0 24px 20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {participating.map((c, i) => (
              <div key={c.id} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: i === 0 ? '#FFF5F3' : '#F7F8FA',
                borderRadius: 7, padding: '10px 14px',
                border: i === 0 ? '1.5px solid #FFCFC7' : '1.5px solid #E8EBF0',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%',
                    background: i === 0 ? '#E8380D' : '#E8EBF0',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: 12, fontWeight: 800,
                    color: i === 0 ? '#fff' : '#888', flexShrink: 0,
                  }}>{i + 1}</div>
                  <img src={c.imageUrl} alt={c.name}
                    style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', objectPosition: 'top', border: '1.5px solid #E8EBF0' }}
                    onError={e => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(c.name)}&background=random&size=72`; }}
                  />
                  <div>
                    <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 15, fontWeight: 700, color: '#1A1D23' }}>{c.name}</div>
                    <div style={{ fontSize: 11, color: '#999' }}>{c.party}</div>
                  </div>
                </div>
                <div style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: 20, fontWeight: 800,
                  color: i === 0 ? '#E8380D' : '#1A1D23',
                }}>{summary.predictions[c.id].score.toFixed(1)}%</div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid #E8EBF0', background: '#F7F8FA' }}>
          <button onClick={onClose} style={{
            width: '100%',
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 14, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
            padding: 12, background: '#E8380D', border: 'none', borderRadius: 6,
            color: '#fff', cursor: 'pointer',
          }}>
            Faire un nouveau pronostic →
          </button>
        </div>
      </div>
    </div>
  );
};

export default PredictionSummaryModal;
