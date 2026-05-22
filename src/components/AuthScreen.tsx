import React, { useState } from 'react';
import { firebaseAuthService } from '../services/firebaseService';
import type { User } from '../types';

interface AuthScreenProps {
  onAuthSuccess: (user: User) => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      if (!email || !password) throw new Error('Veuillez remplir tous les champs.');
      if (!isLogin && !username) throw new Error("Veuillez choisir un nom d'utilisateur.");

      const user = isLogin
        ? await firebaseAuthService.login(email, password)
        : await firebaseAuthService.register(username, email, password);
      onAuthSuccess(user);
    } catch (err: unknown) {
      // Messages d'erreur Firebase traduits
      const code = (err as { code?: string })?.code;
      if (code === 'auth/user-not-found' || code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
        setError('Email ou mot de passe incorrect.');
      } else if (code === 'auth/email-already-in-use') {
        setError('Cet email est déjà utilisé.');
      } else if (code === 'auth/weak-password') {
        setError('Le mot de passe doit faire au moins 6 caractères.');
      } else if (code === 'auth/invalid-email') {
        setError('Adresse email invalide.');
      } else {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', background: '#F0F2F5',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: 16, fontFamily: "'Barlow', sans-serif",
    }}>
      <style>{`
        @keyframes pb-auth-in { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
        @keyframes pb-spin { to { transform: rotate(360deg); } }
        .pb-input {
          width: 100%; background: #F7F8FA;
          border: 1.5px solid #E8EBF0; border-radius: 6px;
          padding: 10px 14px; font-family: 'Barlow', sans-serif;
          font-size: 14px; color: #1A1D23; outline: none;
          transition: border-color 0.15s; box-sizing: border-box;
        }
        .pb-input:focus { border-color: #E8380D; background: #fff; }
        .pb-input::placeholder { color: #bbb; }
        .pb-auth-tab {
          flex: 1; padding: 10px; text-align: center;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 13px; font-weight: 700;
          letter-spacing: 0.08em; text-transform: uppercase;
          background: none; border: none;
          border-bottom: 3px solid transparent;
          cursor: pointer; transition: color 0.15s; color: #bbb;
        }
        .pb-auth-tab.active { color: #1A1D23; border-bottom-color: #E8380D; }
      `}</style>

      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28, animation: 'pb-auth-in 0.3s ease-out' }}>
        <div style={{
          background: '#E8380D', color: '#fff',
          fontFamily: "'Oswald', sans-serif",
          fontSize: 22, fontWeight: 600, letterSpacing: '0.06em',
          padding: '6px 14px', borderRadius: 5, lineHeight: 1,
        }}>PB</div>
        <div>
          <div style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 26, fontWeight: 800, letterSpacing: '0.04em',
            color: '#1A1D23', lineHeight: 1,
          }}>POLITIBET</div>
          <div style={{ fontSize: 10, color: '#999', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            Présidentielle 2027 · Paris &amp; Pronostics
          </div>
        </div>
      </div>

      {/* Card */}
      <div style={{
        width: '100%', maxWidth: 420,
        background: '#fff', borderRadius: 10,
        border: '1.5px solid #E8EBF0', overflow: 'hidden',
        animation: 'pb-auth-in 0.35s ease-out',
      }}>
        {/* Header */}
        <div style={{
          background: '#1A1D23', padding: '20px 24px 16px',
          borderBottom: '3px solid #E8380D',
        }}>
          <div style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 18, fontWeight: 700, letterSpacing: '0.06em',
            color: '#fff', marginBottom: 3,
          }}>
            {isLogin ? 'Connexion' : 'Créer un compte'}
          </div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
            {isLogin ? 'Retrouvez vos pronostics et le classement' : 'Rejoignez la compétition Politibet'}
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid #E8EBF0' }}>
          <button className={`pb-auth-tab${isLogin ? ' active' : ''}`} onClick={() => { setIsLogin(true); setError(null); }}>
            Connexion
          </button>
          <button className={`pb-auth-tab${!isLogin ? ' active' : ''}`} onClick={() => { setIsLogin(false); setError(null); }}>
            Inscription
          </button>
        </div>

        {/* Form */}
        <div style={{ padding: 24 }}>
          {error && (
            <div style={{
              background: '#FFF5F3', border: '1.5px solid #FFCFC7',
              borderRadius: 6, padding: '10px 14px',
              fontSize: 13, color: '#C0392B', marginBottom: 16,
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {!isLogin && (
              <div>
                <label style={{
                  display: 'block',
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: 11, fontWeight: 700,
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  color: '#888', marginBottom: 6,
                }}>
                  Pseudo (affiché dans le classement)
                </label>
                <input type="text" className="pb-input" value={username}
                  onChange={e => setUsername(e.target.value)} placeholder="Ex: SuperPronostiqueur" />
              </div>
            )}
            <div>
              <label style={{
                display: 'block',
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: 11, fontWeight: 700,
                letterSpacing: '0.1em', textTransform: 'uppercase',
                color: '#888', marginBottom: 6,
              }}>
                Email
              </label>
              <input type="email" className="pb-input" value={email}
                onChange={e => setEmail(e.target.value)} placeholder="votre@email.com"
                autoComplete="email" />
            </div>
            <div>
              <label style={{
                display: 'block',
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: 11, fontWeight: 700,
                letterSpacing: '0.1em', textTransform: 'uppercase',
                color: '#888', marginBottom: 6,
              }}>
                Mot de passe
              </label>
              <input type="password" className="pb-input" value={password}
                onChange={e => setPassword(e.target.value)} placeholder="••••••••"
                autoComplete={isLogin ? 'current-password' : 'new-password'} />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: 15, fontWeight: 700,
                letterSpacing: '0.1em', textTransform: 'uppercase',
                padding: 12,
                background: isLoading ? 'rgba(232,56,13,0.5)' : '#E8380D',
                border: 'none', borderRadius: 6, color: '#fff',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}
            >
              {isLoading
                ? <><span style={{
                    width: 14, height: 14, borderRadius: '50%',
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTopColor: '#fff', display: 'inline-block',
                    animation: 'pb-spin 0.7s linear infinite',
                  }} />Traitement…</>
                : isLogin ? 'Se connecter →' : "S'inscrire →"
              }
            </button>
          </form>
        </div>
      </div>

      {/* Tricolore */}
      <div style={{ display: 'flex', gap: 4, marginTop: 24, opacity: 0.35 }}>
        {['#002395', '#fff', '#ED2939'].map((c, i) => (
          <span key={i} style={{
            display: 'block', width: 6, height: 18, borderRadius: 2,
            background: c, border: c === '#fff' ? '1px solid #ddd' : 'none',
          }} />
        ))}
      </div>
    </div>
  );
};

export default AuthScreen;
