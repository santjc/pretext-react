# @santjc/react-pretext

Simple React wrapper over [`@chenglou/pretext`](https://www.npmjs.com/package/@chenglou/pretext) for deterministic text measurement before paint, without DOM reads.

`@santjc/react-pretext` is intentionally a small React layer over `@chenglou/pretext`. It lets you predict text height and line count from text, typography, and width before the browser renders the final layout. The core use case is measurement-driven UI: accordions, cards, virtualized lists, previews, and any responsive layout where text height affects placement.

The package keeps the original `pretext` model intact and adds React-facing hooks, types, and semantic rendering helpers where React actually helps.

The intended adoption path is:

- define typography once
- measure text with `useMeasuredText()`
- render semantic DOM with `PText`
- use predicted heights in normal UI like accordions, cards, lists, and previews
- opt into editorial flow only when you need custom line routing

## Installation

```bash
npm install @santjc/react-pretext react react-dom
```

Peer dependencies: React 18 or 19.

## Why use it

- Predict text height before paint
- Avoid hidden measurement nodes and `scrollHeight` reads
- Truncate text to a known number of lines without DOM reads
- Keep measurement inputs and render styles aligned
- Re-layout from width changes without leaving the arithmetic path
- Drop down to lower-level hooks only when you need more control

## Start Here

### Measure text with one hook

```tsx
import { createPretextTypography, useMeasuredText } from '@santjc/react-pretext'

function Example({ text }: { text: string }) {
  const typography = createPretextTypography({
    family: 'Inter, sans-serif',
    size: 18,
    weight: 400,
    lineHeight: 28,
    width: 320,
  })

  const { height, lineCount } = useMeasuredText({ text, typography })

  return <div>{height}px / {lineCount} lines</div>
}
```

Use this for the common case where a component needs a known text height, line count, or both.

### Use shared typography with `PText`

```tsx
import { PText, createPretextTypography } from '@santjc/react-pretext'

function Example() {
  const body = createPretextTypography({
    family: 'Inter, sans-serif',
    size: 18,
    weight: 400,
    lineHeight: 28,
    width: 320,
  })

  return (
    <PText as="p" typography={body}>
      Semantic text with one source of truth for measurement and render output.
    </PText>
  )
}
```

`PText` is a semantic rendering helper for the shared typography object. It is useful when you want real DOM output to stay aligned with the same measurement inputs, but the main measurement story still starts with hooks.

### Let `PText` observe responsive width

```tsx
import { PText, createPretextTypography } from '@santjc/react-pretext'

function Example() {
  const body = createPretextTypography({
    family: 'Inter, sans-serif',
    size: 18,
    weight: 400,
    lineHeight: 28,
  })

  return (
    <div style={{ width: 'min(100%, 36rem)' }}>
      <PText as="p" typography={body}>
        This paragraph does not receive an explicit width. PText observes the element width and remeasures as the container changes.
      </PText>
    </div>
  )
}
```

### Replace hidden measurement or `scrollHeight`

Before:

```tsx
const ref = useRef<HTMLDivElement>(null)

useLayoutEffect(() => {
  setHeight(ref.current?.scrollHeight ?? 0)
}, [text, width])
```

After:

```tsx
import { createPretextTypography, useMeasuredText, PText } from '@santjc/react-pretext'

function AccordionBody({ isOpen, text }: { isOpen: boolean; text: string }) {
  const typography = createPretextTypography({
    family: 'Inter, sans-serif',
    size: 18,
    weight: 400,
    lineHeight: 28,
    width: 360,
  })

  const { height } = useMeasuredText({ text, typography })

  return (
    <div style={{ height: isOpen ? `${height}px` : '0px', overflow: 'hidden' }}>
      <PText as="p" typography={typography}>
        {text}
      </PText>
    </div>
  )
}
```

### Predict measured card or list heights

```tsx
import { createPretextTypography, useMeasuredText } from '@santjc/react-pretext'

function ResultCard({ text, width }: { text: string; width: number }) {
  const typography = createPretextTypography({
    family: 'Inter, sans-serif',
    size: 16,
    weight: 400,
    lineHeight: 26,
    width: width - 32,
  })

  const { height, lineCount } = useMeasuredText({ text, typography })

  return (
    <div>
      <div>{lineCount} lines</div>
      <div>predicted body height: {height}px</div>
    </div>
  )
}
```

This pattern works well for feeds, search results, CMS previews, issue lists, and any responsive grid where text height affects placement.

### Truncate text for previews and teasers

```tsx
import { PText, createPretextTypography, useTruncatedText } from '@santjc/react-pretext'

function ResultPreview({ text }: { text: string }) {
  const typography = createPretextTypography({
    family: 'Inter, sans-serif',
    size: 16,
    lineHeight: 24,
    width: 280,
  })

  const preview = useTruncatedText({
    text,
    typography,
    maxLines: 3,
  })

  return (
    <>
      <PText as="p" typography={typography}>{preview.text}</PText>
      {preview.didTruncate ? <button>Read more</button> : null}
    </>
  )
}
```

`useTruncatedText()` is meant for cards, snippets, collapsed previews, and compact list rows where the visible text itself needs to be deterministic before render.

## Typography input

`createPretextTypography()` accepts either a CSS font shorthand string or a structured typography object.

Structured input:

```tsx
const typography = createPretextTypography({
  family: 'Inter, sans-serif',
  size: 18,
  weight: 400,
  lineHeight: 28,
  width: 320,
})
```

Font shorthand input:

```tsx
const typography = createPretextTypography({
  font: '400 18px Inter, sans-serif',
  lineHeight: 28,
  width: 320,
})
```

The structured form is the recommended default because it is easier to read, easier to derive from design tokens, and less fragile in application code. Internally, both forms resolve to the same `font` string and matching render styles.

## Stable root API

The root package is the intentional React-facing surface.

- `createPretextTypography`
- `useElementWidth`
- `useMeasuredText`
- `usePreparedText`
- `usePreparedSegments`
- `usePretextLayout`
- `usePretextLines`
- `useTruncatedText`
- `PText`

Drop down to `usePreparedText()` and `usePretextLayout()` when you want to control the prepare and layout phases separately. Use `usePreparedSegments()` with `usePretextLines()` when you need actual line output.

## Low-level pretext API

Raw `@chenglou/pretext` exports live on a dedicated `pretext` subpath:

```ts
import {
  prepare,
  prepareWithSegments,
  layout,
  layoutWithLines,
  layoutNextLine,
  walkLineRanges,
} from '@santjc/react-pretext/pretext'
```

Use this subpath when you want the original low-level pretext model without the React-first root entrypoint.

## Editorial API

Editorial helpers live on the advanced `editorial` subpath:

```ts
import {
  FlowLines,
  useTextFlow,
  flowText,
  carveLineSlots,
  createLineSlotResolver,
  getCircleBlockedLineRangeForRow,
  pickWidestLineSlot,
  EditorialColumns,
  EditorialSurface,
  type EditorialTrack,
  type EditorialFigure,
} from '@santjc/react-pretext/editorial'
```

These APIs are public and tested, but they are not part of the default adoption path. Reach for them when you need custom line rendering, obstacle-aware flow, or multi-column continuation.

### Editorial mental model

- `EditorialSurface` owns one text surface and lets figures carve space out of the available line slots.
- `EditorialColumns` fragments one continuous text stream across multiple tracks while preserving reading order through a shared cursor.
- `EditorialFigure` is a config object passed inside `figures`, not a separate React component export.
- `font` should be a valid CSS font shorthand with an explicit size token (for example `400 15px Geist, sans-serif`).
- `placement` gives you a coarse position, while explicit `x` and `y` let you animate or fine-tune the figure inside the available bounds.
- `linePadding` expands the blocked area so text does not hug the figure too tightly.
- The figure content is still your React content. Keep it sized to the declared `width` and `height`, because the layout reserves that geometry for text flow but does not auto-layout the figure's internal children for you.

Use this subpath when the geometry itself is part of the layout model. If you only need measured height, line count, or truncation, stay on the root package.

### EditorialSurface example

Use `EditorialSurface` when one canvas owns the article and figures need to participate in wraparound layout:

```tsx
'use client'

import { EditorialSurface } from '@santjc/react-pretext/editorial'

export function FeatureBody({ text }: { text: string }) {
  return (
    <EditorialSurface
      text={text}
      font="400 15px Geist, sans-serif"
      lineHeight={24}
      minHeight={420}
      lineRenderMode="justify"
      figures={[
        {
          shape: 'circle',
          width: 88,
          height: 88,
          placement: 'center-left',
          linePadding: 12,
          content: <div className="rounded-full border border-border bg-muted/50" />,
        },
        {
          shape: 'rect',
          width: 180,
          height: 96,
          placement: 'bottom-left',
          linePadding: 14,
          content: <aside className="rounded-xl border border-border bg-card p-4">Pull quote</aside>,
        },
      ]}
    />
  )
}
```

### EditorialColumns example

Use `EditorialColumns` when one article needs to continue across multiple tracks with declared figures inside individual columns:

```tsx
'use client'

import { EditorialColumns } from '@santjc/react-pretext/editorial'

export function EditorialSpread({ text, figureX, figureY }: { text: string; figureX: number; figureY: number }) {
  return (
    <EditorialColumns
      text={text}
      font="400 15px Geist, sans-serif"
      lineHeight={24}
      gap={24}
      lineRenderMode="justify"
      tracks={[
        {
          fr: 1.1,
          minHeight: 420,
          paddingInline: 14,
          paddingBlock: 10,
          figures: [
            {
              shape: 'circle',
              width: 112,
              height: 112,
              x: figureX,
              y: figureY,
              linePadding: 16,
              content: <div className="rounded-full border border-border bg-muted/50" />,
            },
          ],
        },
        { fr: 0.95, minHeight: 420, paddingInline: 14, paddingBlock: 10 },
        { fr: 0.95, minHeight: 420, paddingInline: 14, paddingBlock: 10 },
      ]}
    />
  )
}
```

In this model, the article text is still one stream. The first track lays out until it runs out of space, then the next track continues from the returned cursor.

## SSR and runtime guidance

Measurement depends on canvas-backed text metrics, so the measurement hooks are a client-side feature.

- In Next.js and other SSR frameworks, call the hooks from client components.
- If you need a server-rendered fallback, render with a placeholder height and replace it after hydration.
- Keep measurement logic at the edge of the UI that actually needs it instead of pushing it into shared server code.

Example with a client component boundary:

```tsx
'use client'

import { createPretextTypography, useMeasuredText } from '@santjc/react-pretext'

export function MeasuredPreview({ text }: { text: string }) {
  const typography = createPretextTypography({
    family: 'Inter, sans-serif',
    size: 16,
    lineHeight: 24,
    width: 320,
  })

  const { height } = useMeasuredText({ text, typography })

  return <div style={{ minHeight: `${height}px` }}>{text}</div>
}
```

## Webfont guidance

Measurement is only as accurate as the font you actually render.

- Keep the measurement typography aligned with the real DOM font.
- Expect differences until a webfont finishes loading.
- If first-render accuracy matters, wait for the font before measuring or remeasure once the font is ready.

Example:

```tsx
useEffect(() => {
  document.fonts.ready.then(() => {
    setFontsReady(true)
  })
}, [])
```

## Caveats

- `createPretextTypography()` is the recommended way to keep measurement inputs and render styles aligned.
- `PText` currently supports `string` children only.
- `prepareOptions` currently map directly to pretext preparation options, such as `whiteSpace`.
- `useTextFlow` expects a reference-stable `getLineSlotAtY` callback. Memoize custom resolvers in React.
- Editorial `lineRenderMode="justify"` uses pretext-derived `word-spacing` and will skip justification for unsupported whitespace patterns instead of delegating wrapping back to the browser.
- `EditorialFigure` treats explicit `x` and `y` as overrides over `placement`, and clamps the result within available bounds.

## Source layout

The repository keeps package boundaries visible in the source tree:

- `src/core/*` backs the root package exports
- `src/editorial/*` backs `@santjc/react-pretext/editorial`
- `src/test/*` holds cross-entrypoint package tests

Playground helpers stay in `apps/playground/src/lib/*` unless they are intentionally promoted into the package with matching tests and docs.
