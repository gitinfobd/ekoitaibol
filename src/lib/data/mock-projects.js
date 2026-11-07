export const initialProjects = [
  {
    id: 'proj-001',
    title: 'রংপুর পাইলট প্রজেক্ট: কৃষকদের সমবায় মিনি সোলার হিমাগার',
    originIdeaId: 'idea-001',
    district: 'রংপুর',
    location: 'মিঠাপুকুর উপজেলা, পায়রাববন্দ ইউনিয়ন',
    goalAmount: 300000,
    raisedAmount: 184500,
    backersCount: 1845,
    status: 'fundraising', // fundraising, ongoing, completed
    startDate: '২০২৬-১১-০১',
    targetDate: '২০২৬-১১-৩০',
    image: 'https://images.unsplash.com/photo-1595246140625-573b715d11dc?auto=format&fit=crop&w=800&q=80',
    description: 'রংপুরের মিঠাপুকুরে প্রথম সামাজিক পাইলট প্রজেক্ট। সাধারণ মানুষের ১০০ টাকার অনুদানে নির্মিত হচ্ছে ২০ টন ধারণক্ষমতার কমিউনিটি সৌর হিমাগার। এটি বাস্তবায়ন হলে স্থানীয় কৃষকরা পানির দরে আলু বিক্রি বন্ধ করে সরাসরি লাভবান হবেন।',
    employmentImpact: '২ জন সার্বক্ষণিক মেকানিক ও স্টোরেজ তত্ত্বাবধায়ক এবং ১ জন হিসাবরক্ষক। শ্রম আইন অনুযায়ী নিয়মিত বেতন ও সর্বজনীন পেনশন স্কিমে মাসিক অবদান অন্তর্ভুক্ত।',
    budgetBreakdown: [
      { item: 'সোলার প্যানেল (৫ কিলোওয়াট) ও হাইব্রিড ইনভার্টার', cost: '১,২০,০০০ ৳' },
      { item: 'ইনসুলেটেড পিইউ স্যান্ডউইচ প্যানেল ও কোল্ডরুম কেবিন', cost: '৯০,০০০ ৳' },
      { item: 'কম্প্রেসার ও ইভাপোরেটর কুলিং ইউনিট', cost: '৬০,০০০ ৳' },
      { item: 'সেটআপ ও ওয়্যারিং ফি', cost: '৩০,০০০ ৳' }
    ],
    expenses: [
      { date: '২০২৬-১১-০৩', title: 'হিমাগারের জন্য জমি লিজ ও স্থান নির্ধারণ অগ্রিম', amount: 15000, voucherId: 'VCH-091' },
      { date: '২০২৬-১১-০৫', title: 'সোলার প্যানেল কোটেশন যাচাই ও ইঞ্জিনিয়ার ভিজিট', amount: 5000, voucherId: 'VCH-092' }
    ]
  },
  {
    id: 'proj-002',
    title: 'খুলনা উপকূলীয় ওয়াটার কিয়স্ক: নিরাপদ খাবার পানি প্ল্যান্ট',
    originIdeaId: 'idea-002',
    district: 'খুলনা',
    location: 'কয়রা উপজেলা, মহারাজপুর ইউনিয়ন',
    goalAmount: 250000,
    raisedAmount: 98000,
    backersCount: 980,
    status: 'fundraising',
    startDate: '২০২৬-১১-০২',
    targetDate: '২০২৬-১২-০৫',
    image: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=800&q=80',
    description: 'উপকূলের ৮০০ পরিবারের জন্য প্রতিদিন সুপেয় নিরাপদ পানি সরবরাহে সৌরচালিত ওয়াটার কিয়স্ক।',
    employmentImpact: '২ জন স্থানীয় যুবকের পরিচালনা ও রক্ষণাবেক্ষণ দায়িত্ব।',
    budgetBreakdown: [
      { item: 'বাণিজ্যিক রিভার্স অসমোসিস প্ল্যান্ট (১০০০ লিটার/ঘণ্টা)', cost: '১,৩০,০০০ ৳' },
      { item: 'সোলার জেনারেটর সিস্টেম', cost: '৭০,০০০ ৳' },
      { item: 'শেড নির্মাণ ও কিয়স্ক বুথ', cost: '৫০,০০০ ৳' }
    ],
    expenses: []
  }
];

export const liveLedger = [
  { id: 'TX-9841', projectId: 'proj-001', projectTitle: 'রংপুর সোলার হিমাগার', phoneMasked: '0171****491', amount: 100, method: 'bKash', time: '২ মিনিট আগে' },
  { id: 'TX-9840', projectId: 'proj-001', projectTitle: 'রংপুর সোলার হিমাগার', phoneMasked: '0182****118', amount: 500, method: 'Nagad', time: '৮ মিনিট আগে' },
  { id: 'TX-9839', projectId: 'proj-002', projectTitle: 'খুলনা ওয়াটার কিয়স্ক', phoneMasked: '0191****930', amount: 100, method: 'bKash', time: '১৫ মিনিট আগে' },
  { id: 'TX-9838', projectId: 'proj-001', projectTitle: 'রংপুর সোলার হিমাগার', phoneMasked: '0175****042', amount: 200, method: 'Rocket', time: '২৫ মিনিট আগে' },
  { id: 'TX-9837', projectId: 'proj-002', projectTitle: 'খুলনা ওয়াটার কিয়স্ক', phoneMasked: '0163****776', amount: 100, method: 'bKash', time: '৩৭ মিনিট আগে' },
  { id: 'TX-9836', projectId: 'proj-001', projectTitle: 'রংপুর সোলার হিমাগার', phoneMasked: '0130****521', amount: 1000, method: 'Bank', time: '১ ঘণ্টা আগে' },
  { id: 'TX-9835', projectId: 'proj-001', projectTitle: 'রংপুর সোলার হিমাগার', phoneMasked: '0184****380', amount: 100, method: 'bKash', time: '১ ঘণ্টা আগে' },
];
