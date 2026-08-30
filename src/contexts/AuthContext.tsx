import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut,
  User as FirebaseUser 
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from '../lib/firebase';
import { UserProfile, UserRole } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (name: string, email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  demoLogin: (role: UserRole) => void;
  updateProfileImage: (url: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Predefined Demo Profiles for Evaluation
export const DEMO_USER: UserProfile = {
  uid: 'demo-user-123',
  name: 'Alex Student',
  email: 'user@crowdmap.edu',
  role: 'USER',
  profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  createdAt: '2026-08-01T10:00:00Z',
};

export const DEMO_ADMIN: UserProfile = {
  uid: 'demo-admin-999',
  name: 'Campus Administrator',
  email: 'admin@crowdmap.edu',
  role: 'ADMIN',
  profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
  createdAt: '2026-07-01T08:00:00Z',
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Start UNAUTHENTICATED (null) so user experiences authentic Login/Register workflow
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!isFirebaseConfigured || !auth.onAuthStateChanged) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
      if (fbUser) {
        try {
          const userDocRef = doc(db, 'users', fbUser.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            setUser(userDoc.data() as UserProfile);
          } else {
            const newUser: UserProfile = {
              uid: fbUser.uid,
              name: fbUser.displayName || fbUser.email?.split('@')[0] || 'User',
              email: fbUser.email || '',
              role: 'USER', // Always default to USER
              createdAt: new Date().toISOString(),
            };
            setUser(newUser);
          }
        } catch (e) {
          console.warn('Error fetching user profile from Firestore:', e);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => {
    if (isFirebaseConfigured && auth.signInWithEmailAndPassword) {
      await signInWithEmailAndPassword(auth, email, pass);
    } else {
      // Demo authentication logic
      const lowerEmail = email.toLowerCase();
      if (lowerEmail.includes('admin')) {
        setUser(DEMO_ADMIN);
      } else {
        setUser({
          ...DEMO_USER,
          email,
          name: email.split('@')[0] || 'Alex Student',
        });
      }
    }
  };

  const register = async (name: string, email: string, pass: string) => {
    if (isFirebaseConfigured && auth.createUserWithEmailAndPassword) {
      const userCred = await createUserWithEmailAndPassword(auth, email, pass);
      const newUser: UserProfile = {
        uid: userCred.user.uid,
        name,
        email,
        role: 'USER', // Strict USER creation
        createdAt: new Date().toISOString(),
      };
      await setDoc(doc(db, 'users', userCred.user.uid), newUser);
      setUser(newUser);
    } else {
      const newUser: UserProfile = {
        uid: `user-${Date.now()}`,
        name,
        email,
        role: 'USER',
        createdAt: new Date().toISOString(),
      };
      setUser(newUser);
    }
  };

  const logout = async () => {
    if (isFirebaseConfigured && auth.signOut) {
      try {
        await firebaseSignOut(auth);
      } catch (err) {
        console.warn('Firebase logout warning:', err);
      }
    }
    setUser(null);
  };

  const demoLogin = (role: UserRole) => {
    if (role === 'ADMIN') {
      setUser(DEMO_ADMIN);
    } else {
      setUser(DEMO_USER);
    }
  };

  const updateProfileImage = async (url: string) => {
    if (!user) return;
    const updated = { ...user, profileImage: url, updatedAt: new Date().toISOString() };
    setUser(updated);
    if (isFirebaseConfigured && db.collection) {
      try {
        await setDoc(doc(db, 'users', user.uid), { profileImage: url, updatedAt: new Date().toISOString() }, { merge: true });
      } catch (err) {
        console.warn('Error updating Firestore profile image:', err);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, demoLogin, updateProfileImage }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
