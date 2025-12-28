'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Heart, Star, Sparkles } from 'lucide-react';
import { useCartStore } from '@/context/CartStore';
import { formatCurrency, calculateDiscountPercentage } from '@/lib/utils';
import { IProduct } from '@/types';
import toast from 'react-hot-toast';
import { useState } from 'react';

interface ProductCardProps {
  product: IProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem, openCart } = useCartStore();
  const [isAdding, setIsAdding] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const discountPercentage = product.discountPrice
    ? calculateDiscountPercentage(product.price, product.discountPrice)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

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

    toast.success(`${product.title} added to cart!`, {
      icon: '🛒',
      duration: 2000,
    });

    setTimeout(() => {
      setIsAdding(false);
    }, 500);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating)
            ? 'fill-accent-400 text-accent-400'
            : 'text-secondary-300'
        }`}
      />
    ));
  };

  return (
    <Link
      href={`/products/${product.slug}`}
      className="card group overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Section */}
      <div className="relative aspect-square overflow-hidden bg-secondary-100">
        <Image
          src={product.images[0] || '/placeholder-food.jpg'}
          alt={product.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isOrganic && (
            <span className="px-2 py-1 bg-green-500 text-white text-xs font-semibold 
                           rounded-full flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Organic
            </span>
          )}
          {discountPercentage > 0 && (
            <span className="px-2 py-1 bg-accent-500 text-white text-xs font-semibold 
                           rounded-full">
              -{discountPercentage}%
            </span>
          )}
          {product.rating >= 4.5 && (
            <span className="px-2 py-1 bg-primary-500 text-white text-xs font-semibold 
                           rounded-full">
              ⭐ Top Rated
            </span>
          )}
        </div>

        {/* Quick Actions */}
        <div
          className={`absolute top-3 right-3 flex flex-col gap-2 transition-all duration-300 
                     transform ${
                       isHovered ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
                     }`}
        >
          <button
            className="w-10 h-10 bg-white rounded-full shadow-md flex items-center 
                     justify-center text-secondary-600 hover:text-red-500 
                     hover:bg-red-50 transition-colors"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <Heart className="w-5 h-5" />
          </button>
        </div>

        {/* Add to Cart Button */}
        <div
          className={`absolute bottom-0 left-0 right-0 p-4 transition-all duration-300 
                     transform ${
                       isHovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
                     }`}
        >
          <button
            onClick={handleAddToCart}
            disabled={isAdding || product.stock === 0}
            className="w-full py-3 bg-primary-600 text-white font-semibold rounded-xl 
                     hover:bg-primary-700 active:bg-primary-800 transition-colors
                     disabled:opacity-50 disabled:cursor-not-allowed
                     flex items-center justify-center gap-2"
          >
            {isAdding ? (
              <>
                <span className="w-5 h-5 border-2 border-white/30 border-t-white 
                               rounded-full animate-spin" />
                Adding...
              </>
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

      {/* Content Section */}
      <div className="p-4">
        <p className="text-sm text-primary-600 font-medium mb-1">{product.brand}</p>
        <h3 className="font-semibold text-secondary-900 mb-2 line-clamp-2 
                     group-hover:text-primary-600 transition-colors">
          {product.title}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-2">
          <div className="flex">{renderStars(product.rating)}</div>
          <span className="text-sm text-secondary-500">
            ({product.numReviews})
          </span>
        </div>

        {/* Price */}
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

        {/* Unit */}
        <p className="text-sm text-secondary-500 mt-1">per {product.unit}</p>
      </div>
    </Link>
  );
}
