import React from 'react';

type ComponentImport<T = any> = () => Promise<{ default: React.ComponentType<T> }>;

interface RetryOptions {
  maxRetries?: number;
  retryDelay?: number;
}

/**
 * 동적 임포트 실패 시 재시도 로직을 포함한 lazy loading
 * 네트워크 문제나 청크 로딩 실패 시 자동 재시도
 */
export function lazyWithRetry<T extends React.ComponentType<any>>(
  componentImport: ComponentImport<T>,
  options: RetryOptions = {}
): React.LazyExoticComponent<T> {
  const { maxRetries = 3, retryDelay = 1000 } = options;
  
  return React.lazy(async () => {
    let lastError: Error | null = null;
    
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await componentImport();
      } catch (error) {
        lastError = error as Error;
        console.warn(`Failed to load component (attempt ${i + 1}/${maxRetries}):`, error);
        
        if (i < maxRetries - 1) {
          // 재시도 전 대기
          await new Promise(resolve => setTimeout(resolve, retryDelay * (i + 1)));
          
          // 브라우저 캐시 무효화를 위한 페이지 새로고침 (마지막 시도에서만)
          if (i === maxRetries - 2) {
            window.location.reload();
          }
        }
      }
    }
    
    // 모든 재시도 실패 시 에러 throw
    throw lastError || new Error('Failed to load component after multiple retries');
  });
}

/**
 * 프리로드 가능한 lazy 컴포넌트 생성
 */
export function lazyWithPreload<T extends React.ComponentType<any>>(
  factory: ComponentImport<T>
) {
  let componentPromise: Promise<{ default: T }> | null = null;
  
  const load = () => {
    if (!componentPromise) {
      componentPromise = factory();
    }
    return componentPromise;
  };
  
  const Component = React.lazy(load);
  
  // 프리로드 메서드 추가
  (Component as any).preload = load;
  
  return Component as React.LazyExoticComponent<T> & { preload: () => Promise<{ default: T }> };
}

/**
 * 조건부 동적 임포트
 */
export function lazyIf<T extends React.ComponentType<any>>(
  condition: boolean | (() => boolean),
  factory: ComponentImport<T>,
  fallback?: T
): React.ComponentType<React.ComponentProps<T>> {
  const shouldLoad = typeof condition === 'function' ? condition() : condition;
  
  if (!shouldLoad && fallback) {
    return fallback;
  }
  
  return React.lazy(factory);
}

/**
 * 지연 로딩을 위한 Intersection Observer 기반 컴포넌트
 */
interface LazyLoadProps {
  children: React.ReactNode;
  threshold?: number;
  rootMargin?: string;
  placeholder?: React.ReactNode;
}

export const LazyLoad: React.FC<LazyLoadProps> = ({
  children,
  threshold = 0.1,
  rootMargin = '50px',
  placeholder = <div>Loading...</div>,
}) => {
  const [isIntersecting, setIsIntersecting] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );
    
    if (ref.current) {
      observer.observe(ref.current);
    }
    
    return () => observer.disconnect();
  }, [threshold, rootMargin]);
  
  return <div ref={ref}>{isIntersecting ? children : placeholder}</div>;
};