'use client';

import { useState, useEffect } from 'react';
import { Lightbulb, Sparkles, ShieldCheck, CheckCircle2, AlertCircle, ArrowRight, Bot, Lock } from 'lucide-react';
import { divisions, districts, categories } from '@/lib/data/districts';

export default function SubmitIdeaPage() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
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
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('ekotai_user');
    if (saved) {
      try {
        const u = JSON.parse(saved);
        setUser(u);
        setFormData(prev => ({ ...prev, fullName: u.name || '' }));
      } catch (e) {}
    }
  }, []);

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
        duplicateStatus: 'অনন্য (রংপুর অঞ্চলে কোনো ডুপ্লিকেট পাওয়া যায়নি)',
        suggestedCategory: categories.find(c => c.id === formData.category)?.nameBn || 'কৃষি ও খাদ্য',
        executiveSummary: `${formData.title}-এর মাধ্যমে স্থানীয় সমস্যাটির সমাধান সম্ভব। এটি কমিউনিটি চালিত হলে খরচ কমবে এবং দ্রুত বাস্তবায়ন হবে।`,
        risks: 'প্রাথমিক বিদ্যুৎ ব্যাকআপ ও স্থানীয় কৃষকদের সমবায় সম্মতি নিশ্চিত করা প্রয়োজন।'
      });
    }, 1200);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.problem || !formData.solution) {
      alert('সবগুলো বাধ্যতামূলক তথ্য পূরণ করুন।');
      return;
    }
    setSubmitted(true);
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
          আইডিয়া জমা দিতে কোনো টাকা লাগবে না। AI আপনার প্রস্তাবটিকে গোছাতে সাহায্য করবে এবং মাসের নোটিশ বোর্ডে জনগণ নিরপেক্ষভাবে রেটিং দেবে।
        </p>
      </div>

      {submitted ? (
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-emerald-500/40 text-center space-y-5 animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            ধন্যবাদ! আপনার আইডিয়াটি সফলভাবে গৃহীত হয়েছে
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 max-w-lg mx-auto leading-relaxed">
            অভ্যন্তরীণ AI যাচাইকরণ শেষে আপনার প্রস্তাবটি <span className="font-semibold text-emerald-600">"{formData.title}"</span> জনস্বার্থে নাম গোপন রেখে এই মাসের শেষ ১০ দিনের পাবলিক নোটিশ বোর্ডে ভোটিংয়ের জন্য প্রকাশিত হবে।
          </p>
          <div className="pt-4 flex justify-center gap-4">
            <button
              onClick={() => {
                setSubmitted(false);
                setAiAnalysis(null);
                setFormData({
                  fullName: '',
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
          {/* Privacy Notice Banner */}
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 flex items-start gap-3">
            <Lock className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900 dark:text-amber-200 space-y-1">
              <p className="font-bold">ব্যক্তিগত তথ্যের শতভাগ নিরাপত্তা:</p>
              <p className="leading-relaxed">
                আপনার নাম ও মোবাইল নম্বর কেবল অভ্যন্তরীণ যোগাযোগ ও সত্যতা যাচাইয়ের জন্য নেওয়া হচ্ছে। পাবলিক নোটিশ বোর্ডে বা ভোটারদের কাছে আপনার কোনো ব্যক্তিগত তথ্য প্রকাশ করা হবে না।
              </p>
            </div>
          </div>

          {/* Section 1: Contact Details (Private) */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>১. প্রস্তাবকের পরিচিতি (সম্পূর্ণ গোপন থাকবে)</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  আপনার পূর্ণ নাম *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  placeholder="যেমন: মোঃ রাফিদ হাসান"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  মোবাইল নম্বর (যাচাইয়ের জন্য) *
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
                <span>{aiAnalyzing ? 'AI বিশ্লেষণ করছে...' : 'AI কো-পাইলট দিয়ে যাচাই'}</span>
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
              className="w-full sm:w-auto px-10 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-xl shadow-emerald-600/25 active:scale-95 transition-all text-base"
            >
              বিনামূল্যে আইডিয়া জমা দিন
            </button>
            <p className="text-[11px] text-slate-500 mt-2">
              জমা দেওয়ার মাধ্যমে আপনি একতাই বলের উন্মুক্ত জনস্বার্থ নীতিমালার সাথে একমত পোষণ করছেন।
            </p>
          </div>
        </form>
      )}
    </div>
  );
}
