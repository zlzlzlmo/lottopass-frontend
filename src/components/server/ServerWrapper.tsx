import React from 'react';

interface ServerWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Server Component 패턴을 위한 Wrapper
 * 현재는 Client Component이지만, Next.js 마이그레이션 시 
 * Server Component로 전환 가능하도록 설계
 */
export const ServerWrapper: React.FC<ServerWrapperProps> = ({ 
  children, 
  fallback = null 
}) => {
  // Server Component 마이그레이션을 위한 준비
  // Next.js에서는 이 컴포넌트가 서버에서 실행됨
  
  return (
    <>
      {children}
    </>
  );
};

// Server Component 시뮬레이션을 위한 데이터 페칭 함수
export async function serverFetch<T>(
  fetcher: () => Promise<T>
): Promise<T> {
  // Next.js Server Component에서는 직접 데이터 페칭 가능
  // 현재는 클라이언트에서 실행되지만 동일한 인터페이스 제공
  try {
    const data = await fetcher();
    return data;
  } catch (error) {
    console.error('Server fetch error:', error);
    throw error;
  }
}

// Server Action 시뮬레이션
export function createServerAction<TInput, TOutput>(
  action: (input: TInput) => Promise<TOutput>
) {
  // Next.js 13+에서는 'use server' 지시문 사용
  // 현재는 일반 함수로 동작하지만 동일한 패턴 유지
  return async (input: TInput): Promise<TOutput> => {
    try {
      const result = await action(input);
      return result;
    } catch (error) {
      console.error('Server action error:', error);
      throw error;
    }
  };
}