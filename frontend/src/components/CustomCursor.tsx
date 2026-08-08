import { useEffect, useRef } from 'react';

const SpotlightCursor = () => {
  const spotlightRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const latestPosition = useRef({ x: -100, y: -100 });

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    if (reducedMotion || !finePointer) return;

    const updateMousePosition = (event: MouseEvent) => {
      latestPosition.current = { x: event.clientX, y: event.clientY };
      if (frameRef.current !== null) return;

      frameRef.current = window.requestAnimationFrame(() => {
        if (spotlightRef.current) {
          spotlightRef.current.style.transform = `translate3d(${latestPosition.current.x - 48}px, ${latestPosition.current.y - 48}px, 0)`;
        }
        frameRef.current = null;
      });
    };

    window.addEventListener('mousemove', updateMousePosition, { passive: true });

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <div
      ref={spotlightRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[45] hidden size-24 rounded-full opacity-70 lg:block"
      style={{
        transform: 'translate3d(-100px, -100px, 0)',
        willChange: 'transform',
        background:
          'radial-gradient(circle, rgb(var(--color-dream) / 0.12), rgb(var(--color-rose) / 0.04) 42%, transparent 72%)',
      }}
    />
  );
};

export default SpotlightCursor;
