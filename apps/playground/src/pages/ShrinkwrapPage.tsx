import { prepareWithSegments } from '@santjc/react-pretext'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { PText } from '@santjc/react-pretext'
import { getShrinkwrapMetrics } from '../experimental/shrinkwrap'

const examples = [
  'This layout keeps the same number of lines but removes dead space from the bubble.',
  'It even handles emoji correctly across the same multiline layout.',
  'Mixed bidi, grapheme clusters, whatever you want. Try resizing.',
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
    <div className="page">
      <header className="page-header">
        <div className="page-breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <span>Shrinkwrap</span>
        </div>
        <h1 className="page-title">Shrinkwrap Research</h1>
        <p className="page-description">
          Experimental composition over walkLineRanges to compare fit-content with tighter multiline bounds. This route stays in the playground because it is not a public package primitive yet.
        </p>
        <div className="page-status">
          <span className="showcase-card-badge playground">Playground only</span>
        </div>
      </header>

      <div className="controls-inline" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <label className="field">
          <div className="field-label">
            <span>Container width</span>
            <span className="field-value">{maxWidth}px</span>
          </div>
          <input
            type="range"
            min="180"
            max="560"
            value={maxWidth}
            onChange={(event) => setMaxWidth(Number(event.target.value))}
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
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {showcase.map((example, index) => (
          <article
            key={index}
            style={{
              padding: '20px',
              borderRadius: '12px',
              background: 'var(--card)',
              border: '1px solid var(--border)',
            }}
          >
            <div className="metrics" style={{ marginBottom: '20px' }}>
              <div className="metric">
                <span className="metric-label">Target lines</span>
                <span className="metric-value">{example.metrics.targetLineCount}</span>
              </div>
              <div className="metric">
                <span className="metric-label">CSS width</span>
                <span className="metric-value">{example.metrics.cssWidth}px</span>
              </div>
              <div className="metric">
                <span className="metric-label">Pretext width</span>
                <span className="metric-value">{example.metrics.shrinkwrapWidth}px</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  CSS fit-content
                </span>
                <div
                  style={{
                    width: `${maxWidth}px`,
                    padding: '16px',
                    borderRadius: '8px',
                    border: '1px dashed var(--border)',
                  }}
                >
                  <PText
                    as="p"
                    width={example.metrics.cssWidth}
                    font={font}
                    lineHeight={lineHeight}
                    style={{
                      width: `${example.metrics.cssWidth}px`,
                      margin: 0,
                      padding: '16px',
                      borderRadius: '8px',
                      background: 'var(--background)',
                      border: '1px solid var(--border)',
                      fontFamily: 'GeistVariable, sans-serif',
                      fontSize: `${fontSize}px`,
                      fontWeight,
                      lineHeight: `${lineHeight}px`,
                    }}
                  >
                    {example.text}
                  </PText>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--foreground)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Pretext shrinkwrap
                </span>
                <div
                  style={{
                    width: `${maxWidth}px`,
                    padding: '16px',
                    borderRadius: '8px',
                    border: '1px dashed var(--border)',
                  }}
                >
                  <PText
                    as="p"
                    width={example.metrics.shrinkwrapWidth}
                    font={font}
                    lineHeight={lineHeight}
                    style={{
                      width: `${example.metrics.shrinkwrapWidth}px`,
                      margin: 0,
                      padding: '16px',
                      borderRadius: '8px',
                      background: 'var(--background)',
                      border: '1px solid var(--border-hover)',
                      fontFamily: 'GeistVariable, sans-serif',
                      fontSize: `${fontSize}px`,
                      fontWeight,
                      lineHeight: `${lineHeight}px`,
                    }}
                  >
                    {example.text}
                  </PText>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

export { ShrinkwrapPage }
