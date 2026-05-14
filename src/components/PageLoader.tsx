import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export function PageLoader() {
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDone(true);
      return;
    }
    const tl = gsap.timeline({ onComplete: () => setDone(true) });
    tl.to([leftRef.current, rightRef.current], {
      scaleX: 0,
      duration: 0.85,
      ease: "power3.inOut",
      transformOrigin: "left center",
      stagger: 0.07,
      delay: 0.3,
    });
  }, []);

  if (done) return null;

  return (
    <div className="fixed inset-0 z-[9998] flex pointer-events-none" aria-hidden="true">
      <div ref={leftRef} className="flex-1 origin-left bg-surface-container-highest" />
      <div ref={rightRef} className="flex-1 origin-left bg-primary" />
    </div>
  );
}
