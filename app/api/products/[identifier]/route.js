// app/api/products/[identifier]/route.js
import dbConnect from '../../../../lib/mongoose';
import Product from '../../../../lib/models/Product';
import mongoose from 'mongoose';
import imagekit from '../../../../lib/imagekit'; // make sure this is configured

export async function GET(req, context) {
  await dbConnect();
  const { identifier } = await context.params; 

  // Try to find by slug first
  const product = await Product.findOne({ slug: identifier }).lean();

  if (!product) {
    // If slug not found, check if it's a valid ObjectId
    if (mongoose.Types.ObjectId.isValid(identifier)) {
      const byId = await Product.findById(identifier).lean();
      if (byId) return new Response(JSON.stringify(byId), { status: 200 });
    }
    return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });
  }

  return new Response(JSON.stringify(product), { status: 200 });
}

export async function PUT(req, context) {
  await dbConnect();
  const { identifier } = await context.params; // ✅ Await params

  const adminKey = req.headers.get('x-admin-key');

  // ✅ Check admin access
  if (adminKey !== process.env.ADMIN_KEY) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  // ✅ Validate product ID
  if (!mongoose.Types.ObjectId.isValid(identifier)) {
    return new Response(JSON.stringify({ error: 'Invalid product ID' }), { status: 400 });
  }

  try {
    const body = await req.json();

    // ✅ Handle base64 → ImageKit upload
    if (body.image && body.image.startsWith('data:image')) {
      try {
        const uploadResponse = await imagekit.upload({
          file: body.image,
          fileName: `${body.slug || 'product'}-${Date.now()}.jpg`,
          folder: '/Ecommerce',
        });

        body.image = uploadResponse.url;
      } catch (uploadErr) {
        console.error('ImageKit upload failed:', uploadErr);
        return new Response(JSON.stringify({ error: 'Image upload failed' }), { status: 500 });
      }
    }

    body.lastUpdated = new Date();

    // ✅ Update product
    const updatedProduct = await Product.findByIdAndUpdate(identifier, body, { new: true }).lean();

    if (!updatedProduct) {
      return new Response(JSON.stringify({ error: 'Product not found' }), { status: 404 });
    }

    return new Response(JSON.stringify(updatedProduct), { status: 200 });
  } catch (err) {
    console.error('PUT /api/products error:', err);
    return new Response(
      JSON.stringify({ error: 'Server error', details: err.message }),
      { status: 500 }
    );
  }
}

export async function DELETE(req, context) {
  await dbConnect();
  const { identifier } = await context.params;
  const adminKey = req.headers.get('x-admin-key');


  if (adminKey !== process.env.ADMIN_KEY) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  
  if (!mongoose.Types.ObjectId.isValid(identifier)) {
    return new Response(JSON.stringify({ error: 'Invalid product ID' }), { status: 400 });
  }

  try {
    
    const product = await Product.findById(identifier);
    if (!product) {
      return new Response(JSON.stringify({ error: 'Product not found' }), { status: 404 });
    }

 
    if (product.image && product.image.includes('ik.imagekit.io')) {
      const fileId = extractImageKitFileId(product.image);
      await imagekit.deleteFile(fileId);
    }

    await Product.findByIdAndDelete(identifier);

    return new Response(
      JSON.stringify({ message: 'Product deleted successfully' }),
      { status: 200 }
    );
  } catch (err) {
    console.error('DELETE /api/products error:', err);
    return new Response(
      JSON.stringify({ error: 'Server error', details: err.message }),
      { status: 500 }
    );
  }
}