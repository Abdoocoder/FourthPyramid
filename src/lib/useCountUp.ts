import { useState, useEffect, useRef } from "react";

interface UseCountUpOptions {
  end: number;
  duration?: number;
  suffix?: string;
  enabled?: boolean;
}

export function useCountUp({ end, duration = 1500, suffix = "", enabled = true }: UseCountUpOptions) {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    if (!enabled) return;

    startTimeRef.current = 0;
    const step = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(eased * end));
      if (t < 1) {
        rafRef.current = requestAnimationFrame(step);
      }
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [end, duration, enabled]);

  const formatted = suffix ? `${display}${suffix}` : String(display);

  return { display, formatted };
}

interface UseInViewCountUpOptions {
  end: number;
  duration?: number;
  suffix?: string;
  threshold?: number;
}

export function useInViewCountUp({ end, duration = 1500, suffix = "", threshold = 0.3 }: UseInViewCountUpOptions) {
  const ref = useRef<HTMLSpanElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(el);
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  const { display, formatted } = useCountUp({ end, duration, suffix, enabled: inView });

  return { ref, display, formatted, inView };
}
