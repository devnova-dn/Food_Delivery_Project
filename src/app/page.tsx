import HeroSection from '../components/shop/HeroSection';
import HomeCTA from './HomeCTA';
import { getFeaturedProducts } from '@/actions/product';
import ProductCard from '@/components/shop/ProductCard';
import DemoProductCard from '../components/shop/DemoProductCard';

export default async function HomePage() {
  const featuredResult = await getFeaturedProducts(8);
  const featuredProducts = Array.isArray(featuredResult.data)
    ? featuredResult.data
    : [];

  return (
    <div>
      <HeroSection />

      {/* Client component li katsayml useAuth */}
      <HomeCTA />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {featuredProducts.length > 0
          ? featuredProducts.map((p) => <ProductCard key={p._id} product={p} />)
          : Array.from({ length: 8 }).map((_, i) => <DemoProductCard key={i} index={i} />)}
      </div>
    </div>
  );
}
