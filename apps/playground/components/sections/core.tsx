"use client"

import { useMemo, useState } from "react"
import { PText, createPretextTypography, useMeasuredText, useTruncatedText } from "@santjc/react-pretext"
import { ShowcaseDemo } from "@/components/showcase-demo"

const measureMaxWidth = 400

function AccordionSection({
  title,
  content,
  isOpen,
  onOpen,
  typography,
}: {
  title: string
  content: string
  isOpen: boolean
  onOpen: () => void
  typography: ReturnType<typeof createPretextTypography>
}) {
  const { height, lineCount, isReady } = useMeasuredText({
    text: content,
    typography,
  })

  return (
    <div className="overflow-hidden rounded-md border border-border">
      <button
        onClick={onOpen}
        className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-secondary/50"
      >
        <span className="text-sm font-medium text-foreground">{title}</span>
        <span className="text-primary">{isOpen ? "−" : "+"}</span>
      </button>
      <div
        className="overflow-hidden transition-all duration-300 ease-out"
        style={{ height: isOpen && isReady ? `${height}px` : "0px" }}
      >
        <div className="p-4 pt-0">
          <div className="mb-2 flex justify-between text-xs font-mono text-muted-foreground">
            <span>{isReady ? `${lineCount} lines` : "Measuring"}</span>
            <span>{isReady ? `${height}px predicted` : "--"}</span>
          </div>
          <p className="text-foreground leading-relaxed" style={typography.style}>
            {content}
          </p>
        </div>
      </div>
    </div>
  )
}

// Demo 1: Measure
function MeasureDemo() {
  const [text, setText] = useState("Predict text height and line count from the same typography definition you already need to render the UI. When width is already known, layout decisions do not need hidden probes or scrollHeight-style DOM reads.")
  const [width, setWidth] = useState(360)
  const [fontSize, setFontSize] = useState(20)
  const [lineHeight, setLineHeight] = useState(30)
  const [fontWeight, setFontWeight] = useState("400")

  const typography = useMemo(
    () =>
      createPretextTypography({
        family: "Geist, sans-serif",
        size: fontSize,
        weight: Number(fontWeight),
        lineHeight,
        width,
      }),
    [fontSize, fontWeight, lineHeight, width],
  )

  const { height, lineCount, isReady } = useMeasuredText({ text, typography })

  const code = `const typography = createPretextTypography({
  family: 'Geist, sans-serif',
  size: ${fontSize},
  weight: ${Number(fontWeight)},
  lineHeight: ${lineHeight},
  width: ${width},
})

const { height, lineCount } = useMeasuredText({ text, typography })`

  return (
    <ShowcaseDemo
      id="measure"
      label="Start here"
      labelVariant="start"
      title="Measure text with one shared typography object"
      description="Start with the smallest truthful story in the package: define typography once, call useMeasuredText(), and use the returned height and line count inside ordinary component logic."
      metrics={[
        { label: "Preview lines", value: isReady ? lineCount : "--" },
        { label: "Preview height", value: isReady ? height : "--", unit: isReady ? "px" : undefined },
        { label: "Preview width", value: width, unit: "px" },
      ]}
      preview={
        <div className="flex min-h-[280px] items-center justify-center rounded-xl border border-dashed border-border bg-secondary/20 p-6">
          <div className="w-full max-w-full" style={{ maxWidth: `${width + 64}px` }}>
            <div className="mb-3 flex items-center justify-between text-xs font-mono uppercase tracking-wider text-muted-foreground">
              <span>Container {width}px</span>
              <span>{isReady ? `${height}px tall` : "Measuring"}</span>
            </div>
            <div className="rounded-[2rem] rounded-bl-md bg-primary px-4 py-3 text-primary-foreground shadow-sm">
              <p className="whitespace-pre-wrap" style={typography.style}>
                {text}
              </p>
            </div>
          </div>
        </div>
      }
      code={code}
      controls={
        <div className="space-y-6">
          <div className="space-y-2">
            <span className="text-sm text-muted-foreground block">Text</span>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <ShowcaseDemo.SliderControl label="Width" value={width} min={200} max={measureMaxWidth} onChange={setWidth} />
          <ShowcaseDemo.SliderControl
            label="Font size"
            value={fontSize}
            min={12}
            max={32}
            onChange={setFontSize}
          />
          <ShowcaseDemo.SliderControl
            label="Line height"
            value={lineHeight}
            min={16}
            max={48}
            onChange={setLineHeight}
          />
          <ShowcaseDemo.SelectControl
            label="Font weight"
            value={fontWeight}
            options={[
              { label: "400 (Regular)", value: "400" },
              { label: "500 (Medium)", value: "500" },
              { label: "600 (Semibold)", value: "600" },
              { label: "700 (Bold)", value: "700" },
            ]}
            onChange={setFontWeight}
          />
        </div>
      }
      callout={{
        title: "Shared Typography",
        content: (
          <>
            The same typography object can feed measurement and render output, so width, font, and line height do not drift apart.
          </>
        ),
      }}
    />
  )
}

