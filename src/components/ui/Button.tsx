import { cn } from "@/lib/utils";
import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "outline-primary";
  size?: "sm" | "md" | "lg";
  as?: any;
  href?: string;
  target?: string;
  rel?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  disabled,
  as: Component = "button",
  ...props
}) => {
  // Size styling classes
  const sizes = {
    sm: "px-4 py-2 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const outlineInnerSizes = {
    sm: "px-3.5 py-1.5 text-xs",
    md: "px-5 py-2 text-sm",
    lg: "px-6 py-2.5 text-base",
  };

  // ── outline-primary: gradient border via wrapper trick ──────────────────────
  // Uses CSS var(--gradient-brand) so the value is never an inline arbitrary class
  // (long arbitrary gradient values with commas can be missed by Tailwind v4 scanner)
  if (variant === "outline-primary") {
    return (
      <Component
        className={cn(
          "group rounded-xl inline-flex items-center justify-center transition-all duration-200 transform active:scale-95",
          "hover:-translate-y-[1px] hover:shadow-lg hover:shadow-[#5c3ffa]/25",
          "disabled:opacity-50 disabled:pointer-events-none",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5c3ffa]",
          className
        )}
        style={{ padding: "2px", background: "var(--gradient-brand)" }}
        disabled={disabled}
        {...props}
      >
        <span
          className={cn(
            "bg-white group-hover:bg-transparent",
            "text-slate-900 group-hover:text-white",
            // Follow the wrapper's radius so a caller-supplied rounding
            // (e.g. `rounded-full`) does not leave the gradient ring broken.
            "transition-all duration-200 rounded-[inherit]",
            "flex items-center justify-center gap-2 w-full h-full font-bold",
            outlineInnerSizes[size]
          )}
        >
          {children}
        </span>
      </Component>
    );
  }

  // ── Standard variants ───────────────────────────────────────────────────────
  const baseClasses =
    "inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-300 transform active:scale-95 disabled:opacity-50 disabled:pointer-events-none relative";

  const variants = {
    primary:
      "text-white hover:-translate-y-[1px] hover:brightness-110 shadow-lg shadow-[#5c3ffa]/20 hover:shadow-[#5c3ffa]/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5c3ffa]",
    secondary:
      "bg-slate-100 text-slate-900 hover:bg-slate-200 hover:-translate-y-[1px] focus:ring-slate-500",
    outline:
      "border border-slate-900 text-slate-900 bg-transparent hover:bg-slate-900 hover:text-white hover:-translate-y-[1px]",
    "outline-primary": "", // handled above
  };

  const classes = cn(baseClasses, variants[variant], sizes[size], className);

  // Primary uses inline style for the same reason — gradient in style is always rendered
  const primaryStyle =
    variant === "primary" ? { background: "var(--gradient-brand)" } : undefined;

  return (
    <Component className={classes} style={primaryStyle} disabled={disabled} {...props}>
      {variant === "primary" && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[0px_8px_24px_-8px_#5c3ffa73]"
        />
      )}
      <span className="relative flex items-center justify-center gap-2">
        {children}
      </span>
    </Component>
  );
};

Button.displayName = "Button";
