import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PageTitleIcon from '../components/PageTitleIcon'
import { getEpisodes } from '../services/api'

const REEL_COUNT = 3
const MACHINE_STATES = {
  LOADING: 'loading',
  IDLE: 'idle',
  SPINNING: 'spinning',
  RESOLVED: 'resolved',
  ERROR: 'error',
}
const JACKPOT_NAV_DELAY_MS = 1800
const PLACEHOLDER_REEL = {
  id: 'placeholder',
  episode: 'S--E--',
  name: 'Awaiting signal',
  air_date: 'Unknown air date',
}

function pickRandomItem(items) {
  return items[Math.floor(Math.random() * items.length)]
}

function buildSpinOutcome(episodes) {
  const targetEpisode = pickRandomItem(episodes)
  const jackpot = Math.random() < 0.22

  if (jackpot) {
    return {
      reels: [targetEpisode, targetEpisode, targetEpisode],
      selectedEpisode: targetEpisode,
      jackpot: true,
    }
  }

  const otherEpisodes = episodes.filter((episode) => episode.id !== targetEpisode.id)
  const leftEpisode = pickRandomItem(otherEpisodes)
  const rightPool = otherEpisodes.filter((episode) => episode.id !== leftEpisode.id)
  const rightEpisode = rightPool.length > 0 ? pickRandomItem(rightPool) : leftEpisode

  return {
    reels: [leftEpisode, targetEpisode, rightEpisode],
    selectedEpisode: targetEpisode,
    jackpot: false,
  }
}

