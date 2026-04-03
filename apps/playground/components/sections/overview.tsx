import { AdoptionPath } from "@/components/adoption-path"
import { DemoCard } from "@/components/demo-card"
import { SectionHeader } from "@/components/section-header"

export function OverviewSection() {
  return (
    <div className="space-y-16">
      <section className="space-y-6">
        <div className="border border-border rounded-lg p-6 md:p-8">
          <span className="inline-block text-xs font-medium text-primary uppercase tracking-wider mb-4">
            Start here
          </span>
          <h2 className="text-2xl font-semibold text-foreground mb-3 text-balance md:text-3xl">
            Start from real UI problems, not the advanced edge cases.
          </h2>
          <p className="text-muted-foreground leading-relaxed max-w-2xl">
            The root package is the default path: define typography once, measure text from known width, and use those results in real React UI. The editorial subpath is public too, but it is for layouts where figures, fixed geometry, or track continuation need to shape the text flow.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-xs font-mono">
            <span className="px-2.5 py-1 bg-secondary rounded border border-border text-foreground">
              Package <span className="text-muted-foreground">0.1.0</span>
            </span>
            <span className="px-2.5 py-1 bg-secondary rounded border border-border text-foreground">
              Surface <span className="text-primary">root / editorial / pretext</span>
            </span>
            <span className="px-2.5 py-1 bg-secondary rounded border border-border text-foreground">
              Focus <span className="text-primary">measurement-driven UI and explicit flow</span>
            </span>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <SectionHeader label="Recommended adoption path" />
        <AdoptionPath />
      </section>

      <section className="space-y-6">
        <SectionHeader 
          label="Core demos" 
          title="Start from the public root package"
          description="These demos cover the main adoption path: shared typography, predicted height, deterministic preview text, and semantic rendering that stays aligned with the same measurement inputs."
        />
        <div className="grid gap-4 md:grid-cols-2">
          <DemoCard
            number="01"
            tag="Start here"
            tagVariant="primary"
            title="Core path"
            description="Measure text, replace scrollHeight-style panel logic, generate deterministic previews, and use PText when semantic DOM and measurement need to stay aligned."
            action="Open route"
            href="/core"
          />
          <DemoCard
            number="02"
            tag="Core"
            tagVariant="default"
            title="Measured cards and lists"
            description="Use measured title and body text to estimate card height before packing a feed or masonry-style layout."
            action="Open route"
            href="/cards"
          />
        </div>
      </section>

      <section className="space-y-6">
        <SectionHeader 
          label="Advanced demos" 
          title="Reach for editorial flow when geometry becomes part of layout"
          description="These routes use the public editorial exports for declared figures, obstacle-aware flow, and track-based continuation."
        />
        <div className="grid gap-4 md:grid-cols-2">
          <DemoCard
            number="01"
            tag="Advanced"
            tagVariant="muted"
            title="Dynamic Layout"
            description="A bounded spread built from lower-level editorial primitives, useful when you need explicit slots and line routing instead of a single measured block."
            action="Open route"
            href="/dynamic-layout"
          />
          <DemoCard
            number="02"
            tag="Advanced"
            tagVariant="muted"
            title="Editorial Engine"
            description="Animated figures, live reflow, and multi-track continuation shown through EditorialColumns and EditorialSurface."
            action="Open route"
            href="/editorial-engine"
          />
          <DemoCard
            number="03"
            tag="Advanced"
            tagVariant="muted"
            title="Editorial"
            description="A denser editorial composition that stays grounded in the current public API: surfaces, figures, justified lines, and package boundaries."
            action="Open route"
            href="/editorial"
          />
        </div>
      </section>
    </div>
  )
}
