import { PText, createPretextTypography } from '@santjc/react-pretext'
import { useState } from 'react'
import { ShowcaseIntro } from '../components/ShowcaseIntro'
import { buildPlaygroundFont } from '../lib/typography'

function PTextPage() {
  const [responsiveWidth, setResponsiveWidth] = useState(420)
  const headlineTypography = createPretextTypography({
    font: buildPlaygroundFont(600, 34),
    lineHeight: 38,
    width: 460,
  })
  const bodyTypography = createPretextTypography({
    font: buildPlaygroundFont(400, 18),
    lineHeight: 30,
    width: 420,
  })
  const responsiveTypography = createPretextTypography({
    font: buildPlaygroundFont(400, 18),
    lineHeight: 30,
  })

  return (
    <main className="page showcase-page">
      <ShowcaseIntro
        eyebrow="PText"
        title="Semantic text with fixed or observed width"
        description="PText keeps the rendered DOM simple while using the same measurement inputs underneath. Use explicit width when you already know it, or omit width and let the component observe its responsive container."
        status="Stable"
      />

      <section className="compare-grid">
        <article className="panel compare-column compare-column-soft">
          <div className="example-head">
            <div>
              <p className="eyebrow eyebrow-muted">Fixed width</p>
              <h3 className="example-title">Use one typography object for measured render output</h3>
            </div>
            <span className="status-tag status-tag-muted">core</span>
          </div>

          <PText as="h1" typography={headlineTypography} style={{ margin: 0 }}>
            Headlines preserve semantics without separate render wiring
          </PText>

          <PText as="p" typography={bodyTypography} className="preview-copy">
            The same typography object supplies the measured font, line height, and fixed width. You do not need to repeat those values in style just to keep rendering aligned with measurement.
          </PText>

          <pre className="code-block">{`const body = createPretextTypography({
  font: '400 18px GeistVariable, sans-serif',
  lineHeight: 30,
  width: 420,
})

<PText as="p" typography={body}>
  Semantic text with shared typography.
</PText>`}</pre>
        </article>

        <article className="panel compare-column compare-column-accent">
          <div className="example-head">
            <div>
              <p className="eyebrow">Responsive width</p>
              <h3 className="example-title">Let PText observe the container when width is not known ahead of time</h3>
            </div>
            <span className="status-tag">observed</span>
          </div>

          <label className="field field-progress-capped">
            <span>Container width: {responsiveWidth}px</span>
            <input type="range" min="260" max="515" value={responsiveWidth} onChange={(event) => setResponsiveWidth(Number(event.target.value))} />
          </label>

          <div className="preview-lane preview-lane-fluid" style={{ maxWidth: `${responsiveWidth}px` }}>
            <PText as="p" typography={responsiveTypography} className="preview-copy">
              This paragraph does not receive an explicit width prop. PText observes the rendered element width with ResizeObserver, then reuses the same typography values for measurement and DOM output.
            </PText>
          </div>

          <div className="note-card">
            <p className="eyebrow eyebrow-muted">Why this matters</p>
            <p className="page-copy">Responsive components often know their font before they know their final width. This path avoids hand-written measurement plumbing for the common case.</p>
          </div>

          <pre className="code-block">{`const body = createPretextTypography({
  font: '400 18px GeistVariable, sans-serif',
  lineHeight: 30,
})

<div style={{ width: responsiveWidth }}>
  <PText as="p" typography={body}>
    Width is observed from the element.
  </PText>
</div>`}</pre>
        </article>
      </section>
    </main>
  )
}

export { PTextPage }
