import './globals.css';
import Navbar from '../components/Navbar';

export const metadata = {
  title: 'E-Commerce Store',
  description: 'Next.js assignment using App Router and MongoDB',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        {/* Fixed Navbar */}
        <header className="fixed top-0 left-0 w-full z-50 bg-white shadow-md">
          <Navbar />
        </header>

        {/* Main Content Area */}
        <main className="pt-20 min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
