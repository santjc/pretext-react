export function Header() {
  return (
    <header className="space-y-4">
      <p className="font-mono text-sm text-primary tracking-wide">
        @santjc/react-pretext
      </p>
      <h1 className="text-4xl font-semibold tracking-tight text-foreground leading-tight text-balance md:text-5xl">
        Deterministic text measurement
        <br />
        for React
      </h1>
      <p className="max-w-xl text-muted-foreground leading-relaxed">
        A React wrapper over pretext for predicting text layout from known typography and width. Start with measurement-driven UI in the root package, then reach for the editorial subpath when declared geometry needs to shape the flow.
      </p>
    </header>
  )
}
