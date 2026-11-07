'use client';

import { useState, useEffect } from 'react';
import { 
  collection, 
  getDocs, 
  query, 
  where, 
  doc, 
  updateDoc, 
  arrayUnion, 
  getDoc 
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { useAuth } from '@/lib/firebase/auth-context';
import { divisions, districts, categories } from '@/lib/data/districts';
import { initialIdeas } from '@/lib/data/mock-ideas';
import { Star, MessageSquarePlus, ThumbsUp, AlertTriangle, Lightbulb, MapPin, Search, Sparkles, Check, RefreshCw } from 'lucide-react';

export default function NoticeBoardPage() {
  const { user, signInWithGoogle } = useAuth();
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDivision, setSelectedDivision] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showDemoFallback, setShowDemoFallback] = useState(false);
  
  // Feedback modal
  const [activeIdeaForFeedback, setActiveIdeaForFeedback] = useState(null);
  const [feedbackType, setFeedbackType] = useState('positive');
  const [feedbackText, setFeedbackText] = useState('');
  const [votedIdeas, setVotedIdeas] = useState({});

  const fetchNoticeBoardIdeas = async () => {
    setLoading(true);
    try {
      // Query published ideas from Firestore
      const q = query(collection(db, 'ideas'), where('isPublic', '==', true));
      const querySnapshot = await getDocs(q);
      const list = querySnapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setIdeas(list);
    } catch (err) {
      console.warn('Notice board fetch note:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNoticeBoardIdeas();
  }, []);

  const displayIdeas = ideas.length > 0 ? ideas : (showDemoFallback ? initialIdeas : []);

  const filteredIdeas = displayIdeas.filter(idea => {
    if (selectedCategory !== 'all' && idea.category !== selectedCategory) return false;
    if (selectedDivision !== 'all') {
      const dist = districts.find(d => d.id === idea.districtId);
      if (dist && dist.divisionId !== selectedDivision) return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = (idea.title || '').toLowerCase().includes(q);
      const matchSummary = (idea.summary || idea.solution || '').toLowerCase().includes(q);
      const matchLoc = (idea.upazila || '').toLowerCase().includes(q);
      if (!matchTitle && !matchSummary && !matchLoc) return false;
    }
    return true;
  });

  // Real Star Rating in Firestore
  const handleStarRating = async (ideaId, starCount) => {
    if (votedIdeas[ideaId]) {
      alert('আপনি ইতিমধ্যে এই আইডিয়াটিতে রেটিং দিয়েছেন!');
      return;
    }

    try {
      // Check if it's a Firestore document
      const isFirestoreDoc = ideas.some(i => i.id === ideaId);
      if (isFirestoreDoc) {
        const ideaRef = doc(db, 'ideas', ideaId);
        const currentDoc = await getDoc(ideaRef);
        if (currentDoc.exists()) {
          const data = currentDoc.data();
          const currentCount = data.ratingCount || 0;
          const currentStars = data.totalStars || (data.rating ? data.rating * currentCount : 0);
          const newCount = currentCount + 1;
          const newStars = currentStars + starCount;
          const newRating = Number((newStars / newCount).toFixed(1));

          await updateDoc(ideaRef, {
            ratingCount: newCount,
            totalStars: newStars,
            rating: newRating
          });
        }
      }

      setIdeas(prev => prev.map(item => {
        if (item.id === ideaId) {
          const newCount = (item.ratingCount || 0) + 1;
          const newRating = Number((((item.rating || 5) * (item.ratingCount || 1) + starCount) / newCount).toFixed(1));
          return { ...item, rating: newRating, ratingCount: newCount };
        }
        return item;
      }));

      setVotedIdeas(prev => ({ ...prev, [ideaId]: starCount }));
    } catch (err) {
      alert('রেটিং সংরক্ষণে ত্রুটি: ' + err.message);
    }
  };

  // Real Critique in Firestore
  const handleAddCritique = async (e) => {
    e.preventDefault();
    if (!feedbackText.trim() || !activeIdeaForFeedback) return;

    const newCritique = {
      id: `c-${Date.now()}`,
      author: user ? user.displayName || 'নাগরিক' : 'সচেতন নাগরিক',
      type: feedbackType,
      text: feedbackText.trim(),
      createdAt: new Date().toISOString()
    };

    try {
      const isFirestoreDoc = ideas.some(i => i.id === activeIdeaForFeedback.id);
      if (isFirestoreDoc) {
        const ideaRef = doc(db, 'ideas', activeIdeaForFeedback.id);
        await updateDoc(ideaRef, {
          critiques: arrayUnion(newCritique)
        });
      }

      setIdeas(prev => prev.map(item => {
        if (item.id === activeIdeaForFeedback.id) {
          return {
            ...item,
            critiques: [...(item.critiques || []), newCritique]
          };
        }
        return item;
      }));

      setFeedbackText('');
      setActiveIdeaForFeedback(null);
    } catch (err) {
      alert('পরামর্শ সংরক্ষণে সমস্যা: ' + err.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300/50">
          <Sparkles className="w-3.5 h-3.5" />
          <span>পাবলিক নোটিশ বোর্ড · অনুমোদিত নাগরিক প্রস্তাবনাসমূহ</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          নাগরিক প্রস্তাবনা ও জন-মূল্যায়ন বোর্ড
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          এখানে জমাকৃত অনুমোদিত সব আইডিয়া উন্মুক্ত। নিরপেক্ষতা রক্ষার্থে কোনো আইডিয়াতেই প্রস্তাবকের নাম দৃশ্যমান থাকে না। ৫-স্টার পর্যন্ত রেটিং দিন এবং গঠনমূলক পরামর্শের মাধ্যমে আইডিয়াকে নিখুঁত করতে সাহায্য করুন।
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="আইডিয়ার নাম বা উপজেলা খুঁজুন..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          <div>
            <select
              value={selectedDivision}
              onChange={(e) => setSelectedDivision(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
            >
              <option value="all">সব বিভাগ (৬৪ জেলা)</option>
              {divisions.map(d => (
                <option key={d.id} value={d.id}>{d.nameBn} বিভাগ</option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
            >
              <option value="all">সব ক্যাটাগরি</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.nameBn}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Ideas Grid */}
      <div className="space-y-6">
        {loading ? (
          <div className="text-center py-16 glass-panel rounded-2xl">
            <RefreshCw className="w-6 h-6 text-emerald-600 animate-spin mx-auto mb-2" />
            <p className="text-xs text-slate-500">ক্লাউড ডাটাবেস থেকে আইডিয়া লোড হচ্ছে...</p>
          </div>
        ) : filteredIdeas.length === 0 ? (
          <div className="text-center py-16 glass-panel rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <p className="text-slate-600 dark:text-slate-300 font-semibold text-sm">
              এখনও পাবলিক নোটিশ বোর্ডে কোনো আইডিয়া প্রকাশিত হয়নি।
            </p>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              কোনো অবাস্তব বা বানোয়াট তথ্য প্রদর্শন না করে শতভাগ সত্যতা নিশ্চিত করা হয়। আপনি আপনার এলাকার সমস্যা সমাধানের প্রথম আইডিয়াটি জমা দিন।
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <a
                href="/submit-idea"
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md"
              >
                প্রথম আইডিয়া জমা দিন
              </a>
              <button
                onClick={() => setShowDemoFallback(!showDemoFallback)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {showDemoFallback ? 'নমুনা উদাহরণ লুকান' : 'নমুনা উদাহরণ দেখুন'}
              </button>
            </div>
          </div>
        ) : (
          filteredIdeas.map((idea, index) => {
            const districtObj = districts.find(d => d.id === idea.districtId);
            const userRating = votedIdeas[idea.id];

            return (
              <div
                key={idea.id}
                className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500/40 transition-all space-y-6"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-emerald-600 text-white font-extrabold text-sm flex items-center justify-center">
                      #{index + 1}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{districtObj?.nameBn || idea.districtId || 'রংপুর'} · {idea.upazila}</span>
                    </span>
                    <span className="px-2.5 py-0.5 rounded text-[11px] font-medium bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300/40">
                      {categories.find(c => c.id === idea.category)?.nameBn || 'আইডিয়া'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center text-amber-500">
                      <Star className="w-5 h-5 fill-current" />
                      <span className="font-extrabold text-base ml-1.5 text-slate-900 dark:text-white">
                        {idea.rating || 5.0}
                      </span>
                    </div>
                    <span className="text-xs text-slate-500">
                      ({idea.ratingCount || 0} ভোট)
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                    {idea.title}
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {idea.summary || idea.problem}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
                    <p className="text-xs font-bold text-rose-600 dark:text-rose-400 mb-1">চিহ্নিত সমস্যা:</p>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{idea.problem}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
                    <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-1">প্রস্তাবিত সমাধান:</p>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{idea.solution}</p>
                  </div>
                </div>

                {idea.critiques && idea.critiques.length > 0 && (
                  <div className="space-y-2.5 pt-2">
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      নাগরিক পর্যালোচনা ও যৌক্তিক সমালোচনা ({idea.critiques.length}):
                    </p>
                    <div className="space-y-2">
                      {idea.critiques.map((c) => (
                        <div
                          key={c.id}
                          className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs flex items-start gap-2.5"
                        >
                          {c.type === 'positive' && <ThumbsUp className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />}
                          {c.type === 'negative' && <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />}
                          {c.type === 'upgrade' && <Lightbulb className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />}
                          <div className="space-y-0.5 flex-grow">
                            <span className="font-semibold text-slate-800 dark:text-slate-200">
                              {c.author} · {c.type === 'positive' ? 'ইতিবাচক দিক' : c.type === 'negative' ? 'সীমাবদ্ধতা/ঝুঁকি' : 'উন্নয়ন প্রস্তাব'}
                            </span>
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{c.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      আপনার মূল্যায়ন:
                    </span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => handleStarRating(idea.id, star)}
                          title={`${star} স্টার দিন`}
                          className="p-1 text-slate-300 dark:text-slate-600 hover:text-amber-400 hover:scale-125 transition-all"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              userRating && userRating >= star
                                ? 'text-amber-500 fill-current'
                                : ''
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                    {userRating && (
                      <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> রেটিং গৃহীত
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => setActiveIdeaForFeedback(idea)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <MessageSquarePlus className="w-4 h-4 text-emerald-600" />
                    <span>সমালোচনা বা পরামর্শ দিন</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal for Adding Critique */}
      {activeIdeaForFeedback && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="glass-panel max-w-lg w-full p-6 sm:p-8 rounded-3xl border border-slate-300 dark:border-slate-700 shadow-2xl space-y-5 bg-white dark:bg-slate-900">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  যৌক্তিক সমালোচনা ও পরামর্শ প্রদান
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                  আইডিয়া: {activeIdeaForFeedback.title}
                </p>
              </div>
              <button
                onClick={() => setActiveIdeaForFeedback(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddCritique} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  মতামতের ধরন নির্বাচন করুন:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setFeedbackType('positive')}
                    className={`py-2 text-xs font-semibold rounded-lg border text-center ${
                      feedbackType === 'positive'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600'
                    }`}
                  >
                    ইতিবাচক দিক
                  </button>
                  <button
                    type="button"
                    onClick={() => setFeedbackType('negative')}
                    className={`py-2 text-xs font-semibold rounded-lg border text-center ${
                      feedbackType === 'negative'
                        ? 'border-amber-600 bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600'
                    }`}
                  >
                    ঝুঁকি / সীমাবদ্ধতা
                  </button>
                  <button
                    type="button"
                    onClick={() => setFeedbackType('upgrade')}
                    className={`py-2 text-xs font-semibold rounded-lg border text-center ${
                      feedbackType === 'upgrade'
                        ? 'border-blue-600 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600'
                    }`}
                  >
                    উন্নয়ন প্রস্তাব
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  আপনার মতামত বিস্তারিত লিখুন:
                </label>
                <textarea
                  rows={4}
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  required
                  placeholder="যৌক্তিক ও গঠনমূলক পরামর্শ লিখুন যা এই প্রস্তাবটির বাস্তবায়নকে নিখুঁত করতে পারে..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveIdeaForFeedback(null)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 shadow-md"
                >
                  মতামত প্রকাশ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
