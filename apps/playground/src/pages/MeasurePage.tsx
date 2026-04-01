import { useState } from 'react'
import { PText, createPretextTypography, useMeasuredText } from '@santjc/react-pretext'
import { ShowcaseIntro } from '../components/ShowcaseIntro'
import { buildPlaygroundFont, fontWeightOptions } from '../lib/typography'

const initialText = 'Prepare once, layout often. That is the shape of the abstraction this package should preserve.'

function MeasurePage() {
  const [text, setText] = useState(initialText)
  const [width, setWidth] = useState(360)
  const [fontSize, setFontSize] = useState(20)
  const [lineHeight, setLineHeight] = useState(30)
  const [fontWeight, setFontWeight] = useState(400)
  const typography = createPretextTypography({
    font: buildPlaygroundFont(fontWeight, fontSize),
    lineHeight,
    width,
  })

  const layout = useMeasuredText({
    text,
    typography,
    enableProfiling: true,
  })

  return (
    <main className="page showcase-page">
      <ShowcaseIntro
        eyebrow="Measure text"
        title="Simple measured text with one hook"
        description="This is the smallest normal adoption path: define one shared typography object, pass it to useMeasuredText, and use the returned height and line count in your component state or layout logic."
        status="Stable"
      />

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
              {fontWeightOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <div className="note-card">
            <p className="eyebrow eyebrow-muted">Shared typography</p>
            <p className="page-copy">The same <code>typography</code> object feeds both the measurement hook and the preview component, so width, font, and line height do not drift apart.</p>
          </div>
        </aside>

        <section className="panel display-panel">
          <div className="metrics-inline">
            <div className="metric-box"><span>Prepare</span><strong>{layout.prepareMs?.toFixed(3) ?? 'off'}</strong></div>
            <div className="metric-box"><span>Lines</span><strong>{layout.lineCount}</strong></div>
            <div className="metric-box"><span>Height</span><strong>{layout.height}px</strong></div>
          </div>

          <div className="preview-lane preview-lane-fluid" style={{ maxWidth: `${width}px` }}>
            <PText
              as="p"
              typography={typography}
              className="preview-copy"
            >
              {text}
            </PText>
          </div>

          <pre className="code-block">{`const typography = createPretextTypography({
  font: '400 20px GeistVariable, sans-serif',
  lineHeight: 30,
  width: 360,
})

const { height, lineCount } = useMeasuredText({ text, typography })`}</pre>
        </section>
      </section>
    </main>
  )
}

export { MeasurePage }
