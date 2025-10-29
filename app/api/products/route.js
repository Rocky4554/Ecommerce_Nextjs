import dbConnect from '../../../lib/mongoose';
import Product from '../../../lib/models/Product';
import imagekit from '../../../lib/imagekit';

export async function GET(req) {
  await dbConnect();
  const url = new URL(req.url);
  const category = url.searchParams.get('category');
  const filter = {};
  if (category) filter.category = category;

  const products = await Product.find(filter).sort({ lastUpdated: -1 }).lean();
  return new Response(JSON.stringify(products), { status: 200 });
}

export async function POST(req) {
  try {
    await dbConnect();

    const adminKey = req.headers.get('x-admin-key');
    if (adminKey !== process.env.ADMIN_KEY) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const body = await req.json();

    // ✅ Validate required fields
    if (!body.name || !body.slug || body.price == null) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }

    // ✅ Check for duplicate slug
    const exists = await Product.findOne({ slug: body.slug });
    if (exists) {
      return new Response(JSON.stringify({ error: 'Slug already exists' }), { status: 409 });
    }

    let finalImageUrl = 'https://via.placeholder.com/400x300?text=No+Image';

    // ✅ Handle image (base64 or URL)
    if (body.image) {
      try {
        if (body.image.startsWith('data:image')) {
          // Upload base64 image to ImageKit
          const uploadRes = await imagekit.upload({
            file: body.image,
            fileName: `product-${Date.now()}.jpg`,
            folder: '/Ecoomerce',
          });

          // Generate preview version and store as main image
          finalImageUrl = imagekit.url({
            path: uploadRes.filePath,
            transformation: [
              {
                height: 400,
                width: 400,
                crop: 'maintain_ratio',
              },
            ],
          });
        } else if (body.image.startsWith('http')) {
          // If already a hosted URL
          finalImageUrl = body.image;
        }
      } catch (err) {
        console.error('❌ ImageKit upload failed:', err);
      }
    }

    // ✅ Create product with ImageKit preview URL as image
    const newProduct = new Product({
      name: body.name,
      slug: body.slug,
      description: body.description || '',
      price: Number(body.price),
      category: body.category || 'general',
      inventory: Number(body.inventory) || 0,
      image: finalImageUrl, // 🖼️ save preview URL directly
      lastUpdated: new Date(),
    });

    await newProduct.save();

    return new Response(JSON.stringify(newProduct), { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return new Response(JSON.stringify({ error: 'Failed to create product' }), { status: 500 });
  }
}
