import { useState } from 'react'
import { Link } from 'react-router-dom'
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
    <div className="page">
      <header className="page-header">
        <div className="page-breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <span>Measure</span>
        </div>
        <h1 className="page-title">Measurement Primitives</h1>
        <p className="page-description">
          Direct React wrappers around prepare and layout. This route shows the package API in the same shape as pretext itself.
        </p>
        <div className="page-status">
          <span className="showcase-card-badge stable">Stable</span>
        </div>
      </header>

      <div className="demo-grid">
        <aside className="controls">
          <span className="controls-title">Controls</span>
          
          <label className="field">
            <span className="field-label">Text</span>
            <textarea
              value={text}
              rows={5}
              onChange={(event) => setText(event.target.value)}
            />
          </label>
          
          <label className="field">
            <div className="field-label">
              <span>Width</span>
              <span className="field-value">{width}px</span>
            </div>
            <input
              type="range"
              min="180"
              max="560"
              value={width}
              onChange={(event) => setWidth(Number(event.target.value))}
            />
          </label>
          
          <label className="field">
            <div className="field-label">
              <span>Font size</span>
              <span className="field-value">{fontSize}px</span>
            </div>
            <input
              type="range"
              min="12"
              max="40"
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
              min="16"
              max="56"
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
        </aside>

        <section className="display">
          <div className="metrics">
            <div className="metric">
              <span className="metric-label">Prepare</span>
              <span className="metric-value">{prepareMs.toFixed(3)}ms</span>
            </div>
            <div className="metric">
              <span className="metric-label">Lines</span>
              <span className="metric-value">{layout.lineCount}</span>
            </div>
            <div className="metric">
              <span className="metric-label">Height</span>
              <span className="metric-value">{layout.height}px</span>
            </div>
          </div>

          <div className="preview">
            <div className="preview-inner" style={{ width: `${width}px` }}>
              <PText
                as="p"
                width={width}
                font={font}
                lineHeight={lineHeight}
                style={{
                  margin: 0,
                  fontFamily: 'GeistVariable, sans-serif',
                  fontSize: `${fontSize}px`,
                  fontWeight,
                  lineHeight: `${lineHeight}px`,
                }}
              >
                {text}
              </PText>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export { MeasurePage }
