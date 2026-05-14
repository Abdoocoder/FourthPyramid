import { useEffect, type RefObject } from "react";
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
