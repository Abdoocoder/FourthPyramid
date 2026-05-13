import type { ReactNode } from "react";

type BadgeVariant = "primary" | "secondary" | "tertiary" | "outline";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variants: Record<BadgeVariant, string> = {
  primary: "bg-primary text-on-primary",
  secondary: "bg-secondary-container text-on-secondary-container",
  tertiary: "bg-tertiary-container text-on-tertiary-container",
  outline: "bg-surface text-on-surface border border-outline-variant",
};

export function Badge({ children, variant = "outline", className = "" }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-lg font-data-mono text-data-mono uppercase tracking-wider ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