// Demo 2: ScrollHeight Replacement
function ScrollHeightDemo() {
  const [accordionWidth, setAccordionWidth] = useState(360)
  const [bodySize, setBodySize] = useState(20)
  const [bodyLeading, setBodyLeading] = useState(30)
  const [openSection, setOpenSection] = useState(0)

  const sections = [
    {
      title: "Predictable heights from known inputs",
      content: "The open panel can use a predicted text height from width, font, and line height alone. That keeps accordion state out of the hidden-node and post-render scrollHeight path.",
    },
    {
      title: "Cheap width-driven relayout",
      content: "When the container width changes, recompute height from the updated typography inputs instead of measuring a rendered probe after each resize.",
    },
    {
      title: "Real semantic DOM stays intact",
      content: "The rendered body can stay a normal paragraph. The package does prediction work, while the UI keeps the semantic DOM it actually wants to ship.",
    },
  ]

  const bodyWidth = Math.max(0, accordionWidth - 32)
  const typography = useMemo(
    () =>
      createPretextTypography({
        family: "Geist, sans-serif",
        size: bodySize,
        weight: 400,
        lineHeight: bodyLeading,
        width: bodyWidth,
      }),
    [bodyLeading, bodySize, bodyWidth],
  )

  const code = `const typography = createPretextTypography({
  family: 'Geist, sans-serif',
  size: ${bodySize},
  weight: 400,
  lineHeight: ${bodyLeading},
  width: ${bodyWidth},
})

const { height } = useMeasuredText({ text, typography })

<div style={{ height: isOpen ? \`\${height}px\` : '0px' }} />`

  return (
    <ShowcaseDemo
      id="scrollheight"
      label="Migration"
      labelVariant="migration"
      title="Replace scrollHeight reads with predicted height"
      description="This is the migration path for normal UI: use measured text height before a panel opens instead of reading scrollHeight after render."
      metrics={[
        { label: "Sections", value: sections.length },
        { label: "Width", value: accordionWidth, unit: "px" },
        { label: "Open", value: openSection + 1 },
      ]}
      preview={
        <div className="space-y-2" style={{ maxWidth: `${accordionWidth}px` }}>
          {sections.map((section, index) => (
            <AccordionSection
              key={section.title}
              title={section.title}
              content={section.content}
              isOpen={openSection === index}
              onOpen={() => setOpenSection(index)}
              typography={typography}
            />
          ))}
        </div>
      }
      code={code}
      controls={
        <div className="space-y-6">
          <ShowcaseDemo.SliderControl
            label="Accordion width"
            value={accordionWidth}
            min={280}
            max={500}
            onChange={setAccordionWidth}
          />
          <ShowcaseDemo.SliderControl
            label="Body size"
            value={bodySize}
            min={14}
            max={28}
            onChange={setBodySize}
          />
          <ShowcaseDemo.SliderControl
            label="Body leading"
            value={bodyLeading}
            min={20}
            max={42}
            onChange={setBodyLeading}
          />
        </div>
      }
      callout={{
        title: "Why this matters",
        content: (
          <>
            Each panel gets a predicted height before it opens. That removes hidden probes and DOM reads tied to <code className="text-xs font-mono bg-background px-1 py-0.5 rounded">scrollHeight</code> while keeping real semantic paragraphs inside the accordion.
          </>
        ),
      }}
    />
  )
}

