# @santjc/react-pretext

Thin React primitives and re-exports for [`@chenglou/pretext`](https://www.npmjs.com/package/@chenglou/pretext).

This package does not try to replace pretext with a brand new layout system. It keeps the original primitive model and adds a small React layer where React actually helps.

## Installation

```bash
npm install @santjc/react-pretext react react-dom
```

## Stable API

The root package exports two things:

1. Re-exports from `@chenglou/pretext`
2. Thin React helpers

Stable React exports:

- `useElementWidth`
- `useMeasuredText`
- `usePreparedText`
- `usePreparedSegments`
- `usePretextLayout`
- `usePretextLines`
- `PText`

## Editorial API

Editorial helpers live on the advanced `editorial` subpath:

```ts
import {
  useTextFlow,
  flowText,
  carveLineSlots,
  createLineSlotResolver,
  getCircleBlockedLineRangeForRow,
  pickWidestLineSlot,
  PEditorialColumns,
  PEditorialSurface,
  PEditorialTrack,
  PEditorialFigure,
} from '@santjc/react-pretext/editorial'
```

Current editorial exports:

- `useTextFlow`
- `flowText`
- `carveLineSlots`
- `createLineSlotResolver`
- `getCircleBlockedLineRangeForRow`
- `pickWidestLineSlot`
- `PEditorialColumns`
- `PEditorialSurface`
- `PEditorialTrack`
- `PEditorialFigure`

These APIs are public and tested, but they are not part of the default root adoption path.

Reach for them when you need custom line rendering, obstacle-aware flow, or multi-column continuation.

## Examples

### Measure text with one hook

```tsx
import { createPretextTypography, useMeasuredText } from '@santjc/react-pretext'

function Example() {
  const text = 'Prepare once, layout often.'
  const typography = createPretextTypography({
    font: '400 18px Geist',
    lineHeight: 28,
    width: 320,
  })
  const { height, lineCount } = useMeasuredText({ text, typography })

  return <div>{height}px / {lineCount} lines</div>
}
```

Drop down to `usePreparedText` and `usePretextLayout` when you want to control the prepare and layout phases separately.

Enable profiling only when you need the timing metric:

```tsx
const { prepareMs } = useMeasuredText({
  text,
  typography,
  enableProfiling: true,
})
```

### Get actual lines from segmented text

```tsx
import { usePreparedSegments, usePretextLines } from '@santjc/react-pretext'

function Example() {
  const { prepared } = usePreparedSegments({
    text: 'Line-by-line rendering starts here.',
    font: "400 18px Geist",
  })

  const { lines } = usePretextLines({
    prepared,
    width: 280,
    lineHeight: 28,
  })

  return (
    <div>
      {lines.map((line, index) => (
        <div key={index}>{line.text}</div>
      ))}
    </div>
  )
}
```

### Use `PText`

```tsx
import { PText } from '@santjc/react-pretext'

function Example() {
  return (
    <PText
      as="p"
      font="400 18px Geist"
      lineHeight={28}
      width={320}
    >
      Semantic text with a thin measurement wrapper.
    </PText>
  )
}
```

### Editorial text flow

```tsx
import { usePreparedSegments } from '@santjc/react-pretext'
import { createLineSlotResolver, useTextFlow } from '@santjc/react-pretext/editorial'

function Example() {
  const { prepared } = usePreparedSegments({
    text: 'Flow text line by line.',
    font: "400 18px Geist",
  })

  const getLineSlotAtY = createLineSlotResolver({
    baseLineSlot: { left: 24, right: 320 },
    lineHeight: 28,
  })

  const { lines } = useTextFlow({
    prepared,
    lineHeight: 28,
    getLineSlotAtY,
  })

  return (
    <div>
      {lines.map((line, index) => (
        <div key={index} style={{ position: 'absolute', left: line.x, top: line.y }}>
          {line.text}
        </div>
      ))}
    </div>
  )
}
```

## Caveats

- `font` should match the actual rendered font declaration as closely as possible.
- Webfont loading can affect measurement accuracy until the font is ready.
- `PText` currently supports `string` children only.
- `prepareOptions` currently map directly to pretext preparation options, such as `whiteSpace`.
- `useTextFlow` expects a reference-stable `getLineSlotAtY` callback. Memoize custom resolvers in React.
- Editorial `lineRenderMode="justify"` uses pretext-derived `word-spacing` and will skip justification for unsupported whitespace patterns instead of delegating wrapping back to the browser.
- `PEditorialFigure` treats explicit `x` and `y` as overrides over `placement`, and clamps the result within available bounds.

The package exposes a small root API plus an advanced editorial subpath.
