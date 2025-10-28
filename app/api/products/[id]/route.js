import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/lib/models/Product';
import { verifyAdminKey, unauthorizedResponse } from '@/lib/utils/auth';
import { validateProductData } from '@/lib/utils/validators';
import { revalidatePath } from 'next/cache';

// PUT /api/products/[id] - Update product (Admin only)
export async function PUT(request, { params }) {
  try {
    // Check admin authentication
    if (!verifyAdminKey(request)) {
      return unauthorizedResponse();
    }

    await connectDB();

    const { id } = params;
    const body = await request.json();

    // Validate product data
    const validation = validateProductData(body);
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, errors: validation.errors },
        { status: 400 }
      );
    }

    // Check if product exists
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    // Check if new slug conflicts with another product
    if (body.slug !== existingProduct.slug) {
      const slugExists = await Product.findOne({ 
        slug: body.slug, 
        _id: { $ne: id } 
      });
      
      if (slugExists) {
        return NextResponse.json(
          { success: false, error: 'Slug already exists for another product' },
          { status: 400 }
        );
      }
    }

    // Update product
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { 
        ...body, 
        lastUpdated: new Date() 
      },
      { new: true, runValidators: true }
    );

    // Trigger on-demand revalidation for ISR
    revalidatePath('/');
    revalidatePath(`/products/${updatedProduct.slug}`);
    revalidatePath('/dashboard');

    return NextResponse.json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct,
    });
  } catch (error) {
    console.error(`PUT /api/products/${params.id} error:`, error);
    
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

// DELETE /api/products/[id] - Delete product (Admin only)
export async function DELETE(request, { params }) {
  try {
    // Check admin authentication
    if (!verifyAdminKey(request)) {
      return unauthorizedResponse();
    }

    await connectDB();

    const { id } = params;

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    // Trigger revalidation
    revalidatePath('/');
    revalidatePath('/dashboard');

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    console.error(`DELETE /api/products/${params.id} error:`, error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}