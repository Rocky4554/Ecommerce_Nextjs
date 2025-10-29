  // app/page.js
  import dbConnect from '../lib/mongoose';
  import Product from '../lib/models/Product';
  import SearchBar from '../components/SearchBar.client';

  export default async function Home() {
    await dbConnect();
    const products = await Product.find({}).sort({ lastUpdated: -1 }).lean();
      const safeProducts = JSON.parse(JSON.stringify(products))
       console.log("Safe Products:", safeProducts);

    return (
      <div>
        <h1>Products</h1>
        <p className="small">Static page (SSG) — data fetched at build time. Use the search to filter on client.</p>
       
        <SearchBar initialProducts={safeProducts} />
      </div>
    );
  }
