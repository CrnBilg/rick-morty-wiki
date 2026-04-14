import { Link } from 'react-router-dom'

const HERO_RUNNERS = [
  {
    key: 'rick',
    name: 'Rick',
    fullName: 'Rick Sanchez',
    to: '/characters/1',
    className: 'hero-character-rick',
    imageSrc: null,
    imageAlt: 'Rick running',
  },
  {
    key: 'morty',
    name: 'Morty',
    fullName: 'Morty Smith',
    to: '/characters/2',
    className: 'hero-character-morty',
    imageSrc: null,
    imageAlt: 'Morty running',
  },
]

function CharacterFigure({ runner }) {
  return (
    <Link
      to={runner.to}
      className={`hero-character-hover hero-character-link ${runner.className}-link`}
      aria-label={`View ${runner.fullName} profile`}
      title={`View ${runner.fullName}`}
    >
      <div className={`hero-character ${runner.className}`}>
        <span className="hero-character-aura" />
        <span className="hero-character-shadow" />

        {runner.imageSrc ? (
          <img
            src={runner.imageSrc}
            alt={runner.imageAlt}
            className="hero-character-image"
            loading="eager"
            decoding="async"
          />
        ) : (
          <div className="hero-character-fallback" aria-hidden="true">
            <span className="hero-character-trail" />
            <span className="hero-character-hair" />
            <span className="hero-character-head" />
            <span className="hero-character-ear hero-character-ear-left" />
            <span className="hero-character-ear hero-character-ear-right" />
            <span className="hero-character-eye hero-character-eye-left" />
            <span className="hero-character-eye hero-character-eye-right" />
            <span className="hero-character-brow hero-character-brow-left" />
            <span className="hero-character-brow hero-character-brow-right" />
            <span className="hero-character-mouth" />
            <span className="hero-character-neck" />
            <span className="hero-character-torso" />
            <span className="hero-character-coat hero-character-coat-left" />
            <span className="hero-character-coat hero-character-coat-right" />
            <span className="hero-character-arm hero-character-arm-back">
              <span className="hero-character-forearm" />
            </span>
            <span className="hero-character-arm hero-character-arm-front">
              <span className="hero-character-forearm" />
            </span>
            <span className="hero-character-leg hero-character-leg-back">
              <span className="hero-character-shin" />
            </span>
            <span className="hero-character-leg hero-character-leg-front">
              <span className="hero-character-shin" />
            </span>
          </div>
        )}
      </div>
      <span className="hero-character-indicator" aria-hidden="true">
        <span className="hero-character-indicator-name">{runner.name}</span>
        <span className="hero-character-indicator-cta">View Profile</span>
      </span>
    </Link>
  )
}

export default function HomeHeroRunners() {
  return (
    <div className="hero-run-scene absolute inset-x-0 bottom-8 top-12 pointer-events-none overflow-hidden">
      <div className="hero-run-lane" aria-hidden="true">
        <div className="hero-run-group">
          {HERO_RUNNERS.map(runner => (
            <CharacterFigure key={runner.key} runner={runner} />
          ))}
        </div>
      </div>
    </div>
  )
}
