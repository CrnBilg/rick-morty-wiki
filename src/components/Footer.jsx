export default function Footer() {
  return (
    <footer
      className="border-t border-portal-border/50 mt-16 py-8 text-center"
      style={{ background: 'rgba(10,10,15,0.9)' }}
    >
      <div className="max-w-7xl mx-auto px-4">
        <p className="font-display text-xl text-portal-lime tracking-wider mb-1">RICK & MORTY WIKI</p>
        <p className="text-gray-500/80 text-sm font-body tracking-wide">
          Multiverse Data Interface • Powered by the{' '}
          <a
            href="https://rickandmortyapi.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-portal-lime/85 hover:text-portal-lime hover:underline underline-offset-4 transition-colors duration-200"
          >
            Rick and Morty API
          </a>{' '}
          • Built with React, Vite & Tailwind CSS
        </p>
        <p className="text-gray-700 text-xs mt-2 font-body">
          SE 3355 - Web Programming Midterm Project{' '}
          <span className="text-gray-600/80">• by Ceren Bilgenoğlu</span>
        </p>
      </div>
    </footer>
  )
}
