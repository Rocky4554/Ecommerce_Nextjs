import dbConnect from '../lib/mongoose';
import Product from '../lib/models/Product';
import ProductsClient from '../components/ProductsClient.jsx';

// SSG: ensure static generation at build time
export const dynamic = 'force-static';

export default async function Home() {
  await dbConnect();
  const products = await Product.find({}).sort({ lastUpdated: -1 }).lean();
  const safeProducts = JSON.parse(JSON.stringify(products));

  return (
    <div className="min-h-screen bg-gray-50 ">
      <ProductsClient initialProducts={safeProducts} />
    </div>
  );
}
