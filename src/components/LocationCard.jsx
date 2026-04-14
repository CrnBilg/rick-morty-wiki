// LocationCard — displays a single location
import { Link } from 'react-router-dom'

const TYPE_ICONS = {
  Planet:     '🪐',
  Space:      '🌌',
  Station:    '🛸',
  Microverse: '🔬',
  TV:         '📺',
  Resort:     '🏖️',
  Fantasy:    '🧙',
  Dream:      '💭',
  Dimension:  '🌀',
}

function getIcon(type) {
  for (const [key, icon] of Object.entries(TYPE_ICONS)) {
    if (type?.includes(key)) return icon
  }
  return '🌍'
}

export default function LocationCard({ location }) {
  const { id, name, type, dimension, residents } = location

  return (
    <Link to={`/locations/${id}`}>
      <article className="card-hover rounded-2xl border border-portal-border bg-card-gradient p-5
                          cursor-pointer animate-fade-in group min-h-[160px] flex flex-col gap-3">
        {/* Icon + Type */}
        <div className="flex items-center gap-2">
          <span className="text-2xl">{getIcon(type)}</span>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-body font-700
                           border border-portal-green/30 bg-portal-green/10 text-portal-green">
            {type || 'Unknown'}
          </span>
        </div>

        {/* Name */}
        <h3 className="font-display text-xl tracking-wide text-white group-hover:text-portal-lime
                       transition-colors duration-200 leading-tight">{name}</h3>

        {/* Dimension + Residents */}
        <div className="mt-auto pt-3 border-t border-portal-border/50 flex justify-between items-end">
          <div>
            <p className="text-xs text-gray-600 font-body uppercase tracking-wider">Dimension</p>
            <p className="text-gray-400 text-sm font-body font-600 truncate max-w-[160px]">
              {dimension === 'unknown' ? '?' : dimension}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-600 font-body uppercase tracking-wider">Residents</p>
            <p className="font-display text-xl text-portal-lime">{residents?.length || 0}</p>
          </div>
        </div>
      </article>
    </Link>
  )
}
