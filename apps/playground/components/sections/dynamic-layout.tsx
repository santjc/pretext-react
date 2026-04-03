"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { usePreparedSegments } from "@santjc/react-pretext"
import {
  FlowLines,
  createLineSlotResolver,
  getCircleBlockedLineRangeForRow,
  useTextFlow,
} from "@santjc/react-pretext/editorial"
import { CodeBlock } from "@/components/code-block"
import { Slider } from "@/components/ui/slider"

const dynamicTitle =
  "Dynamic layouts can reroute headlines and body copy around fixed obstacles without asking the browser where the text landed."

const dynamicBody = `The point of the spread is not merely that text wraps. The point is that every line is routed from explicit geometry. Resize the stage and the route changes immediately while the prepared text remains reusable.

This is useful when a layout behaves more like a composition engine than a block stack. Logos, badges, illustrations, or product callouts can all reserve space in the middle of the article without forcing the rest of the page back through hidden DOM measurement.

The layout stays legible because pretext still owns the line breaking while JavaScript owns the geometry. That split is what makes the result feel deterministic instead of improvised. Lorem ipsum is unnecessary here because the demo already has enough real copy to expose the routing pattern.`

const stagePadding = 28
const titleBadge = { x: 660, y: 24, width: 176, height: 86 }

function getRectBlockedRange({
  x,
  y,
  width,
  height,
  lineTop,
  lineBottom,
  padding = 0,
}: {
  x: number
  y: number
  width: number
  height: number
  lineTop: number
  lineBottom: number
  padding?: number
}) {
  const top = y - padding
  const bottom = y + height + padding

  if (lineBottom <= top || lineTop >= bottom) {
    return null
  }

  return {
    left: x - padding,
    right: x + width + padding,
  }
}

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
      <div className="flex items-baseline justify-between gap-3">
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

