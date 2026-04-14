// Episode Detail Page — full info + character cast grid
import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getEpisodeById, getMultipleCharacters, extractIdFromUrl } from '../services/api'
import { useFetch } from '../hooks/useFetch'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'

const SEASON_COLORS = {
  1: { text: 'text-portal-lime',  bg: 'bg-portal-lime/10',  border: 'border-portal-lime/30' },
  2: { text: 'text-portal-green', bg: 'bg-portal-green/10', border: 'border-portal-green/30' },
  3: { text: 'text-yellow-400',   bg: 'bg-yellow-400/10',   border: 'border-yellow-400/30' },
  4: { text: 'text-purple-400',   bg: 'bg-purple-400/10',   border: 'border-purple-400/30' },
  5: { text: 'text-pink-400',     bg: 'bg-pink-400/10',     border: 'border-pink-400/30' },
}

function parseEpisodeCode(code) {
  const match = code?.match(/S(\d+)E(\d+)/i)
  if (!match) return { season: 1, episode: 1 }
  return { season: parseInt(match[1]), episode: parseInt(match[2]) }
}

export default function EpisodeDetailPage() {
  const { id } = useParams()
  const [cast, setCast]           = useState([])
  const [castLoading, setCastLoading] = useState(false)

  const { data: episode, loading, error, refetch } = useFetch(
    () => getEpisodeById(id),
    [id]
  )

  useEffect(() => {
    if (!episode?.characters?.length) return
    setCastLoading(true)
    const ids = episode.characters.map(url => extractIdFromUrl(url))
    getMultipleCharacters(ids)
      .then(data => setCast(Array.isArray(data) ? data : [data]))
      .catch(() => setCast([]))
      .finally(() => setCastLoading(false))
  }, [episode])

  if (loading) return <LoadingSpinner text="Opening the portal..." />
  if (error)   return <ErrorMessage message={error} onRetry={refetch} />
  if (!episode) return null

  const { name, air_date, episode: code, characters } = episode
  const { season, episode: epNum } = parseEpisodeCode(code)
  const colors = SEASON_COLORS[season] || SEASON_COLORS[1]

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 animate-fade-in">
      {/* Back */}
      <Link to="/episodes"
        className="inline-flex items-center gap-2 text-gray-400 hover:text-portal-lime
                   font-body font-700 text-sm mb-8 transition-colors duration-200">
        ← Back to Episodes
      </Link>

      {/* Hero card */}
      <div className="rounded-2xl border border-portal-border bg-card-gradient p-8 md:p-12 mb-10
                      relative overflow-hidden">
        {/* Background glow */}
        <div className={`absolute top-0 right-0 w-64 h-64 rounded-full opacity-10 blur-3xl ${colors.bg}`}
          style={{ background: colors.text.replace('text-', '') }}></div>

        <div className="relative">
          {/* Episode code badge */}
          <span className={`inline-flex px-4 py-1.5 rounded-full text-sm font-body font-800
                            border ${colors.text} ${colors.bg} ${colors.border} mb-6`}>
            {code}
          </span>

          <h1 className="font-display text-5xl md:text-7xl text-white tracking-wider mb-4 leading-none">
            {name}
          </h1>

          <div className="flex flex-wrap gap-6 mt-6">
            <div>
              <p className="text-xs text-gray-600 font-body uppercase tracking-wider mb-1">Air Date</p>
              <p className="text-white font-body font-700">📅 {air_date}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 font-body uppercase tracking-wider mb-1">Season</p>
              <p className={`font-display text-2xl ${colors.text}`}>{season}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 font-body uppercase tracking-wider mb-1">Episode</p>
              <p className="font-display text-2xl text-white">{epNum}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 font-body uppercase tracking-wider mb-1">Cast Size</p>
              <p className="font-display text-2xl text-white">{characters?.length || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Cast Section */}
      <div>
        <h2 className="font-display text-3xl text-white tracking-wider mb-6">
          EPISODE <span className={colors.text}>CAST</span>
        </h2>
        {castLoading && <LoadingSpinner text="Assembling the cast..." />}
        {!castLoading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {cast.map(char => (
              <Link key={char.id} to={`/characters/${char.id}`}>
                <div className="card-hover rounded-xl overflow-hidden border border-portal-border
                                bg-card-gradient group cursor-pointer">
                  <div className="relative">
                    <img src={char.image} alt={char.name}
                         className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-portal-card to-transparent opacity-70"></div>
                  </div>
                  <div className="p-2">
                    <p className="font-body font-700 text-white text-xs truncate
                                  group-hover:text-portal-lime transition-colors duration-200">{char.name}</p>
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
