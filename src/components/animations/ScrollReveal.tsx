'use client';

import { useEffect, useRef } from 'react';

interface Props {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  /** Stagger direct children instead of animating the wrapper as one block. */
  stagger?: number;
}

/**
 * Fade + rise on scroll. The workhorse animation for every section.
 * Falls back to plain visible content when reduced motion is set.
 */
export default function ScrollReveal({ children, delay = 0, y = 32, className, stagger }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let ctx: { revert: () => void } | undefined;

    (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ]);
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        const targets = stagger ? Array.from(el.children) : el;
        gsap.from(targets, {
          opacity: 0,
          y,
          duration: 0.7,
          ease: 'power2.out',
          delay,
          stagger: stagger ?? 0,
          scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
        });
      }, el);
    })();

    return () => ctx?.revert();
  }, [delay, y, stagger]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
