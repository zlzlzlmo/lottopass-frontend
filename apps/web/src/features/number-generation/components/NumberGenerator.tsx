'use client';

import React from 'react';
import { useNumberGenerator } from '../hooks';
import { GenerationMethodSelector } from './GenerationMethodSelector';
import { NumberDisplay } from './NumberDisplay';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, RotateCcw, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export function NumberGenerator() {
  const {
    isGenerating,
    generatedNumbers,
    selectedNumbers,
    config,
    generateNumbers,
    updateConfig,
    clearHistory,
  } = useNumberGenerator();

  const handleGenerate = async () => {
    await generateNumbers();
    toast.success('번호가 생성되었습니다!');
  };

  const handleSave = () => {
    // TODO: 저장 기능 구현
    toast.info('저장 기능은 곧 추가됩니다!');
  };

  return (
    <div className="space-y-6">
      {/* 생성 방법 선택 */}
      <Card>
        <CardHeader>
          <CardTitle>생성 방법 선택</CardTitle>
          <CardDescription>
            원하시는 번호 생성 방법을 선택해주세요
          </CardDescription>
        </CardHeader>
        <CardContent>
          <GenerationMethodSelector
            value={config.method}
            onChange={(method) => updateConfig({ method })}
          />
        </CardContent>
      </Card>

      {/* 번호 생성 버튼 */}
      <div className="flex justify-center">
        <Button
          size="lg"
          onClick={handleGenerate}
          disabled={isGenerating}
          className="gap-2"
        >
          {isGenerating ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="h-5 w-5" />
              </motion.div>
              생성 중...
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5" />
              번호 생성하기
            </>
          )}
        </Button>
      </div>

      {/* 생성된 번호 표시 */}
      <AnimatePresence mode="wait">
        {selectedNumbers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader className="text-center">
                <CardTitle>생성된 번호</CardTitle>
                <CardDescription>
                  {generatedNumbers[0]?.method && 
                    `${getMethodLabel(generatedNumbers[0].method)} 방식으로 생성됨`
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <NumberDisplay numbers={selectedNumbers} animated />
                
                {generatedNumbers[0]?.statistics && (
                  <div className="text-center text-sm text-muted-foreground space-y-1">
                    <p>합계: {generatedNumbers[0].statistics.sum}</p>
                    <p>
                      홀수 {generatedNumbers[0].statistics.oddCount}개, 
                      짝수 {generatedNumbers[0].statistics.evenCount}개
                    </p>
                  </div>
                )}

                <div className="flex justify-center gap-2">
                  <Button variant="outline" size="sm" onClick={handleGenerate}>
                    <RotateCcw className="h-4 w-4 mr-1" />
                    다시 생성
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleSave}>
                    <Save className="h-4 w-4 mr-1" />
                    저장하기
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 생성 기록 */}
      {generatedNumbers.length > 1 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>생성 기록</CardTitle>
              <CardDescription>최근 생성된 번호들</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={clearHistory}>
              <RotateCcw className="h-4 w-4 mr-1" />
              초기화
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {generatedNumbers.slice(1).map((result, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <NumberDisplay 
                    numbers={result.numbers} 
                    animated={false}
                    size="sm"
                  />
                  <span className="text-xs text-muted-foreground">
                    {getMethodLabel(result.method)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function getMethodLabel(method: string): string {
  const labels: Record<string, string> = {
    random: '완전 무작위',
    statistical: '통계 기반',
    evenOdd: '홀짝 균형',
    highLow: '고저 균형',
    pattern: '패턴 분석',
    consecutive: '연속 번호',
    ai: 'AI 추천',
  };
  return labels[method] || method;
}