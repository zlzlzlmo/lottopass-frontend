import dynamic from 'next/dynamic';
import { ComponentType } from 'react';

// Lazy load heavy components
export const FeatureCards = dynamic(
  () => import('./FeatureCards').then(mod => ({ default: mod.FeatureCards })),
  { 
    loading: () => <div className="animate-pulse h-64 bg-gray-100 rounded-lg" />,
    ssr: true 
  }
);

export const LatestDrawSection = dynamic(
  () => import('./LatestDrawSection').then(mod => ({ default: mod.LatestDrawSection })),
  { 
    loading: () => <div className="animate-pulse h-32 bg-gray-100 rounded-lg" />,
    ssr: true 
  }
);

export const QuickNumberGeneration = dynamic(
  () => import('./QuickNumberGeneration').then(mod => ({ default: mod.QuickNumberGeneration })),
  { 
    loading: () => <div className="animate-pulse h-48 bg-gray-100 rounded-lg" />,
    ssr: false // Client-side only component
  }
);