'use client';
import { useAuth } from './providers';
import Link from 'next/link';

export default function HomeCTA() {
  const { signin } = useAuth();

  return (
    <div className="py-16 text-center">
      <Link
        href={signin ? '/products?signin=true' : '/products'}
        className="btn-primary"
      >
        Shop Now
      </Link>
    </div>
  );
}
