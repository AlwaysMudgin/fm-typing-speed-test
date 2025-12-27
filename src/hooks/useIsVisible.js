import { useState, useEffect } from 'react';

function useIsVisible(targetRef, containerRef) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const target = targetRef.current;
    // console.log('target: ', target);
    const container = containerRef.current;
    // console.log('container: ', container);

    if (!target || !container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        root: container,
        rootMargin: '0px',
        threshold: 0.1,
      }
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [targetRef, containerRef]);

  return isVisible;
}

export default useIsVisible;
