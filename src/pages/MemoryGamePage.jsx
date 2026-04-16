import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import ErrorMessage from '../components/ErrorMessage'
import LoadingSpinner from '../components/LoadingSpinner'
import PageTitleIcon from '../components/PageTitleIcon'
import { getMultipleCharacters } from '../services/api'

const CHARACTER_POOL_IDS = [1, 2, 3, 4, 5, 47, 118, 183]
const PAIR_COUNT = 4
const MISMATCH_DELAY_MS = 850

function shuffleItems(items) {
  const nextItems = [...items]

  for (let i = nextItems.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[nextItems[i], nextItems[j]] = [nextItems[j], nextItems[i]]
  }

  return nextItems
}

function createDeck(characters) {
  const selectedCharacters = shuffleItems(characters).slice(0, PAIR_COUNT)

  return shuffleItems(
    selectedCharacters.flatMap((character, index) => [
      {
        id: `${character.id}-a-${index}`,
        characterId: character.id,
        name: character.name,
        image: character.image,
        species: character.species,
        status: character.status,
        isFlipped: false,
        isMatched: false,
      },
      {
        id: `${character.id}-b-${index}`,
        characterId: character.id,
        name: character.name,
        image: character.image,
        species: character.species,
        status: character.status,
        isFlipped: false,
        isMatched: false,
      },
    ])
  )
}

