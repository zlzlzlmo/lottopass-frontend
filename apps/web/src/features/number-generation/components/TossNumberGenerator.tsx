'use client';

import React from 'react';
import { useNumberGenerator } from '../hooks';
import { GenerationMethod } from '@lottopass/shared';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  BarChart3, 
  Binary, 
  ArrowUpDown, 
  Grid3x3, 
  Link2,
  Shuffle,
  Brain,
  RefreshCw,
  Download,
  Share2,
  Clock,
  Check
} from 'lucide-react';
import { LottoBall } from '@/components/ui/lotto-ball';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const generationMethods = [
  {
    id: 'random' as GenerationMethod,
    name: '완전 무작위',
    description: '순수 랜덤',
    icon: Shuffle,
    color: 'bg-blue-500',
  },
  {
    id: 'statistical' as GenerationMethod,
    name: '통계 분석',
    description: '빈도 기반',
    icon: BarChart3,
    color: 'bg-green-500',
  },
  {
    id: 'evenOdd' as GenerationMethod,
    name: '홀짝 균형',
    description: '홀/짝 비율',
    icon: Binary,
    color: 'bg-purple-500',
  },
  {
    id: 'highLow' as GenerationMethod,
    name: '고저 분포',
    description: '숫자 분포',
    icon: ArrowUpDown,
    color: 'bg-orange-500',
  },
  {
    id: 'pattern' as GenerationMethod,
    name: '패턴 분석',
    description: '규칙 기반',
    icon: Grid3x3,
    color: 'bg-pink-500',
  },
  {
    id: 'ai' as GenerationMethod,
    name: 'AI 추천',
    description: '인공지능',
    icon: Brain,
    color: 'bg-indigo-500',
  },
];

export function TossNumberGenerator() {
  const {
    isGenerating,
    generatedNumbers,
    selectedNumbers,
    config,
    generateNumbers,
    updateConfig,
    clearHistory,
  } = useNumberGenerator();

  const [selectedMethod, setSelectedMethod] = React.useState<GenerationMethod>('random');

  const handleGenerate = async () => {
    await generateNumbers(selectedMethod);
    toast.success('번호가 생성되었습니다!', {
      icon: <Check className="h-4 w-4" />,
    });
  };

  const handleShare = () => {
    if (selectedNumbers.length > 0) {
      const text = `로또 번호: ${selectedNumbers.join(', ')}`;
      if (navigator.share) {
        navigator.share({ text });
      } else {
        navigator.clipboard.writeText(text);
        toast.success('클립보드에 복사되었습니다!');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Method Selection */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">생성 방법 선택</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {generationMethods.map((method) => {
            const Icon = method.icon;
            const isSelected = selectedMethod === method.id;
            const isDisabled = method.id === 'ai';
            
            return (
              <motion.button
                key={method.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => !isDisabled && setSelectedMethod(method.id)}
                disabled={isDisabled}
                className={cn(
                  'card-toss p-4 relative overflow-hidden transition-all duration-300',
                  isSelected && 'ring-2 ring-primary ring-offset-2',
                  isDisabled && 'opacity-50 cursor-not-allowed'
                )}
              >
                {isSelected && (
                  <motion.div
                    layoutId="methodSelector"
                    className="absolute inset-0 bg-primary/5"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <div className="relative z-10 flex items-start gap-3">
                  <div className={cn('p-2 rounded-lg text-white', method.color)}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-sm">{method.name}</p>
                    <p className="text-xs text-muted-foreground">{method.description}</p>
                  </div>
                </div>
                {isDisabled && (
                  <span className="absolute top-2 right-2 text-xs badge-toss badge-warning">
                    준비중
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>
      </section>

      {/* Generate Button */}
      <div className="flex justify-center py-8">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleGenerate}
          disabled={isGenerating}
          className="btn-primary flex items-center gap-2 px-8 py-4 text-lg"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="h-5 w-5 animate-spin" />
              생성 중...
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5" />
              번호 생성하기
            </>
          )}
        </motion.button>
      </div>

      {/* Generated Numbers */}
      <AnimatePresence mode="wait">
        {selectedNumbers.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Current Numbers */}
            <div className="card-toss p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">생성된 번호</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleShare}
                    className="p-2 rounded-lg hover:bg-accent/10 transition-colors"
                    aria-label="Share"
                  >
                    <Share2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={handleGenerate}
                    className="p-2 rounded-lg hover:bg-accent/10 transition-colors"
                    aria-label="Regenerate"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="flex justify-center gap-2">
                {selectedNumbers.map((number, index) => (
                  <motion.div
                    key={`${number}-${index}`}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                      type: 'spring',
                      stiffness: 200,
                      damping: 20,
                      delay: index * 0.1,
                    }}
                  >
                    <LottoBall number={number} size="lg" />
                  </motion.div>
                ))}
              </div>

              {generatedNumbers[0]?.statistics && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{generatedNumbers[0].statistics.sum}</p>
                    <p className="text-xs text-muted-foreground">합계</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">
                      {generatedNumbers[0].statistics.oddCount}:{generatedNumbers[0].statistics.evenCount}
                    </p>
                    <p className="text-xs text-muted-foreground">홀:짝</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">
                      {generatedNumbers[0].statistics.highCount}:{generatedNumbers[0].statistics.lowCount}
                    </p>
                    <p className="text-xs text-muted-foreground">고:저</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{generatedNumbers[0].statistics.consecutivePairs}</p>
                    <p className="text-xs text-muted-foreground">연속</p>
                  </div>
                </div>
              )}
            </div>

            {/* History */}
            {generatedNumbers.length > 1 && (
              <div className="card-toss p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">생성 기록</h3>
                  <button
                    onClick={clearHistory}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    전체 삭제
                  </button>
                </div>
                
                <div className="space-y-3">
                  {generatedNumbers.slice(1, 6).map((result, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="list-item-toss flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <div className="flex gap-1">
                          {result.numbers.map((num, idx) => (
                            <LottoBall key={idx} number={num} size="sm" />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {generationMethods.find(m => m.id === result.method)?.name}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}