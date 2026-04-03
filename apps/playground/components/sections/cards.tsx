"use client"

import { useState, useMemo } from "react"
import { createPretextTypography, useMeasuredText } from "@santjc/react-pretext"
import { Slider } from "@/components/ui/slider"
import { useIsMobile } from "@/hooks/use-mobile"
import { CodeBlock } from "@/components/code-block"

function ControlSlider({
  label,
  value,
  min,
  max,
  unit = "px",
  suffix,
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  unit?: string
  suffix?: string
  onChange: (value: number) => void
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-baseline justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="text-sm font-mono text-foreground">
          {value}{unit}{suffix && <span className="text-muted-foreground ml-1">{suffix}</span>}
        </span>
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

function MetricBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-r border-border last:border-r-0 px-4 first:pl-0 py-2">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className="text-lg font-mono text-foreground">{value}</p>
    </div>
  )
}

interface CardData {
  id: number
  title: string
  description: string
  lines: number
  height: number
}

const cardChromeHeight = 68
const cardGap = 16

const cardContent: Omit<CardData, "lines" | "height">[] = [
  {
    id: 1,
    title: "Predict text-heavy card height before placement",
    description: "In feeds where body copy is the main variable, predicted text height lets the layout reason about occupancy before every card has to render and report its size.",
  },
  {
    id: 2,
    title: "Repack from width changes",
    description: "When responsive columns get narrower or wider, text height can be recalculated from typography and width instead of remeasuring hidden DOM clones for every item.",
  },
  {
    id: 3,
    title: "Useful across previews and lists",
    description: "The same pattern fits search results, CMS previews, issue lists, notes, and mixed media cards where text height changes placement or estimated scroll space.",
  },
  {
    id: 4,
    title: "Expose height and line count directly",
    description: "Because measurement is explicit, a card can show predicted line count and body height directly instead of treating them as incidental browser output.",
  },
  {
    id: 5,
    title: "Works without inventing a new render model",
    description: "The measurement result can feed a packing algorithm, estimated row height, or card preview without forcing the rest of the component tree into a custom text renderer.",
  },
  {
    id: 6,
    title: "Better estimates for dense UIs",
    description: "As the number of cards climbs, deterministic text measurement becomes more useful for estimating occupancy, placement, and scroll behavior before the full grid settles.",
  },
]

