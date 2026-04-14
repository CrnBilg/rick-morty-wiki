// SearchBar component — text search with debounce
import { useState, useEffect } from 'react'

export default function SearchBar({ value, onChange, placeholder = 'Search...' }) {
  const [localValue, setLocalValue] = useState(value)

  // Debounce: wait 400ms after user stops typing before triggering search
  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(localValue)
    }, 400)
    return () => clearTimeout(timer)
  }, [localValue])

  useEffect(() => {
    setLocalValue(value)
  }, [value])

  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-lg">🔍</span>
      <input
        type="text"
        value={localValue}
        onChange={e => setLocalValue(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-portal-card border border-portal-border
                   text-white font-body placeholder-gray-600 focus:outline-none
                   focus:border-portal-lime/50 focus:ring-1 focus:ring-portal-lime/30
                   transition-all duration-200"
      />
      {localValue && (
        <button
          onClick={() => { setLocalValue(''); onChange('') }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
        >
          ✕
        </button>
      )}
    </div>
  )
}
