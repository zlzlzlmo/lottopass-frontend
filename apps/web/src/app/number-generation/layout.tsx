import { TossLayout } from '@/components/layout/TossLayout';

export default function NumberGenerationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <TossLayout>{children}</TossLayout>;
}