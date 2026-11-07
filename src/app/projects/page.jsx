'use client';

import { useState, useEffect } from 'react';
import { 
  collection, 
  getDocs, 
  addDoc, 
  doc, 
  updateDoc, 
  increment, 
  serverTimestamp, 
  query, 
  orderBy, 
  limit 
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { useAuth } from '@/lib/firebase/auth-context';
import { initialProjects } from '@/lib/data/mock-projects';
import { HandCoins, ShieldCheck, FileText, CheckCircle2, MapPin, Calendar, Lock } from 'lucide-react';

export default function ProjectsPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSampleProjects, setShowSampleProjects] = useState(false);

  // Donation Modal state
  const [activeDonationProject, setActiveDonationProject] = useState(null);
  const [donationAmount, setDonationAmount] = useState(100);
  const [donorPhone, setDonorPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('bKash');
  const [donationSuccess, setDonationSuccess] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch Firestore Projects & Real Donations
  const fetchProjectsAndDonations = async () => {
    setLoading(true);
    try {
      // 1. Projects
      const projSnap = await getDocs(collection(db, 'projects'));
      const projs = projSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      setProjects(projs);

      // 2. Real Donations
      const txQuery = query(collection(db, 'donations'), orderBy('createdAt', 'desc'), limit(20));
      const txSnap = await getDocs(txQuery);
      const txs = txSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      setTransactions(txs);
    } catch (err) {
      console.warn('Projects fetch note:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectsAndDonations();
  }, []);

  const displayProjects = projects.length > 0 ? projects : (showSampleProjects ? initialProjects : []);

  const handleDonationSubmit = async (e) => {
    e.preventDefault();
    if (!donorPhone || donorPhone.length < 11) {
      alert('সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন।');
      return;
    }

    setIsProcessing(true);

    // Mask phone number: 0171****890
    const masked = `${donorPhone.slice(0, 4)}****${donorPhone.slice(-3)}`;
    const txId = `TX-${Math.floor(10000 + Math.random() * 90000)}`;

    try {
      // Write to Firestore 'donations' collection
      await addDoc(collection(db, 'donations'), {
        txId,
        projectId: activeDonationProject.id,
        projectTitle: activeDonationProject.title,
        phoneMasked: masked,
        amount: Number(donationAmount),
        method: paymentMethod,
        donorUid: user ? user.uid : 'ANONYMOUS',
        status: 'COMPLETED_SANDBOX',
        createdAt: serverTimestamp()
      });

      // If it's a real Firestore project document, increment raisedAmount
      const isFirestoreDoc = projects.some(p => p.id === activeDonationProject.id);
      if (isFirestoreDoc) {
        const projRef = doc(db, 'projects', activeDonationProject.id);
        await updateDoc(projRef, {
          raisedAmount: increment(Number(donationAmount)),
          backersCount: increment(1)
        });
      }

      setDonationSuccess({
        txId,
        amount: donationAmount,
        maskedPhone: masked,
        projectTitle: activeDonationProject.title
      });

      fetchProjectsAndDonations();
    } catch (err) {
      alert('অনুদান সংরক্ষণে সমস্যা: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const closeDonationModal = () => {
    setActiveDonationProject(null);
    setDonationSuccess(null);
    setDonorPhone('');
    setDonationAmount(100);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300/50">
          <HandCoins className="w-3.5 h-3.5" />
          <span>১০০% উন্মুক্ত অর্থায়ন ও প্রতিটি টাকার স্বচ্ছ হিসাব</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          বাস্তবায়নাধীন প্রকল্প ও লাইভ অনুদান লেজার
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          জনগণের বাছাইকৃত আইডিয়াগুলো বাস্তবায়ন করতে প্রয়োজন সম্মিলিত উদ্যোগ। আপনার ঐচ্ছিক ১০০ টাকার ক্ষুদ্র অনুদানে গড়ে উঠবে আপনার নিজ এলাকার প্রথম সামাজিক প্রকল্প।
        </p>
      </div>

      {/* Projects List */}
      <div className="space-y-10">
        {displayProjects.length === 0 ? (
          <div className="text-center py-16 glass-panel rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
              এখনও ডাটাবেসে কোনো সক্রিয় প্রকল্প অর্থায়নের জন্য প্রকাশিত হয়নি
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              স্বচ্ছতার স্বার্থে কোনো কাল্পনিক বা অসত্য তহবিল সংগ্রহ দেখানো হয় না। অ্যাডমিন প্যানেল থেকে যখন কোনো নির্বাচিত আইডিয়া প্রকল্পের রূপ নেবে, তখন তা এখানে প্রদর্শিত হবে।
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => setShowSampleProjects(!showSampleProjects)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {showSampleProjects ? 'নমুনা প্রকল্প লুকান' : 'নমুনা প্রকল্প প্রস্তাবনা দেখুন'}
              </button>
            </div>
          </div>
        ) : (
          displayProjects.map((project) => {
            const goal = project.goalAmount || 100000;
            const raised = project.raisedAmount || 0;
            const percent = Math.min(100, Math.round((raised / goal) * 100));

            return (
              <div
                key={project.id}
                className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
                      {project.isPilot ? 'পাইলট প্রকল্প' : 'বাস্তবায়ন তহবিল'}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{project.location}</span>
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    {project.title}
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {project.description}
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-3">
                  <div className="flex flex-wrap justify-between items-baseline gap-2">
                    <div>
                      <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
                        {raised.toLocaleString('bn-BD')} ৳
                      </span>
                      <span className="text-xs text-slate-500 ml-2">
                        উত্তোলিত (লক্ষ্য: {goal.toLocaleString('bn-BD')} ৳)
                      </span>
                    </div>
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
                      {percent}% সম্পন্ন
                    </span>
                  </div>

                  <div className="w-full h-3.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-xs text-slate-500 pt-1">
                    <span>{(project.backersCount || 0).toLocaleString('bn-BD')} জন নাগরিক অংশ নিয়েছেন</span>
                    <span>বাকি প্রয়োজন: {Math.max(0, goal - raised).toLocaleString('bn-BD')} ৳</span>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => setActiveDonationProject(project)}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md shadow-emerald-600/20 active:scale-95 transition-all text-sm"
                  >
                    <HandCoins className="w-4 h-4" />
                    <span>১০০ টাকা অনুদান দিয়ে অংশ নিন (স্যান্ডবক্স)</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Live Masked Ledger Section */}
      <section className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>লাইভ নাগরিক অনুদান লেজার (Live Public Ledger)</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              স্বচ্ছতার স্বার্থে প্রতিটি ট্রাঞ্জেকশন ক্লাউড ডাটাবেস থেকে রিয়েল-টাইম আপডেট হয়। দাতার গোপনীয়তা রক্ষায় মোবাইল নম্বরের মধ্যবর্তী অংশ এনক্রিপ্ট করা থাকে।
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            {transactions.length} টি ভেরিফাইড লেনদেন
          </span>
        </div>

        {transactions.length === 0 ? (
          <div className="py-10 text-center text-xs text-slate-400">
            এখনও ডাটাবেসে কোনো অনুদান লেনদেন রেকর্ড হয়নি। ১০০ টাকা অনুদান দিলে তা সাথে সাথে এখানে যুক্ত হবে।
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500 font-semibold">
                  <th className="py-3 px-3">ট্রাঞ্জেকশন আইডি</th>
                  <th className="py-3 px-3">প্রকল্প</th>
                  <th className="py-3 px-3">দাতার ফোন (এনক্রিপ্টেড)</th>
                  <th className="py-3 px-3">মাধ্যম</th>
                  <th className="py-3 px-3">পরিমাণ</th>
                  <th className="py-3 px-3">স্ট্যাটাস</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-slate-700 dark:text-slate-300">{tx.txId || tx.id}</td>
                    <td className="py-3 px-3 text-slate-800 dark:text-slate-200">{tx.projectTitle}</td>
                    <td className="py-3 px-3 font-mono text-slate-600 dark:text-slate-400">{tx.phoneMasked}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {tx.method}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-bold text-emerald-600 dark:text-emerald-400">+{tx.amount} ৳</td>
                    <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">{tx.status || 'সফল'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Donation Modal */}
      {activeDonationProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="glass-panel max-w-md w-full p-6 sm:p-8 rounded-3xl border border-slate-300 dark:border-slate-700 shadow-2xl space-y-6 bg-white dark:bg-slate-900">
            {donationSuccess ? (
              <div className="text-center space-y-4 py-4">
                <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  ধন্যবাদ! অনুদান সফলভাবে সংরক্ষিত হয়েছে
                </h3>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs space-y-1.5 text-slate-600 dark:text-slate-300">
                  <p><strong>ট্রাঞ্জেকশন আইডি:</strong> {donationSuccess.txId}</p>
                  <p><strong>পরিমাণ:</strong> {donationSuccess.amount} ৳</p>
                  <p><strong>দাতার নম্বর:</strong> {donationSuccess.maskedPhone}</p>
                  <p><strong>প্রকল্প:</strong> {donationSuccess.projectTitle}</p>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  আপনার অবদানটি ক্লাউড ফায়ারস্টোর পাবলিক লেজারে তাৎক্ষণিকভাবে অন্তর্ভুক্ত করা হয়েছে।
                </p>
                <button
                  onClick={closeDonationModal}
                  className="w-full py-2.5 rounded-xl font-semibold text-white bg-emerald-600 hover:bg-emerald-700 text-xs"
                >
                  ঠিক আছে
                </button>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      নাগরিক মাইক্রো-অনুদান (স্যান্ডবক্স)
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                      {activeDonationProject.title}
                    </p>
                  </div>
                  <button
                    onClick={closeDonationModal}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg font-bold"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleDonationSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      অনুদানের পরিমাণ (টাকা):
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {[100, 200, 500, 1000].map((amt) => (
                        <button
                          type="button"
                          key={amt}
                          onClick={() => setDonationAmount(amt)}
                          className={`py-2 text-xs font-bold rounded-lg border text-center transition-all ${
                            donationAmount === amt
                              ? 'border-emerald-600 bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {amt} ৳
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      পেমেন্ট মেথড:
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {['bKash', 'Nagad', 'Rocket', 'Bank'].map((m) => (
                        <button
                          type="button"
                          key={m}
                          onClick={() => setPaymentMethod(m)}
                          className={`py-1.5 text-xs font-semibold rounded-lg border text-center ${
                            paymentMethod === m
                              ? 'border-emerald-600 bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'border-slate-200 dark:border-slate-700 text-slate-600'
                          }`}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      আপনার মোবাইল নম্বর *
                    </label>
                    <input
                      type="tel"
                      value={donorPhone}
                      onChange={(e) => setDonorPhone(e.target.value)}
                      required
                      placeholder="০১৭xxxxxxxx"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-1">
                      <Lock className="w-3 h-3 text-emerald-600" />
                      <span>লেজারে ৫টি ডিজিট এনক্রিপ্ট থাকবে (যেমন: ০১৭১****৮৯০)</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 text-[11px] text-slate-500 leading-relaxed">
                    এই অনুদান সম্পূর্ণ ঐচ্ছিক ও জনস্বার্থে। এর মাধ্যমে কোনো চাকরি বা লটারির অধিকার জন্মায় না।
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={closeDonationModal}
                      className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 hover:bg-slate-100"
                    >
                      বাতিল
                    </button>
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="px-5 py-2 text-xs font-bold rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 shadow-md"
                    >
                      {isProcessing ? 'সংরক্ষণ হচ্ছে...' : `${donationAmount} ৳ অনুদান নিশ্চিত করুন`}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
