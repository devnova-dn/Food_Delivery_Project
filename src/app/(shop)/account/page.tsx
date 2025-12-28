'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  User,
  Package,
  Heart,
  Settings,
  LogOut,
  MapPin,
  CreditCard,
  Bell,
  ChevronRight,
  ShoppingBag,
  Clock,
  CheckCircle,
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';

// Demo orders data
const demoOrders = [
  {
    _id: 'ORD-001',
    totalPrice: 89.99,
    status: 'delivered',
    createdAt: new Date(Date.now() - 86400000 * 2),
    orderItems: [
      { title: 'Organic Avocados', quantity: 4, image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=200&q=80' },
      { title: 'Fresh Salmon', quantity: 2, image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=200&q=80' },
    ],
  },
  {
    _id: 'ORD-002',
    totalPrice: 156.5,
    status: 'processing',
    createdAt: new Date(Date.now() - 86400000),
    orderItems: [
      { title: 'Premium Olive Oil', quantity: 2, image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=200&q=80' },
      { title: 'Artisan Sourdough', quantity: 3, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&q=80' },
    ],
  },
];

export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('orders');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (status === 'loading') return;
    if (!session) {
      router.push('/login?callbackUrl=/account');
    }
  }, [session, status, router]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'processing': return 'bg-blue-100 text-blue-700';
      case 'shipped': return 'bg-purple-100 text-purple-700';
      case 'delivered': return 'bg-green-100 text-green-700';
      default: return 'bg-secondary-100 text-secondary-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      case 'processing': return <Clock className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  if (!mounted || status === 'loading') {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent 
                        rounded-full animate-spin mx-auto mb-4" />
          <p className="text-secondary-600">Loading account...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center 
                          justify-center text-primary-600 text-3xl font-bold">
              {(session.user?.name || 'U').charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-display font-bold text-secondary-900">
                {session.user?.name}
              </h1>
              <p className="text-secondary-500">{session.user?.email}</p>
              <div className="flex items-center gap-4 mt-2">
                <span className="text-sm text-secondary-500">
                  Member since {new Date().getFullYear()}
                </span>
                <span className="px-3 py-1 bg-primary-100 text-primary-700 text-xs 
                               font-medium rounded-full">
                  Premium Member
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-md p-4 sticky top-24">
              <nav className="space-y-1">
                {[
                  { id: 'orders', label: 'My Orders', icon: ShoppingBag },
                  { id: 'profile', label: 'Profile', icon: User },
                  { id: 'addresses', label: 'Addresses', icon: MapPin },
                  { id: 'wishlist', label: 'Wishlist', icon: Heart },
                  { id: 'settings', label: 'Settings', icon: Settings },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors
                               ${activeTab === item.id 
                                 ? 'bg-primary-100 text-primary-700' 
                                 : 'text-secondary-600 hover:bg-secondary-50'}`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </button>
                ))}
                <button
                  onClick={() => {
                    signOut({ callbackUrl: '/' });
                    toast.success('Signed out successfully');
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 
                           hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-display font-bold text-secondary-900">
                    My Orders
                  </h2>
                </div>

                {demoOrders.length > 0 ? (
                  <div className="space-y-4">
                    {demoOrders.map((order) => (
                      <div
                        key={order._id}
                        className="bg-white rounded-2xl shadow-md p-6"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                          <div>
                            <div className="flex items-center gap-3">
                              <span className="font-bold text-secondary-900">
                                #{order._id.slice(-6).toUpperCase()}
                              </span>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium 
                                             flex items-center gap-1 ${getStatusColor(order.status)}`}>
                                {getStatusIcon(order.status)}
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </span>
                            </div>
                            <p className="text-sm text-secondary-500 mt-1">
                              {formatDate(order.createdAt)}
                            </p>
                          </div>
                          <div className="text-left sm:text-right">
                            <p className="text-lg font-bold text-secondary-900">
                              {formatCurrency(order.totalPrice)}
                            </p>
                            <p className="text-sm text-secondary-500">
                              {order.orderItems.length} items
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 pt-4 border-t border-secondary-100">
                          {order.orderItems.map((item, index) => (
                            <div key={index} className="flex items-center gap-3">
                              <div className="relative w-16 h-16 rounded-lg overflow-hidden 
                                            bg-secondary-100">
                                <Image
                                  src={item.image}
                                  alt={item.title}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div>
                                <p className="font-medium text-secondary-900">{item.title}</p>
                                <p className="text-sm text-secondary-500">Qty: {item.quantity}</p>
                              </div>
                            </div>
                          ))}
                          <Link
                            href={`/account/orders/${order._id}`}
                            className="ml-auto text-primary-600 hover:text-primary-700 
                                     font-medium text-sm flex items-center gap-1"
                          >
                            View Details
                            <ChevronRight className="w-4 h-4" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl shadow-md p-12 text-center">
                    <div className="w-20 h-20 bg-secondary-100 rounded-full flex items-center 
                                  justify-center mx-auto mb-4">
                      <ShoppingBag className="w-10 h-10 text-secondary-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                      No orders yet
                    </h3>
                    <p className="text-secondary-500 mb-6">
                      When you place orders, they will appear here.
                    </p>
                    <Link href="/products" className="btn-primary inline-flex items-center gap-2">
                      Start Shopping
                    </Link>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="bg-white rounded-2xl shadow-md p-6">
                <h2 className="text-2xl font-display font-bold text-secondary-900 mb-6">
                  Profile Information
                </h2>
                <form className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      defaultValue={session.user?.name || ''}
                      className="w-full px-4 py-3 border border-secondary-200 rounded-xl 
                               focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      defaultValue={session.user?.email || ''}
                      className="w-full px-4 py-3 border border-secondary-200 rounded-xl 
                               focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      placeholder="Enter phone number"
                      className="w-full px-4 py-3 border border-secondary-200 rounded-xl 
                               focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <button type="submit" className="btn-primary">
                    Save Changes
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'addresses' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-display font-bold text-secondary-900">
                    My Addresses
                  </h2>
                  <button className="btn-primary inline-flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Add New Address
                  </button>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-white rounded-2xl shadow-md p-6 relative">
                    <div className="absolute top-4 right-4">
                      <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs 
                                     font-medium rounded-full">
                        Default
                      </span>
                    </div>
                    <h3 className="font-semibold text-secondary-900 mb-2">Home</h3>
                    <p className="text-secondary-600 text-sm">
                      123 Main Street<br />
                      Apt 4B<br />
                      New York, NY 10001<br />
                      United States
                    </p>
                    <div className="flex gap-2 mt-4">
                      <button className="text-primary-600 text-sm font-medium">Edit</button>
                      <button className="text-red-600 text-sm font-medium">Delete</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'wishlist' && (
              <div className="bg-white rounded-2xl shadow-md p-12 text-center">
                <div className="w-20 h-20 bg-secondary-100 rounded-full flex items-center 
                              justify-center mx-auto mb-4">
                  <Heart className="w-10 h-10 text-secondary-400" />
                </div>
                <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                  Your wishlist is empty
                </h3>
                <p className="text-secondary-500 mb-6">
                  Save your favorite items to buy later.
                </p>
                <Link href="/products" className="btn-primary inline-flex items-center gap-2">
                  Browse Products
                </Link>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="bg-white rounded-2xl shadow-md p-6">
                <h2 className="text-2xl font-display font-bold text-secondary-900 mb-6">
                  Account Settings
                </h2>

                <div className="space-y-6">
                  <div className="flex items-center justify-between py-4 border-b border-secondary-100">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-secondary-100 rounded-lg flex items-center 
                                    justify-center">
                        <Bell className="w-5 h-5 text-secondary-600" />
                      </div>
                      <div>
                        <p className="font-medium text-secondary-900">Notifications</p>
                        <p className="text-sm text-secondary-500">
                          Receive updates about your orders
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-secondary-200 rounded-full peer peer-checked:bg-primary-600 
                                    after:content-[''] after:absolute after:top-0.5 after:left-[2px] 
                                    after:bg-white after:rounded-full after:h-5 after:w-5 
                                    after:transition-all peer-checked:after:translate-x-full"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between py-4 border-b border-secondary-100">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-secondary-100 rounded-lg flex items-center 
                                    justify-center">
                        <CreditCard className="w-5 h-5 text-secondary-600" />
                      </div>
                      <div>
                        <p className="font-medium text-secondary-900">Save Payment Methods</p>
                        <p className="text-sm text-secondary-500">
                          Save cards for faster checkout
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-secondary-200 rounded-full peer peer-checked:bg-primary-600 
                                    after:content-[''] after:absolute after:top-0.5 after:left-[2px] 
                                    after:bg-white after:rounded-full after:h-5 after:w-5 
                                    after:transition-all peer-checked:after:translate-x-full"></div>
                    </label>
                  </div>

                  <div className="pt-4">
                    <h3 className="font-medium text-secondary-900 mb-4">Change Password</h3>
                    <form className="space-y-4 max-w-md">
                      <input
                        type="password"
                        placeholder="Current password"
                        className="w-full px-4 py-3 border border-secondary-200 rounded-xl 
                                 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                      <input
                        type="password"
                        placeholder="New password"
                        className="w-full px-4 py-3 border border-secondary-200 rounded-xl 
                                 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                      <input
                        type="password"
                        placeholder="Confirm new password"
                        className="w-full px-4 py-3 border border-secondary-200 rounded-xl 
                                 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                      <button type="submit" className="btn-primary">
                        Update Password
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function signOut({ callbackUrl }: { callbackUrl: string }) {
  window.location.href = `/api/auth/signout?callbackUrl=${callbackUrl}`;
}
