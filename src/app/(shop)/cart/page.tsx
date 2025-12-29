'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/context/CartStore';
import { formatCurrency } from '@/lib/utils';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getSubtotal } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent 
                        rounded-full animate-spin mx-auto mb-4" />
          <p className="text-secondary-600">Loading cart...</p>
        </div>
      </div>
    );
  }

  const subtotal = getSubtotal();
  const shipping = subtotal > 50 ? 0 : 5.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-32 h-32 bg-secondary-100 rounded-full flex items-center 
                        justify-center mx-auto mb-6">
            <ShoppingBag className="w-16 h-16 text-secondary-400" />
          </div>
          <h1 className="text-2xl font-display font-bold text-secondary-900 mb-2">
            Your Cart is Empty
          </h1>
          <p className="text-secondary-500 mb-8">
            Looks like you haven&apos;t added any delicious items to your cart yet.
          </p>
          <Link
            href="/products"
            className="btn-primary inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-display font-bold text-secondary-900">
            Shopping Cart
          </h1>
          <p className="text-secondary-500 mt-2">
            {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-4 shadow-md flex gap-4 animate-fade-in"
              >
                {/* Image */}
                <Link
                  href={`/products/${item.slug}`}
                  className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden 
                           flex-shrink-0 bg-secondary-100"
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover hover:scale-105 transition-transform"
                  />
                </Link>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between">
                    <div>
                      <Link
                        href={`/products/${item.slug}`}
                        className="font-semibold text-secondary-900 hover:text-primary-600 
                                 transition-colors line-clamp-2"
                      >
                        {item.title}
                      </Link>
                      <p className="text-sm text-secondary-500 mt-1">
                        Price: {formatCurrency(item.price)} / {item.slug.split('-').pop()}
                      </p>
                    </div>
                    <button
                    type='button'
                    title='price'
                      onClick={() => removeItem(item.productId)}
                      className="p-2 text-secondary-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Quantity and Total */}
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2">
                      <button
                       type='button'
                    title='quantity'
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity - 1)
                        }
                        className="w-8 h-8 flex items-center justify-center bg-secondary-100 
                                 rounded-lg hover:bg-secondary-200 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-10 text-center font-semibold">{item.quantity}</span>
                      <button
                       type='button'
                    title='quantity'
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity + 1)
                        }
                        disabled={item.quantity >= item.maxQuantity}
                        className="w-8 h-8 flex items-center justify-center bg-secondary-100 
                                 rounded-lg hover:bg-secondary-200 transition-colors
                                 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-secondary-900">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                      {item.quantity >= item.maxQuantity && (
                        <p className="text-xs text-accent-500">Max quantity reached</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Continue Shopping */}
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 
                       font-medium transition-colors mt-4"
            >
              <ArrowLeft className="w-5 h-5" />
              Continue Shopping
            </Link>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-display font-bold text-secondary-900 mb-6">
                Order Summary
              </h2>

              <div className="space-y-4">
                <div className="flex justify-between text-secondary-600">
                  <span>Subtotal ({items.length} items)</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-secondary-600">
                  <span>Shipping</span>
                  <span>
                    {shipping === 0 ? (
                      <span className="text-green-600 font-medium">Free</span>
                    ) : (
                      formatCurrency(shipping)
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-secondary-600">
                  <span>Estimated Tax</span>
                  <span>{formatCurrency(tax)}</span>
                </div>

                {subtotal < 50 && (
                  <div className="p-3 bg-primary-50 rounded-xl">
                    <p className="text-sm text-primary-700">
                      Add <span className="font-semibold">{formatCurrency(50 - subtotal)}</span> more
                      for free shipping!
                    </p>
                    <div className="mt-2 h-2 bg-primary-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary-500 rounded-full transition-all"
                        style={{ width: `${Math.min((subtotal / 50) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="border-t border-secondary-200 pt-4">
                  <div className="flex justify-between text-lg font-bold text-secondary-900">
                    <span>Total</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <Link
                href="/checkout"
                className="w-full btn-primary flex items-center justify-center gap-2 mt-6 py-4"
              >
                Proceed to Checkout
                <ArrowRight className="w-5 h-5" />
              </Link>

              {/* Secure Payment Info */}
              <div className="mt-4 flex items-center justify-center gap-2 text-sm text-secondary-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                Secure checkout - Cash on Delivery
              </div>

              {/* Promo Code */}
              <div className="mt-6 pt-6 border-t border-secondary-100">
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Promo Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter code"
                    className="flex-1 px-4 py-2 border border-secondary-200 rounded-xl 
                             focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <button className="px-4 py-2 bg-secondary-100 text-secondary-700 font-medium 
                                   rounded-xl hover:bg-secondary-200 transition-colors">
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
