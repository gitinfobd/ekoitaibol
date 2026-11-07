'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signInWithRedirect,
  getRedirectResult,
  signOut as firebaseSignOut 
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider } from './config';

const AuthContext = createContext({
  user: null,
  loading: true,
  isAdmin: false,
  authError: null,
  clearAuthError: () => {},
  signInWithGoogle: async () => {},
  signInWithGoogleRedirect: async () => {},
  signOut: async () => {}
});

// Primary default admin emails
const DEFAULT_ADMIN_EMAILS = [
  'gitinfobd@gmail.com',
  'admin@ekoitaibol.com',
  'rafid@example.com'
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    // Listen for redirect login result if user returns from Google
    getRedirectResult(auth).then((result) => {
      if (result && result.user) {
        console.log('Redirect Sign-In successful for:', result.user.email);
      }
    }).catch((err) => {
      console.warn('Redirect result notice:', err.code, err.message);
    });

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

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
    setAuthError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    } catch (error) {
      console.warn('Google Sign-In Error:', error.code, error.message);
      
      // Auto-fallback to redirect if popup is blocked
      if (error.code === 'auth/popup-blocked') {
        try {
          console.log('Popup blocked by browser. Automatically redirecting to Google OAuth...');
          await signInWithRedirect(auth, googleProvider);
          return null;
        } catch (redirectError) {
          console.error('Redirect fallback error:', redirectError);
        }
      }

      let friendlyMessage = 'Google Sign-In সম্পন্ন করা যায়নি।';
      let errorType = 'general';

      if (error.code === 'auth/unauthorized-domain') {
        errorType = 'unauthorized-domain';
        friendlyMessage = 'ডোমেইন পারমিশন প্রয়োজন: Firebase Console -> Authentication -> Settings -> Authorized Domains-এ "ekoitaibol.vercel.app" ডোমেইনটি যোগ করতে হবে।';
      } else if (error.code === 'auth/operation-not-allowed') {
        errorType = 'operation-not-allowed';
        friendlyMessage = 'Firebase Console -> Authentication -> Sign-in method-এ Google প্রদানকারীকে সক্রিয় (Enable) করতে হবে।';
      } else if (error.code === 'auth/popup-blocked') {
        errorType = 'popup-blocked';
        friendlyMessage = 'ব্রাউজারে পপআপ ব্লক রয়েছে। নিচের "Google রিডাইরেক্ট সাইন-ইন" বাটনে ক্লিক করুন (এতে কোনো পপআপ অনুমোদন লাগে না)।';
      } else if (error.code === 'auth/popup-closed-by-user') {
        friendlyMessage = 'লগইন উইন্ডোটি বন্ধ করে দেওয়া হয়েছে। আবার চেষ্টা করুন।';
      }

      const errPayload = {
        code: error.code,
        message: friendlyMessage,
        type: errorType,
        original: error.message
      };

      setAuthError(errPayload);
      throw errPayload;
    }
  };

  const signInWithGoogleRedirect = async () => {
    setAuthError(null);
    try {
      await signInWithRedirect(auth, googleProvider);
    } catch (error) {
      console.error('Google Redirect Error:', error.code, error.message);
      const errPayload = {
        code: error.code,
        message: 'Google Redirect সম্পন্ন করা যায়নি: ' + error.message,
        type: 'general',
        original: error.message
      };
      setAuthError(errPayload);
      throw errPayload;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
      setIsAdmin(false);
    } catch (error) {
      console.error('Sign Out Error:', error);
      setUser(null);
      setIsAdmin(false);
    }
  };

  const clearAuthError = () => setAuthError(null);

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      isAdmin, 
      authError, 
      clearAuthError,
      signInWithGoogle, 
      signInWithGoogleRedirect, 
      signOut 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