export function CardsSection() {
  const isMobile = useIsMobile()
  const [containerWidth, setContainerWidth] = useState(720)
  const [columns, setColumns] = useState(2)
  const [bodySize, setBodySize] = useState(16)
  const [bodyLeading, setBodyLeading] = useState(26)
  const titleLeading = Math.round(bodySize * 1.25)
  const effectiveColumns = isMobile ? 1 : columns

  const columnWidth = useMemo(() => {
    return Math.floor((containerWidth - cardGap * (effectiveColumns - 1)) / effectiveColumns)
  }, [containerWidth, effectiveColumns])

  const textWidth = Math.max(0, columnWidth - 32)

  const titleTypography = useMemo(
    () =>
      createPretextTypography({
        family: "Geist, sans-serif",
        size: bodySize,
        weight: 600,
        lineHeight: titleLeading,
        width: textWidth,
      }),
    [bodySize, textWidth, titleLeading],
  )

  const bodyTypography = useMemo(
    () =>
      createPretextTypography({
        family: "Geist, sans-serif",
        size: bodySize,
        weight: 400,
        lineHeight: bodyLeading,
        width: textWidth,
      }),
    [bodyLeading, bodySize, textWidth],
  )

  const title1 = useMeasuredText({ text: cardContent[0].title, typography: titleTypography })
  const body1 = useMeasuredText({ text: cardContent[0].description, typography: bodyTypography })
  const title2 = useMeasuredText({ text: cardContent[1].title, typography: titleTypography })
  const body2 = useMeasuredText({ text: cardContent[1].description, typography: bodyTypography })
  const title3 = useMeasuredText({ text: cardContent[2].title, typography: titleTypography })
  const body3 = useMeasuredText({ text: cardContent[2].description, typography: bodyTypography })
  const title4 = useMeasuredText({ text: cardContent[3].title, typography: titleTypography })
  const body4 = useMeasuredText({ text: cardContent[3].description, typography: bodyTypography })
  const title5 = useMeasuredText({ text: cardContent[4].title, typography: titleTypography })
  const body5 = useMeasuredText({ text: cardContent[4].description, typography: bodyTypography })
  const title6 = useMeasuredText({ text: cardContent[5].title, typography: titleTypography })
  const body6 = useMeasuredText({ text: cardContent[5].description, typography: bodyTypography })

  const titleMeasurements = useMemo(
    () => [title1, title2, title3, title4, title5, title6],
    [title1, title2, title3, title4, title5, title6],
  )
  const bodyMeasurements = useMemo(
    () => [body1, body2, body3, body4, body5, body6],
    [body1, body2, body3, body4, body5, body6],
  )

  const cards = useMemo<CardData[]>(() => {
    return cardContent.map((card) => {
      const index = card.id - 1
      const titleMeasurement = titleMeasurements[index]
      const bodyMeasurement = bodyMeasurements[index]

      return {
        ...card,
        lines: bodyMeasurement?.isReady ? bodyMeasurement.lineCount : 0,
        height:
          titleMeasurement?.isReady && bodyMeasurement?.isReady
            ? cardChromeHeight + titleMeasurement.height + bodyMeasurement.height
            : 0,
      }
    })
  }, [bodyMeasurements, titleMeasurements])

  const packedColumns = useMemo(() => {
    const nextColumns = Array.from({ length: effectiveColumns }, () => ({ cards: [] as CardData[], height: 0 }))

    cards.forEach((card) => {
      const shortestColumnIndex = nextColumns.reduce((bestIndex, column, index, allColumns) => {
        return column.height < allColumns[bestIndex].height ? index : bestIndex
      }, 0)

      const nextColumn = nextColumns[shortestColumnIndex]
      nextColumn.cards.push(card)
      nextColumn.height += card.height
      if (nextColumn.cards.length > 1) {
        nextColumn.height += cardGap
      }
    })

    return nextColumns
  }, [cards, effectiveColumns])

  const tallestColumn = useMemo(() => {
    return Math.max(...packedColumns.map((column) => column.height), 0)
  }, [packedColumns])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <p className="text-xs font-mono uppercase tracking-wider text-primary mb-3">Cards and Lists</p>
        <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-3 text-balance">
          Measured cards from responsive width
        </h2>
        <p className="text-muted-foreground leading-relaxed max-w-2xl">
          This keeps the root-package story in a feed layout: derive a column width, reuse shared typography, and predict text-driven card heights before a packing pass has to ask the DOM how tall every item became.
        </p>
        <div className="mt-4">
          <span className="inline-block text-xs font-mono uppercase tracking-wider px-2 py-1 border border-primary/50 text-primary rounded">
            Stable Primitives
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="border border-border rounded-lg bg-card p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <ControlSlider
            label="Container width"
            value={containerWidth}
            min={400}
            max={1000}
            onChange={setContainerWidth}
          />
          <ControlSlider
            label="Columns"
            value={columns}
            min={1}
            max={Math.min(4, Math.floor(containerWidth / 200))}
            unit=""
            onChange={(v) => setColumns(v)}
          />
          <ControlSlider
            label="Body size"
            value={bodySize}
            min={12}
            max={20}
            onChange={setBodySize}
          />
          <ControlSlider
            label="Body leading"
            value={bodyLeading}
            min={18}
            max={36}
            onChange={setBodyLeading}
          />
        </div>
      </div>

      {/* Demo Card */}
      <div className="border border-border rounded-lg bg-card overflow-hidden">
        {/* Metrics Row */}
        <div className="p-6 border-b border-border bg-secondary/20">
          <div className="flex flex-wrap">
            <MetricBox label="Cards" value={cards.length.toString()} />
            <MetricBox label="Column width" value={`${columnWidth}px`} />
            <MetricBox label="Predicted tallest column" value={`${tallestColumn}px`} />
          </div>
        </div>

        {/* Cards Grid */}
        <div className="p-6 bg-background">
          <div
            className="mx-auto"
            style={{ maxWidth: `${containerWidth}px` }}
          >
              <div
                className="grid gap-4"
                style={{
                  gridTemplateColumns: `repeat(${effectiveColumns}, 1fr)`,
                }}
              >
              {packedColumns.map((column, columnIndex) => (
                <div key={columnIndex} className="space-y-4">
                  {column.cards.map((card) => (
                    <div key={card.id} className="border border-border rounded-lg p-4 bg-card">
                      <div className="flex items-center justify-between mb-3 gap-2">
                        <span className="text-xs font-mono px-2 py-0.5 bg-secondary rounded text-muted-foreground">
                          {card.lines} lines
                        </span>
                        <span className="text-xs font-mono text-muted-foreground">
                          {card.height}px predicted
                        </span>
                      </div>

                      <h4
                        className="mb-2 text-foreground"
                        style={{
                          fontSize: `${bodySize}px`,
                          lineHeight: `${titleLeading}px`,
                          fontWeight: 600,
                        }}
                      >
                        {card.title}
                      </h4>
                      <p
                        className="text-muted-foreground"
                        style={{
                          fontSize: `${bodySize}px`,
                          lineHeight: `${bodyLeading}px`,
                        }}
                      >
                        {card.description}
                      </p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Code */}
        <div className="p-6 border-t border-border">
          <CodeBlock
            filename="masonry-feed.tsx"
            code={`const typography = createPretextTypography({
  family: 'Geist, sans-serif',
  size: ${bodySize},
  weight: 400,
  lineHeight: ${bodyLeading},
  width: ${textWidth},
})

function ResultCard({ item }: { item: Item }) {
  const { height, lineCount } = useMeasuredText({
    text: item.description,
    typography,
  })

  return <article data-height={height}>{lineCount} lines</article>
}

const packedColumns = packByShortestColumn(items, (item) => item.predictedHeight)

// A masonry or feed layout can consume those predicted heights
// without measuring hidden DOM probes for each card.`}
          />
        </div>
      </div>
    </div>
  )
}
