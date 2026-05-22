import React from 'react';
import type { PredictionSummary, UserPrediction } from '../types';

interface Props {
  history: PredictionSummary[];
  onView: (summary: PredictionSummary) => void;
}

const PastPredictions: React.FC<Props> = ({ history, onView }) => {
  if (history.length === 0) {
    return (
      <div style={{
        textAlign: 'center', padding: '60px 24px',
        background: '#fff', borderRadius: 10,
        border: '1.5px solid #E8EBF0', fontFamily: "'Barlow', sans-serif",
      }}>
        <div style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: 20, fontWeight: 700, color: '#1A1D23', marginBottom: 8,
        }}>Aucun pronostic enregistré</div>
        <p style={{ fontSize: 14, color: '#999' }}>Commencez par faire votre premier pronostic !</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontFamily: "'Barlow', sans-serif" }}>
      <style>{`
        .pb-pp-row:hover { border-color: #CBD0D8 !important; }
        .pb-pp-btn:hover { background: #E8380D !important; border-color: #E8380D !important; color: #fff !important; }
      `}</style>
      {history.map((summary, i) => {
        const participatingCount = Object.values(summary.predictions)
          .filter(p => (p as UserPrediction).participates).length;
        const topCandidates = summary.candidates
          .filter(c => summary.predictions[c.id]?.participates)
          .sort((a, b) => summary.predictions[b.id].score - summary.predictions[a.id].score)
          .slice(0, 3);

        return (
          <div key={summary.id} className="pb-pp-row" style={{
            background: '#fff', borderRadius: 8,
            border: '1.5px solid #E8EBF0', padding: '16px 20px',
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', gap: 16,
            flexWrap: 'wrap', transition: 'border-color 0.15s',
          }}>
            {/* Index + date */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: i === 0 ? '#E8380D' : '#F0F2F5',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: 14, fontWeight: 800,
                color: i === 0 ? '#fff' : '#aaa', flexShrink: 0,
              }}>
                {history.length - i}
              </div>
              <div>
                <div style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: 15, fontWeight: 700, color: '#1A1D23', marginBottom: 3,
                }}>
                  Pronostic du {summary.date}
                </div>
                <div style={{ display: 'flex', gap: 14, fontSize: 12, color: '#999' }}>
                  <span><strong style={{ color: '#1A1D23' }}>{participatingCount}</strong> candidats</span>
                  <span>Audace : <strong style={{ color: '#E8380D' }}>{summary.boldnessScore}</strong></span>
                </div>
              </div>
            </div>

            {/* Chips top candidats */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', flex: 1, justifyContent: 'center' }}>
              {topCandidates.map(c => (
                <div key={c.id} style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  background: '#F7F8FA', border: '1.5px solid #E8EBF0',
                  borderRadius: 20, padding: '4px 10px 4px 5px',
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: 13, fontWeight: 600, color: '#1A1D23',
                }}>
                  <img src={c.imageUrl} alt={c.name}
                    style={{ width: 22, height: 22, borderRadius: '50%', objectFit: 'cover', objectPosition: 'top', border: '1px solid #E8EBF0' }}
                    onError={e => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(c.name)}&background=random&size=44`; }}
                  />
                  {summary.predictions[c.id].score.toFixed(1)}%
                </div>
              ))}
              {participatingCount > 3 && (
                <div style={{ display: 'flex', alignItems: 'center', padding: '4px 10px', fontSize: 12, color: '#bbb' }}>
                  +{participatingCount - 3} autres
                </div>
              )}
            </div>

            {/* CTA */}
            <button className="pb-pp-btn" onClick={() => onView(summary)} style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: 13, fontWeight: 700,
              letterSpacing: '0.08em', textTransform: 'uppercase',
              padding: '9px 18px',
              background: '#F0F2F5', border: '1.5px solid #E8EBF0',
              borderRadius: 6, color: '#1A1D23', cursor: 'pointer',
              transition: 'background 0.15s, border-color 0.15s, color 0.15s',
              flexShrink: 0, whiteSpace: 'nowrap',
            }}>
              Voir le détail →
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default PastPredictions;
