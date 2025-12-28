'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  recentOrders: any[];
  ordersByStatus: { status: string; count: number }[];
  topProducts: { productId: string; title: string; totalSold: number }[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading stats
    setTimeout(() => {
      setStats({
        totalRevenue: 45678.9,
        totalOrders: 1234,
        totalProducts: 156,
        totalUsers: 3421,
        recentOrders: [
          {
            _id: '1',
            userId: 'user1',
            userEmail: 'john@example.com',
            totalPrice: 89.99,
            status: 'pending',
            createdAt: new Date(),
            orderItems: [{ title: 'Organic Avocados', quantity: 4 }],
          },
          {
            _id: '2',
            userId: 'user2',
            userEmail: 'jane@example.com',
            totalPrice: 156.5,
            status: 'processing',
            createdAt: new Date(Date.now() - 3600000),
            orderItems: [{ title: 'Premium Olive Oil', quantity: 2 }],
          },
          {
            _id: '3',
            userId: 'user3',
            userEmail: 'bob@example.com',
            totalPrice: 45.99,
            status: 'shipped',
            createdAt: new Date(Date.now() - 7200000),
            orderItems: [{ title: 'Fresh Salmon', quantity: 3 }],
          },
          {
            _id: '4',
            userId: 'user4',
            userEmail: 'alice@example.com',
            totalPrice: 234.0,
            status: 'delivered',
            createdAt: new Date(Date.now() - 86400000),
            orderItems: [{ title: 'Artisan Sourdough', quantity: 5 }],
          },
          {
            _id: '5',
            userId: 'user5',
            userEmail: 'charlie@example.com',
            totalPrice: 67.45,
            status: 'pending',
            createdAt: new Date(Date.now() - 172800000),
            orderItems: [{ title: 'Greek Yogurt', quantity: 10 }],
          },
        ],
        ordersByStatus: [
          { status: 'pending', count: 45 },
          { status: 'processing', count: 32 },
          { status: 'shipped', count: 28 },
          { status: 'delivered', count: 1129 },
        ],
        topProducts: [
          { productId: '1', title: 'Organic Avocados', totalSold: 456 },
          { productId: '2', title: 'Premium Olive Oil', totalSold: 312 },
          { productId: '3', title: 'Fresh Atlantic Salmon', totalSold: 289 },
          { productId: '4', title: 'Artisan Sourdough Bread', totalSold: 234 },
        ],
      });
      setLoading(false);
    }, 500);
  }, []);

  const statCards = [
    {
      title: 'Total Revenue',
      value: formatCurrency(stats?.totalRevenue || 0),
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'bg-green-500',
    },
    {
      title: 'Total Orders',
      value: stats?.totalOrders?.toLocaleString() || '0',
      change: '+8.2%',
      trend: 'up',
      icon: ShoppingCart,
      color: 'bg-blue-500',
    },
    {
      title: 'Total Products',
      value: stats?.totalProducts?.toString() || '0',
      change: '+3',
      trend: 'up',
      icon: Package,
      color: 'bg-purple-500',
    },
    {
      title: 'Total Users',
      value: stats?.totalUsers?.toLocaleString() || '0',
      change: '+15.3%',
      trend: 'up',
      icon: Users,
      color: 'bg-orange-500',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'processing':
        return 'bg-blue-100 text-blue-700';
      case 'shipped':
        return 'bg-purple-100 text-purple-700';
      case 'delivered':
        return 'bg-green-100 text-green-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-secondary-100 text-secondary-700';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-md animate-pulse">
              <div className="h-10 w-10 bg-secondary-200 rounded-xl mb-4" />
              <div className="h-4 bg-secondary-200 rounded w-1/2 mb-2" />
              <div className="h-8 bg-secondary-200 rounded w-3/4" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-secondary-900">
            Dashboard
          </h1>
          <p className="text-secondary-500 mt-1">
            Welcome back! Here&apos;s what&apos;s happening with your store.
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="btn-primary inline-flex items-center gap-2"
        >
          <Package className="w-5 h-5" />
          Add Product
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div
            key={stat.title}
            className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} p-3 rounded-xl`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div
                className={`flex items-center gap-1 text-sm font-medium ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {stat.trend === 'up' ? (
                  <ArrowUpRight className="w-4 h-4" />
                ) : (
                  <ArrowDownRight className="w-4 h-4" />
                )}
                {stat.change}
              </div>
            </div>
            <p className="text-secondary-500 text-sm">{stat.title}</p>
            <p className="text-2xl font-bold text-secondary-900 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Charts and Tables Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-display font-bold text-secondary-900">
              Recent Orders
            </h2>
            <Link
              href="/admin/orders"
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              View All
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-secondary-500 border-b border-secondary-100">
                  <th className="pb-3 font-medium">Order ID</th>
                  <th className="pb-3 font-medium">Customer</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary-100">
                {stats?.recentOrders.map((order) => (
                  <tr key={order._id} className="text-sm">
                    <td className="py-4 font-medium text-secondary-900">
                      #{order._id.slice(-6).toUpperCase()}
                    </td>
                    <td className="py-4">
                      <div>
                        <p className="font-medium text-secondary-900">{order.userEmail}</p>
                        <p className="text-secondary-500 text-xs">
                          {order.orderItems.length} item{order.orderItems.length > 1 ? 's' : ''}
                        </p>
                      </div>
                    </td>
                    <td className="py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium capitalize
                                   ${getStatusColor(order.status)}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 text-right font-medium text-secondary-900">
                      {formatCurrency(order.totalPrice)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-display font-bold text-secondary-900">
              Top Selling Products
            </h2>
            <Link
              href="/admin/products"
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              View All
            </Link>
          </div>

          <div className="space-y-4">
            {stats?.topProducts.map((product, index) => (
              <div key={product.productId} className="flex items-center gap-4">
                <div className="w-10 h-10 bg-secondary-100 rounded-xl flex items-center 
                              justify-center text-secondary-600 font-bold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-secondary-900">{product.title}</p>
                  <p className="text-sm text-secondary-500">
                    {product.totalSold} units sold
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-green-600">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm font-medium">+{Math.floor(Math.random() * 20)}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Order Status Overview */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-xl font-display font-bold text-secondary-900 mb-6">
          Order Status Overview
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {stats?.ordersByStatus.map((item) => (
            <div
              key={item.status}
              className="p-4 rounded-xl bg-secondary-50 text-center"
            >
              <p className="text-3xl font-bold text-secondary-900 mb-1">
                {item.count}
              </p>
              <p className="text-sm text-secondary-500 capitalize">{item.status}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
