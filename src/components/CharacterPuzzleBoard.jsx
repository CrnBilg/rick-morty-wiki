import { useEffect, useMemo, useRef, useState } from 'react'

const DIFFICULTY_CONFIG = {
  easy: { columns: 2, rows: 2, count: 4 },
  medium: { columns: 3, rows: 2, count: 6 },
}

function shufflePieces(items) {
  const nextItems = [...items]

  for (let i = nextItems.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[nextItems[i], nextItems[j]] = [nextItems[j], nextItems[i]]
  }

  return nextItems
}

export default function CharacterPuzzleBoard({ character, difficulty, resolved, onComplete }) {
  const config = DIFFICULTY_CONFIG[difficulty] || DIFFICULTY_CONFIG.easy
  const completionSentRef = useRef(false)
  const [trayPieces, setTrayPieces] = useState([])
  const [placedPieces, setPlacedPieces] = useState([])
  const [activePieceId, setActivePieceId] = useState('')
  const [wrongSlotIndex, setWrongSlotIndex] = useState(null)

  const pieces = useMemo(
    () =>
      Array.from({ length: config.count }, (_, index) => ({
        id: `${character.id}-${difficulty}-${index}`,
        slotIndex: index,
      })),
    [character.id, config.count, difficulty]
  )

  useEffect(() => {
    completionSentRef.current = false
    setTrayPieces(shufflePieces(pieces))
    setPlacedPieces(Array.from({ length: config.count }, () => null))
    setActivePieceId('')
    setWrongSlotIndex(null)
  }, [pieces, config.count])

  useEffect(() => {
    if (!resolved) return
    setActivePieceId('')
  }, [resolved])

  function triggerWrongSlot(slotIndex) {
    setWrongSlotIndex(slotIndex)
    window.setTimeout(() => {
      setWrongSlotIndex(null)
    }, 320)
  }

  function tryPlacePiece(slotIndex, pieceId) {
    if (resolved || !pieceId) return

    const piece = trayPieces.find((entry) => entry.id === pieceId)

    if (!piece) return

    if (piece.slotIndex !== slotIndex) {
      triggerWrongSlot(slotIndex)
      return
    }

    const nextPlacedPieces = [...placedPieces]
    nextPlacedPieces[slotIndex] = piece

    const nextTrayPieces = trayPieces.filter((entry) => entry.id !== pieceId)

    setPlacedPieces(nextPlacedPieces)
    setTrayPieces(nextTrayPieces)
    setActivePieceId('')

    if (!completionSentRef.current && nextPlacedPieces.every(Boolean)) {
      completionSentRef.current = true
      window.setTimeout(() => {
        onComplete?.()
      }, 180)
    }
  }

  function handlePieceDragStart(event, pieceId) {
    if (resolved) return

    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', pieceId)
    setActivePieceId(pieceId)
  }

  function handleSlotDrop(event, slotIndex) {
    event.preventDefault()
    const pieceId = event.dataTransfer.getData('text/plain') || activePieceId
    tryPlacePiece(slotIndex, pieceId)
  }

  function renderPiece(piece, extraClassName = '') {
    const columnIndex = piece.slotIndex % config.columns
    const rowIndex = Math.floor(piece.slotIndex / config.columns)
    const x = config.columns === 1 ? 0 : (columnIndex / (config.columns - 1)) * 100
    const y = config.rows === 1 ? 0 : (rowIndex / (config.rows - 1)) * 100

    return (
      <div
        key={piece.id}
        draggable={!resolved}
        onDragStart={(event) => handlePieceDragStart(event, piece.id)}
        onClick={() => !resolved && setActivePieceId(piece.id)}
        className={`guess-puzzle-piece ${activePieceId === piece.id ? 'is-active' : ''} ${extraClassName}`}
        style={{
          backgroundImage: `url(${character.image})`,
          backgroundSize: `${config.columns * 100}% ${config.rows * 100}%`,
          backgroundPosition: `${x}% ${y}%`,
        }}
      />
    )
  }

  return (
    <div className={`guess-puzzle-shell ${resolved ? 'is-resolved' : ''}`}>
      <div
        className="guess-puzzle-board"
        style={{
          gridTemplateColumns: `repeat(${config.columns}, minmax(0, 1fr))`,
        }}
      >
        {placedPieces.map((piece, slotIndex) => (
          <button
            key={`slot-${slotIndex}`}
            type="button"
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => handleSlotDrop(event, slotIndex)}
            onClick={() => tryPlacePiece(slotIndex, activePieceId)}
            className={`guess-puzzle-slot ${piece ? 'is-filled' : ''} ${
              wrongSlotIndex === slotIndex ? 'is-wrong' : ''
            }`}
          >
            {piece ? renderPiece(piece, 'is-placed') : <span className="guess-puzzle-slot-core" />}
          </button>
        ))}

        <div className={`guess-puzzle-reveal ${resolved ? 'is-visible' : ''}`}>
          <img src={character.image} alt={character.name} className="guess-puzzle-reveal-image" />
        </div>
      </div>

      <div className="guess-puzzle-tray-wrap">
        <div className="guess-puzzle-tray-head">
          <span className="guess-puzzle-tray-kicker">Loose Fragments</span>
          <span className="guess-puzzle-tray-copy">
            {resolved ? 'All fragments aligned.' : `${trayPieces.length} fragments remaining`}
          </span>
        </div>
        <div className="guess-puzzle-tray">
          {trayPieces.map((piece) => renderPiece(piece))}
        </div>
      </div>
    </div>
  )
}
