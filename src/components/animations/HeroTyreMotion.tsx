'use client';

import { useEffect, useRef, type PointerEvent, type ReactNode } from 'react';

interface HeroTyreMotionProps {
  children: ReactNode;
}

export default function HeroTyreMotion({ children }: HeroTyreMotionProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const reduceMotionRef = useRef(false);

  const resetTilt = () => {
    const tilt = tiltRef.current;
    if (!tilt) return;

    tilt.dataset.active = 'false';
    tilt.style.setProperty('--hero-tilt-x', '0deg');
    tilt.style.setProperty('--hero-tilt-y', '0deg');
    tilt.style.setProperty('--hero-glint-x', '62%');
    tilt.style.setProperty('--hero-glint-y', '32%');
  };

  useEffect(() => {
    const root = rootRef.current;
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncPreference = () => {
      reduceMotionRef.current = motionPreference.matches;
      if (motionPreference.matches) resetTilt();
    };
    const visibilityObserver = root
      ? new IntersectionObserver(
          ([entry]) => {
            root.dataset.inView = entry.isIntersecting ? 'true' : 'false';
          },
          { threshold: 0.05 },
        )
      : null;

    syncPreference();
    motionPreference.addEventListener('change', syncPreference);
    if (root && visibilityObserver) visibilityObserver.observe(root);

    return () => {
      motionPreference.removeEventListener('change', syncPreference);
      visibilityObserver?.disconnect();
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse' || reduceMotionRef.current) return;

    const target = event.currentTarget;
    const { left, top, width, height } = target.getBoundingClientRect();
    const x = ((event.clientX - left) / width - 0.5) * 2;
    const y = ((event.clientY - top) / height - 0.5) * 2;

    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(() => {
      const tilt = tiltRef.current;
      if (!tilt) return;

      tilt.dataset.active = 'true';
      tilt.style.setProperty('--hero-tilt-x', `${(-y * 8).toFixed(2)}deg`);
      tilt.style.setProperty('--hero-tilt-y', `${(x * 11).toFixed(2)}deg`);
      tilt.style.setProperty('--hero-glint-x', `${(50 + x * 24).toFixed(1)}%`);
      tilt.style.setProperty('--hero-glint-y', `${(42 + y * 20).toFixed(1)}%`);
      frameRef.current = null;
    });
  };

  const handlePointerLeave = () => {
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
    resetTilt();
  };

  return (
    <div
      ref={rootRef}
      className="hero-tyre-motion"
      data-in-view="true"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerCancel={handlePointerLeave}
    >
      <div className="hero-tyre-aura" aria-hidden="true" />
      <div className="hero-tyre-ground-shadow" aria-hidden="true" />
      <div ref={tiltRef} className="hero-tyre-tilt" data-active="false">
        <div className="hero-tyre-spin">
          <div className="hero-tyre-wrap">
            {children}
            <div className="hero-tyre-sheen" aria-hidden="true" />
          </div>
        </div>
      </div>
      <div className="hero-tyre-scanline" aria-hidden="true" />
    </div>
  );
}
