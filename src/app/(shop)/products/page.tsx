import { Suspense } from 'react';
import ProductsClient from './ProductsClient';

export const dynamic = 'force-dynamic';

export default function Page() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full mx-auto mb-4 animate-spin" />
          <p className="text-secondary-600">Loading products...</p>
        </div>
      </div>
    }>
      <ProductsClient />
    </Suspense>
  );
}
