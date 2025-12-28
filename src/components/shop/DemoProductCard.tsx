'use client';

import Image from 'next/image';
import { useCartStore } from '@/context/CartStore';
import toast from 'react-hot-toast';
import { formatCurrency } from '@/lib/utils';
 import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
export default function DemoProductCard({ index }: { index: number }) {
    const searchParams = useSearchParams();
      const showCartButton = searchParams.get('signin') === 'true';
 const router = useRouter();
  const demoProducts = [
    { title: 'Organic Avocados', price: 4.99, brand: 'Organic Valley', rating: 4.8, reviews: 234, unit: 'piece', image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=500&q=80' },
    { title: 'Premium Olive Oil', price: 24.99, brand: 'GourmetHub', rating: 4.9, reviews: 456, unit: 'bottle', image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&q=80' },
    { title: 'Fresh Salmon Fillet', price: 15.99, brand: 'Ocean Fresh', rating: 4.7, reviews: 189, unit: 'kg', image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500&q=80' },
    { title: 'Grass-Fed Beef Steak', price: 22.99, brand: 'Prime Cuts', rating: 4.8, reviews: 276, unit: 'kg', image: 'https://images.unsplash.com/photo-1604908177522-4295f49b3f1c?w=500&q=80' },
{ title: 'Free-Range Chicken Breast', price: 11.49, brand: 'Farm Select', rating: 4.6, reviews: 198, unit: 'kg', image: 'https://images.unsplash.com/photo-1604908554166-7c0d4bb6b9f4?w=500&q=80' },
{ title: 'Organic Brown Eggs', price: 4.29, brand: 'Happy Hen', rating: 4.7, reviews: 342, unit: 'dozen', image: 'https://images.unsplash.com/photo-1517959105821-eaf2591984ca?w=500&q=80' },
{ title: 'Wild-Caught Shrimp', price: 18.99, brand: 'Sea Harvest', rating: 4.8, reviews: 221, unit: 'kg', image: 'https://images.unsplash.com/photo-1617191518004-43bafed6a1c5?w=500&q=80' },
{ title: 'Artisan Cheese Platter', price: 14.99, brand: 'Fromagerie Luxe', rating: 4.9, reviews: 415, unit: 'pack', image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=500&q=80' },
{ title: 'Extra Virgin Olive Oil', price: 19.99, brand: 'Mediterraneo', rating: 4.8, reviews: 389, unit: 'bottle', image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&q=80' },
{ title: 'Fresh Atlantic Cod', price: 13.49, brand: 'Ocean Pure', rating: 4.6, reviews: 167, unit: 'kg', image: 'https://images.unsplash.com/photo-1604908812316-4e7e12c8a8d6?w=500&q=80' },
{ title: 'Organic Cherry Tomatoes', price: 5.99, brand: 'Green Valley', rating: 4.7, reviews: 254, unit: 'pack', image: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=500&q=80' },
{ title: 'Handmade Pasta', price: 6.49, brand: 'Italiano Vivo', rating: 4.8, reviews: 301, unit: 'pack', image: 'https://images.unsplash.com/photo-1523986371872-9d3ba2e2f5c1?w=500&q=80' },
{ title: 'Raw Organic Honey', price: 12.99, brand: 'Golden Hive', rating: 4.9, reviews: 447, unit: 'jar', image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500&q=80' },

  ];
  const { addItem, openCart } = useCartStore();

  const product = demoProducts[index % demoProducts.length];

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
if (!showCartButton) {
      // redirect to login page with callback
      router.push(`/login?callbackUrl=/`);
      toast('You must be signed in to add items to cart', { icon: '⚠️' });
      return;
    }
    addItem({
      productId: `demo-${index}`, // fake id
      title: product.title,
      slug: product.title.toLowerCase().replace(/\s+/g, '-'),
      image: product.image,
      price: product.price,
      quantity: 1,
      maxQuantity: 10, // fake stock
    });

    toast.success(`${product.title} added to cart 🛒`);
    openCart();
  };

  return (
    <div className="card group overflow-hidden">
      <div className="relative aspect-square overflow-hidden bg-secondary-100">
        <Image
          src={product.image}
          alt={product.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />

        <div className="absolute bottom-0 left-0 right-0 p-4 transition-all duration-300 transform translate-y-full group-hover:translate-y-0">
          <button
            onClick={handleAddToCart}
            className="w-full py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
          >
            Add to Cart
          </button>
        </div>
      </div>

      <div className="p-4">
        <p className="text-sm text-primary-600 font-medium mb-1">{product.brand}</p>
        <h3 className="font-semibold text-secondary-900 mb-2">{product.title}</h3>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm text-secondary-500">⭐ {product.rating}</span>
          <span className="text-sm text-secondary-500">({product.reviews})</span>
        </div>
        <span className="text-xl font-bold text-secondary-900">
          {formatCurrency(product.price)}
        </span>
        <p className="text-sm text-secondary-500 mt-1">per {product.unit}</p>
      </div>
    </div>
  );
}