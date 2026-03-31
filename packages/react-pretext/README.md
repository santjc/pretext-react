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
- `usePreparedText`
- `usePreparedSegments`
- `usePretextLayout`
- `usePretextLines`
- `PText`

## Experimental API

Experimental helpers are exported from a separate subpath:

```ts
import { useTextFlow, flowText, carveLineSlots } from '@santjc/react-pretext/experimental'
```

Current experimental exports:

- `useTextFlow`
- `flowText`
- `carveLineSlots`
- `createLineSlotResolver`
- `getCircleBlockedLineRangeForRow`
- `pickWidestLineSlot`

These APIs are useful and tested, but their naming and shape may still evolve.

## Examples

### Measure text with prepared text + layout

```tsx
import { usePreparedText, usePretextLayout } from '@santjc/react-pretext'

function Example() {
  const text = 'Prepare once, layout often.'
  const font = "400 18px Geist"
  const { prepared } = usePreparedText({ text, font })
  const { height, lineCount } = usePretextLayout({
    prepared,
    width: 320,
    lineHeight: 28,
  })

  return <div>{height}px / {lineCount} lines</div>
}
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

### Experimental text flow

```tsx
import { usePreparedSegments } from '@santjc/react-pretext'
import { createLineSlotResolver, useTextFlow } from '@santjc/react-pretext/experimental'

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
- Experimental APIs are exported intentionally, but they are more likely to change than the stable root API.
