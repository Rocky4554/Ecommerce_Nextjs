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
  const router = useRouter();

  // ✅ Fetch all products
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

  // ✅ Called after a product is created or edited
  function handleRefresh() {
    fetchProducts();
    setEditing(null);
    setIsModalOpen(false);
  }

  // ✅ Delete Product
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
        alert('Product deleted successfully ✅');
        fetchProducts();
        router.refresh();
      } else {
        alert('Failed to delete product ❌');
      }
    } catch (err) {
      console.error('Delete product error:', err);
      alert('Error deleting product ❌');
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <h1 className="text-3xl font-bold text-gray-800">Admin Panel</h1>
      <p className="text-sm text-gray-600 mt-1">
        Use the form below to create or edit products. <br />
        Protected by{' '}
        <code className="bg-gray-100 px-1 py-0.5 rounded text-red-600">ADMIN_KEY</code>{' '}
        (set in <code>.env.local</code>).
      </p>

      {/* Create Form */}
      <section className="mt-8 bg-white shadow-md rounded-xl p-6 border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Create New Product</h2>
        <ProductForm onCreatedOrUpdated={handleRefresh} />
      </section>

      {/* Product List */}
      <section className="mt-10">
        <h2 className="text-2xl font-semibold text-gray-800">All Products</h2>

        {loading && <p className="mt-3 text-gray-500">Loading products...</p>}

        {!loading && products.length === 0 && (
          <p className="mt-3 text-gray-500">
            No products found. Please add one using the form above.
          </p>
        )}

        {!loading && products.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {products.map((p) => (
              <div
                key={p._id}
                className="bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition p-5"
              >
                <h3 className="text-lg font-semibold text-gray-800">{p.name}</h3>
                <p className="text-sm text-gray-500 mb-1">{p.category}</p>
                <p className="text-blue-600 font-bold text-lg">₹{p.price}</p>
                <p className="text-xs text-gray-500">Stock: {p.inventory}</p>

                <div className="flex gap-3 mt-4">
                  {/* Edit */}
                  <button
                    onClick={() => {
                      setEditing(p);
                      setIsModalOpen(true);
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
                  >
                    Edit
                  </button>

                  {/* View */}
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
            ))}
          </div>
        )}
      </section>

      {/* Edit Modal */}
      {isModalOpen && editing && (
        <EditProductModal
          product={editing}
          onClose={() => setIsModalOpen(false)}
          onUpdated={handleRefresh}
        />
      )}
    </div>
  );
}
