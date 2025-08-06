import { Suspense } from 'react';

export default function SimulationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">시뮬레이션 로딩 중...</p>
          </div>
        </div>
      }
    >
      {children}
    </Suspense>
  );
}