// Demo 3: Truncate
function TruncateDemo() {
  const [text, setText] = useState("Use deterministic preview text in result cards, compact rows, and teasers where the visible copy itself affects layout. The package can return the exact string that fits within a known line budget.")
  const [maxLines, setMaxLines] = useState(3)
  const [width, setWidth] = useState(360)
  const [fontSize, setFontSize] = useState(18)
  const lineHeight = Math.round(fontSize * 1.5)

  const typography = useMemo(
    () =>
      createPretextTypography({
        family: "Geist, sans-serif",
        size: fontSize,
        lineHeight,
        width,
      }),
    [fontSize, lineHeight, width],
  )

  const preview = useTruncatedText({
    text,
    typography,
    maxLines,
  })

  const code = `const typography = createPretextTypography({
  family: 'Geist, sans-serif',
  size: ${fontSize},
  lineHeight: ${lineHeight},
  width: ${width},
})

const preview = useTruncatedText({
  text,
  typography,
  maxLines: ${maxLines},
})

preview.text
preview.didTruncate
preview.visibleLineCount`

  return (
    <ShowcaseDemo
      id="truncate"
      label="Core"
      labelVariant="core"
      title="Truncate text to a known line budget"
      description="Use useTruncatedText() when the visible preview string needs to be deterministic before render, not just visually clamped after the fact."
      metrics={[
        { label: "Max lines", value: maxLines },
        { label: "Visible lines", value: preview.isReady ? preview.visibleLineCount : "--" },
        { label: "Truncated", value: preview.isReady ? (preview.didTruncate ? "Yes" : "No") : "--" },
      ]}
      preview={
        <div className="rounded-xl border border-border bg-secondary/20 p-5" style={{ maxWidth: `${width + 40}px` }}>
          <div className="mb-3 flex items-center justify-between text-xs font-mono uppercase tracking-wider text-muted-foreground">
            <span>Preview budget</span>
            <span>{width}px / {maxLines} lines</span>
          </div>
          <p className="text-foreground whitespace-pre-wrap" style={typography.style}>
            {preview.isReady ? preview.text : ""}
          </p>
        </div>
      }
      code={code}
      controls={
        <div className="space-y-6">
          <div className="space-y-2">
            <span className="text-sm text-muted-foreground block">Text</span>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <ShowcaseDemo.SliderControl
            label="Max lines"
            value={maxLines}
            min={1}
            max={6}
            unit=""
            onChange={setMaxLines}
          />
          <ShowcaseDemo.SliderControl
            label="Width"
            value={width}
            min={200}
            max={500}
            onChange={setWidth}
          />
          <ShowcaseDemo.SliderControl
            label="Font size"
            value={fontSize}
            min={14}
            max={24}
            onChange={setFontSize}
          />
        </div>
      }
      callout={{
        title: "Line-accurate",
        content: (
          <>
            Unlike CSS <code className="text-xs font-mono bg-background px-1 py-0.5 rounded">line-clamp</code>, this returns the actual truncated string. Use it in preview cards, list rows, teasers, or anywhere the visible text itself matters.
          </>
        ),
      }}
    />
  )
}

