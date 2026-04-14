// App.jsx — root component with all routes defined
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

// Pages
import HomePage            from './pages/HomePage'
import CharactersPage      from './pages/CharactersPage'
import CharacterDetailPage from './pages/CharacterDetailPage'
import EpisodesPage        from './pages/EpisodesPage'
import EpisodeDetailPage   from './pages/EpisodeDetailPage'
import LocationsPage       from './pages/LocationsPage'
import LocationDetailPage  from './pages/LocationDetailPage'
import NotFoundPage        from './pages/NotFoundPage'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col noise-bg">
      {/* Sticky navigation bar */}
      <Navbar />

      {/* Main content area */}
      <main className="flex-1">
        <Routes>
          <Route path="/"                   element={<HomePage />} />
          <Route path="/characters"         element={<CharactersPage />} />
          <Route path="/characters/:id"     element={<CharacterDetailPage />} />
          <Route path="/episodes"           element={<EpisodesPage />} />
          <Route path="/episodes/:id"       element={<EpisodeDetailPage />} />
          <Route path="/locations"          element={<LocationsPage />} />
          <Route path="/locations/:id"      element={<LocationDetailPage />} />
          <Route path="*"                   element={<NotFoundPage />} />
        </Routes>
      </main>

      <Footer />
    </div>
  )
}
