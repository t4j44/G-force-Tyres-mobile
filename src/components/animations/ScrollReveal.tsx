'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';

interface Props {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  stagger?: number;
}

type RevealStyle = CSSProperties & {
  '--reveal-delay': string;
  '--reveal-y': string;
};

/**
 * One IntersectionObserver and compositor-only CSS transitions replace the
 * previous GSAP + ScrollTrigger instance created by every section.
 */
export default function ScrollReveal({ children, delay = 0, y = 28, className, stagger }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [motionReady, setMotionReady] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const element = ref.current;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!element || reducedMotion || !('IntersectionObserver' in window)) return;

    setVisible(false);
    setMotionReady(true);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setVisible(true);
        observer.disconnect();
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const style: RevealStyle = {
    '--reveal-delay': `${Math.max(0, delay) * 1000}ms`,
    '--reveal-y': `${Math.max(0, y)}px`,
  };

  return (
    <div
      ref={ref}
      className={`reveal-shell ${className ?? ''}`}
      data-motion={motionReady ? 'true' : 'false'}
      data-visible={visible ? 'true' : 'false'}
      data-stagger={stagger ? 'true' : 'false'}
      style={style}
    >
      {children}
    </div>
  );
}