function PTextDemo() {
  const [containerWidth, setContainerWidth] = useState(320)
  const [fontSize, setFontSize] = useState(17)
  const [lineHeight, setLineHeight] = useState(26)
  const [measure, setMeasure] = useState({ width: 0, height: 0, lineCount: 0 })

  const typography = useMemo(
    () =>
      createPretextTypography({
        family: "Geist, sans-serif",
        size: fontSize,
        weight: 400,
        lineHeight,
      }),
    [fontSize, lineHeight],
  )

  const code = `const typography = createPretextTypography({
  family: 'Geist, sans-serif',
  size: ${fontSize},
  weight: 400,
  lineHeight: ${lineHeight},
})

const [measure, setMeasure] = useState({ width: 0, height: 0, lineCount: 0 })

<div style={{ width: ${containerWidth} }}>
  <PText
    as="p"
    typography={typography}
    onMeasure={setMeasure}
  >
    Semantic DOM stays aligned with the same typography input.
  </PText>
</div>`

  return (
    <ShowcaseDemo
      id="ptext"
      label="Core"
      labelVariant="core"
      title="Use PText when semantic DOM and measurement should stay aligned"
      description="PText is useful when you want a real paragraph in the DOM, width observation for responsive containers, and measurement data through onMeasure without wiring a separate probe element."
      metrics={[
        { label: "Observed width", value: measure.width || "--", unit: measure.width ? "px" : undefined },
        { label: "Measured height", value: measure.height || "--", unit: measure.height ? "px" : undefined },
        { label: "Line count", value: measure.lineCount || "--" },
      ]}
      preview={
        <div className="flex min-h-[260px] items-center justify-center rounded-xl border border-dashed border-border bg-secondary/20 p-6">
          <div className="w-full" style={{ maxWidth: `${containerWidth + 48}px` }}>
            <div className="mb-3 flex items-center justify-between text-xs font-mono uppercase tracking-wider text-muted-foreground">
              <span>Responsive container</span>
              <span>{containerWidth}px</span>
            </div>
            <div className="rounded-xl border border-border bg-background p-4 shadow-sm" style={{ width: `${containerWidth}px` }}>
              <PText
                as="p"
                typography={typography}
                className="text-foreground"
                onMeasure={setMeasure}
              >
                Semantic DOM stays aligned with the same typography input used for measurement. When the container width changes, PText observes it and reports the updated width, height, and line count.
              </PText>
            </div>
          </div>
        </div>
      }
      code={code}
      controls={
        <div className="space-y-6">
          <ShowcaseDemo.SliderControl
            label="Container width"
            value={containerWidth}
            min={220}
            max={460}
            onChange={setContainerWidth}
          />
          <ShowcaseDemo.SliderControl
            label="Font size"
            value={fontSize}
            min={14}
            max={24}
            onChange={setFontSize}
          />
          <ShowcaseDemo.SliderControl
            label="Line height"
            value={lineHeight}
            min={20}
            max={34}
            onChange={setLineHeight}
          />
        </div>
      }
      callout={{
        title: "Where it fits",
        content: (
          <>
            <code className="text-xs font-mono bg-background px-1 py-0.5 rounded">PText</code> is not the default for every text node. It fits when the rendered element should stay semantic and the component also needs aligned measurement output through <code className="text-xs font-mono bg-background px-1 py-0.5 rounded">onMeasure</code>.
          </>
        ),
      }}
    />
  )
}

export function CoreSection() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-mono uppercase tracking-wider text-primary mb-3">Core</p>
        <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-3 text-balance">
          The default adoption path in the root package
        </h2>
        <p className="text-muted-foreground leading-relaxed max-w-2xl">
          Start here when a component needs measured height, line count, deterministic preview text, or semantic DOM that stays aligned with the same typography inputs.
        </p>
      </div>

      <nav className="flex items-center gap-4 border-b border-border pb-4">
        <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Jump to:</span>
        <a href="#measure" className="text-sm text-foreground hover:text-primary transition-colors">Measure</a>
        <span className="text-muted-foreground">/</span>
        <a href="#scrollheight" className="text-sm text-foreground hover:text-primary transition-colors">ScrollHeight</a>
        <span className="text-muted-foreground">/</span>
        <a href="#truncate" className="text-sm text-foreground hover:text-primary transition-colors">Truncate</a>
        <span className="text-muted-foreground">/</span>
        <a href="#ptext" className="text-sm text-foreground hover:text-primary transition-colors">PText</a>
      </nav>

      <MeasureDemo />
      <ScrollHeightDemo />
      <TruncateDemo />
      <PTextDemo />
    </div>
  )
}
