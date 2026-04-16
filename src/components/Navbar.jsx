import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

function PortalIcon() {
  return (
    <div className="relative h-10 w-10 flex-shrink-0">
      <div
        className="h-10 w-10 rounded-full border-2 border-portal-lime animate-portal-spin"
        style={{ boxShadow: '0 0 12px #97ce4c, 0 0 30px #97ce4c40' }}
      />
      <div className="absolute inset-2 rounded-full border border-portal-lime opacity-60" />
      <div className="absolute inset-0 flex items-center justify-center text-lg">{'\u{1F9EA}'}</div>
    </div>
  )
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  const links = [
    { to: '/', label: 'Home', icon: '\u{1F3E0}' },
    { to: '/characters', label: 'Characters', icon: '\u{1F47D}' },
    { to: '/episodes', label: 'Episodes', icon: '\u{1F4FA}' },
    { to: '/episode-machine', label: 'Machine', icon: '\u{2699}' },
    { to: '/locations', label: 'Locations', icon: '\u{1F30C}' },
    { to: '/guess-character', label: 'Guess', icon: '\u{1F50D}' },
    { to: '/quote-game', label: 'Quotes', icon: '\u{1F4AC}' },
    { to: '/memory-game', label: 'Memory', icon: '\u{1F9E0}' },
  ]

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-2 rounded-lg px-4 py-2 font-body text-sm font-700 transition-all duration-200 ${
      isActive
        ? 'border border-portal-lime/30 bg-portal-lime/10 text-portal-lime'
        : 'text-gray-400 hover:bg-white/5 hover:text-white'
    }`

  return (
    <nav
      className="sticky top-0 z-50 border-b border-portal-border/50 backdrop-blur-md"
      style={{ background: 'rgba(10,10,15,0.85)' }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="group flex items-center gap-3">
            <PortalIcon />
            <div className="leading-tight">
              <span className="font-display text-2xl tracking-wider text-white">RICK & MORTY</span>
              <p className="-mt-1 text-xs font-body font-600 tracking-widest text-portal-lime">WIKI</p>
            </div>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {links.map((link) => (
              <NavLink key={link.to} to={link.to} className={navLinkClass} end={link.to === '/'}>
                <span className="text-base text-current/80">
                  {link.icon}
                </span>
                {link.label}
              </NavLink>
            ))}
          </div>

          <button
            type="button"
            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-white/5 hover:text-white md:hidden"
            onClick={() => setMobileOpen((value) => !value)}
            aria-label="Toggle navigation"
          >
            <div className="flex h-5 w-6 flex-col justify-between">
              <span
                className={`block h-0.5 bg-current transition-all duration-300 ${
                  mobileOpen ? 'translate-y-2.5 rotate-45' : ''
                }`}
              />
              <span
                className={`block h-0.5 bg-current transition-all duration-300 ${
                  mobileOpen ? 'opacity-0' : ''
                }`}
              />
              <span
                className={`block h-0.5 bg-current transition-all duration-300 ${
                  mobileOpen ? '-translate-y-2 -rotate-45' : ''
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div
          className="space-y-1 border-t border-portal-border/50 px-4 pb-4 pt-2 md:hidden"
          style={{ background: 'rgba(10,10,15,0.95)' }}
        >
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={navLinkClass}
              end={link.to === '/'}
              onClick={() => setMobileOpen(false)}
            >
              <span className="text-base text-current/80">
                {link.icon}
              </span>
              {link.label}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  )
}
