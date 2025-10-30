
'use client';

import SearchBar from './SearchBar.client';
import Sidebar from './Sidebar';
import Pagination from './Pagination'; 
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
    minPrice,
    maxPrice,
    visible, 
    totalPages,
    currentPage,
    handlePageChange,
  } = useProductFilters(initialProducts);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="grid grid-cols-1 lg:grid-cols-[280px_1fr] flex-1 px-3 sm:px-5 py-4 sm:py-8 gap-4 sm:gap-6 max-w-[1600px] mx-auto w-full">
        
        
        <aside className="hidden lg:block w-[280px] bg-white rounded-lg shadow-md p-2 h-fit sticky top-24 self-start">
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

      
        <section className="min-w-0 bg-white rounded-lg shadow-md p-4 sm:p-6 min-h-[80vh] flex flex-col w-full">
   
          <div className="mb-6 sm:mb-8">
            <SearchBar initialProducts={initialProducts} products={visible} />
          </div>

        
          <div className="flex-1">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </section>
      </main>
    </div>
  );
}