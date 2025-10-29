"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // ✅ Check admin login state on mount
  useEffect(() => {
    async function checkAdmin() {
      try {
        const res = await axios.get("/api/admin/check", {
          withCredentials: true,
        });
        setIsAdmin(res.data.isAdmin);
      } catch (err) {
        console.error("Error checking admin status:", err);
      }
    }
    checkAdmin();
  }, []);

  // ✅ Logout handler
  const handleLogout = async () => {
    try {
      await axios.post("/api/admin/logout", {}, { withCredentials: true });
      setIsAdmin(false);
      router.push("/"); // go back home
      window.location.reload(); // refresh navbar
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };

  // ✅ Detect active page
  const isActive = (path) =>
    path === "/" ? pathname === "/" : pathname.startsWith(path);

  // ✅ Dynamic navigation links
  const navLinks = isAdmin
    ? [
        { href: "/", label: "Home" },
        { href: "/dashboard", label: "Dashboard" },
        { href: "/admin", label: "Admin Panel" },
      ]
    : [{ href: "/", label: "Home" },
      { href: "/recommendations", label: "Recommendations" }
    ];

  return (
    <nav className="bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* ✅ Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-blue-600 text-white rounded-md p-1.5 flex items-center justify-center">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
            <span className="text-lg font-semibold text-gray-800">
              E-Commerce Store
            </span>
          </Link>

          {/* ✅ Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${
                  isActive(link.href)
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                }`}
              >
                {link.label}
              </Link>
            ))}
            {/* ✅ Conditional button area */}
            {!isAdmin ? (
              <Link
                href="/admin/admin-login"
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive("/admin/admin-login")
                    ? "bg-blue-700 text-white"
                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                }`}
              >
                Sign in as Admin
              </Link>
            ) : (
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            )}
            
          </div>
        </div>
      </div>
    </nav>
  );
}
