'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Lightbulb, HandCoins, ArrowRight, Star, MapPin, Sparkles, ChevronRight, ShieldCheck } from 'lucide-react';
import { initialIdeas } from '@/lib/data/mock-ideas';
import { initialProjects } from '@/lib/data/mock-projects';

export default function HomePage() {
  const [realIdeasCount, setRealIdeasCount] = useState(0);
  const [featuredIdea, setFeaturedIdea] = useState(null);
  const [realProjects, setRealProjects] = useState([]);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const q = query(collection(db, 'ideas'), where('isPublic', '==', true));
        const snapshot = await getDocs(q);
        setRealIdeasCount(snapshot.size);
        if (snapshot.size > 0) {
          const first = snapshot.docs[0];
          setFeaturedIdea({ id: first.id, ...first.data() });
        } else {
          setFeaturedIdea(initialIdeas[0]);
        }

        const projSnap = await getDocs(collection(db, 'projects'));
        const projs = projSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        setRealProjects(projs.length > 0 ? projs : initialProjects);
      } catch (err) {
        setFeaturedIdea(initialIdeas[0]);
        setRealProjects(initialProjects);
      }
    };
    fetchHomeData();
  }, []);

  const activeProject = realProjects[0] || initialProjects[0];

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-emerald-50/60 via-slate-50 to-white dark:from-emerald-950/20 dark:via-slate-900 dark:to-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.12] pointer-events-none" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-100/80 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 border border-emerald-300/60 dark:border-emerald-700/60 shadow-sm animate-fade-in">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>বাংলাদেশের ৬৪ জেলার মানুষের সম্মিলিত উদ্ভাবন মঞ্চ</span>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.18]">
              একতাই শক্তি, <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 bg-clip-text text-transparent">
                উদ্যোগে পরিবর্তন
              </span>
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
              আপনার এলাকার সমস্যা সমাধানের বুদ্ধি জমা দিন সম্পূর্ণ বিনামূল্যে। জনগণ রেটিং ও যৌক্তিক সমালোচনা করবে, আর শীর্ষ বাছাইকৃত উদ্যোগ বাস্তবায়িত হবে আপনার নিজ এলাকায়—স্বচ্ছ ও জবাবদিহিতামূলক মডেলে।
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/submit-idea"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg shadow-emerald-600/25 active:scale-95 transition-all text-base"
            >
              <Lightbulb className="w-5 h-5" />
              <span>বিনামূল্যে আইডিয়া দিন</span>
            </Link>
            <Link
              href="/notice-board"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 border border-slate-300 dark:border-slate-700 shadow-sm transition-all text-base"
            >
              <span>জন-নোটিশ বোর্ড দেখুন</span>
              <ArrowRight className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </Link>
          </div>

          {/* Real Transparency Pillars */}
          <div className="pt-8 max-w-3xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
            <div className="glass-panel p-4 rounded-xl border border-slate-200/80 dark:border-slate-800">
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">১০০%</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">ফ্রি আইডিয়া জমাদান</p>
            </div>
            <div className="glass-panel p-4 rounded-xl border border-slate-200/80 dark:border-slate-800">
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">৬৪ জেলা</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">জাতীয় অংশীদারিত্ব</p>
            </div>
            <div className="glass-panel p-4 rounded-xl border border-slate-200/80 dark:border-slate-800">
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">১০০ ৳</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">ঐচ্ছিক অনুদান রূপরেখা</p>
            </div>
            <div className="glass-panel p-4 rounded-xl border border-slate-200/80 dark:border-slate-800">
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">০%</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">কাল্পনিক তথ্য বর্জিত</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4-Step How It Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">স্বচ্ছ ও শক্তিশালী কাঠামো</p>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">একতাই বল যেভাবে কাজ করে</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            আইডিয়া দেওয়া থেকে শুরু করে বাস্তবায়ন—প্রতিটি ধাপ স্বাধীন, ন্যায্য ও সম্পূর্ণ দুর্নীতিমুক্ত।
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="glass-panel p-6 rounded-2xl relative border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-lg mb-4 group-hover:scale-110 transition-transform">
              ১
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">ফ্রি আইডিয়া সাবমিশন</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Google দিয়ে এক ক্লিকে সাইন-ইন করে আপনার জেলার সমস্যা ও সমাধানের আইডিয়া দিন। ফোন নম্বর সুরক্ষিত রাখা হয়।
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl relative border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold text-lg mb-4 group-hover:scale-110 transition-transform">
              ২
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">AI যাচাই ও জন-নোটিশ বোর্ড</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              অভ্যন্তরীণ AI ডুপ্লিকেট চিহ্নিত ও ক্যাটাগরি তৈরি করে। নোটিশ বোর্ডে সাধারণ মানুষ ৫-স্টার রেটিং ও সমালোচনা দেয়।
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl relative border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-lg mb-4 group-hover:scale-110 transition-transform">
              ৩
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">১০০ টাকার জন-তহবিল</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              বাছাইকৃত সামাজিক প্রকল্পে মানুষ ঐচ্ছিক ১০০ টাকা করে অনুদান দেয়। মোবাইল নম্বরের ৫ ডিজিট গোপন রেখে রিয়েল-টাইম লেজার দৃশ্যমান।
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl relative border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-lg mb-4 group-hover:scale-110 transition-transform">
              ৪
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">মাঠে বাস্তবায়ন ও কর্মসংস্থান</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              আইডিয়ার জন্ম যে এলাকায়, প্রকল্প বাস্তবায়ন হবে সেখানেই। স্থানীয় কর্মীদের ন্যায্য মজুরি ও সর্বজনীন পেনশনে সুরক্ষা দেওয়া হবে।
            </p>
          </div>
        </div>
      </section>

      {/* Featured Community Idea from Notice Board */}
      {featuredIdea && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-panel p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  জন-নোটিশ বোর্ড ফিচারড আইডিয়া
                </span>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                  {featuredIdea.title}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center text-amber-500">
                  <Star className="w-5 h-5 fill-current" />
                  <span className="font-bold text-base ml-1 text-slate-900 dark:text-white">{featuredIdea.rating || 5.0}</span>
                </div>
                <span className="text-xs text-slate-500">({featuredIdea.ratingCount || 0} ভোট)</span>
              </div>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {featuredIdea.summary || featuredIdea.problem}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                <p className="text-xs font-bold text-rose-600 dark:text-rose-400 mb-1">সমস্যা</p>
                <p className="text-xs text-slate-600 dark:text-slate-300">{featuredIdea.problem}</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-1">সমাধান</p>
                <p className="text-xs text-slate-600 dark:text-slate-300">{featuredIdea.solution}</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                <p className="text-xs font-bold text-blue-600 dark:text-blue-400 mb-1">প্রাক্কলিত বাজেট</p>
                <p className="text-lg font-extrabold text-slate-900 dark:text-white">{featuredIdea.budgetEstimate || featuredIdea.estimatedBudget || 'প্রস্তাবনাধীন'}</p>
                <p className="text-[11px] text-slate-500">লোকেশন: {featuredIdea.upazila || 'সদর'}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-500">আইডিয়া সাবমিটকারীর নাম জনস্বার্থে গোপন রাখা হয়</span>
              <Link
                href="/notice-board"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors"
              >
                <span>নোটিশ বোর্ডে রেটিং দিন</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Sustainable Welfare Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-8 sm:p-12 rounded-3xl shadow-xl space-y-6">
          <div className="max-w-3xl space-y-3">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              শ্রম আইন ও সর্বজনীন পেনশন স্কিম
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold">
              বাস্তবায়িত প্রকল্পে দীর্ঘমেয়াদি ও নিরাপদ কর্মসংস্থান
            </h3>
            <p className="text-sm text-emerald-100/80 leading-relaxed">
              একতাই বল কোনো ভুয়া চাকরির প্রতিশ্রুতি দেয় না। বাস্তবায়িত প্রকল্পগুলোতে যেসব স্থানীয় কর্মী নিয়োগ দেওয়া হবে, শ্রম আইন ২০০৬ অনুযায়ী তাদের নিয়মিত বেতন এবং সর্বজনীন পেনশন স্কিম (প্রগতি স্কিম) বা স্বাধীন ভবিষ্য তহবিলে প্রতিষ্ঠান ও কর্মী উভয়ের যৌথ অবদানের মাধ্যমে ৬০ বছর বয়সে নিশ্চিত আর্থিক উত্তরণের সুযোগ নিশ্চিত করা হয়।
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/welfare"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-white text-slate-900 hover:bg-emerald-50 transition-colors"
            >
              <span>কল্যাণ মডেল বিস্তারিত পড়ুন</span>
              <ArrowRight className="w-4 h-4 text-emerald-600" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
