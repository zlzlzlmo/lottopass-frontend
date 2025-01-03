import { useEffect, useRef } from "react";

type IntersectionCallback = (entry: IntersectionObserverEntry) => void;

const useIntersection = (
  callback: IntersectionCallback,
  options?: IntersectionObserverInit
) => {
  const targetRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!targetRef.current) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(callback);
    }, options);

    observer.observe(targetRef.current);

    return () => observer.disconnect();
  }, [callback, options]);

  return targetRef;
};

export default useIntersection;