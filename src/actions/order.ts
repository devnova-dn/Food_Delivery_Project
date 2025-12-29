'use server';

import connectDB from '@/lib/db';
import Order from '@/models/Order';
import { revalidatePath } from 'next/cache';
import { IOrder, IOrderItem, IShippingAddress } from '@/types';

/* ===================== TYPES ===================== */

interface OrderResponse {
  success: boolean;
  data?: IOrder | IOrder[];
  error?: string;
  message?: string;
}

type OrderStatus =
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

interface OrderStatusStat {
  _id: OrderStatus;
  count: number;
}

interface RevenueStat {
  _id: null;
  total: number;
}

interface TopProductStat {
  _id: string;
  title: string;
  totalSold: number;
}

/* ===================== CREATE ===================== */

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
      isDelivered: false,
    });

    revalidatePath('/account');

    return {
      success: true,
      data: order as IOrder,
      message: 'Order created successfully',
    };
  } catch (error) {
    console.error('Create order error:', error);
    return { success: false, error: 'Failed to create order' };
  }
}

/* ===================== USER ORDERS ===================== */

export async function getUserOrders(userId: string): Promise<OrderResponse> {
  try {
    await connectDB();

    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 })
      .lean<IOrder[]>();

    return { success: true, data: orders };
  } catch (error) {
    console.error('Get user orders error:', error);
    return { success: false, error: 'Failed to fetch orders' };
  }
}

/* ===================== SINGLE ORDER ===================== */

export async function getOrderById(orderId: string): Promise<OrderResponse> {
  try {
    await connectDB();

    const order = await Order.findById(orderId).lean<IOrder | null>();

    if (!order) {
      return { success: false, error: 'Order not found' };
    }

    return { success: true, data: order };
  } catch (error) {
    console.error('Get order error:', error);
    return { success: false, error: 'Failed to fetch order' };
  }
}

/* ===================== ALL ORDERS (ADMIN) ===================== */

export async function getAllOrders(
  page = 1,
  limit = 20
): Promise<OrderResponse> {
  try {
    await connectDB();

    const skip = (page - 1) * limit;

    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean<IOrder[]>();

    return { success: true, data: orders };
  } catch (error) {
    console.error('Get all orders error:', error);
    return { success: false, error: 'Failed to fetch orders' };
  }
}

/* ===================== UPDATE STATUS ===================== */

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus
): Promise<OrderResponse> {
  try {
    await connectDB();

    const updateData: Partial<IOrder> = {
      status,
      ...(status === 'delivered'
        ? { isDelivered: true, deliveredAt: new Date() }
        : {}),
    };

    const order = await Order.findByIdAndUpdate(orderId, updateData, {
      new: true,
    }).lean<IOrder | null>();

    if (!order) {
      return { success: false, error: 'Order not found' };
    }

    revalidatePath('/admin/orders');
    revalidatePath('/account');

    return {
      success: true,
      data: order,
      message: 'Order status updated',
    };
  } catch (error) {
    console.error('Update order status error:', error);
    return { success: false, error: 'Failed to update order status' };
  }
}

/* ===================== ADMIN STATS ===================== */

export async function getAdminStats(): Promise<{
  success: boolean;
  data?: {
    totalRevenue: number;
    totalOrders: number;
    totalProducts: number;
    totalUsers: number;
    recentOrders: IOrder[];
    ordersByStatus: { status: OrderStatus; count: number }[];
    topProducts: {
      productId: string;
      title: string;
      totalSold: number;
    }[];
  };
  error?: string;
}> {
  try {
    await connectDB();

    const [
      totalOrders,
      revenueAgg,
      statusAgg,
      recentOrders,
    ] = await Promise.all([
      Order.countDocuments(),
      Order.aggregate<RevenueStat>([
        { $group: { _id: null, total: { $sum: '$totalPrice' } } },
      ]),
      Order.aggregate<OrderStatusStat>([
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      Order.find().sort({ createdAt: -1 }).limit(5).lean<IOrder[]>(),
    ]);

    const Product = (await import('@/models/Product')).default;
    const User = (await import('@/models/User')).default;

    const [totalProducts, totalUsers, topProductsAgg] = await Promise.all([
      Product.countDocuments(),
      User.countDocuments(),
      Order.aggregate<TopProductStat>([
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
        totalRevenue: revenueAgg[0]?.total ?? 0,
        totalOrders,
        totalProducts,
        totalUsers,
        recentOrders,
        ordersByStatus: statusAgg.map((s) => ({
          status: s._id,
          count: s.count,
        })),
        topProducts: topProductsAgg.map((p) => ({
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
