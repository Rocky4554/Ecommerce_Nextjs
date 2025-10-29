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
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
