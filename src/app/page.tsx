import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Truck, Shield, RefreshCw, Headphones, Star, Sparkles } from 'lucide-react';
import { getFeaturedProducts } from '@/actions/product';
import { getCategories } from '@/actions/product';
import ProductCard from '@/components/shop/ProductCard';
import { formatCurrency } from '@/lib/utils';
import HeroSection from '../components/shop/HeroSection';
import DemoProductCard from '../components/shop/DemoProductCard';

import { useCartStore } from '@/context/CartStore';
import toast from 'react-hot-toast';

// Server Component - Fetch data on server
export default async function HomePage() {
  
  const [featuredResult, categoriesResult] = await Promise.all([
    getFeaturedProducts(8),
    getCategories(),
  ]);

  const featuredProducts = featuredResult.data || [];
  const categories = categoriesResult.length > 0 ? categoriesResult : [
    { id: 'fresh-produce', name: 'Fresh Produce', count: 24 },
    { id: 'dairy-eggs', name: 'Dairy & Eggs', count: 18 },
    { id: 'meat-seafood', name: 'Meat & Seafood', count: 15 },
    { id: 'bakery', name: 'Bakery', count: 12 },
    { id: 'beverages', name: 'Beverages', count: 20 },
    { id: 'snacks', name: 'Snacks', count: 16 },
  ];

  const features = [
    {
      icon: Truck,
      title: 'Free Delivery',
      description: 'On orders over $50',
    },
    {
      icon: Shield,
      title: 'Quality Guarantee',
      description: 'Freshness assured',
    },
    {
      icon: RefreshCw,
      title: 'Easy Returns',
      description: '30-day return policy',
    },
    {
      icon: Headphones,
      title: '24/7 Support',
      description: 'Dedicated support',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Features Bar */}
      <div className="bg-primary-600 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="flex items-center gap-4 text-white"
              >
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center 
                              justify-center flex-shrink-0">
                  <feature.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-semibold">{feature.title}</p>
                  <p className="text-primary-200 text-sm">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    
      {/* Featured Products Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-accent-500" />
                <span className="text-accent-500 font-medium">Featured</span>
              </div>
              <h2 className="section-title mb-0">Top Products</h2>
              <p className="text-secondary-500 mt-2">
                Handpicked favorites loved by our customers
              </p>
            </div>
            <Link
              href="/products?featured=true"
              className="hidden sm:flex items-center gap-2 text-primary-600 font-medium 
                       hover:text-primary-700 transition-colors"
            >
              View All
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.length > 0 ? (
              featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            ) : (
              // Demo products if none in database
              Array.from({ length: 8 }).map((_, index) => (
                <DemoProductCard key={index} index={index} />
              ))
            )}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link
              href="/products"
              className="btn-outline inline-flex items-center gap-2"
            >
              View All Products
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Promo Banner */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden bg-secondary-900">
            <div className="absolute inset-0">
              <Image
                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1920&q=80"
                alt="Special offer"
                fill
                className="object-cover opacity-30"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-secondary-900/90 via-secondary-900/70 to-transparent" />
            </div>
            <div className="relative py-16 px-8 md:py-20 md:px-16">
              <div className="max-w-xl">
                <span className="inline-block px-4 py-2 bg-accent-500 text-white 
                              font-semibold rounded-full text-sm mb-4">
                  Limited Time Offer
                </span>
                <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
                  Get 20% Off Your First Order
                </h2>
                <p className="text-secondary-300 text-lg mb-8">
                  Use code <span className="text-accent-400 font-bold">GOURMET20</span> at checkout. 
                  Fresh produce, organic goods, and gourmet delights at unbeatable prices.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/products"
                    className="btn-primary"
                  >
                    Shop Now
                  </Link>
                  <Link
                    href="/products?category=organic"
                    className="btn-secondary bg-white/10 text-white border-white/20 
                             hover:bg-white/20"
                  >
                    Explore Organic
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">What Our Customers Say</h2>
            <p className="section-subtitle">
              Join thousands of satisfied customers who love GourmetHub
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Sarah Johnson',
                role: 'Food Blogger',
                rating: 5,
                comment: 'The freshest produce I\'ve ever had delivered. GourmetHub has completely changed how I shop for groceries!',
              },
              {
                name: 'Michael Chen',
                role: 'Home Cook',
                rating: 5,
                comment: 'Quality is exceptional and delivery is always on time. My family loves the organic options.',
              },
              {
                name: 'Emily Davis',
                role: 'Busy Mom',
                rating: 5,
                comment: 'Saves me so much time! The products are always fresh and the customer service is amazing.',
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-md"
              >
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-accent-400 text-accent-400" />
                  ))}
                </div>
                <p className="text-secondary-600 mb-6 leading-relaxed">
                  &ldquo;{testimonial.comment}&rdquo;
                </p>
                <div className="flex items-center gap-4">
                  <div>
                    <p className="font-semibold text-secondary-900">{testimonial.name}</p>
                    <p className="text-sm text-secondary-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// Demo Product Card Component


