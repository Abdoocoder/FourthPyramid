import { useEffect, useRef } from "react";
import gsap from "gsap";

function isTouchDevice() {
  return window.matchMedia("(pointer: coarse)").matches;
}

function TouchRipple() {
  useEffect(() => {
    const handle = (e: TouchEvent) => {
      const t = e.touches[0];
      const el = document.createElement("div");
      el.setAttribute("aria-hidden", "true");
      Object.assign(el.style, {
        position: "fixed",
        left: `${t.clientX}px`,
        top: `${t.clientY}px`,
        width: "48px",
        height: "48px",
        borderRadius: "50%",
        border: "1.5px solid var(--color-primary)",
        transform: "translate(-50%,-50%) scale(0)",
        opacity: "0.6",
        pointerEvents: "none",
        zIndex: "9999",
      });
      document.body.appendChild(el);
      gsap.to(el, { scale: 1.5, opacity: 0, duration: 0.5, ease: "power2.out", onComplete: () => el.remove() });
    };
    document.addEventListener("touchstart", handle, { passive: true });
    return () => document.removeEventListener("touchstart", handle);
  }, []);
  return null;
}

function DesktopCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: -100, y: -100 });
  const mouse = useRef({ x: -100, y: -100 });
  const isHovering = useRef(false);

  useEffect(() => {
    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!ring || !dot) return;

    // Move dot instantly, ring follows with lag
    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      gsap.to(dot, { x: e.clientX, y: e.clientY, duration: 0.05, ease: "none", overwrite: true });
    };

    const ticker = () => {
      pos.current.x += (mouse.current.x - pos.current.x) * 0.12;
      pos.current.y += (mouse.current.y - pos.current.y) * 0.12;
      gsap.set(ring, { x: pos.current.x, y: pos.current.y });
    };

    // Expand ring on interactive elements
    const onEnterLink = () => {
      if (isHovering.current) return;
      isHovering.current = true;
      gsap.to(ring, { scale: 2.5, borderColor: "var(--color-primary)", opacity: 0.5, duration: 0.3, ease: "power2.out" });
      gsap.to(dot, { scale: 0, duration: 0.2 });
    };

    const onLeaveLink = () => {
      isHovering.current = false;
      gsap.to(ring, { scale: 1, borderColor: "var(--color-primary)", opacity: 1, duration: 0.4, ease: "elastic.out(1,0.5)" });
      gsap.to(dot, { scale: 1, duration: 0.3 });
    };

    // Watch for interactive elements dynamically
    const addHoverTargets = () => {
      document.querySelectorAll("a, button, [role='button'], input, textarea, select, label").forEach((el) => {
        el.addEventListener("mouseenter", onEnterLink);
        el.addEventListener("mouseleave", onLeaveLink);
      });
    };

    addHoverTargets();
    const observer = new MutationObserver(addHoverTargets);
    observer.observe(document.body, { childList: true, subtree: true });

    document.addEventListener("mousemove", onMove);
    gsap.ticker.add(ticker);

    return () => {
      document.removeEventListener("mousemove", onMove);
      gsap.ticker.remove(ticker);
      observer.disconnect();
      document.querySelectorAll("a, button, [role='button'], input, textarea, select, label").forEach((el) => {
        el.removeEventListener("mouseenter", onEnterLink);
        el.removeEventListener("mouseleave", onLeaveLink);
      });
    };
  }, []);

  return (
    <>
      {/* Lagging outer ring */}
      <div
        ref={ringRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "36px",
          height: "36px",
          borderRadius: "50%",
          border: "1.5px solid var(--color-primary)",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
          zIndex: 9999,
          willChange: "transform",
          mixBlendMode: "normal",
        }}
      />
      {/* Fast center dot */}
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "6px",
          height: "6px",
          borderRadius: "50%",
          background: "var(--color-primary)",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
          zIndex: 9999,
          willChange: "transform",
        }}
      />
    </>
  );
}

export function MagneticCursor() {
  if (isTouchDevice()) return <TouchRipple />;
  return <DesktopCursor />;
}
