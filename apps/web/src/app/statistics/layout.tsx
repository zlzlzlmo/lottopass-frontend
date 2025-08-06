import { TossLayout } from '@/components/layout/TossLayout';

export default function StatisticsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <TossLayout>{children}</TossLayout>;
}