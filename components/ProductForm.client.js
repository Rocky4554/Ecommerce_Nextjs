'use client';
import { useState } from 'react';
import axios from 'axios';

export default function ProductForm({ onCreatedOrUpdated, initial = null }) {
  const [form, setForm] = useState(
    initial || {
      name: '',
      slug: '',
      description: '',
      price: '',
      category: '',
      inventory: '',
      image: '',
    }
  );
  const [message, setMessage] = useState('');

  function setField(k, v) {
    setForm((prev) => ({ ...prev, [k]: v }));
  }

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setField('image', reader.result);
      };
      reader.readAsDataURL(file);
    }
  }

  async function submit(e) {
    e.preventDefault();
    setMessage('Saving...');
    try {
      const payload = {
        name: form.name,
        slug: form.slug,
        description: form.description,
        price: Number(form.price),
        category: form.category,
        inventory: Number(form.inventory),
        image: form.image || '',
      };

      const headers = { 'x-admin-key': process.env.NEXT_PUBLIC_ADMIN_KEY || '' };

      let res;
      if (initial && initial._id) {
        res = await axios.put(`/api/products/${initial._id}`, payload, { headers });
        setMessage('✅ Product updated successfully');
      } else {
        res = await axios.post('/api/products', payload, { headers });
        setMessage('✅ Product created successfully');
        setForm({
          name: '',
          slug: '',
          description: '',
          price: '',
          category: '',
          inventory: '',
          image: '',
        });
      }
      onCreatedOrUpdated && onCreatedOrUpdated(res.data);
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || 'Something went wrong';
      setMessage('❌ ' + errorMsg);
    }
  }

  return (
    <form
      onSubmit={submit}
      className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 space-y-6 max-w-2xl mx-auto"
    >
      <h2 className="text-2xl font-semibold text-gray-800">
        {initial ? 'Edit Product' : 'Create New Product'}
      </h2>
      <p className="text-gray-500 text-sm">
        Fill out the form below to {initial ? 'update' : 'add'} a product to your store.
      </p>

      {/* Name & Slug */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700">Product Name</label>
          <input
            className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="e.g. Nike Air Max 90"
            value={form.name}
            onChange={(e) => setField('name', e.target.value)}
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Slug</label>
          <input
            className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="e.g. nike-air-max-90"
            value={form.slug}
            onChange={(e) => setField('slug', e.target.value)}
            required
          />
        </div>
      </div>

      {/* Category & Price */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700">Category</label>
          <input
            className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="e.g. Shoes, Electronics"
            value={form.category}
            onChange={(e) => setField('category', e.target.value)}
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Price (₹)</label>
          <input
            className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            type="number"
            placeholder="e.g. 4999"
            value={form.price}
            onChange={(e) => setField('price', e.target.value)}
            required
          />
        </div>
      </div>

      {/* Inventory */}
      <div>
        <label className="text-sm font-medium text-gray-700">Inventory</label>
        <input
          className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          type="number"
          placeholder="e.g. 20"
          value={form.inventory}
          onChange={(e) => setField('inventory', e.target.value)}
          required
        />
      </div>

      {/* Image Upload */}
      <div>
        <label className="text-sm font-medium text-gray-700">Product Image</label>
        <div className="flex flex-col sm:flex-row items-center gap-3 mt-1">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-700 border border-gray-300 rounded-lg cursor-pointer focus:ring-2 focus:ring-blue-500 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-600 file:text-white file:text-sm hover:file:bg-blue-700"
          />
        </div>
        {form.image && (
          <div className="mt-3">
            <img
              src={form.image}
              alt="Preview"
              className="w-full h-56 object-cover rounded-lg border border-gray-300 shadow-sm"
            />
          </div>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="text-sm font-medium text-gray-700">Description</label>
        <textarea
          className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="Write a short description of the product..."
          value={form.description}
          onChange={(e) => setField('description', e.target.value)}
          rows="4"
        />
      </div>

      {/* Submit Button */}
      <div className="flex items-center justify-between">
        <button
          type="submit"
          className="bg-blue-600 text-white font-medium px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          {initial ? 'Update Product' : 'Create Product'}
        </button>
        <p
          className={`text-sm font-medium ${
            message.startsWith('✅')
              ? 'text-green-600'
              : message.startsWith('❌')
              ? 'text-red-600'
              : 'text-gray-600'
          }`}
        >
          {message}
        </p>
      </div>
    </form>
  );
}
