import { Link } from 'react-router-dom'
import { PText } from '@santjc/react-pretext'

function PTextPage() {
  return (
    <div className="page">
      <header className="page-header">
        <div className="page-breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <span>PText</span>
        </div>
        <h1 className="page-title">PText Component</h1>
        <p className="page-description">
          A semantic DOM component that keeps real tags like h1 and p while delegating text measurement to pretext.
        </p>
        <div className="page-status">
          <span className="showcase-card-badge stable">Stable</span>
        </div>
      </header>

      <div className="article">
        <PText
          as="h1"
          width={720}
          font="700 64px GeistVariable, sans-serif"
          lineHeight={64}
          className="article-headline"
          style={{
            width: 'min(100%, 720px)',
            fontFamily: 'GeistVariable, sans-serif',
            fontSize: '64px',
            fontWeight: 700,
            lineHeight: '64px',
            letterSpacing: '-0.03em',
          }}
        >
          Semantic text without giving up the measurement model.
        </PText>

        <PText
          as="p"
          width={680}
          font="400 20px GeistVariable, sans-serif"
          lineHeight={32}
          className="article-lede"
          style={{
            width: 'min(100%, 680px)',
            fontFamily: 'GeistVariable, sans-serif',
            fontSize: '20px',
            lineHeight: '32px',
            color: 'var(--muted-foreground)',
          }}
        >
          This component should remain boring in the best sense. It renders normal DOM, keeps the right tag, and makes
          the React experience around pretext less repetitive.
        </PText>

        <div className="article-columns">
          <PText
            as="p"
            width={320}
            font="400 16px GeistVariable, sans-serif"
            lineHeight={26}
            style={{
              fontFamily: 'GeistVariable, sans-serif',
              fontSize: '16px',
              lineHeight: '26px',
              color: 'var(--muted-foreground)',
            }}
          >
            The library should not pretend that manual composition and semantic DOM are the same problem. PText covers
            the semantic DOM case well.
          </PText>
          <PText
            as="p"
            width={320}
            font="400 16px GeistVariable, sans-serif"
            lineHeight={26}
            style={{
              fontFamily: 'GeistVariable, sans-serif',
              fontSize: '16px',
              lineHeight: '26px',
              color: 'var(--muted-foreground)',
            }}
          >
            More advanced composition can then live in utility and hook layers built from the original pretext primitives.
          </PText>
        </div>
      </div>
    </div>
  )
}

export { PTextPage }
