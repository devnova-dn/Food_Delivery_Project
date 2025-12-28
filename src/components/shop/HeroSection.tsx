'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles } from 'lucide-react';

interface HeroSlide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  ctaText: string;
  ctaLink: string;
  badge: string;
}

const heroSlides: HeroSlide[] = [
  {
    id: 1,
    title: 'Farm Fresh Goodness',
    subtitle: 'Premium Quality Products',
    description:
      'Discover the finest selection of organic produce, artisan foods, and gourmet ingredients delivered fresh to your doorstep.',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1920&q=80',
    ctaText: 'Shop Fresh Now',
    ctaLink: '/products?category=fresh-produce',
    badge: '🌿 100% Organic',
  },
  {
    id: 2,
    title: 'Gourmet Delights',
    subtitle: 'Chef\'s Choice Selection',
    description:
      'Explore our curated collection of premium ingredients trusted by professional chefs worldwide. Elevate your culinary creations.',
    image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=1920&q=80',
    ctaText: 'Explore Gourmet',
    ctaLink: '/products?category=international',
    badge: '👨‍🍳 Chef Approved',
  },
  {
    id: 3,
    title: 'Weekly Specials',
    subtitle: 'Up to 30% Off',
    description:
      'Don\'t miss our weekly deals on seasonal favorites. Fresh produce, artisan cheeses, and premium meats at unbeatable prices.',
    image: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=1920&q=80',
    ctaText: 'View Deals',
    ctaLink: '/products?featured=true',
    badge: '🔥 Hot Deal',
  },
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 6000);

    return () => clearInterval(timer);
  }, [currentSlide]);

  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const slide = heroSlides[currentSlide];

  return (
    <section className="relative overflow-hidden bg-secondary-900">
      <div className=" relative h-[70vh] min-h-[500px] max-h-[800px]">
        {/* Background Image */}
        <div
          className={`absolute inset-0 transition-opacity duration-700 ${
            isAnimating ? 'opacity-50' : 'opacity-100'
          }`}
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            className="object-cover"
            priority
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-secondary-900/95 via-secondary-900/70 to-secondary-900/30" />
        </div>

        {/* Slide Content */}
        <div className=" ml-16 relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
          <div
            className={`max-w-2xl transition-all duration-500 ${
              isAnimating
                ? 'opacity-0 translate-x-10'
                : 'opacity-100 translate-x-0'
            }`}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/20 
                          backdrop-blur-sm rounded-full text-primary-300 text-sm font-medium 
                          mb-6 animate-fade-in">
              <Sparkles className="w-4 h-4" />
              {slide.badge}
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white 
                         mb-4 leading-tight">
              {slide.title}
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-primary-200 font-medium mb-6">
              {slide.subtitle}
            </p>

            {/* Description */}
            <p className="text-secondary-300 text-lg mb-8 leading-relaxed max-w-lg">
              {slide.description}
            </p>

            {/* CTA Button */}
            <Link
              href={slide.ctaLink}
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary-500 text-white 
                       font-semibold rounded-xl hover:bg-primary-400 transition-all 
                       transform hover:scale-105 shadow-lg shadow-primary-500/25
                       group"
            >
              {slide.ctaText}
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 
                   backdrop-blur-sm rounded-full flex items-center justify-center 
                   text-white hover:bg-white/20 transition-colors hidden sm:flex"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 
                   backdrop-blur-sm rounded-full flex items-center justify-center 
                   text-white hover:bg-white/20 transition-colors hidden sm:flex"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Dots Navigation */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                if (!isAnimating) {
                  setIsAnimating(true);
                  setCurrentSlide(index);
                  setTimeout(() => setIsAnimating(false), 500);
                }
              }}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide
                  ? 'bg-primary-500 w-8'
                  : 'bg-white/50 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
