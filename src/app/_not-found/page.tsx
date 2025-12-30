import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-secondary-50">
      <h1 className="text-6xl font-bold text-secondary-900 mb-4">404</h1>
      <p className="text-xl text-secondary-600 mb-6">Page Not Found</p>
      <Link href="/" className="btn-primary">
        Go Back Home
      </Link>
    </div>
  );
}
