import { Link } from 'react-router-dom'

const showcases = [
  {
    to: '/showcase/measure',
    title: 'Measurement Primitives',
    body: 'Direct React wrappers around prepare and layout, with width observation separate from text preparation.',
    status: 'stable',
  },
  {
    to: '/showcase/ptext',
    title: 'PText Component',
    body: 'A semantic DOM component that keeps real tags like h1 and p while delegating text measurement to pretext.',
    status: 'stable',
  },
  {
    to: '/showcase/shrinkwrap',
    title: 'Shrinkwrap Research',
    body: 'Experimental showcase built from walkLineRanges to compare fit-content with tighter multiline bounds.',
    status: 'playground',
  },
  {
    to: '/showcase/editorial',
    title: 'Editorial Flow',
    body: 'A headline in semantic DOM and a body flowed line by line around a fixed obstacle.',
    status: 'experimental',
  },
] as const

function HomePage() {
  return (
    <div className="page">
      <section className="hero">
        <div className="hero-badge">
          <span className="hero-badge-dot" />
          <span>v0.0.1</span>
        </div>
        <h1 className="hero-title">Thin React primitives over pretext</h1>
        <p className="hero-description">
          A minimal React layer for text measurement and layout. Prepare once, layout often.
          Keep the abstractions thin and the ergonomics pleasant.
        </p>
        <div className="hero-actions">
          <Link to="/showcase/measure" className="btn btn-primary">
            View Showcases
          </Link>
          <a
            href="https://github.com/santjc/pretext-react"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            GitHub
          </a>
        </div>
        <div className="install-cmd" style={{ marginTop: '24px' }}>
          <span>$</span>
          <code>npm install @santjc/react-pretext</code>
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <span className="section-label">Showcases</span>
          <h2 className="section-title">Explore the API</h2>
          <p className="section-description">
            Each showcase teaches one layer of the API. Start with measurement primitives and work up to editorial composition.
          </p>
        </div>

        <div className="showcase-grid">
          {showcases.map((showcase, index) => (
            <Link key={showcase.to} to={showcase.to} className="showcase-card">
              <div className="showcase-card-header">
                <span className="showcase-card-number">0{index + 1}</span>
                <span className={`showcase-card-badge ${showcase.status}`}>
                  {showcase.status}
                </span>
              </div>
              <h3>{showcase.title}</h3>
              <p>{showcase.body}</p>
              <div className="showcase-card-footer">
                <span>View showcase</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}

export { HomePage }
