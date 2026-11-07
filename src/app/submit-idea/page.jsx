'use client';

import { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { useAuth } from '@/lib/firebase/auth-context';
import { Lightbulb, Sparkles, ShieldCheck, CheckCircle2, Lock, Bot, LogIn, UserCheck } from 'lucide-react';
import { divisions, districts, categories } from '@/lib/data/districts';
import LoginModal from '@/components/LoginModal';

export default function SubmitIdeaPage() {
  const { user, signInWithGoogle, signInAsDemoUser } = useAuth();
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    phone: '',
    divisionId: 'rangpur',
    districtId: 'rangpur',
    upazila: '',
    category: 'agriculture',
    title: '',
    problem: '',
    solution: '',
    budget: '',
  });

  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionId, setSubmissionId] = useState(null);
  const [submitError, setSubmitError] = useState(null);

  const filteredDistricts = districts.filter(d => d.divisionId === formData.divisionId);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSimulateAiAssist = () => {
    if (!formData.title || !formData.problem) {
      alert('অনুগ্রহ করে আগে আইডিয়ার শিরোনাম ও সমস্যার বিবরণ লিখুন।');
      return;
    }
    setAiAnalyzing(true);
    setTimeout(() => {
      setAiAnalyzing(false);
      setAiAnalysis({
        viabilityScore: 92,
        duplicateStatus: 'অনন্য (আপনার এলাকায় কোনো সদৃশ প্রস্তাব নেই)',
        suggestedCategory: categories.find(c => c.id === formData.category)?.nameBn || 'কৃষি ও খাদ্য',
        executiveSummary: `${formData.title}-এর মাধ্যমে স্থানীয় সমস্যাটির সমাধান সম্ভব। এটি কমিউনিটি চালিত হলে খরচ কমবে এবং দ্রুত বাস্তবায়ন হবে।`,
        risks: 'প্রাথমিক ব্যয় ও স্থানীয় সুবিধাভোগীদের সম্মতি নিশ্চিত করা প্রয়োজন।'
      });
    }, 1200);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    if (!user) {
      setLoginModalOpen(true);
      return;
    }

    if (!formData.title.trim() || !formData.problem.trim() || !formData.solution.trim()) {
      alert('সবগুলো বাধ্যতামূলক তথ্য পূরণ করুন।');
      return;
    }

    setIsSubmitting(true);

    try {
      const docRef = await addDoc(collection(db, 'ideas'), {
        title: formData.title.trim(),
        problem: formData.problem.trim(),
        solution: formData.solution.trim(),
        category: formData.category,
        divisionId: formData.divisionId,
        districtId: formData.districtId,
        upazila: formData.upazila.trim() || 'সদর',
        estimatedBudget: formData.budget.trim() || 'নির্ধারিত হয়নি',
        authorUid: user.uid,
        authorName: user.displayName || 'নাগরিক',
        authorEmail: user.email || '',
        authorPhone: formData.phone.trim(),
        status: 'SUBMITTED', // Queued for admin review
        isPublic: false, // Protected until approved
        rating: 5.0,
        ratingCount: 0,
        totalStars: 0,
        aiSummary: aiAnalysis ? aiAnalysis.executiveSummary : '',
        viabilityScore: aiAnalysis ? aiAnalysis.viabilityScore : 85,
        createdAt: serverTimestamp()
      });

      setSubmissionId(docRef.id);
    } catch (err) {
      console.error('Error submitting idea to Firestore:', err);
      setSubmitError('আইডিয়া সংরক্ষণ করতে সমস্যা হয়েছে: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center space-y-3 mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300/50">
          <Sparkles className="w-3.5 h-3.5" />
          <span>১০০% ফ্রি জমাদান · কোনো আবেদন ফি নেই</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          আপনার এলাকার সমস্যা সমাধানের আইডিয়া দিন
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
          আইডিয়া জমা দিতে কোনো টাকা লাগবে না। তথ্য সরাসরি ক্লাউড ডাটাবেসে সংরক্ষিত হবে এবং মডারেশন প্যানেলে যাচাই শেষে নোটিশ বোর্ডে উন্মুক্ত করা হবে।
        </p>
      </div>

      {submissionId ? (
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-emerald-500/40 text-center space-y-5 animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            ধন্যবাদ! আপনার আইডিয়াটি সফলভাবে ডাটাবেসে জমা হয়েছে
          </h2>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs font-mono text-emerald-700 dark:text-emerald-300 max-w-md mx-auto">
            Firestore ট্র্যাকিং আইডি: <strong>{submissionId}</strong>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300 max-w-lg mx-auto leading-relaxed">
            আপনার প্রস্তাবটি <span className="font-semibold text-emerald-600">"{formData.title}"</span> বর্তমানে অ্যাডমিন রিভিউ কিউতে রয়েছে। অ্যাডমিন অনুমোদন দিলে আপনার নাম গোপন রেখে এটি সরাসরি পাবলিক নোটিশ বোর্ডে চলে আসবে।
          </p>
          <div className="pt-4 flex justify-center gap-4">
            <button
              onClick={() => {
                setSubmissionId(null);
                setAiAnalysis(null);
                setFormData({
                  phone: '',
                  divisionId: 'rangpur',
                  districtId: 'rangpur',
                  upazila: '',
                  category: 'agriculture',
                  title: '',
                  problem: '',
                  solution: '',
                  budget: '',
                });
              }}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              আরেকটি আইডিয়া দিন
            </button>
            <a
              href="/notice-board"
              className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700"
            >
              নোটিশ বোর্ড দেখুন
            </a>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          {submitError && (
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 text-rose-700 dark:text-rose-300 text-xs font-semibold">
              {submitError}
            </div>
          )}

          {/* User Sign-In Notice */}
          {!user ? (
            <div className="p-5 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-xs text-emerald-900 dark:text-emerald-200">
                <p className="font-bold text-sm">Google দিয়ে সাইন-ইন আবশ্যক:</p>
                <p>আইডিয়া জমা দিতে এবং আপনার আইডিয়ার অগ্রগতি ট্র্যাক করতে গুগল দিয়ে সাইন ইন করুন।</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setLoginModalOpen(true)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Google দিয়ে লগইন</span>
                </button>
                <button
                  type="button"
                  onClick={() => signInAsDemoUser('CITIZEN')}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-white dark:bg-slate-800 border border-emerald-300 dark:border-emerald-700 hover:bg-emerald-50 transition-colors"
                >
                  ইনস্ট্যান্ট টেস্ট সাইন-ইন
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center font-bold">
                  ✓
                </div>
                <div>
                  <span className="font-bold text-slate-900 dark:text-white">{user.displayName || 'নাগরিক'}</span>
                  <span className="text-slate-500 ml-1.5">({user.email || 'সাইন-ইন সক্রিয়'})</span>
                </div>
              </div>
              <span className="text-[11px] px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-300/50">
                যাচাইকৃত প্রস্তাবক
              </span>
            </div>
          )}

          {/* Privacy Notice Banner */}
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 flex items-start gap-3">
            <Lock className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900 dark:text-amber-200 space-y-1">
              <p className="font-bold">ব্যক্তিগত তথ্যের শতভাগ নিরাপত্তা:</p>
              <p className="leading-relaxed">
                আপনার নাম ও মোবাইল নম্বর কেবল অভ্যন্তরীণ ডাটাবেসে যোগাযোগ ও সত্যতা যাচাইয়ের জন্য রাখা হয়। পাবলিক নোটিশ বোর্ডে প্রস্তাবকের কোনো ব্যক্তিগত তথ্য প্রকাশ করা হয় না।
              </p>
            </div>
          </div>

          {/* Section 1: Contact Details (Private) */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>১. প্রস্তাবকের পরিচিতি (ডাটাবেসে সংরক্ষিত ও গোপন)</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  আপনার নাম (Google অ্যাকাউন্ট থেকে স্বয়ংক্রিয়)
                </label>
                <input
                  type="text"
                  disabled
                  value={user ? user.displayName || user.email : 'প্রথমে লগইন করুন'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-sm opacity-80 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  মোবাইল নম্বর (যাচাইয়ের জন্য গোপন থাকবে) *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  placeholder="০১৭xxxxxxxx"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Location and Category */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              ২. আইডিয়া বাস্তবায়নের ভৌগোলিক এলাকা ও ক্যাটাগরি
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  বিভাগ *
                </label>
                <select
                  name="divisionId"
                  value={formData.divisionId}
                  onChange={(e) => {
                    const div = e.target.value;
                    const firstDist = districts.find(d => d.divisionId === div)?.id || '';
                    setFormData(prev => ({ ...prev, divisionId: div, districtId: firstDist }));
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                  {divisions.map(d => (
                    <option key={d.id} value={d.id}>{d.nameBn}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  জেলা *
                </label>
                <select
                  name="districtId"
                  value={formData.districtId}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                  {filteredDistricts.map(d => (
                    <option key={d.id} value={d.id}>{d.nameBn}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  উপজেলা / ইউনিয়ন (ঐচ্ছিক)
                </label>
                <input
                  type="text"
                  name="upazila"
                  value={formData.upazila}
                  onChange={handleInputChange}
                  placeholder="যেমন: মিঠাপুকুর"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                আইডিয়ার খাত / ক্যাটাগরি *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {categories.map((c) => (
                  <button
                    type="button"
                    key={c.id}
                    onClick={() => setFormData(prev => ({ ...prev, category: c.id }))}
                    className={`p-3 rounded-xl text-xs font-semibold text-left border transition-all ${
                      formData.category === c.id
                        ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 ring-1 ring-emerald-500'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    {c.nameBn}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 3: Idea Details */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                ৩. প্রস্তাবিত আইডিয়ার বিবরণ
              </h2>
              <button
                type="button"
                onClick={handleSimulateAiAssist}
                disabled={aiAnalyzing}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 hover:bg-emerald-200 border border-emerald-300/60 transition-colors"
              >
                <Bot className="w-4 h-4" />
                <span>{aiAnalyzing ? 'AI বিশ্লেষণ করছে...' : 'AI দিয়ে যাচাই'}</span>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  আইডিয়ার শিরোনাম *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  placeholder="যেমন: কৃষকদের আলু সংরক্ষণে মিনি সোলার কোল্ডস্টোরেজ"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  সমস্যাটি কী? (কেন এই উদ্যোগ প্রয়োজন?) *
                </label>
                <textarea
                  name="problem"
                  rows={3}
                  value={formData.problem}
                  onChange={handleInputChange}
                  required
                  placeholder="আপনার এলাকার কোন সমস্যাটি সমাধান করতে চান বিস্তারিত লিখুন..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  আপনার সমাধানের বুদ্ধি কী? (কীভাবে বাস্তবায়ন হবে?) *
                </label>
                <textarea
                  name="solution"
                  rows={3}
                  value={formData.solution}
                  onChange={handleInputChange}
                  required
                  placeholder="কীভাবে এই সমস্যাটি সমাধান করা যাবে ধাপে ধাপে লিখুন..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  সম্ভাব্য বাজেট প্রাক্কলন (যদি জানা থাকে)
                </label>
                <input
                  type="text"
                  name="budget"
                  value={formData.budget}
                  onChange={handleInputChange}
                  placeholder="যেমন: ৩,৫০,০০০ ৳"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>

            {/* AI Assistant Output Card */}
            {aiAnalysis && (
              <div className="p-5 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-300/70 dark:border-emerald-700/60 space-y-3 animate-fade-in">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    AI প্রজেক্ট কো-পাইলট বিশ্লেষণ রিপোর্ট
                  </span>
                  <span className="px-2 py-0.5 rounded text-xs font-extrabold bg-emerald-600 text-white">
                    স্কোর: {aiAnalysis.viabilityScore}/১০০
                  </span>
                </div>
                <div className="text-xs text-slate-700 dark:text-slate-300 space-y-1.5 leading-relaxed">
                  <p><strong>ডুপ্লিকেট স্ট্যাটাস:</strong> {aiAnalysis.duplicateStatus}</p>
                  <p><strong>সারসংক্ষেপ:</strong> {aiAnalysis.executiveSummary}</p>
                  <p><strong>সতর্কতা ও ঝুঁকি:</strong> {aiAnalysis.risks}</p>
                </div>
              </div>
            )}
          </div>

          {/* Submit Action */}
          <div className="text-center pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-10 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-xl shadow-emerald-600/25 active:scale-95 disabled:opacity-50 transition-all text-base"
            >
              {isSubmitting ? 'ডাটাবেসে সংরক্ষণ হচ্ছে...' : 'বিনামূল্যে আইডিয়া জমা দিন'}
            </button>
            <p className="text-[11px] text-slate-500 mt-2">
              জমা দেওয়ার মাধ্যমে আপনার আইডিয়াটি ক্লাউড ফায়ারস্টোর ডাটাবেসে রিয়েল-টাইমে সংরক্ষিত হবে।
            </p>
          </div>
        </form>
      )}

      {/* Login Modal */}
      <LoginModal isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)} />
    </div>
  );
}
