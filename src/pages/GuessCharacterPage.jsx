import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import CharacterPuzzleBoard from '../components/CharacterPuzzleBoard'
import ErrorMessage from '../components/ErrorMessage'
import LoadingSpinner from '../components/LoadingSpinner'
import PageTitleIcon from '../components/PageTitleIcon'
import { getCharacters, getLocations } from '../services/api'

const MODES = {
  CHARACTER: 'character',
  LOCATION: 'location',
}

const CHARACTER_PLAY_MODES = {
  CLASSIC: 'classic',
  PUZZLE: 'puzzle',
}

const PUZZLE_DIFFICULTIES = {
  EASY: 'easy',
  MEDIUM: 'medium',
}

const PUZZLE_HINTS = [
  { key: 'gender', label: 'Gender' },
  { key: 'species', label: 'Species' },
  { key: 'origin', label: 'Origin' },
]

const CURATED_LOCATION_NAMES = new Set([
  'Earth (C-137)',
  'Citadel of Ricks',
  'Anatomy Park',
  'Bird World',
  'Cronenberg Earth',
  'Froopyland',
  'Gazorpazorp',
  'Interdimensional Cable',
  'Purge Planet',
  'Snake Planet',
  'Planet Squanch',
  'Gear World',
  "Worldender's lair",
  'Nuptia 4',
  'Story Train',
  "Mr. Goldenfold's dream",
])

function shuffleItems(items) {
  const nextItems = [...items]

  for (let i = nextItems.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[nextItems[i], nextItems[j]] = [nextItems[j], nextItems[i]]
  }

  return nextItems
}

function sampleUniqueItems(items, count, excludedId) {
  const filtered = items.filter((item) => item.id !== excludedId)
  return shuffleItems(filtered).slice(0, count)
}

function getLocationVisualClass(location) {
  const descriptor = `${location?.type || ''} ${location?.dimension || ''}`.toLowerCase()

  if (descriptor.includes('microverse') || descriptor.includes('dimension')) {
    return 'is-dimension'
  }

  if (descriptor.includes('planet') || descriptor.includes('cluster')) {
    return 'is-planet'
  }

  if (descriptor.includes('space') || descriptor.includes('station')) {
    return 'is-station'
  }

  if (descriptor.includes('dream') || descriptor.includes('fantasy')) {
    return 'is-dream'
  }

  return 'is-default'
}

function getLocationClue(location) {
  const descriptor = `${location?.type || ''} ${location?.dimension || ''}`.toLowerCase()

  if (descriptor.includes('citadel')) {
    return 'A high-density nexus known for concentrated interdimensional traffic.'
  }

  if (descriptor.includes('dream')) {
    return 'This signal feels unstable, surreal, and psychologically distorted.'
  }

  if (descriptor.includes('microverse')) {
    return 'A contained environment with reality folded inward on itself.'
  }

  if (descriptor.includes('space') || descriptor.includes('station')) {
    return 'A manufactured waypoint suspended away from any normal planetary surface.'
  }

  if (descriptor.includes('resort')) {
    return 'Despite the polished exterior, this destination gives off luxury-with-danger energy.'
  }

  if (descriptor.includes('planet') || descriptor.includes('dimension')) {
    return 'The scanner points to a full-scale world rather than a compact facility.'
  }

  return 'The multiverse signature suggests a named destination with a distinct environmental identity.'
}

function getPartialDimensionLabel(dimension) {
  if (!dimension || dimension === 'unknown') return 'Unknown dimension'

  if (dimension.length <= 16) return dimension

  return `${dimension.slice(0, 14)}...`
}

function getPuzzleHintValue(target, hintKey) {
  if (!target) return 'Unavailable'

  if (hintKey === 'origin') {
    return target.origin?.name || 'Unknown'
  }

  return target[hintKey] || 'Unknown'
}

