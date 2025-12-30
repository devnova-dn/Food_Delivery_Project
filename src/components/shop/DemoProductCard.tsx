'use client';

import Image from 'next/image';
import { useCartStore } from '@/context/CartStore';
import toast from 'react-hot-toast';
import { formatCurrency } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/providers';
type DemoProductCardProps = {
  index: number;
};
export default function DemoProductCard({ index }: DemoProductCardProps) {
      const showCartButton = useAuth();
 const router = useRouter();
  const demoProducts = [
    { title: 'Organic Avocados', price: 4.99, brand: 'Organic Valley', rating: 4.8, reviews: 234, unit: 'piece', image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=500&q=80' },
    { title: 'Premium Olive Oil', price: 24.99, brand: 'GourmetHub', rating: 4.9, reviews: 456, unit: 'bottle', image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&q=80' },
    { title: 'Fresh Salmon Fillet', price: 15.99, brand: 'Ocean Fresh', rating: 4.7, reviews: 189, unit: 'kg', image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500&q=80' },
    { title: 'Grass-Fed Beef Steak', price: 22.99, brand: 'Prime Cuts', rating: 4.8, reviews: 276, unit: 'kg', image: 'https://i.postimg.cc/cCpwRFnC/delicious-food-table.jpg' },
{ title: 'Free-Range Chicken Breast', price: 11.49, brand: 'Farm Select', rating: 4.6, reviews: 198, unit: 'kg', image: 'https://i.postimg.cc/9fbd6P65/close-up-delicious-chicken-meal.jpg' },
{ title: 'Organic Brown Eggs', price: 4.29, brand: 'Happy Hen', rating: 4.7, reviews: 342, unit: 'dozen', image: 'https://i.postimg.cc/CK7G3C3B/24233479-4743-49aa-bb2a-fce6a8195352.jpg' },
{ title: 'Wild-Caught Shrimp', price: 18.99, brand: 'Sea Harvest', rating: 4.8, reviews: 221, unit: 'kg', image: 'https://i.postimg.cc/Qxv0mb3J/Capture_d_écran_2025_12_28_124914.png' },
{ title: 'Artisan Cheese Platter', price: 14.99, brand: 'Fromagerie Luxe', rating: 4.9, reviews: 415, unit: 'pack', image: 'https://i.postimg.cc/NM06B9tN/cheese-grapes-wooden-board.jpg' },

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