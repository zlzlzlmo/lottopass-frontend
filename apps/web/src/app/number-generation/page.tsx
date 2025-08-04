import { NumberGenerator } from '@/features/number-generation';

export default function NumberGenerationPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">로또 번호 생성</h1>
          <p className="text-muted-foreground">
            다양한 방법으로 당신만의 행운 번호를 만들어보세요
          </p>
        </div>
        
        <NumberGenerator />
      </div>
    </div>
  );
}