import { NavLink, Route, Routes } from 'react-router-dom'
import { EditorialPage } from './pages/EditorialPage'
import { HomePage } from './pages/HomePage'
import { MeasurePage } from './pages/MeasurePage'
import { PTextPage } from './pages/PTextPage'
import { ShrinkwrapPage } from './pages/ShrinkwrapPage'

function App() {
  return (
    <div className="shell">
      <header className="topbar">
        <div className="topbar-copy">
          <p className="brand-kicker">@santjc/react-pretext</p>
          <h1 className="brand-title">React primitives over pretext</h1>
          <p className="brand-subtitle">A minimal React layer for pretext, with experimental composition helpers kept explicit.</p>
        </div>

        <nav className="topnav" aria-label="Primary">
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'navlink active' : 'navlink')}>
            Overview
          </NavLink>
          <NavLink to="/showcase/measure" className={({ isActive }) => (isActive ? 'navlink active' : 'navlink')}>
            Measure
          </NavLink>
          <NavLink to="/showcase/ptext" className={({ isActive }) => (isActive ? 'navlink active' : 'navlink')}>
            PText
          </NavLink>
          <NavLink to="/showcase/shrinkwrap" className={({ isActive }) => (isActive ? 'navlink active' : 'navlink')}>
            Shrinkwrap
          </NavLink>
          <NavLink to="/showcase/editorial" className={({ isActive }) => (isActive ? 'navlink active' : 'navlink')}>
            Editorial
          </NavLink>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/showcase/measure" element={<MeasurePage />} />
        <Route path="/showcase/ptext" element={<PTextPage />} />
        <Route path="/showcase/shrinkwrap" element={<ShrinkwrapPage />} />
        <Route path="/showcase/editorial" element={<EditorialPage />} />
      </Routes>
    </div>
  )
}

export { App }
