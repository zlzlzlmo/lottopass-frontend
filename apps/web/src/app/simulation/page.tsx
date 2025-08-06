import { Metadata } from 'next';
import { NumberSimulation } from '@/features/number-simulation';

export const metadata: Metadata = {
  title: 'AI 번호 시뮬레이션 | LottoPass',
  description: '다양한 AI 알고리즘으로 로또 번호를 예측하고 분석합니다.',
};

export default function SimulationPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <NumberSimulation />
    </div>
  );
}