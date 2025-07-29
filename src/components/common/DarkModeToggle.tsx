import React from 'react';
import { Button } from 'antd';
import { MoonOutlined, SunOutlined } from '@ant-design/icons';
import { useDarkMode } from '@/hooks/useDarkMode';

interface DarkModeToggleProps {
  showLabel?: boolean;
  className?: string;
}

export const DarkModeToggle: React.FC<DarkModeToggleProps> = ({ 
  showLabel = false,
  className = ''
}) => {
  const { theme, toggleTheme } = useDarkMode();
  const isDark = theme === 'dark';

  return (
    <Button
      type="text"
      icon={isDark ? <SunOutlined /> : <MoonOutlined />}
      onClick={toggleTheme}
      className={className}
      aria-label={isDark ? '라이트 모드로 전환' : '다크 모드로 전환'}
    >
      {showLabel && (isDark ? '라이트 모드' : '다크 모드')}
    </Button>
  );
};