import { NavLink, Route, Routes } from 'react-router-dom'
import { AccordionPage } from './pages/AccordionPage'
import { BubblesPage } from './pages/BubblesPage'
import { DynamicLayoutPage } from './pages/DynamicLayoutPage'
import { EditorialPage } from './pages/EditorialPage'
import { EditorialEnginePage } from './pages/EditorialEnginePage'
import { HomePage } from './pages/HomePage'
import { MasonryPage } from './pages/MasonryPage'
import { MeasurePage } from './pages/MeasurePage'
import { PTextPage } from './pages/PTextPage'

function App() {
  return (
    <div className="shell">
      <header className="topbar">
        <div className="topbar-copy">
          <p className="brand-kicker">@santjc/react-pretext</p>
          <h1 className="brand-title">React primitives over pretext</h1>
          <p className="brand-subtitle">Start with measured text, responsive semantic rendering, and predictable component heights. Editorial routes stay here as advanced examples.</p>
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
          <NavLink to="/showcase/accordion" className={({ isActive }) => (isActive ? 'navlink active' : 'navlink')}>
            Accordion
          </NavLink>
          <NavLink to="/showcase/masonry" className={({ isActive }) => (isActive ? 'navlink active' : 'navlink')}>
            Cards
          </NavLink>
          <NavLink to="/showcase/bubbles" className={({ isActive }) => (isActive ? 'navlink active' : 'navlink')}>
            Bubbles
          </NavLink>
          <NavLink to="/showcase/dynamic-layout" className={({ isActive }) => (isActive ? 'navlink active' : 'navlink')}>
            Advanced Flow
          </NavLink>
          <NavLink to="/showcase/editorial-engine" className={({ isActive }) => (isActive ? 'navlink active' : 'navlink')}>
            Editorial Engine
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
        <Route path="/showcase/accordion" element={<AccordionPage />} />
        <Route path="/showcase/masonry" element={<MasonryPage />} />
        <Route path="/showcase/bubbles" element={<BubblesPage />} />
        <Route path="/showcase/dynamic-layout" element={<DynamicLayoutPage />} />
        <Route path="/showcase/editorial-engine" element={<EditorialEnginePage />} />
        <Route path="/showcase/editorial" element={<EditorialPage />} />
      </Routes>
    </div>
  )
}

export { App }
