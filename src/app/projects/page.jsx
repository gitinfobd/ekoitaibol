'use client';

import { useState } from 'react';
import { initialProjects, liveLedger } from '@/lib/data/mock-projects';
import { HandCoins, ShieldCheck, FileText, CheckCircle2, MapPin, Calendar, Clock, CreditCard, ChevronRight, Lock } from 'lucide-react';

export default function ProjectsPage() {
  const [projects, setProjects] = useState(initialProjects);
  const [transactions, setTransactions] = useState(liveLedger);
  const [activeDonationProject, setActiveDonationProject] = useState(null);
  const [donationAmount, setDonationAmount] = useState(100);
  const [donorPhone, setDonorPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('bKash');
  const [donationSuccess, setDonationSuccess] = useState(null);

  const handleDonationSubmit = (e) => {
    e.preventDefault();
    if (!donorPhone || donorPhone.length < 11) {
      alert('সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন।');
      return;
    }

    // Mask phone number: 0171****890
    const masked = `${donorPhone.slice(0, 4)}****${donorPhone.slice(-3)}`;
    const txId = `TX-${Math.floor(1000 + Math.random() * 9000)}`;

    const newTx = {
      id: txId,
      projectId: activeDonationProject.id,
      projectTitle: activeDonationProject.title.slice(0, 20),
      phoneMasked: masked,
      amount: Number(donationAmount),
      method: paymentMethod,
      time: 'এইমাত্র'
    };

    // Update transactions & project raised amount
    setTransactions(prev => [newTx, ...prev]);
    setProjects(prev => prev.map(p => {
      if (p.id === activeDonationProject.id) {
        return {
          ...p,
          raisedAmount: p.raisedAmount + Number(donationAmount),
          backersCount: p.backersCount + 1
        };
      }
      return p;
    }));

    setDonationSuccess({
      txId,
      amount: donationAmount,
      maskedPhone: masked,
      projectTitle: activeDonationProject.title
    });
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
        {projects.map((project) => {
          const percent = Math.min(100, Math.round((project.raisedAmount / project.goalAmount) * 100));

          return (
            <div
              key={project.id}
              className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6"
            >
              {/* Top Meta */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
                    চলমান বাস্তবায়ন
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{project.location}</span>
                  </span>
                </div>
                <div className="text-xs text-slate-500 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>সময়সীমা: {project.targetDate} পর্যন্ত</span>
                </div>
              </div>

              {/* Title & Description */}
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {project.title}
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {project.description}
                </p>
              </div>

              {/* Progress and Funding Status */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-3">
                <div className="flex flex-wrap justify-between items-baseline gap-2">
                  <div>
                    <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
                      {project.raisedAmount.toLocaleString('bn-BD')} ৳
                    </span>
                    <span className="text-xs text-slate-500 ml-2">
                      উত্তোলিত (লক্ষ্য: {project.goalAmount.toLocaleString('bn-BD')} ৳)
                    </span>
                  </div>
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
                    {percent}% সম্পন্ন
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-3.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                    style={{ width: `${percent}%` }}
                  />
                </div>

                <div className="flex justify-between text-xs text-slate-500 pt-1">
                  <span>{project.backersCount.toLocaleString('bn-BD')} জন নাগরিক অংশ নিয়েছেন</span>
                  <span>বাকি প্রয়োজন: {(project.goalAmount - project.raisedAmount).toLocaleString('bn-BD')} ৳</span>
                </div>
              </div>

              {/* Budget Breakdown & Employment Impact */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800 space-y-2">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    বাজেট বণ্টন তালিকা
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                    {project.budgetBreakdown.map((b, i) => (
                      <li key={i} className="flex justify-between border-b border-slate-200/60 dark:border-slate-700/40 pb-1">
                        <span>{b.item}</span>
                        <span className="font-bold text-slate-900 dark:text-white">{b.cost}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 space-y-2">
                  <h4 className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                    স্থানীয় কর্মসংস্থান ও কল্যাণ সুবিধা
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {project.employmentImpact}
                  </p>
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold pt-1">
                    ✓ শ্রম আইন ২০০৬ ও সর্বজনীন পেনশন স্কিমে তালিকাভুক্ত
                  </p>
                </div>
              </div>

              {/* Audited Expenses (if any) */}
              {project.expenses && project.expenses.length > 0 && (
                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-emerald-600" />
                    <span>অডিটকৃত খরচের খতিয়ান ({project.expenses.length})</span>
                  </h4>
                  <div className="space-y-1.5">
                    {project.expenses.map((exp, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 text-xs"
                      >
                        <div>
                          <span className="font-semibold text-slate-800 dark:text-slate-200">{exp.title}</span>
                          <span className="text-[10px] text-slate-400 ml-2">({exp.date} · ভাউচার #{exp.voucherId})</span>
                        </div>
                        <span className="font-bold text-rose-600 dark:text-rose-400">-{exp.amount.toLocaleString('bn-BD')} ৳</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Button */}
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setActiveDonationProject(project)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md shadow-emerald-600/20 active:scale-95 transition-all text-sm"
                >
                  <HandCoins className="w-4 h-4" />
                  <span>১০০ টাকা অনুদান দিয়ে অংশ নিন</span>
                </button>
              </div>
            </div>
          );
        })}
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
              স্বচ্ছতার স্বার্থে প্রতিটি ট্রাঞ্জেকশন রিয়েল-টাইম আপডেট হয়। দাতার গোপনীয়তা রক্ষায় মোবাইল নম্বরের মধ্যবর্তী অংশ এনক্রিপ্ট করা।
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            সর্বমোট {transactions.length} টি লেনদেন
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500 font-semibold">
                <th className="py-3 px-3">ট্রাঞ্জেকশন আইডি</th>
                <th className="py-3 px-3">প্রকল্প</th>
                <th className="py-3 px-3">দাতার ফোন (এনক্রিপ্টেড)</th>
                <th className="py-3 px-3">মাধ্যম</th>
                <th className="py-3 px-3">পরিমাণ</th>
                <th className="py-3 px-3">সময়</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-slate-700 dark:text-slate-300">{tx.id}</td>
                  <td className="py-3 px-3 text-slate-800 dark:text-slate-200">{tx.projectTitle}</td>
                  <td className="py-3 px-3 font-mono text-slate-600 dark:text-slate-400">{tx.phoneMasked}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {tx.method}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-bold text-emerald-600 dark:text-emerald-400">+{tx.amount} ৳</td>
                  <td className="py-3 px-3 text-slate-500">{tx.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
                  ধন্যবাদ! অনুদান সফল হয়েছে
                </h3>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs space-y-1.5 text-slate-600 dark:text-slate-300">
                  <p><strong>ট্রাঞ্জেকশন আইডি:</strong> {donationSuccess.txId}</p>
                  <p><strong>পরিমাণ:</strong> {donationSuccess.amount} ৳</p>
                  <p><strong>দাতার নম্বর:</strong> {donationSuccess.maskedPhone}</p>
                  <p><strong>প্রকল্প:</strong> {donationSuccess.projectTitle}</p>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  আপনার অবদানটি উন্মুক্ত পাবলিক লেজারে তাৎক্ষণিকভাবে অন্তর্ভুক্ত করা হয়েছে।
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
                      নাগরিক মাইক্রো-অনুদান
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
                  {/* Preset Amount */}
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

                  {/* Payment Method */}
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

                  {/* Phone input */}
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

                  {/* Legal disclaimer */}
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 text-[11px] text-slate-500 leading-relaxed">
                    এই অনুদান সম্পূর্ণ ঐচ্ছিক ও জনস্বার্থে। এর মাধ্যমে কোনো চাকরি, নিয়োগ বা লটারি প্রাপ্তির অধিকার জন্মায় না।
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
                      className="px-5 py-2 text-xs font-bold rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 shadow-md"
                    >
                      {donationAmount} ৳ অনুদান নিশ্চিত করুন
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
