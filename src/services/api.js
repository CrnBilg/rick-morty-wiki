// =============================================
// Rick and Morty API - Service Layer
// Base URL: https://rickandmortyapi.com/api
// =============================================

const BASE_URL = 'https://rickandmortyapi.com/api'

/**
 * Generic fetch helper with error handling
 */
async function fetchData(url) {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`)
  }
  return response.json()
}

// ── Characters ──────────────────────────────

export async function getCharacters({ page = 1, name = '', status = '', species = '', gender = '' } = {}) {
  const params = new URLSearchParams({ page })
  if (name)    params.append('name', name)
  if (status)  params.append('status', status)
  if (species) params.append('species', species)
  if (gender)  params.append('gender', gender)
  return fetchData(`${BASE_URL}/character?${params}`)
}

export async function getCharacterById(id) {
  return fetchData(`${BASE_URL}/character/${id}`)
}

export async function getMultipleCharacters(ids) {
  if (!ids || ids.length === 0) return []
  return fetchData(`${BASE_URL}/character/${ids.join(',')}`)
}

// ── Episodes ────────────────────────────────

export async function getEpisodes({ page = 1, name = '', episode = '' } = {}) {
  const params = new URLSearchParams({ page })
  if (name)    params.append('name', name)
  if (episode) params.append('episode', episode)
  return fetchData(`${BASE_URL}/episode?${params}`)
}

export async function getEpisodeById(id) {
  return fetchData(`${BASE_URL}/episode/${id}`)
}

export async function getMultipleEpisodes(ids) {
  if (!ids || ids.length === 0) return []
  return fetchData(`${BASE_URL}/episode/${ids.join(',')}`)
}

// ── Locations ───────────────────────────────

export async function getLocations({ page = 1, name = '', type = '', dimension = '' } = {}) {
  const params = new URLSearchParams({ page })
  if (name)      params.append('name', name)
  if (type)      params.append('type', type)
  if (dimension) params.append('dimension', dimension)
  return fetchData(`${BASE_URL}/location?${params}`)
}

export async function getLocationById(id) {
  return fetchData(`${BASE_URL}/location/${id}`)
}

// ── Helpers ─────────────────────────────────

export function extractIdFromUrl(url) {
  if (!url) return null
  const parts = url.split('/')
  return parts[parts.length - 1]
}
