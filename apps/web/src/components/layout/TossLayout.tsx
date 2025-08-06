'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, TrendingUp, Search, User, Menu, Sun, Moon, Store, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';

interface TossLayoutProps {
  children: React.ReactNode;
}

export function TossLayout({ children }: TossLayoutProps) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navigation = [
    { name: '홈', href: '/', icon: Home },
    { name: '번호생성', href: '/number-generation', icon: Search },
    { name: '시뮬레이션', href: '/simulation', icon: Sparkles },
    { name: '통계', href: '/statistics', icon: TrendingUp },
    { name: '판매점', href: '/winning-stores', icon: Store },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Navigation */}
      <header className="hidden md:block sticky top-0 z-40 w-full bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">L</span>
              </div>
              <span className="font-bold text-xl">LottoPass</span>
            </Link>

            {/* Navigation */}
            <nav className="flex items-center space-x-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'nav-item',
                    pathname === item.href && 'nav-item-active'
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg hover:bg-accent/10 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="md:hidden sticky top-0 z-40 w-full bg-background/80 backdrop-blur-md border-b border-border safe-area-top">
        <div className="flex items-center justify-between h-14 px-4">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">L</span>
            </div>
            <span className="font-bold text-lg">LottoPass</span>
          </Link>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg hover:bg-accent/10 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-accent/10 transition-colors"
              aria-label="Toggle menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu */}
      <div
        className={cn(
          'md:hidden fixed right-0 top-0 h-full w-3/4 max-w-sm bg-background shadow-lg z-50 transform transition-transform duration-300 safe-area-top',
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="p-4">
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="mb-8 p-2 rounded-lg hover:bg-accent/10 transition-colors ml-auto block"
            aria-label="Close menu"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <nav className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-xl transition-colors',
                    pathname === item.href
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-accent/10'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 pb-20 md:pb-0">
        <div className="animate-fade-in">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border safe-area-bottom">
        <div className="grid grid-cols-5 h-16">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex flex-col items-center justify-center gap-1 transition-colors',
                  isActive ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs font-medium">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}