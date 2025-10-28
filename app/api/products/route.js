import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/lib/models/Product';
import { verifyAdminKey, unauthorizedResponse } from '@/lib/utils/auth';
import { validateProductData } from '@/lib/utils/validators';

// GET /api/products - Fetch all products
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    let query = {};

    // Filter by category
    if (category && category !== 'all') {
      query.category = category;
    }

    // Search by name
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error('GET /api/products error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST /api/products - Create a new product (Admin only)
export async function POST(request) {
  try {
    // Check admin authentication
    if (!verifyAdminKey(request)) {
      return unauthorizedResponse();
    }

    await connectDB();

    const body = await request.json();

    // Validate product data
    const validation = validateProductData(body);
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, errors: validation.errors },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingProduct = await Product.findOne({ slug: body.slug });
    if (existingProduct) {
      return NextResponse.json(
        { success: false, error: 'Product with this slug already exists' },
        { status: 400 }
      );
    }

    // Create product
    const product = await Product.create({
      ...body,
      lastUpdated: new Date(),
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Product created successfully',
        data: product,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/products error:', error);
    
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to create product' },
      { status: 500 }
    );
  }
}