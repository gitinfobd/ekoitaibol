import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { AuthProvider } from '@/lib/firebase/auth-context';

export const metadata = {
  metadataBase: new URL('https://ekoitaibol.com'),
  title: 'একতাই বল (EKOTAI BOL) | জনগণের আইডিয়া ও উদ্যোগে পরিবর্তন',
  description: 'বাংলাদেশের ৬৪ জেলার মানুষের আইডিয়া, সম্মিলিত অংশগ্রহণ, স্বচ্ছ ১০০ টাকার জন-অর্থায়ন এবং স্থানীয় টেকসই কর্মসংস্থানের জাতীয় সামাজিক প্ল্যাটফর্ম।',
  keywords: ['একতাই বল', 'ekoitaibol', 'civic innovation bangladesh', 'social enterprise', 'community crowdfunding', 'rangpur ideas', 'bangladesh development'],
  openGraph: {
    title: 'একতাই বল (EKOTAI BOL) | একতাই শক্তি, উদ্যোগে পরিবর্তন',
    description: 'আপনার এলাকার সমস্যা সমাধানের আইডিয়া দিন সম্পূর্ণ বিনামূল্যে। জনগণ রেটিং দেবে, বাছাইকৃত প্রকল্প বাস্তবায়িত হবে আপনার নিজ জেলায়।',
    url: 'https://ekoitaibol.com',
    siteName: 'EKOTAI BOL',
    locale: 'bn_BD',
    type: 'website',
  },
  alternates: {
    canonical: 'https://ekoitaibol.com',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({ children }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NGO',
    name: 'EKOTAI BOL (একতাই বল)',
    url: 'https://ekoitaibol.com',
    logo: 'https://ekoitaibol.com/logo.png',
    description: 'বাংলাদেশের ৬৪ জেলার মানুষের আইডিয়া, সম্মিলিত অংশগ্রহণ ও স্বচ্ছ অর্থায়নের সামাজিক প্ল্যাটফর্ম।',
    areaServed: {
      '@type': 'Country',
      name: 'Bangladesh',
    },
    knowsAbout: [
      'Civic Innovation',
      'Micro-Crowdfunding',
      'Community Project Implementation',
      'Universal Pension Scheme Welfare'
    ]
  };

  return (
    <html lang="bn" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col font-sans antialiased">
        <AuthProvider>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
