'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

/* =======================
   DEMO PRODUCTS (FIXED)
======================= */
const demoProducts = [
  {
    _id: '1',
    title: 'Organic Hass Avocados (Pack of 4)',
    slug: 'organic-hass-avocados-pack-4',
    price: 5.99,
    discountPrice: 4.99,
    images: ['https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400&q=80'],
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
    images: ['https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&q=80'],
    category: 'pantry',
    brand: 'GourmetHub',
    stock: 100,
    isFeatured: true,
    isOrganic: false,
  },
  {
    _id: '3',
    title: 'Grass-Fed Beef Steak',
    slug: 'grass-fed-beef-steak',
    price: 22.99,
    images: ['https://i.postimg.cc/cCpwRFnC/delicious-food-table.jpg'],
    category: 'meat-seafood',
    brand: 'Prime Cuts',
    stock: 35,
    isFeatured: true,
    isOrganic: false,
  },
  {
    _id: '4',
    title: 'Free-Range Chicken Breast',
    slug: 'free-range-chicken-breast',
    price: 11.49,
    images: ['https://i.postimg.cc/9fbd6P65/close-up-delicious-chicken-meal.jpg'],
    category: 'meat-seafood',
    brand: 'Farm Select',
    stock: 60,
    isFeatured: false,
    isOrganic: false,
  },
  {
    _id: '5',
    title: 'Organic Brown Eggs',
    slug: 'organic-brown-eggs',
    price: 4.29,
    images: ['https://i.postimg.cc/CK7G3C3B/24233479-4743-49aa-bb2a-fce6a8195352.jpg'],
    category: 'dairy-eggs',
    brand: 'Happy Hen',
    stock: 80,
    isFeatured: true,
    isOrganic: true,
  },
  {
    _id: '6',
    title: 'Artisan Cheese Platter',
    slug: 'artisan-cheese-platter',
    price: 14.99,
    images: ['https://i.postimg.cc/NM06B9tN/cheese-grapes-wooden-board.jpg'],
    category: 'dairy-eggs',
    brand: 'Fromagerie Luxe',
    stock: 20,
    isFeatured: true,
    isOrganic: false,
  },
];

/* =======================
   PAGE
======================= */
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
  ];

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesCategory =
      !selectedCategory ||
      selectedCategory === 'All Categories' ||
      product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleDelete = (id: string) => {
    setProducts(products.filter((p) => p._id !== id));
    setShowDeleteModal(null);
  };

  const formatCategory = (cat: string) =>
    cat.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase());

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-gray-500">Manage your catalog</p>
        </div>
        <Link href="/admin/products/new" className="btn-primary flex gap-2">
          <Plus size={18} /> Add Product
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow flex gap-4">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border rounded-lg px-4 py-2 w-full"
        />

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border rounded-lg px-4 py-2"
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 text-left text-sm">
            <tr>
              <th className="p-4">Product</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
              <th className="p-4">Stock</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((p) => (
              <tr key={p._id} className="border-t">
                <td className="p-4 flex gap-3 items-center">
                  <div className="relative w-14 h-14">
                    <Image src={p.images[0]} alt={p.title} fill className="object-cover rounded-lg" />
                  </div>
                  <div>
                    <p className="font-medium">{p.title}</p>
                    <p className="text-sm text-gray-500">{p.brand}</p>
                  </div>
                </td>
                <td className="p-4">{formatCategory(p.category)}</td>
                <td className="p-4">{formatCurrency(p.price)}</td>
                <td className="p-4">{p.stock}</td>
                <td className="p-4 text-right flex justify-end gap-2">
                  <Link href={`/admin/products/${p._id}`} className="p-2 hover:bg-gray-100 rounded">
                    <Edit2 size={18} />
                  </Link>
                  <button
                    onClick={() => setShowDeleteModal(p._id)}
                    className="p-2 hover:bg-red-100 rounded text-red-600"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-full max-w-md">
            <h3 className="text-xl font-bold mb-2">Delete Product</h3>
            <p className="text-gray-500 mb-4">
              Are you sure? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowDeleteModal(null)} className="btn-secondary">
                Cancel
              </button>
              <button
                onClick={() => handleDelete(showDeleteModal)}
                className="bg-red-600 text-white px-4 py-2 rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
