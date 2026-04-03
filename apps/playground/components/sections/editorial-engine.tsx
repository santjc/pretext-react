"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { EditorialColumns, EditorialSurface, type EditorialFigure } from "@santjc/react-pretext/editorial"
import { cn } from "@/lib/utils"
import { SegmentedControl } from "@/components/showcase-layout"
import { Slider } from "@/components/ui/slider"
import { CodeBlock } from "@/components/code-block"
import { useIsMobile } from "@/hooks/use-mobile"

const editorialColumnsText = `A real editorial spread starts from declared geometry, not from decorative overlays. The body text stays one continuous article, while the layout decides how that article fragments across tracks with shared cursor state.

Move the orb and the wrap path changes immediately. Lines shorten, restart, and hand off into the next track without remeasuring hidden DOM probes or asking the browser to tell the layout where text ended up.

That matters when a design wants figures, pull quotes, and modules to participate in the layout model itself. The text is not pasted underneath floating chrome after the fact. It routes around declared obstacles and keeps reading order intact.

This is the narrower subpath in the package. Reach for it when a layout needs explicit figures, obstacle-aware flow, and continuity across columns, not when you only need one predicted block height.`

const editorialSurfaceText = `EditorialSurface is the simpler version of the same idea. One surface owns the text flow, and declared figures carve space out of the available line slots.

Scale the circle and the quote block, and the body reflows around both obstacles. The figures stay part of the layout input instead of behaving like absolutely positioned decoration sitting on top of finished text.

That makes the feature legible to a developer. You declare geometry, padding, and placement rules, then let the package resolve the line routing. The design system still owns the visual styling, but text flow responds to real editorial constraints.`

function ControlSlider({
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
    <div className="space-y-3">
      <div className="flex items-baseline justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="text-sm font-mono text-foreground">{value}{unit}</span>
      </div>
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={1}
        onValueChange={(values: number[]) => onChange(values[0] ?? value)}
        className="w-full"
      />
    </div>
  )
}

function Orb({ size = 64 }: { size?: number }) {
  return (
    <div
      className="rounded-full border border-primary/30 bg-primary/15 shadow-[0_0_0_1px_rgba(255,255,255,0.04)]"
      style={{ width: `${size}px`, height: `${size}px` }}
    />
  )
}

function PullQuote({ className }: { className?: string }) {
  return (
    <div className={cn("h-full overflow-hidden rounded-xl border border-border bg-card/90 p-3 text-xs text-foreground shadow-sm sm:p-4 sm:text-sm", className)}>
      <p className="text-[11px] font-mono uppercase tracking-wider text-primary sm:text-xs">Pull Quote</p>
      <p className="mt-2 leading-relaxed sm:mt-3">
        Declare the figure, then let the text route around it.
      </p>
    </div>
  )
}

export function EditorialEngineSection() {
  return (
    <div className="space-y-10">
      <div>
        <p className="text-xs font-mono uppercase tracking-wider text-primary mb-3">Editorial Engine</p>
        <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-3 text-balance">
          Animated obstacles with multi-track continuation
        </h2>
        <p className="text-muted-foreground leading-relaxed max-w-2xl">
          The advanced editorial exports already cover the core editorial-engine behavior: declared figures, live reflow, and one text cursor that continues across tracks. This section shows that model directly through the current public API.
        </p>
        <div className="mt-4">
          <span className="inline-block text-xs font-mono uppercase tracking-wider px-2 py-1 border border-primary/50 text-primary rounded">
            Advanced Subpath
          </span>
        </div>
      </div>

      <AnimatedGeometryDemo />
      <TextReflowDemo />
    </div>
  )
}

