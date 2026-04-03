"use client"

import { cn } from "@/lib/utils"
import { CodeBlock } from "@/components/code-block"

interface MetricProps {
  label: string
  value: string | number
  unit?: string
}

function Metric({ label, value, unit }: MetricProps) {
  return (
    <div className="border border-border rounded-md p-3 bg-background">
      <p className="text-xs text-muted-foreground mb-1 font-mono uppercase tracking-wider">{label}</p>
      <p className="text-lg font-mono text-foreground">
        {value}
        {unit && <span className="text-muted-foreground text-sm">{unit}</span>}
      </p>
    </div>
  )
}

interface SliderControlProps {
  label: string
  value: number
  min: number
  max: number
  unit?: string
  onChange: (value: number) => void
}

function SliderControl({ label, value, min, max, unit = "px", onChange }: SliderControlProps) {
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

interface SelectControlProps {
  label: string
  value: string
  options: { label: string; value: string }[]
  onChange: (value: string) => void
}

function SelectControl({ label, value, options, onChange }: SelectControlProps) {
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

interface InfoCalloutProps {
  title: string
  children: React.ReactNode
}

function InfoCallout({ title, children }: InfoCalloutProps) {
  return (
    <div className="border-l-2 border-primary/50 bg-secondary/30 p-4 rounded-r-md">
      <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">{title}</p>
      <div className="text-sm text-muted-foreground leading-relaxed">{children}</div>
    </div>
  )
}

interface CodePreviewProps {
  code: string
  filename?: string
}

function CodePreview({ code, filename = "example.tsx" }: CodePreviewProps) {
  return <CodeBlock code={code} filename={filename} />
}

interface ShowcaseDemoProps {
  id: string
  label: string
  labelVariant?: "start" | "migration" | "core"
  title: string
  description: string
  controls: React.ReactNode
  metrics: MetricProps[]
  preview: React.ReactNode
  code: string
  callout?: {
    title: string
    content: React.ReactNode
  }
}

export function ShowcaseDemo({
  id,
  label,
  labelVariant = "core",
  title,
  description,
  controls,
  metrics,
  preview,
  code,
  callout,
}: ShowcaseDemoProps) {
  const labelColors = {
    start: "border-primary text-primary",
    migration: "border-orange-400 text-orange-400",
    core: "border-muted-foreground text-muted-foreground",
  }

  return (
    <section id={id} className="border border-border rounded-lg bg-card overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <p className="text-xs font-mono uppercase tracking-wider text-primary mb-3">Core Path</p>
        <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-2 text-balance">{title}</h3>
        <p className="text-muted-foreground leading-relaxed max-w-2xl">{description}</p>
        <div className="mt-4">
          <span className={cn(
            "inline-block text-xs font-mono uppercase tracking-wider px-2 py-1 border rounded",
            labelColors[labelVariant]
          )}>
            {label}
          </span>
        </div>
      </div>

      {/* Demo Area */}
      <div className="grid lg:grid-cols-[320px_1fr] divide-y lg:divide-y-0 lg:divide-x divide-border">
        {/* Controls Panel */}
        <div className="p-6 space-y-6 bg-secondary/20">
          {controls}
          {callout && (
            <InfoCallout title={callout.title}>
              {callout.content}
            </InfoCallout>
          )}
        </div>

        {/* Preview + Code Panel */}
        <div className="p-6 space-y-6">
          {/* Metrics Row */}
          {metrics.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {metrics.map((metric, i) => (
                <Metric key={i} {...metric} />
              ))}
            </div>
          )}

          {/* Preview */}
          <div className="border border-border rounded-md p-6 bg-background min-h-[120px]">
            {preview}
          </div>

          {/* Code */}
          <CodePreview code={code} />
        </div>
      </div>
    </section>
  )
}

// Export sub-components for custom usage
ShowcaseDemo.SliderControl = SliderControl
ShowcaseDemo.SelectControl = SelectControl
ShowcaseDemo.Metric = Metric
ShowcaseDemo.InfoCallout = InfoCallout
ShowcaseDemo.CodePreview = CodePreview
