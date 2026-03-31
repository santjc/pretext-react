import { Link } from 'react-router-dom'

const showcases = [
  {
    to: '/showcase/measure',
    title: 'Measurement primitives',
    body: 'Direct React wrappers around prepare and layout, with width observation separate from text preparation.',
    status: 'Stable',
  },
  {
    to: '/showcase/ptext',
    title: 'PText semantic wrapper',
    body: 'A small DOM component that keeps real tags like h1 and p while delegating text measurement to pretext.',
    status: 'Stable',
  },
  {
    to: '/showcase/shrinkwrap',
    title: 'Shrinkwrap research',
    body: 'An experimental showcase built from walkLineRanges to compare fit-content with tighter multiline bounds.',
    status: 'Playground only',
  },
  {
    to: '/showcase/editorial',
    title: 'Editorial flow MVP',
    body: 'A headline in semantic DOM and a body flowed line by line around a fixed obstacle.',
    status: 'Experimental',
  },
] as const

function HomePage() {
  return (
    <main className="page overview-page">
      <section className="hero-panel panel">
        <p className="eyebrow">Design goal</p>
        <h2 className="page-title">Expose pretext directly, adapt it to React, keep the abstractions thin.</h2>
        <p className="page-copy">
          The package should feel like React ergonomics over the original pretext primitives. The playground remains the
          research surface, and each route teaches one layer of the API.
        </p>
        <div className="hero-meta">
          <div className="meta-chip"><span>Package</span><strong>0.0.1</strong></div>
          <div className="meta-chip"><span>Root API</span><strong>Stable</strong></div>
          <div className="meta-chip"><span>Subpath</span><strong>/experimental</strong></div>
        </div>
      </section>

      <section className="card-grid">
        {showcases.map((showcase, index) => (
          <Link key={showcase.to} to={showcase.to} className="panel showcase-card">
            <div className="card-head">
              <p className="card-index">0{index + 1}</p>
              <span className="status-tag">{showcase.status}</span>
            </div>
            <h3>{showcase.title}</h3>
            <p>{showcase.body}</p>
            <span className="card-cta">Open showcase</span>
          </Link>
        ))}
      </section>
    </main>
  )
}

export { HomePage }