function AnimatedGeometryDemo() {
  const isMobile = useIsMobile()
  const [trackGap, setTrackGap] = useState(22)
  const [bodyLeading, setBodyLeading] = useState(24)
  const [isAnimating, setIsAnimating] = useState(true)
  const [orbPosition, setOrbPosition] = useState({ x: 80, y: 32 })
  const animationRef = useRef<number | null>(null)
  const timeRef = useRef(0)

  useEffect(() => {
    if (!isAnimating) {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current)
      }
      return
    }

    const animate = () => {
      timeRef.current += 0.02
      setOrbPosition({
        x: Math.round(78 + Math.sin(timeRef.current) * 34),
        y: Math.round(26 + Math.cos(timeRef.current * 0.75) * 14),
      })
      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)
    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isAnimating])

  const columnFont = `400 15px Geist, sans-serif`

  const tracks = useMemo(
    () => {
      const primaryTrack = {
        fr: 1.08,
        minHeight: 420,
        paddingInline: 14,
        paddingBlock: 10,
        figures: [
          {
            shape: "circle" as const,
            width: 112,
            height: 112,
            x: orbPosition.x,
            y: orbPosition.y,
            linePadding: 16,
            content: <Orb size={112} />,
          },
          {
            shape: "rect" as const,
            width: 164,
            height: 116,
            placement: "bottom-left" as const,
            linePadding: 14,
            content: <PullQuote />,
          },
        ],
      }

      if (isMobile) {
        return [primaryTrack]
      }

      return [
        primaryTrack,
        {
          fr: 0.92,
          minHeight: 420,
          paddingInline: 14,
          paddingBlock: 10,
        },
        {
          fr: 0.92,
          minHeight: 420,
          paddingInline: 14,
          paddingBlock: 10,
        },
      ]
    },
    [isMobile, orbPosition.x, orbPosition.y],
  )

  return (
    <section className="border border-border rounded-lg bg-card overflow-hidden">
      <div className="p-6 border-b border-border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ControlSlider label="Track gap" value={trackGap} min={12} max={40} onChange={setTrackGap} />
          <ControlSlider label="Body leading" value={bodyLeading} min={18} max={36} onChange={setBodyLeading} />
          <SegmentedControl
            label="Animation"
            value={isAnimating ? "live" : "pause"}
            onChange={(v) => setIsAnimating(v === "live")}
            options={[
              { value: "live", label: "Live" },
              { value: "pause", label: "Pause" },
            ]}
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_280px]">
        <div className="relative min-h-[320px] bg-background p-6 lg:border-r lg:border-border">
          <EditorialColumns
            text={editorialColumnsText}
            font={columnFont}
            lineHeight={bodyLeading}
            gap={trackGap}
            lineRenderMode="justify"
            className="text-sm text-muted-foreground"
            tracks={tracks}
          />
        </div>

        <div className="p-6 bg-secondary/20">
          <div className="space-y-6">
            <div>
              <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">
                Why it matters
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The text stream stays continuous while figures alter the available slots. When the orb moves, the track reflows from declared geometry instead of overlaying decoration on top of finished paragraphs.
              </p>
            </div>
            <div>
              <p className="text-xs font-mono uppercase tracking-wider text-primary mb-2">
                Public exports only
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                This preview uses <code className="text-xs font-mono bg-background px-1 py-0.5 rounded">EditorialColumns</code> with <code className="text-xs font-mono bg-background px-1 py-0.5 rounded">tracks[].figures</code>. The figures are config objects, not a separate component layer.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 border-t border-border">
        <CodeBlock
          filename="animated-geometry.tsx"
          code={`import { EditorialColumns } from '@santjc/react-pretext/editorial'

<EditorialColumns
  text={articleText}
  font="400 15px Geist, sans-serif"
  lineHeight={${bodyLeading}}
  gap={${trackGap}}
  lineRenderMode="justify"
  tracks={[
    {
      fr: 1.08,
      minHeight: 420,
      paddingInline: 14,
      paddingBlock: 10,
      figures: [
        {
          shape: 'circle',
          width: 112,
          height: 112,
          x: ${orbPosition.x},
          y: ${orbPosition.y},
          linePadding: 16,
          content: <Orb size={112} />,
        },
        {
          shape: 'rect',
          width: 164,
          height: 116,
          placement: 'bottom-left',
          linePadding: 14,
          content: <PullQuote />,
        },
      ],
    },
    { fr: 0.92, minHeight: 420, paddingInline: 14, paddingBlock: 10 },
    { fr: 0.92, minHeight: 420, paddingInline: 14, paddingBlock: 10 },
  ]}
/>`}
        />
      </div>
    </section>
  )
}

