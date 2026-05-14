import { useEffect, useRef, type RefObject } from "react";
import gsap from "gsap";

function prefersReduced() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function useScrollReveal(
  ref: RefObject<HTMLElement | null>,
  selector: string,
  _stagger = 0.12
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const targets = el.querySelectorAll<Element>(selector);
    if (!targets.length) return;
    if (prefersReduced()) {
      for (const target of targets) {
        (target as HTMLElement).style.opacity = "1";
        (target as HTMLElement).style.transform = "translateY(0)";
      }
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).style.opacity = "1";
            (entry.target as HTMLElement).style.transform = "translateY(0)";
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
    );
    for (const target of targets) {
      (target as HTMLElement).style.opacity = "0";
      (target as HTMLElement).style.transform = "translateY(24px)";
      (target as HTMLElement).style.transition =
        "opacity 600ms cubic-bezier(0.23, 1, 0.32, 1), transform 600ms cubic-bezier(0.23, 1, 0.32, 1)";
      observer.observe(target);
    }
    return () => observer.disconnect();
  }, [ref, selector, _stagger]);
}

export function useImageReveal(
  ref: RefObject<HTMLElement | null>,
  selector = ".img-reveal",
  threshold = 0.15
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const targets = el.querySelectorAll<HTMLElement>(selector);
    if (!targets.length) return;
    if (prefersReduced()) {
      for (const target of targets) {
        target.style.clipPath = "inset(0)";
        target.style.opacity = "1";
      }
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).style.clipPath = "inset(0)";
            (entry.target as HTMLElement).style.opacity = "1";
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold, rootMargin: "0px 0px -80px 0px" }
    );
    for (const target of targets) {
      target.style.clipPath = "inset(0 100% 0 0)";
      target.style.opacity = "0";
      target.style.transition =
        "clip-path 800ms cubic-bezier(0.23, 1, 0.32, 1), opacity 600ms cubic-bezier(0.23, 1, 0.32, 1)";
      observer.observe(target);
    }
    return () => observer.disconnect();
  }, [ref, selector, threshold]);
}

export function useScrollRevealGroup(
  ref: RefObject<HTMLElement | null>,
  selector: string,
  { stagger = 0.08, delay = 0, y = 24 }: { stagger?: number; delay?: number; y?: number } = {}
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const targets = el.querySelectorAll<Element>(selector);
    if (!targets.length) return;
    if (prefersReduced()) return;
    const ctx = gsap.context(() => {
      gsap.set(targets, { opacity: 0, y });
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            gsap.to(targets, {
              opacity: 1,
              y: 0,
              duration: 0.65,
              stagger,
              ease: "power3.out",
              delay,
            });
            observer.disconnect();
          }
        },
        { threshold: 0.08, rootMargin: "0px 0px -60px 0px" }
      );
      observer.observe(el);
    }, el);
    return () => ctx.revert();
  }, [ref, selector, stagger, delay, y]);
}

export function usePageEntrance(
  ref: RefObject<HTMLElement | null>,
  selector: string,
  { stagger = 0.14, delay = 0.08 }: { stagger?: number; delay?: number } = {}
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const targets = el.querySelectorAll<Element>(selector);
    if (!targets.length) return;
    if (prefersReduced()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, duration: 0.7, stagger, ease: "power3.out", delay }
      );
    }, el);
    return () => ctx.revert();
  }, [ref, selector, stagger, delay]);
}

export function useMagneticButton(
  ref: RefObject<HTMLElement | null>,
  strength = 0.35
) {
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReduced()) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      gsap.to(el, { x: dx * strength, y: dy * strength, duration: 0.3, ease: "power2.out" });
    };
    const onLeave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1,0.4)" });
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [ref, strength]);
}

