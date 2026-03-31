# @santjc/react-pretext

Thin React primitives and re-exports for [`@chenglou/pretext`](https://www.npmjs.com/package/@chenglou/pretext).

`@santjc/react-pretext` is designed to keep the original `pretext` mental model intact:

- prepare text once
- lay it out many times
- use richer line-level primitives when composition gets more advanced

The package does not try to hide `pretext` behind a large framework. Instead, it gives you a small React layer where React actually helps: width observation, memoized preparation, semantic DOM components, and opt-in experimental composition helpers.

## Features

- Re-exports the core `pretext` API
- Thin React hooks over `prepare`, `prepareWithSegments`, `layout`, and `layoutWithLines`
- `PText` component for semantic DOM text with measurement support
- Width observation with `ResizeObserver`
- Experimental text flow helpers for obstacle-aware layouts
- Works well as a foundation for chat bubbles, measurement-heavy UIs, and editorial layout experiments

## Installation

```bash
npm install @santjc/react-pretext react react-dom
```

## Stable API

Import stable APIs from the package root:

```ts
import {
  prepare,
  prepareWithSegments,
  layout,
  layoutWithLines,
  layoutNextLine,
  walkLineRanges,
  useElementWidth,
  usePreparedText,
  usePreparedSegments,
  usePretextLayout,
  usePretextLines,
  PText,
} from '@santjc/react-pretext'
```

### Stable exports

- `prepare`, `prepareWithSegments`, `layout`, `layoutWithLines`, `layoutNextLine`, `walkLineRanges`
- `useElementWidth`
- `usePreparedText`
- `usePreparedSegments`
- `usePretextLayout`
- `usePretextLines`
- `PText`

## Experimental API

Import experimental APIs from a dedicated subpath:

```ts
import {
  useTextFlow,
  flowText,
  carveLineSlots,
  createLineSlotResolver,
  getCircleBlockedLineRangeForRow,
  pickWidestLineSlot,
} from '@santjc/react-pretext/experimental'
```

These APIs are useful and tested, but they are still more likely to change than the stable root API.

## Why this package exists

`pretext` already solves the hard text problem: measuring and laying out text without relying on DOM layout reads.

What React applications still need is a thin layer that makes those primitives pleasant to use inside components:

- width observation
- memoized preparation
- semantic DOM integration
- line-by-line composition helpers when layout becomes custom

That is the purpose of `@santjc/react-pretext`.

## Examples

### Measure text with prepared text and layout

```tsx
import { usePreparedText, usePretextLayout } from '@santjc/react-pretext'

function Example() {
  const text = 'Prepare once, layout often.'
  const font = '400 18px GeistVariable, sans-serif'

  const { prepared, prepareMs } = usePreparedText({ text, font })
  const { height, lineCount } = usePretextLayout({
    prepared,
    width: 320,
    lineHeight: 28,
  })

  return (
    <div>
      <div>prepare: {prepareMs.toFixed(3)}ms</div>
      <div>{height}px / {lineCount} lines</div>
    </div>
  )
}
```

### Get actual lines from segmented text

```tsx
import { usePreparedSegments, usePretextLines } from '@santjc/react-pretext'

function Example() {
  const { prepared } = usePreparedSegments({
    text: 'Line-by-line rendering starts here.',
    font: '400 18px GeistVariable, sans-serif',
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
      font="400 18px GeistVariable, sans-serif"
      lineHeight={28}
      width={320}
    >
      Semantic text with a thin measurement wrapper.
    </PText>
  )
}
```

### Preserve textarea-style whitespace

```tsx
import { PText } from '@santjc/react-pretext'

function Example({ value }: { value: string }) {
  return (
    <PText
      as="p"
      font="400 16px GeistVariable, sans-serif"
      lineHeight={24}
      width={420}
      prepareOptions={{ whiteSpace: 'pre-wrap' }}
    >
      {value}
    </PText>
  )
}
```

## Editorial layout example

For obstacle-aware layouts, use segmented preparation from the stable API and flow helpers from the experimental subpath.

```tsx
import { PText, usePreparedSegments } from '@santjc/react-pretext'
import {
  createLineSlotResolver,
  getCircleBlockedLineRangeForRow,
  useTextFlow,
} from '@santjc/react-pretext/experimental'

function EditorialExample({ width }: { width: number }) {
  const lineHeight = 30
  const font = '400 18px GeistVariable, sans-serif'
  const title = 'The Future of Text Layout Is Not CSS'
  const text = 'An editorial surface needs more than a single block height...'

  const paddingX = 28
  const bodyStartY = 180
  const bodyWidth = width - paddingX * 2
  const orb = {
    x: paddingX + bodyWidth * 0.72,
    y: bodyStartY + lineHeight * 3,
    radius: 72,
  }

  const { prepared } = usePreparedSegments({ text, font })

  const getLineSlotAtY = createLineSlotResolver({
    baseLineSlot: { left: paddingX, right: paddingX + bodyWidth },
    lineHeight,
    minWidth: 180,
    getBlockedLineRanges: (lineTop, lineBottom) => {
      const blocked = getCircleBlockedLineRangeForRow({
        cx: orb.x,
        cy: orb.y,
        radius: orb.radius,
        lineTop,
        lineBottom,
        horizontalPadding: 16,
      })

      return blocked === null ? [] : [blocked]
    },
  })

  const flow = useTextFlow({
    prepared,
    lineHeight,
    startY: bodyStartY,
    getLineSlotAtY,
  })

  return (
    <div style={{ position: 'relative', minHeight: bodyStartY + flow.height + 48 }}>
      <PText
        as="h1"
        width={bodyWidth * 0.7}
        font="700 64px GeistVariable, sans-serif"
        lineHeight={60}
        style={{ position: 'absolute', left: paddingX, top: 28 }}
      >
        {title}
      </PText>

      <div
        style={{
          position: 'absolute',
          left: orb.x - orb.radius,
          top: orb.y - orb.radius,
          width: orb.radius * 2,
          height: orb.radius * 2,
          borderRadius: '999px',
          background: 'rgba(255, 77, 0, 0.2)',
        }}
      />

      {flow.lines.map((line, index) => (
        <div
          key={`${line.start.segmentIndex}-${line.start.graphemeIndex}-${index}`}
          style={{
            position: 'absolute',
            left: line.x,
            top: line.y,
            width: Math.ceil(line.width),
            font,
            lineHeight: `${lineHeight}px`,
          }}
        >
          {line.text}
        </div>
      ))}
    </div>
  )
}
```

## How to think about the API

The package works best if you treat it in layers:

### Stable root layer
- prepare text
- layout text
- observe width
- render semantic DOM text

### Experimental composition layer
- resolve available line slots
- flow text around obstacles
- assemble editorial or custom layouts

If you are building normal UI text measurement, stay on the stable root API.
If you are building custom layout systems, the experimental subpath is the right place to explore.

## Caveats

- `font` should match the actual rendered font declaration as closely as possible.
- Webfont loading can affect measurement accuracy until the font is ready.
- `PText` currently supports `string` children only.
- `prepareOptions` currently map directly to pretext preparation options such as `whiteSpace`.
- Experimental APIs are intentionally exported, but they are more likely to change than the stable root API.

## Contributing

Issues and pull requests are welcome.

Good contributions for this project usually look like one of these:

- improving the React ergonomics without hiding pretext’s original model
- adding tests around public package behavior
- improving TypeScript types and package DX
- clarifying docs and examples
- validating whether a helper belongs in the stable API or should remain experimental

When contributing, prefer small, explicit abstractions over large convenience layers. The package is intentionally trying to stay close to `pretext`.
