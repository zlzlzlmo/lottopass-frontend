import { Loader2 } from 'lucide-react';
import { Suspense } from 'react';

import { HeroSection } from '@/components/home/HeroSection';
import {
  FeatureCards,
  LatestDrawSection,
  QuickNumberGeneration,
} from '@/components/home/LazyComponents';

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      <HeroSection />

      <Suspense fallback={<LoadingFallback />}>
        <LatestDrawSection />
      </Suspense>

      <QuickNumberGeneration />

      <FeatureCards />
    </main>
  );
}
