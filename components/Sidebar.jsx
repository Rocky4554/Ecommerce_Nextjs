import React, { useState } from "react";
import DualRangeSlider from "./PriceSlider";

export default function Sidebar({
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceChange,
  onResetFilters,
  totalItems,
  categories,
  categoryCounts,
  minPrice,
  maxPrice,
}) {
  const [categoriesOpen, setCategoriesOpen] = useState(true);

  return (
    <div className="w-full">
      <div className="rounded-sm bg-white sticky top-24">
        {/* Categories Section */}
        <div className="bg-neutral-100 p-4 rounded-sm">
          <button
            className="w-full flex items-center justify-between text-lg font-medium mb-3 cursor-pointer"
            onClick={() => setCategoriesOpen((s) => !s)}
            aria-expanded={categoriesOpen}
          >
            <span className="text-[20px] font-poppins font-[500]">Categories</span>
            {categoriesOpen ? <ChevronUp /> : <ChevronDown />}
          </button>

          {categoriesOpen && (
            <ul className="space-y-3 mt-6 text-sm">
              <li>
                <button
                  onClick={() => onCategoryChange("")}
                  className={`w-full text-left py-2 px-2 text-[18px] font-[400] font-Proxima Nova rounded flex justify-between cursor-pointer ${
                    !selectedCategory
                      ? "bg-blue-100 text-blue-800 font-medium"
                      : "hover:text-blue-600"
                  }`}
                >
                  All Categories
                  <span className="text-gray-500">({totalItems})</span>
                </button>
              </li>
              {categories.map((c) => (
                <li key={c}>
                  <button
                    onClick={() => onCategoryChange(c)}
                    className={`w-full text-left py-2 px-2 text-[18px] font-[400] font-Proxima Nova rounded flex justify-between cursor-pointer ${
                      selectedCategory === c
                        ? "bg-blue-100 text-blue-800 font-medium"
                        : "hover:bg-blue-50"
                    }`}
                  >
                    {c}
                    <span className="text-gray-500">
                      {categoryCounts?.[c] || 0}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Price Slider */}
        <DualRangeSlider
          min={minPrice}
          max={maxPrice}
          priceRange={priceRange}
          onPriceChange={onPriceChange}
        />

        {/* Reset Filters Button */}
        <div className="mt-6 p-4">
          <button
            onClick={onResetFilters}
            className="w-full px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg cursor-pointer text-[18px] font-poppins font-[500] shadow-md transition-colors duration-200"
          >
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  );
}

function ChevronUp() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m18 15-6-6-6 6" />
    </svg>
  );
}

function ChevronDown() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}