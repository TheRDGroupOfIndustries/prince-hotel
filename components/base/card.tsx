import type * as React from "react"

type DivProps = React.HTMLAttributes<HTMLDivElement>

export function Card({ className = "", ...props }: DivProps) {
  return (
    <div
      className={`rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--card-foreground)] shadow-sm ${className}`}
      {...props}
    />
  )
}
