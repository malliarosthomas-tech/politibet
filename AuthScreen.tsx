import React from 'react';

const MethodologyModal = ({ onClose }: any) => (
  <div style={{ position: 'fixed', inset: 0, background: 'rgba(10,13,20,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, zIndex: 50, fontFamily: "'Barlow',sans-serif" }}>
    <style>{`@keyframes pbMdlIn2 { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:none; } } .pb-mth-scroll { overflow-y:auto; max-height:400px; } .pb-mth-scroll::-webkit-scrollbar { width:4px; } .pb-mth-scroll::-webkit-scrollbar-thumb { background:#CBD0D8; border-radius:2px; }`}</style>
    <div style={{ background: '#fff', borderRadius: 10, width: '100%', maxWidth: 580, display: 'flex', flexDirection: 'column', border: '1.5px solid #E8EBF0', overflow: 'hidden', animation: 'pbMdlIn2 0.2s ease-out' }}>
      <div style={{ background: '#1A1D23', borderBottom: '3px solid #E8380D', padding: '18px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 20, fontWeight: 800, color: '#fff' }}>Méthodologie des cotes</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>Comment sont construites les estimations Politibet</div>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 26, color: 'rgba(255,255,255,0.3)', cursor: 'pointer' }}>×</button>
      </div>
      <div className="pb-mth-scroll" style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        {[
          { num: '01', title: 'Origine des données', text: 'Les cotes sont générées par Google Gemini à partir des baromètres Ifop, Ipsos, Elabe, de la presse nationale et du contexte politique général.' },
          { num: '02', title: 'Cote de participation', text: 'Représente la probabilité de candidature. ×1.05 = quasi-certain, ×3.50 = incertain, ×10+ = très improbable. Formule : Cote = 1 / Probabilité.' },
          { num: '03', title: 'Estimation des sondages', text: 'Projection du score au premier tour si l\'élection avait lieu aujourd\'hui, basée sur les rapports de force politiques.' },
          { num: '04', title: "Score d'audace", text: "Mesure votre prise de risque par rapport au consensus. Plus vous vous éloignez des estimations, plus le score est élevé." },
        ].map(({ num, title, text }) => (
          <div key={num} style={{ display: 'flex', gap: 16 }}>
            <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 28, fontWeight: 800, color: '#F0F2F5', lineHeight: 1, flexShrink: 0, width: 32, paddingTop: 2 }}>{num}</div>
            <div>
              <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 15, fontWeight: 700, color: '#1A1D23', marginBottom: 6 }}>{title}</div>
              <p style={{ fontSize: 13, color: '#555', lineHeight: 1.6 }}>{text}</p>
            </div>
          </div>
        ))}
      </div>
      <div style={{ padding: '14px 24px', borderTop: '1px solid #E8EBF0', background: '#F7F8FA', textAlign: 'right' }}>
        <button onClick={onClose} style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 13, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '9px 20px', background: '#1A1D23', border: 'none', borderRadius: 6, color: '#fff', cursor: 'pointer' }}>Fermer</button>
      </div>
    </div>
  </div>
);

export default MethodologyModal;
