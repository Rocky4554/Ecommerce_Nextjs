import Image from 'next/image';
import Link from 'next/link';
import connectDB from '@/lib/mongodb';
import Product from '@/lib/models/Product';
import { notFound } from 'next/navigation';

// Enable Incremental Static Regeneration (ISR)
// Revalidate every 60 seconds
export const revalidate = 60;

// Generate static params for all products at build time
export async function generateStaticParams() {
  try {
    await connectDB();
    const products = await Product.find({}).select('slug').lean();
    
    return products.map((product) => ({
      slug: product.slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }) {
  const { slug } = params;
  
  try {
    await connectDB();
    const product = await Product.findOne({ slug }).lean();
    
    if (!product) {
      return {
        title: 'Product Not Found',
      };
    }
    
    return {
      title: `${product.name} - E-Commerce Store`,
      description: product.description,
    };
  } catch (error) {
    return {
      title: 'Product - E-Commerce Store',
    };
  }
}

// Fetch product data
async function getProduct(slug) {
  try {
    await connectDB();
    const product = await Product.findOne({ slug }).lean();
    
    if (!product) {
      return null;
    }
    
    return {
      ...product,
      _id: product._id.toString(),
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
      lastUpdated: product.lastUpdated.toISOString(),
    };
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export default async function ProductDetailPage({ params }) {
  const { slug } = params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const isLowStock = product.inventory < 10;
  const isOutOfStock = product.inventory === 0;
  const lastUpdatedDate = new Date(product.lastUpdated).toLocaleString();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm">
        <Link href="/" className="text-primary-600 hover:underline">
          Home
        </Link>
        <span className="mx-2 text-gray-400">/</span>
        <span className="text-gray-600">{product.name}</span>
      </nav>

      {/* ISR Info Badge */}
      <div className="mb-6 bg-purple-50 border border-purple-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <span className="text-purple-800 text-sm">
            <strong>ISR (Incremental Static Regeneration):</strong> This page regenerates every 60 seconds
          </span>
        </div>
        <p className="text-purple-600 text-xs mt-1">
          Last updated: {lastUpdatedDate}
        </p>
      </div>

      {/* Product Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Image */}
        <div className="relative">
          <div className="relative h-96 lg:h-[500px] rounded-lg overflow-hidden bg-gray-100">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
            {isLowStock && !isOutOfStock && (
              <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-lg text-sm font-semibold">
                Only {product.inventory} left!
              </div>
            )}
            {isOutOfStock && (
              <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-lg text-sm font-semibold">
                Out of Stock
              </div>
            )}