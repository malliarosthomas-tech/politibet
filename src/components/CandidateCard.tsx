import React, { useState, useEffect } from 'react';
import type { Candidate, UserPrediction } from '../types';

interface CandidateCardProps {
  candidate: Candidate;
  prediction: UserPrediction;
  onChange: (id: string, newPrediction: UserPrediction) => void;
}

const getPartyColor = (party: string, spectrum: number): string => {
  const p = party.toLowerCase();
  if (p.includes('lfi') || p.includes('insoumis') || p.includes('pcf') || p.includes('communiste') || p.includes('npa') || p.includes('lutte')) return '#991b1b';
  if (p.includes('eelv') || p.includes('écologiste') || p.includes('ecologie') || p.includes('vert')) return '#16a34a';
  if (p.includes('ps') || p.includes('socialiste') || p.includes('place publique') || p.includes('gauche')) return '#db2777';
  if (p.includes('renaissance') || p.includes('modem') || p.includes('lrem') || p.includes('centre') || p.includes('ensemble')) return '#f97316';
  if (p.includes('lr') || p.includes('républicain') || p.includes('horizons')) return '#2563eb';
  if (p.includes('rn') || p.includes('rassemblement') || p.includes('national') || p.includes('reconquête') || p.includes('reconquete')) return '#1e3a8a';
  if (spectrum <= -7) return '#991b1b';
  if (spectrum <= -4) return '#db2777';
  if (spectrum <= 2) return '#f97316';
  if (spectrum <= 6) return '#2563eb';
  return '#1e3a8a';
};

const CandidateCard: React.FC<CandidateCardProps> = ({ candidate, prediction, onChange }) => {
  const [imgSrc, setImgSrc] = useState(candidate.imageUrl);

  useEffect(() => { setImgSrc(candidate.imageUrl); }, [candidate.imageUrl]);

  if (!prediction) return null;

  const handleToggle = () => {
    const next = { ...prediction, participates: !prediction.participates };
    if (!next.participates) next.score = 0;
    onChange(candidate.id, next);
  };

  const handleScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const score = parseFloat(e.target.value);
    onChange(candidate.id, { ...prediction, score: isNaN(score) ? 0 : score });
  };

  const partyColor = getPartyColor(candidate.party, candidate.politicalSpectrum);
  const isActive = prediction.participates;

  const predictionOdds = isActive && prediction.score > 0
    ? parseFloat((1 + Math.abs(prediction.score - candidate.pollEstimate) / 10).toFixed(2))
    : null;

  return (
    <div style={{
      background: '#fff',
      borderRadius: 8,
      border: isActive ? `2px solid ${partyColor}` : '1.5px solid #E8EBF0',
      overflow: 'hidden',
      transition: 'border-color 0.2s, box-shadow 0.2s',
      boxShadow: isActive ? `0 2px 12px ${partyColor}22` : 'none',
      fontFamily: "'Barlow', sans-serif",
    }}>
      {/* Photo */}
      <div style={{ position: 'relative', background: '#F7F8FA' }}>
        <img
          src={imgSrc}
          alt={candidate.name}
          onError={() => setImgSrc(`https://ui-avatars.com/api/?name=${encodeURIComponent(candidate.name)}&background=random&size=200`)}
          style={{
            width: '100%', height: 160,
            objectFit: 'cover', objectPosition: 'top',
            display: 'block',
            filter: isActive ? 'none' : 'grayscale(100%) opacity(0.5)',
            transition: 'filter 0.3s',
          }}
        />
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          height: 4, background: partyColor, opacity: isActive ? 1 : 0.3,
        }} />
        {/* Badge cote */}
        <div style={{
          position: 'absolute', top: 8, right: 8,
          background: '#1A1D23',
          borderRadius: 5, padding: '4px 8px',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
        }}>
          <span style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 16, fontWeight: 700, color: '#fff', lineHeight: 1,
          }}>
            ×{candidate.participationOdds.toFixed(2)}
          </span>
          <span style={{
            fontSize: 9, color: 'rgba(255,255,255,0.5)',
            letterSpacing: '0.06em', textTransform: 'uppercase',
          }}>
            participation
          </span>
        </div>
      </div>

      {/* Corps */}
      <div style={{ padding: '12px 12px 14px' }}>
        <div style={{ marginBottom: 10 }}>
          <div style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 16, fontWeight: 700,
            color: '#1A1D23', lineHeight: 1.1, marginBottom: 2,
          }}>
            {candidate.name}
          </div>
          <div style={{ fontSize: 11, color: '#999' }}>{candidate.party}</div>
        </div>

        {/* Sondages */}
        <div style={{
          background: '#F7F8FA', borderRadius: 5, padding: '5px 8px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: 10,
        }}>
          <span style={{ fontSize: 11, color: '#999' }}>Sondages</span>
          <span style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 14, fontWeight: 700, color: '#1A1D23',
          }}>
            {candidate.pollEstimate.toFixed(1)}%
          </span>
        </div>

        {/* Toggle */}
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', marginBottom: 8,
        }}>
          <span style={{ fontSize: 12, color: '#888', fontWeight: 500 }}>Participe</span>
          <button
            onClick={handleToggle}
            aria-pressed={isActive}
            style={{
              width: 36, height: 20, borderRadius: 10,
              background: isActive ? partyColor : '#E8EBF0',
              border: 'none', cursor: 'pointer',
              position: 'relative', transition: 'background 0.2s', padding: 0,
            }}
          >
            <span style={{
              position: 'absolute',
              width: 14, height: 14, borderRadius: '50%', background: '#fff',
              top: 3, left: isActive ? 19 : 3,
              transition: 'left 0.2s',
              boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
            }} />
          </button>
        </div>

        {/* Score */}
        <div>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', marginBottom: 4,
          }}>
            <label htmlFor={`score-${candidate.id}`} style={{ fontSize: 11, color: '#888', fontWeight: 500 }}>
              Pronostic de score
            </label>
            {predictionOdds !== null && (
              <span style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: 12, color: '#E8380D', fontWeight: 700,
              }}>
                Cote ×{predictionOdds}
              </span>
            )}
          </div>
          <input
            type="number"
            id={`score-${candidate.id}`}
            value={prediction.score || ''}
            onChange={handleScoreChange}
            disabled={!isActive}
            min="0" max="100" step="0.1"
            placeholder="0"
            style={{
              width: '100%',
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: 18, fontWeight: 700,
              textAlign: 'center',
              background: isActive ? '#fff' : '#F7F8FA',
              border: isActive ? `1.5px solid ${partyColor}55` : '1.5px solid #E8EBF0',
              borderRadius: 5, padding: '6px 8px',
              color: isActive ? '#1A1D23' : '#bbb',
              cursor: isActive ? 'text' : 'not-allowed',
              outline: 'none',
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CandidateCard;
