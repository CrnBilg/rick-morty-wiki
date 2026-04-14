import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'

// Portal SVG icon for the brand
function PortalIcon() {
  return (
    <div className="relative w-10 h-10 flex-shrink-0">
      <div className="w-10 h-10 rounded-full border-2 border-portal-lime animate-portal-spin"
        style={{ boxShadow: '0 0 12px #97ce4c, 0 0 30px #97ce4c40' }}>
      </div>
      <div className="absolute inset-2 rounded-full border border-portal-lime opacity-60"></div>
      <div className="absolute inset-0 flex items-center justify-center text-lg">🧪</div>
    </div>
  )
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  const links = [
    { to: '/',           label: 'Home',       icon: '🏠' },
    { to: '/characters', label: 'Characters',  icon: '👽' },
    { to: '/episodes',   label: 'Episodes',    icon: '📺' },
    { to: '/locations',  label: 'Locations',   icon: '🌌' },
  ]

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-2 px-4 py-2 rounded-lg font-body font-700 text-sm transition-all duration-200 ${
      isActive
        ? 'text-portal-lime bg-portal-lime/10 border border-portal-lime/30'
        : 'text-gray-400 hover:text-white hover:bg-white/5'
    }`

  return (
    <nav className="sticky top-0 z-50 border-b border-portal-border/50 backdrop-blur-md"
         style={{ background: 'rgba(10,10,15,0.85)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <PortalIcon />
            <div className="leading-tight">
              <span className="font-display text-2xl tracking-wider text-white">RICK & MORTY</span>
              <p className="text-xs text-portal-lime font-body font-600 -mt-1 tracking-widest">WIKI</p>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {links.map(link => (
              <NavLink key={link.to} to={link.to} className={navLinkClass} end={link.to === '/'}>
                <span>{link.icon}</span>
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5"
            onClick={() => setMobileOpen(v => !v)}
          >
            <div className="w-6 h-5 flex flex-col justify-between">
              <span className={`block h-0.5 bg-current transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-2.5' : ''}`}></span>
              <span className={`block h-0.5 bg-current transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`}></span>
              <span className={`block h-0.5 bg-current transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-portal-border/50 px-4 pb-4 pt-2 space-y-1"
             style={{ background: 'rgba(10,10,15,0.95)' }}>
          {links.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              className={navLinkClass}
              end={link.to === '/'}
              onClick={() => setMobileOpen(false)}
            >
              <span>{link.icon}</span>
              {link.label}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  )
}
