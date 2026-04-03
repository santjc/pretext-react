"use client"

import { cn } from "@/lib/utils"

interface ShowcaseLayoutProps {
  /** Section identifier for navigation */
  id: string
  /** Category label (e.g., "Accordion", "Cards") */
  category: string
  /** Main title */
  title: string
  /** Description text */
  description: string
  /** Tag label */
  tag?: string
  /** Tag variant for styling */
  tagVariant?: "start" | "migration" | "core" | "utility" | "advanced"
  /** Controls panel content */
  controls: React.ReactNode
  /** Optional info callout */
  callout?: {
    title: string
    content: React.ReactNode
  }
  /** Metrics to display */
  metrics?: Array<{
    label: string
    value: string | number
    unit?: string
  }>
  /** Demo preview content */
  preview: React.ReactNode
  /** Code snippet */
  code: string
  children?: React.ReactNode
}

const tagStyles = {
  start: "border-primary text-primary",
  migration: "border-orange-400 text-orange-400",
  core: "border-muted-foreground text-muted-foreground",
  utility: "border-yellow-500 text-yellow-500",
  advanced: "border-blue-400 text-blue-400",
}

export function ShowcaseLayout({
  id,
  category,
  title,
  description,
  tag,
  tagVariant = "core",
  controls,
  callout,
  metrics = [],
  preview,
  code,
}: ShowcaseLayoutProps) {
  return (
    <section id={id} className="border border-border rounded-lg bg-card overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <p className="text-xs font-mono uppercase tracking-wider text-primary mb-3">{category}</p>
        <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-2 text-balance">{title}</h3>
        <p className="text-muted-foreground leading-relaxed max-w-2xl">{description}</p>
        {tag && (
          <div className="mt-4">
            <span className={cn(
              "inline-block text-xs font-mono uppercase tracking-wider px-2 py-1 border rounded",
              tagStyles[tagVariant]
            )}>
              {tag}
            </span>
          </div>
        )}
      </div>

      {/* Demo Area */}
      <div className="grid lg:grid-cols-[320px_1fr] divide-y lg:divide-y-0 lg:divide-x divide-border">
        {/* Controls Panel */}
        <div className="p-6 space-y-6 bg-secondary/20">
          {controls}
          {callout && (
            <div className="border-l-2 border-primary/50 bg-secondary/30 p-4 rounded-r-md">
              <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">
                {callout.title}
              </p>
              <div className="text-sm text-muted-foreground leading-relaxed">
                {callout.content}
              </div>
            </div>
          )}
        </div>

        {/* Preview + Code Panel */}
        <div className="p-6 space-y-6">
          {/* Metrics Row */}
          {metrics.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {metrics.map((metric, i) => (
                <div key={i} className="border border-border rounded-md p-3 bg-background">
                  <p className="text-xs text-muted-foreground mb-1 font-mono uppercase tracking-wider">
                    {metric.label}
                  </p>
                  <p className="text-lg font-mono text-foreground">
                    {metric.value}
                    {metric.unit && <span className="text-muted-foreground text-sm">{metric.unit}</span>}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Preview */}
          <div className="border border-border rounded-md p-6 bg-background min-h-[120px]">
            {preview}
          </div>

          {/* Code */}
          <div className="bg-background border border-border rounded-md p-4 font-mono text-sm overflow-x-auto">
            <pre className="text-muted-foreground whitespace-pre-wrap">{code}</pre>
          </div>
        </div>
      </div>
    </section>
  )
}

// Reusable control components
export function SliderControl({
  label,
  value,
  min,
  max,
  unit = "px",
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  unit?: string
  onChange: (value: number) => void
}) {
  return (
    <div className="space-y-2">
      <div className="flex flex-col items-start gap-1 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="min-w-0 text-sm font-mono text-foreground">{value}{unit}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1 bg-secondary rounded-full appearance-none cursor-pointer accent-primary [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
      />
    </div>
  )
}

export function SelectControl({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: { label: string; value: string }[]
  onChange: (value: string) => void
}) {
  return (
    <div className="space-y-2">
      <span className="text-sm text-muted-foreground block">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  )
}

export function SegmentedControl({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: { label: string; value: string }[]
  onChange: (value: string) => void
}) {
  return (
    <div className="space-y-2">
      <span className="text-sm text-muted-foreground block">{label}</span>
      <div className="flex rounded-md border border-border bg-card p-0.5">
        {options.map((option) => {
          const isActive = value === option.value

          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={isActive}
              onClick={() => onChange(option.value)}
              className={cn(
                "flex-1 rounded-[5px] border px-4 py-2 text-sm transition-colors",
                isActive
                  ? "border-primary bg-card text-primary"
                  : "border-transparent bg-card text-muted-foreground hover:bg-secondary/40 hover:text-foreground",
              )}
            >
              {option.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export function TextareaControl({
  label,
  value,
  rows = 4,
  onChange,
}: {
  label: string
  value: string
  rows?: number
  onChange: (value: string) => void
}) {
  return (
    <div className="space-y-2">
      <span className="text-sm text-muted-foreground block">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary"
      />
    </div>
  )
}

export function CheckboxControl({
  label,
  checked,
}: {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group">
      <div className={cn(
        "w-4 h-4 border rounded flex items-center justify-center transition-colors",
        checked ? "bg-primary border-primary" : "border-border bg-background group-hover:border-muted-foreground"
      )}>
        {checked && (
          <svg className="w-3 h-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
      <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{label}</span>
    </label>
  )
}
