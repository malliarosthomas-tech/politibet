import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  type User as FirebaseUser,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
  doc,
  setDoc,
  getDoc,
} from 'firebase/firestore';
import type { User, PredictionSummary } from '../types';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// ── Auth ──────────────────────────────────────────────────────────────────────

export const firebaseAuthService = {
  async register(username: string, email: string, password: string): Promise<User> {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: username });

    const user: User = {
      id: cred.user.uid,
      username,
      email,
      createdAt: new Date().toISOString(),
    };

    await setDoc(doc(db, 'users', cred.user.uid), user);
    return user;
  },

  async login(email: string, password: string): Promise<User> {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const snap = await getDoc(doc(db, 'users', cred.user.uid));
    if (snap.exists()) return snap.data() as User;

    // Fallback si le doc n'existe pas encore
    return {
      id: cred.user.uid,
      username: cred.user.displayName ?? email,
      email,
      createdAt: new Date().toISOString(),
    };
  },

  async logout(): Promise<void> {
    await signOut(auth);
  },

  onAuthChange(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
      if (!fbUser) return callback(null);
      const snap = await getDoc(doc(db, 'users', fbUser.uid));
      if (snap.exists()) {
        callback(snap.data() as User);
      } else {
        callback({
          id: fbUser.uid,
          username: fbUser.displayName ?? fbUser.email ?? 'Joueur',
          email: fbUser.email ?? '',
          createdAt: new Date().toISOString(),
        });
      }
    });
  },
};

// ── Predictions ───────────────────────────────────────────────────────────────

export const predictionService = {
  async save(summary: PredictionSummary): Promise<void> {
    await addDoc(collection(db, 'predictions'), {
      ...summary,
      createdAt: new Date().toISOString(),
    });
  },

  async getForUser(userId: string): Promise<PredictionSummary[]> {
    const q = query(
      collection(db, 'predictions'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => d.data() as PredictionSummary);
  },
};
