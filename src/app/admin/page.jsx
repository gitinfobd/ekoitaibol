'use client';

import { useState } from 'react';
import { initialIdeas } from '@/lib/data/mock-ideas';
import { initialProjects } from '@/lib/data/mock-projects';
import { ShieldCheck, Check, X, RotateCcw, Plus, FileText, AlertCircle, Sparkles } from 'lucide-react';

export default function AdminPage() {
  const [ideas, setIdeas] = useState(initialIdeas);
  const [projects, setProjects] = useState(initialProjects);
  const [expenseTitle, setExpenseTitle] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseVoucher, setExpenseVoucher] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState(initialProjects[0].id);

  const handleApproveIdea = (id) => {
    alert(`আইডিয়া #${id} নোটিশ বোর্ডে চূড়ান্তভাবে অনুমোদিত হয়েছে।`);
  };

  const handleResetFundCycle = (projectId) => {
    const confirmReset = window.confirm('আপনি কি নিশ্চিত যে এই মাসের ফান্ড রাইজার সাইকেলটি রিসেট করবেন?');
    if (!confirmReset) return;

    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          raisedAmount: 0,
          backersCount: 0
        };
      }
      return p;
    }));
    alert('প্রকল্পের ফান্ড রাইজিং সাইকেল সফলভাবে রিসেট করা হয়েছে।');
  };

  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!expenseTitle || !expenseAmount || !expenseVoucher) {
      alert('সব তথ্য সঠিকভাবে দিন।');
      return;
    }

    const newExp = {
      date: new Date().toISOString().slice(0, 10),
      title: expenseTitle,
      amount: Number(expenseAmount),
      voucherId: expenseVoucher
    };

    setProjects(prev => prev.map(p => {
      if (p.id === selectedProjectId) {
        return {
          ...p,
          expenses: [...p.expenses, newExp]
        };
      }
      return p;
    }));

    setExpenseTitle('');
    setExpenseAmount('');
    setExpenseVoucher('');
    alert('অডিট ভাউচার ও খরচ সফলভাবে অন্তর্ভুক্ত হয়েছে।');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>সুপারএডমিন ও গভর্ন্যান্স পোর্টাল</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            মডারেশন ও তহবিল ব্যবস্থাপনা
          </h1>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
          <p className="text-xs text-slate-500">মোট প্রস্তাবিত আইডিয়া</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{ideas.length}</p>
        </div>
        <div className="glass-panel p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
          <p className="text-xs text-slate-500">চলমান প্রকল্প</p>
          <p className="text-2xl font-black text-emerald-600 mt-1">{projects.length}</p>
        </div>
        <div className="glass-panel p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
          <p className="text-xs text-slate-500">মোট জন-তহবিল সংগ্রহ</p>
          <p className="text-2xl font-black text-teal-600 mt-1">
            {projects.reduce((acc, p) => acc + p.raisedAmount, 0).toLocaleString('bn-BD')} ৳
          </p>
        </div>
        <div className="glass-panel p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
          <p className="text-xs text-slate-500">মোট নাগরিক ব্যাকাস</p>
          <p className="text-2xl font-black text-blue-600 mt-1">
            {projects.reduce((acc, p) => acc + p.backersCount, 0).toLocaleString('bn-BD')} জন
          </p>
        </div>
      </div>

      {/* Section 1: Idea Moderation */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          প্রস্তাবিত আইডিয়া মডারেশন কিউ
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500 font-semibold">
                <th className="py-2.5 px-3">আইডি</th>
                <th className="py-2.5 px-3">শিরোনাম</th>
                <th className="py-2.5 px-3">এলাকা</th>
                <th className="py-2.5 px-3">বাজেট</th>
                <th className="py-2.5 px-3">রেটিং</th>
                <th className="py-2.5 px-3 text-right">মডারেশন অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {ideas.map((idea) => (
                <tr key={idea.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-3 font-mono font-bold text-slate-600">{idea.id}</td>
                  <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white max-w-xs truncate">{idea.title}</td>
                  <td className="py-3 px-3 text-slate-600">{idea.upazila}</td>
                  <td className="py-3 px-3 font-semibold text-emerald-600">{idea.budgetEstimate}</td>
                  <td className="py-3 px-3 text-amber-500 font-bold">★ {idea.rating}</td>
                  <td className="py-3 px-3 text-right space-x-2">
                    <button
                      onClick={() => handleApproveIdea(idea.id)}
                      className="px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                    >
                      অনুমোদন
                    </button>
                    <button
                      onClick={() => alert('সংশোধনের অনুরোধ পাঠানো হয়েছে।')}
                      className="px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200"
                    >
                      সংশোধন
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 2: Fundraiser Reset & Expenses Log */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Reset Fundraiser Cycle */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center gap-2">
            <RotateCcw className="w-5 h-5 text-amber-600" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              ফান্ড রাইজার সাইকেল রিসেট
            </h3>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            মাসের যেকোনো তারিখে সুপারএডমিন চলমান প্রকল্পের ফান্ড কাউন্টার রিসেট বা পরবর্তী মাসের জন্য নবায়ন করতে পারেন।
          </p>

          <div className="space-y-3 pt-2">
            {projects.map((proj) => (
              <div key={proj.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-200">{proj.title.slice(0, 24)}...</p>
                  <p className="text-slate-500">সংগ্রহ: {proj.raisedAmount.toLocaleString('bn-BD')} ৳</p>
                </div>
                <button
                  onClick={() => handleResetFundCycle(proj.id)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 border border-rose-300 dark:border-rose-800 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                >
                  সাইকেল রিসেট
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Add Audited Expense */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              অডিট ভাউচার ও খরচ এন্ট্রি
            </h3>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            প্রকল্প বাস্তবায়নে ব্যয় হওয়া প্রতিটি টাকার ভাউচার নম্বর ও বিবরণ এন্ট্রি করুন। এটি জনগণের জন্য উন্মুক্ত থাকবে।
          </p>

          <form onSubmit={handleAddExpense} className="space-y-3 pt-1">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                প্রকল্প নির্বাচন
              </label>
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs outline-none"
              >
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.title}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  ভাউচার / রসিদ নং
                </label>
                <input
                  type="text"
                  value={expenseVoucher}
                  onChange={(e) => setExpenseVoucher(e.target.value)}
                  placeholder="যেমন: VCH-093"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  পরিমাণ (টাকা)
                </label>
                <input
                  type="number"
                  value={expenseAmount}
                  onChange={(e) => setExpenseAmount(e.target.value)}
                  placeholder="যেমন: ২৫০০০"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                খরচের বিবরণ
              </label>
              <input
                type="text"
                value={expenseTitle}
                onChange={(e) => setExpenseTitle(e.target.value)}
                placeholder="যেমন: কোল্ডরুম কেবিন ইনসুলেশন প্যানেল ক্রয়"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs outline-none"
              />
            </div>

            <div className="pt-1 text-right">
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm"
              >
                ভাউচার এন্ট্রি করুন
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
