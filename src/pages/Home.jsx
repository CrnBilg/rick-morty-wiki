// pages/Home.jsx
// Ana sayfa - evreni tanıtır ve diğer sayfalara yönlendirir

import { Link } from 'react-router-dom';

const sections = [
  {
    to: '/characters',
    icon: '👤',
    title: 'Characters',
    desc: 'Explore 826 unique beings across dimensions — from Rick Sanchez to the most obscure alien.',
    color: '#00b5cc',
  },
  {
    to: '/episodes',
    icon: '📺',
    title: 'Episodes',
    desc: 'Browse all 51 episodes across 5 seasons. Re-live every interdimensional adventure.',
    color: '#97ce4c',
  },
  {
    to: '/locations',
    icon: '🪐',
    title: 'Locations',
    desc: 'Discover planets, dimensions, microverses and everything in between.',
    color: '#f59e0b',
  },
];

const stats = [
  { label: 'Characters', value: '826+' },
  { label: 'Episodes', value: '51' },
  { label: 'Locations', value: '126+' },
  { label: 'Dimensions', value: '∞' },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        {/* Animated background blobs */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl animate-pulse"
            style={{ background: 'radial-gradient(circle, #00b5cc, transparent)' }} />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl animate-pulse"
            style={{ background: 'radial-gradient(circle, #97ce4c, transparent)', animationDelay: '1s' }} />
        </div>

        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          {/* Portal animation */}
          <div className="inline-flex items-center justify-center mb-8 relative">
            <div className="w-28 h-28 md:w-36 md:h-36 rounded-full flex items-center justify-center text-5xl md:text-6xl animate-float relative"
              style={{ background: 'radial-gradient(circle, #00b5cc22, #97ce4c11)', border: '2px solid rgba(0,181,204,0.3)' }}>
              🛸
              {/* Orbit rings */}
              <div className="absolute inset-0 rounded-full border border-portal-green opacity-30 animate-ping" />
              <div className="absolute -inset-4 rounded-full border border-portal-lime opacity-20"
                style={{ animation: 'spin 6s linear infinite' }} />
            </div>
          </div>

          <h1 className="font-display font-black text-5xl md:text-7xl leading-tight mb-6 animate-slide-up">
            <span style={{ background: 'linear-gradient(135deg, #00b5cc, #97ce4c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Rick & Morty
            </span>
            <br />
            <span className="text-white text-3xl md:text-4xl font-bold">Universe Wiki</span>
          </h1>

          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-body leading-relaxed">
            The ultimate guide to the wildest animated show in the universe.
            Explore every character, location, and episode across all dimensions.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/characters" className="portal-btn text-base px-7 py-3">
              Explore Characters
            </Link>
            <Link to="/episodes"
              className="px-7 py-3 rounded-full text-base font-display font-semibold border border-gray-700 text-gray-300 hover:border-portal-green hover:text-white transition-all duration-200">
              View Episodes
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-10 border-y border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map(({ label, value }) => (
              <div key={label} className="text-center">
                <div className="font-display font-black text-3xl md:text-4xl mb-1"
                  style={{ background: 'linear-gradient(135deg, #00b5cc, #97ce4c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  {value}
                </div>
                <div className="text-gray-500 text-sm font-body">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About the universe */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-portal-green text-sm font-display font-semibold uppercase tracking-widest mb-3">
                About the Universe
              </p>
              <h2 className="section-title mb-6 text-4xl">Wubba Lubba<br />Dub Dub!</h2>
              <p className="text-gray-400 leading-relaxed mb-4">
                Rick and Morty is an adult animated science fiction sitcom created by Justin Roiland
                and Dan Harmon. The series follows the misadventures of cynical mad scientist Rick Sanchez
                and his good-natured grandson Morty Smith.
              </p>
              <p className="text-gray-500 leading-relaxed text-sm">
                Together they split their time between domestic life and interdimensional adventures —
                travelling through infinite timelines, alternate dimensions, and bizarre alien worlds.
                This wiki covers all 826+ characters, 126+ locations, and 51 episodes.
              </p>
            </div>

            {/* Character grid preview */}
            <div className="grid grid-cols-3 gap-2 opacity-80">
              {[1, 2, 3, 4, 5, 6].map((id) => (
                <Link key={id} to={`/characters/${id}`}
                  className="aspect-square rounded-xl overflow-hidden card-glow">
                  <img
                    src={`https://rickandmortyapi.com/api/character/avatar/${id}.jpeg`}
                    alt={`Character ${id}`}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Navigation cards */}
      <section className="py-10 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="section-title text-center mb-12">Explore the Wiki</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {sections.map(({ to, icon, title, desc, color }) => (
              <Link key={to} to={to}
                className="card-glow p-8 group text-center">
                <div className="text-5xl mb-4 group-hover:animate-bounce inline-block">{icon}</div>
                <h3 className="font-display font-bold text-xl mb-3 group-hover:transition-colors"
                  style={{ color }}>
                  {title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold transition-all"
                  style={{ color }}>
                  Browse {title} →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
