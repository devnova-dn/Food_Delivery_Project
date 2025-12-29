'use client';

import { ShoppingCart, Heart, Star, Sparkles, Eye } from 'lucide-react';
import { useCartStore } from '@/context/CartStore';
import { formatCurrency, calculateDiscountPercentage } from '@/lib/utils';
import { IProduct } from '@/types';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useParams } from 'next/navigation';
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

  // Fonction de débogage
  const testNavigation = () => {
    console.log('=== DEBUG INFO ===');
    console.log('Product slug:', product.slug);
    console.log('Full path:', `/products/${product.slug}`);
    console.log('Router object:', router);
    console.log('Product ID:', product._id);
    console.log('==================');
  };

const handleViewDetails = (e: React.MouseEvent) => {
  e.stopPropagation();

  const path = signin
    ? `/products/${product.slug}?signin=true`
    : `/products/${product.slug}`;

  try {
    router.push(path);
    console.log('Navigating to:', path);
  } catch (error) {
    console.error('Navigation error:', error);
    toast.error('Navigation failed');
  }
};


  const discountPercentage = product.discountPrice
    ? calculateDiscountPercentage(product.price, product.discountPrice)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    if (!signin) {
    toast.error('You must be signed in to add products to cart!', {
      duration: 3000,
    });
    router.push('/login'); // redirect vers login
    return;
  }
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

    setTimeout(() => setIsAdding(false), 500);
  };


  const renderStars = (rating: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating)
            ? 'fill-accent-400 text-accent-400'
            : 'text-secondary-300'
        }`}
      />
    ));

  return (
    <div
      className="group bg-white rounded-xl shadow-sm border border-secondary-200 overflow-hidden hover:shadow-lg transition-shadow duration-300 relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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
            <div className="pointer-events-none">
              <span className="px-2 py-1 bg-green-500 text-white text-xs font-semibold rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Organic
              </span>
            </div>
          )}
          {discountPercentage > 0 && (
            <div className="pointer-events-none">
              <span className="px-2 py-1 bg-accent-500 text-white text-xs font-semibold rounded-full">
                -{discountPercentage}%
              </span>
            </div>
          )}
          {product.rating >= 4.5 && (
            <div className="pointer-events-none">
              <span className="px-2 py-1 bg-primary-500 text-white text-xs font-semibold rounded-full">
                ⭐ Top Rated
              </span>
            </div>
          )}
        </div>

        {/* Wishlist Button */}
      <div
  className={`absolute top-3 right-3 flex items-center gap-2 z-20 transition-all duration-300 ${
    isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
  }`}
>


  {/* View Details */}
   <button
            onClick={handleViewDetails}
            className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-secondary-600 hover:text-primary-600 hover:bg-primary-50 transition-all duration-300"
    aria-label="View details"
  >
    <Eye className="w-5 h-5" />
  </button>
</div>
        {/* Quick Actions Overlay */}
      

      
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
        
        {/* Version 3: Link autour du titre */}
       <Link
  href={signin ? `/products/${product.slug}?signin=true` : `/products/${product.slug}`}
          className="block group/title"
          onClick={(e) => {
            console.log('Link clicked for:', product.slug);
          }}
        >
          <h3 className="font-semibold text-secondary-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors group-hover/title:text-primary-700">
            {product.title}
          </h3>
        </Link>

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