'use server';

import connectDB from '@/lib/db';
import Order from '@/models/Order';
import { revalidatePath } from 'next/cache';
import { IOrder, IOrderItem, IShippingAddress } from '@/types';

interface OrderResponse {
  success: boolean;
  data?: IOrder | IOrder[];
  error?: string;
  message?: string;
}

export async function createOrder(data: {
  userId: string;
  userEmail: string;
  orderItems: IOrderItem[];
  shippingAddress: IShippingAddress;
  itemsPrice: number;
  shippingPrice: number;
  totalPrice: number;
}): Promise<OrderResponse> {
  try {
    await connectDB();

    const order = await Order.create({
      ...data,
      paymentMethod: 'cod',
      status: 'pending',
    });

    revalidatePath('/account');
    revalidatePath('/admin/orders');

    return { success: true, data: order as IOrder, message: 'Order created successfully' };
  } catch (error) {
    console.error('Create order error:', error);
    return { success: false, error: 'Failed to create order' };
  }
}

export async function getUserOrders(userId: string): Promise<OrderResponse> {
  try {
    await connectDB();

    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 })
      .lean();

    return { success: true, data: orders as IOrder[] };
  } catch (error) {
    console.error('Get user orders error:', error);
    return { success: false, error: 'Failed to fetch orders' };
  }
}

export async function getOrderById(orderId: string): Promise<OrderResponse> {
  try {
    await connectDB();

    const order = await Order.findById(orderId).lean();

    if (!order) {
      return { success: false, error: 'Order not found' };
    }

    return { success: true, data: order as IOrder };
  } catch (error) {
    console.error('Get order error:', error);
    return { success: false, error: 'Failed to fetch order' };
  }
}

export async function getAllOrders(page: number = 1, limit: number = 20): Promise<OrderResponse> {
  try {
    await connectDB();

    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      Order.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Order.countDocuments(),
    ]);

    return {
      success: true,
      data: orders as IOrder[],
    };
  } catch (error) {
    console.error('Get all orders error:', error);
    return { success: false, error: 'Failed to fetch orders' };
  }
}

export async function updateOrderStatus(
  orderId: string,
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
): Promise<OrderResponse> {
  try {
    await connectDB();

    const updateData: any = { status };

    if (status === 'delivered') {
      updateData.isDelivered = true;
      updateData.deliveredAt = new Date();
    }

    const order = await Order.findByIdAndUpdate(orderId, updateData, { new: true }).lean();

    if (!order) {
      return { success: false, error: 'Order not found' };
    }

    revalidatePath('/admin/orders');
    revalidatePath(`/account`);

    return { success: true, data: order as IOrder, message: 'Order status updated' };
  } catch (error) {
    console.error('Update order status error:', error);
    return { success: false, error: 'Failed to update order status' };
  }
}

export async function getAdminStats(): Promise<{
  success: boolean;
  data?: {
    totalRevenue: number;
    totalOrders: number;
    totalProducts: number;
    totalUsers: number;
    recentOrders: IOrder[];
    ordersByStatus: { status: string; count: number }[];
    topProducts: { productId: string; title: string; totalSold: number }[];
  };
  error?: string;
}> {
  try {
    await connectDB();

    const [
      totalOrders,
      totalRevenue,
      orderStats,
      recentOrders,
    ] = await Promise.all([
      Order.countDocuments(),
      Order.aggregate([
        { $group: { _id: null, total: { $sum: '$totalPrice' } } },
      ]),
      Order.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      Order.find().sort({ createdAt: -1 }).limit(5).lean(),
    ]);

    const Product = (await import('@/models/Product')).default;
    const User = (await import('@/models/User')).default;

    const [totalProducts, totalUsers, topProducts] = await Promise.all([
      Product.countDocuments(),
      User.countDocuments(),
      Order.aggregate([
        { $unwind: '$orderItems' },
        {
          $group: {
            _id: '$orderItems.productId',
            title: { $first: '$orderItems.title' },
            totalSold: { $sum: '$orderItems.quantity' },
          },
        },
        { $sort: { totalSold: -1 } },
        { $limit: 5 },
      ]),
    ]);

    return {
      success: true,
      data: {
        totalRevenue: totalRevenue[0]?.total || 0,
        totalOrders,
        totalProducts,
        totalUsers,
        recentOrders: recentOrders as IOrder[],
        ordersByStatus: orderStats.map((stat) => ({
          status: stat._id,
          count: stat.count,
        })),
        topProducts: topProducts.map((p) => ({
          productId: p._id,
          title: p.title,
          totalSold: p.totalSold,
        })),
      },
    };
  } catch (error) {
    console.error('Get admin stats error:', error);
    return { success: false, error: 'Failed to fetch stats' };
  }
}
