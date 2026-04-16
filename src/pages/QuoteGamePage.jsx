import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import PageTitleIcon from '../components/PageTitleIcon'

const QUOTES = [
  { text: 'Wubba Lubba Dub Dub!', character: 'Rick' },
  { text: 'Aw jeez, Rick...', character: 'Morty' },
  { text: 'Nobody exists on purpose. Nobody belongs anywhere. Everybody is gonna die. Come watch TV.', character: 'Morty' },
  { text: "I'm easy to make happy, which is why nobody gives a shit if I am.", character: 'Jerry' },
  { text: 'God, Rick!', character: 'Summer' },
  { text: 'Sometimes science is more art than science.', character: 'Rick' },
  { text: 'I just want to go back to hell, where everyone thinks I am smart and funny.', character: 'Jerry' },
  { text: "You're like Hitler, but even Hitler cared about Germany or something.", character: 'Summer' },
  { text: 'Nobody exists on purpose, nobody belongs anywhere.', character: 'Morty' },
  { text: 'What, so everyone is supposed to sleep every single night now? You realize that nighttime makes up half of all time?', character: 'Rick' },
]

const ANSWERS = ['Rick', 'Morty', 'Summer', 'Jerry']
const AUTO_NEXT_DELAY_MS = 1600
const SOUND_FILES = {
  correct: '/sounds/quote-correct.wav',
  wrong: '/sounds/quote-wrong.wav',
  next: '/sounds/quote-next.wav',
}

function getRandomQuote(previousQuote) {
  if (QUOTES.length === 1) return QUOTES[0]

  let nextQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)]

  while (previousQuote && nextQuote.text === previousQuote.text) {
    nextQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)]
  }

  return nextQuote
}

