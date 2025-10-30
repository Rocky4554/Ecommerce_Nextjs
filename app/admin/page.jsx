'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ProductForm from '../../components/ProductForm.client';
import EditProductModal from '../../components/EditProductModal';

export default function AdminPage() {
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [activeTab, setActiveTab] = useState('add'); 
  const router = useRouter();


  async function fetchProducts() {
    try {
      setLoading(true);
      const res = await axios.get('/api/products');
      setProducts(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  
  function handleRefresh() {
    fetchProducts();
    setEditing(null);
    setIsModalOpen(false);
  }


  async function handleDelete(id) {
    const confirmDelete = confirm('Are you sure you want to delete this product?');
    if (!confirmDelete) return;

    try {
      setDeleting(true);
      const res = await axios.delete(`/api/products/${id}`, {
        headers: {
          'x-admin-key': process.env.NEXT_PUBLIC_ADMIN_KEY,
        },
      });

      if (res.status === 200) {
        alert('Product deleted successfully ');
        fetchProducts();
        router.refresh();
      } else {
        alert('Failed to delete product ');
      }
    } catch (err) {
      console.error('Delete product error:', err);
      alert('Error deleting product ');
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
  
      <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">Admin Panel</h1>


      <div className="flex justify-center mb-8">
        <div className="inline-flex shadow-lg rounded-lg overflow-hidden">
          <button
            onClick={() => setActiveTab('add')}
            className={`px-8 py-4 text-lg font-semibold transition-all ${
              activeTab === 'add'
                ? 'bg-red-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Add Products
          </button>
          <button
            onClick={() => setActiveTab('list')}
            className={`px-8 py-4 text-lg font-semibold transition-all ${
              activeTab === 'list'
                ? 'bg-yellow-400 text-gray-900'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Edit/Delete products
          </button>
        </div>
      </div>

      <div className="mt-8">
        
        {activeTab === 'add' && (
          <div className="animate-fadeIn">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Add New Product</h2>
            <ProductForm onCreatedOrUpdated={handleRefresh} />
          </div>
        )}

    
        {activeTab === 'list' && (
          <section className="animate-fadeIn">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">All Products</h2>

            {loading && <p className="mt-3 text-gray-500">Loading products...</p>}

            {!loading && products.length === 0 && (
              <p className="mt-3 text-gray-500">
                No products found. Please add one using the form above.
              </p>
            )}

            {!loading && products.length > 0 && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((p) => (
                  <div
                    key={p._id}
                    className="bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition overflow-hidden"
                  >
                 
                    <div className="w-full h-48 bg-gray-100">
                      <img
                        src={p.image || '/placeholder.png'}
                        alt={p.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                 
                    <div className="p-5">
                      <h3 className="text-lg font-semibold text-gray-800">{p.name}</h3>
                      <p className="text-sm text-gray-500 mb-1">{p.category}</p>
                      <p className="text-blue-600 font-bold text-lg">₹{p.price}</p>
                      <p className="text-xs text-gray-500">Stock: {p.inventory}</p>

                      <div className="flex gap-3 mt-4">
                      <button
                        onClick={() => {
                          setEditing(p);
                          setIsModalOpen(true);
                        }}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
                      >
                        Edit
                      </button>

                      <Link href={`/products/${p.slug}`} passHref>
                        <button className="bg-gray-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800 transition">
                          View
                        </button>
                      </Link>

                      <button
                        onClick={() => handleDelete(p._id)}
                        disabled={deleting}
                        className={`${
                          deleting ? 'bg-red-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
                        } text-white px-4 py-2 rounded-lg text-sm transition`}
                      >
                        {deleting ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </div>

  
      {isModalOpen && editing && (
        <EditProductModal
          product={editing}
          onClose={() => setIsModalOpen(false)}
          onUpdated={handleRefresh}
        />
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}