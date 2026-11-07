import { ShieldCheck, Target, Users, Scale, Heart, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Page Title */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300/50">
          <Sparkles className="w-3.5 h-3.5" />
          <span>আমাদের লক্ষ্য ও রূপরেখা</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          একতাই বল: জনগণের বুদ্ধি ও শক্তিতে স্বাবলম্বী বাংলাদেশ
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          রাষ্ট্রের সব সমস্যার সমাধান শুধু সরকারের পক্ষে একার দেওয়া সম্ভব নয়। কিন্তু ১৬ কোটি মানুষের মস্তিষ্ক ও ইচ্ছাশক্তি যদি একত্রিত হয়, তবে ক্ষুদ্র উদ্যোগে যেকোনো বড় সংকট জয় করা সম্ভব।
        </p>
      </div>

      {/* Vision and Mission Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Target className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">আমাদের রূপকল্প (Vision)</h2>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            বাংলাদেশের প্রতিটি উপজেলায় এমন এক নাগরিক মঞ্চ প্রতিষ্ঠা করা, যেখানে মানুষ শুধু সমস্যার অভিযোগ করবে না, বরং বাস্তবসম্মত সমাধানের পথ বাতলে দেবে। সাধারণ মানুষের ১০০ টাকার সম্মিলিত শক্তিতে নিজ এলাকার প্রয়োজন অনুযায়ী সামাজিক কারখানা, হিমাগার, ওয়াটার প্ল্যান্ট ও কারিগরি ইনস্টিটিউট গড়ে তোলা হবে।
          </p>
        </div>

        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center">
            <Scale className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">শতভাগ জবাবদিহিতা ও নীতি</h2>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            আমরা বিশ্বাস করি—অবিশ্বাস দূর করার একমাত্র ওষুধ হলো শতভাগ স্বচ্ছতা। প্ল্যাটফর্মের প্রতি পয়সার আয়-ব্যয় পাবলিক লেজারে দৃশ্যমান থাকবে। কোনো রাজনৈতিক পক্ষপাত থাকবে না। যে এলাকায় আইডিয়ার সূচনা, প্রকল্পের প্রথম সুফল পাবে সেই এলাকার সাধারণ মানুষ।
          </p>
        </div>
      </div>

      {/* Anti-fraud & Legal Guardrails */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <span>প্রতারণা প্রতিরোধ ও নিরাপত্তা নীতিমালা</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600 dark:text-slate-300">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-1.5">
            <p className="font-bold text-slate-800 dark:text-slate-200">১. কোনো চাকরি বিক্রয় বা নিশ্চিত নিয়োগ নয়</p>
            <p>অনুদানের বিনিময়ে কাউকে কোনো নিয়োগ বা চাকরির অধিকার দেওয়া হবে না। নিয়োগ হবে প্রকল্পের প্রয়োজন অনুযায়ী সম্পূর্ণ মেধার ভিত্তিতে।</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-1.5">
            <p className="font-bold text-slate-800 dark:text-slate-200">২. কোনো আর্থিক লোভ বা সুদ নয়</p>
            <p>এটি কোনো ব্যাংকিং, সমবায় মুনাফা বা এমএলএম স্কিম নয়। এটি বিশুদ্ধ সামাজিক দান ও নাগরিক স্বাবলম্বন উদ্যোগ।</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-1.5">
            <p className="font-bold text-slate-800 dark:text-slate-200">৩. দাতার তথ্যের এনক্রিপশন</p>
            <p>পাবলিক লেজারে অনুদানকারীর মোবাইল নম্বরের মধ্যবর্তী অংশ এনক্রিপ্ট রেখে দেখানো হয়, যাতে কোনো স্প্যামিং বা ব্যক্তিগত তথ্য চুরি না হয়।</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-1.5">
            <p className="font-bold text-slate-800 dark:text-slate-200">৪. প্রাপ্তবয়স্ক নিরপেক্ষ গভর্ন্যান্স বোর্ড</p>
            <p>আইডিয়া নির্বাচন ও তহবিল ব্যয়ের অনুমোদনে স্থানীয় সমাজকর্মী, প্রকৌশলী ও অডিটরদের সমন্বয়ে গঠিত বোর্ড দায়িত্ব পালন করবে।</p>
          </div>
        </div>
      </div>
    </div>
  );
}
