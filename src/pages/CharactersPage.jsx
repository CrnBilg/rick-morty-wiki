// Characters Listing Page — search, filter by status/species/gender, pagination
import { useState } from 'react'
import { getCharacters } from '../services/api'
import { useFetch } from '../hooks/useFetch'
import CharacterCard from '../components/CharacterCard'
import SearchBar from '../components/SearchBar'
import Pagination from '../components/Pagination'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import EpisodesLabVial from '../components/EpisodesLabVial'
import PageTitleIcon from '../components/PageTitleIcon'

const STATUS_OPTIONS  = ['', 'alive', 'dead', 'unknown']
const GENDER_OPTIONS  = ['', 'female', 'male', 'genderless', 'unknown']
const SPECIES_OPTIONS = ['', 'Human', 'Alien', 'Humanoid', 'Robot', 'Mythological Creature', 'Animal', 'unknown']

function FilterSelect({ label, value, options, onChange }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-gray-500 font-body uppercase tracking-wider">{label}</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="px-3 py-2.5 rounded-xl bg-portal-card border border-portal-border text-white
                   font-body text-sm focus:outline-none focus:border-portal-lime/50
                   focus:ring-1 focus:ring-portal-lime/30 transition-all duration-200 cursor-pointer"
      >
        {options.map(opt => (
          <option key={opt} value={opt} style={{ background: '#111827' }}>
            {opt || `All ${label}s`}
          </option>
        ))}
      </select>
    </div>
  )
}

export default function CharactersPage() {
  const [page,    setPage]    = useState(1)
  const [name,    setName]    = useState('')
  const [status,  setStatus]  = useState('')
  const [gender,  setGender]  = useState('')
  const [species, setSpecies] = useState('')

  // Reset to page 1 on filter change
  function handleFilter(setter) {
    return (val) => { setter(val); setPage(1) }
  }

  const { data, loading, error, refetch } = useFetch(
    () => getCharacters({ page, name, status, gender, species }),
    [page, name, status, gender, species]
  )

  const characters  = data?.results || []
  const totalPages  = data?.info?.pages || 1
  const totalCount  = data?.info?.count || 0

  const hasFilters = name || status || gender || species

  function clearFilters() {
    setName(''); setStatus(''); setGender(''); setSpecies(''); setPage(1)
  }

  return (
    <div className="episodes-page relative max-w-7xl mx-auto px-4 py-10">
      <EpisodesLabVial />

      {/* Header */}
      <div className="relative z-10 mb-8">
        <h1 className="font-display text-5xl text-white tracking-wider mb-1">
          CHARACTERS <span className="text-portal-lime">WIKI</span>
          <PageTitleIcon icon="👽" variant="characters" label="Characters icon" />
        </h1>
        {!loading && (
          <p className="text-gray-500 font-body">
            {totalCount > 0 ? `${totalCount} characters found` : 'No characters found'}
          </p>
        )}
      </div>

      {/* Search + Filters */}
      <div className="relative z-10 bg-portal-card border border-portal-border rounded-2xl p-5 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="sm:col-span-2 lg:col-span-1 flex flex-col gap-1">
            <label className="text-xs text-gray-500 font-body uppercase tracking-wider">Search</label>
            <SearchBar
              value={name}
              onChange={handleFilter(setName)}
              placeholder="Search characters..."
            />
          </div>
          <FilterSelect label="Status"  value={status}  options={STATUS_OPTIONS}  onChange={handleFilter(setStatus)} />
          <FilterSelect label="Gender"  value={gender}  options={GENDER_OPTIONS}  onChange={handleFilter(setGender)} />
          <FilterSelect label="Species" value={species} options={SPECIES_OPTIONS} onChange={handleFilter(setSpecies)} />
        </div>
        {hasFilters && (
          <div className="mt-3 pt-3 border-t border-portal-border/50 flex items-center gap-2">
            <span className="text-xs text-gray-500 font-body">Active filters:</span>
            {[name && `Name: "${name}"`, status && `Status: ${status}`, gender && `Gender: ${gender}`, species && `Species: ${species}`]
              .filter(Boolean)
              .map(f => (
                <span key={f} className="px-2 py-0.5 rounded-full bg-portal-lime/10 border border-portal-lime/30
                                          text-portal-lime text-xs font-body">{f}</span>
              ))}
            <button onClick={clearFilters}
              className="ml-auto text-xs text-gray-500 hover:text-white font-body transition-colors">
              Clear all ✕
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      {loading && <LoadingSpinner text="Scanning multiverse for characters..." />}
      {error   && <ErrorMessage message={error} onRetry={refetch} />}

      {!loading && !error && characters.length === 0 && (
        <div className="relative z-10 text-center py-16">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="font-display text-2xl text-white tracking-wider mb-2">No characters found</h3>
          <p className="text-gray-500 font-body">Try different search terms or clear your filters.</p>
        </div>
      )}

      {!loading && !error && characters.length > 0 && (
        <>
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {characters.map(char => (
              <CharacterCard key={char.id} character={char} />
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
