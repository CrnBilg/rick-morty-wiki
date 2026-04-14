// 404 Not Found page
import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="text-8xl mb-6 animate-float">🛸</div>
      <h1 className="font-display text-8xl text-portal-lime tracking-wider mb-4"
        style={{ textShadow: '0 0 40px #97ce4c' }}>404</h1>
      <h2 className="font-display text-3xl text-white tracking-wider mb-3">PAGE NOT FOUND</h2>
      <p className="text-gray-500 font-body max-w-md mb-8">
        Looks like this dimension doesn't exist. Rick probably blew it up.
      </p>
      <Link to="/"
        className="px-8 py-3 rounded-xl bg-portal-lime text-portal-dark font-body font-800
                   hover:bg-portal-lime/90 transition-all duration-200 hover:scale-105">
        ← Back to Home
      </Link>
    </div>
  )
}
