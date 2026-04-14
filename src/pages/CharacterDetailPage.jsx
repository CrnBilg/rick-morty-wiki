// Character Detail Page — shows full info for one character, with episode list
import { useParams, Link } from 'react-router-dom'
import { getCharacterById, getMultipleEpisodes, extractIdFromUrl } from '../services/api'
import { useFetch } from '../hooks/useFetch'
import { useState, useEffect } from 'react'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'

const STATUS_CONFIG = {
  Alive:   { cls: 'text-portal-lime  bg-portal-lime/10  border-portal-lime/30',  dot: 'bg-portal-lime',  icon: '💚' },
  Dead:    { cls: 'text-red-400      bg-red-400/10      border-red-400/30',       dot: 'bg-red-400',      icon: '💀' },
  unknown: { cls: 'text-gray-400     bg-gray-400/10     border-gray-400/30',      dot: 'bg-gray-400',     icon: '❓' },
}

function InfoRow({ label, value }) {
  if (!value || value === 'unknown') return (
    <div className="flex justify-between py-3 border-b border-portal-border/30">
      <span className="text-gray-600 font-body text-sm">{label}</span>
      <span className="text-gray-600 font-body text-sm italic">Unknown</span>
    </div>
  )
  return (
    <div className="flex justify-between py-3 border-b border-portal-border/30">
      <span className="text-gray-500 font-body text-sm">{label}</span>
      <span className="text-white font-body text-sm font-700 text-right max-w-[60%]">{value}</span>
    </div>
  )
}

export default function CharacterDetailPage() {
  const { id } = useParams()
  const [episodes, setEpisodes] = useState([])
  const [epLoading, setEpLoading] = useState(false)

  const { data: character, loading, error, refetch } = useFetch(
    () => getCharacterById(id),
    [id]
  )

  // Fetch episode details once character is loaded
  useEffect(() => {
    if (!character?.episode?.length) return
    setEpLoading(true)
    const ids = character.episode.map(url => extractIdFromUrl(url))
    getMultipleEpisodes(ids)
      .then(data => setEpisodes(Array.isArray(data) ? data : [data]))
      .catch(() => setEpisodes([]))
      .finally(() => setEpLoading(false))
  }, [character])

  if (loading) return <LoadingSpinner text="Locating character..." />
  if (error)   return <ErrorMessage message={error} onRetry={refetch} />
  if (!character) return null

  const { name, status, species, type, gender, origin, location, image } = character
  const statusCfg = STATUS_CONFIG[status] || STATUS_CONFIG.unknown

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 animate-fade-in">
      {/* Back button */}
      <Link to="/characters"
        className="inline-flex items-center gap-2 text-gray-400 hover:text-portal-lime
                   font-body font-700 text-sm mb-8 transition-colors duration-200">
        ← Back to Characters
      </Link>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Left: Image */}
        <div className="flex flex-col gap-6">
          <div className="relative rounded-2xl overflow-hidden border border-portal-border">
            <img src={image} alt={name} className="w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-portal-dark/60 to-transparent"></div>
          </div>

          {/* Status Badge */}
          <div className={`flex items-center gap-3 px-5 py-4 rounded-xl border ${statusCfg.cls}`}>
            <span className={`w-3 h-3 rounded-full ${statusCfg.dot} animate-pulse`}></span>
            <div>
              <p className="text-xs uppercase tracking-wider opacity-70 font-body">Status</p>
              <p className="font-display text-xl tracking-wider">{status}</p>
            </div>
            <span className="ml-auto text-2xl">{statusCfg.icon}</span>
          </div>
        </div>

        {/* Right: Info */}
        <div className="flex flex-col gap-6">
          {/* Name + Species */}
          <div>
            <h1 className="font-display text-5xl md:text-6xl text-white tracking-wider leading-none mb-2"
              style={{ textShadow: '0 0 30px rgba(151,206,76,0.2)' }}>
              {name}
            </h1>
            <p className="text-portal-lime font-body font-700 text-lg">{species}</p>
          </div>

          {/* Info rows */}
          <div className="rounded-2xl border border-portal-border bg-card-gradient p-5">
            <h2 className="font-display text-lg text-gray-400 tracking-wider mb-2 uppercase">Details</h2>
            <InfoRow label="Type"       value={type} />
            <InfoRow label="Gender"     value={gender} />
            <InfoRow label="Origin"     value={origin?.name} />
            <InfoRow label="Last Location" value={location?.name} />
            <InfoRow label="Episodes"   value={`Appears in ${character.episode?.length || 0} episode(s)`} />
          </div>

          {/* Origin + Location links */}
          {origin?.url && (
            <Link to={`/locations/${extractIdFromUrl(origin.url)}`}
              className="flex items-center gap-3 p-4 rounded-xl border border-portal-border
                         bg-card-gradient hover:border-portal-lime/50 transition-all duration-200 group">
              <span className="text-2xl">🪐</span>
              <div>
                <p className="text-xs text-gray-600 font-body uppercase tracking-wider">Origin Planet</p>
                <p className="text-white font-body font-700 group-hover:text-portal-lime transition-colors">
                  {origin.name}
                </p>
              </div>
              <span className="ml-auto text-portal-lime opacity-0 group-hover:opacity-100 transition-opacity">→</span>
            </Link>
          )}
        </div>
      </div>

      {/* Episodes section */}
      <div className="mt-12">
        <h2 className="font-display text-3xl text-white tracking-wider mb-6">
          EPISODE <span className="text-portal-lime">APPEARANCES</span>
        </h2>
        {epLoading && <LoadingSpinner text="Loading episodes..." />}
        {!epLoading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {episodes.map(ep => (
              <Link key={ep.id} to={`/episodes/${ep.id}`}>
                <div className="rounded-xl border border-portal-border bg-card-gradient p-4
                                hover:border-portal-lime/40 transition-all duration-200 group card-hover">
                  <p className="text-portal-lime font-body font-800 text-sm mb-1">{ep.episode}</p>
                  <p className="text-white font-body font-700 group-hover:text-portal-lime transition-colors truncate">
                    {ep.name}
                  </p>
                  <p className="text-gray-600 font-body text-xs mt-1">{ep.air_date}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
