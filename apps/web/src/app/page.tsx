import { Suspense } from 'react';
import { Stack, YStack, XStack } from '@lottopass/ui';
import { HeroSection } from '@/components/home/HeroSection';
import { FeatureCards } from '@/components/home/FeatureCards';
import { LatestDrawSection } from '@/components/home/LatestDrawSection';
import { QuickNumberGeneration } from '@/components/home/QuickNumberGeneration';

export default function HomePage() {
  return (
    <YStack flex={1} backgroundColor="$background">
      <HeroSection />
      
      <Stack paddingHorizontal="$4" paddingVertical="$8" maxWidth={1200} marginHorizontal="auto" width="100%">
        <YStack gap="$8">
          <Suspense fallback={<Stack height={200} />}>
            <LatestDrawSection />
          </Suspense>
          
          <QuickNumberGeneration />
          
          <FeatureCards />
        </YStack>
      </Stack>
    </YStack>
  );
}