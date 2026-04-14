// Locations Listing Page — search by name, filter by type, pagination
import { useState } from 'react'
import { getLocations } from '../services/api'
import { useFetch } from '../hooks/useFetch'
import LocationCard from '../components/LocationCard'
import SearchBar from '../components/SearchBar'
import Pagination from '../components/Pagination'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import EpisodesLabVial from '../components/EpisodesLabVial'
import PageTitleIcon from '../components/PageTitleIcon'

const TYPE_OPTIONS = [
  '', 'Planet', 'Space station', 'Microverse', 'TV', 'Resort',
  'Fantasy town', 'Dream', 'Dimension', 'Cluster', 'Game',
  'Customs', 'Daycare', 'Dwarf planet', 'Liquid', 'Menagerie',
]

const DIMENSION_OPTIONS = [
  '', 'Dimension C-137', 'Replacement Dimension', 'Cronenberg Dimension',
  'Fantasy Dimension', 'Dimension 5-126',
]

export default function LocationsPage() {
  const [page,      setPage]      = useState(1)
  const [name,      setName]      = useState('')
  const [type,      setType]      = useState('')
  const [dimension, setDimension] = useState('')

  function handleFilter(setter) {
    return (val) => { setter(val); setPage(1) }
  }

  const { data, loading, error, refetch } = useFetch(
    () => getLocations({ page, name, type, dimension }),
    [page, name, type, dimension]
  )

  const locations  = data?.results || []
  const totalPages = data?.info?.pages || 1
  const totalCount = data?.info?.count || 0

  return (
    <div className="episodes-page relative max-w-7xl mx-auto px-4 py-10">
      <EpisodesLabVial />

      {/* Header */}
      <div className="relative z-10 mb-8">
        <h1 className="font-display text-5xl text-white tracking-wider mb-1">
          LOCATIONS <span className="text-portal-lime">WIKI</span>
          <PageTitleIcon icon="📍" variant="locations" label="Locations icon" />
        </h1>
        {!loading && (
          <p className="text-gray-500 font-body">
            {totalCount > 0 ? `${totalCount} locations found` : 'No locations found'}
          </p>
        )}
      </div>

      {/* Filters */}
      <div className="relative z-10 bg-portal-card border border-portal-border rounded-2xl p-5 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500 font-body uppercase tracking-wider">Search</label>
            <SearchBar
              value={name}
              onChange={handleFilter(setName)}
              placeholder="Search locations..."
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500 font-body uppercase tracking-wider">Type</label>
            <select
              value={type}
              onChange={e => handleFilter(setType)(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-portal-card border border-portal-border text-white
                         font-body text-sm focus:outline-none focus:border-portal-lime/50
                         focus:ring-1 focus:ring-portal-lime/30 transition-all duration-200 cursor-pointer"
            >
              {TYPE_OPTIONS.map(opt => (
                <option key={opt} value={opt} style={{ background: '#111827' }}>
                  {opt || 'All Types'}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500 font-body uppercase tracking-wider">Dimension</label>
            <select
              value={dimension}
              onChange={e => handleFilter(setDimension)(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-portal-card border border-portal-border text-white
                         font-body text-sm focus:outline-none focus:border-portal-lime/50
                         focus:ring-1 focus:ring-portal-lime/30 transition-all duration-200 cursor-pointer"
            >
              {DIMENSION_OPTIONS.map(opt => (
                <option key={opt} value={opt} style={{ background: '#111827' }}>
                  {opt || 'All Dimensions'}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      {loading && <LoadingSpinner text="Mapping the multiverse..." />}
      {error   && <ErrorMessage message={error} onRetry={refetch} />}

      {!loading && !error && locations.length === 0 && (
        <div className="relative z-10 text-center py-16">
          <div className="text-6xl mb-4">🌌</div>
          <h3 className="font-display text-2xl text-white tracking-wider mb-2">No locations found</h3>
          <p className="text-gray-500 font-body">Try different filters.</p>
        </div>
      )}

      {!loading && !error && locations.length > 0 && (
        <>
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {locations.map(loc => (
              <LocationCard key={loc.id} location={loc} />
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
