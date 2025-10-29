export async function DELETE(req, context) {
  await dbConnect();
  const { identifier } = await context.params;
  const adminKey = req.headers.get('x-admin-key');

  // ✅ Admin authentication
  if (adminKey !== process.env.ADMIN_KEY) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  // ✅ Validate product ID
  if (!mongoose.Types.ObjectId.isValid(identifier)) {
    return new Response(JSON.stringify({ error: 'Invalid product ID' }), { status: 400 });
  }

  try {
    // ✅ Find product before deleting (for optional ImageKit cleanup)
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