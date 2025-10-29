'use client';
import { useState } from 'react';
import ProductCard from './ProductCard';

export default function SearchBar({ initialProducts = [], products }) {
  const [q, setQ] = useState('');
  const qLower = (q || '').toString().trim().toLowerCase();

  const source = Array.isArray(products) ? products : initialProducts;
  const filtered = (source || []).filter((p) => {
    // defensive defaults and coercion to string
    const name = (p && p.name) ? String(p.name).toLowerCase() : '';
    const category = (p && p.category) ? String(p.category).toLowerCase() : '';
    if (!qLower) return true;
    return name.includes(qLower) || category.includes(qLower);
  });

  return (
    <div className="w-full">
      {/* Search Input */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search products or categories..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
        />
      </div>

      {/* Products Grid */}
     {filtered.length > 0 ? (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {filtered.map((p, index) => (
      <ProductCard key={p._id || p.slug || `temp-${index}`} product={p} />
    ))}
  </div>
) : (
  <p className="text-center text-gray-500 mt-8">
    No products found matching “<span className="font-medium">{q}</span>”.
  </p>
)}
    </div>
  );
}
