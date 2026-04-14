// Location Detail Page — full info + list of residents
import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getLocationById, getMultipleCharacters, extractIdFromUrl } from '../services/api'
import { useFetch } from '../hooks/useFetch'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'

const STATUS_COLORS = {
  Alive:   'text-portal-lime',
  Dead:    'text-red-400',
  unknown: 'text-gray-500',
}

function InfoBadge({ label, value }) {
  return (
    <div className="rounded-xl border border-portal-border bg-portal-card/50 p-4 text-center">
      <p className="text-xs text-gray-600 font-body uppercase tracking-wider mb-1">{label}</p>
      <p className="text-white font-body font-700 text-sm truncate">
        {(!value || value === 'unknown') ? <span className="text-gray-600 italic">Unknown</span> : value}
      </p>
    </div>
  )
}

export default function LocationDetailPage() {
  const { id } = useParams()
  const [residents, setResidents]     = useState([])
  const [resLoading, setResLoading]   = useState(false)

  const { data: location, loading, error, refetch } = useFetch(
    () => getLocationById(id),
    [id]
  )

  useEffect(() => {
    if (!location?.residents?.length) return
    setResLoading(true)
    const ids = location.residents.map(url => extractIdFromUrl(url))
    getMultipleCharacters(ids)
      .then(data => setResidents(Array.isArray(data) ? data : [data]))
      .catch(() => setResidents([]))
      .finally(() => setResLoading(false))
  }, [location])

  if (loading) return <LoadingSpinner text="Warping to location..." />
  if (error)   return <ErrorMessage message={error} onRetry={refetch} />
  if (!location) return null

  const { name, type, dimension, residents: resUrls } = location

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 animate-fade-in">
      {/* Back */}
      <Link to="/locations"
        className="inline-flex items-center gap-2 text-gray-400 hover:text-portal-lime
                   font-body font-700 text-sm mb-8 transition-colors duration-200">
        ← Back to Locations
      </Link>

      {/* Hero */}
      <div className="rounded-2xl border border-portal-border bg-card-gradient p-8 md:p-12 mb-10
                      relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-5 blur-3xl"
          style={{ background: 'radial-gradient(circle, #97ce4c, transparent)' }}></div>

        <div className="relative">
          <span className="inline-flex px-4 py-1.5 rounded-full text-sm font-body font-800 mb-6
                           border border-portal-green/30 bg-portal-green/10 text-portal-green">
            {type || 'Unknown Type'}
          </span>

          <h1 className="font-display text-5xl md:text-7xl text-white tracking-wider mb-6 leading-none">
            {name}
          </h1>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-lg">
            <InfoBadge label="Type"       value={type} />
            <InfoBadge label="Dimension"  value={dimension} />
            <InfoBadge label="Residents"  value={resUrls?.length || 0} />
          </div>
        </div>
      </div>

      {/* Residents */}
      <div>
        <h2 className="font-display text-3xl text-white tracking-wider mb-6">
          KNOWN <span className="text-portal-lime">RESIDENTS</span>
        </h2>

        {resLoading && <LoadingSpinner text="Scanning residents..." />}

        {!resLoading && residents.length === 0 && (
          <div className="text-center py-12 rounded-2xl border border-portal-border bg-card-gradient">
            <div className="text-5xl mb-3">👻</div>
            <p className="text-gray-500 font-body">No known residents</p>
          </div>
        )}

        {!resLoading && residents.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {residents.map(char => (
              <Link key={char.id} to={`/characters/${char.id}`}>
                <div className="card-hover rounded-xl overflow-hidden border border-portal-border
                                bg-card-gradient group cursor-pointer">
                  <div className="relative">
                    <img src={char.image} alt={char.name}
                         className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-portal-card to-transparent opacity-70"></div>
                    {/* Status dot */}
                    <div className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full animate-pulse"
                         style={{ background: char.status === 'Alive' ? '#97ce4c' : char.status === 'Dead' ? '#ef4444' : '#9ca3af' }}></div>
                  </div>
                  <div className="p-2">
                    <p className={`font-body font-700 text-xs truncate group-hover:text-portal-lime
                                   transition-colors duration-200 ${STATUS_COLORS[char.status] || 'text-white'}`}>
                      {char.name}
                    </p>
                    <p className="text-gray-600 text-xs font-body">{char.species}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
