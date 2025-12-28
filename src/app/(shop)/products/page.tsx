'use client';

import { useState, useEffect, Suspense, useCallback } from 'react';
import { X, Grid, List, SlidersHorizontal } from 'lucide-react';
import ProductCard from '@/components/shop/ProductCard';
import FilterSidebar from '@/components/shop/FilterSidebar';
import { IProduct } from '@/types';

function ProductsContent() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [filters, setFilters] = useState({
    category: '',
    brand: '',
    minPrice: undefined as number | undefined,
    maxPrice: undefined as number | undefined,
    isOrganic: false,
    search: '',
    sort: 'popular',
    page: 1,
  });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  // Demo products
  
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
    {
  _id: '9',
  title: 'Grass-Fed Beef Steak',
  slug: 'grass-fed-beef-steak',
  description: 'Premium grass-fed beef steak, tender and full of flavor.',
  shortDescription: 'Premium grass-fed beef steak.',
  price: 22.99,
  images: ['https://i.postimg.cc/cCpwRFnC/delicious-food-table.jpg'],
  category: 'meat-seafood',
  brand: 'Prime Cuts',
  stock: 35,
  unit: 'kg',
  isOrganic: false,
  isFeatured: false,
  rating: 4.8,
  numReviews: 276,
  reviews: [],
},
{
  _id: '10',
  title: 'Free-Range Chicken Breast',
  slug: 'free-range-chicken-breast',
  description: 'Tender free-range chicken breast, responsibly sourced.',
  shortDescription: 'Free-range chicken breast.',
  price: 11.49,
  images: ['https://i.postimg.cc/9fbd6P65/close-up-delicious-chicken-meal.jpg'],
  category: 'meat-seafood',
  brand: 'Farm Select',
  stock: 40,
  unit: 'kg',
  isOrganic: false,
  isFeatured: false,
  rating: 4.6,
  numReviews: 198,
  reviews: [],
},
{
  _id: '11',
  title: 'Organic Brown Eggs',
  slug: 'organic-brown-eggs',
  description: 'Fresh organic brown eggs from free-roaming hens.',
  shortDescription: 'Organic brown eggs.',
  price: 4.29,
  images: ['https://i.postimg.cc/CK7G3C3B/24233479-4743-49aa-bb2a-fce6a8195352.jpg'],
  category: 'dairy-eggs',
  brand: 'Happy Hen',
  stock: 80,
  unit: 'dozen',
  isOrganic: true,
  isFeatured: false,
  rating: 4.7,
  numReviews: 342,
  reviews: [],
},
{
    _id: '12',
    title: 'Organic Blueberries',
    slug: 'organic-blueberries',
    description: 'Sweet and juicy organic blueberries, perfect for snacking and desserts.',
    shortDescription: 'Fresh organic blueberries.',
    price: 6.99,
    images: ['https://images.unsplash.com/photo-1624244245044-3276904951c4?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
    category: 'fresh-produce',
    brand: 'Berry Farms',
    stock: 50,
    unit: 'pack',
    isOrganic: true,
    isFeatured: true,
    rating: 4.7,
    numReviews: 210,
    reviews: [],
  },
  {
    _id: '13',
    title: 'Almond Butter',
    slug: 'almond-butter',
    description: 'Creamy and smooth almond butter, perfect for toast or baking.',
    shortDescription: 'Creamy almond butter.',
    price: 12.49,
    images: ['https://images.unsplash.com/photo-1654747781271-a2b6992c7b52?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8QWxtb25kJTIwQnV0dGVyfGVufDB8fDB8fHww'],
    category: 'pantry',
    brand: 'Nutty Goodness',
    stock: 60,
    unit: 'jar',
    isOrganic: true,
    isFeatured: true,
    rating: 4.8,
    numReviews: 134,
    reviews: [],
  },
  {
    _id: '14',
    title: 'Organic Spinach',
    slug: 'organic-spinach',
    description: 'Fresh organic spinach, great for salads and smoothies.',
    shortDescription: 'Organic leafy spinach.',
    price: 4.49,
    images: ['https://images.unsplash.com/photo-1683536905403-ea18a3176d29?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
    category: 'fresh-produce',
    brand: 'Green Leaf',
    stock: 70,
    unit: 'bunch',
    isOrganic: true,
    isFeatured: true,
    rating: 4.6,
    numReviews: 89,
    reviews: [],
  },
  {
    _id: '15',
    title: 'Quinoa Premium',
    slug: 'quinoa-premium',
    description: 'High-quality premium quinoa, rich in protein and fiber.',
    shortDescription: 'Premium quinoa grains.',
    price: 9.99,
    images: ['https://images.unsplash.com/photo-1563139205-b6d0e303ad58?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
    category: 'pantry',
    brand: 'Healthy Grains',
    stock: 100,
    unit: 'bag',
    isOrganic: true,
    isFeatured: false,
    rating: 4.7,
    numReviews: 112,
    reviews: [],
  },
  {
    _id: '16',
    title: 'Dark Chocolate Bar',
    slug: 'dark-chocolate-bar',
    description: 'Rich dark chocolate with 70% cocoa content, perfect for snacking.',
    shortDescription: '70% cocoa dark chocolate.',
    price: 3.99,
    images: ['https://plus.unsplash.com/premium_photo-1670426501227-450cb0d92a16?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
    category: 'snacks',
    brand: 'Choco Bliss',
    stock: 200,
    unit: 'bar',
    isOrganic: false,
    isFeatured: true,
    rating: 4.9,
    numReviews: 245,
    reviews: [],
  },
  {
    _id: '17',
    title: 'Greek Feta Cheese',
    slug: 'greek-feta-cheese',
    description: 'Authentic Greek feta cheese, creamy and tangy.',
    shortDescription: 'Tangy Greek feta cheese.',
    price: 7.49,
    images: ['https://media.istockphoto.com/id/479222417/photo/feta-cubes.webp?s=1024x1024&w=is&k=20&c=dBVx3qn0hegH_gQpQzcgcNkCbWmGF6S60yTVe2NjJK4='],
    category: 'dairy-eggs',
    brand: 'Fromagerie Luxe',
    stock: 40,
    unit: 'block',
    isOrganic: false,
    isFeatured: true,
    rating: 4.8,
    numReviews: 167,
    reviews: [],
  }


  ];

  // Filtering logic
  const filterProducts = useCallback(() => {
    let filtered = demoProducts;

    if (filters.category) {
      filtered = filtered.filter((p) => p.category === filters.category);
    }
    if (filters.brand) {
      filtered = filtered.filter((p) => p.brand === filters.brand);
    }
    if (filters.isOrganic) {
      filtered = filtered.filter((p) => p.isOrganic);
    }
    if (filters.minPrice !== undefined) {
      filtered = filtered.filter((p) => p.price >= filters.minPrice!);
    }
    if (filters.maxPrice !== undefined) {
      filtered = filtered.filter((p) => p.price <= filters.maxPrice!);
    }
    if (filters.search) {
      filtered = filtered.filter((p) =>
        p.title.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Sorting
    switch (filters.sort) {
      case 'price-asc':
        filtered = filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered = filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered = filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered = filtered; // for demo, no date field
        break;
      case 'popular':
      default:
        filtered = filtered.sort((a, b) => b.numReviews - a.numReviews);
        break;
    }

    return filtered;
  }, [filters, demoProducts]);

  const [paginatedProducts, setPaginatedProducts] = useState<IProduct[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 6;

  // Update products whenever filters change
  useEffect(() => {
    const filtered = filterProducts();
    setTotalPages(Math.ceil(filtered.length / pageSize));
    const startIndex = (filters.page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    setPaginatedProducts(filtered.slice(startIndex, endIndex));
  }, [filters, filterProducts]);

  const handleFilterChange = (newFilters: any) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearAll = () => {
    setFilters({
      category: '',
      brand: '',
      minPrice: undefined,
      maxPrice: undefined,
      isOrganic: false,
      search: '',
      sort: 'popular',
      page: 1,
    });
  };

  const sortOptions = [
    { value: 'popular', label: 'Most Popular' },
    { value: 'newest', label: 'Newest' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
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
            {filterProducts().length} products found
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          <FilterSidebar
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearAll={handleClearAll}
            isOpen={showFilters}
            onClose={() => setShowFilters(false)}
          />

          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <button
                onClick={() => setShowFilters(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-secondary-200 rounded-xl hover:bg-secondary-50 transition-colors"
              >
                <SlidersHorizontal className="w-5 h-5" />
                Filters
              </button>

              <div className="flex items-center gap-4">
                <label className="text-secondary-600 text-sm hidden sm:block">Sort by:</label>
                <select
                  value={filters.sort}
                  onChange={(e) => handleFilterChange({ sort: e.target.value })}
                  className="px-4 py-2 bg-white border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-secondary-700"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                <div className="hidden sm:flex items-center bg-white border border-secondary-200 rounded-xl">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-l-xl transition-colors ${
                      viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-secondary-400 hover:text-secondary-600'
                    }`}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-r-xl transition-colors ${
                      viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'text-secondary-400 hover:text-secondary-600'
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
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
                    {filters.category}
                    <button onClick={() => handleFilterChange({ category: '' })}>
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                )}
                {filters.brand && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
                    {filters.brand}
                    <button onClick={() => handleFilterChange({ brand: '' })}>
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                )}
                {filters.isOrganic && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                    🌿 Organic
                    <button onClick={() => handleFilterChange({ isOrganic: false })}>
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                )}
                {(filters.minPrice || filters.maxPrice) && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-accent-100 text-accent-700 rounded-full text-sm">
                    ${filters.minPrice || 0} - ${filters.maxPrice || '∞'}
                    <button onClick={() => handleFilterChange({ minPrice: undefined, maxPrice: undefined })}>
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                )}
              </div>
            )}

            {/* Products Grid */}
            <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
              {paginatedProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-12 flex justify-center">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(filters.page - 1)}
                  disabled={filters.page === 1}
                  className="px-4 py-2 bg-white border border-secondary-200 rounded-lg text-secondary-600 hover:bg-secondary-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }).map((_, index) => (
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
                  className="px-4 py-2 bg-white border border-secondary-200 rounded-lg text-secondary-600 hover:bg-secondary-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-secondary-600">Loading products...</p>
        </div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}




