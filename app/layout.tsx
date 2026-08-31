import { Cabin } from 'next/font/google';

import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google';

import { BASE_URL } from '@/lib/constants';

import Footer from '@/components/footer';
import Navbar from '@/components/navbar';
import ThemeLoader from '@/components/ThemeLoader';

import './globals.css';

const cabin = Cabin({
  subsets: ['latin'],
  display: 'swap'
});
export const viewport = {
  colorScheme: 'only dark',
  themeColor: '#1A1F2A'
};
export async function generateMetadata() {
  return {
    referrer: 'origin',
    pageType: 'Portfolio',
    other: {
      'page-type': 'Portfolio',
      copyright: 'Ilyas Hannouna',
      audience: 'Everyone',
      'itemProp:name': 'Ilyas Hannouna | Frontend Developer',
      'itemProp:description':
        'Ilyas Hannouna is a web designer & front-end web developer',
      'itemProp:image': `${BASE_URL}/opengraph-image.png`
    },
    metadataBase: new URL(BASE_URL),

    title: {
      default: 'Ilyas Hannouna | Frontend Developer',
      template: '%s | Ilyas Hannouna'
    },
    verification: {
      google: 'process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION'
    },

    description:
      'Frontend developer specializing in React.js & Next.js. Building excellent software that improves lives through open source contributions and innovative web solutions',

    applicationName: 'Ilyas Hannouna',

    keywords: [
      'frontend developer',
      'web developer',
      'React.js',
      'Next.js',
      'TailwindCSS',
      'open source contributor'
    ],
    authors: [{ name: 'Ilyas Hannouna', url: BASE_URL }],
    creator: 'Ilyas Hannouna',
    publisher: 'Ilyas Hannouna',

    openGraph: {
      title: 'Ilyas Hannouna',
      description:
        'Frontend developer specializing in React.js & Next.js. Building excellent software that improves lives through open source contributions and innovative web solutions',
      authors: ['Ilyas Hannouna'],
      url: BASE_URL,
      siteName: 'Ilyas Hannouna',
      locale: 'en_US',
      type: 'website',
      images: [
        {
          url: `${BASE_URL}/opengraph-image.png`,
          width: 1200,
          height: 630,
          alt: 'Ilyas Hannouna | Frontend Developer',
          type: 'image/png'
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Ilyas Hannouna',
      description:
        'Frontend developer specializing in React.js & Next.js. Building excellent software that improves lives through open source contributions and innovative web solutions',
      images: [`${BASE_URL}/opengraph-image.png`],
      url: BASE_URL
    },
    icons: {
      icon: '/favicon.ico'
    },
    manifest: `${BASE_URL}/manifest.json`,
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        noimageindex: false
      }
    },
    languages: {
      'en-US': '/en-US'
    }
  };
}

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <html lang="en" className={`${cabin.className} h-full scroll-smooth`}>
      <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GA_TRACKING_ID || ''}  />
      <body className="antialiased">
        <ThemeLoader />
        <Navbar />
        <main className="relative isolate overflow-hidden">
          <div className="mx-auto min-h-svh w-full max-w-200 px-5 py-3 pt-16 md:px-10 lg:px-0">
            {children}
          </div>
        </main>
        <Footer />
      </body>
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_TRACKING_ID || ''} />
    </html>
  );
}
