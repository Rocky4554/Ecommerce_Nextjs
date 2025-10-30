import "./globals.css";
import Navbar from "../components/Navbar";
import { Toaster } from "sonner";

export const metadata = {
  title: "E-Commerce Store",
  description: "Next.js assignment using App Router and MongoDB",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        <header className="fixed top-0 left-0 w-full z-50 bg-white shadow-md">
          <Navbar />
        </header>

        <main className="pt-20 min-h-screen">{children}</main>

    
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
