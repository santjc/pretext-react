import { prepareWithSegments } from '@santjc/react-pretext'
import { useMemo, useState } from 'react'
import { PText } from '@santjc/react-pretext'
import { getShrinkwrapMetrics } from '../experimental/shrinkwrap'

const examples = [
  'This layout keeps the same number of lines but removes dead space from the bubble.',
  'It even handles emoji correctly across the same multiline layout 🚀🔥🙂',
  'كل شيء! Mixed bidi, grapheme clusters, whatever you want. Try resizing.',
] as const

function buildFont(fontWeight: number, fontSize: number) {
  return `${fontWeight} ${fontSize}px GeistVariable, sans-serif`
}

function ShrinkwrapPage() {
  const [maxWidth, setMaxWidth] = useState(340)
  const [fontSize, setFontSize] = useState(20)
  const [lineHeight, setLineHeight] = useState(30)
  const [fontWeight, setFontWeight] = useState(400)
  const font = buildFont(fontWeight, fontSize)

  const showcase = useMemo(() => {
    return examples.map((text) => {
      const prepared = prepareWithSegments(text, font)
      return { text, metrics: getShrinkwrapMetrics(prepared, maxWidth) }
    })
  }, [font, maxWidth])

  return (
    <main className="page showcase-page">
      <section className="showcase-header">
        <p className="eyebrow">Experimental</p>
        <h2 className="page-title">Shrinkwrap research over walkLineRanges</h2>
        <p className="page-copy">This route stays in the playground because it is a composition over pretext, not a public package primitive yet.</p>
        <div className="status-row"><span className="status-tag status-tag-muted">Playground only</span></div>
      </section>

      <section className="panel controls-inline-panel">
        <label className="field"><span>Container width: {maxWidth}px</span><input type="range" min="180" max="560" value={maxWidth} onChange={(event) => setMaxWidth(Number(event.target.value))} /></label>
        <label className="field"><span>Font size: {fontSize}px</span><input type="range" min="12" max="40" value={fontSize} onChange={(event) => setFontSize(Number(event.target.value))} /></label>
        <label className="field"><span>Line height: {lineHeight}px</span><input type="range" min="16" max="56" value={lineHeight} onChange={(event) => setLineHeight(Number(event.target.value))} /></label>
        <label className="field"><span>Font weight</span><select value={fontWeight} onChange={(event) => setFontWeight(Number(event.target.value))}><option value="300">300</option><option value="400">400</option><option value="500">500</option><option value="600">600</option><option value="700">700</option></select></label>
      </section>

      <section className="stack-list">
        {showcase.map((example, index) => (
          <article key={index} className="panel compare-panel">
            <div className="compare-meta">
              <div className="metric-box"><span>Target lines</span><strong>{example.metrics.targetLineCount}</strong></div>
              <div className="metric-box"><span>CSS width</span><strong>{example.metrics.cssWidth}px</strong></div>
              <div className="metric-box"><span>Pretext width</span><strong>{example.metrics.shrinkwrapWidth}px</strong></div>
            </div>
            <div className="compare-grid">
              <div className="compare-column">
                <p className="eyebrow">CSS fit-content</p>
                <div className="lane" style={{ width: `${maxWidth}px` }}>
                  <PText as="p" width={example.metrics.cssWidth} font={font} lineHeight={lineHeight} className="bubble bubble-css" style={{ width: `${example.metrics.cssWidth}px`, fontFamily: 'GeistVariable, sans-serif', fontSize: `${fontSize}px`, fontWeight, lineHeight: `${lineHeight}px` }}>{example.text}</PText>
                </div>
              </div>
              <div className="compare-column">
                <p className="eyebrow accent">Pretext shrinkwrap</p>
                <div className="lane" style={{ width: `${maxWidth}px` }}>
                  <PText as="p" width={example.metrics.shrinkwrapWidth} font={font} lineHeight={lineHeight} className="bubble bubble-accent" style={{ width: `${example.metrics.shrinkwrapWidth}px`, fontFamily: 'GeistVariable, sans-serif', fontSize: `${fontSize}px`, fontWeight, lineHeight: `${lineHeight}px` }}>{example.text}</PText>
                </div>
              </div>
            </div>
          </article>
        ))}
      </section>
    </main>
  )
}

export { ShrinkwrapPage }
