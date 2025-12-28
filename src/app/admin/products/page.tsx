'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Search, Filter, Edit2, Trash2, MoreVertical } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

// Demo products data
const demoProducts = [
  {
    _id: '1',
    title: 'Organic Hass Avocados (Pack of 4)',
    slug: 'organic-hass-avocados-pack-4',
    price: 5.99,
    discountPrice: 4.99,
    images: ['https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=200&q=80'],
    category: 'fresh-produce',
    brand: 'Organic Valley',
    stock: 50,
    isFeatured: true,
    isOrganic: true,
  },
  {
    _id: '2',
    title: 'Extra Virgin Olive Oil (1L)',
    slug: 'extra-virgin-olive-oil-1l',
    price: 24.99,
    images: ['https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=200&q=80'],
    category: 'pantry',
    brand: 'GourmetHub',
    stock: 100,
    isFeatured: true,
    isOrganic: false,
  },
  {
    _id: '3',
    title: 'Fresh Atlantic Salmon Fillet (500g)',
    slug: 'fresh-atlantic-salmon-fillet-500g',
    price: 18.99,
    discountPrice: 15.99,
    images: ['https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=200&q=80'],
    category: 'meat-seafood',
    brand: 'Ocean Fresh',
    stock: 30,
    isFeatured: true,
    isOrganic: false,
  },
  {
    _id: '4',
    title: 'Artisan Sourdough Bread',
    slug: 'artisan-sourdough-bread',
    price: 6.99,
    images: ['https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&q=80'],
    category: 'bakery',
    brand: "Baker's Choice",
    stock: 25,
    isFeatured: true,
    isOrganic: false,
  },
  {
    _id: '5',
    title: 'Organic Strawberries (300g)',
    slug: 'organic-strawberries-300g',
    price: 8.99,
    images: ['https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=200&q=80'],
    category: 'fresh-produce',
    brand: 'Farm Fresh',
    stock: 40,
    isFeatured: true,
    isOrganic: true,
  },
  {
    _id: '6',
    title: 'Greek Yogurt Premium (500g)',
    slug: 'greek-yogurt-premium-500g',
    price: 5.49,
    images: ['https://images.unsplash.com/photo-1488477181946-6428a0291777?w=200&q=80'],
    category: 'dairy-eggs',
    brand: 'Dairy Delight',
    stock: 60,
    isFeatured: false,
    isOrganic: false,
  },
];

export default function AdminProductsPage() {
  const [products, setProducts] = useState(demoProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);

  const categories = [
    'All Categories',
    'fresh-produce',
    'dairy-eggs',
    'meat-seafood',
    'bakery',
    'pantry',
    'beverages',
  ];

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || selectedCategory === 'All Categories' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDelete = (productId: string) => {
    setProducts(products.filter((p) => p._id !== productId));
    setShowDeleteModal(null);
  };

  const getCategoryLabel = (category: string) => {
    return category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-secondary-900">
            Products
          </h1>
          <p className="text-secondary-500 mt-1">
            Manage your product catalog
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="btn-primary inline-flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-md p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-secondary-200 rounded-xl 
                       focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 border border-secondary-200 rounded-xl focus:outline-none 
                     focus:ring-2 focus:ring-primary-500 bg-white"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-secondary-50 text-left text-sm text-secondary-500">
                <th className="px-6 py-4 font-medium">Product</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Price</th>
                <th className="px-6 py-4 font-medium">Stock</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary-100">
              {filteredProducts.map((product) => (
                <tr key={product._id} className="hover:bg-secondary-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-secondary-100">
                        <Image
                          src={product.images[0]}
                          alt={product.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-secondary-900">{product.title}</p>
                        <p className="text-sm text-secondary-500">{product.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-secondary-600">
                    {getCategoryLabel(product.category)}
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-secondary-900">
                        {formatCurrency(product.discountPrice || product.price)}
                      </p>
                      {product.discountPrice && (
                        <p className="text-sm text-secondary-400 line-through">
                          {formatCurrency(product.price)}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`font-medium ${
                      product.stock > 20 ? 'text-green-600' : 
                      product.stock > 0 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {product.stock} in stock
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {product.isFeatured && (
                        <span className="px-2 py-1 bg-primary-100 text-primary-700 
                                       text-xs font-medium rounded-full">
                          Featured
                        </span>
                      )}
                      {product.isOrganic && (
                        <span className="px-2 py-1 bg-green-100 text-green-700 
                                       text-xs font-medium rounded-full">
                          Organic
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/products/${product._id}`}
                        className="p-2 text-secondary-400 hover:text-primary-600 
                                 hover:bg-primary-50 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-5 h-5" />
                      </Link>
                      <button
                        onClick={() => setShowDeleteModal(product._id)}
                        className="p-2 text-secondary-400 hover:text-red-600 
                                 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-secondary-500">No products found</p>
          </div>
        )}

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-secondary-100 flex items-center 
                      justify-between">
          <p className="text-sm text-secondary-500">
            Showing {filteredProducts.length} of {products.length} products
          </p>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 border border-secondary-200 rounded-lg 
                             text-secondary-600 hover:bg-secondary-50 transition-colors"
            >
              Previous
            </button>
            <button className="px-4 py-2 border border-secondary-200 rounded-lg 
                             text-secondary-600 hover:bg-secondary-50 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-display font-bold text-secondary-900 mb-2">
              Delete Product
            </h3>
            <p className="text-secondary-600 mb-6">
              Are you sure you want to delete this product? This action cannot be undone.
            </p>
            <div className="flex gap-4 justify-end">
              <button
                onClick={() => setShowDeleteModal(null)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(showDeleteModal)}
                className="px-6 py-3 bg-red-600 text-white font-medium rounded-xl 
                         hover:bg-red-700 transition-colors"
              >
                Delete Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
