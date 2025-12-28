'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getProductBySlug, getRelatedProducts, addReview } from '@/actions/product';
import { useCartStore } from '@/context/CartStore';
import { formatCurrency, calculateDiscountPercentage } from '@/lib/utils';
import { IProduct } from '@/types';
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

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [product, setProduct] = useState<IProduct | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'reviews' | 'nutrition'>('description');
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [showReviewForm, setShowReviewForm] = useState(false);

  const { addItem, openCart } = useCartStore();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      const [productResult, relatedResult] = await Promise.all([
        getProductBySlug(slug),
        getRelatedProducts('fresh-produce', '1', 4), // Demo category
      ]);

      if (productResult.success && productResult.data) {
        setProduct(productResult.data as IProduct);
      }

      if (relatedResult.success && relatedResult.data) {
        setRelatedProducts(relatedResult.data as IProduct[]);
      }

      setLoading(false);
    };

    fetchProduct();
  }, [slug]);

  // Demo product data
  const demoProduct: IProduct = {
    _id: '1',
    title: 'Organic Hass Avocados (Pack of 4)',
    slug: 'organic-hass-avocados-pack-4',
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
  };

  const displayProduct = product || demoProduct;
  const displayRelated = relatedProducts.length > 0 ? relatedProducts : [
    {
      _id: '2',
      title: 'Organic Tomatoes (500g)',
      slug: 'organic-tomatoes-500g',
      shortDescription: 'Vine-ripened organic tomatoes.',
      price: 4.99,
      images: ['https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&q=80'],
      category: 'fresh-produce',
      brand: 'Farm Fresh',
      stock: 60,
      unit: 'pack',
      isOrganic: true,
      isFeatured: true,
      rating: 4.6,
      numReviews: 189,
      reviews: [],
    },
    {
      _id: '3',
      title: 'Fresh Lemons (Pack of 6)',
      slug: 'fresh-lemons-pack-6',
      shortDescription: 'Bright and zesty organic lemons.',
      price: 3.99,
      images: ['https://images.unsplash.com/photo-1568569350062-ebfa3cb195df?w=500&q=80'],
      category: 'fresh-produce',
      brand: 'Citrus Grove',
      stock: 80,
      unit: 'pack',
      isOrganic: true,
      isFeatured: false,
      rating: 4.7,
      numReviews: 234,
      reviews: [],
    },
    {
      _id: '4',
      title: 'Organic Spinach (200g)',
      slug: 'organic-spinach-200g',
      shortDescription: 'Crisp and tender baby spinach.',
      price: 3.49,
      images: ['https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500&q=80'],
      category: 'fresh-produce',
      brand: 'Green Valley',
      stock: 45,
      unit: 'pack',
      isOrganic: true,
      isFeatured: true,
      rating: 4.8,
      numReviews: 156,
      reviews: [],
    },
  ];

  const discountPercentage = calculateDiscountPercentage(displayProduct.price, displayProduct.discountPrice);
  const finalPrice = displayProduct.discountPrice || displayProduct.price;

  const handleAddToCart = () => {
    setIsAdding(true);

    addItem({
      productId: displayProduct._id!,
      title: displayProduct.title,
      slug: displayProduct.slug,
      image: displayProduct.images[0],
      price: finalPrice,
      quantity,
      maxQuantity: displayProduct.stock,
    });

    toast.success(`${displayProduct.title} added to cart!`, {
      icon: '🛒',
      duration: 2000,
    });

    setTimeout(() => setIsAdding(false), 500);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    openCart();
  };

  const renderStars = (rating: number, interactive = false) => {
    return Array.from({ length: 5 }, (_, i) => (
      <button
        key={i}
        type="button"
        disabled={!interactive}
        onClick={() => interactive && setReviewForm({ ...reviewForm, rating: i + 1 })}
        className={`${interactive ? 'cursor-pointer' : 'cursor-default'}`}
      >
        <Star
          className={`w-5 h-5 ${
            i < Math.floor(rating)
              ? 'fill-accent-400 text-accent-400'
              : 'text-secondary-300'
          } ${interactive && i < reviewForm.rating ? 'text-accent-400' : ''}`}
        />
      </button>
    ));
  };

  if (loading) {
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
              href={`/products?category=${displayProduct.category}`}
              className="text-secondary-500 hover:text-secondary-700"
            >
              {displayProduct.category}
            </Link>
            <ChevronRight className="w-4 h-4 text-secondary-400" />
            <span className="text-secondary-900 font-medium truncate max-w-xs">
              {displayProduct.title}
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
                  src={displayProduct.images[selectedImage]}
                  alt={displayProduct.title}
                  fill
                  className="object-cover"
                  priority
                />
                {displayProduct.isOrganic && (
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
                {displayProduct.images.map((image, index) => (
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
                      alt={`${displayProduct.title} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <p className="text-primary-600 font-medium mb-2">{displayProduct.brand}</p>
                <h1 className="text-3xl font-display font-bold text-secondary-900 mb-4">
                  {displayProduct.title}
                </h1>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    {renderStars(displayProduct.rating)}
                  </div>
                  <span className="text-secondary-600">
                    {displayProduct.rating} ({displayProduct.numReviews} reviews)
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-secondary-900">
                  {formatCurrency(finalPrice)}
                </span>
                {displayProduct.discountPrice && (
                  <span className="text-xl text-secondary-400 line-through">
                    {formatCurrency(displayProduct.price)}
                  </span>
                )}
                <span className="text-secondary-500">per {displayProduct.unit}</span>
              </div>

              {/* Short Description */}
              <p className="text-secondary-600 leading-relaxed">
                {displayProduct.shortDescription}
              </p>

              {/* Stock Status */}
              <div className="flex items-center gap-2">
                {displayProduct.stock > 0 ? (
                  <>
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-green-600 font-medium">
                      In Stock ({displayProduct.stock} available)
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
                    onClick={() => setQuantity(Math.min(displayProduct.stock, quantity + 1))}
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
                  disabled={isAdding || displayProduct.stock === 0}
                  className="flex-1 btn-primary flex items-center justify-center gap-2 py-4"
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
                <button
                  onClick={handleBuyNow}
                  disabled={displayProduct.stock === 0}
                  className="flex-1 btn-outline"
                >
                  Buy Now
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
              { id: 'reviews', label: `Reviews (${displayProduct.numReviews})` },
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
                    __html: displayProduct.description.replace(/\n/g, '<br/>'),
                  }}
                />
                {displayProduct.ingredients && displayProduct.ingredients.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-secondary-900 mb-3">
                      Ingredients
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {displayProduct.ingredients.map((ingredient, index) => (
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
                      {displayProduct.rating}
                    </div>
                    <div className="flex mb-2">{renderStars(displayProduct.rating)}</div>
                    <p className="text-secondary-500">{displayProduct.numReviews} reviews</p>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-secondary-900 mb-4">Customer Reviews</h3>
                    {displayProduct.reviews.map((review, index) => (
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
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'nutrition' && (
              <div className="max-w-md">
                <h3 className="text-lg font-semibold text-secondary-900 mb-4">
                  Nutritional Information
                </h3>
                <p className="text-secondary-500 mb-4">Per serving (approximately 1/5 of product)</p>
                {displayProduct.nutritionalInfo && (
                  <div className="space-y-3">
                    {[
                      { label: 'Calories', value: displayProduct.nutritionalInfo.calories, unit: 'kcal' },
                      { label: 'Protein', value: displayProduct.nutritionalInfo.protein, unit: 'g' },
                      { label: 'Carbohydrates', value: displayProduct.nutritionalInfo.carbohydrates, unit: 'g' },
                      { label: 'Fat', value: displayProduct.nutritionalInfo.fat, unit: 'g' },
                      { label: 'Fiber', value: displayProduct.nutritionalInfo.fiber, unit: 'g' },
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
                )}
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-12">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-6 h-6 text-accent-500" />
            <h2 className="text-2xl font-display font-bold text-secondary-900">
              You May Also Like
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayRelated.map((product) => (
              <Link
                key={product._id}
                href={`/products/${product.slug}`}
                className="card overflow-hidden group"
              >
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={product.images[0]}
                    alt={product.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="p-4">
                  <p className="text-sm text-primary-600 font-medium">{product.brand}</p>
                  <h3 className="font-semibold text-secondary-900 mb-1 group-hover:text-primary-600 
                               transition-colors line-clamp-1">
                    {product.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-secondary-900">
                      {formatCurrency(product.discountPrice || product.price)}
                    </span>
                    <span className="text-sm text-secondary-500">/ {product.unit}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
