'use client'
import React, { useState } from 'react';

export default function AddToWishlistButton({ productId, productName }) {
  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    try {
      setLoading(true);
      await new Promise((res) => setTimeout(res, 400));
      setAdded(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading || added}
      className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
        added
          ? 'bg-green-600 text-white'
          : 'bg-blue-600 hover:bg-blue-700 text-white'
      }`}
      aria-label={added ? 'Added to wishlist' : 'Add to wishlist'}
    >
      {added ? 'Added to Wishlist' : loading ? 'Adding…' : 'Add to Wishlist'}
    </button>
  );
}
