import { PText } from '@santjc/react-pretext'

function PTextPage() {
  return (
    <main className="page showcase-page">
      <section className="showcase-header">
        <p className="eyebrow">PText</p>
        <h2 className="page-title">Semantic tags stay real HTML</h2>
        <p className="page-copy">
          `PText` is the thin component layer. It keeps `h1`, `p`, and other tags semantically correct while using pretext
          for measurement behind the scenes.
        </p>
        <div className="status-row"><span className="status-tag">Stable</span></div>
      </section>

      <section className="panel article-panel">
        <PText
            as="h1"
            width={720}
            font="700 72px GeistVariable, sans-serif"
            lineHeight={70}
            className="article-headline"
            style={{ width: 'min(100%, 720px)', fontFamily: 'GeistVariable, sans-serif', fontSize: '72px', fontWeight: 700, lineHeight: '70px' }}
        >
          Semantic text without giving up the measurement model.
        </PText>

        <PText
            as="p"
            width={680}
            font="400 24px GeistVariable, sans-serif"
            lineHeight={38}
            className="article-lede"
            style={{ width: 'min(100%, 680px)', fontFamily: 'GeistVariable, sans-serif', fontSize: '24px', lineHeight: '38px' }}
        >
          This component should remain boring in the best sense. It renders normal DOM, keeps the right tag, and makes
          the React experience around pretext less repetitive.
        </PText>

        <div className="article-columns">
          <PText
            as="p"
            width={320}
            font="400 18px GeistVariable, sans-serif"
            lineHeight={30}
            style={{ fontFamily: 'GeistVariable, sans-serif', fontSize: '18px', lineHeight: '30px' }}
          >
            The library should not pretend that manual composition and semantic DOM are the same problem. `PText` covers
            the semantic DOM case well.
          </PText>
          <PText
            as="p"
            width={320}
            font="400 18px GeistVariable, sans-serif"
            lineHeight={30}
            style={{ fontFamily: 'GeistVariable, sans-serif', fontSize: '18px', lineHeight: '30px' }}
          >
            More advanced composition can then live in utility and hook layers built from the original pretext primitives.
          </PText>
        </div>
      </section>
    </main>
  )
}

export { PTextPage }
