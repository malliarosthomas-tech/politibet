import React, { useState, useEffect, useMemo, useCallback } from 'react';
import type { Candidate, Predictions, PredictionSummary, UserPrediction, User } from './types';
import { fetchCandidatesWithRetry } from './services/geminiService';
import { firebaseAuthService, predictionService } from './services/firebaseService';
import CandidateCard from './components/CandidateCard';
import Header from './components/Header';
import Footer from './components/Footer';
import PredictionSummaryModal from './components/PredictionSummaryModal';
import PastPredictions from './components/PastPredictions';
import MethodologyModal from './components/MethodologyModal';
import AuthScreen from './components/AuthScreen';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [predictions, setPredictions] = useState<Predictions>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<PredictionSummary[]>([]);
  const [showSummary, setShowSummary] = useState<PredictionSummary | null>(null);
  const [showMethodology, setShowMethodology] = useState(false);
  const [activeView, setActiveView] = useState<'predict' | 'history'>('predict');

  // Écoute l'état d'auth Firebase
  useEffect(() => {
    const unsub = firebaseAuthService.onAuthChange(fbUser => {
      setUser(fbUser);
      setAuthLoading(false);
    });
    return unsub;
  }, []);

  const initializeState = useCallback((candidatesData: Candidate[]) => {
    const init: Predictions = {};
    candidatesData.forEach(c => { init[c.id] = { participates: false, score: 0 }; });
    setPredictions(init);
  }, []);

  // Charge les candidats quand l'user est connecté
  useEffect(() => {
    if (!user) return;
    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchCandidatesWithRetry();
        const sorted = data.sort((a, b) => a.politicalSpectrum - b.politicalSpectrum);
        setCandidates(sorted);
        initializeState(sorted);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Erreur inconnue');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [user, initializeState]);

  // Charge l'historique depuis Firestore
  useEffect(() => {
    if (!user) return;
    predictionService.getForUser(user.id)
      .then(setHistory)
      .catch(e => console.error('Erreur chargement historique', e));
  }, [user]);

  const handlePredictionChange = (id: string, pred: UserPrediction) => {
    setPredictions(prev => ({ ...prev, [id]: pred }));
  };

  const totalScore = useMemo(() =>
    Object.values(predictions).reduce((acc, p) => acc + (p.participates ? p.score : 0), 0),
    [predictions]
  );

  const isValid = useMemo(() => Math.abs(totalScore - 100) < 0.01 && totalScore > 0, [totalScore]);

  const calculateBoldnessScore = (): number => {
    let boldness = 0;
    candidates.forEach(c => {
      const p = predictions[c.id];
      if (!p) return;
      boldness += Math.abs((p.participates ? 1 : 0) - (1 / c.participationOdds)) * 20;
      if (p.participates) boldness += Math.abs(p.score - c.pollEstimate);
    });
    return parseFloat(boldness.toFixed(2));
  };

  const handleSubmit = async () => {
    if (!isValid || !user) return;
    const summary: PredictionSummary = {
      id: new Date().toISOString(),
      userId: user.id,
      date: new Date().toLocaleString('fr-FR'),
      predictions,
      candidates,
      boldnessScore: calculateBoldnessScore(),
    };
    const newHistory = [summary, ...history];
    setHistory(newHistory);
    try {
      await predictionService.save(summary);
    } catch (e) {
      console.error('Erreur sauvegarde Firestore', e);
    }
    setShowSummary(summary);
  };

  const handleReset = () => initializeState(candidates);

  const handleLogout = async () => {
    await firebaseAuthService.logout();
    setUser(null);
    setHistory([]);
    setCandidates([]);
  };

  // Écran de chargement auth initial
  if (authLoading) {
    return (
      <div style={{
        minHeight: '100vh', background: '#F0F2F5',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: "'Barlow', sans-serif",
      }}>
        <style>{`@keyframes pb-spin { to { transform: rotate(360deg); } }`}</style>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 44, height: 44, borderRadius: '50%',
            border: '3px solid #E8EBF0', borderTopColor: '#E8380D',
            animation: 'pb-spin 0.8s linear infinite', margin: '0 auto 16px',
          }} />
          <div style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 14, fontWeight: 600, letterSpacing: '0.1em',
            textTransform: 'uppercase', color: '#999',
          }}>Chargement…</div>
        </div>
      </div>
    );
  }

  if (!user) return <AuthScreen onAuthSuccess={setUser} />;

  const selectedCandidates = candidates.filter(c => predictions[c.id]?.participates);

  const renderContent = () => {
    if (isLoading) return (
      <div style={{ textAlign: 'center', padding: 60 }}>
        <style>{`@keyframes pb-spin2 { to { transform: rotate(360deg); } }`}</style>
        <div style={{
          width: 44, height: 44, borderRadius: '50%',
          border: '3px solid #E8EBF0', borderTopColor: '#E8380D',
          animation: 'pb-spin2 0.8s linear infinite', margin: '0 auto 16px',
        }} />
        <p style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: 16, fontWeight: 600, letterSpacing: '0.08em',
          textTransform: 'uppercase', color: '#888',
        }}>Chargement des candidats et des cotes…</p>
      </div>
    );

    if (error) return (
      <div style={{
        background: '#FFF5F3', border: '1.5px solid #FFCFC7',
        borderRadius: 8, padding: '24px 20px', textAlign: 'center',
      }}>
        <p style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: 16, fontWeight: 700, color: '#E8380D',
          letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6,
        }}>Erreur</p>
        <p style={{ color: '#555', fontSize: 14 }}>{error}</p>
      </div>
    );

    if (activeView === 'history') return <PastPredictions history={history} onView={setShowSummary} />;

    return (
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: 12,
      }}>
        {candidates.map(c => (
          <CandidateCard
            key={c.id}
            candidate={c}
            prediction={predictions[c.id]}
            onChange={handlePredictionChange}
          />
        ))}
      </div>
    );
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#F0F2F5' }}>
      <Header user={user} onLogout={handleLogout} />

      <main style={{ flexGrow: 1, maxWidth: 1280, width: '100%', margin: '0 auto', padding: '20px 20px 160px' }}>
        {/* Onglets */}
        <div style={{ display: 'flex', borderBottom: '1px solid #E8EBF0', marginBottom: 24 }}>
          {(['predict', 'history'] as const).map(view => (
            <button key={view} onClick={() => setActiveView(view)} style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: 14, fontWeight: 700,
              letterSpacing: '0.08em', textTransform: 'uppercase',
              padding: '12px 24px',
              background: 'transparent', border: 'none',
              borderBottom: activeView === view ? '3px solid #E8380D' : '3px solid transparent',
              color: activeView === view ? '#1A1D23' : '#999',
              cursor: 'pointer', transition: 'color 0.15s',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              {view === 'predict' ? 'Faire un pronostic' : 'Mes pronostics'}
              {view === 'history' && (
                <span style={{
                  background: activeView === 'history' ? '#E8380D' : '#CBD0D8',
                  color: '#fff', borderRadius: 10, padding: '1px 7px',
                  fontSize: 11, fontWeight: 700, transition: 'background 0.15s',
                }}>{history.length}</span>
              )}
            </button>
          ))}
        </div>

        {renderContent()}
      </main>

      {/* Barre sticky */}
      {activeView === 'predict' && !isLoading && !error && (
        <div style={{
          position: 'sticky', bottom: 0,
          background: '#1A1D23', borderTop: '3px solid #E8380D',
          padding: '14px 20px', zIndex: 40,
        }}>
          <div style={{
            maxWidth: 1280, margin: '0 auto',
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', gap: 16, flexWrap: 'wrap',
          }}>
            {/* Progression */}
            <div style={{ flex: 1, minWidth: 200, maxWidth: 300 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 5 }}>
                <span style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: 11, fontWeight: 700, letterSpacing: '0.12em',
                  textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)',
                }}>Total scores</span>
                <span style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: 22, fontWeight: 700,
                  color: isValid ? '#4ade80' : totalScore > 0 ? '#facc15' : '#fff',
                  transition: 'color 0.3s',
                }}>{totalScore.toFixed(1)}%</span>
              </div>
              <div style={{ height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{
                  height: '100%', width: `${Math.min(totalScore, 100)}%`,
                  background: isValid ? '#4ade80' : '#E8380D',
                  borderRadius: 3, transition: 'width 0.3s, background 0.3s',
                }} />
              </div>
            </div>

            {/* Chips candidats */}
            <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap', flex: 1 }}>
              {selectedCandidates.length === 0
                ? <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', fontStyle: 'italic' }}>Aucun candidat sélectionné</span>
                : selectedCandidates.map(c => (
                  <div key={c.id} style={{
                    display: 'flex', alignItems: 'center', gap: 5,
                    background: 'rgba(255,255,255,0.08)', borderRadius: 20,
                    padding: '4px 10px 4px 4px',
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.85)',
                  }}>
                    <div style={{
                      width: 22, height: 22, borderRadius: '50%', background: '#E8380D',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 8, fontWeight: 700, color: '#fff',
                    }}>
                      {c.name.split(' ').map((w: string) => w[0]).join('').slice(0, 3).toUpperCase()}
                    </div>
                    {predictions[c.id]?.score > 0 ? `${predictions[c.id].score}%` : '—'}
                  </div>
                ))
              }
            </div>

            {/* Boutons */}
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={handleReset} style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: 13, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
                padding: '10px 18px', background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)', borderRadius: 5, color: '#fff', cursor: 'pointer',
              }}>Réinitialiser</button>
              <button onClick={handleSubmit} disabled={!isValid} style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: 14, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                padding: '10px 24px',
                background: isValid ? '#E8380D' : 'rgba(255,255,255,0.1)',
                border: 'none', borderRadius: 5,
                color: isValid ? '#fff' : 'rgba(255,255,255,0.25)',
                cursor: isValid ? 'pointer' : 'not-allowed', transition: 'background 0.2s',
              }}>Valider le pronostic →</button>
            </div>
          </div>
        </div>
      )}

      {showSummary && <PredictionSummaryModal summary={showSummary} onClose={() => setShowSummary(null)} />}
      {showMethodology && <MethodologyModal onClose={() => setShowMethodology(false)} />}
      <Footer onOpenMethodology={() => setShowMethodology(true)} />
    </div>
  );
};

export default App;
