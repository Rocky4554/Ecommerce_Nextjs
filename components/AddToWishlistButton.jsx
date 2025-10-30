'use client'
import React, { useState } from 'react';
import { toast } from "sonner";

export default function AddToWishlistButton({ productId, productName }) {
  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    await new Promise((res) => setTimeout(res, 400));
    setAdded((prev) => {
 
      if (prev) {
        toast.info(`Removed ${productName} from Wishlist`);
        return false;
      } else {
        toast.success(`Added ${productName} to Wishlist!`);
        return true;
      }
    });
    setLoading(false);
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
        added ? "bg-green-600 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"
      }`}
      aria-label={added ? "Remove from wishlist" : "Add to wishlist"}
    >
      {loading ? (added ? "Removing…" : "Adding…") : added ? "Remove from Wishlist" : "Add to Wishlist"}
    </button>
  );
}
