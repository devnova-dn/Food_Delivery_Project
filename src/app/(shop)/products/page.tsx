'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/shop/ProductCard';
import FilterSidebar from '@/components/shop/FilterSidebar';
import { getProducts } from '@/actions/product';
import { IProduct } from '@/types';
import { Grid, List, SlidersHorizontal, X } from 'lucide-react';
import { useCallback } from 'react';

function ProductsContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    brand: searchParams.get('brand') || '',
    minPrice: searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined,
    maxPrice: searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined,
    isOrganic: searchParams.get('isOrganic') === 'true',
    search: searchParams.get('search') || '',
    sort: searchParams.get('sort') || 'popular',
    page: parseInt(searchParams.get('page') || '1'),
  });

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const result = await getProducts(filters);
    if (result.success && result.data) {
      setProducts(result.data as IProduct[]);
      // For demo, set some pagination
      setTotalPages(5);
      setTotalProducts(result.data.length * 3);
    }
    setLoading(false);
  }, [filters]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleFilterChange = (newFilters: any) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleClearAll = () => {
    setFilters({
      category: '',
      brand: '',
      minPrice: undefined,
      maxPrice: undefined,
      isOrganic: false,
      search: filters.search,
      sort: 'popular',
      page: 1,
    });
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const sortOptions = [
    { value: 'popular', label: 'Most Popular' },
    { value: 'newest', label: 'Newest' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
  ];

  // Demo products for showcase
  const demoProducts: IProduct[] = products.length > 0 ? products : [
    {
      _id: '1',
      title: 'Organic Avocados (Pack of 4)',
      slug: 'organic-avocados-pack-4',
      description: 'Premium Hass avocados, organically grown and hand-picked at peak ripeness.',
      shortDescription: 'Premium Hass avocados, organically grown.',
      price: 5.99,
      discountPrice: 4.99,
      images: ['https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=500&q=80'],
      category: 'fresh-produce',
      brand: 'Organic Valley',
      stock: 50,
      unit: 'pack',
      isOrganic: true,
      isFeatured: true,
      rating: 4.8,
      numReviews: 234,
      reviews: [],
    },
    {
      _id: '2',
      title: 'Extra Virgin Olive Oil',
      slug: 'extra-virgin-olive-oil',
      description: 'Cold-pressed from the finest Italian olives, perfect for salads and cooking.',
      shortDescription: 'Premium cold-pressed Italian olive oil.',
      price: 24.99,
      images: ['https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&q=80'],
      category: 'pantry',
      brand: 'GourmetHub',
      stock: 100,
      unit: 'bottle',
      isOrganic: false,
      isFeatured: true,
      rating: 4.9,
      numReviews: 456,
      reviews: [],
    },
    {
      _id: '3',
      title: 'Fresh Atlantic Salmon',
      slug: 'fresh-atlantic-salmon',
      description: 'Wild-caught Atlantic salmon, rich in omega-3s and bursting with flavor.',
      shortDescription: 'Wild-caught Atlantic salmon fillet.',
      price: 18.99,
      discountPrice: 15.99,
      images: ['https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500&q=80'],
      category: 'meat-seafood',
      brand: 'Ocean Fresh',
      stock: 30,
      unit: 'kg',
      isOrganic: false,
      isFeatured: true,
      rating: 4.7,
      numReviews: 189,
      reviews: [],
    },
    {
      _id: '4',
      title: 'Artisan Sourdough Bread',
      slug: 'artisan-sourdough-bread',
      description: 'Traditional sourdough bread with a crispy crust and soft, tangy interior.',
      shortDescription: 'Traditional sourdough with crispy crust.',
      price: 6.99,
      images: ['https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&q=80'],
      category: 'bakery',
      brand: "Baker's Choice",
      stock: 25,
      unit: 'loaf',
      isOrganic: false,
      isFeatured: true,
      rating: 4.8,
      numReviews: 312,
      reviews: [],
    },
    {
      _id: '5',
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
      _id: '6',
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
    
    {
      _id: '8',
      title: 'Organic Wildflower Honey',
      slug: 'organic-wildflower-honey',
      description: 'Pure, unfiltered honey from organic wildflowers. Rich and aromatic.',
      shortDescription: 'Pure organic wildflower honey.',
      price: 12.99,
      images: ['https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500&q=80'],
      category: 'pantry',
      brand: 'Bee Natural',
      stock: 45,
      unit: 'jar',
      isOrganic: true,
      isFeatured: true,
      rating: 4.9,
      numReviews: 345,
      reviews: [],
    },
  ];

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-display font-bold text-secondary-900">
            {filters.search ? `Search Results for "${filters.search}"` : 'All Products'}
          </h1>
          <p className="text-secondary-500 mt-2">
            {demoProducts.length} products found
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Filter Sidebar */}
          <FilterSidebar
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearAll={handleClearAll}
            isOpen={showFilters}
            onClose={() => setShowFilters(false)}
          />

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              {/* Mobile Filter Button */}
              <button
                onClick={() => setShowFilters(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border 
                         border-secondary-200 rounded-xl hover:bg-secondary-50 transition-colors"
              >
                <SlidersHorizontal className="w-5 h-5" />
                Filters
              </button>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-4">
                <label className="text-secondary-600 text-sm hidden sm:block">Sort by:</label>
                <select
                  value={filters.sort}
                  onChange={(e) => handleFilterChange({ sort: e.target.value })}
                  className="px-4 py-2 bg-white border border-secondary-200 rounded-xl 
                           focus:outline-none focus:ring-2 focus:ring-primary-500 text-secondary-700"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                {/* View Mode Toggle */}
                <div className="hidden sm:flex items-center bg-white border border-secondary-200 rounded-xl">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-l-xl transition-colors ${
                      viewMode === 'grid'
                        ? 'bg-primary-100 text-primary-600'
                        : 'text-secondary-400 hover:text-secondary-600'
                    }`}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-r-xl transition-colors ${
                      viewMode === 'list'
                        ? 'bg-primary-100 text-primary-600'
                        : 'text-secondary-400 hover:text-secondary-600'
                    }`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Active Filters */}
            {(filters.category || filters.brand || filters.isOrganic || filters.minPrice || filters.maxPrice) && (
              <div className="flex flex-wrap gap-2 mb-6">
                {filters.category && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 
                                 text-primary-700 rounded-full text-sm">
                    {filters.category}
                    <button onClick={() => handleFilterChange({ category: '' })}>
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                )}
                {filters.brand && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 
                                 text-primary-700 rounded-full text-sm">
                    {filters.brand}
                    <button onClick={() => handleFilterChange({ brand: '' })}>
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                )}
                {filters.isOrganic && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 
                                 text-green-700 rounded-full text-sm">
                    🌿 Organic
                    <button onClick={() => handleFilterChange({ isOrganic: false })}>
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                )}
                {(filters.minPrice || filters.maxPrice) && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-accent-100 
                                 text-accent-700 rounded-full text-sm">
                    ${filters.minPrice || 0} - ${filters.maxPrice || '∞'}
                    <button onClick={() => handleFilterChange({ minPrice: undefined, maxPrice: undefined })}>
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                )}
              </div>
            )}

            {/* Products Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div key={index} className="card p-4 animate-pulse">
                    <div className="aspect-square bg-secondary-200 rounded-xl mb-4" />
                    <div className="h-4 bg-secondary-200 rounded w-1/4 mb-2" />
                    <div className="h-5 bg-secondary-200 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-secondary-200 rounded w-1/3" />
                  </div>
                ))}
              </div>
            ) : (
              <div
                className={`grid gap-6 ${
                  viewMode === 'grid'
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                    : 'grid-cols-1'
                }`}
              >
                {demoProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}

            {/* Pagination */}
            <div className="mt-12 flex justify-center">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(filters.page - 1)}
                  disabled={filters.page === 1}
                  className="px-4 py-2 bg-white border border-secondary-200 rounded-lg 
                           text-secondary-600 hover:bg-secondary-50 disabled:opacity-50 
                           disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                {Array.from({ length: Math.min(totalPages, 5) }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handlePageChange(index + 1)}
                    className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                      filters.page === index + 1
                        ? 'bg-primary-600 text-white'
                        : 'bg-white border border-secondary-200 text-secondary-600 hover:bg-secondary-50'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(filters.page + 1)}
                  disabled={filters.page === totalPages}
                  className="px-4 py-2 bg-white border border-secondary-200 rounded-lg 
                           text-secondary-600 hover:bg-secondary-50 disabled:opacity-50 
                           disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent 
                        rounded-full animate-spin mx-auto mb-4" />
          <p className="text-secondary-600">Loading products...</p>
        </div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
