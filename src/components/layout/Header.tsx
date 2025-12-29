'use client';

import { useState, useEffect } from 'react';
import { Search, ShoppingBag, User, X, LogOut } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useCartStore } from '@/context/CartStore';
import { Menu } from 'lucide-react';

export default function Header() {
  const searchParams = useSearchParams();
  const { getItemCount, openCart } = useCartStore();

  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!mounted) return null;

  const isAuth = searchParams.get('signin') === 'true';
  const itemCount = getItemCount();

  const homeHref = isAuth ? '/?signin=true' : '/';
  const shopHref = isAuth ? '/products?signin=true' : '/products';

  const navigate = (href: string) => {
    window.location.href = href;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
      setIsMobileSearchOpen(false);
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all ${
        isScrolled ? 'bg-white/95 backdrop-blur shadow-md' : 'bg-white shadow-sm'
      }`}
    >
      {/* Top Bar */}
      <div className="bg-primary-600 text-white text-sm py-2 text-center">
        Free delivery on orders over $50 | Use code GOURMET10
      </div>

      <div className="max-w-7xl mx-auto px-4">
        {/* Top Row */}
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <button
            onClick={() => navigate(homeHref)}
            className="flex items-center gap-2"
          >
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">G</span>
            </div>
            <span className="hidden sm:block font-bold text-xl">GourmetHub</span>
          </button>

          {/* Desktop Search */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 mx-8 relative"
          >
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-xl focus:ring-2 focus:ring-primary-500"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </form>

          {/* Right Icons */}
          <div className="flex items-center gap-4">
            {/* Mobile search toggle */}
            <button
              onClick={() => {
                setIsMobileSearchOpen(!isMobileSearchOpen);
                setIsMobileMenuOpen(false);
              }}
              className="md:hidden p-2"
            >
              {isMobileSearchOpen ? <X /> : <Search />}
            </button>

            {/* Cart */}
            {isAuth && (
              <button onClick={openCart} className="relative p-2">
                <ShoppingBag />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </button>
            )}

            {/* Auth */}
            {isAuth ? (
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 p-2 text-red-600"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="flex items-center gap-2 p-2"
              >
                <User /> Sign In
              </button>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => {
                setIsMobileMenuOpen(!isMobileMenuOpen);
                setIsMobileSearchOpen(false);
              }}
              className="md:hidden p-2"
            >
              {isMobileMenuOpen ? <X /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        {isMobileSearchOpen && (
          <form
            onSubmit={handleSearch}
            className="md:hidden py-2 flex items-center"
          >
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="flex-1 pl-4 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-primary-500"
            />
            <button type="submit" className="ml-2 p-2 bg-primary-600 text-white rounded-xl">
              Search
            </button>
          </form>
        )}

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 py-4 border-t">
          <button onClick={() => navigate(homeHref)} className="nav-btn">
            Home
          </button>
          <button onClick={() => navigate(shopHref)} className="nav-btn">
            Shop
          </button>
          <button
            onClick={() => navigate(shopHref)}
            className="ml-auto text-orange-500 font-medium flex gap-1"
          >
            🔥 Hot Deals
          </button>
        </nav>

        {/* Mobile Nav */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t flex flex-col gap-2">
            <button onClick={() => navigate(homeHref)} className="py-2 px-4 text-left">
              Home
            </button>
            <button onClick={() => navigate(shopHref)} className="py-2 px-4 text-left">
              Shop
            </button>
            <button onClick={() => navigate(shopHref)} className="py-2 px-4 text-left text-orange-500">
              🔥 Hot Deals
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