export function useTiltCard(
  ref: RefObject<HTMLElement | null>,
  maxDeg = 12
) {
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReduced()) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    gsap.set(el, { transformPerspective: 900, transformStyle: "preserve-3d" });

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      gsap.to(el, {
        rotationY: x * maxDeg,
        rotationX: -y * maxDeg,
        duration: 0.4,
        ease: "power2.out",
      });
    };
    const onLeave = () => {
      gsap.to(el, {
        rotationY: 0,
        rotationX: 0,
        duration: 0.8,
        ease: "elastic.out(1,0.4)",
      });
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [ref, maxDeg]);
}

const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZابجدهوزحطيكلمن0123456789";

export function useScramble(
  finalText: string,
  trigger = true
): RefObject<HTMLSpanElement | null> {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !trigger || prefersReduced()) {
      if (el) el.textContent = finalText;
      return;
    }
    const totalFrames = 50;
    let frame = 0;
    el.textContent = finalText;

    const iv = setInterval(() => {
      el.textContent = finalText
        .split("")
        .map((char, i) => {
          if (char === " ") return " ";
          if (frame / totalFrames > i / finalText.length) return char;
          return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
        })
        .join("");
      if (++frame >= totalFrames) {
        clearInterval(iv);
        el.textContent = finalText;
      }
    }, 16);

    return () => {
      clearInterval(iv);
      if (el) el.textContent = finalText;
    };
  }, [finalText, trigger]);

  return ref;
}

// Parallax: element moves at `speed` fraction of scroll delta
// speed=0.3 → slow (background), speed=-0.2 → opposite direction
export function useParallax(
  ref: RefObject<HTMLElement | null>,
  speed = 0.3
) {
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReduced()) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let lastY = window.scrollY;
    let raf = 0;

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const currentY = window.scrollY;
        const delta = currentY - lastY;
        lastY = currentY;
        const current = gsap.getProperty(el, "y") as number;
        gsap.to(el, {
          y: current + delta * speed,
          duration: 0.6,
          ease: "power2.out",
          overwrite: "auto",
        });
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [ref, speed]);
}

// Text split: splits element text into char spans and animates on intersect
export function useTextSplit(
  ref: RefObject<HTMLElement | null>,
  { delay = 0, stagger = 0.025 }: { delay?: number; stagger?: number } = {}
) {
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReduced()) return;

    const originalText = el.textContent ?? "";
    const chars = originalText.split("").map((ch) => {
      const span = document.createElement("span");
      span.textContent = ch === " " ? " " : ch;
      span.style.display = "inline-block";
      span.style.overflow = "hidden";
      return span;
    });

    el.textContent = "";
    chars.forEach((s) => el.appendChild(s));

    const ctx = gsap.context(() => {
      gsap.set(chars, { y: "110%", opacity: 0 });
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            gsap.to(chars, {
              y: "0%",
              opacity: 1,
              duration: 0.65,
              stagger,
              ease: "power3.out",
              delay,
            });
            observer.disconnect();
          }
        },
        { threshold: 0.2 }
      );
      observer.observe(el);
    }, el);

    return () => {
      ctx.revert();
      el.textContent = originalText;
    };
  }, [ref, delay, stagger]);
}

// Click burst: particles explode from a button on click
export function useClickBurst(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReduced()) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const burst = (e: MouseEvent) => {
      const count = 8;
      for (let i = 0; i < count; i++) {
        const p = document.createElement("div");
        const angle = (i / count) * Math.PI * 2;
        const dist = 40 + Math.random() * 30;
        Object.assign(p.style, {
          position: "fixed",
          left: `${e.clientX}px`,
          top: `${e.clientY}px`,
          width: "6px",
          height: "6px",
          borderRadius: "50%",
          background: "var(--color-primary)",
          pointerEvents: "none",
          zIndex: "9998",
          transform: "translate(-50%,-50%)",
        });
        document.body.appendChild(p);
        gsap.to(p, {
          x: Math.cos(angle) * dist,
          y: Math.sin(angle) * dist,
          opacity: 0,
          scale: 0,
          duration: 0.55,
          ease: "power2.out",
          onComplete: () => p.remove(),
        });
      }
    };

    el.addEventListener("click", burst);
    return () => el.removeEventListener("click", burst);
  }, [ref]);
}
