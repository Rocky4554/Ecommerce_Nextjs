  'use client';

  import { useState, useEffect, useMemo } from 'react';

  export function useQueryState(defaults) {
    const [state, setState] = useState(() => {
      try {
        const q = new URLSearchParams(window.location.search);
        return {
          sort: q.get("sort") || defaults.sort,
          page: Number(q.get("page") || defaults.page),
        };
      } catch {
        return defaults;
      }
    });

    useEffect(() => {
      const q = new URLSearchParams(window.location.search);
      if (state.sort) q.set("sort", state.sort);
      else q.delete("sort");
      if (state.page) q.set("page", String(state.page));
      else q.delete("page");
      const newUrl = `${window.location.pathname}?${q.toString()}`;
      window.history.replaceState({}, "", newUrl);
    }, [state]);

    return [state, setState];
  }

  export function useProductFilters(initialProducts) {
    const [queryState, setQueryState] = useQueryState({
      sort: "name_asc",
      page: 1,
    });

    const [priceRange, setPriceRange] = useState([0, 100000]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [perPage] = useState(6);
    
    // Dynamic price bounds from data
    const { minPrice, maxPrice } = useMemo(() => {
      if (!Array.isArray(initialProducts) || initialProducts.length === 0) {
        return { minPrice: 0, maxPrice: 1000 };
      }
      let min = Infinity;
      let max = -Infinity;
      for (const p of initialProducts) {
        const value = typeof p.price === 'number' ? p.price : Number(p?.price ?? NaN);
        if (Number.isFinite(value)) {
          if (value < min) min = value;
          if (value > max) max = value;
        }
      }
      if (!Number.isFinite(min) || !Number.isFinite(max)) {
        return { minPrice: 0, maxPrice: 1000 };
      }
      if (min === max) {
        // widen by 10% around single-price datasets for usable slider
        const pad = Math.max(1, Math.round(min * 0.1));
        return { minPrice: Math.max(0, min - pad), maxPrice: max + pad };
      }
      return { minPrice: Math.floor(min), maxPrice: Math.ceil(max) };
    }, [initialProducts]);

    // Ensure priceRange stays within data-driven bounds and initialize on mount/data change
    useEffect(() => {
      setPriceRange((prev) => {
        const [lo, hi] = Array.isArray(prev) ? prev : [minPrice, maxPrice];
        const clampedLo = Math.max(minPrice, Math.min(lo, maxPrice));
        const clampedHi = Math.max(minPrice, Math.min(hi, maxPrice));
        if (clampedLo === lo && clampedHi === hi) return prev;
        return [clampedLo, clampedHi].sort((a, b) => a - b);
      });
    }, [minPrice, maxPrice]);


    // Compute derived data
    const totalItems = useMemo(() => {
      return initialProducts.length;
    }, [initialProducts]);

    const categories = useMemo(() => {
      const set = new Set(initialProducts.map((p) => p.category).filter(Boolean));
      return Array.from(set).sort();
    }, [initialProducts]);

    const categoryCounts = useMemo(() => {
      return initialProducts.reduce((acc, product) => {
        const key = product.category || "Unknown";
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {});
    }, [initialProducts]);

    // Apply filters
    const filtered = useMemo(() => {
      return initialProducts.filter((p) => {
        if (typeof p.price !== "number") return false;
        if (p.price < priceRange[0] || p.price > priceRange[1]) return false;
        if (selectedCategory && p.category !== selectedCategory) return false;
        return true;
      });
    }, [initialProducts, priceRange, selectedCategory]);

    // Apply sorting
    const sorted = useMemo(() => {
      const arr = [...filtered];
      const s = queryState.sort || "name_asc";
      if (s === "name_asc") arr.sort((a, b) => a.name.localeCompare(b.name));
      if (s === "name_desc") arr.sort((a, b) => b.name.localeCompare(a.name));
      if (s === "price_asc") arr.sort((a, b) => a.price - b.price);
      if (s === "price_desc") arr.sort((a, b) => b.price - a.price);
      if (s === "popularity_desc")
        arr.sort((a, b) => (b.ratingCount || 0) - (a.ratingCount || 0));
      return arr;
    }, [filtered, queryState.sort]);

    // Pagination
    const totalPages = Math.max(1, Math.ceil(sorted.length / perPage));
    const currentPage = Math.min(queryState.page || 1, totalPages);

    useEffect(() => {
      if (queryState.page > totalPages) {
        setQueryState((s) => ({ ...s, page: 1 }));
      }
    }, [totalPages, queryState.page, setQueryState]);

    const visible = useMemo(() => {
      const start = (currentPage - 1) * perPage;
      return sorted.slice(start, start + perPage);
    }, [sorted, currentPage, perPage]);

    // Handler functions
    const handleCategoryChange = (category) => {
      setSelectedCategory((prev) => (prev === category ? "" : category));
      setQueryState((s) => ({ ...s, page: 1 }));
    };

    const handlePriceChange = (newRange) => {
      setPriceRange(newRange);
      setQueryState((s) => ({ ...s, page: 1 }));
    };

    const handleResetFilters = () => {
      setSelectedCategory("");
      setPriceRange([minPrice, maxPrice]);
      setQueryState((s) => ({
        ...s,
        page: 1,
        sort: "name_asc",
      }));
    };

    const handleSortChange = (sortValue) => {
      setQueryState((s) => ({ ...s, sort: sortValue, page: 1 }));
    };

    const handlePageChange = (page) => {
      setQueryState((s) => ({ ...s, page }));
    };

    return {
      // State
      queryState,
      priceRange,
      selectedCategory,
      perPage,
      
      // Computed
      totalItems,
      categories,
      categoryCounts,
      minPrice,
      maxPrice,
      filtered,
      sorted,
      visible,
      totalPages,
      currentPage,
      
      // Handlers
      handleCategoryChange,
      handlePriceChange,
      handleResetFilters,
      handleSortChange,
      handlePageChange,
    };
  }