export default function MemoryGamePage() {
  const [characters, setCharacters] = useState([])
  const [cards, setCards] = useState([])
  const [selectedIds, setSelectedIds] = useState([])
  const [mismatchedIds, setMismatchedIds] = useState([])
  const [moves, setMoves] = useState(0)
  const [matchedPairs, setMatchedPairs] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isResolvingTurn, setIsResolvingTurn] = useState(false)
  const mismatchTimeoutRef = useRef(null)
  const isMountedRef = useRef(true)

  async function loadCharacters() {
    setLoading(true)
    setError('')

    try {
      const result = await getMultipleCharacters(CHARACTER_POOL_IDS)
      const nextCharacters = Array.isArray(result) ? result : [result]

      if (!isMountedRef.current) return

      setCharacters(nextCharacters)
      setCards(createDeck(nextCharacters))
      setSelectedIds([])
      setMismatchedIds([])
      setMoves(0)
      setMatchedPairs(0)
      setIsResolvingTurn(false)
    } catch (err) {
      if (isMountedRef.current) {
        setError(err.message || 'Unable to load the memory deck right now.')
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false)
      }
    }
  }

  useEffect(() => {
    isMountedRef.current = true
    loadCharacters().catch(() => {})

    return () => {
      isMountedRef.current = false
      window.clearTimeout(mismatchTimeoutRef.current)
    }
  }, [])

  const gameComplete = cards.length > 0 && matchedPairs === PAIR_COUNT

  function restartGame() {
    window.clearTimeout(mismatchTimeoutRef.current)
    setSelectedIds([])
    setMismatchedIds([])
    setMoves(0)
    setMatchedPairs(0)
    setIsResolvingTurn(false)
    setCards(createDeck(characters))
  }

  function handleCardClick(card) {
    if (isResolvingTurn || card.isMatched || card.isFlipped || gameComplete) return

    const nextSelectedIds = [...selectedIds, card.id]

    setCards((currentCards) =>
      currentCards.map((currentCard) =>
        currentCard.id === card.id ? { ...currentCard, isFlipped: true } : currentCard
      )
    )
    setSelectedIds(nextSelectedIds)

    if (nextSelectedIds.length < 2) return

    const [firstSelectedId] = selectedIds
    const firstCard = cards.find((currentCard) => currentCard.id === firstSelectedId)

    if (!firstCard) return

    setMoves((currentMoves) => currentMoves + 1)
    setIsResolvingTurn(true)

    if (firstCard.characterId === card.characterId) {
      setCards((currentCards) =>
        currentCards.map((currentCard) =>
          nextSelectedIds.includes(currentCard.id)
            ? { ...currentCard, isMatched: true }
            : currentCard
        )
      )
      setMatchedPairs((currentPairs) => currentPairs + 1)
      setSelectedIds([])
      setIsResolvingTurn(false)
      return
    }

    setMismatchedIds(nextSelectedIds)
    mismatchTimeoutRef.current = window.setTimeout(() => {
      if (!isMountedRef.current) return

      setCards((currentCards) =>
        currentCards.map((currentCard) =>
          nextSelectedIds.includes(currentCard.id)
            ? { ...currentCard, isFlipped: false }
            : currentCard
        )
      )
      setMismatchedIds([])
      setSelectedIds([])
      setIsResolvingTurn(false)
    }, MISMATCH_DELAY_MS)
  }

  return (
    <div className="relative mx-auto max-w-7xl px-4 py-10">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 overflow-hidden">
        <div className="memory-orb memory-orb-lime" />
        <div className="memory-orb memory-orb-cyan" />
      </div>

      <div className="relative z-10 mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-portal-lime/20 bg-portal-lime/10 px-3 py-1 text-xs font-body font-700 uppercase tracking-[0.28em] text-portal-lime">
            Interactive Mode
          </p>
          <h1 className="mb-3 font-display text-5xl tracking-wider text-white">
            MEMORY <span className="text-portal-lime">GAME</span>
            <PageTitleIcon icon="MG" variant="characters" label="Memory game icon" />
          </h1>
          <p className="font-body leading-relaxed text-gray-400">
            Lock in multiverse intel by matching Rick and Morty character pairs. Flip two
            cards at a time, keep the board clean, and finish the deck before your portal
            trail goes cold.
          </p>
        </div>

        <div className="memory-stats-panel rounded-2xl border border-portal-border bg-card-gradient p-4 sm:p-5">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div key={moves} className={`memory-stat-tile ${moves > 0 ? 'memory-stat-tile-pulse' : ''}`}>
              <span className="memory-stat-label">Moves</span>
              <strong className="memory-stat-value">{moves}</strong>
            </div>
            <div className="memory-stat-tile">
              <span className="memory-stat-label">Pairs</span>
              <strong className="memory-stat-value">
                {matchedPairs}/{PAIR_COUNT}
              </strong>
            </div>
            <div className="memory-stat-tile">
              <span className="memory-stat-label">Status</span>
              <strong className="memory-stat-value text-sm sm:text-base">
                {gameComplete ? 'Cleared' : 'Active'}
              </strong>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 mb-8 grid gap-4 xl:grid-cols-[minmax(0,1fr)_280px]">
        <div className="rounded-2xl border border-portal-border bg-portal-card/70 p-4 sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display text-2xl tracking-wider text-white">
                Match All <span className="text-portal-lime">4 Pairs</span>
              </h2>
              <p className="mt-1 text-sm font-body text-gray-500">
                Rapid clicks are locked while a turn resolves, so the board stays smooth and fair.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={restartGame}
                disabled={loading || characters.length === 0}
                className="rounded-xl border border-portal-lime/30 bg-portal-lime/10 px-4 py-2.5 font-body text-sm font-700 text-portal-lime transition-all duration-200 hover:border-portal-lime/50 hover:bg-portal-lime/15 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Restart Game
              </button>
              <Link
                to="/characters"
                className="rounded-xl border border-portal-border px-4 py-2.5 font-body text-sm font-700 text-white transition-all duration-200 hover:border-portal-green/40 hover:bg-white/5"
              >
                Browse Characters
              </Link>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-portal-border bg-portal-card/70 p-4 sm:p-5">
          <p className="mb-3 text-xs font-body font-700 uppercase tracking-[0.28em] text-gray-500">
            Success Protocol
          </p>
          <div className={`rounded-xl px-4 py-3 ${gameComplete ? 'memory-success-panel' : 'border border-portal-lime/20 bg-portal-lime/5'}`}>
            {gameComplete ? (
              <div className="memory-success-copy">
                <p className="memory-success-kicker">Portal Stabilized!</p>
                <p className="memory-success-title">All identities synced.</p>
                <p className="font-body text-sm leading-relaxed text-gray-300">
                  Every multiverse pairing is locked in. The deck is fully synchronized.
                </p>
              </div>
            ) : (
              <p className="font-body text-sm leading-relaxed text-gray-300">
                Complete the deck to stabilize the portal and reveal all synced identities.
              </p>
            )}
          </div>
        </div>
      </div>

      {loading && <LoadingSpinner text="Building the memory deck..." />}
      {!loading && error && <ErrorMessage message={error} onRetry={loadCharacters} />}

      {!loading && !error && cards.length > 0 && (
        <section className="relative z-10">
          <div className="memory-grid">
            {cards.map((card) => {
              const isOpen = card.isFlipped || card.isMatched

              return (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => handleCardClick(card)}
                  className={`memory-card ${isOpen ? 'is-flipped' : ''} ${
                    card.isMatched ? 'is-matched' : ''
                  } ${mismatchedIds.includes(card.id) ? 'is-mismatched' : ''} ${
                    gameComplete ? 'is-complete' : ''
                  }`}
                  aria-label={isOpen ? `Card showing ${card.name}` : 'Hidden memory card'}
                  aria-pressed={isOpen}
                >
                  <span className="memory-card-inner">
                    <span className="memory-card-face memory-card-back">
                      <span className="memory-card-back-core" />
                      <span className="memory-card-back-ring memory-card-back-ring-a" />
                      <span className="memory-card-back-ring memory-card-back-ring-b" />
                      <span className="memory-card-back-copy">
                        <span className="memory-card-back-label">Portal Cache</span>
                        <span className="memory-card-back-code">Pair Signal</span>
                      </span>
                    </span>

                    <span className="memory-card-face memory-card-front">
                      <img src={card.image} alt={card.name} className="memory-card-image" />
                      <span className="memory-card-overlay" />
                      <span className="memory-card-meta">
                        <span className="memory-card-name">{card.name}</span>
                        <span className="memory-card-detail">{card.status} | {card.species}</span>
                      </span>
                    </span>
                  </span>
                </button>
              )
            })}
          </div>
        </section>
      )}

      {!loading && !error && cards.length === 0 && (
        <div className="relative z-10 rounded-2xl border border-portal-border bg-portal-card/70 p-6 text-center">
          <p className="font-body text-sm text-gray-400">
            The memory deck could not be prepared. Try restarting the game.
          </p>
        </div>
      )}
    </div>
  )
}
