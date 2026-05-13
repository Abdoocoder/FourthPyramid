import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export function Card({ children, className = "", hover = true, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick(); } } : undefined}
      className={`
        bg-surface border border-outline-variant rounded-xl
        ${hover ? "transition-shadow duration-300 ease-out hover:shadow-card-hover" : ""}
        ${onClick ? "cursor-pointer active:scale-[0.99]" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
}