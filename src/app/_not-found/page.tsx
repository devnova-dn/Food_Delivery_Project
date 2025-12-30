'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function NotFoundPage() {
  // Récupérer les params dans un client component
  const searchParams = useSearchParams();
  const signin = searchParams?.get('signin') === 'true';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-secondary-50">
      <h1 className="text-6xl font-bold text-secondary-900 mb-4">404</h1>
      <p className="text-xl text-secondary-600 mb-6">Page Not Found</p>
      <Link
        href={signin ? '/products?signin=true' : '/products'}
        className="px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
      >
        Go Back Home
      </Link>
    </div>
  );
}
