import { ShieldCheck, HeartHandshake, Briefcase, Landmark, CheckCircle2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function WelfarePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300/50">
          <Landmark className="w-3.5 h-3.5" />
          <span>আইনি ও টেকসই রূপরেখা · বাংলাদেশ শ্রম আইন ও সর্বজনীন পেনশন</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          টেকসই কর্মসংস্থান ও বৃদ্ধ বয়সের নিশ্চিত আর্থিক নিরাপত্তা
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          বেসরকারি সামাজিক প্রতিষ্ঠানে সরকারি চাকরির মতো সম্মান ও বৃদ্ধ বয়সের পেনশন সুবিধা কি সম্ভব? হ্যাঁ, যদি সেটি প্রচলিত প্রতারণামূলক চটকদার কথার বাইরে এসে দেশের প্রচলিত শ্রম আইন ও সর্বজনীন পেনশন ব্যবস্থার সাথে নিখুঁতভাবে সমন্বিত হয়।
        </p>
      </div>

      {/* 3 Pillars Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
            ১
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">শ্রম আইনসম্মত চুক্তি</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            বাস্তবায়িত প্রকল্পগুলোতে কর্মরত প্রতিটি কর্মীর জন্য থাকবে বাংলাদেশ শ্রম আইন ২০০৬ এর ২৮ ধারা অনুযায়ী স্বাভাবিক অবসরের বয়স ৬০ বছর পর্যন্ত সুনির্দিষ্ট লিখিত নিয়োগপত্র।
          </p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            ২
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">সর্বজনীন পেনশন স্কিম</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            জাতীয় সর্বজনীন পেনশন স্কিমের 'প্রগতি' প্যাকেজে কর্মীদের অন্তর্ভুক্ত করা হবে। প্রতিষ্ঠান ও কর্মী যৌথভাবে মাসিক চাঁদা পরিশোধ করবে, যা ৬০ বছর পর আজীবন মাসিক পেনশন নিশ্চিত করবে।
          </p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
            ৩
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">স্বাধীন কল্যাণ তহবিল ট্রাস্ট</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            প্রতিষ্ঠান ও সামাজিক প্রকল্পের আয়ের একটি অংশ জমা হবে স্বাধীন 'এমপ্লয়ি ওয়েলফেয়ার ট্রাস্টে'। চিকিৎসার জরুরি প্রয়োজন বা সন্তানদের পড়াশোনায় এই তহবিল থেকে সুদহীন অনুদান মিলবে।
          </p>
        </div>
      </div>

      {/* Joint Contribution Diagram Table */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <HeartHandshake className="w-5 h-5 text-emerald-600" />
          <span>মাসিক যৌথ অবদান ও পেনশন সঞ্চয় মডেল (উদাহরণের আলোকে)</span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500 font-semibold">
                <th className="py-3 px-3">খাত</th>
                <th className="py-3 px-3">কর্মীর অবদান</th>
                <th className="py-3 px-3">একতাই বল প্রকল্পের অবদান</th>
                <th className="py-3 px-3">মোট জমার গন্তব্য</th>
                <th className="py-3 px-3">সুবিধা</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              <tr>
                <td className="py-3 px-3 font-semibold text-slate-800 dark:text-slate-200">সর্বজনীন পেনশন (প্রগতি)</td>
                <td className="py-3 px-3">বেতনের ৫% (যেমন: ১,০০০ ৳)</td>
                <td className="py-3 px-3">প্রতিষ্ঠানের ৫% (যেমন: ১,০০০ ৳)</td>
                <td className="py-3 px-3 font-mono text-emerald-600">জাতীয় পেনশন কর্তৃপক্ষ (NPA)</td>
                <td className="py-3 px-3">৬০ বছর বয়সে আজীবন সরকারি মাসিক পেনশন</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold text-slate-800 dark:text-slate-200">ভবিষ্য তহবিল (PF)</td>
                <td className="py-3 px-3">বেতনের ৫% (যেমন: ১,০০০ ৳)</td>
                <td className="py-3 px-3">প্রতিষ্ঠানের ৫% (যেমন: ১,০০০ ৳)</td>
                <td className="py-3 px-3 font-mono text-blue-600">স্বাধীন ট্রাস্টি ব্যাংক অ্যাকাউন্ট</td>
                <td className="py-3 px-3">চাকরি অবসরে এককালীন সুদবিহীন বড় সঞ্চয়</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold text-slate-800 dark:text-slate-200">জরুরি স্বাস্থ্য ও আপদকালীন তহবিল</td>
                <td className="py-3 px-3">০% (কর্মীর কোনো খরচ নেই)</td>
                <td className="py-3 px-3">প্রকল্পের নিট মুনাফার ২%</td>
                <td className="py-3 px-3 font-mono text-amber-600">কমিউনিটি ওয়েলফেয়ার বোর্ড</td>
                <td className="py-3 px-3">দুর্ঘটনা বা জটিল রোগে এককালীন চিকিৎসা সহায়তা</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Important Legal Declaration */}
      <div className="p-6 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 space-y-3">
        <h4 className="text-sm font-bold text-amber-900 dark:text-amber-200 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-amber-600" />
          <span>গুরুত্বপূর্ণ আইনি সতর্কতা ও অবস্থান</span>
        </h4>
        <div className="text-xs text-amber-900/90 dark:text-amber-200/90 space-y-2 leading-relaxed">
          <p>
            • <strong>১০০ টাকা দিয়ে চাকরির কোনো সম্পর্ক নেই:</strong> একতাই বল প্ল্যাটফর্মে কেউ ১০০ টাকা অনুদান দিলে বা আইডিয়া জমা দিলে তার ভিত্তিতে কোনো চাকরি দেওয়া হবে না। অনুদান সম্পূর্ণ ঐচ্ছিক এবং জনস্বার্থমূলক।
          </p>
          <p>
            • <strong>স্বচ্ছ নিয়োগ প্রক্রিয়া:</strong> যখন কোনো জেলায় প্রকল্প বাস্তবায়নের জন্য লোকবল প্রয়োজন হবে (যেমন: হিমাগারের মেকানিক বা প্ল্যান্ট অপারেটর), তখন স্থানীয় পত্রিকায় ও প্ল্যাটফর্মে উন্মুক্ত বিজ্ঞপ্তি দিয়ে মেধা ও দক্ষতার ভিত্তিতে নিয়োগ দেওয়া হবে।
          </p>
          <p>
            • <strong>আইনের সম্পূর্ণ প্রতিপালন:</strong> কোনো প্রকার বেআইনি তহবিল সংগ্রহ, এমএলএম বা আর্থিক লোভ দেখানো বাংলাদেশ আইনে শাস্তিযোগ্য অপরাধ। একতাই বল ১০০% স্বচ্ছতার সাথে সামাজিক সমবায়ের আদর্শে পরিচালিত।
          </p>
        </div>
      </div>

      <div className="text-center pt-4">
        <Link
          href="/submit-idea"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg text-sm"
        >
          <span>আপনার এলাকার জন্য একটি আইডিয়া দিন</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
