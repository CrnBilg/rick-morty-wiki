// Error state component — shown when API call fails
export default function ErrorMessage({ message = 'Failed to load data.', onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <div className="text-6xl animate-float">💀</div>
      <h3 className="font-display text-2xl text-red-400 tracking-wider">OH GEEZ!</h3>
      <p className="text-gray-400 font-body text-center max-w-md">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 px-6 py-2 rounded-lg bg-portal-lime/10 border border-portal-lime/30
                     text-portal-lime font-body font-700 hover:bg-portal-lime/20 transition-all duration-200"
        >
          Try Again
        </button>
      )}
    </div>
  )
}
