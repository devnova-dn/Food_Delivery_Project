'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import { categories, brands } from '@/lib/utils';

interface FilterSidebarProps {
  filters: {
    category: string;
    brand: string;
    minPrice: number;
    maxPrice: number;
    isOrganic: boolean;
  };
  onFilterChange: (filters: any) => void;
  onClearAll: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function FilterSidebar({
  filters,
  onFilterChange,
  onClearAll,
  isOpen,
  onClose,
}: FilterSidebarProps) {
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    brand: true,
    price: true,
    organic: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleCategoryChange = (categoryId: string) => {
    onFilterChange({
      ...filters,
      category: filters.category === categoryId ? '' : categoryId,
    });
  };

  const handleBrandChange = (brand: string) => {
    onFilterChange({
      ...filters,
      brand: filters.brand === brand ? '' : brand,
    });
  };

  const handlePriceChange = (type: 'min' | 'max', value: string) => {
    const numValue = value === '' ? undefined : parseFloat(value);
    onFilterChange({
      ...filters,
      [type === 'min' ? 'minPrice' : 'maxPrice']: numValue,
    });
  };

  const activeFiltersCount = [
    filters.category,
    filters.brand,
    filters.isOrganic,
    filters.minPrice !== undefined,
    filters.maxPrice !== undefined,
  ].filter(Boolean).length;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-72 bg-white lg:bg-transparent 
                   transform transition-transform duration-300 ease-in-out 
                   lg:transform-none overflow-y-auto lg:overflow-visible
                   ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 lg:hidden border-b border-secondary-100">
          <h2 className="text-xl font-display font-bold text-secondary-900">Filters</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Content */}
        <div className="p-4 lg:p-0 space-y-6">
          {/* Clear All */}
          {activeFiltersCount > 0 && (
            <button
              onClick={onClearAll}
              className="w-full py-2 text-primary-600 font-medium hover:bg-primary-50 
                       rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <X className="w-4 h-4" />
              Clear All Filters ({activeFiltersCount})
            </button>
          )}

          {/* Categories */}
          <div className="bg-white lg:rounded-xl lg:shadow-md lg:p-4">
            <button
              onClick={() => toggleSection('categories')}
              className="flex items-center justify-between w-full py-2 text-left"
            >
              <h3 className="font-semibold text-secondary-900">Categories</h3>
              {expandedSections.categories ? (
                <ChevronUp className="w-5 h-5 text-secondary-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-secondary-400" />
              )}
            </button>
            {expandedSections.categories && (
              <div className="space-y-2 mt-3">
                {categories.map((category) => (
                  <label
                    key={category.id}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <input
                      type="radio"
                      checked={filters.category === category.id}
                      onChange={() => handleCategoryChange(category.id)}
                      className="w-4 h-4 text-primary-600 border-secondary-300 
                               focus:ring-primary-500"
                    />
                    <span className="text-secondary-600 group-hover:text-secondary-900 
                                   transition-colors">
                      {category.name}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Brand */}
          <div className="bg-white lg:rounded-xl lg:shadow-md lg:p-4">
            <button
              onClick={() => toggleSection('brand')}
              className="flex items-center justify-between w-full py-2 text-left"
            >
              <h3 className="font-semibold text-secondary-900">Brand</h3>
              {expandedSections.brand ? (
                <ChevronUp className="w-5 h-5 text-secondary-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-secondary-400" />
              )}
            </button>
            {expandedSections.brand && (
              <div className="space-y-2 mt-3 max-h-48 overflow-y-auto">
                {brands.map((brand) => (
                  <label
                    key={brand}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <input
                      type="radio"
                      checked={filters.brand === brand}
                      onChange={() => handleBrandChange(brand)}
                      className="w-4 h-4 text-primary-600 border-secondary-300 
                               focus:ring-primary-500"
                    />
                    <span className="text-secondary-600 group-hover:text-secondary-900 
                                   transition-colors">
                      {brand}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Price Range */}
          <div className="bg-white lg:rounded-xl lg:shadow-md lg:p-4">
            <button
              onClick={() => toggleSection('price')}
              className="flex items-center justify-between w-full py-2 text-left"
            >
              <h3 className="font-semibold text-secondary-900">Price Range</h3>
              {expandedSections.price ? (
                <ChevronUp className="w-5 h-5 text-secondary-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-secondary-400" />
              )}
            </button>
            {expandedSections.price && (
              <div className="space-y-4 mt-3">
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <label className="text-xs text-secondary-500 mb-1 block">Min</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={filters.minPrice || ''}
                      onChange={(e) => handlePriceChange('min', e.target.value)}
                      className="w-full px-3 py-2 border border-secondary-200 rounded-lg 
                               focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <span className="text-secondary-400 mt-4">-</span>
                  <div className="flex-1">
                    <label className="text-xs text-secondary-500 mb-1 block">Max</label>
                    <input
                      type="number"
                      placeholder="1000"
                      value={filters.maxPrice || ''}
                      onChange={(e) => handlePriceChange('max', e.target.value)}
                      className="w-full px-3 py-2 border border-secondary-200 rounded-lg 
                               focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Organic Toggle */}
          <div className="bg-white lg:rounded-xl lg:shadow-md lg:p-4">
            <button
              onClick={() => toggleSection('organic')}
              className="flex items-center justify-between w-full py-2 text-left"
            >
              <h3 className="font-semibold text-secondary-900">Special</h3>
              {expandedSections.organic ? (
                <ChevronUp className="w-5 h-5 text-secondary-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-secondary-400" />
              )}
            </button>
            {expandedSections.organic && (
              <div className="mt-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.isOrganic}
                    onChange={(e) =>
                      onFilterChange({ ...filters, isOrganic: e.target.checked })
                    }
                    className="w-4 h-4 text-primary-600 border-secondary-300 
                             rounded focus:ring-primary-500"
                  />
                  <span className="text-secondary-700">
                    🌿 Organic Products Only
                  </span>
                </label>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
