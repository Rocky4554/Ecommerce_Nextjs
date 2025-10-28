import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '../app/components/Navbar.jsx';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'E-Commerce Store - Next.js Demo',
  description: 'Full-featured e-commerce application demonstrating Next.js rendering strategies',
  keywords: 'e-commerce, next.js, SSG, SSR, ISR, online store',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50`}>
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <footer className="bg-gray-800 text-white py-8 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <p className="text-sm">
                © 2024 E-Commerce Store. Built with Next.js 14 App Router.
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Demonstrating SSG, SSR, ISR, and Client-Side Rendering
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}