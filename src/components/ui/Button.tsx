import { useRef, type ButtonHTMLAttributes } from "react";
import { useMagneticButton } from "../../lib/animations";

type Variant = "primary" | "secondary" | "ghost" | "tertiary" | "accent" | "dark" | "outline-light";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  as?: "button" | "a";
  href?: string;
  target?: string;
  rel?: string;
}

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container shadow-sm hover:shadow-card-hover",
  secondary:
    "bg-surface text-on-surface border border-outline-variant hover:bg-surface-container hover:border-outline",
  ghost:
    "text-primary hover:bg-surface-container-low hover:text-on-primary-container",
  tertiary:
    "bg-tertiary text-on-tertiary hover:bg-tertiary-container hover:text-on-tertiary-container shadow-sm hover:shadow-card-hover",
  accent:
    "bg-surface text-on-surface hover:bg-surface-container border border-outline-variant font-semibold",
  dark:
    "bg-inverse-surface text-inverse-on-surface hover:bg-pyramid-slate border-none",
  "outline-light":
    "bg-transparent text-inverse-on-surface border border-inverse-on-surface/30 hover:bg-inverse-on-surface/10",
};

const sizeStyles: Record<Size, string> = {
  sm: "px-5 py-3 text-xs",
  md: "px-6 py-4 text-button-label",
  lg: "px-8 py-4 text-button-label",
};

export function Button({
  variant = "primary",
  size = "md",
  as = "button",
  href,
  target,
  rel,
  className = "",
  children,
  ...props
}: ButtonProps) {
  const base = "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg font-button-label cursor-pointer select-none motion-reduce:active:scale-100 hover-lift-btn transition-[background-color,color,border-color,box-shadow,transform] duration-200 ease-out-strong disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none";
  const classes = `${base} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  const btnRef = useRef<HTMLButtonElement>(null);
  useMagneticButton(btnRef);

  if (as === "a" && href) {
    const isExternal = href.startsWith("http");
    return (
      <a
        href={href}
        className={classes}
        target={target ?? (isExternal ? "_blank" : undefined)}
        rel={rel ?? (isExternal ? "noopener noreferrer" : undefined)}
      >
        {children}
      </a>
    );
  }

  return (
    <button ref={btnRef} className={classes} {...props}>
      {children}
    </button>
  );
}
