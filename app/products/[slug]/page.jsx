import dbConnect from '../../../lib/mongoose';
import Product from '../../../lib/models/Product';

export const revalidate = 60; // ISR - Regenerate every 60 seconds

// ✅ Pre-generate static params for each product (for SSG + ISR)
export async function generateStaticParams() {
  await dbConnect();
  const products = await Product.find({}, 'slug'); // only fetch slug field
  return products.map((p) => ({
    slug: p.slug,
  }));
}

// ✅ Product detail page
export default async function ProductPage({ params }) {
  await dbConnect();

  // In Next.js App Router, params can sometimes be a promise, so await it safely
  const { slug } = await params;

  // Fetch the product by slug
  const product = await Product.findOne({ slug }).lean();

  // Handle not found
  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center text-center min-h-[50vh]">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Product not found
        </h2>
        <p className="text-gray-500">
          This product might have been removed or doesn’t exist.
        </p>
      </div>
    );
  }

  // ✅ Render the product details
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Product Title */}
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
      <p className="text-sm text-gray-500 mb-6">{product.category}</p>

      {/* Product Image */}
      <div className="w-full rounded-lg overflow-hidden shadow-sm mb-6">
        <img
          src={product.image || '/placeholder.png'}
          alt={product.name}
          className="w-full h-96 object-cover rounded-lg"
        />
      </div>

      {/* Product Description */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <p className="text-gray-700 leading-relaxed mb-4">
          {product.description || 'No description available.'}
        </p>

        {/* Price and Inventory */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6">
          <p className="text-lg">
            <strong className="text-gray-800">Price:</strong>{' '}
            <span className="text-blue-600 font-semibold">
              ₹{product.price}
            </span>
          </p>

          <p className="text-lg">
            <strong className="text-gray-800">Inventory:</strong>{' '}
            <span
              className={`font-semibold ${
                product.inventory <= 5
                  ? 'text-red-600'
                  : product.inventory > 20
                  ? 'text-green-600'
                  : 'text-gray-800'
              }`}
            >
              {product.inventory}
            </span>
          </p>
        </div>

        {/* Last Updated */}
        <p className="text-sm text-gray-500 mt-6">
          Last updated:{' '}
          <span className="font-medium text-gray-700">
            {new Date(product.lastUpdated).toLocaleString()}
          </span>
        </p>
      </div>
    </div>
  );
}
