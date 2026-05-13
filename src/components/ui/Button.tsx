import { type ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost" | "tertiary" | "accent" | "dark" | "outline-light";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  as?: "button" | "a";
  href?: string;
}

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container shadow-sm",
  secondary:
    "bg-surface text-on-surface border border-outline hover:bg-surface-container",
  ghost:
    "text-primary hover:bg-surface-container-low",
  tertiary:
    "bg-tertiary text-on-tertiary hover:bg-tertiary-container hover:text-on-tertiary-container shadow-sm",
  accent:
    "bg-surface text-on-surface hover:bg-surface-container border border-outline-variant font-semibold",
  dark:
    "bg-inverse-surface text-inverse-on-surface hover:bg-surface-container-highest border-none",
  "outline-light":
    "bg-transparent text-white border border-white/30 hover:bg-white/10",
};

const sizeStyles: Record<Size, string> = {
  sm: "px-4 py-2 text-[13px]",
  md: "px-6 py-3 text-button-label",
  lg: "px-8 py-4 text-button-label",
};

export function Button({
  variant = "primary",
  size = "md",
  as = "button",
  href,
  className = "",
  children,
  ...props
}: ButtonProps) {
  const base = "inline-flex items-center justify-center gap-2 rounded-lg font-button-label cursor-pointer border-none select-none active:scale-[0.97] motion-reduce:active:scale-100 transition-[transform,background-color,color,box-shadow] duration-150 ease-out";
  const classes = `${base} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  if (as === "a" && href) {
    return (
      <a
        href={href}
        className={classes}
        role="button"
        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      >
        {children}
      </a>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}