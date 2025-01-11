import { useEffect, useRef } from "react";

const useMultipleIntersection = (
  callback: (entry: IntersectionObserverEntry, index: number) => void,
  options?: IntersectionObserverInit
) => {
  const targetRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const index = targetRefs.current.indexOf(
          entry.target as HTMLDivElement
        );
        if (index !== -1) {
          callback(entry, index);
        }
      });
    }, options);

    // 모든 요소를 observer로 관찰합니다.
    targetRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      // 관찰을 중단합니다.
      targetRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
      observer.disconnect();
    };
  }, [callback, options]);

  return targetRefs;
};

export default useMultipleIntersection;