export default function EpisodeSlotMachinePage() {
  const navigate = useNavigate()
  const [episodes, setEpisodes] = useState([])
  const [reels, setReels] = useState(Array.from({ length: REEL_COUNT }, () => PLACEHOLDER_REEL))
  const [selectedEpisode, setSelectedEpisode] = useState(null)
  const [machineState, setMachineState] = useState(MACHINE_STATES.LOADING)
  const [errorMessage, setErrorMessage] = useState('')
  const [jackpot, setJackpot] = useState(false)
  const [machineStatus, setMachineStatus] = useState('Priming portal reels...')
  const timeoutsRef = useRef([])
  const intervalsRef = useRef([])
  const isMountedRef = useRef(true)

  function clearSpinTimers() {
    intervalsRef.current.forEach((intervalId) => window.clearInterval(intervalId))
    timeoutsRef.current.forEach((timeoutId) => window.clearTimeout(timeoutId))
    intervalsRef.current = []
    timeoutsRef.current = []
  }

  async function initializeMachine() {
    clearSpinTimers()
    setMachineState(MACHINE_STATES.LOADING)
    setErrorMessage('')
    setJackpot(false)
    setSelectedEpisode(null)
    setMachineStatus('Priming portal reels...')
    setReels(Array.from({ length: REEL_COUNT }, () => PLACEHOLDER_REEL))

    try {
      const firstPage = await getEpisodes({ page: 1 })
      const totalPages = firstPage?.info?.pages || 1
      const pageRequests = []

      for (let page = 2; page <= totalPages; page += 1) {
        pageRequests.push(getEpisodes({ page }))
      }

      const remainingPages = await Promise.all(pageRequests)
      const allEpisodes = [
        ...(firstPage?.results || []),
        ...remainingPages.flatMap((pageData) => pageData?.results || []),
      ]

      if (!allEpisodes.length) {
        throw new Error('No episodes were available for the machine.')
      }

      if (!isMountedRef.current) return

      const seededEpisode = pickRandomItem(allEpisodes)
      setEpisodes(allEpisodes)
      setReels([seededEpisode, seededEpisode, seededEpisode])
      setSelectedEpisode(seededEpisode)
      setMachineStatus('Machine online. Pull the lever to reveal a random episode.')
      setMachineState(MACHINE_STATES.IDLE)
    } catch (err) {
      if (!isMountedRef.current) return

      setErrorMessage(err.message || 'Unable to initialize the episode machine.')
      setMachineStatus('Machine offline. Retry to restore the episode feed.')
      setMachineState(MACHINE_STATES.ERROR)
    }
  }

  useEffect(() => {
    isMountedRef.current = true
    initializeMachine().catch(() => {})

    return () => {
      isMountedRef.current = false
      clearSpinTimers()
    }
  }, [])

  function handleSpin() {
    if (machineState !== MACHINE_STATES.IDLE && machineState !== MACHINE_STATES.RESOLVED) return
    if (episodes.length === 0) return

    clearSpinTimers()
    const outcome = buildSpinOutcome(episodes)

    setMachineState(MACHINE_STATES.SPINNING)
    setJackpot(false)
    setSelectedEpisode(null)
    setMachineStatus('Calibrating portal reels...')

    for (let reelIndex = 0; reelIndex < REEL_COUNT; reelIndex += 1) {
      const intervalId = window.setInterval(() => {
        if (!isMountedRef.current) return

        setReels((currentReels) => {
          const nextReels = [...currentReels]
          nextReels[reelIndex] = pickRandomItem(episodes)
          return nextReels
        })
      }, 90 + reelIndex * 35)

      intervalsRef.current.push(intervalId)

      const timeoutId = window.setTimeout(() => {
        window.clearInterval(intervalId)

        if (!isMountedRef.current) return

        setReels((currentReels) => {
          const nextReels = [...currentReels]
          nextReels[reelIndex] = outcome.reels[reelIndex]
          return nextReels
        })

        if (reelIndex === REEL_COUNT - 1) {
          setMachineState(MACHINE_STATES.RESOLVED)
          setSelectedEpisode(outcome.selectedEpisode)
          setJackpot(outcome.jackpot)
          setMachineStatus(
            outcome.jackpot
              ? 'Portal locked. Transporting to the matched episode...'
              : `Machine stabilized on ${outcome.selectedEpisode.episode}.`
          )

          if (outcome.jackpot) {
            const navTimeoutId = window.setTimeout(() => {
              if (!isMountedRef.current) return
              navigate(`/episodes/${outcome.selectedEpisode.id}`)
            }, JACKPOT_NAV_DELAY_MS)

            timeoutsRef.current.push(navTimeoutId)
          }
        }
      }, 1100 + reelIndex * 380)

      timeoutsRef.current.push(timeoutId)
    }
  }

  const canSpin =
    machineState === MACHINE_STATES.IDLE || machineState === MACHINE_STATES.RESOLVED
  const showInlineLoading = machineState === MACHINE_STATES.LOADING
  const showInlineError = machineState === MACHINE_STATES.ERROR

  return (
    <div className="relative mx-auto max-w-7xl px-4 py-10">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 overflow-hidden">
        <div className="slot-orb slot-orb-lime" />
        <div className="slot-orb slot-orb-cyan" />
      </div>

      <div className="relative z-10 mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-portal-lime/20 bg-portal-lime/10 px-3 py-1 text-xs font-body font-700 uppercase tracking-[0.28em] text-portal-lime">
            Multiverse Episode Machine
          </p>
          <h1 className="mb-3 font-display text-5xl tracking-wider text-white">
            EPISODE <span className="text-portal-lime">MACHINE</span>
            <PageTitleIcon icon="EM" variant="episodes" label="Episode machine icon" />
          </h1>
          <p className="font-body leading-relaxed text-gray-400">
            Pull the lever to run Rick&apos;s futuristic episode randomizer. Match all three reels to
            lock onto one destination automatically, or use the stabilized middle reel as your next watch.
          </p>
        </div>

        <div className="slot-status-panel rounded-2xl border border-portal-border bg-card-gradient p-4 sm:p-5">
          <span className="slot-status-label">Machine Status</span>
          <p className={`slot-status-copy ${jackpot ? 'is-jackpot' : ''}`}>{machineStatus}</p>
        </div>
      </div>

      <div className="relative z-10 grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_320px]">
        <section className={`slot-machine-shell ${jackpot ? 'is-jackpot' : ''}`}>
          <div className="slot-machine-panel">
            <div className="slot-machine-header">
              <span className="slot-machine-kicker">Portal Randomizer</span>
              <span className="slot-machine-readout">
                {machineState === MACHINE_STATES.LOADING
                  ? 'Loading feed'
                  : machineState === MACHINE_STATES.SPINNING
                    ? 'Reels in motion'
                    : selectedEpisode
                      ? selectedEpisode.episode
                      : 'Stand by'}
              </span>
            </div>

            <div className="slot-reels-wrap">
              <div className="slot-reels">
                {reels.map((episode, index) => (
                  <div
                    key={index}
                    className={`slot-reel ${machineState === MACHINE_STATES.SPINNING ? 'is-spinning' : ''} ${
                      showInlineLoading ? 'is-loading' : ''
                    }`}
                  >
                    <div className="slot-reel-window">
                      <span className="slot-reel-code">{episode?.episode || PLACEHOLDER_REEL.episode}</span>
                      <span className="slot-reel-name">{episode?.name || PLACEHOLDER_REEL.name}</span>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={handleSpin}
                disabled={!canSpin}
                className="slot-lever-button"
              >
                <span
                  className={`slot-lever-shaft ${
                    machineState === MACHINE_STATES.SPINNING ? 'is-engaged' : ''
                  }`}
                />
                <span className="slot-lever-knob" />
                <span className="slot-lever-label">
                  {machineState === MACHINE_STATES.SPINNING
                    ? 'Spinning...'
                    : machineState === MACHINE_STATES.LOADING
                      ? 'Loading...'
                      : 'Pull Lever'}
                </span>
              </button>
            </div>

            {showInlineLoading && (
              <div className="slot-inline-banner">
                <div className="slot-inline-dot" />
                Syncing episode catalog across dimensions...
              </div>
            )}

            {showInlineError && (
              <div className="slot-inline-error">
                <p className="font-body text-sm leading-relaxed text-rose-200">{errorMessage}</p>
                <button
                  type="button"
                  onClick={() => initializeMachine()}
                  className="rounded-xl border border-portal-lime/30 bg-portal-lime/10 px-4 py-2.5 font-body text-sm font-700 text-portal-lime transition-all duration-200 hover:border-portal-lime/50 hover:bg-portal-lime/15"
                >
                  Retry Machine
                </button>
              </div>
            )}

            <div className={`slot-machine-footer ${jackpot ? 'is-jackpot' : ''}`}>
              <p className="font-body text-sm leading-relaxed text-gray-300">
                {machineState === MACHINE_STATES.SPINNING
                  ? 'Reels will stop one by one. Hold for the stabilized result.'
                  : jackpot
                    ? 'Portal Locked. A perfect reel match is guiding you directly to the winning episode.'
                    : 'Every completed spin produces a valid episode result, even without a three-reel match.'}
              </p>
            </div>
          </div>
        </section>

        <aside className="slot-result-panel rounded-[1.75rem] border border-portal-border bg-portal-card/70 p-4 sm:p-6">
          <p className="text-xs font-body font-700 uppercase tracking-[0.28em] text-gray-500">
            Selected Episode
          </p>

          {selectedEpisode ? (
            <div className={`slot-result-card ${jackpot ? 'is-jackpot' : ''}`}>
              <span className="slot-result-badge">{selectedEpisode.episode}</span>
              <h2 className="slot-result-title">{selectedEpisode.name}</h2>
              <p className="slot-result-airdate">{selectedEpisode.air_date}</p>
              <p className="slot-result-copy">
                {jackpot
                  ? 'Three matching reels aligned. Automatic navigation will begin shortly.'
                  : 'The center reel becomes the stabilized result whenever the machine does not full-match.'}
              </p>

              <div className="flex flex-wrap gap-3">
                <Link
                  to={`/episodes/${selectedEpisode.id}`}
                  className="rounded-xl border border-portal-lime/30 bg-portal-lime/10 px-4 py-2.5 font-body text-sm font-700 text-portal-lime transition-all duration-200 hover:border-portal-lime/50 hover:bg-portal-lime/15"
                >
                  View Selected Episode
                </Link>
                <Link
                  to="/episodes"
                  className="rounded-xl border border-portal-border px-4 py-2.5 font-body text-sm font-700 text-white transition-all duration-200 hover:border-portal-green/40 hover:bg-white/5"
                >
                  Browse Episodes
                </Link>
              </div>
            </div>
          ) : (
            <div className="slot-result-placeholder">
              <p className="font-body text-sm leading-relaxed text-gray-400">
                {machineState === MACHINE_STATES.LOADING
                  ? 'The machine is syncing episode data before it can seed an initial result.'
                  : machineState === MACHINE_STATES.SPINNING
                    ? 'Resolving the three-reel outcome now. A selected episode will appear here as soon as the final reel stops.'
                    : machineState === MACHINE_STATES.ERROR
                      ? 'Retry the machine to restore the episode feed and generate a usable result.'
                      : 'Pull the lever to generate a new episode destination.'}
              </p>
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}
