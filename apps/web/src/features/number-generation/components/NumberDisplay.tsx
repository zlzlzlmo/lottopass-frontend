'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { LottoBall } from '@/components/ui/lotto-ball';

interface NumberDisplayProps {
  numbers: number[];
  className?: string;
  animated?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function NumberDisplay({ numbers, className, animated = true, size = 'md' }: NumberDisplayProps) {

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <motion.div
      className={cn('flex gap-2 justify-center flex-wrap', className)}
      variants={animated ? container : undefined}
      initial={animated ? "hidden" : undefined}
      animate={animated ? "show" : undefined}
    >
      {numbers.map((number, index) => (
        <motion.div
          key={`${number}-${index}`}
          variants={animated ? item : undefined}
        >
          <LottoBall number={number} size={size} />
        </motion.div>
      ))}
    </motion.div>
  );
}