export function DynamicLayoutSection() {
  const [width, setWidth] = useState(860)
  const [height, setHeight] = useState(620)
  const [lineHeight, setLineHeight] = useState(26)
  const [maxStageWidth, setMaxStageWidth] = useState(980)
  const stageWrapRef = useRef<HTMLDivElement>(null)
  const titleFont = "700 34px Geist, sans-serif"
  const bodyFont = "400 16px Geist, sans-serif"

  useEffect(() => {
    const element = stageWrapRef.current
    if (element === null) {
      return
    }

    const measure = () => {
      setMaxStageWidth(Math.max(640, Math.min(980, Math.floor(element.clientWidth - 2))))
    }

    measure()

    const observer = new ResizeObserver(measure)
    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [])

  const layoutWidth = Math.min(width, maxStageWidth)
  const stageSliderMin = 640
  const stageSliderMax = Math.max(stageSliderMin, maxStageWidth)

  const titlePrepared = usePreparedSegments({ text: dynamicTitle, font: titleFont })
  const bodyPrepared = usePreparedSegments({
    text: dynamicBody,
    font: bodyFont,
    options: { whiteSpace: "pre-wrap" },
  })

  const obstacleAX = Math.round(layoutWidth * 0.12)
  const obstacleAY = 42
  const obstacleARadius = 58
  const obstacleBX = Math.round(layoutWidth * 0.78)
  const obstacleBY = 78
  const obstacleBRadius = 84
  const obstacleCX = Math.round(layoutWidth * 0.68)
  const obstacleCY = 292
  const obstacleCRadius = 74

  const titleSlotResolver = useMemo(
    () =>
      createLineSlotResolver({
        baseLineSlot: { left: 28, right: layoutWidth - 28 },
        lineHeight: 42,
        minWidth: 240,
        getBlockedLineRanges: (lineTop, lineBottom) => {
          const blocked = [
            { x: obstacleAX, y: obstacleAY, radius: obstacleARadius },
            { x: obstacleBX, y: obstacleBY, radius: obstacleBRadius },
          ].flatMap((orb) => {
            const blocked = getCircleBlockedLineRangeForRow({
              cx: orb.x,
              cy: orb.y,
              radius: orb.radius,
              lineTop,
              lineBottom,
              horizontalPadding: 18,
            })

            return blocked === null ? [] : [blocked]
          })

          const badgeRange = getRectBlockedRange({
            x: Math.min(layoutWidth - titleBadge.width - stagePadding, titleBadge.x),
            y: titleBadge.y,
            width: titleBadge.width,
            height: titleBadge.height,
            lineTop,
            lineBottom,
            padding: 16,
          })

          if (badgeRange !== null) {
            blocked.push(badgeRange)
          }

          return blocked
        },
      }),
    [layoutWidth, obstacleARadius, obstacleAX, obstacleAY, obstacleBRadius, obstacleBX, obstacleBY],
  )

  const bodySlotResolver = useMemo(
    () =>
      createLineSlotResolver({
        baseLineSlot: { left: stagePadding, right: layoutWidth - stagePadding },
        lineHeight,
        minWidth: 180,
        getBlockedLineRanges: (lineTop, lineBottom) =>
          [{ x: obstacleCX, y: obstacleCY, radius: obstacleCRadius }].flatMap((orb) => {
            const blocked = getCircleBlockedLineRangeForRow({
              cx: orb.x,
              cy: orb.y,
              radius: orb.radius,
              lineTop,
              lineBottom,
              horizontalPadding: 16,
            })

            return blocked === null ? [] : [blocked]
          }),
      }),
    [layoutWidth, lineHeight, obstacleCRadius, obstacleCX, obstacleCY],
  )

  const titleFlow = useTextFlow({
    prepared: titlePrepared.prepared,
    lineHeight: 42,
    getLineSlotAtY: titleSlotResolver,
    maxY: 196,
  })

  const bodyFlow = useTextFlow({
    prepared: bodyPrepared.prepared,
    lineHeight,
    getLineSlotAtY: bodySlotResolver,
    startY: 218,
    maxY: height - 24,
  })

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-mono uppercase tracking-wider text-primary mb-3">Dynamic Layout</p>
        <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-3 text-balance">
          Fixed-height spread with routed text
        </h2>
        <p className="text-muted-foreground leading-relaxed max-w-2xl">
          This route shows the lower-level editorial escape hatch. The headline and body both flow through explicit slots, and the stage responds to real geometry instead of post-render text probing.
        </p>
        <div className="mt-4">
          <span className="inline-block text-xs font-mono uppercase tracking-wider px-2 py-1 border border-blue-400 text-blue-400 rounded">
            Advanced Subpath
          </span>
        </div>
      </div>

      <section className="border border-border rounded-lg bg-card overflow-hidden">
        <div className="p-6 border-b border-border bg-secondary/20">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            <ControlSlider label="Stage width" value={layoutWidth} min={stageSliderMin} max={stageSliderMax} onChange={setWidth} />
            <ControlSlider label="Stage height" value={height} min={420} max={680} onChange={setHeight} />
            <ControlSlider label="Body leading" value={lineHeight} min={22} max={34} onChange={setLineHeight} />
            <div className="rounded-lg border border-border bg-background p-4 text-sm text-muted-foreground leading-relaxed">
              <p className="text-xs font-mono uppercase tracking-wider text-primary mb-2">Why it matters</p>
              <p>The stage keeps one deterministic line-breaking model while geometry changes around it. That is the useful part of the demo, not the chrome around the page.</p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-background space-y-6">
          <div className="flex flex-wrap gap-3">
            <div className="border border-border rounded-md p-3 bg-card">
              <p className="text-xs text-muted-foreground mb-1 font-mono uppercase tracking-wider">Headline lines</p>
              <p className="text-lg font-mono text-foreground">{titleFlow.lines.length}</p>
            </div>
            <div className="border border-border rounded-md p-3 bg-card">
              <p className="text-xs text-muted-foreground mb-1 font-mono uppercase tracking-wider">Body lines</p>
              <p className="text-lg font-mono text-foreground">{bodyFlow.lines.length}</p>
            </div>
            <div className="border border-border rounded-md p-3 bg-card">
              <p className="text-xs text-muted-foreground mb-1 font-mono uppercase tracking-wider">Body status</p>
              <p className="text-lg font-mono text-foreground">{bodyFlow.exhausted ? "Complete" : "Truncated"}</p>
            </div>
          </div>

          <div ref={stageWrapRef} className="mx-auto max-w-[1040px] rounded-xl border border-border bg-[#0b0d10] p-4 md:p-6 overflow-x-auto">
            <div
              className="relative overflow-hidden rounded-[28px] border border-white/8 bg-[radial-gradient(circle_at_top_left,_rgba(109,40,217,0.12),_transparent_32%),linear-gradient(180deg,#171a21_0%,#101319_100%)]"
              style={{ width: `${layoutWidth}px`, height: `${height}px` }}
            >
              <div className="absolute inset-x-0 top-0 h-[196px] border-b border-white/8" />
              <div className="absolute right-7 top-6 w-44 rounded-2xl border border-primary/30 bg-primary/10 p-4 text-xs uppercase tracking-[0.18em] text-primary">
                Slot-driven title routing
              </div>

              <div
                className="absolute rounded-full border border-primary/25 bg-primary/12"
                style={{ left: `${obstacleAX - obstacleARadius}px`, top: `${obstacleAY - obstacleARadius}px`, width: `${obstacleARadius * 2}px`, height: `${obstacleARadius * 2}px` }}
              />
              <div
                className="absolute rounded-full border border-orange-300/30 bg-orange-400/10"
                style={{ left: `${obstacleBX - obstacleBRadius}px`, top: `${obstacleBY - obstacleBRadius}px`, width: `${obstacleBRadius * 2}px`, height: `${obstacleBRadius * 2}px` }}
              />
              <div
                className="absolute rounded-full border border-sky-300/20 bg-sky-400/10"
                style={{ left: `${obstacleCX - obstacleCRadius}px`, top: `${obstacleCY - obstacleCRadius}px`, width: `${obstacleCRadius * 2}px`, height: `${obstacleCRadius * 2}px` }}
              />

              <FlowLines
                lines={titleFlow.lines}
                font={titleFont}
                lineHeight={42}
                lineClassName="font-semibold tracking-tight text-white"
              />

              <FlowLines
                lines={bodyFlow.lines}
                font={bodyFont}
                lineHeight={lineHeight}
                lineClassName="text-slate-300"
              />
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <div className="rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground leading-relaxed lg:col-span-2">
              <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">Reading the stage</p>
              <p>The headline uses its own slot resolver with two circular blockers. The body starts lower in the stage and routes around a separate obstacle, so the line path changes without introducing a second text renderer or a hidden measurement DOM.</p>
            </div>
            <div className="rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground leading-relaxed">
              <p className="text-xs font-mono uppercase tracking-wider text-primary mb-2">Public primitives</p>
              <p>This route is built from <code className="text-xs font-mono bg-background px-1 py-0.5 rounded">usePreparedSegments</code>, <code className="text-xs font-mono bg-background px-1 py-0.5 rounded">useTextFlow</code>, <code className="text-xs font-mono bg-background px-1 py-0.5 rounded">createLineSlotResolver</code>, and <code className="text-xs font-mono bg-background px-1 py-0.5 rounded">FlowLines</code>.</p>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-border">
          <CodeBlock
            filename="dynamic-layout.tsx"
            code={`import { usePreparedSegments } from '@santjc/react-pretext'
import {
  FlowLines,
  createLineSlotResolver,
  getCircleBlockedLineRangeForRow,
  useTextFlow,
} from '@santjc/react-pretext/editorial'

const titlePrepared = usePreparedSegments({ text: title, font: '700 34px Geist, sans-serif' })

const titleResolver = createLineSlotResolver({
  baseLineSlot: { left: 28, right: ${layoutWidth - 28} },
  lineHeight: 42,
  minWidth: 240,
  getBlockedLineRanges: (lineTop, lineBottom) => {
    const blocked = getCircleBlockedLineRangeForRow({
      cx: ${obstacleBX},
      cy: ${obstacleBY},
      radius: ${obstacleBRadius},
      lineTop,
      lineBottom,
      horizontalPadding: 18,
    })

    const badge = { left: ${Math.min(layoutWidth - titleBadge.width - stagePadding, titleBadge.x)}, right: ${Math.min(layoutWidth - stagePadding, Math.min(layoutWidth - titleBadge.width - stagePadding, titleBadge.x) + titleBadge.width)} }

    return blocked === null ? [badge] : [blocked, badge]
  },
})

const titleFlow = useTextFlow({
  prepared: titlePrepared.prepared,
  lineHeight: 42,
  getLineSlotAtY: titleResolver,
  maxY: 196,
})

<FlowLines lines={titleFlow.lines} font="700 34px Geist, sans-serif" lineHeight={42} />`}
          />
        </div>
      </section>
    </div>
  )
}
