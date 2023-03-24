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
  const [rookSquareFlashing, setRookSquareFlashing] = useState<'from' | 'to' | undefined>(undefined)
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
        setRookSquareFlashing(undefined) 
      }
    } 
    else {
      setRookSquareFlashing(undefined) 
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

  let borderStyle = 'none' 

  if (isOver) {
    if (feedback.action === 'capture') {
      borderStyle = `${(feedback.fastTick) ? '3' : '1'}px orange solid`  
    }
    else if (feedback.action && feedback.action.includes('promote')) {
      borderStyle = `${(feedback.fastTick) ? '3' : '1'}px yellow solid`  
    }
    else if (feedback.action === 'move' || (feedback.action === 'castle' && !rookSquareFlashing)) {
      borderStyle = '2px green solid'
    }
  }
    // Rook's to and from squares
  else if (feedback.action === 'castle' && rookSquareFlashing) {

    const amRookSquareFlashing = (
      !!piece && rookSquareFlashing === 'from' 
      || 
      !piece && rookSquareFlashing === 'to'
    )
    borderStyle = `${(amRookSquareFlashing) ? '3' : '1'}px orange solid` 
  } 

  if (kingInCheckHere) {
    borderStyle = `${(feedback.slowTick) ? '3' : '1'}px red solid`  
  }
  else if (inCheckFromHere) {
    borderStyle = `${(feedback.slowTick) ? '1' : '3' }px red solid`  
  }

  return (
    <div 
      ref={drop}
      className={`square \
        rank-${square.rank} \
        rank-${(square.rank % 2) ? 'odd' : 'even'} \
        file-${square.file} \
        file-${(FILES.indexOf(square.file) % 2) ? 'even' : 'odd'}`
      }
      style={{ border: borderStyle }}
    >
      {(!!piece) && (
        <PieceComponent square={square} piece={piece} dimmed={dimPiece}/>  
      )}
    </div>  
  )
})

export default SquareComponent
