// app/dashboard/page.js
import dbConnect from '../../lib/mongoose';
import Product from '../../lib/models/Product';

export const dynamic = 'force-dynamic'; 

export default async function Dashboard() {
  await dbConnect();
  const products = await Product.find({}).sort({ lastUpdated: -1 }).lean();

  const total = products.length;
  const lowStock = products.filter((p) => p.inventory <= 5).length;
  const highStock = products.filter((p) => p.inventory > 20).length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Inventory Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white shadow rounded-lg p-4 flex flex-col items-center">
          <h3 className="text-lg font-semibold text-gray-700">Total Products</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">{total}</p>
        </div>

        <div className="bg-white shadow rounded-lg p-4 flex flex-col items-center">
          <h3 className="text-lg font-semibold text-gray-700">Low Stock (≤5)</h3>
          <p className="text-3xl font-bold text-red-600 mt-2">{lowStock}</p>
        </div>

        <div className="bg-white shadow rounded-lg p-4 flex flex-col items-center">
        
          <h3 className="text-lg font-semibold text-gray-700">
            High Stock ({'>'}20)
          </h3>
          <p className="text-3xl font-bold text-green-600 mt-2">{highStock}</p>
        </div>
      </div>

      {/* Products Table */}
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">All Products</h2>

      {products.length === 0 ? (
        <p className="text-gray-500">
          No products found. Add products from the{' '}
          <a href="/admin" className="text-blue-600 underline">
            Admin panel
          </a>.
        </p>
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                  Name
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                  Category
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                  Inventory
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                  Last Updated
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {products.map((p) => {
                const low = p.inventory <= 5;
                const high = p.inventory > 20;
                return (
                  <tr
                    key={p._id}
                    className={`text-sm transition-colors ${
                      low
                        ? 'bg-red-50'
                        : high
                        ? 'bg-green-50'
                        : 'bg-white hover:bg-gray-50'
                    }`}
                  >
                    <td className="px-4 py-2 font-medium text-gray-800">{p.name}</td>
                    <td className="px-4 py-2 text-gray-600">{p.category}</td>
                    <td className="px-4 py-2 font-semibold text-gray-800">
                      {p.inventory}
                    </td>
                    <td className="px-4 py-2 text-gray-500">
                      {new Date(p.lastUpdated).toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
