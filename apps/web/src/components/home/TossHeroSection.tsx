'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, TrendingUp, Gift, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export function TossHeroSection() {
  const router = useRouter();
  const [currentTime, setCurrentTime] = React.useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const stats = [
    { label: '누적 당첨금', value: '32.8조원', change: '+2.1%' },
    { label: '이번주 1등', value: '23.5억', change: '+15.3%' },
    { label: '당첨 확률', value: '1/8,145,060', change: null },
  ];

  const quickActions = [
    {
      icon: Sparkles,
      title: 'AI 번호 추천',
      description: '통계 기반 스마트 추천',
      color: 'bg-blue-500',
      href: '/number-generation',
    },
    {
      icon: TrendingUp,
      title: '당첨 통계',
      description: '역대 당첨 번호 분석',
      color: 'bg-green-500',
      href: '/statistics',
    },
    {
      icon: Gift,
      title: '이번주 예상',
      description: '1153회차 예측',
      color: 'bg-purple-500',
      href: '/prediction',
    },
  ];

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="px-4 pt-8 pb-12 md:pt-16 md:pb-20">
        <div className="container mx-auto max-w-6xl">
          {/* Main Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                로또의 모든 것
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              데이터로 분석하는 스마트한 로또 서비스
            </p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12"
          >
            {stats.map((stat, index) => (
              <div key={index} className="card-toss p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  {stat.change && (
                    <span className={`badge-toss ${
                      stat.change.startsWith('+') ? 'badge-success' : 'badge-danger'
                    }`}>
                      {stat.change}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push(action.href)}
                  className="card-toss p-6 text-left group hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl ${action.color} text-white`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                  </div>
                  <h3 className="font-semibold text-lg mb-1">{action.title}</h3>
                  <p className="text-sm text-muted-foreground">{action.description}</p>
                </motion.button>
              );
            })}
          </motion.div>

          {/* Live Timer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-12 text-center"
          >
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent/10 backdrop-blur-sm">
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium">
                다음 추첨까지 {getTimeUntilDraw(currentTime)}
              </span>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

function getTimeUntilDraw(currentTime: Date): string {
  const drawDay = 6; // Saturday
  const drawHour = 20;
  const drawMinute = 45;

  const now = new Date(currentTime);
  const nextDraw = new Date(currentTime);
  
  nextDraw.setDate(now.getDate() + ((drawDay - now.getDay() + 7) % 7 || 7));
  nextDraw.setHours(drawHour, drawMinute, 0, 0);

  if (nextDraw <= now) {
    nextDraw.setDate(nextDraw.getDate() + 7);
  }

  const diff = nextDraw.getTime() - now.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) {
    return `${days}일 ${hours}시간`;
  } else if (hours > 0) {
    return `${hours}시간 ${minutes}분`;
  } else {
    return `${minutes}분`;
  }
}