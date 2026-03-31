import { useState } from 'react'
import { PText, usePreparedText, usePretextLayout } from '@santjc/react-pretext'

function buildFont(fontWeight: number, fontSize: number) {
  return `${fontWeight} ${fontSize}px GeistVariable, sans-serif`
}

const initialText = 'Prepare once, layout often. That is the shape of the abstraction this package should preserve.'

function MeasurePage() {
  const [text, setText] = useState(initialText)
  const [width, setWidth] = useState(360)
  const [fontSize, setFontSize] = useState(20)
  const [lineHeight, setLineHeight] = useState(30)
  const [fontWeight, setFontWeight] = useState(400)
  const font = buildFont(fontWeight, fontSize)

  const { prepared, prepareMs } = usePreparedText({ text, font })
  const layout = usePretextLayout({ prepared, width, lineHeight })

  return (
    <main className="page showcase-page">
      <section className="showcase-header">
        <p className="eyebrow">Measurement</p>
        <h2 className="page-title">prepare + layout as React primitives</h2>
        <p className="page-copy">This route exists to show the package API in the same shape as pretext itself.</p>
        <div className="status-row"><span className="status-tag">Stable</span></div>
      </section>

      <section className="showcase-grid">
        <aside className="panel controls-panel">
          <label className="field">
            <span>Text</span>
            <textarea value={text} rows={7} onChange={(event) => setText(event.target.value)} />
          </label>
          <label className="field">
            <span>Width: {width}px</span>
            <input type="range" min="180" max="560" value={width} onChange={(event) => setWidth(Number(event.target.value))} />
          </label>
          <label className="field">
            <span>Font size: {fontSize}px</span>
            <input type="range" min="12" max="40" value={fontSize} onChange={(event) => setFontSize(Number(event.target.value))} />
          </label>
          <label className="field">
            <span>Line height: {lineHeight}px</span>
            <input type="range" min="16" max="56" value={lineHeight} onChange={(event) => setLineHeight(Number(event.target.value))} />
          </label>
          <label className="field">
            <span>Font weight</span>
            <select value={fontWeight} onChange={(event) => setFontWeight(Number(event.target.value))}>
              <option value="300">300</option>
              <option value="400">400</option>
              <option value="500">500</option>
              <option value="600">600</option>
              <option value="700">700</option>
            </select>
          </label>
        </aside>

        <section className="panel display-panel">
          <div className="metrics-inline">
            <div className="metric-box"><span>Prepare</span><strong>{prepareMs.toFixed(3)}ms</strong></div>
            <div className="metric-box"><span>Lines</span><strong>{layout.lineCount}</strong></div>
            <div className="metric-box"><span>Height</span><strong>{layout.height}px</strong></div>
          </div>

          <div className="preview-lane" style={{ width: `${width}px` }}>
            <PText
              as="p"
              width={width}
              font={font}
              lineHeight={lineHeight}
              className="preview-copy"
              style={{ fontFamily: 'GeistVariable, sans-serif', fontSize: `${fontSize}px`, fontWeight, lineHeight: `${lineHeight}px` }}
            >
              {text}
            </PText>
          </div>
        </section>
      </section>
    </main>
  )
}

export { MeasurePage }
