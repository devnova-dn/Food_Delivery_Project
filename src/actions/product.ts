'use server';

import connectDB from '@/lib/db';
import Product from '@/models/Product';
import { revalidatePath } from 'next/cache';
import { IProduct } from '@/types';

interface ProductResponse {
  success: boolean;
  data?: IProduct | IProduct[];
  error?: string;
  message?: string;
}

export async function getProducts(filters?: {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  isOrganic?: boolean;
  search?: string;
  sort?: string;
  featured?: boolean;
  page?: number;
  limit?: number;
}): Promise<ProductResponse> {
  try {
    await connectDB();

    const {
      category,
      brand,
      minPrice,
      maxPrice,
      isOrganic,
      search,
      sort,
      featured,
      page = 1,
      limit = 12,
    } = filters || {};

    const query: any = {};

    if (category) query.category = category;
    if (brand) query.brand = brand;
    if (isOrganic !== undefined) query.isOrganic = isOrganic;
    if (featured) query.isFeatured = true;
    if (search) {
      query.$text = { $search: search };
    }
    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined) query.price.$gte = minPrice;
      if (maxPrice !== undefined) query.price.$lte = maxPrice;
    }

    let sortOption = {};
    switch (sort) {
      case 'price-asc':
        sortOption = { price: 1 };
        break;
      case 'price-desc':
        sortOption = { price: -1 };
        break;
      case 'rating':
        sortOption = { rating: -1 };
        break;
      case 'newest':
        sortOption = { createdAt: -1 };
        break;
      default:
        sortOption = { rating: -1 };
    }

    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      Product.find(query)
        .sort(sortOption)
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(query),
    ]);

    return {
      success: true,
      data: products as IProduct[],
    };
  } catch (error) {
    console.error('Get products error:', error);
    return { success: false, error: 'Failed to fetch products' };
  }
}

export async function getProductBySlug(slug: string): Promise<ProductResponse> {
  try {
    await connectDB();

    const product = await Product.findOne({ slug }).lean();

    if (!product) {
      return { success: false, error: 'Product not found' };
    }

    return { success: true, data: product as IProduct };
  } catch (error) {
    console.error('Get product error:', error);
    return { success: false, error: 'Failed to fetch product' };
  }
}

export async function getProductById(id: string): Promise<ProductResponse> {
  try {
    await connectDB();

    const product = await Product.findById(id).lean();

    if (!product) {
      return { success: false, error: 'Product not found' };
    }

    return { success: true, data: product as IProduct };
  } catch (error) {
    console.error('Get product error:', error);
    return { success: false, error: 'Failed to fetch product' };
  }
}

export async function getRelatedProducts(
  category: string,
  currentProductId: string,
  limit: number = 4
): Promise<ProductResponse> {
  try {
    await connectDB();

    const products = await Product.find({
      category,
      _id: { $ne: currentProductId },
    })
      .sort({ rating: -1 })
      .limit(limit)
      .lean();

    return { success: true, data: products as IProduct[] };
  } catch (error) {
    console.error('Get related products error:', error);
    return { success: false, error: 'Failed to fetch related products' };
  }
}

export async function getFeaturedProducts(limit: number = 8): Promise<ProductResponse> {
  try {
    await connectDB();

    const products = await Product.find({ isFeatured: true })
      .sort({ rating: -1 })
      .limit(limit)
      .lean();

    return { success: true, data: products as IProduct[] };
  } catch (error) {
    console.error('Get featured products error:', error);
    return { success: false, error: 'Failed to fetch featured products' };
  }
}

export async function createProduct(data: Partial<IProduct>): Promise<ProductResponse> {
  try {
    await connectDB();

    const product = await Product.create(data);

    revalidatePath('/admin/products');
    revalidatePath('/');

    return { success: true, data: product as IProduct, message: 'Product created successfully' };
  } catch (error) {
    console.error('Create product error:', error);
    return { success: false, error: 'Failed to create product' };
  }
}

export async function updateProduct(id: string, data: Partial<IProduct>): Promise<ProductResponse> {
  try {
    await connectDB();

    const product = await Product.findByIdAndUpdate(id, data, { new: true }).lean();

    if (!product) {
      return { success: false, error: 'Product not found' };
    }

    revalidatePath('/admin/products');
    revalidatePath(`/admin/products/${id}`);
    revalidatePath('/');
    revalidatePath('/products');

    return { success: true, data: product as IProduct, message: 'Product updated successfully' };
  } catch (error) {
    console.error('Update product error:', error);
    return { success: false, error: 'Failed to update product' };
  }
}

export async function deleteProduct(id: string): Promise<ProductResponse> {
  try {
    await connectDB();

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return { success: false, error: 'Product not found' };
    }

    revalidatePath('/');

    return { success: true, message: 'Product deleted successfully' };
  } catch (error) {
    console.error('Delete product error:', error);
    return { success: false, error: 'Failed to delete product' };
  }
}

export async function addReview(
  productId: string,
  review: { userId: string; userName: string; rating: number; comment: string }
): Promise<ProductResponse> {
  try {
    await connectDB();

    const product = await Product.findById(productId);

    if (!product) {
      return { success: false, error: 'Product not found' };
    }

    const newReview = {
      ...review,
      createdAt: new Date(),
    };

    product.reviews.push(newReview as any);
    product.numReviews = product.reviews.length;
    product.rating = product.reviews.reduce((sum, r: any) => sum + r.rating, 0) / product.reviews.length;

    await product.save();

    revalidatePath(`/products/${product.slug}`);

    return { success: true, message: 'Review added successfully' };
  } catch (error) {
    console.error('Add review error:', error);
    return { success: false, error: 'Failed to add review' };
  }
}

export async function getCategories(): Promise<{ id: string; name: string; count: number }[]> {
  try {
    await connectDB();

    const categories = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    return categories.map((cat) => ({
      id: cat._id,
      name: cat._id,
      count: cat.count,
    }));
  } catch (error) {
    console.error('Get categories error:', error);
    return [];
  }
}
