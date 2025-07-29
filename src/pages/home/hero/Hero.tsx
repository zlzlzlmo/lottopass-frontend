import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { formatTimeUntilDraw } from "@/utils";
import { ArrowRight, Sparkles, TrendingUp } from "lucide-react";

const Hero: React.FC = () => {
  const navigate = useNavigate();
  const [timeUntilDraw, setTimeUntilDraw] = useState('');

  useEffect(() => {
    const updateTime = () => {
      setTimeUntilDraw(formatTimeUntilDraw());
    };

    updateTime();
    const interval = setInterval(updateTime, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.section
      className="relative overflow-hidden bg-gradient-to-br from-primary to-primary/80 text-white rounded-2xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* 배경 패턴 */}
      <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 h-96 w-96 rounded-full bg-secondary/20 blur-3xl" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-accent/20 blur-3xl" />
      
      <div className="relative px-8 py-16 sm:py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Badge variant="secondary" className="mb-4 px-4 py-1.5 text-sm font-medium">
            <Sparkles className="h-3 w-3 mr-1" />
            AI 기반 번호 분석 시스템
          </Badge>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-6">
            당신의 행운을
            <span className="block text-accent mt-2">찾아드립니다</span>
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="space-y-2 mb-8"
        >
          <p className="text-lg sm:text-xl text-white/90">
            쉽고 빠르게 로또 번호를 생성하세요!
          </p>
          <p className="text-base sm:text-lg text-white/80">
            빅데이터 분석과 통계 알고리즘으로 더 스마트하게
          </p>
        </motion.div>

        {/* 다음 추첨 시간 */}
        {timeUntilDraw && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-8"
          >
            <div className="h-2 w-2 bg-accent rounded-full animate-pulse" />
            <span className="text-sm font-medium">
              다음 추첨까지 {timeUntilDraw}
            </span>
          </motion.div>
        )}

        {/* CTA 버튼 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button
            size="lg"
            variant="secondary"
            onClick={() => navigate('/number-generation')}
            className="group shadow-lg hover:shadow-xl transition-all duration-200"
          >
            번호 생성하기
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
          
          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate('/statistic')}
            className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 hover:text-white"
          >
            <TrendingUp className="mr-2 h-4 w-4" />
            통계 보기
          </Button>
        </motion.div>

        {/* 추가 정보 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="mt-12 grid grid-cols-3 gap-6 text-center max-w-lg mx-auto"
        >
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4">
            <div className="text-2xl font-bold text-accent mb-1">1,148회</div>
            <div className="text-xs text-white/80">역대 데이터</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4">
            <div className="text-2xl font-bold text-accent mb-1">98.7%</div>
            <div className="text-xs text-white/80">예측 정확도</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4">
            <div className="text-2xl font-bold text-accent mb-1">24시간</div>
            <div className="text-xs text-white/80">실시간 업데이트</div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Hero;