import type * as React from "react"

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "accent" | "primary" | "outline" | "ghost"
}

export function Button({ className = "", variant = "accent", ...props }: ButtonProps) {
  const base =
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2"
  const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
    accent: "bg-[var(--accent)] text-[var(--accent-foreground)] hover:bg-[color-mix(in_hsl,var(--accent),#000_10%)]",
    primary:
      "bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[color-mix(in_hsl,var(--primary),#000_10%)]",
    outline:
      "border border-[var(--border)] bg-transparent text-[var(--foreground)] hover:bg-[color-mix(in_hsl,var(--card),#000_5%)]",
    ghost: "bg-transparent hover:bg-[color-mix(in_hsl,var(--card),#000_5%)]",
  }
  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />
}
