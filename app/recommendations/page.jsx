import dbConnect from '../../lib/mongoose';
import Product from '../../lib/models/Product';
import AddToWishlistButton from '../../components/AddToWishlistButton';

export const metadata = {
  title: 'Product Recommendations - E-Commerce Store',
  description: 'Personalized product recommendations',
};

// Server Component - Fetches data on the server
async function getRecommendedProducts() {
  try {
    await dbConnect();
    
    // Get low stock products (recommendations based on urgency)
    const urgentProducts = await Product.find({ 
      inventory: { $gt: 0, $lt: 10 } 
    })
      .limit(3)
      .lean();

    // Get popular products (highest inventory - best sellers)
    const popularProducts = await Product.find({ 
      inventory: { $gte: 10 } 
    })
      .sort({ inventory: -1 })
      .limit(3)
      .lean();

    const formatProduct = (p) => ({
      ...p,
      _id: p._id.toString(),
    });

    return {
      urgent: urgentProducts.map(formatProduct),
      popular: popularProducts.map(formatProduct),
    };
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return { urgent: [], popular: [] };
  }
}

// Server Component
export default async function RecommendationsPage() {
  const { urgent, popular } = await getRecommendedProducts();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Recommended for You
        </h1>
        <p className="text-gray-600">
          Personalized product suggestions based on availability and popularity
        </p>
     
      </div>

      {/* Urgent Recommendations */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              ⚡ Limited Stock - Act Fast!
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              These products are running low. Grab them before they&apos;re gone!
            </p>
          </div>
        </div>

        {urgent.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {urgent.map((product) => (
              <ProductRecommendationCard 
                key={product._id} 
                product={product}
                badge="Limited Stock"
                badgeColor="bg-red-500"
              />
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <p className="text-gray-600">No low stock products at the moment</p>
          </div>
        )}
      </section>

      {/* Popular Recommendations */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              🔥 Popular Products
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              Customer favorites with plenty of stock
            </p>
          </div>
        </div>

        {popular.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popular.map((product) => (
              <ProductRecommendationCard 
                key={product._id} 
                product={product}
                badge="Popular"
                badgeColor="bg-green-500"
              />
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <p className="text-gray-600">No popular products available</p>
          </div>
        )}
      </section>

    </div>
  );
}

// Server Component for Product Card
function ProductRecommendationCard({ product, badge, badgeColor }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
      {/* Image */}
      <div className="relative h-48">
        <img
          src={product.image || '/placeholder.png'}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        <div className={`absolute top-2 right-2 ${badgeColor} text-white text-xs font-semibold px-2 py-1 rounded`}>
          {badge}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="mb-2">
          <span className="inline-block bg-primary-100 text-primary-700 text-xs font-medium px-2.5 py-0.5 rounded">
            {product.category}
          </span>
        </div>

        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
          {product.name}
        </h3>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl font-bold text-primary-600">
            ${product.price.toFixed(2)}
          </span>
          <span className="text-sm text-gray-600">
            {product.inventory} in stock
          </span>
        </div>

        {/* Client Component for Interactivity */}
        <AddToWishlistButton productId={product._id} productName={product.name} />
      </div>
    </div>
  );
}