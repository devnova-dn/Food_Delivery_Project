'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useCartStore } from '@/context/CartStore';
import { formatCurrency, calculateDiscountPercentage } from '@/lib/utils';
import { IProduct } from '@/types';
import { useRouter } from 'next/navigation';

import toast from 'react-hot-toast';
import {
  ShoppingCart,
  Heart,
  Share2,
  Star,
  Minus,
  Plus,
  Truck,
  Shield,
  RefreshCw,
  ChevronRight,
  Sparkles,
  Leaf,
} from 'lucide-react';

// Données de produits (même que dans la page produits)
const demoProducts: IProduct[] = [
  {
    _id: 'ID00000001',
    title: 'Organic Avocados (Pack of 4)',
    slug: 'organic-avocados-pack-4',
    description: `Our premium Organic Hass Avocados are carefully sourced from sustainable farms in California, where the ideal climate produces the richest, most flavorful avocados.

Each avocado is hand-picked at peak ripeness to ensure perfect texture and taste. Our organic farming practices guarantee no synthetic pesticides or fertilizers are used, making these avocados a healthy choice for your family.

Perfect for guacamole, toast, salads, or simply enjoying on their own with a sprinkle of salt. The creamy, nutty flavor of Hass avocados has made them the world's most popular variety.

**Key Features:**
- 100% USDA Certified Organic
- Non-GMO verified
- Rich in healthy monounsaturated fats
- Excellent source of fiber, potassium, and vitamins
- Sustainably farmed`,
    shortDescription: 'Premium Hass avocados, organically grown and hand-picked at peak ripeness.',
    price: 5.99,
    discountPrice: 4.99,
    images: [
      'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=800&q=80',
      'https://images.unsplash.com/photo-1603048297172-c92544798d5e?w=800&q=80',
      'https://images.unsplash.com/photo-1595981234058-5938810bbca0?w=800&q=80',
    ],
    category: 'fresh-produce',
    brand: 'Organic Valley',
    stock: 50,
    unit: 'pack',
    ingredients: ['Organic Hass Avocados'],
    nutritionalInfo: {
      calories: 160,
      protein: 2,
      carbohydrates: 9,
      fat: 15,
      fiber: 7,
    },
    allergens: [],
    isOrganic: true,
    isFeatured: true,
    rating: 4.8,
    numReviews: 234,
    reviews: [
      {
        userId: '1',
        userName: 'Sarah M.',
        rating: 5,
        comment: 'Best avocados I\'ve ever bought online! Perfectly ripe and so fresh.',
        createdAt: new Date('2024-12-10'),
      },
      {
        userId: '2',
        userName: 'Mike T.',
        rating: 4,
        comment: 'Great quality, arrived in perfect condition. Will order again!',
        createdAt: new Date('2024-12-05'),
      },
    ],
  },
  {
    _id: 'ID00000002',
    title: 'Extra Virgin Olive Oil',
    slug: 'extra-virgin-olive-oil',
    description: `Cold-pressed from the finest Italian olives, this extra virgin olive oil is perfect for salads, cooking, and dipping.`,
    shortDescription: 'Premium cold-pressed Italian olive oil.',
    price: 24.99,
    images: [
      'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&q=80',
      'https://images.unsplash.com/photo-1561112075-c1d4f0c3de1c?w=800&q=80',
    ],
    category: 'pantry',
    brand: 'GourmetHub',
    stock: 100,
    unit: 'bottle',
    ingredients: ['Extra Virgin Olive Oil'],
    nutritionalInfo: {
      calories: 120,
      protein: 0,
      carbohydrates: 0,
      fat: 14,
      fiber: 0,
    },
    allergens: [],
    isOrganic: false,
    isFeatured: true,
    rating: 4.9,
    numReviews: 456,
    reviews: [
      {
        userId: '3',
        userName: 'Anna K.',
        rating: 5,
        comment: 'Excellent quality oil, perfect for Mediterranean dishes.',
        createdAt: new Date('2024-12-12'),
      },
    ],
  },
  {
    _id: 'ID00000003',
    title: 'Fresh Atlantic Salmon',
    slug: 'fresh-atlantic-salmon',
    description: `Wild-caught Atlantic salmon, rich in omega-3s and bursting with flavor. Perfect for grilling or baking.`,
    shortDescription: 'Wild-caught Atlantic salmon fillet.',
    price: 18.99,
    discountPrice: 15.99,
    images: [
      'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&q=80',
      'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&q=80',
    ],
    category: 'meat-seafood',
    brand: 'Ocean Fresh',
    stock: 30,
    unit: 'kg',
    ingredients: ['Atlantic Salmon'],
    nutritionalInfo: {
      calories: 208,
      protein: 20,
      carbohydrates: 0,
      fat: 13,
      fiber: 0,
    },
    allergens: ['Fish'],
    isOrganic: false,
    isFeatured: true,
    rating: 4.7,
    numReviews: 189,
    reviews: [
      {
        userId: '4',
        userName: 'John D.',
        rating: 5,
        comment: 'Fresh and delicious, great quality salmon!',
        createdAt: new Date('2024-12-08'),
      },
    ],
  },
  {
    _id: 'ID00000004',
    title: 'Artisan Sourdough Bread',
    slug: 'artisan-sourdough-bread',
    description: `Traditional sourdough bread with a crispy crust and soft, tangy interior. Made with organic flour.`,
    shortDescription: 'Traditional sourdough with crispy crust.',
    price: 6.99,
    images: [
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80',
      'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=800&q=80',
    ],
    category: 'bakery',
    brand: "Baker's Choice",
    stock: 25,
    unit: 'loaf',
    ingredients: ['Organic Wheat Flour', 'Water', 'Sea Salt', 'Sourdough Starter'],
    nutritionalInfo: {
      calories: 80,
      protein: 3,
      carbohydrates: 15,
      fat: 1,
      fiber: 2,
    },
    allergens: ['Gluten'],
    isOrganic: true,
    isFeatured: true,
    rating: 4.8,
    numReviews: 312,
    reviews: [
      {
        userId: '5',
        userName: 'Maria S.',
        rating: 5,
        comment: 'Perfect crust and texture, just like bakery fresh!',
        createdAt: new Date('2024-12-09'),
      },
    ],
  },
  // Ajoutez les autres produits ici (copiez depuis votre page products)...
  {
    _id: 'ID00000005',
    title: 'Organic Strawberries',
    slug: 'organic-strawberries',
    description: 'Sweet, juicy organic strawberries, perfect for snacking or desserts.',
    shortDescription: 'Sweet organic strawberries.',
    price: 8.99,
    images: ['https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=500&q=80'],
    category: 'fresh-produce',
    brand: 'Farm Fresh',
    stock: 40,
    unit: 'pack',
    isOrganic: true,
    isFeatured: true,
    rating: 4.6,
    numReviews: 278,
    reviews: [],
  },
  {
    _id: 'ID00000006',
    title: 'Greek Yogurt Premium',
    slug: 'greek-yogurt-premium',
    description: 'Creamy Greek yogurt made from 100% grass-fed cow\'s milk.',
    shortDescription: 'Creamy Greek yogurt from grass-fed cows.',
    price: 5.49,
    images: ['https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500&q=80'],
    category: 'dairy-eggs',
    brand: 'Dairy Delight',
    stock: 60,
    unit: 'container',
    isOrganic: false,
    isFeatured: true,
    rating: 4.7,
    numReviews: 421,
    reviews: [],
  },
];

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const router = useRouter();
  const signin = params?.signin === 'true';
  const [product, setProduct] = useState<IProduct | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'reviews' | 'nutrition'>('description');

  const { addItem, openCart } = useCartStore();

  useEffect(() => {
    if (!slug) return;

    // Trouver le produit par slug
    const foundProduct = demoProducts.find(p => p.slug === slug);
    
    if (foundProduct) {
      setProduct(foundProduct);
      
      // Trouver des produits similaires (même catégorie)
      const related = demoProducts
        .filter(p => p.category === foundProduct.category && p.slug !== slug)
        .slice(0, 4);
      setRelatedProducts(related);
    }
    
    setLoading(false);
  }, [slug]);

  // Si aucun produit trouvé
  if (!loading && !product) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 text-red-500 mb-4">❌</div>
          <h2 className="text-2xl font-bold text-secondary-900 mb-2">Product Not Found</h2>
          <p className="text-secondary-600 mb-6">The product you're looking for doesn't exist.</p>
          <Link 
            href="/products" 
            className="px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  if (loading || !product) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent 
                        rounded-full animate-spin mx-auto mb-4" />
          <p className="text-secondary-600">Loading product...</p>
        </div>
      </div>
    );
  }

  // Maintenant on est sûr que product n'est pas null
  const discountPercentage = calculateDiscountPercentage(product.price, product.discountPrice);
  const finalPrice = product.discountPrice || product.price;

  const handleAddToCart = () => {
    if (!signin) {
    toast.error('You must be signed in to add products to cart!', {
      duration: 3000,
    });
    router.push('/login'); // redirect vers login
    return;
  }
    setIsAdding(true);

    addItem({
      productId: product._id!,
      title: product.title,
      slug: product.slug,
      image: product.images[0],
      price: finalPrice,
      quantity,
      maxQuantity: product.stock,
    });

    toast.success(`${product.title} added to cart!`, {
      icon: '🛒',
      duration: 2000,
    });

    setTimeout(() => setIsAdding(false), 500);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    openCart();
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${
          i < Math.floor(rating)
            ? 'fill-accent-400 text-accent-400'
            : 'text-secondary-300'
        }`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-secondary-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-secondary-500 hover:text-secondary-700">
              Home
            </Link>
            <ChevronRight className="w-4 h-4 text-secondary-400" />
            <Link href="/products" className="text-secondary-500 hover:text-secondary-700">
              Products
            </Link>
            <ChevronRight className="w-4 h-4 text-secondary-400" />
            <Link
              href={`/products?category=${product.category}`}
              className="text-secondary-500 hover:text-secondary-700"
            >
              {product.category}
            </Link>
            <ChevronRight className="w-4 h-4 text-secondary-400" />
            <span className="text-secondary-900 font-medium truncate max-w-xs">
              {product.title}
            </span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Product Section */}
        <div className="bg-white rounded-3xl shadow-md overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 p-8">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-secondary-100">
                <Image
                  src={product.images[selectedImage]}
                  alt={product.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
                />
                {product.isOrganic && (
                  <div className="absolute top-4 left-4 px-3 py-1 bg-green-500 text-white 
                                text-sm font-semibold rounded-full flex items-center gap-1">
                    <Leaf className="w-4 h-4" />
                    Organic
                  </div>
                )}
                {discountPercentage > 0 && (
                  <div className="absolute top-4 right-4 px-3 py-1 bg-accent-500 text-white 
                                text-sm font-semibold rounded-full">
                    -{discountPercentage}%
                  </div>
                )}
              </div>
              <div className="flex gap-3 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 
                             transition-all ${
                               selectedImage === index
                                 ? 'ring-2 ring-primary-500'
                                 : 'opacity-60 hover:opacity-100'
                             }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.title} ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <p className="text-primary-600 font-medium mb-2">{product.brand}</p>
                <h1 className="text-3xl font-display font-bold text-secondary-900 mb-4">
                  {product.title}
                </h1>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    {renderStars(product.rating)}
                  </div>
                  <span className="text-secondary-600">
                    {product.rating} ({product.numReviews} reviews)
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-secondary-900">
                  {formatCurrency(finalPrice)}
                </span>
                {product.discountPrice && (
                  <span className="text-xl text-secondary-400 line-through">
                    {formatCurrency(product.price)}
                  </span>
                )}
                <span className="text-secondary-500">per {product.unit}</span>
              </div>

              {/* Short Description */}
              <p className="text-secondary-600 leading-relaxed">
                {product.shortDescription}
              </p>

              {/* Stock Status */}
              <div className="flex items-center gap-2">
                {product.stock > 0 ? (
                  <>
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-green-600 font-medium">
                      In Stock ({product.stock} available)
                    </span>
                  </>
                ) : (
                  <>
                    <div className="w-3 h-3 bg-red-500 rounded-full" />
                    <span className="text-red-600 font-medium">Out of Stock</span>
                  </>
                )}
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-4">
                <span className="text-secondary-700 font-medium">Quantity:</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center bg-secondary-100 
                             rounded-lg hover:bg-secondary-200 transition-colors"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="w-12 text-center font-semibold text-lg">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="w-10 h-10 flex items-center justify-center bg-secondary-100 
                             rounded-lg hover:bg-secondary-200 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={isAdding || product.stock === 0}
                  className="flex-1 py-4 bg-primary-600 text-white font-semibold rounded-xl 
                           hover:bg-primary-700 transition-colors disabled:opacity-50 
                           disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isAdding ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white 
                                    rounded-full animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5" />
                      Add to Cart
                    </>
                  )}
                </button>
               
                <button className="w-14 h-14 flex items-center justify-center border border-secondary-200 
                                 rounded-xl hover:bg-secondary-50 transition-colors">
                  <Heart className="w-6 h-6 text-secondary-400 hover:text-red-500" />
                </button>
                <button className="w-14 h-14 flex items-center justify-center border border-secondary-200 
                                 rounded-xl hover:bg-secondary-50 transition-colors">
                  <Share2 className="w-6 h-6 text-secondary-400" />
                </button>
              </div>

              {/* Benefits */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-secondary-100">
                <div className="flex flex-col items-center text-center">
                  <Truck className="w-8 h-8 text-primary-500 mb-2" />
                  <span className="text-sm font-medium text-secondary-900">Free Delivery</span>
                  <span className="text-xs text-secondary-500">Orders $50+</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <Shield className="w-8 h-8 text-primary-500 mb-2" />
                  <span className="text-sm font-medium text-secondary-900">Quality</span>
                  <span className="text-xs text-secondary-500">100% Guaranteed</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <RefreshCw className="w-8 h-8 text-primary-500 mb-2" />
                  <span className="text-sm font-medium text-secondary-900">Easy Returns</span>
                  <span className="text-xs text-secondary-500">30 Days Policy</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-8 bg-white rounded-3xl shadow-md overflow-hidden">
          <div className="flex border-b border-secondary-100">
            {[
              { id: 'description', label: 'Description' },
              { id: 'reviews', label: `Reviews (${product.numReviews})` },
              { id: 'nutrition', label: 'Nutrition' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-4 text-center font-medium transition-colors relative ${
                  activeTab === tab.id
                    ? 'text-primary-600'
                    : 'text-secondary-500 hover:text-secondary-700'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600" />
                )}
              </button>
            ))}
          </div>

          <div className="p-8">
            {activeTab === 'description' && (
              <div className="prose prose-secondary max-w-none">
                <div
                  className="text-secondary-600 whitespace-pre-line leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: product.description.replace(/\n/g, '<br/>'),
                  }}
                />
                {product.ingredients && product.ingredients.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-secondary-900 mb-3">
                      Ingredients
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {product.ingredients.map((ingredient, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-secondary-100 text-secondary-700 rounded-full"
                        >
                          {ingredient}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-8">
                {/* Rating Summary */}
                <div className="flex items-start gap-8 p-6 bg-secondary-50 rounded-2xl">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-secondary-900 mb-2">
                      {product.rating}
                    </div>
                    <div className="flex mb-2">{renderStars(product.rating)}</div>
                    <p className="text-secondary-500">{product.numReviews} reviews</p>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-secondary-900 mb-4">Customer Reviews</h3>
                    {product.reviews && product.reviews.length > 0 ? (
                      product.reviews.map((review, index) => (
                        <div key={index} className="mb-4 pb-4 border-b border-secondary-200 last:border-0">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center 
                                          justify-center text-primary-600 font-semibold">
                              {review.userName.charAt(0)}
                            </div>
                            <div>
                              <p className="font-medium text-secondary-900">{review.userName}</p>
                              <div className="flex items-center gap-2">
                                {renderStars(review.rating)}
                                <span className="text-sm text-secondary-500">
                                  {new Date(review.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                          <p className="text-secondary-600">{review.comment}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-secondary-500">No reviews yet. Be the first to review!</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'nutrition' && product.nutritionalInfo && (
              <div className="max-w-md">
                <h3 className="text-lg font-semibold text-secondary-900 mb-4">
                  Nutritional Information
                </h3>
                <p className="text-secondary-500 mb-4">Per serving (approximately 1/5 of product)</p>
                <div className="space-y-3">
                  {[
                    { label: 'Calories', value: product.nutritionalInfo.calories, unit: 'kcal' },
                    { label: 'Protein', value: product.nutritionalInfo.protein, unit: 'g' },
                    { label: 'Carbohydrates', value: product.nutritionalInfo.carbohydrates, unit: 'g' },
                    { label: 'Fat', value: product.nutritionalInfo.fat, unit: 'g' },
                    { label: 'Fiber', value: product.nutritionalInfo.fiber, unit: 'g' },
                  ].map((nutrient) => (
                    <div
                      key={nutrient.label}
                      className="flex items-center justify-between py-3 border-b border-secondary-100"
                    >
                      <span className="text-secondary-700">{nutrient.label}</span>
                      <span className="font-semibold text-secondary-900">
                        {nutrient.value} {nutrient.unit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}