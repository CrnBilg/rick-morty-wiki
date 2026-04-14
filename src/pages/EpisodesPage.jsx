// Episodes Listing Page — search by name or episode code, pagination
import { useState } from 'react'
import { getEpisodes } from '../services/api'
import { useFetch } from '../hooks/useFetch'
import EpisodeCard from '../components/EpisodeCard'
import SearchBar from '../components/SearchBar'
import Pagination from '../components/Pagination'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import EpisodesLabVial from '../components/EpisodesLabVial'
import PageTitleIcon from '../components/PageTitleIcon'

const SEASON_OPTIONS = [
  { label: 'All Seasons', value: '' },
  { label: 'Season 1', value: 'S01' },
  { label: 'Season 2', value: 'S02' },
  { label: 'Season 3', value: 'S03' },
  { label: 'Season 4', value: 'S04' },
  { label: 'Season 5', value: 'S05' },
]

export default function EpisodesPage() {
  const [page,    setPage]    = useState(1)
  const [name,    setName]    = useState('')
  const [season,  setSeason]  = useState('')

  function handleFilter(setter) {
    return (val) => { setter(val); setPage(1) }
  }

  const { data, loading, error, refetch } = useFetch(
    () => getEpisodes({ page, name, episode: season }),
    [page, name, season]
  )

  const episodes   = data?.results || []
  const totalPages = data?.info?.pages || 1
  const totalCount = data?.info?.count || 0

  return (
    <div className="episodes-page relative max-w-7xl mx-auto px-4 py-10">
      <EpisodesLabVial />

      {/* Header */}
      <div className="relative z-10 mb-8">
        <h1 className="font-display text-5xl text-white tracking-wider mb-1">
          EPISODES <span className="text-portal-lime">WIKI</span>
          <PageTitleIcon icon="📺" variant="episodes" label="Episodes icon" />
        </h1>
        {!loading && (
          <p className="text-gray-500 font-body">
            {totalCount > 0 ? `${totalCount} episodes found` : 'No episodes found'}
          </p>
        )}
      </div>

      {/* Search + Season Filter */}
      <div className="relative z-10 bg-portal-card border border-portal-border rounded-2xl p-5 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2 flex flex-col gap-1">
            <label className="text-xs text-gray-500 font-body uppercase tracking-wider">Search</label>
            <SearchBar
              value={name}
              onChange={handleFilter(setName)}
              placeholder="Search episodes by name..."
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500 font-body uppercase tracking-wider">Filter by Season</label>
            <select
              value={season}
              onChange={e => { handleFilter(setSeason)(e.target.value) }}
              className="px-3 py-2.5 rounded-xl bg-portal-card border border-portal-border text-white
                         font-body text-sm focus:outline-none focus:border-portal-lime/50
                         focus:ring-1 focus:ring-portal-lime/30 transition-all duration-200 cursor-pointer"
            >
              {SEASON_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value} style={{ background: '#111827' }}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      {loading && <LoadingSpinner text="Tuning into the right dimension..." />}
      {error   && <ErrorMessage message={error} onRetry={refetch} />}

      {!loading && !error && episodes.length === 0 && (
        <div className="relative z-10 text-center py-16">
          <div className="text-6xl mb-4">📺</div>
          <h3 className="font-display text-2xl text-white tracking-wider mb-2">No episodes found</h3>
          <p className="text-gray-500 font-body">Try a different search or season filter.</p>
        </div>
      )}

      {!loading && !error && episodes.length > 0 && (
        <>
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {episodes.map(ep => (
              <EpisodeCard key={ep.id} episode={ep} />
            ))}
          </div>
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          <p className="text-center text-gray-600 font-body text-sm mt-4">
            Page {page} of {totalPages}
          </p>
        </>
      )}
    </div>
  )
}
