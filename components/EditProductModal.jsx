'use client';
import { useState } from 'react';
import ProductForm from './ProductForm.client';

export default function EditProductModal({ product, onClose, onUpdated }) {
  const [isClosing, setIsClosing] = useState(false);

  function handleClose() {
  setIsClosing(true);
  setTimeout(onClose, 200);
  }

  return (
    <div
      className={`fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 transition-opacity duration-200 ${
        isClosing ? 'opacity-0' : 'opacity-100'
      }`}
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
     
      <div
        className="relative bg-white w-full max-w-3xl max-h-full rounded-2xl shadow-xl border border-gray-100 
                   flex flex-col overflow-hidden
                   animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
       
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-2xl font-semibold text-gray-800">Edit Product</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-800 text-xl transition-colors"
          >
            ✕
          </button>
        </div>

  
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-2xl mx-auto">
            <ProductForm
              initial={product}
              onCreatedOrUpdated={() => {
                onUpdated();
                handleClose();
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}