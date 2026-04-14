// Loading state component — shown while API data is fetching
export default function LoadingSpinner({ text = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-6">
      {/* Animated portal rings */}
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 rounded-full border-4 border-portal-lime/20 animate-spin"
          style={{ borderTopColor: '#97ce4c', animationDuration: '1s' }}></div>
        <div className="absolute inset-3 rounded-full border-2 border-portal-green/30 animate-spin"
          style={{ borderBottomColor: '#00b5cc', animationDuration: '1.5s', animationDirection: 'reverse' }}></div>
        <div className="absolute inset-0 flex items-center justify-center text-3xl animate-pulse">🧪</div>
      </div>
      <p className="font-body text-portal-lime font-600 tracking-wider animate-pulse">{text}</p>
    </div>
  )
}
