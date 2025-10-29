import Link from 'next/link';

export default function ProductCard({ product }) {
  // Fallback placeholder image if none exists
  const imageSrc =
    product.image && product.image.trim() !== ''
      ? product.image
      : 'https://via.placeholder.com/400x300?text=No+Image';

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Product Image */}
      <div className="relative w-full h-48 bg-gray-100">
        <img
          src={imageSrc}
          alt={product.name || 'Product image'}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
          }}
        />
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-1">
          {product.name}
        </h3>
        <p className="text-sm text-gray-500 mb-2">{product.category}</p>
        <p className="text-lg font-bold text-blue-600 mb-1">₹{product.price}</p>
        <p
          className={`text-sm font-medium ${
            product.inventory <= 5
              ? 'text-red-600'
              : product.inventory > 20
              ? 'text-green-600'
              : 'text-gray-600'
          }`}
        >
          Stock: {product.inventory}
        </p>

        {/* View Button */}
        <div className="mt-4">
          <Link
            href={`/products/${product.slug}`}
            className="inline-block w-full text-center bg-blue-600 text-white text-sm font-medium py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
