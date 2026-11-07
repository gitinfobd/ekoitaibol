'use client';

import { useState, useEffect } from 'react';
import { 
  collection, 
  getDocs, 
  doc, 
  updateDoc, 
  addDoc, 
  serverTimestamp, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { useAuth } from '@/lib/firebase/auth-context';
import { ShieldCheck, Check, X, Plus, FileText, Lock, LogIn, Sparkles, RefreshCw, AlertTriangle, ExternalLink } from 'lucide-react';
import LoginModal from '@/components/LoginModal';

export default function AdminPage() {
  const { user, loading: authLoading, isAdmin, signInWithGoogle } = useAuth();
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [ideas, setIdeas] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [claimAdminKey, setClaimAdminKey] = useState('');
  const [isElevating, setIsElevating] = useState(false);

  // New Project Form state
  const [newProject, setNewProject] = useState({
    title: '',
    location: '',
    goalAmount: 100000,
    description: '',
    isPilot: false
  });
  const [creatingProject, setCreatingProject] = useState(false);

  // Fetch Firestore Data
  const fetchAdminData = async () => {
    setLoadingData(true);
    try {
      // 1. Fetch Ideas
      const ideasSnapshot = await getDocs(query(collection(db, 'ideas'), orderBy('createdAt', 'desc')));
      const ideasList = ideasSnapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setIdeas(ideasList);

      // 2. Fetch Projects
      const projectsSnapshot = await getDocs(collection(db, 'projects'));
      const projectsList = projectsSnapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setProjects(projectsList);
    } catch (err) {
      console.warn('Admin fetch note:', err.message);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchAdminData();
    }
  }, [user, isAdmin]);

  // Action: Approve Idea to Public Notice Board
  const handleApproveIdea = async (id) => {
    try {
      const ideaRef = doc(db, 'ideas', id);
      await updateDoc(ideaRef, {
        status: 'PUBLISHED',
        isPublic: true,
        publishedAt: serverTimestamp()
      });
      setIdeas(prev => prev.map(item => item.id === id ? { ...item, status: 'PUBLISHED', isPublic: true } : item));
      alert(`আইডিয়া #${id} সফলভাবে অনুমোদিত হয়েছে এবং পাবলিক নোটিশ বোর্ডে প্রকাশ করা হয়েছে!`);
    } catch (err) {
      alert('অনুমোদনে সমস্যা হয়েছে: ' + err.message);
    }
  };

  // Action: Reject Idea
  const handleRejectIdea = async (id) => {
    try {
      const ideaRef = doc(db, 'ideas', id);
      await updateDoc(ideaRef, {
        status: 'REJECTED',
        isPublic: false
      });
      setIdeas(prev => prev.map(item => item.id === id ? { ...item, status: 'REJECTED', isPublic: false } : item));
      alert(`আইডিয়া #${id} বাতিল তালিকায় নেওয়া হয়েছে।`);
    } catch (err) {
      alert('বাতিলকরণে সমস্যা হয়েছে: ' + err.message);
    }
  };

  // Action: Create Real Project in Firestore
  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!newProject.title.trim() || !newProject.location.trim()) {
      alert('প্রকল্পের শিরোনাম ও এলাকা দিন।');
      return;
    }
    setCreatingProject(true);
    try {
      const docRef = await addDoc(collection(db, 'projects'), {
        title: newProject.title.trim(),
        location: newProject.location.trim(),
        goalAmount: Number(newProject.goalAmount),
        raisedAmount: 0,
        backersCount: 0,
        description: newProject.description.trim(),
        isPilot: newProject.isPilot,
        status: 'FUNDRAISING',
        createdAt: serverTimestamp()
      });
      alert('নতুন প্রকল্প সফলভাবে তৈরি হয়েছে!');
      setNewProject({ title: '', location: '', goalAmount: 100000, description: '', isPilot: false });
      fetchAdminData();
    } catch (err) {
      alert('প্রকল্প সংরক্ষণে সমস্যা: ' + err.message);
    } finally {
      setCreatingProject(false);
    }
  };

  // Superadmin Elevation Helper
  const handleClaimAdmin = async () => {
    if (!user) return;
    setIsElevating(true);
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, { role: 'SUPER_ADMIN' });
      alert('অভিনন্দন! আপনার অ্যাকাউন্টকে সুপারঅ্যাডমিন হিসেবে উন্নীত করা হয়েছে। পেজটি রিফ্রেশ দিন।');
      window.location.reload();
    } catch (err) {
      alert('ত্রুটি: ' + err.message);
    } finally {
      setIsElevating(false);
    }
  };

  if (authLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-sm text-slate-500">
        অ্যাকাউন্ট ভেরিফাই হচ্ছে...
      </div>
    );
  }

  // Not Logged In
  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto shadow-sm">
          <Lock className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">অ্যাডমিন প্রবেশদ্বার সংরক্ষিত</h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            মডারেশন কিউ এবং রিয়েল ডাটাবেস পরিচালনার জন্য অনুমোদিত অ্যাকাউন্টে সাইন-ইন করুন।
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => setLoginModalOpen(true)}
            className="w-full py-3.5 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 flex items-center justify-center gap-2 text-sm shadow-md active:scale-95 transition-all"
          >
            <LogIn className="w-4 h-4" />
            <span>Google দিয়ে সাইন-ইন করুন</span>
          </button>
        </div>

        {/* Guidance for Firebase Console */}
        <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-left space-y-2 text-[11px] text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
            <span>Google Sign-In ডোমেইন অনুমোদন নির্দেশিকা</span>
          </div>
          <p>
            Vercel-এ Google লগইন কাজ করার জন্য Firebase Console-এ আপনার Vercel ডোমেইনটি যোগ করতে হবে:
          </p>
          <a
            href="https://console.firebase.google.com/project/ekoitaibol/authentication/settings"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 font-semibold text-emerald-600 hover:underline"
          >
            <span>Firebase Console &gt; Authorized Domains</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <p className="text-[10px] text-slate-500">
            সেখানে "Add domain" দিয়ে <code className="bg-slate-200 dark:bg-slate-700 px-1 py-0.5 rounded text-emerald-600 font-mono font-bold">ekoitaibol.vercel.app</code> (ekoitaibol) যোগ করলেই গুগল লগইন চালু হবে।
          </p>
        </div>

        <LoginModal isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)} />
      </div>
    );
  }

  // Logged in but not yet elevated as Admin
  if (!isAdmin) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
          <ShieldCheck className="w-7 h-7" />
        </div>
        <div className="space-y-2">
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">অ্যাডমিন অনুমতি যাচাইকরণ</h1>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            আপনি <strong className="text-slate-800 dark:text-slate-200">{user.email}</strong> হিসেবে সাইন-ইন করেছেন। আপনি যদি এই রিপোজিটরি বা প্রজেক্টের মালিক হন, তবে নিচের বাটনে ক্লিক করে আপনার অ্যাকাউন্টে অ্যাডমিন এক্সেস সক্রিয় করতে পারেন।
          </p>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 space-y-3">
          <button
            onClick={handleClaimAdmin}
            disabled={isElevating}
            className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm"
          >
            {isElevating ? 'অনুমোদন হচ্ছে...' : 'মালিকানা নিশ্চিত করে সুপারঅ্যাডমিন সক্রিয় করুন'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>সুপারঅ্যাডমিন ও রিয়েল গভর্ন্যান্স কন্ট্রোল</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            মডারেশন ও ক্লাউড ডাটাবেস ব্যবস্থাপনা
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">লগইন ইউজার: {user.email}</p>
        </div>

        <button
          onClick={fetchAdminData}
          disabled={loadingData}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loadingData ? 'animate-spin' : ''}`} />
          <span>রিফ্রেশ ডাটা</span>
        </button>
      </div>

      {/* Real Firestore Summary Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
          <p className="text-xs text-slate-500">মোট জমাকৃত আইডিয়া</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{ideas.length}</p>
        </div>
        <div className="glass-panel p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
          <p className="text-xs text-slate-500">অনুমোদিত পাবলিক আইডিয়া</p>
          <p className="text-2xl font-black text-emerald-600 mt-1">
            {ideas.filter(i => i.status === 'PUBLISHED').length}
          </p>
        </div>
        <div className="glass-panel p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
          <p className="text-xs text-slate-500">রিভিউ অপেক্ষমাণ কিউ</p>
          <p className="text-2xl font-black text-amber-600 mt-1">
            {ideas.filter(i => i.status === 'SUBMITTED').length}
          </p>
        </div>
        <div className="glass-panel p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
          <p className="text-xs text-slate-500">ডাটাবেসে সক্রিয় প্রকল্প</p>
          <p className="text-2xl font-black text-blue-600 mt-1">{projects.length}</p>
        </div>
      </div>

      {/* Section 1: Idea Moderation Queue */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            ক্লাউড ফায়ারস্টোর আইডিয়া মডারেশন কিউ
          </h3>
          <span className="text-xs text-slate-500">
            {ideas.length} টি রেকর্ড পাওয়া গেছে
          </span>
        </div>

        {ideas.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            এখনও ডাটাবেসে কোনো আইডিয়া জমা হয়নি। <a href="/submit-idea" className="text-emerald-600 font-semibold underline">প্রথম আইডিয়া জমা দিন</a>।
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500 font-semibold">
                  <th className="py-2.5 px-3">স্ট্যাটাস</th>
                  <th className="py-2.5 px-3">শিরোনাম</th>
                  <th className="py-2.5 px-3">এলাকা</th>
                  <th className="py-2.5 px-3">প্রস্তাবক ফোন (গোপন)</th>
                  <th className="py-2.5 px-3">বাজেট</th>
                  <th className="py-2.5 px-3 text-right">মডারেশন অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {ideas.map((idea) => (
                  <tr key={idea.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        idea.status === 'PUBLISHED'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : idea.status === 'REJECTED'
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}>
                        {idea.status === 'PUBLISHED' ? 'পাবলিক' : idea.status === 'REJECTED' ? 'বাতিল' : 'নতুন জমা'}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white max-w-xs">
                      <p className="truncate">{idea.title}</p>
                      <p className="text-[10px] text-slate-400 line-clamp-1">{idea.problem}</p>
                    </td>
                    <td className="py-3 px-3 text-slate-600">{idea.districtId} · {idea.upazila}</td>
                    <td className="py-3 px-3 font-mono text-emerald-700 dark:text-emerald-400">
                      {idea.authorPhone || 'রেকর্ড নেই'}
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-700 dark:text-slate-300">
                      {idea.estimatedBudget}
                    </td>
                    <td className="py-3 px-3 text-right space-x-1.5 whitespace-nowrap">
                      {idea.status !== 'PUBLISHED' && (
                        <button
                          onClick={() => handleApproveIdea(idea.id)}
                          className="px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700"
                        >
                          পাবলিক অনুমোদন
                        </button>
                      )}
                      {idea.status !== 'REJECTED' && (
                        <button
                          onClick={() => handleRejectIdea(idea.id)}
                          className="px-2.5 py-1 rounded-md text-xs font-semibold border border-rose-300 text-rose-600 hover:bg-rose-50"
                        >
                          বাতিল
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Section 2: Create Real Project in Firestore */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              ডাটাবেসে নতুন সামাজিক প্রকল্প যোগ করুন
            </h3>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            কোনো আইডিয়া বাস্তবায়নের সিদ্ধান্ত চূড়ান্ত হলে সরাসরি ক্লাউড ডাটাবেসে প্রকল্প তৈরি করুন। এটি প্রজেক্ট পেজে প্রদর্শিত হবে।
          </p>

          <form onSubmit={handleCreateProject} className="space-y-3 pt-1">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                প্রকল্পের শিরোনাম *
              </label>
              <input
                type="text"
                value={newProject.title}
                onChange={(e) => setNewProject(prev => ({ ...prev, title: e.target.value }))}
                required
                placeholder="যেমন: রংপুর মিনি সোলার হিমাগার"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  বাস্তবায়ন এলাকা *
                </label>
                <input
                  type="text"
                  value={newProject.location}
                  onChange={(e) => setNewProject(prev => ({ ...prev, location: e.target.value }))}
                  required
                  placeholder="যেমন: মিঠাপুকুর, রংপুর"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  লক্ষ্যমাত্রা বাজেট (টাকা) *
                </label>
                <input
                  type="number"
                  value={newProject.goalAmount}
                  onChange={(e) => setNewProject(prev => ({ ...prev, goalAmount: e.target.value }))}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                সংক্ষিপ্ত বিবরণ ও কর্মসংস্থান প্রভাব
              </label>
              <textarea
                rows={2}
                value={newProject.description}
                onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                placeholder="প্রকল্পটি কীভাবে স্থানীয় কর্মসংস্থান ও কল্যাণ নিশ্চিত করবে..."
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs outline-none resize-none"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="isPilot"
                checked={newProject.isPilot}
                onChange={(e) => setNewProject(prev => ({ ...prev, isPilot: e.target.checked }))}
                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <label htmlFor="isPilot" className="text-xs text-slate-600 dark:text-slate-300">
                পাইলট প্রকল্প হিসেবে চিহ্নিত করুন
              </label>
            </div>

            <div className="pt-2 text-right">
              <button
                type="submit"
                disabled={creatingProject}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm"
              >
                {creatingProject ? 'সংরক্ষণ হচ্ছে...' : 'প্রকল্প প্রকাশ করুন'}
              </button>
            </div>
          </form>
        </div>

        {/* Existing Projects from Database */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            ডাটাবেসে চলমান প্রকল্পের তালিকা ({projects.length})
          </h3>
          <p className="text-xs text-slate-500">
            বাস্তব ডাটাবেস থেকে সংগৃহীত। কোনো অবাস্তব তথ্য কাল্পনিকভাবে উপস্থাপন করা হয় না।
          </p>

          <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
            {projects.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">এখনও কোনো প্রকল্প যোগ করা হয়নি।</p>
            ) : (
              projects.map((proj) => (
                <div
                  key={proj.id}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-1"
                >
                  <div className="flex justify-between font-bold text-slate-800 dark:text-slate-200">
                    <span>{proj.title}</span>
                    <span className="text-emerald-600">{proj.goalAmount?.toLocaleString('bn-BD')} ৳</span>
                  </div>
                  <p className="text-[11px] text-slate-500">{proj.location}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <LoginModal isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)} />
    </div>
  );
}
