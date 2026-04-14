// CharacterCard — displays a single character in the grid
import { Link } from 'react-router-dom'

const STATUS_CONFIG = {
  Alive:   { dot: 'bg-portal-lime', cls: 'status-alive',   icon: '💚' },
  Dead:    { dot: 'bg-red-500',     cls: 'status-dead',    icon: '💀' },
  unknown: { dot: 'bg-gray-500',    cls: 'status-unknown', icon: '❓' },
}

export default function CharacterCard({ character }) {
  const { id, name, status, species, location, image, gender } = character
  const statusCfg = STATUS_CONFIG[status] || STATUS_CONFIG.unknown

  return (
    <Link to={`/characters/${id}`}>
      <article className="card-hover rounded-2xl overflow-hidden border border-portal-border
                          bg-card-gradient cursor-pointer animate-fade-in group">
        {/* Character Image */}
        <div className="relative overflow-hidden">
          <img
            src={image}
            alt={name}
            loading="lazy"
            className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {/* Status badge overlay */}
          <div className="absolute top-3 right-3">
            <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-body font-700
                              backdrop-blur-sm bg-black/60 border border-white/10 ${statusCfg.cls}`}>
              <span className={`w-2 h-2 rounded-full ${statusCfg.dot} animate-pulse`}></span>
              {status}
            </span>
          </div>
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-portal-card via-transparent to-transparent opacity-80"></div>
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="font-display text-xl tracking-wide text-white truncate group-hover:text-portal-lime
                         transition-colors duration-200">{name}</h3>
          <p className="text-gray-400 text-sm font-body mt-0.5">{species} • {gender}</p>

          <div className="mt-3 pt-3 border-t border-portal-border/50">
            <p className="text-xs text-gray-600 font-body uppercase tracking-wider mb-1">Last known location</p>
            <p className="text-gray-300 text-sm font-body font-600 truncate">{location?.name || 'Unknown'}</p>
          </div>
        </div>
      </article>
    </Link>
  )
}