export default function GuessCharacterPage() {
  const [mode, setMode] = useState(MODES.CHARACTER)
  const [characterPlayMode, setCharacterPlayMode] = useState(CHARACTER_PLAY_MODES.CLASSIC)
  const [puzzleDifficulty, setPuzzleDifficulty] = useState(PUZZLE_DIFFICULTIES.EASY)
  const [pageTotals, setPageTotals] = useState({
    [MODES.CHARACTER]: null,
    [MODES.LOCATION]: null,
  })
  const [currentTarget, setCurrentTarget] = useState(null)
  const [options, setOptions] = useState([])
  const [selectedOption, setSelectedOption] = useState('')
  const [roundResolved, setRoundResolved] = useState(false)
  const [isCorrectGuess, setIsCorrectGuess] = useState(false)
  const [correctGuesses, setCorrectGuesses] = useState(0)
  const [totalRounds, setTotalRounds] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [hintStep, setHintStep] = useState(0)
  const [hintPenaltyPoints, setHintPenaltyPoints] = useState(0)
  const isMountedRef = useRef(true)

  const isCharacterMode = mode === MODES.CHARACTER
  const isPuzzleMode = isCharacterMode && characterPlayMode === CHARACTER_PLAY_MODES.PUZZLE

  async function buildRound(activeMode = mode, activeCharacterPlayMode = characterPlayMode) {
    setLoading(true)
    setError('')
    setSelectedOption('')
    setRoundResolved(false)
    setIsCorrectGuess(false)
    setHintStep(0)

    try {
      let nextTotalPages = pageTotals[activeMode]
      const fetchPage = activeMode === MODES.CHARACTER ? getCharacters : getLocations

      if (!nextTotalPages) {
        const firstPage = await fetchPage({ page: 1 })
        nextTotalPages = firstPage?.info?.pages || 1

        if (!isMountedRef.current) return

        setPageTotals((currentTotals) => ({
          ...currentTotals,
          [activeMode]: nextTotalPages,
        }))
      }

      const randomPage = Math.max(1, Math.floor(Math.random() * nextTotalPages) + 1)
      const pageData = await fetchPage({ page: randomPage })
      let pageItems = pageData?.results || []

      if (activeMode === MODES.LOCATION) {
        const curatedItems = pageItems.filter((item) => CURATED_LOCATION_NAMES.has(item.name))
        if (curatedItems.length >= 4) {
          pageItems = curatedItems
        }
      }

      if (!pageItems.length) {
        throw new Error(
          activeMode === MODES.CHARACTER
            ? 'No characters were available for this round.'
            : 'No locations were available for this round.'
        )
      }

      const answerTarget = pageItems[Math.floor(Math.random() * pageItems.length)]
      let nextOptions = []

      if (!(activeMode === MODES.CHARACTER && activeCharacterPlayMode === CHARACTER_PLAY_MODES.PUZZLE)) {
        const distractors = sampleUniqueItems(pageItems, 3, answerTarget.id)

        if (distractors.length < 3) {
          throw new Error(
            activeMode === MODES.CHARACTER
              ? 'Not enough character options were available for this round.'
              : 'Not enough location options were available for this round.'
          )
        }

        nextOptions = shuffleItems([
          answerTarget.name,
          ...distractors.map((item) => item.name),
        ])
      }

      if (!isMountedRef.current) return

      setCurrentTarget(answerTarget)
      setOptions(nextOptions)
    } catch (err) {
      if (isMountedRef.current) {
        setError(
          err.message ||
            (activeMode === MODES.CHARACTER
              ? 'Unable to scan a character identity right now.'
              : 'Unable to scan a location signature right now.')
        )
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false)
      }
    }
  }

  useEffect(() => {
    isMountedRef.current = true

    return () => {
      isMountedRef.current = false
    }
  }, [])

  useEffect(() => {
    setCorrectGuesses(0)
    setTotalRounds(0)
    setHintPenaltyPoints(0)
    buildRound(mode, characterPlayMode).catch(() => {})
  }, [mode, characterPlayMode])

  function handleModeChange(nextMode) {
    if (loading || mode === nextMode) return
    setMode(nextMode)
  }

  function handleCharacterPlayModeChange(nextPlayMode) {
    if (loading || characterPlayMode === nextPlayMode) return
    setCharacterPlayMode(nextPlayMode)
  }

  function handlePuzzleDifficultyChange(nextDifficulty) {
    if (loading || puzzleDifficulty === nextDifficulty) return
    setPuzzleDifficulty(nextDifficulty)

    if (isPuzzleMode) {
      buildRound(MODES.CHARACTER, CHARACTER_PLAY_MODES.PUZZLE).catch(() => {})
    }
  }

  function handleGuess(option) {
    if (loading || roundResolved || !currentTarget || isPuzzleMode) return

    const correct = option === currentTarget.name

    setSelectedOption(option)
    setRoundResolved(true)
    setIsCorrectGuess(correct)
    setTotalRounds((value) => value + 1)

    if (correct) {
      setCorrectGuesses((value) => value + 1)
    }
  }

  function handlePuzzleComplete() {
    if (loading || roundResolved || !currentTarget || !isPuzzleMode) return

    setRoundResolved(true)
    setIsCorrectGuess(true)
    setTotalRounds((value) => value + 1)
    setCorrectGuesses((value) => value + 1)
  }

  function handleRevealHint() {
    if (!isPuzzleMode || roundResolved || hintStep >= PUZZLE_HINTS.length) return

    setHintStep((value) => value + 1)
    setHintPenaltyPoints((value) => value + 0.2)
  }

  function getOptionState(option) {
    if (!roundResolved || !currentTarget) return ''
    if (option === currentTarget.name) return 'is-correct'
    if (option === selectedOption && option !== currentTarget.name) return 'is-wrong'
    return 'is-dimmed'
  }

  const adjustedAccuracy = totalRounds > 0
    ? Math.max(0, Math.round(((correctGuesses - hintPenaltyPoints) / totalRounds) * 100))
    : null
  const accuracy = adjustedAccuracy === null ? '--' : `${adjustedAccuracy}%`

  return (
    <div className="relative mx-auto max-w-7xl px-4 py-10">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 overflow-hidden">
        <div className="guess-orb guess-orb-lime" />
        <div className="guess-orb guess-orb-cyan" />
      </div>

      <div className="relative z-10 mb-6 flex flex-col gap-3">
        <div className="guess-mode-switch rounded-2xl border border-portal-border bg-portal-card/60 p-2">
          <button
            type="button"
            onClick={() => handleModeChange(MODES.CHARACTER)}
            className={`guess-mode-button ${isCharacterMode ? 'is-active' : ''}`}
          >
            Character
          </button>
          <button
            type="button"
            onClick={() => handleModeChange(MODES.LOCATION)}
            className={`guess-mode-button ${!isCharacterMode ? 'is-active' : ''}`}
          >
            Location
          </button>
        </div>

        {isCharacterMode && (
          <div className="guess-mode-switch rounded-2xl border border-portal-border bg-portal-card/50 p-2">
            <button
              type="button"
              onClick={() => handleCharacterPlayModeChange(CHARACTER_PLAY_MODES.CLASSIC)}
              className={`guess-mode-button ${!isPuzzleMode ? 'is-active' : ''}`}
            >
              Classic Guess
            </button>
            <button
              type="button"
              onClick={() => handleCharacterPlayModeChange(CHARACTER_PLAY_MODES.PUZZLE)}
              className={`guess-mode-button ${isPuzzleMode ? 'is-active' : ''}`}
            >
              Puzzle Mode
            </button>
          </div>
        )}
      </div>

      <div className="relative z-10 mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-portal-green/25 bg-portal-green/10 px-3 py-1 text-xs font-body font-700 uppercase tracking-[0.28em] text-portal-green">
            Target Scan
          </p>
          <h1 className="mb-3 font-display text-5xl tracking-wider text-white">
            {isPuzzleMode ? 'REBUILD THE ' : 'GUESS THE '}
            <span className="text-portal-lime">{isCharacterMode ? 'CHARACTER' : 'LOCATION'}</span>
            <PageTitleIcon icon={isPuzzleMode ? '[]' : '??'} variant="characters" label="Guess the target icon" />
          </h1>
          <p className="font-body leading-relaxed text-gray-400">
            {isPuzzleMode
              ? 'Reassemble the fragmented signal, unlock character hints only when needed, and reveal the target once the board snaps fully into place.'
              : isCharacterMode
                ? 'Read the silhouette, lock onto the right identity, and confirm your guess before the signal stabilizes.'
                : 'Interpret the location signature, study the environment cues, and confirm which place the scanner is targeting.'}
          </p>
        </div>

        <div className="guess-score-panel rounded-2xl border border-portal-border bg-card-gradient p-4 sm:p-5">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="guess-score-tile">
              <span className="guess-score-label">Correct</span>
              <strong className="guess-score-value">{correctGuesses}</strong>
            </div>
            <div className="guess-score-tile">
              <span className="guess-score-label">Rounds</span>
              <strong className="guess-score-value">{totalRounds}</strong>
            </div>
            <div className="guess-score-tile">
              <span className="guess-score-label">Accuracy</span>
              <strong className="guess-score-value">{accuracy}</strong>
            </div>
          </div>
          {isPuzzleMode && (
            <p className="mt-3 text-center font-body text-xs leading-relaxed text-gray-500">
              Hint usage lowers accuracy calibration by 20% per reveal.
            </p>
          )}
        </div>
      </div>

      <div className="relative z-10 grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <section className="guess-stage rounded-[1.75rem] border border-portal-border bg-portal-card/70 p-4 sm:p-6">
          {loading && (
            <LoadingSpinner
              text={
                isPuzzleMode
                  ? 'Fragmenting character signal...'
                  : isCharacterMode
                    ? 'Scanning identity...'
                    : 'Scanning location signal...'
              }
            />
          )}
          {!loading && error && <ErrorMessage message={error} onRetry={() => buildRound(mode, characterPlayMode)} />}

          {!loading && !error && currentTarget && (
            <div className="guess-stage-shell">
              {isPuzzleMode ? (
                <div
                  className={`guess-character-frame guess-puzzle-frame ${
                    roundResolved ? 'is-revealed' : 'is-concealed'
                  } ${roundResolved ? (isCorrectGuess ? 'is-success' : 'is-failed') : ''}`}
                >
                  <div className="guess-character-grid" />
                  <div className="guess-character-glow" />
                  <div className="guess-character-scanline" />
                  <CharacterPuzzleBoard
                    key={`${currentTarget.id}-${puzzleDifficulty}`}
                    character={currentTarget}
                    difficulty={puzzleDifficulty}
                    resolved={roundResolved}
                    onComplete={handlePuzzleComplete}
                  />
                  <div className="guess-character-meta">
                    <span className="guess-character-kicker">
                      {roundResolved ? 'Puzzle Resolved' : 'Fragment Array Active'}
                    </span>
                    <strong className="guess-character-title">
                      {roundResolved ? currentTarget.name : 'Unknown Signal'}
                    </strong>
                    <span className="guess-character-detail">
                      {roundResolved
                        ? `${currentTarget.status} | ${currentTarget.species}`
                        : 'Drag fragments into their exact slots or tap a piece, then tap a slot to snap it in place.'}
                    </span>
                  </div>
                </div>
              ) : isCharacterMode ? (
                <div
                  className={`guess-character-frame ${roundResolved ? 'is-revealed' : 'is-concealed'} ${
                    roundResolved ? (isCorrectGuess ? 'is-success' : 'is-failed') : ''
                  }`}
                >
                  <div className="guess-character-grid" />
                  <img
                    src={currentTarget.image}
                    alt={currentTarget.name}
                    className="guess-character-image"
                  />
                  <div className="guess-character-shade" />
                  <div className="guess-character-glow" />
                  <div className="guess-character-scanline" />
                  <div className="guess-character-meta">
                    <span className="guess-character-kicker">
                      {roundResolved ? 'Identity Revealed' : 'Silhouette Locked'}
                    </span>
                    <strong className="guess-character-title">
                      {roundResolved ? currentTarget.name : 'Unknown Signal'}
                    </strong>
                    <span className="guess-character-detail">
                      {roundResolved
                        ? `${currentTarget.status} | ${currentTarget.species}`
                        : 'Select the correct identity from four possible readings.'}
                    </span>
                  </div>
                </div>
              ) : (
                <div
                  className={`guess-character-frame guess-location-frame ${getLocationVisualClass(currentTarget)} ${
                    roundResolved ? 'is-revealed' : 'is-concealed'
                  } ${roundResolved ? (isCorrectGuess ? 'is-success' : 'is-failed') : ''}`}
                >
                  <div className="guess-character-grid" />
                  <div className="guess-location-clueboard">
                    <div className="guess-location-header">
                      <span className="guess-location-chip">Location Signal</span>
                      <span className="guess-location-chip is-secondary">
                        {roundResolved ? currentTarget.name : 'Unknown Coordinate'}
                      </span>
                    </div>

                    <div className="guess-location-clues">
                      <div className="guess-location-clue-card">
                        <span className="guess-location-clue-label">Type</span>
                        <strong className="guess-location-clue-value">
                          {currentTarget.type || 'Unknown'}
                        </strong>
                      </div>
                      <div className="guess-location-clue-card">
                        <span className="guess-location-clue-label">Dimension</span>
                        <strong className="guess-location-clue-value">
                          {roundResolved
                            ? currentTarget.dimension || 'Unknown'
                            : getPartialDimensionLabel(currentTarget.dimension)}
                        </strong>
                      </div>
                      <div className="guess-location-clue-card">
                        <span className="guess-location-clue-label">Residents</span>
                        <strong className="guess-location-clue-value">
                          {currentTarget.residents?.length || 0}
                        </strong>
                      </div>
                    </div>

                    <div className="guess-location-atmosphere">
                      <span className="guess-location-clue-label">Atmosphere</span>
                      <p className="guess-location-atmosphere-copy">{getLocationClue(currentTarget)}</p>
                    </div>

                    <div className="guess-location-visual">
                      <div className="guess-location-visual-glow" />
                      <div className="guess-location-visual-image">
                        <span className="guess-location-visual-planet" />
                        <span className="guess-location-visual-ring" />
                        <span className="guess-location-visual-horizon" />
                        <span className="guess-location-visual-structure guess-location-visual-structure-a" />
                        <span className="guess-location-visual-structure guess-location-visual-structure-b" />
                        <span className="guess-location-visual-structure guess-location-visual-structure-c" />
                      </div>
                    </div>

                    <div className="guess-location-sigil">
                      <span className="guess-location-sigil-core" />
                      <span className="guess-location-sigil-ring guess-location-sigil-ring-a" />
                      <span className="guess-location-sigil-ring guess-location-sigil-ring-b" />
                    </div>
                  </div>
                  <div className="guess-character-shade" />
                  <div className="guess-character-glow" />
                  <div className="guess-character-scanline" />
                  <div className="guess-character-meta">
                    <span className="guess-character-kicker">
                      {roundResolved ? 'Location Revealed' : 'Signal Concealed'}
                    </span>
                    <strong className="guess-character-title">
                      {roundResolved ? currentTarget.name : 'Unknown Coordinate'}
                    </strong>
                    <span className="guess-character-detail">
                      {roundResolved
                        ? `${currentTarget.type || 'Unknown'} | ${currentTarget.dimension || 'Unknown'}`
                        : 'Use broad world-building cues to identify the targeted location.'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </section>

        <section className="guess-panel rounded-[1.75rem] border border-portal-border bg-portal-card/70 p-4 sm:p-6">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-body font-700 uppercase tracking-[0.28em] text-gray-500">
                {isPuzzleMode ? 'Puzzle Controls' : 'Response Options'}
              </p>
              <h2 className="mt-2 font-display text-2xl tracking-wider text-white">
                {isPuzzleMode ? (
                  <>
                    Rebuild The <span className="text-portal-lime">Target</span>
                  </>
                ) : (
                  <>
                    Identify The <span className="text-portal-lime">{isCharacterMode ? 'Target' : 'Location'}</span>
                  </>
                )}
              </h2>
            </div>

            <div
              className={`guess-status-pill ${
                roundResolved ? (isCorrectGuess ? 'is-success' : 'is-failed') : ''
              }`}
            >
              {isPuzzleMode
                ? roundResolved
                  ? 'Fragment grid stabilized.'
                  : 'Complete the full image.'
                : roundResolved
                  ? isCorrectGuess
                    ? 'Portal lock confirmed.'
                    : 'Signal mismatch detected.'
                  : `Choose one ${isCharacterMode ? 'identity' : 'location'}.`}
            </div>
          </div>

          {isPuzzleMode ? (
            <>
              <div className="guess-puzzle-panel-block">
                <div className="guess-puzzle-panel-head">
                  <span className="guess-puzzle-panel-kicker">Difficulty</span>
                  <span className="guess-puzzle-panel-copy">Choose the fragment density for the next round.</span>
                </div>
                <div className="guess-puzzle-toggle-row">
                  <button
                    type="button"
                    onClick={() => handlePuzzleDifficultyChange(PUZZLE_DIFFICULTIES.EASY)}
                    className={`guess-puzzle-chip ${puzzleDifficulty === PUZZLE_DIFFICULTIES.EASY ? 'is-active' : ''}`}
                  >
                    Easy • 4 Pieces
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePuzzleDifficultyChange(PUZZLE_DIFFICULTIES.MEDIUM)}
                    className={`guess-puzzle-chip ${puzzleDifficulty === PUZZLE_DIFFICULTIES.MEDIUM ? 'is-active' : ''}`}
                  >
                    Medium • 6 Pieces
                  </button>
                </div>
              </div>

              <div className="guess-puzzle-panel-block">
                <div className="guess-puzzle-panel-head">
                  <span className="guess-puzzle-panel-kicker">Hint System</span>
                  <span className="guess-puzzle-panel-copy">Unlock metadata gradually if the board stalls.</span>
                </div>

                <button
                  type="button"
                  onClick={handleRevealHint}
                  disabled={roundResolved || hintStep >= PUZZLE_HINTS.length}
                  className="guess-puzzle-hint-button"
                >
                  {hintStep >= PUZZLE_HINTS.length ? 'All Hints Revealed' : 'Reveal Next Hint'}
                </button>

                <div className="guess-puzzle-hints">
                  {PUZZLE_HINTS.map((hint, index) => {
                    const isVisible = index < hintStep

                    return (
                      <div key={hint.key} className={`guess-puzzle-hint-card ${isVisible ? 'is-visible' : ''}`}>
                        <span className="guess-puzzle-hint-label">{hint.label}</span>
                        <strong className="guess-puzzle-hint-value">
                          {isVisible ? getPuzzleHintValue(currentTarget, hint.key) : 'Locked'}
                        </strong>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-portal-border/70 bg-portal-dark/40 p-4">
                {roundResolved ? (
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-body font-700 text-portal-lime">
                        Puzzle Completed
                      </p>
                      <p className="mt-1 font-body text-sm leading-relaxed text-gray-400">
                        The full identity is now stabilized. {currentTarget?.name} has been reconstructed from the fragment array.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => buildRound(MODES.CHARACTER, CHARACTER_PLAY_MODES.PUZZLE)}
                      className="rounded-xl border border-portal-lime/30 bg-portal-lime/10 px-4 py-2.5 font-body text-sm font-700 text-portal-lime transition-all duration-200 hover:border-portal-lime/50 hover:bg-portal-lime/15"
                    >
                      Next Puzzle
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="font-body text-sm leading-relaxed text-gray-400">
                      Drag each fragment into its correct position. On touch devices, tap a piece first, then tap the matching slot.
                    </p>
                    <Link
                      to="/characters"
                      className="rounded-xl border border-portal-border px-4 py-2.5 font-body text-sm font-700 text-white transition-all duration-200 hover:border-portal-green/40 hover:bg-white/5"
                    >
                      Browse Characters
                    </Link>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="grid gap-3">
                {options.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleGuess(option)}
                    disabled={loading || roundResolved}
                    className={`guess-option ${getOptionState(option)}`}
                  >
                    <span className="guess-option-copy">
                      <span className="guess-option-kicker">{isCharacterMode ? 'Candidate' : 'Destination'}</span>
                      <span className="guess-option-name">{option}</span>
                    </span>
                    <span className="guess-option-indicator" aria-hidden="true" />
                  </button>
                ))}
              </div>

              <div className="mt-5 rounded-2xl border border-portal-border/70 bg-portal-dark/40 p-4">
                {roundResolved ? (
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className={`text-sm font-body font-700 ${isCorrectGuess ? 'text-portal-lime' : 'text-rose-300'}`}>
                        {isCorrectGuess ? 'Portal Stabilized' : 'Incorrect Read'}
                      </p>
                      <p className="mt-1 font-body text-sm leading-relaxed text-gray-400">
                        {isCorrectGuess
                          ? `Clean scan. The full ${isCharacterMode ? 'identity' : 'location'} signature is now visible.`
                          : `The correct ${isCharacterMode ? 'identity' : 'location'} was ${currentTarget?.name}. Reload the scanner for a new target.`}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => buildRound(mode, characterPlayMode)}
                      className="rounded-xl border border-portal-lime/30 bg-portal-lime/10 px-4 py-2.5 font-body text-sm font-700 text-portal-lime transition-all duration-200 hover:border-portal-lime/50 hover:bg-portal-lime/15"
                    >
                      Next {isCharacterMode ? 'Character' : 'Location'}
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="font-body text-sm leading-relaxed text-gray-400">
                      {isCharacterMode
                        ? 'One guess per round. When you answer, the image is revealed and the round locks.'
                        : 'One guess per round. When you answer, the location signature resolves and the round locks.'}
                    </p>
                    <Link
                      to={isCharacterMode ? '/characters' : '/locations'}
                      className="rounded-xl border border-portal-border px-4 py-2.5 font-body text-sm font-700 text-white transition-all duration-200 hover:border-portal-green/40 hover:bg-white/5"
                    >
                      Browse {isCharacterMode ? 'Characters' : 'Locations'}
                    </Link>
                  </div>
                )}
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  )
}
