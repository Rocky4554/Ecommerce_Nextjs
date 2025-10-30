import Link from "next/link";

export default function ProductCard({ product }) {
  const imageSrc =
    product.image && product.image.trim() !== ""
      ? product.image
      : "/placeholder.png";

  return (
    <div
      className="
        bg-white shadow-md rounded-lg overflow-hidden
        transform transition-all duration-300
        hover:-translate-y-2 hover:shadow-xl
      "
    >
      {/* Product Image */}
      <div className="relative w-full h-48 bg-gray-100">
        <img
          src={imageSrc}
          alt={product.name || "Product image"}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = "/placeholder.png";
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
            product.inventory < 10 ? "text-red-600" : "text-green-600"
          }`}
        >
          {product.inventory < 10
            ? `🔥 Hurry up! Only ${product.inventory} left in stock!`
            : "✅ In stock"}
        </p>

        <div className="mt-4">
          <Link
            href={`/products/${product.slug}`}
            className="
              inline-block w-full text-center bg-blue-600 text-white
              text-sm font-medium py-2 px-4 rounded-lg
              hover:bg-blue-700 transition-colors duration-200
            "
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
