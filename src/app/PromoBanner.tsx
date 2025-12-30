'use client';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';

export default function PromoBanner() {
  const searchParams = useSearchParams();
  const signin = searchParams?.get('signin') === 'true';

  return (
    <div className="relative rounded-3xl overflow-hidden bg-secondary-900">
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1920&q=80"
          alt="Special offer"
          fill
          className="object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary-900/90 via-secondary-900/70 to-transparent" />
      </div>
      <div className="relative py-16 px-8 md:py-20 md:px-16">
        <div className="max-w-xl">
          <span className="inline-block px-4 py-2 bg-accent-500 text-white font-semibold rounded-full text-sm mb-4">
            Limited Time Offer
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
            Get 20% Off Your First Order
          </h2>
          <p className="text-secondary-300 text-lg mb-8">
            Use code <span className="text-accent-400 font-bold">GOURMET20</span> at checkout.
          </p>
          <Link
            href={signin ? '/products?signin=true' : '/products'}
            className="btn-primary"
          >
            Shop Now
          </Link>
        </div>
      </div>
    </div>
  );
}
