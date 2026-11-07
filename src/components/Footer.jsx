import Link from 'next/link';
import { ShieldCheck, Heart, MapPin, Sparkles, Scale, FileText } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white font-bold">
                ঐ
              </div>
              <span className="font-bold text-lg text-white">একতাই বল (EKOTAI BOL)</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              বাংলাদেশের ৬৪ জেলার মানুষের আইডিয়া, সম্মিলিত অংশগ্রহণ, স্বচ্ছ জন-অর্থায়ন এবং টেকসই কর্মসংস্থানের জাতীয় সামাজিক প্ল্যাটফর্ম।
            </p>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>১০০% উন্মুক্ত ও নাগরিক নিয়ন্ত্রিত</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">মঞ্চের বিভাগ</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/notice-board" className="hover:text-emerald-400 transition-colors">
                  জন-নোটিশ বোর্ড ও ভোটিং
                </Link>
              </li>
              <li>
                <Link href="/submit-idea" className="hover:text-emerald-400 transition-colors">
                  বিনামূল্যে নতুন আইডিয়া জমা
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-emerald-400 transition-colors">
                  বাস্তবায়নাধীন প্রকল্প ও লেজার
                </Link>
              </li>
              <li>
                <Link href="/welfare" className="hover:text-emerald-400 transition-colors">
                  শ্রম আইন ও সর্বজনীন পেনশন মডেল
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-emerald-400 transition-colors">
                  সুপারঅ্যাডমিন ও বোর্ড পোর্টাল
                </Link>
              </li>
            </ul>
          </div>

          {/* Core Principles */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">আমাদের ৪ মূলনীতি</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-400 font-bold">১.</span>
                <span>আইডিয়া জমা ও মূল্যায়ন সর্বদা বিনামূল্যে।</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-400 font-bold">২.</span>
                <span>অনুদান সম্পূর্ণ ঐচ্ছিক—চাকরির কোনো নিশ্চয়তা বা বাণিজ্য নয়।</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-400 font-bold">৩.</span>
                <span>যে এলাকায় আইডিয়ার উৎপত্তি, সেখানেই প্রথম বাস্তবায়ন।</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-400 font-bold">৪.</span>
                <span>প্রতিটি টাকার হিসাব ও খরচ উন্মুক্ত লাইভ লেজারে দৃশ্যমান।</span>
              </li>
            </ul>
          </div>

          {/* Legal and Compliance */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-1">আইন ও স্বচ্ছতা</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              বাংলাদেশ ব্যক্তিগত উপাত্ত সুরক্ষা আইন এবং শ্রম আইন ২০০৬ (সংশোধিত ২০২৬) এর আলোকে পরিচালিত একটি অলাভজনক সামাজিক উদ্যোগ।
            </p>
            <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-500">
              <p>ডোনার নম্বর গোপনীয়তা: মাঝখানের ৫ ডিজিট এনক্রিপ্টেড।</p>
              <p className="mt-1">ডোমেইন: ekoitaibol.com</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} EKOTAI BOL (একতাই বল)। সর্বস্বত্ব সংরক্ষিত।</p>
          <div className="flex items-center space-x-4">
            <Link href="/about" className="hover:text-slate-300 transition-colors">নীতিমালা</Link>
            <Link href="/welfare" className="hover:text-slate-300 transition-colors">কল্যাণ ব্যবস্থা</Link>
            <Link href="/llms.txt" className="hover:text-slate-300 transition-colors">LLMs.txt</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
