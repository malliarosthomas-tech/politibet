import React from 'react';

interface Props { onClose: () => void; }

const MethodologyModal: React.FC<Props> = ({ onClose }) => {
  const sections = [
    {
      num: '01', title: 'Origine des données',
      content: (
        <>
          <p style={{ fontSize: 13, color: '#555', lineHeight: 1.6, marginBottom: 8 }}>
            Les cotes et estimations sont générées en temps réel par <strong>Google Gemini</strong>, à partir d'une synthèse de :
          </p>
          <ul style={{ paddingLeft: 18, fontSize: 13, color: '#666', lineHeight: 1.8 }}>
            <li><strong style={{ color: '#1A1D23' }}>Instituts de sondage</strong> — baromètres Ifop, Ipsos, Elabe…</li>
            <li><strong style={{ color: '#1A1D23' }}>Analyse médiatique</strong> — presse nationale et spécialisée</li>
            <li><strong style={{ color: '#1A1D23' }}>Contexte politique</strong> — déclarations, alliances, historiques</li>
          </ul>
        </>
      ),
    },
    {
      num: '02', title: 'Cote de participation',
      content: (
        <>
          <p style={{ fontSize: 13, color: '#555', lineHeight: 1.6, marginBottom: 10 }}>
            Représente la probabilité qu'un candidat se présente officiellement.
          </p>
          <div style={{ display: 'flex', gap: 10 }}>
            {[['×1.05', 'Quasi-certain'], ['×3.50', 'Incertain'], ['×10+', 'Très improbable']].map(([cote, label]) => (
              <div key={cote} style={{
                flex: 1, textAlign: 'center',
                background: '#F7F8FA', borderRadius: 6, padding: '10px 8px',
                border: '1.5px solid #E8EBF0',
              }}>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 18, fontWeight: 800, color: '#E8380D' }}>{cote}</div>
                <div style={{ fontSize: 11, color: '#999', marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 11, color: '#bbb', marginTop: 8, fontStyle: 'italic' }}>Formule : Cote = 1 / Probabilité estimée</p>
        </>
      ),
    },
    {
      num: '03', title: 'Estimation des sondages',
      content: (
        <p style={{ fontSize: 13, color: '#555', lineHeight: 1.6 }}>
          Projection du score au premier tour si l'élection avait lieu aujourd'hui, basée sur l'agrégation des rapports de force politiques.
        </p>
      ),
    },
    {
      num: '04', title: "Score d'audace",
      content: (
        <>
          <p style={{ fontSize: 13, color: '#555', lineHeight: 1.6, marginBottom: 10 }}>
            Mesure votre prise de risque. Plus votre pronostic s'éloigne du consensus, plus il est élevé.
          </p>
          <div style={{
            background: '#1A1D23', borderRadius: 6, padding: '12px 16px',
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.7)',
          }}>
            Audace = <span style={{ color: '#E8380D' }}>(Δ Participation × 20)</span> + <span style={{ color: '#E8380D' }}>|Votre Score − Estimation IA|</span>
          </div>
        </>
      ),
    },
  ];

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(10,13,20,0.75)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 16, zIndex: 50, animation: 'pbMdlIn 0.2s ease-out',
      fontFamily: "'Barlow', sans-serif",
    }}>
      <style>{`
        @keyframes pbMdlIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:none; } }
        .pb-mth-scroll { overflow-y:auto; }
        .pb-mth-scroll::-webkit-scrollbar { width:4px; }
        .pb-mth-scroll::-webkit-scrollbar-thumb { background:#CBD0D8; border-radius:2px; }
        .pb-mth-close:hover { color:#E8380D !important; }
      `}</style>
      <div style={{
        background: '#fff', borderRadius: 10,
        width: '100%', maxWidth: 580, maxHeight: '90vh',
        display: 'flex', flexDirection: 'column',
        border: '1.5px solid #E8EBF0', overflow: 'hidden',
      }}>
        <div style={{
          background: '#1A1D23', borderBottom: '3px solid #E8380D',
          padding: '18px 24px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 20, fontWeight: 800, color: '#fff' }}>
              Méthodologie des cotes
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>
              Comment sont construites les estimations Politibet
            </div>
          </div>
          <button className="pb-mth-close" onClick={onClose} style={{
            background: 'none', border: 'none', fontSize: 26, lineHeight: 1,
            color: 'rgba(255,255,255,0.3)', cursor: 'pointer',
            padding: '0 0 0 16px', transition: 'color 0.15s',
          }}>×</button>
        </div>

        <div className="pb-mth-scroll" style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          {sections.map(({ num, title, content }) => (
            <div key={num} style={{ display: 'flex', gap: 16 }}>
              <div style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: 28, fontWeight: 800, color: '#F0F2F5',
                lineHeight: 1, flexShrink: 0, width: 32, paddingTop: 2,
              }}>{num}</div>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: 15, fontWeight: 700, color: '#1A1D23', marginBottom: 8,
                }}>{title}</div>
                {content}
              </div>
            </div>
          ))}
        </div>

        <div style={{ padding: '14px 24px', borderTop: '1px solid #E8EBF0', background: '#F7F8FA', textAlign: 'right' }}>
          <button onClick={onClose} style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 13, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
            padding: '9px 20px', background: '#1A1D23', border: 'none',
            borderRadius: 6, color: '#fff', cursor: 'pointer',
          }}>Fermer</button>
        </div>
      </div>
    </div>
  );
};

export default MethodologyModal;
