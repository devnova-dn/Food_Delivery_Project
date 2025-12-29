'use client';

import { ShoppingCart, Star, Sparkles, Eye } from 'lucide-react';
import { useCartStore } from '@/context/CartStore';
import { formatCurrency, calculateDiscountPercentage } from '@/lib/utils';
import { IProduct } from '@/types';
import toast from 'react-hot-toast';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface ProductCardProps {
  product: IProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const searchParams = useSearchParams();
  const signin = searchParams.get('signin') === 'true';
  const router = useRouter();
  const { addItem } = useCartStore();
  const [isAdding, setIsAdding] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const discountPercentage = product.discountPrice
    ? calculateDiscountPercentage(product.price, product.discountPrice)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!signin) {
      toast.error('You must be signed in to add products to cart!', { duration: 3000 });
      router.push('/login');
      return;
    }

    setIsAdding(true);

    addItem({
      productId: product._id!,
      title: product.title,
      slug: product.slug,
      image: product.images[0] || '/placeholder-food.jpg',
      price: product.discountPrice || product.price,
      quantity: 1,
      maxQuantity: product.stock,
    });

    toast.success(`${product.title} added to cart!`, { icon: '🛒', duration: 2000 });
    setTimeout(() => setIsAdding(false), 500);
  };

  const handleViewDetails = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const path = signin
      ? `/products/${product.slug}?signin=true`
      : `/products/${product.slug}`;
    router.push(path); // always trigger navigation
  };

  const renderStars = (rating: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'fill-accent-400 text-accent-400' : 'text-secondary-300'}`}
      />
    ));

  return (
    <div
      className="group bg-white rounded-xl shadow-sm border border-secondary-200 overflow-hidden hover:shadow-lg transition-shadow duration-300 relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleViewDetails} // clicking the card navigates too
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-secondary-100">
        <Image
          src={product.images[0] || '/placeholder-food.jpg'}
          alt={product.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isOrganic && (
            <span className="px-2 py-1 bg-green-500 text-white text-xs font-semibold rounded-full flex items-center gap-1 pointer-events-none">
              <Sparkles className="w-3 h-3" /> Organic
            </span>
          )}
          {discountPercentage > 0 && (
            <span className="px-2 py-1 bg-accent-500 text-white text-xs font-semibold rounded-full pointer-events-none">
              -{discountPercentage}%
            </span>
          )}
          {product.rating >= 4.5 && (
            <span className="px-2 py-1 bg-primary-500 text-white text-xs font-semibold rounded-full pointer-events-none">
              ⭐ Top Rated
            </span>
          )}
        </div>

        {/* View Details Button */}
        <div
          className={`absolute top-3 right-3 flex items-center gap-2 z-20 transition-all duration-300 ${
            isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
          }`}
        >
          <button
            onClick={handleViewDetails}
            className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-secondary-600 hover:text-primary-600 hover:bg-primary-50 transition-all duration-300"
            aria-label="View details"
          >
            <Eye className="w-5 h-5" />
          </button>
        </div>

        {/* Add to Cart Button */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <button
            onClick={handleAddToCart}
            disabled={isAdding || product.stock === 0}
            className="w-full py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 active:bg-primary-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
          >
            {isAdding ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : product.stock === 0 ? (
              'Out of Stock'
            ) : (
              <>
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </>
            )}
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <p className="text-sm text-primary-600 font-medium mb-1">{product.brand}</p>
        <h3
          className="font-semibold text-secondary-900 mb-2 line-clamp-2 hover:text-primary-600 transition-colors cursor-pointer"
          onClick={(e) => handleViewDetails(e)}
        >
          {product.title}
        </h3>

        <div className="flex items-center gap-2 mb-2">
          <div className="flex">{renderStars(product.rating)}</div>
          <span className="text-sm text-secondary-500">({product.numReviews})</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-secondary-900">
            {formatCurrency(product.discountPrice || product.price)}
          </span>
          {product.discountPrice && (
            <span className="text-sm text-secondary-400 line-through">
              {formatCurrency(product.price)}
            </span>
          )}
        </div>
        <p className="text-sm text-secondary-500 mt-1">per {product.unit}</p>
      </div>
    </div>
  );
}