function TextReflowDemo() {
  const [obstacleScale, setObstacleScale] = useState(100)

  const scaledCircle = Math.round(64 * (obstacleScale / 100))
  const scaledQuoteHeight = Math.round(92 * (obstacleScale / 100))
  const scaledQuoteWidth = Math.round(180 * (obstacleScale / 100))
  const surfaceFont = "400 15px Geist, sans-serif"

  const figures = useMemo<EditorialFigure[]>(
    () => [
      {
        shape: "circle",
        width: scaledCircle,
        height: scaledCircle,
        placement: "center-left",
        linePadding: 12,
        content: <Orb size={scaledCircle} />,
      },
      {
        shape: "rect",
        width: scaledQuoteWidth,
        height: scaledQuoteHeight,
        placement: "bottom-left",
        linePadding: 14,
        content: <PullQuote className="h-full" />,
      },
    ],
    [scaledCircle, scaledQuoteHeight, scaledQuoteWidth],
  )

  return (
    <section className="border border-border rounded-lg bg-card overflow-hidden">
      <div className="p-6 border-b border-border">
        <p className="text-xs font-mono uppercase tracking-wider text-primary mb-3">Editorial Surface</p>
        <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-2 text-balance">
          Single-surface flow with explicit figures
        </h3>
        <p className="text-muted-foreground leading-relaxed max-w-2xl">
          Use <code className="text-xs font-mono bg-background px-1 py-0.5 rounded">EditorialSurface</code> when one canvas owns the flow. Figures still block line slots, but you do not need a handoff between tracks.
        </p>
      </div>

      <div className="p-6 border-b border-border">
        <div className="max-w-sm">
          <ControlSlider
            label="Obstacle scale"
            value={obstacleScale}
            min={50}
            max={150}
            unit="%"
            onChange={setObstacleScale}
          />
        </div>
      </div>

      <div className="p-6 bg-background">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="rounded-xl border border-border bg-secondary/10 p-5">
            <EditorialSurface
              text={editorialSurfaceText}
              font={surfaceFont}
              lineHeight={24}
              minHeight={420}
              lineRenderMode="justify"
              className="text-sm text-muted-foreground"
              figures={figures}
            />
          </div>

          <div className="text-sm text-muted-foreground leading-relaxed space-y-5">
            <div>
              <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">
                Developer model
              </p>
              <p>
                The figures are declared inputs to layout. As their sizes change, the surface recomputes the line slots and the article reroutes around the blocked regions.
              </p>
            </div>
            <div>
              <p className="text-xs font-mono uppercase tracking-wider text-primary mb-2">
                When to use it
              </p>
              <p>
                Reach for this when a single story needs wraparound text, pull quotes, badges, or artwork that participate in the text layout itself. Stay on the root package when you only need measured height or truncation.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 border-t border-border">
        <CodeBlock
          filename="text-reflow.tsx"
          code={`import { EditorialSurface } from '@santjc/react-pretext/editorial'

<EditorialSurface
  text={articleText}
  font="400 15px Geist, sans-serif"
  lineHeight={24}
  minHeight={420}
  lineRenderMode="justify"
  figures={[
    {
      shape: 'circle',
      width: ${scaledCircle},
      height: ${scaledCircle},
      placement: 'center-left',
      linePadding: 12,
      content: <Orb size={${scaledCircle}} />,
    },
    {
      shape: 'rect',
      width: ${scaledQuoteWidth},
      height: ${scaledQuoteHeight},
      placement: 'bottom-left',
      linePadding: 14,
      content: <PullQuote />,
    },
  ]}
/>`}
        />
      </div>
    </section>
  )
}
