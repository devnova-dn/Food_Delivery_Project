'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useCartStore } from '@/context/CartStore';
import { Search, ShoppingBag, User, Menu, X, LogOut, LayoutDashboard } from 'lucide-react';
 import { useSearchParams } from 'next/navigation';
export default function Header() {
    const searchParams = useSearchParams();
  const showCartButton = searchParams.get('signin') === 'true';
  const { data: session } = useSession();
  const { getItemCount, openCart, toggleCart } = useCartStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  const itemCount = mounted ? getItemCount() : 0;

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Shop' },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md'
          : 'bg-white shadow-sm'
      }`}
    >
      {/* Top bar */}
      <div className="bg-primary-600 text-white text-sm py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span>Free delivery on orders over $50 | Use code GOURMET10 for 10% off</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-primary-600 rounded-xl flex items-center justify-center 
                          group-hover:bg-primary-700 transition-colors">
              <span className="text-white font-display font-bold text-xl md:text-2xl">G</span>
            </div>
            <div className="hidden sm:block">
              <span className="font-display font-bold text-xl md:text-2xl text-secondary-900">
                GourmetHub
              </span>
              <p className="text-xs text-secondary-500 -mt-1">Premium Food Store</p>
            </div>
          </Link>

          {/* Search bar - Desktop */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-xl mx-8"
          >
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search for fresh produce, organic items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-secondary-50 border-0 rounded-xl 
                         focus:outline-none focus:ring-2 focus:ring-primary-500 
                         placeholder:text-secondary-400 transition-all"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
            </div>
          </form>

          {/* Right side icons */}
          <div className="flex items-center gap-4">
            {/* Mobile search button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 hover:bg-secondary-100 rounded-lg transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Search className="w-6 h-6" />
              )}
            </button>

            {/* Cart button */}
              {showCartButton && (
            <button
              onClick={openCart}
              className="  relative p-2 hover:bg-secondary-100 rounded-lg transition-colors"
            >
              <ShoppingBag className="w-6 h-6" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent-500 text-white 
                               text-xs font-bold rounded-full flex items-center justify-center">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </button>
              )}
            {/* User menu */}
           <div className="relative">
  {session || showCartButton ? (
    <>
      <button
      
        onClick={() => {window.location.href = '/'}}
        className="flex items-center gap-2 p-2 hover:bg-red-500 rounded-lg transition-colors"
      >
        <LogOut className="w-4 h-4" />
            Sign Out
      </button>

      
    </>
  ) : (
    <Link
      href="/login"
      className="flex items-center gap-2 p-2 hover:bg-secondary-100 rounded-lg transition-colors"
    >
      <User className="w-6 h-6" />
      <span className="hidden sm:block text-sm font-medium">Sign In</span>
    </Link>
  )}
</div>

          </div>
        </div>

        {/* Mobile search bar */}
        {isMobileMenuOpen && (
          <form onSubmit={handleSearch} className="md:hidden pb-4 animate-fade-in">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-secondary-50 border-0 rounded-xl 
                         focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
            </div>
          </form>
        )}

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 py-4 border-t border-secondary-100">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-secondary-600 hover:text-primary-600 font-medium 
                       transition-colors relative group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-600 
                            transition-all group-hover:w-full" />
            </Link>
          ))}
          <Link
            href="/products"
            className="ml-auto text-accent-500 hover:text-accent-600 font-medium 
                     transition-colors flex items-center gap-1"
          >
            <span>🔥</span> Hot Deals
          </Link>
        </nav>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-secondary-100 py-4 animate-fade-in">
          <nav className="flex flex-col gap-2 px-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-3 text-secondary-600 hover:text-primary-600 
                         hover:bg-secondary-50 rounded-lg transition-colors font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/products"
              className="px-4 py-3 text-accent-500 hover:bg-secondary-50 rounded-lg 
                       transition-colors font-medium flex items-center gap-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              🔥 Hot Deals
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
