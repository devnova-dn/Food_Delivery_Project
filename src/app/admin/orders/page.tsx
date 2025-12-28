'use client';

import { useState } from 'react';
import { Search, Filter, Eye, Truck, CheckCircle, XCircle, ChevronDown } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

// Demo orders data
const demoOrders = [
  {
    _id: 'ORD-001',
    userId: 'user1',
    userEmail: 'john@example.com',
    totalPrice: 89.99,
    status: 'pending',
    paymentMethod: 'cod',
    createdAt: new Date(),
    orderItems: [
      { title: 'Organic Avocados', quantity: 4, price: 4.99 },
      { title: 'Fresh Salmon', quantity: 2, price: 18.99 },
    ],
  },
  {
    _id: 'ORD-002',
    userId: 'user2',
    userEmail: 'jane@example.com',
    totalPrice: 156.5,
    status: 'processing',
    paymentMethod: 'cod',
    createdAt: new Date(Date.now() - 3600000),
    orderItems: [
      { title: 'Premium Olive Oil', quantity: 2, price: 24.99 },
      { title: 'Artisan Sourdough', quantity: 3, price: 6.99 },
    ],
  },
  {
    _id: 'ORD-003',
    userId: 'user3',
    userEmail: 'bob@example.com',
    totalPrice: 45.99,
    status: 'shipped',
    paymentMethod: 'cod',
    createdAt: new Date(Date.now() - 7200000),
    orderItems: [
      { title: 'Greek Yogurt', quantity: 5, price: 5.49 },
    ],
  },
  {
    _id: 'ORD-004',
    userId: 'user4',
    userEmail: 'alice@example.com',
    totalPrice: 234.0,
    status: 'delivered',
    paymentMethod: 'cod',
    createdAt: new Date(Date.now() - 86400000),
    orderItems: [
      { title: 'Free Range Eggs', quantity: 10, price: 7.99 },
      { title: 'Organic Strawberries', quantity: 4, price: 8.99 },
    ],
  },
  {
    _id: 'ORD-005',
    userId: 'user5',
    userEmail: 'charlie@example.com',
    totalPrice: 67.45,
    status: 'pending',
    paymentMethod: 'cod',
    createdAt: new Date(Date.now() - 172800000),
    orderItems: [
      { title: 'Fresh Lemons', quantity: 6, price: 3.99 },
      { title: 'Organic Tomatoes', quantity: 3, price: 4.99 },
    ],
  },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState(demoOrders);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const statuses = ['All', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'];

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = 
      order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.userEmail.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || statusFilter === 'All' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (orderId: string, newStatus: string) => {
    setOrders(orders.map(order => 
      order._id === orderId ? { ...order, status: newStatus } : order
    ));
  };

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Eye className="w-4 h-4" />;
      case 'processing':
        return <Filter className="w-4 h-4" />;
      case 'shipped':
        return <Truck className="w-4 h-4" />;
      case 'delivered':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-secondary-900">
          Orders
        </h1>
        <p className="text-secondary-500 mt-1">
          Manage and track customer orders
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Orders', value: orders.length, color: 'bg-blue-500' },
          { label: 'Pending', value: orders.filter(o => o.status === 'pending').length, color: 'bg-yellow-500' },
          { label: 'Processing', value: orders.filter(o => o.status === 'processing').length, color: 'bg-blue-500' },
          { label: 'Delivered', value: orders.filter(o => o.status === 'delivered').length, color: 'bg-green-500' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-4 shadow-md">
            <div className="flex items-center gap-3">
              <div className={`${stat.color} p-2 rounded-lg`}>
                <span className="text-white font-bold">{stat.value}</span>
              </div>
              <span className="text-secondary-600 text-sm">{stat.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-md p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
            <input
              type="text"
              placeholder="Search by order ID or customer email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-secondary-200 rounded-xl 
                       focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 border border-secondary-200 rounded-xl focus:outline-none 
                     focus:ring-2 focus:ring-primary-500 bg-white"
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status === 'All' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-secondary-50 text-left text-sm text-secondary-500">
                <th className="px-6 py-4 font-medium">Order ID</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Items</th>
                <th className="px-6 py-4 font-medium">Total</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary-100">
              {filteredOrders.map((order) => (
                <tr key={order._id} className="hover:bg-secondary-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-secondary-900">
                    #{order._id.slice(-6).toUpperCase()}
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-secondary-900">{order.userEmail}</p>
                  </td>
                  <td className="px-6 py-4 text-secondary-600">
                    {order.orderItems.length} item{order.orderItems.length > 1 ? 's' : ''}
                  </td>
                  <td className="px-6 py-4 font-medium text-secondary-900">
                    {formatCurrency(order.totalPrice)}
                  </td>
                  <td className="px-6 py-4 text-secondary-600">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="relative group">
                      <button
                        className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium
                                   ${getStatusColor(order.status)}`}
                      >
                        {getStatusIcon(order.status)}
                        <span className="capitalize">{order.status}</span>
                        <ChevronDown className="w-4 h-4" />
                      </button>

                      {/* Status Dropdown */}
                      <div className="absolute left-0 top-full mt-1 w-40 bg-white rounded-xl 
                                    shadow-lg border border-secondary-100 py-1 z-10 
                                    opacity-0 invisible group-hover:opacity-100 
                                    group-hover:visible transition-all">
                        {statuses.filter(s => s !== 'All').map((status) => (
                          <button
                            key={status}
                            onClick={() => handleStatusChange(order._id, status)}
                            className={`w-full px-3 py-2 text-left text-sm hover:bg-secondary-50
                                       capitalize flex items-center gap-2
                                       ${order.status === status ? 'text-primary-600 font-medium' : 'text-secondary-600'}`}
                          >
                            {getStatusIcon(status)}
                            {status}
                          </button>
                        ))}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <p className="text-secondary-500">No orders found</p>
          </div>
        )}

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-secondary-100 flex items-center 
                      justify-between">
          <p className="text-sm text-secondary-500">
            Showing {filteredOrders.length} of {orders.length} orders
          </p>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 border border-secondary-200 rounded-lg 
                             text-secondary-600 hover:bg-secondary-50 transition-colors">
              Previous
            </button>
            <button className="px-4 py-2 border border-secondary-200 rounded-lg 
                             text-secondary-600 hover:bg-secondary-50 transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-secondary-100">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-display font-bold text-secondary-900">
                  Order #{selectedOrder._id.slice(-6).toUpperCase()}
                </h3>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 hover:bg-secondary-100 rounded-lg transition-colors"
                >
                  <XCircle className="w-5 h-5 text-secondary-400" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Order Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-secondary-500">Customer</p>
                  <p className="font-medium text-secondary-900">{selectedOrder.userEmail}</p>
                </div>
                <div>
                  <p className="text-sm text-secondary-500">Date</p>
                  <p className="font-medium text-secondary-900">{formatDate(selectedOrder.createdAt)}</p>
                </div>
                <div>
                  <p className="text-sm text-secondary-500">Payment</p>
                  <p className="font-medium text-secondary-900 capitalize">{selectedOrder.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-sm text-secondary-500">Status</p>
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium
                                   ${getStatusColor(selectedOrder.status)} capitalize`}>
                    {getStatusIcon(selectedOrder.status)}
                    {selectedOrder.status}
                  </span>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h4 className="font-medium text-secondary-900 mb-3">Order Items</h4>
                <div className="space-y-3">
                  {selectedOrder.orderItems.map((item: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 
                                               bg-secondary-50 rounded-xl">
                      <div>
                        <p className="font-medium text-secondary-900">{item.title}</p>
                        <p className="text-sm text-secondary-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-medium text-secondary-900">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="border-t border-secondary-100 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-medium text-secondary-900">Total</span>
                  <span className="text-xl font-bold text-secondary-900">
                    {formatCurrency(selectedOrder.totalPrice)}
                  </span>
                </div>
              </div>

              {/* Status Actions */}
              <div>
                <h4 className="font-medium text-secondary-900 mb-3">Update Status</h4>
                <div className="flex flex-wrap gap-2">
                  {statuses.filter(s => s !== 'All').map((status) => (
                    <button
                      key={status}
                      onClick={() => {
                        handleStatusChange(selectedOrder._id, status);
                        setSelectedOrder({ ...selectedOrder, status });
                      }}
                      className={`px-4 py-2 rounded-lg text-sm font-medium capitalize
                                 transition-colors flex items-center gap-2
                                 ${selectedOrder.status === status 
                                   ? 'bg-primary-100 text-primary-700' 
                                   : 'bg-secondary-100 text-secondary-600 hover:bg-secondary-200'}`}
                    >
                      {getStatusIcon(status)}
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-secondary-100">
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-full btn-secondary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function XCircle({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
