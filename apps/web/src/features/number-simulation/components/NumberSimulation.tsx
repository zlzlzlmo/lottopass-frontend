'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOptimizedNumberSimulation } from '../hooks/useOptimizedNumberSimulation';
import { SimulationConfig } from '../types';
import { SimulationMethodSelector } from './SimulationMethodSelector';
import { SimulationResults } from './SimulationResults';
import { SimulationProgress } from './SimulationProgress';
import { SimulationStatistics } from './SimulationStatistics';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Settings,
  BarChart3,
  History,
  Sparkles
} from 'lucide-react';

export const NumberSimulation: React.FC = () => {
  const {
    isSimulating,
    isLoadingHistoricalData,
    loadingProgress,
    currentBatch,
    history,
    selectedResult,
    config,
    statistics,
    progress,
    isRunning,
    hasHistoricalData,
    canRunSimulation,
    runSimulation,
    runMultiMethodSimulation,
    cancelSimulation,
    selectResult,
    clearHistory,
    updateConfig
  } = useOptimizedNumberSimulation();
  
  const [activeTab, setActiveTab] = useState<'single' | 'multi' | 'history'>('single');
  const [showSettings, setShowSettings] = useState(false);
  
  const handleRunSimulation = async () => {
    if (activeTab === 'single') {
      await runSimulation();
    } else if (activeTab === 'multi') {
      const methods: SimulationConfig['method'][] = [
        'historical',
        'frequency',
        'pattern',
        'aiPrediction',
        'monteCarlo',
        'markovChain'
      ];
      await runMultiMethodSimulation(methods, 50);
    }
  };
  
  if (isLoadingHistoricalData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <div>
            <p className="text-lg font-medium">과거 데이터 로딩 중...</p>
            {loadingProgress.total > 0 && (
              <div className="mt-2">
                <p className="text-sm text-muted-foreground">
                  {loadingProgress.loaded} / {loadingProgress.total} 회차 완료
                </p>
                <div className="w-64 h-2 bg-secondary rounded-full mt-2 overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${(loadingProgress.loaded / loadingProgress.total) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
  
  if (!hasHistoricalData) {
    return (
      <Card className="p-8">
        <div className="text-center">
          <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">데이터 없음</h3>
          <p className="text-muted-foreground">
            시뮬레이션을 실행하려면 과거 당첨 데이터가 필요합니다.
          </p>
        </div>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            AI 번호 시뮬레이션
          </h2>
          <p className="text-muted-foreground mt-1">
            다양한 알고리즘으로 로또 번호를 예측하고 분석합니다
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings className="h-4 w-4 mr-1" />
            설정
          </Button>
          
          {history.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearHistory}
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              초기화
            </Button>
          )}
        </div>
      </div>
      
      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="p-4">
              <SimulationMethodSelector
                config={config}
                onConfigChange={updateConfig}
              />
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="single">단일 시뮬레이션</TabsTrigger>
          <TabsTrigger value="multi">멀티 시뮬레이션</TabsTrigger>
          <TabsTrigger value="history">
            <History className="h-4 w-4 mr-1" />
            기록 ({history.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="single" className="space-y-4">
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">
                    {config.method === 'historical' && '과거 데이터 분석'}
                    {config.method === 'frequency' && '빈도 분석'}
                    {config.method === 'pattern' && '패턴 분석'}
                    {config.method === 'aiPrediction' && 'AI 예측'}
                    {config.method === 'monteCarlo' && '몬테카를로 시뮬레이션'}
                    {config.method === 'markovChain' && '마르코프 체인'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {config.rounds}회 시뮬레이션 실행
                  </p>
                </div>
                
                <Button
                  size="lg"
                  disabled={!canRunSimulation}
                  onClick={isRunning ? cancelSimulation : handleRunSimulation}
                >
                  {isRunning ? (
                    <>
                      <Pause className="h-4 w-4 mr-2" />
                      중지
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      시작
                    </>
                  )}
                </Button>
              </div>
              
              {isRunning && (
                <SimulationProgress
                  progress={progress}
                  currentBatch={currentBatch}
                />
              )}
              
              {currentBatch && currentBatch.status === 'completed' && (
                <SimulationResults
                  batch={currentBatch}
                  onSelectResult={selectResult}
                  selectedResult={selectedResult}
                />
              )}
            </div>
          </Card>
          
          {statistics && (
            <SimulationStatistics statistics={statistics} />
          )}
        </TabsContent>
        
        <TabsContent value="multi" className="space-y-4">
          <Card className="p-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">멀티 알고리즘 시뮬레이션</h3>
                <p className="text-sm text-muted-foreground">
                  모든 알고리즘을 동시에 실행하여 최적의 결과를 찾습니다
                </p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {['historical', 'frequency', 'pattern', 'aiPrediction', 'monteCarlo', 'markovChain'].map((method) => (
                  <div
                    key={method}
                    className="flex items-center gap-2 p-3 border rounded-lg"
                  >
                    <div className={`h-2 w-2 rounded-full ${
                      currentBatch?.config.method === method && isRunning 
                        ? 'bg-green-500 animate-pulse' 
                        : 'bg-gray-300'
                    }`} />
                    <span className="text-sm">
                      {method === 'historical' && '과거 데이터'}
                      {method === 'frequency' && '빈도 분석'}
                      {method === 'pattern' && '패턴 분석'}
                      {method === 'aiPrediction' && 'AI 예측'}
                      {method === 'monteCarlo' && '몬테카를로'}
                      {method === 'markovChain' && '마르코프'}
                    </span>
                  </div>
                ))}
              </div>
              
              <Button
                size="lg"
                className="w-full"
                disabled={!canRunSimulation}
                onClick={handleRunSimulation}
              >
                {isRunning ? (
                  <>
                    <Pause className="h-4 w-4 mr-2" />
                    중지
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    전체 시뮬레이션 시작
                  </>
                )}
              </Button>
              
              {isRunning && (
                <SimulationProgress
                  progress={progress}
                  currentBatch={currentBatch}
                />
              )}
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="history" className="space-y-4">
          {history.length === 0 ? (
            <Card className="p-8">
              <div className="text-center">
                <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">기록 없음</h3>
                <p className="text-muted-foreground">
                  시뮬레이션을 실행하면 여기에 기록이 표시됩니다.
                </p>
              </div>
            </Card>
          ) : (
            history.map((batch) => (
              <Card key={batch.id} className="p-4">
                <SimulationResults
                  batch={batch}
                  onSelectResult={selectResult}
                  selectedResult={selectedResult}
                  compact
                />
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};