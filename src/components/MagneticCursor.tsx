import { useEffect, useRef } from "react";
import gsap from "gsap";

function isTouchDevice() {
  return window.matchMedia("(pointer: coarse)").matches;
}

function TouchRipple() {
  useEffect(() => {
    const handleTouch = (e: TouchEvent) => {
      const touch = e.touches[0];
      const ripple = document.createElement("div");
      ripple.setAttribute("aria-hidden", "true");
      Object.assign(ripple.style, {
        position: "fixed",
        left: `${touch.clientX}px`,
        top: `${touch.clientY}px`,
        width: "40px",
        height: "40px",
        borderRadius: "50%",
        border: "1.5px solid var(--color-primary)",
        transform: "translate(-50%, -50%) scale(0)",
        opacity: "0.7",
        pointerEvents: "none",
        zIndex: "9999",
      });
      document.body.appendChild(ripple);
      gsap.to(ripple, {
        scale: 1,
        opacity: 0,
        duration: 0.45,
        ease: "power2.out",
        onComplete: () => ripple.remove(),
      });
    };
    document.addEventListener("touchstart", handleTouch, { passive: true });
    return () => document.removeEventListener("touchstart", handleTouch);
  }, []);
  return null;
}

function DesktopCursor() {
  const circleRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const circle = circleRef.current;
    const dot = dotRef.current;
    if (!circle || !dot) return;

    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      gsap.to(dot, { x: e.clientX, y: e.clientY, duration: 0.08, ease: "none" });
    };

    const ticker = () => {
      pos.current.x += (mouse.current.x - pos.current.x) * 0.1;
      pos.current.y += (mouse.current.y - pos.current.y) * 0.1;
      gsap.set(circle, { x: pos.current.x, y: pos.current.y });
    };

    document.addEventListener("mousemove", onMove);
    gsap.ticker.add(ticker);
    return () => {
      document.removeEventListener("mousemove", onMove);
      gsap.ticker.remove(ticker);
    };
  }, []);

  return (
    <>
      <div
        ref={circleRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[9999] -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-primary/60 mix-blend-difference"
      />
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[9999] -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary"
      />
    </>
  );
}

export function MagneticCursor() {
  if (isTouchDevice()) return <TouchRipple />;
  return <DesktopCursor />;
}
