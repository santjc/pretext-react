import { Link } from 'react-router-dom'
import {
  PText,
  useElementWidth,
  usePreparedSegments,
} from '@santjc/react-pretext'
import { createLineSlotResolver, getCircleBlockedLineRangeForRow, useTextFlow } from '@santjc/react-pretext/experimental'
import { useMemo, useState } from 'react'

const headline = 'THE FUTURE OF TEXT LAYOUT IS NOT CSS'
const bodyText = `An editorial surface needs more than a single block height. It needs to know where every line can fit, how those lines react to obstacles, and how the composition changes when the available width moves.

With pretext, the expensive preparation happens once. After that, a layout routine can ask a sharper question for every row: where is the usable horizontal slot right now? The answer can change as shapes enter or leave the band.

This is the kind of primitive that can eventually support responsive magazine layouts, obstacle-aware cards, pull quotes, and multi-step composition systems without depending on repeated DOM reads.`

function buildFont(fontWeight: number, fontSize: number) {
  return `${fontWeight} ${fontSize}px GeistVariable, sans-serif`
}

function EditorialPage() {
  const [fontSize, setFontSize] = useState(18)
  const [lineHeight, setLineHeight] = useState(30)
  const [fontWeight, setFontWeight] = useState(400)
  const { ref, width } = useElementWidth<HTMLDivElement>()
  const font = buildFont(fontWeight, fontSize)
  const { prepared } = usePreparedSegments({ text: bodyText, font })

  const scaffold = useMemo(() => {
    if (width <= 0) return null

    const paddingX = 28
    const titleHeight = 156
    const bodyStartY = 28 + titleHeight
    const bodyWidth = Math.max(220, width - paddingX * 2)
    const orbRadius = Math.max(60, Math.min(128, bodyWidth * 0.16))
    const orbX = paddingX + bodyWidth * 0.72
    const orbY = bodyStartY + lineHeight * 3.2

    return {
      bodyStartY,
      bodyMaxY: bodyStartY + 720,
      baseLineSlot: { left: paddingX, right: paddingX + bodyWidth },
      titleWidth: bodyWidth * 0.7,
      orb: { x: orbX, y: orbY, size: orbRadius * 2 },
    }
  }, [lineHeight, width])

  const getLineSlotAtY = useMemo(() => {
    if (scaffold === null) {
      return null
    }

    return createLineSlotResolver({
      baseLineSlot: scaffold.baseLineSlot,
      lineHeight,
      minWidth: 180,
      getBlockedLineRanges: (lineTop, lineBottom) => {
        const blocked = getCircleBlockedLineRangeForRow({
          cx: scaffold.orb.x,
          cy: scaffold.orb.y,
          radius: scaffold.orb.size / 2,
          lineTop,
          lineBottom,
          horizontalPadding: 16,
        })

        return blocked === null ? [] : [blocked]
      },
    })
  }, [lineHeight, scaffold])

  const body = useTextFlow({
    prepared,
    lineHeight,
    startY: scaffold?.bodyStartY ?? 0,
    maxY: scaffold?.bodyMaxY,
    getLineSlotAtY: getLineSlotAtY ?? (() => null),
    enabled: prepared !== null && getLineSlotAtY !== null,
  })

  const layout = useMemo(() => {
    if (scaffold === null) {
      return null
    }

    return {
      ...scaffold,
      body,
      stageHeight: Math.max(scaffold.bodyStartY + body.height + 48, 640),
    }
  }, [body, scaffold])

  return (
    <div className="page">
      <header className="page-header">
        <div className="page-breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <span>Editorial</span>
        </div>
        <h1 className="page-title">Editorial Flow</h1>
        <p className="page-description">
          A headline in semantic DOM and a body flowed line by line around a fixed obstacle. The title is semantic DOM. The body is manual line composition.
        </p>
        <div className="page-status">
          <span className="showcase-card-badge experimental">Experimental</span>
        </div>
      </header>

      <div className="controls-inline">
        <label className="field">
          <div className="field-label">
            <span>Font size</span>
            <span className="field-value">{fontSize}px</span>
          </div>
          <input
            type="range"
            min="12"
            max="28"
            value={fontSize}
            onChange={(event) => setFontSize(Number(event.target.value))}
          />
        </label>
        <label className="field">
          <div className="field-label">
            <span>Line height</span>
            <span className="field-value">{lineHeight}px</span>
          </div>
          <input
            type="range"
            min="18"
            max="44"
            value={lineHeight}
            onChange={(event) => setLineHeight(Number(event.target.value))}
          />
        </label>
        <label className="field">
          <span className="field-label">Font weight</span>
          <select
            value={fontWeight}
            onChange={(event) => setFontWeight(Number(event.target.value))}
          >
            <option value="300">300 - Light</option>
            <option value="400">400 - Regular</option>
            <option value="500">500 - Medium</option>
            <option value="600">600 - Semibold</option>
            <option value="700">700 - Bold</option>
          </select>
        </label>
      </div>

      <div className="display">
        <div className="metrics">
          <div className="metric">
            <span className="metric-label">Body lines</span>
            <span className="metric-value">{layout?.body.lineCount ?? 0}</span>
          </div>
          <div className="metric">
            <span className="metric-label">Body height</span>
            <span className="metric-value">{Math.round(layout?.body.height ?? 0)}px</span>
          </div>
          <div className="metric">
            <span className="metric-label">Exhausted</span>
            <span className="metric-value">{layout?.body.exhausted ? 'yes' : 'no'}</span>
          </div>
        </div>

        <div ref={ref} className="editorial-stage" style={{ height: `${layout?.stageHeight ?? 640}px` }}>
          {layout && (
            <>
              <PText
                as="h1"
                width={layout.titleWidth}
                font="700 64px GeistVariable, sans-serif"
                lineHeight={60}
                className="editorial-headline"
                style={{
                  width: `${layout.titleWidth}px`,
                  fontFamily: 'GeistVariable, sans-serif',
                  fontSize: '64px',
                  fontWeight: 700,
                  lineHeight: '60px',
                }}
              >
                {headline}
              </PText>
              <p className="editorial-byline">@santjc/react-pretext</p>
              <div
                className="editorial-orb"
                style={{
                  left: `${layout.orb.x - layout.orb.size / 2}px`,
                  top: `${layout.orb.y - layout.orb.size / 2}px`,
                  width: `${layout.orb.size}px`,
                  height: `${layout.orb.size}px`,
                }}
              />
              {layout.body.lines.map((line, index) => (
                <div
                  key={`${line.start.segmentIndex}-${line.start.graphemeIndex}-${index}`}
                  className="editorial-line"
                  style={{
                    left: `${line.x}px`,
                    top: `${line.y}px`,
                    width: `${Math.ceil(line.width)}px`,
                    fontFamily: 'GeistVariable, sans-serif',
                    fontSize: `${fontSize}px`,
                    fontWeight,
                    lineHeight: `${lineHeight}px`,
                  }}
                >
                  {line.text}
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export { EditorialPage }