export default function QuoteGamePage() {
  const [currentQuote, setCurrentQuote] = useState(() => getRandomQuote())
  const [correctCount, setCorrectCount] = useState(0)
  const [totalRounds, setTotalRounds] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [result, setResult] = useState('')
  const [roundPulse, setRoundPulse] = useState(false)
  const timeoutRef = useRef(null)
  const audioRef = useRef({})
  const hasInteractedRef = useRef(false)

  useEffect(() => {
    audioRef.current = {
      correct: new Audio(SOUND_FILES.correct),
      wrong: new Audio(SOUND_FILES.wrong),
      next: new Audio(SOUND_FILES.next),
    }

    audioRef.current.correct.volume = 0.18
    audioRef.current.wrong.volume = 0.14
    audioRef.current.next.volume = 0.1

    return () => {
      window.clearTimeout(timeoutRef.current)
      Object.values(audioRef.current).forEach((audio) => {
        if (!audio) return
        audio.pause()
        audio.currentTime = 0
      })
    }
  }, [])

  function playSound(name) {
    const audio = audioRef.current[name]

    if (!audio || !hasInteractedRef.current) return

    try {
      audio.currentTime = 0
      const playback = audio.play()

      if (playback && typeof playback.catch === 'function') {
        playback.catch(() => {})
      }
    } catch {
      // Ignore audio failures so the game flow never breaks.
    }
  }

  function loadNextQuote({ withSound = true } = {}) {
    window.clearTimeout(timeoutRef.current)
    setSelectedAnswer('')
    setResult('')
    setRoundPulse(true)
    setCurrentQuote((previousQuote) => getRandomQuote(previousQuote))

    if (withSound) {
      playSound('next')
    }

    window.setTimeout(() => {
      setRoundPulse(false)
    }, 240)
  }

  function handleAnswer(answer) {
    if (selectedAnswer) return

    hasInteractedRef.current = true
    const isCorrect = answer === currentQuote.character

    setSelectedAnswer(answer)
    setResult(isCorrect ? 'correct' : 'wrong')
    setTotalRounds((value) => value + 1)

    playSound(isCorrect ? 'correct' : 'wrong')

    if (isCorrect) {
      setCorrectCount((value) => value + 1)
    }

    timeoutRef.current = window.setTimeout(() => {
      loadNextQuote()
    }, AUTO_NEXT_DELAY_MS)
  }

  function getAnswerState(answer) {
    if (!selectedAnswer) return ''
    if (answer === currentQuote.character) return 'is-correct'
    if (answer === selectedAnswer && answer !== currentQuote.character) return 'is-wrong'
    return 'is-muted'
  }

  const accuracy = totalRounds > 0 ? `${Math.round((correctCount / totalRounds) * 100)}%` : '--'

  return (
    <div className="relative mx-auto max-w-7xl px-4 py-10">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 overflow-hidden">
        <div className="quote-orb quote-orb-lime" />
        <div className="quote-orb quote-orb-cyan" />
      </div>

      <div className="relative z-10 mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-portal-lime/20 bg-portal-lime/10 px-3 py-1 text-xs font-body font-700 uppercase tracking-[0.28em] text-portal-lime">
            Quote Scanner
          </p>
          <h1 className="mb-3 font-display text-5xl tracking-wider text-white">
            WHO SAID <span className="text-portal-lime">THIS?</span>
            <PageTitleIcon icon="Q" variant="characters" label="Quote game icon" />
          </h1>
          <p className="font-body leading-relaxed text-gray-400">
            Intercept a line from the multiverse, identify the speaker, and keep your accuracy high.
            The quote feed rotates automatically after each answer.
          </p>
        </div>

        <div className="quote-score-panel rounded-2xl border border-portal-border bg-card-gradient p-4 sm:p-5">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="quote-score-tile">
              <span className="quote-score-label">Correct</span>
              <strong className="quote-score-value">{correctCount}</strong>
            </div>
            <div className="quote-score-tile">
              <span className="quote-score-label">Rounds</span>
              <strong className="quote-score-value">{totalRounds}</strong>
            </div>
            <div className="quote-score-tile">
              <span className="quote-score-label">Accuracy</span>
              <strong className="quote-score-value">{accuracy}</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <section className="quote-stage rounded-[1.75rem] border border-portal-border bg-portal-card/70 p-4 sm:p-6">
          <div className={`quote-card ${roundPulse ? 'is-transitioning' : ''} ${result ? `is-${result}` : ''}`}>
            <div className="quote-card-portal" />
            <div className="quote-card-frame">
              <span className="quote-card-kicker">Incoming Signal</span>
              <blockquote className="quote-card-text">“{currentQuote.text}”</blockquote>
              <p className="quote-card-hint">
                {selectedAnswer
                  ? result === 'correct'
                    ? '+1 Correct'
                    : `Correct answer: ${currentQuote.character}`
                  : 'Choose the speaker from the four possible voices.'}
              </p>
            </div>
          </div>
        </section>

        <section className="quote-panel rounded-[1.75rem] border border-portal-border bg-portal-card/70 p-4 sm:p-6">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-body font-700 uppercase tracking-[0.28em] text-gray-500">
                Voice Match
              </p>
              <h2 className="mt-2 font-display text-2xl tracking-wider text-white">
                Pick The <span className="text-portal-lime">Speaker</span>
              </h2>
            </div>

            <div className={`quote-status-pill ${result ? `is-${result}` : ''}`}>
              {selectedAnswer
                ? result === 'correct'
                  ? 'Identity confirmed.'
                  : 'Voice mismatch.'
                : 'Awaiting your guess.'}
            </div>
          </div>

          <div className="grid gap-3">
            {ANSWERS.map((answer) => (
              <button
                key={answer}
                type="button"
                onClick={() => handleAnswer(answer)}
                disabled={Boolean(selectedAnswer)}
                className={`quote-answer ${getAnswerState(answer)}`}
              >
                <span className="quote-answer-copy">
                  <span className="quote-answer-kicker">Speaker</span>
                  <span className="quote-answer-name">{answer}</span>
                </span>
                <span className="quote-answer-indicator" aria-hidden="true" />
              </button>
            ))}
          </div>

          <div className="mt-5 rounded-2xl border border-portal-border/70 bg-portal-dark/40 p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="font-body text-sm leading-relaxed text-gray-400">
                Each round advances automatically after a short delay. Use the manual control if you want to skip ahead faster.
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => {
                    hasInteractedRef.current = true
                    loadNextQuote()
                  }}
                  className="rounded-xl border border-portal-lime/30 bg-portal-lime/10 px-4 py-2.5 font-body text-sm font-700 text-portal-lime transition-all duration-200 hover:border-portal-lime/50 hover:bg-portal-lime/15"
                >
                  Next Quote
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
        </section>
      </div>
    </div>
  )
}
