import React, { useEffect, useState } from 'react'
import { observer } from 'mobx-react'
import { useDrop } from 'react-dnd'

import type { Square, Piece } from '@artemis-prime/chess-domain'
import { FILES, squaresEqual } from '@artemis-prime/chess-domain'

import { useGame } from './GameProvider'
import PieceComponent from './Piece'
import { useVisualFeedback } from './VisualFeedback'
import { type DnDPiece, DND_ITEM_NAME } from './DnDPiece'

const SquareComponent: React.FC<{ 
  square: Square
  piece?: Piece | null
}> = observer(({ 
  square,
  piece
}) => {

  const game = useGame()
  const feedback = useVisualFeedback()
  const [rookSquareFlashing, setRookSquareFlashing] = useState<'from' | 'to' | null>(null)
  const [inCheckFromHere, setInCheckFromHere] = useState<boolean>(false)
  const [kingInCheckHere, setKingInCheckHere] = useState<boolean>(false)
  const [dimPiece, setDimPiece] = useState<boolean>(false)

  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: DND_ITEM_NAME,
      drop: (item: DnDPiece, monitor) => { game.takeAction(item.piece, item.from, square)},
      canDrop: (item: DnDPiece, monitor) => {
        return !!game.resolveAction(item.piece, item.from, square); 
      },
      collect: (monitor) => ({isOver: (!!monitor.isOver())})
    }),
    [square]
  )

  useEffect(() => {
    if (feedback.action === 'castle') {

      const rookFiles = (feedback.note.from.file === 'g') ? ['h', 'f'] : ['a', 'd']  
      const rookRank = (feedback.note.from.piece?.color === 'white') ? 1 : 8
      
      if ((square.rank === rookRank) && rookFiles.includes(square.file)) {
        setRookSquareFlashing(feedback.fastTick ? 'from' : 'to') // alternate via tick 
      } 
      else {
        setRookSquareFlashing(null) 
      }
    } 
    else {
      setRookSquareFlashing(null) 
    }
  }, [feedback.action, square, feedback.fastTick] )

  useEffect(() => {
    if (rookSquareFlashing) {
      setDimPiece(rookSquareFlashing === 'from' && !!piece)
    }
    else {
      setDimPiece(isOver && !!feedback.action && feedback.fastTick) 
    }
  }, [rookSquareFlashing, !!feedback.action, !!piece, feedback.fastTick, isOver])

  useEffect(() => {
    const kingInCheckHere_ = !!feedback.kingInCheck && (feedback.kingInCheck.file === square.file && feedback.kingInCheck.rank === square.rank)
    if (kingInCheckHere_ !== kingInCheckHere) {
      setKingInCheckHere(kingInCheckHere_)
    }
    const inCheckFromMe = !!feedback.sideIsInCheckFrom.find((e) => (e.file === square.file && e.rank === square.rank)) 
    if (inCheckFromHere != inCheckFromMe) {
      setInCheckFromHere(inCheckFromMe) 
    }
  },[feedback.sideIsInCheckFrom, feedback.kingInCheck])

  let effectClass = ''
  const slowTick = feedback.slowTick ? 'slow-tick' : 'no-slow-tick'
  const fastTick = feedback.fastTick ? 'fast-tick' : 'no-fast-tick'

  if (isOver) {
    if (feedback.action === 'capture') {
      effectClass = 'capture' 
    }
    else if (feedback.action && feedback.action.includes('promote')) {
      effectClass = 'promote' 
    }
    else if (feedback.action === 'move' || (feedback.action === 'castle' && !rookSquareFlashing)) {
      effectClass = 'move-or-castle'
    }
  }
  else if (rookSquareFlashing) {
    effectClass = `castling-rook ${rookSquareFlashing}`
  } 

  if (kingInCheckHere) {
    effectClass = 'in-check in-check-king'
  }
  else if (inCheckFromHere) {
    effectClass = 'in-check in-check-from'
  }

  return (
    <div 
      ref={drop}
      className={`square rank-${square.rank} rank-${(square.rank % 2) ? 'odd' : 'even'} ` +
        `file-${square.file} file-${(FILES.indexOf(square.file) % 2) ? 'even' : 'odd'} ` +
        `${effectClass} ${slowTick} ${fastTick}`
      }
    >
      {(!!piece) && (
        <PieceComponent square={square} piece={piece} dimmed={dimPiece}/>  
      )}
    </div>  
  )
})

export default SquareComponent
