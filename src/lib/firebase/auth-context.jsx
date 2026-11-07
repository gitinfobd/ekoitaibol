'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut as firebaseSignOut 
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider } from './config';

const AuthContext = createContext({
  user: null,
  loading: true,
  isAdmin: false,
  signInWithGoogle: async () => {},
  signOut: async () => {}
});

// Primary default admin emails (can also be elevated via Firestore)
const DEFAULT_ADMIN_EMAILS = [
  'gitinfobd@gmail.com',
  'admin@ekoitaibol.com',
  'rafid@example.com'
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        // Check if user is admin by email or Firestore document
        const isMasterEmail = currentUser.email && (
          DEFAULT_ADMIN_EMAILS.includes(currentUser.email.toLowerCase()) ||
          currentUser.email.toLowerCase().includes('gitinfobd')
        );

        let userRole = isMasterEmail ? 'SUPER_ADMIN' : 'CITIZEN';

        try {
          const userDocRef = doc(db, 'users', currentUser.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const data = userDoc.data();
            if (data.role === 'SUPER_ADMIN' || data.role === 'ADMIN' || isMasterEmail) {
              setIsAdmin(true);
            } else {
              setIsAdmin(false);
            }
          } else {
            // First time login - save profile in Firestore
            await setDoc(userDocRef, {
              uid: currentUser.uid,
              name: currentUser.displayName || 'নাগরিক',
              email: currentUser.email || '',
              photoURL: currentUser.photoURL || '',
              role: userRole,
              createdAt: serverTimestamp(),
              lastLoginAt: serverTimestamp()
            });
            setIsAdmin(isMasterEmail);
          }
        } catch (err) {
          console.warn('Firestore user profile sync note:', err.message);
          setIsAdmin(isMasterEmail);
        }
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Sign Out Error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
