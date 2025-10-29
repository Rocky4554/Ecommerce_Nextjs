'use client';

import { useState } from 'react';
import SearchBar from './SearchBar.client';
import Sidebar from './Sidebar';
import { useProductFilters } from '../lib/actions/useProducts';

export default function ProductsClient({ initialProducts }) {
  const {
    priceRange,
    selectedCategory,
    totalItems,
    categories,
    categoryCounts,
    handleCategoryChange,
    handlePriceChange,
    handleResetFilters,
    filtered,
    minPrice,
    maxPrice,
  } = useProductFilters(initialProducts);

  const [filteredProducts, setFilteredProducts] = useState(initialProducts);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="grid grid-cols-[280px_1fr] flex-1 px-5 py-8 gap-6 max-w-[1600px] mx-auto w-full">
        {/* Sidebar */}
        <aside className="w-[280px] bg-white rounded-lg shadow-md p-2 h-fit sticky top-24 self-start">
          <Sidebar
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            priceRange={priceRange}
            onPriceChange={handlePriceChange}
            onResetFilters={handleResetFilters}
            totalItems={totalItems}
            categories={categories}
            categoryCounts={categoryCounts}
            minPrice={minPrice}
            maxPrice={maxPrice}
          />
        </aside>

        {/* Main Content */}
        <section className="min-w-0 bg-white rounded-lg shadow-md p-6 min-h-[80vh] flex flex-col">
          <div className="mb-8">
            <SearchBar initialProducts={initialProducts} products={filtered} />
          </div>
        </section>
      </main>
    </div>
  );
}
