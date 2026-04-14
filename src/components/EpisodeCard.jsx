// EpisodeCard — displays a single episode in the list
import { Link } from 'react-router-dom'

function parseEpisodeCode(code) {
  // "S01E01" -> Season 1, Episode 1
  const match = code?.match(/S(\d+)E(\d+)/i)
  if (!match) return { season: '?', episode: '?' }
  return { season: parseInt(match[1]), episode: parseInt(match[2]) }
}

// Season colors for visual variety
const SEASON_COLORS = {
  1: 'text-portal-lime  border-portal-lime/30  bg-portal-lime/10',
  2: 'text-portal-green border-portal-green/30 bg-portal-green/10',
  3: 'text-yellow-400   border-yellow-400/30   bg-yellow-400/10',
  4: 'text-purple-400   border-purple-400/30   bg-purple-400/10',
  5: 'text-pink-400     border-pink-400/30     bg-pink-400/10',
}

export default function EpisodeCard({ episode }) {
  const { id, name, air_date, episode: code, characters } = episode
  const { season, episode: ep } = parseEpisodeCode(code)
  const colorClass = SEASON_COLORS[season] || SEASON_COLORS[1]

  return (
    <Link to={`/episodes/${id}`}>
      <article className="card-hover rounded-2xl border border-portal-border bg-card-gradient p-5
                          cursor-pointer animate-fade-in group flex flex-col gap-3">
        {/* Episode code badge */}
        <div className="flex items-start justify-between gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-body font-800 border ${colorClass}`}>
            {code}
          </span>
          <span className="text-gray-600 text-xs font-body">{air_date}</span>
        </div>

        {/* Title */}
        <h3 className="font-display text-lg tracking-wide text-white group-hover:text-portal-lime
                       transition-colors duration-200 leading-tight">{name}</h3>

        {/* Stats */}
        <div className="flex items-center gap-4 mt-auto pt-3 border-t border-portal-border/50">
          <div className="text-center">
            <p className="text-xs text-gray-600 font-body uppercase tracking-wider">Season</p>
            <p className={`font-display text-lg ${colorClass.split(' ')[0]}`}>{season}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-600 font-body uppercase tracking-wider">Episode</p>
            <p className="font-display text-lg text-white">{ep}</p>
          </div>
          <div className="text-center ml-auto">
            <p className="text-xs text-gray-600 font-body uppercase tracking-wider">Characters</p>
            <p className="font-display text-lg text-white">{characters?.length || 0}</p>
          </div>
        </div>
      </article>
    </Link>
  )
}
