// Home Page - introduction + navigation to main sections
import { Link } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { getCharacters } from '../services/api'
import HomeHeroEnergyTrail from '../components/HomeHeroEnergyTrail'
import HomeHeroPortal from '../components/HomeHeroPortal'
import HomeHeroRunners from '../components/HomeHeroRunners'

function Particles() {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    delay: Math.random() * 3,
  }))

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-portal-lime opacity-20 animate-float"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            animationDelay: `${p.delay}s`,
            filter: 'blur(1px)',
          }}
        />
      ))}
    </div>
  )
}

const SECTIONS = [
  {
    to: '/characters',
    icon: '👽',
    title: 'Characters',
    desc: 'Explore all 826 characters from the multiverse - from Rick & Morty to alien species and robots.',
    color: 'hover:border-portal-lime/50 hover:shadow-portal-lime/10',
    badge: '826+',
  },
  {
    to: '/episodes',
    icon: '📺',
    title: 'Episodes',
    desc: 'Browse every episode across all seasons, from pilot to the latest adventures.',
    color: 'hover:border-portal-green/50 hover:shadow-portal-green/10',
    badge: '51+',
  },
  {
    to: '/locations',
    icon: '🌌',
    title: 'Locations',
    desc: 'Discover planets, dimensions, and bizarre locations across the Rick & Morty universe.',
    color: 'hover:border-yellow-400/50 hover:shadow-yellow-400/10',
    badge: '126+',
  },
]

export default function HomePage() {
  const [featuredChars, setFeaturedChars] = useState([])
  const [isFeaturedVisible, setIsFeaturedVisible] = useState(false)
  const featuredSectionRef = useRef(null)

  useEffect(() => {
    getCharacters({ page: 1 })
      .then((data) => setFeaturedChars((data.results || []).slice(0, 6)))
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (!featuredChars.length || !featuredSectionRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsFeaturedVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 }
    )

    observer.observe(featuredSectionRef.current)

    return () => observer.disconnect()
  }, [featuredChars.length])

  return (
    <div className="min-h-screen">
      <section className="relative py-24 px-4 overflow-hidden">
        <Particles />
        <HomeHeroEnergyTrail />
        <HomeHeroPortal />
        <HomeHeroRunners />

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            className="w-96 h-96 rounded-full opacity-5"
            style={{ background: 'radial-gradient(circle, #97ce4c 0%, transparent 70%)' }}
          />
        </div>
        <div
          className="absolute inset-x-0 bottom-0 h-32 pointer-events-none"
          style={{
            background:
              'linear-gradient(180deg, transparent 0%, rgba(10,10,15,0.1) 35%, rgba(10,10,15,0.85) 100%)',
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-portal-lime/30
                          bg-portal-lime/10 text-portal-lime text-sm font-body font-700 mb-8"
          >
            <span className="animate-pulse">🟢</span> Wubba Lubba Dub Dub!
          </div>

          <h1
            className="font-display text-7xl md:text-9xl tracking-wider text-white mb-4"
            style={{ textShadow: '0 0 60px rgba(151,206,76,0.3)' }}
          >
            RICK &
            <br />
            <span className="text-portal-lime" style={{ textShadow: '0 0 40px #97ce4c' }}>
              MORTY
            </span>
          </h1>
          <p className="font-display text-2xl md:text-3xl text-gray-400 tracking-widest mb-6">
            MULTIVERSE WIKI
          </p>

          <p className="font-body text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed mb-10">
            Your ultimate guide to the Rick and Morty universe. Explore characters, episodes,
            and locations from the hit Adult Swim animated series.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/characters"
              className="px-8 py-3 rounded-xl bg-portal-lime text-portal-dark font-body font-800
                         hover:bg-portal-lime/90 transition-all duration-200 hover:scale-105
                         shadow-lg shadow-portal-lime/20"
            >
              Explore Characters →
            </Link>
            <Link
              to="/episodes"
              className="px-8 py-3 rounded-xl border border-portal-border text-white font-body font-700
                         hover:border-portal-lime/50 hover:bg-portal-lime/5 transition-all duration-200"
            >
              Browse Episodes
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid md:grid-cols-3 gap-6">
          {SECTIONS.map((sec) => (
            <Link key={sec.to} to={sec.to} className="group block">
              <div
                className={`feature-card card-hover rounded-2xl border border-portal-border bg-card-gradient p-6
                               shadow-lg cursor-pointer ${sec.color} transition-all duration-300`}
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="feature-card-icon text-4xl">{sec.icon}</span>
                  <span
                    className="feature-card-badge px-3 py-1 rounded-full bg-white/5 border border-white/10
                                   text-gray-400 text-xs font-body font-700"
                  >
                    {sec.badge}
                  </span>
                </div>
                <h2 className="font-display text-2xl text-white tracking-wider mb-2">{sec.title}</h2>
                <p className="text-gray-500 font-body text-sm leading-relaxed">{sec.desc}</p>
                <p className="feature-card-link mt-4 text-portal-lime font-body font-700 text-sm">
                  <span>Explore</span>
                  <span className="feature-card-link-arrow" aria-hidden="true">
                    →
                  </span>
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {featuredChars.length > 0 && (
        <section
          ref={featuredSectionRef}
          className={`featured-section-reveal max-w-7xl mx-auto px-4 pb-16 ${
            isFeaturedVisible ? 'is-visible' : ''
          }`}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-3xl text-white tracking-wider">
              FEATURED <span className="text-portal-lime">CHARACTERS</span>
            </h2>
            <Link to="/characters" className="featured-view-all text-portal-lime font-body font-700 text-sm">
              <span>View All</span>
              <span className="featured-view-all-arrow" aria-hidden="true">
                →
              </span>
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {featuredChars.map((char) => (
              <Link key={char.id} to={`/characters/${char.id}`} className="group block">
                <div className="featured-character-card card-hover rounded-xl overflow-hidden border border-portal-border bg-card-gradient">
                  <div className="featured-character-media">
                    <img
                      src={char.image}
                      alt={char.name}
                      className="featured-character-image w-full aspect-square object-cover"
                    />
                    <span
                      className={`featured-character-status status-${(char.status || 'unknown').toLowerCase()} bg-portal-dark/80`}
                    >
                      {char.status || 'Unknown'}
                    </span>
                  </div>
                  <div className="featured-character-body p-2 text-center">
                    <p className="font-body font-700 text-white text-xs truncate">{char.name}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="max-w-7xl mx-auto px-4 pb-16">
        <div className="rounded-2xl border border-portal-border bg-card-gradient p-8 md:p-12">
          <div className="max-w-3xl">
            <h2 className="font-display text-3xl text-white tracking-wider mb-4">
              ABOUT <span className="text-portal-lime">THE SHOW</span>
            </h2>
            <p className="text-gray-400 font-body leading-relaxed mb-4">
              Rick and Morty is an American adult animated television series created by Justin Roiland and
              Dan Harmon. The show follows the misadventures of cynical mad scientist Rick Sanchez and his
              good-hearted but easily influenced grandson Morty Smith, who split their time between domestic
              life and intergalactic adventures.
            </p>
            <p className="text-gray-500 font-body text-sm">
              Data powered by the{' '}
              <a
                href="https://rickandmortyapi.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-portal-lime hover:underline"
              >
                Rick and Morty API
              </a>{' '}
              - a free, public REST API.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
