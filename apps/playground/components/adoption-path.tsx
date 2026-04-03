const steps = [
  {
    number: "01",
    description:
      "Create one typography object so font, line height, and width stay aligned anywhere you measure or render text.",
    highlighted: true,
  },
  {
    number: "02",
    description:
      "Start with useMeasuredText() when a component needs a predicted height or line count from known width and typography.",
  },
  {
    number: "03",
    description:
      "Use PText when semantic DOM and measurement should stay aligned, including responsive width observation through onMeasure.",
  },
  {
    number: "04",
    description:
      "Apply measured heights or useTruncatedText() in accordions, previews, cards, and feeds before reaching for editorial flow.",
  },
]

export function AdoptionPath() {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      {steps.map((step) => (
        <div
          key={step.number}
          className={`relative p-4 border rounded-lg ${
            step.highlighted
              ? "border-l-2 border-l-primary border-t-border border-r-border border-b-border bg-secondary/30"
              : "border-border"
          }`}
        >
          <span className="text-xs font-mono text-muted-foreground mb-2 block">
            {step.number}
          </span>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {step.description}
          </p>
        </div>
      ))}
    </div>
  )
}
