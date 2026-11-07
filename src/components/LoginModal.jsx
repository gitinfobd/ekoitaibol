'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/firebase/auth-context';
import { LogIn, ShieldAlert, Sparkles, User, X, AlertTriangle, ExternalLink, CheckCircle2 } from 'lucide-react';

export default function LoginModal({ isOpen, onClose }) {
  const { 
    user, 
    signInWithGoogle, 
    signInWithGoogleRedirect, 
    signInAsDemoUser, 
    authError, 
    clearAuthError 
  } = useAuth();
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleGoogleLogin = () => {
    // Preserve immediate user gesture for popup
    signInWithGoogle()
      .then((res) => {
        if (res) onClose();
      })
      .catch((err) => {
        console.warn('Login modal caught:', err);
      });
  };

  const handleGoogleRedirectLogin = () => {
    signInWithGoogleRedirect().catch((err) => {
      console.warn('Login modal redirect caught:', err);
    });
  };

  const handleDemoLogin = (role) => {
    signInAsDemoUser(role);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="glass-panel max-w-md w-full p-6 sm:p-8 rounded-3xl border border-slate-300 dark:border-slate-700 shadow-2xl space-y-6 bg-white dark:bg-slate-900 relative">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg font-bold"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
            <LogIn className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            একতাই বল-এ সাইন-ইন
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            আইডিয়া জমা দিতে বা অ্যাডমিন ড্যাশবোর্ড পরিচালনা করতে প্রবেশ করুন।
          </p>
        </div>

        {/* Real Firebase Google Login Buttons */}
        <div className="space-y-2.5">
          {/* Primary: Redirect Mode (Never blocked by browser pop-up blockers) */}
          <button
            onClick={handleGoogleRedirectLogin}
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2.5 transition-all active:scale-95 disabled:opacity-50"
          >
            <svg className="w-4 h-4 bg-white rounded-full p-0.5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24Z"/>
              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.04 0 12s.45 3.82 1.25 5.42l4.03-3.15Z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98Z"/>
            </svg>
            <span>Google রিডাইরেক্ট সাইন-ইন (প্রস্তাবিত)</span>
          </button>

          {/* Secondary: Popup Mode */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center gap-2 transition-colors active:scale-95"
          >
            <span>অথবা পপআপ উইন্ডো দিয়ে চেষ্টা করুন</span>
          </button>

          {/* Error & Guidance Notice if Firebase rejects or popup blocked */}
          {authError && (
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-left space-y-2.5 animate-fade-in">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-800 dark:text-amber-300">
                <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>
                  {authError.code === 'auth/popup-blocked' 
                    ? 'ব্রাউজারে পপআপ ব্লক রয়েছে' 
                    : authError.code === 'auth/unauthorized-domain'
                    ? 'ডোমেইন অনুমতির নির্দেশিকা'
                    : 'লগইন নোটিশ'}
                </span>
              </div>
              
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {authError.code === 'auth/popup-blocked'
                  ? 'আপনার ব্রাউজারের সিকিউরিটি পপআপ উইন্ডো আটকে দিয়েছে। কোনো চিন্তা নেই! নিচের বাটনে ক্লিক করে সরাসরি রিডাইরেক্ট মোডে লগইন সম্পন্ন করুন:'
                  : authError.message}
              </p>

              {authError.code === 'auth/popup-blocked' && (
                <div className="space-y-2 pt-1">
                  <button
                    type="button"
                    onClick={handleGoogleRedirectLogin}
                    className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Google দিয়ে রিডাইরেক্ট সাইন-ইন করুন</span>
                  </button>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    💡 <strong>Chrome টিপস:</strong> ব্রাউজারের অ্যাড্রেস বারের ডান পাশে ছোট পপআপ আইকনটিতে ক্লিক করে "Always allow" সিলেক্ট করতে পারেন।
                  </p>
                </div>
              )}
              
              {authError.code === 'auth/unauthorized-domain' && (
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl text-[11px] text-slate-600 dark:text-slate-400 space-y-1 border border-slate-200 dark:border-slate-800">
                  <p className="font-semibold text-slate-800 dark:text-slate-200">Firebase Console-এ সমাধান:</p>
                  <p>১. <a href="https://console.firebase.google.com/project/ekoitaibol/authentication/settings" target="_blank" rel="noreferrer" className="text-emerald-600 underline inline-flex items-center gap-0.5">Firebase Console Settings <ExternalLink className="w-3 h-3" /></a> এ যান।</p>
                  <p>২. <strong>Authorized domains</strong> এ <strong>Add domain</strong> ক্লিক করে <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-emerald-600 font-mono">ekoitaibol.vercel.app</code> যোগ করুন।</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Instant Testing Bypass Options */}
        <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2.5 text-center">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            অথবা ডোমেইন এপ্রুভালের সময়ে ইনস্ট্যান্ট টেস্ট মোড:
          </p>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleDemoLogin('CITIZEN')}
              className="py-2.5 px-3 rounded-xl text-xs font-semibold border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center gap-1.5 transition-colors"
            >
              <User className="w-3.5 h-3.5 text-emerald-600" />
              <span>নাগরিক টেস্ট লগইন</span>
            </button>

            <button
              onClick={() => handleDemoLogin('SUPER_ADMIN')}
              className="py-2.5 px-3 rounded-xl text-xs font-bold border border-amber-300 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 hover:bg-amber-100/50 flex items-center justify-center gap-1.5 transition-colors"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
              <span>অ্যাডমিন টেস্ট লগইন</span>
            </button>
          </div>
          <p className="text-[10px] text-slate-400">
            ইনস্ট্যান্ট টেস্ট মোডে আপনি এখনই পূর্ণ ডাটাবেস ও অ্যাডমিন কিউ টেস্ট করতে পারবেন।
          </p>
        </div>
      </div>
    </div>
  );
}
