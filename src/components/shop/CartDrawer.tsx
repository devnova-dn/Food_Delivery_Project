'use client';

import { Fragment, useEffect, useState } from 'react';
import Image from 'next/image';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/context/CartStore';
import { formatCurrency } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getSubtotal, clearCart } =
    useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const subtotal = mounted ? getSubtotal() : 0;
  const shipping = subtotal > 50 ? 0 : 5.99;
  const total = subtotal + shipping;

  if (!mounted) return null;

  const handleCommande = () => {
    toast.success("Rady ncontactiwk 9ariban pour confirmé la commande 📞");
    clearCart();
  };

  return (
    <Fragment>
      {/* Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-50" onClick={closeCart} />}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl
                    transform transition-transform duration-300 ease-in-out
                    ${isOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-secondary-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-6 h-6 text-primary-600" />
            <h2 className="text-xl font-display font-bold text-secondary-900">Your Cart</h2>
            <span className="px-2 py-1 bg-primary-100 text-primary-700 text-sm font-semibold rounded-full">
              {items.length}
            </span>
          </div>
          <button onClick={closeCart} className="p-2 hover:bg-secondary-100 rounded-lg">
            <X className="w-6 h-6 text-secondary-500" />
          </button>
        </div>

        {/* Cart Items - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="text-center text-secondary-500">Your cart is empty.</div>
          ) : (
            items.map((item) => (
              <div key={item.productId} className="flex gap-4 p-4 bg-secondary-50 rounded-xl">
                <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                  <Image src={item.image} alt={item.title} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-secondary-900">{item.title}</p>
                  <p className="text-sm text-secondary-500">{formatCurrency(item.price)} each</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center bg-white border rounded-lg"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      disabled={item.quantity >= item.maxQuantity}
                      className="w-8 h-8 flex items-center justify-center bg-white border rounded-lg disabled:opacity-50"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-secondary-900">
                    {formatCurrency(item.price * item.quantity)}
                  </p>
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="text-red-500 hover:text-red-600 text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-secondary-100 p-6 flex-shrink-0 space-y-4">
            <div className="flex justify-between text-secondary-600">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-secondary-600">
              <span>Shipping</span>
              <span>{shipping === 0 ? 'Free' : formatCurrency(shipping)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-secondary-900 border-t pt-2">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>

            <button
              onClick={handleCommande}
              className="w-full py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors"
            >
              Commander
            </button>
          </div>
        )}
      </div>
    </Fragment>
  );
}
