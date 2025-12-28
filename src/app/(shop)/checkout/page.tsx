'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/context/CartStore';
import { createOrder } from '@/actions/order';
import { formatCurrency } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import {
  Truck,
  CreditCard,
  CheckCircle,
  ChevronRight,
  Loader2,
  Shield,
} from 'lucide-react';
import toast from 'react-hot-toast';

type CheckoutStep = 'shipping' | 'review' | 'confirmation';

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { items, getSubtotal, clearCart } = useCartStore();

  const [step, setStep] = useState<CheckoutStep>('shipping');
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    phone: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Redirect if not logged in
  useEffect(() => {
    if (!session) {
      router.push('/login?callbackUrl=/checkout');
    }
  }, [session, router]);

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0 && step !== 'confirmation') {
      router.push('/cart');
    }
  }, [items, router, step]);

  const subtotal = getSubtotal();
  const shipping = subtotal > 50 ? 0 : 5.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const validateShipping = () => {
    const newErrors: Record<string, string> = {};
    const requiredFields = ['firstName', 'lastName', 'street', 'city', 'state', 'zipCode', 'phone'];

    requiredFields.forEach((field) => {
      if (!shippingInfo[field as keyof typeof shippingInfo]) {
        newErrors[field] = 'This field is required';
      }
    });

    if (shippingInfo.phone.length < 10) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateShipping()) {
      setStep('review');
    }
  };

  const handlePlaceOrder = async () => {
    setLoading(true);

    try {
      const orderItems = items.map((item) => ({
        productId: item.productId,
        title: item.title,
        slug: item.slug,
        image: item.image,
        price: item.price,
        quantity: item.quantity,
      }));

      const result = await createOrder({
        userId: (session?.user as any).id,
        userEmail: session?.user?.email || '',
        orderItems,
        shippingAddress: {
          firstName: shippingInfo.firstName,
          lastName: shippingInfo.lastName,
          street: shippingInfo.street,
          city: shippingInfo.city,
          state: shippingInfo.state,
          zipCode: shippingInfo.zipCode,
          country: shippingInfo.country,
          phone: shippingInfo.phone,
        },
        itemsPrice: subtotal,
        shippingPrice: shipping,
        totalPrice: total,
      });

      if (result.success && result.data) {
        setOrderId((result.data as any)._id || 'ORD-' + Date.now());
        clearCart();
        setStep('confirmation');
        toast.success('Order placed successfully!', { icon: '🎉' });
      } else {
        toast.error(result.error || 'Failed to place order', { icon: '❌' });
      }
    } catch (error) {
      toast.error('An error occurred', { icon: '⚠️' });
    } finally {
      setLoading(false);
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent 
                        rounded-full animate-spin mx-auto mb-4" />
          <p className="text-secondary-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-display font-bold text-xl">G</span>
              </div>
              <span className="font-display font-bold text-xl text-secondary-900">
                GourmetHub
              </span>
            </Link>

            {/* Progress Steps */}
            <div className="hidden sm:flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-medium
                                ${step === 'shipping' || step === 'review' || step === 'confirmation'
                                  ? 'bg-primary-600 text-white'
                                  : 'bg-secondary-200 text-secondary-500'}`}>
                  1
                </div>
                <span className={`text-sm ${step === 'shipping' || step === 'review' || step === 'confirmation'
                  ? 'text-secondary-900 font-medium'
                  : 'text-secondary-500'}`}>
                  Shipping
                </span>
              </div>
              <ChevronRight className="w-5 h-5 text-secondary-300" />
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-medium
                                ${step === 'review' || step === 'confirmation'
                                  ? 'bg-primary-600 text-white'
                                  : 'bg-secondary-200 text-secondary-500'}`}>
                  2
                </div>
                <span className={`text-sm ${step === 'review' || step === 'confirmation'
                  ? 'text-secondary-900 font-medium'
                  : 'text-secondary-500'}`}>
                  Review
                </span>
              </div>
              <ChevronRight className="w-5 h-5 text-secondary-300" />
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-medium
                                ${step === 'confirmation'
                                  ? 'bg-primary-600 text-white'
                                  : 'bg-secondary-200 text-secondary-500'}`}>
                  3
                </div>
                <span className={`text-sm ${step === 'confirmation'
                  ? 'text-secondary-900 font-medium'
                  : 'text-secondary-500'}`}>
                  Confirm
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {step === 'confirmation' ? (
          // Confirmation Page
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-3xl shadow-lg p-8 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center 
                            justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h1 className="text-3xl font-display font-bold text-secondary-900 mb-2">
                Order Confirmed!
              </h1>
              <p className="text-secondary-500 mb-6">
                Thank you for your order. We&apos;ll start preparing it right away.
              </p>
              <div className="bg-secondary-50 rounded-xl p-4 mb-6">
                <p className="text-sm text-secondary-500">Order Number</p>
                <p className="text-xl font-bold text-secondary-900">{orderId}</p>
              </div>

              <div className="space-y-4 text-left mb-8">
                <div className="flex items-start gap-3">
                  <Truck className="w-6 h-6 text-primary-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-secondary-900">Delivery Address</p>
                    <p className="text-secondary-600 text-sm">
                      {shippingInfo.firstName} {shippingInfo.lastName}<br />
                      {shippingInfo.street}<br />
                      {shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}<br />
                      {shippingInfo.country}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CreditCard className="w-6 h-6 text-primary-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-secondary-900">Payment Method</p>
                    <p className="text-secondary-600 text-sm">Cash on Delivery</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/account" className="flex-1 btn-primary justify-center">
                  View Order History
                </Link>
                <Link href="/products" className="flex-1 btn-outline justify-center">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {step === 'shipping' ? (
                // Shipping Form
                <div className="bg-white rounded-2xl shadow-md p-6">
                  <h2 className="text-xl font-display font-bold text-secondary-900 mb-6">
                    Shipping Information
                  </h2>

                  <form onSubmit={handleShippingSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-2">
                          First Name
                        </label>
                        <input
                          type="text"
                          value={shippingInfo.firstName}
                          onChange={(e) =>
                            setShippingInfo({ ...shippingInfo, firstName: e.target.value })
                          }
                          className={`w-full px-4 py-3 border rounded-xl focus:outline-none 
                                   focus:ring-2 focus:ring-primary-500
                                   ${errors.firstName ? 'border-red-300' : 'border-secondary-200'}`}
                        />
                        {errors.firstName && (
                          <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-2">
                          Last Name
                        </label>
                        <input
                          type="text"
                          value={shippingInfo.lastName}
                          onChange={(e) =>
                            setShippingInfo({ ...shippingInfo, lastName: e.target.value })
                          }
                          className={`w-full px-4 py-3 border rounded-xl focus:outline-none 
                                   focus:ring-2 focus:ring-primary-500
                                   ${errors.lastName ? 'border-red-300' : 'border-secondary-200'}`}
                        />
                        {errors.lastName && (
                          <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Street Address
                      </label>
                      <input
                        type="text"
                        value={shippingInfo.street}
                        onChange={(e) =>
                          setShippingInfo({ ...shippingInfo, street: e.target.value })
                        }
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none 
                                 focus:ring-2 focus:ring-primary-500
                                 ${errors.street ? 'border-red-300' : 'border-secondary-200'}`}
                      />
                      {errors.street && (
                        <p className="mt-1 text-sm text-red-500">{errors.street}</p>
                      )}
                    </div>

                    <div className="grid sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-2">
                          City
                        </label>
                        <input
                          type="text"
                          value={shippingInfo.city}
                          onChange={(e) =>
                            setShippingInfo({ ...shippingInfo, city: e.target.value })
                          }
                          className={`w-full px-4 py-3 border rounded-xl focus:outline-none 
                                   focus:ring-2 focus:ring-primary-500
                                   ${errors.city ? 'border-red-300' : 'border-secondary-200'}`}
                        />
                        {errors.city && (
                          <p className="mt-1 text-sm text-red-500">{errors.city}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-2">
                          State
                        </label>
                        <input
                          type="text"
                          value={shippingInfo.state}
                          onChange={(e) =>
                            setShippingInfo({ ...shippingInfo, state: e.target.value })
                          }
                          className={`w-full px-4 py-3 border rounded-xl focus:outline-none 
                                   focus:ring-2 focus:ring-primary-500
                                   ${errors.state ? 'border-red-300' : 'border-secondary-200'}`}
                        />
                        {errors.state && (
                          <p className="mt-1 text-sm text-red-500">{errors.state}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-2">
                          ZIP Code
                        </label>
                        <input
                          type="text"
                          value={shippingInfo.zipCode}
                          onChange={(e) =>
                            setShippingInfo({ ...shippingInfo, zipCode: e.target.value })
                          }
                          className={`w-full px-4 py-3 border rounded-xl focus:outline-none 
                                   focus:ring-2 focus:ring-primary-500
                                   ${errors.zipCode ? 'border-red-300' : 'border-secondary-200'}`}
                        />
                        {errors.zipCode && (
                          <p className="mt-1 text-sm text-red-500">{errors.zipCode}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-2">
                          Country
                        </label>
                        <select
                          value={shippingInfo.country}
                          onChange={(e) =>
                            setShippingInfo({ ...shippingInfo, country: e.target.value })
                          }
                          className="w-full px-4 py-3 border border-secondary-200 rounded-xl 
                                   focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                          <option value="United States">United States</option>
                          <option value="Canada">Canada</option>
                          <option value="United Kingdom">United Kingdom</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={shippingInfo.phone}
                          onChange={(e) =>
                            setShippingInfo({ ...shippingInfo, phone: e.target.value })
                          }
                          className={`w-full px-4 py-3 border rounded-xl focus:outline-none 
                                   focus:ring-2 focus:ring-primary-500
                                   ${errors.phone ? 'border-red-300' : 'border-secondary-200'}`}
                        />
                        {errors.phone && (
                          <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                        )}
                      </div>
                    </div>

                    <button type="submit" className="w-full btn-primary py-4">
                      Continue to Review
                    </button>
                  </form>
                </div>
              ) : (
                // Review Order
                <div className="bg-white rounded-2xl shadow-md p-6">
                  <h2 className="text-xl font-display font-bold text-secondary-900 mb-6">
                    Review Your Order
                  </h2>

                  {/* Shipping Info */}
                  <div className="mb-6 p-4 bg-secondary-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-3">
                      <Truck className="w-5 h-5 text-primary-600" />
                      <span className="font-medium text-secondary-900">Shipping Address</span>
                    </div>
                    <p className="text-secondary-600">
                      {shippingInfo.firstName} {shippingInfo.lastName}<br />
                      {shippingInfo.street}<br />
                      {shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}<br />
                      {shippingInfo.country}<br />
                      Phone: {shippingInfo.phone}
                    </p>
                    <button
                      onClick={() => setStep('shipping')}
                      className="text-primary-600 text-sm font-medium mt-2 hover:underline"
                    >
                      Edit
                    </button>
                  </div>

                  {/* Order Items */}
                  <div className="mb-6">
                    <h3 className="font-medium text-secondary-900 mb-3">Order Items</h3>
                    <div className="space-y-3">
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-4 p-3 bg-secondary-50 rounded-xl"
                        >
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-white">
                            <Image
                              src={item.image}
                              alt={item.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-secondary-900">{item.title}</p>
                            <p className="text-sm text-secondary-500">
                              Qty: {item.quantity} × {formatCurrency(item.price)}
                            </p>
                          </div>
                          <p className="font-medium text-secondary-900">
                            {formatCurrency(item.price * item.quantity)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Payment Info */}
                  <div className="p-4 bg-secondary-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-3">
                      <Shield className="w-5 h-5 text-primary-600" />
                      <span className="font-medium text-secondary-900">Payment Method</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-8 bg-secondary-200 rounded flex items-center 
                                    justify-center text-xs font-bold">
                        COD
                      </div>
                      <div>
                        <p className="font-medium text-secondary-900">Cash on Delivery</p>
                        <p className="text-sm text-secondary-500">
                          Pay when you receive your order
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    className="w-full btn-primary py-4 mt-6"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        Placing Order...
                      </>
                    ) : (
                      `Place Order - ${formatCurrency(total)}`
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-md p-6 sticky top-24">
                <h3 className="text-lg font-display font-bold text-secondary-900 mb-4">
                  Order Summary
                </h3>

                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-secondary-600 truncate max-w-[60%]">
                        {item.title} × {item.quantity}
                      </span>
                      <span className="text-secondary-900 font-medium">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-secondary-200 my-4 pt-4 space-y-2">
                  <div className="flex justify-between text-secondary-600">
                    <span>Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-secondary-600">
                    <span>Shipping</span>
                    <span>
                      {shipping === 0 ? (
                        <span className="text-green-600">Free</span>
                      ) : (
                        formatCurrency(shipping)
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-secondary-600">
                    <span>Tax</span>
                    <span>{formatCurrency(tax)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-secondary-900 pt-2">
                    <span>Total</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
