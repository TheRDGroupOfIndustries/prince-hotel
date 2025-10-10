import type * as React from "react"

type SpanProps = React.HTMLAttributes<HTMLSpanElement>

export function Badge({ className = "", ...props }: SpanProps) {
  return (
    <span
      className={`inline-flex items-center rounded-md bg-[var(--primary)] px-2 py-0.5 text-xs font-medium text-[var(--primary-foreground)] ${className}`}
      {...props}
    />
  )
}
