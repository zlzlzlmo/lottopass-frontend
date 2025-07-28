import React, { useState, useTransition } from 'react';
import { Card, Button, Space, Tag, Typography, Tooltip, Radio, Checkbox, Slider } from 'antd';
import { BulbOutlined, LineChartOutlined, ReloadOutlined, DeleteOutlined } from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { useNumberGenerator } from '../hooks/useNumberGenerator';
import LottoBall from '@/components/common/number/LottoBall';
import { useActionState } from '@/hooks/useActionState';
import styles from './AdvancedNumberGenerator.module.scss';

const { Title, Text } = Typography;

interface GeneratorConfig {
  algorithm: 'random' | 'statistical' | 'ai';
  excludeNumbers: number[];
  mustInclude: number[];
  useConsecutiveLimit: boolean;
  consecutiveLimit: number;
  useOddEvenRatio: boolean;
  oddRatio: number;
}

const AdvancedNumberGenerator: React.FC = () => {
  const [isPending, startTransition] = useTransition();
  const { generateNumbers, history, clearHistory, validateNumbers } = useNumberGenerator();
  const { execute, loading } = useActionState();
  
  const [config, setConfig] = useState<GeneratorConfig>({
    algorithm: 'random',
    excludeNumbers: [],
    mustInclude: [],
    useConsecutiveLimit: false,
    consecutiveLimit: 2,
    useOddEvenRatio: false,
    oddRatio: 50,
  });

  const [currentNumbers, setCurrentNumbers] = useState<number[]>([]);

  const handleGenerate = async () => {
    const result = await execute(async () => {
      const options = {
        excludeNumbers: config.excludeNumbers,
        mustInclude: config.mustInclude,
        consecutiveLimit: config.useConsecutiveLimit ? config.consecutiveLimit : undefined,
        oddEvenRatio: config.useOddEvenRatio 
          ? { odd: config.oddRatio, even: 100 - config.oddRatio }
          : undefined,
      };

      const numbers = await generateNumbers(config.algorithm, options);
      
      startTransition(() => {
        setCurrentNumbers(numbers);
      });
      
      return numbers;
    });

    if (!result.success) {
      console.error('Failed to generate numbers');
    }
  };

  const handleNumberToggle = (num: number, type: 'exclude' | 'include') => {
    setConfig(prev => {
      const key = type === 'exclude' ? 'excludeNumbers' : 'mustInclude';
      const current = prev[key];
      
      if (current.includes(num)) {
        return { ...prev, [key]: current.filter(n => n !== num) };
      } else {
        // 제외와 포함은 동시에 불가능
        const otherKey = type === 'exclude' ? 'mustInclude' : 'excludeNumbers';
        return {
          ...prev,
          [key]: [...current, num],
          [otherKey]: prev[otherKey].filter(n => n !== num),
        };
      }
    });
  };

  const getNumberStatus = (num: number) => {
    if (config.excludeNumbers.includes(num)) return 'excluded';
    if (config.mustInclude.includes(num)) return 'included';
    return 'normal';
  };

  return (
    <div className={styles.container}>
      <Card className={styles.generatorCard}>
        <Title level={3}>
          <BulbOutlined /> AI 로또 번호 생성기
        </Title>
        
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {/* 알고리즘 선택 */}
          <div>
            <Text strong>생성 알고리즘</Text>
            <Radio.Group
              value={config.algorithm}
              onChange={e => setConfig(prev => ({ ...prev, algorithm: e.target.value }))}
              style={{ marginTop: 8, display: 'block' }}
            >
              <Space direction="vertical">
                <Radio value="random">
                  <Tooltip title="완전 무작위로 번호를 생성합니다">
                    무작위 생성
                  </Tooltip>
                </Radio>
                <Radio value="statistical">
                  <Tooltip title="과거 당첨 통계를 기반으로 번호를 생성합니다">
                    <LineChartOutlined /> 통계 기반 생성
                  </Tooltip>
                </Radio>
                <Radio value="ai">
                  <Tooltip title="황금비율, 피보나치 등 수학적 패턴을 활용합니다">
                    <BulbOutlined /> AI 패턴 생성
                  </Tooltip>
                </Radio>
              </Space>
            </Radio.Group>
          </div>

          {/* 번호 선택 그리드 */}
          <div>
            <Text strong>번호 선택 (클릭하여 포함/제외)</Text>
            <div className={styles.numberGrid}>
              {Array.from({ length: 45 }, (_, i) => i + 1).map(num => {
                const status = getNumberStatus(num);
                return (
                  <div
                    key={num}
                    className={`${styles.numberCell} ${styles[status]}`}
                    onClick={() => {
                      if (status === 'normal') {
                        handleNumberToggle(num, 'include');
                      } else if (status === 'included') {
                        handleNumberToggle(num, 'exclude');
                      } else {
                        handleNumberToggle(num, 'exclude');
                      }
                    }}
                  >
                    {num}
                  </div>
                );
              })}
            </div>
            <Space style={{ marginTop: 8 }}>
              <Tag color="green">포함: {config.mustInclude.length}개</Tag>
              <Tag color="red">제외: {config.excludeNumbers.length}개</Tag>
            </Space>
          </div>

          {/* 고급 옵션 */}
          <div>
            <Text strong>고급 옵션</Text>
            <Space direction="vertical" style={{ width: '100%', marginTop: 8 }}>
              <Checkbox
                checked={config.useConsecutiveLimit}
                onChange={e => setConfig(prev => ({ ...prev, useConsecutiveLimit: e.target.checked }))}
              >
                연속 번호 제한
              </Checkbox>
              {config.useConsecutiveLimit && (
                <Slider
                  min={1}
                  max={5}
                  value={config.consecutiveLimit}
                  onChange={value => setConfig(prev => ({ ...prev, consecutiveLimit: value }))}
                  marks={{ 1: '1개', 2: '2개', 3: '3개', 4: '4개', 5: '5개' }}
                />
              )}
              
              <Checkbox
                checked={config.useOddEvenRatio}
                onChange={e => setConfig(prev => ({ ...prev, useOddEvenRatio: e.target.checked }))}
              >
                홀/짝 비율 설정
              </Checkbox>
              {config.useOddEvenRatio && (
                <Slider
                  min={0}
                  max={100}
                  value={config.oddRatio}
                  onChange={value => setConfig(prev => ({ ...prev, oddRatio: value }))}
                  marks={{ 0: '짝수만', 50: '균등', 100: '홀수만' }}
                  tooltip={{ formatter: value => `홀수 ${value}%` }}
                />
              )}
            </Space>
          </div>

          {/* 생성 버튼 */}
          <Button
            type="primary"
            size="large"
            icon={<ReloadOutlined spin={loading || isPending} />}
            onClick={handleGenerate}
            loading={loading}
            block
          >
            번호 생성하기
          </Button>

          {/* 생성된 번호 표시 */}
          <AnimatePresence mode="wait">
            {currentNumbers.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className={styles.resultCard}>
                  <Title level={4}>생성된 번호</Title>
                  <Space size="large">
                    {currentNumbers.map((num, index) => (
                      <motion.div
                        key={`${num}-${index}`}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <LottoBall number={num} size="large" />
                      </motion.div>
                    ))}
                  </Space>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 생성 기록 */}
          {history.length > 0 && (
            <Card className={styles.historyCard}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Title level={4}>생성 기록</Title>
                <Button
                  size="small"
                  icon={<DeleteOutlined />}
                  onClick={clearHistory}
                  danger
                >
                  초기화
                </Button>
              </div>
              <Space direction="vertical" style={{ width: '100%' }}>
                {history.slice(-5).reverse().map(item => (
                  <div key={item.id} className={styles.historyItem}>
                    <Tag color={
                      item.algorithm === 'ai' ? 'purple' :
                      item.algorithm === 'statistical' ? 'blue' : 'default'
                    }>
                      {item.algorithm === 'ai' ? 'AI' :
                       item.algorithm === 'statistical' ? '통계' : '무작위'}
                    </Tag>
                    <Space>
                      {item.numbers.map(num => (
                        <LottoBall key={num} number={num} size="small" />
                      ))}
                    </Space>
                  </div>
                ))}
              </Space>
            </Card>
          )}
        </Space>
      </Card>
    </div>
  );
};

export default AdvancedNumberGenerator;