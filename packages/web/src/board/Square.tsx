import React, { useEffect, useState } from 'react'
import { observer } from 'mobx-react'
import { useDrop } from 'react-dnd'

import type { BoardSquare, Square, } from '@artemis-prime/chess-domain'
import { FILES } from '@artemis-prime/chess-domain'

import { useGame } from './GameProvider'
import Piece from './Piece'
import { useVisualFeedback } from './VisualFeedback'

const SquareComponent: React.FC<{ 
  square: BoardSquare
}> = observer(({ 
  square: mySquare
}) => {

  const game = useGame()
  const feedback = useVisualFeedback()
  const [rookSquareFlashing, setRookSquareFlashing] = useState<'from' | 'to' | undefined>(undefined)
  const [inCheckFromHere, setInCheckFromHere] = useState<boolean>(false)
  const [kingInCheckHere, setKingInCheckHere] = useState<boolean>(false)
  const [dimPiece, setDimPiece] = useState<boolean>(false)

  const [{ isOver, /*action, origin*/ }, drop] = useDrop(
    () => ({
      accept: 'square',
      drop: (origin: BoardSquare, monitor) => { game.takeAction(origin, mySquare) },
      canDrop: (origin : BoardSquare, monitor) => (!!game.resolveAction(origin, mySquare)),
      collect: (monitor) => {
        const origin = monitor.getItem() as BoardSquare
        return {
          //action: !!monitor.isOver() ? game.resolveAction(origin, mySquare) : undefined,
          isOver: (!!monitor.isOver()),
          //origin: origin
        }
      }
    }),
    [mySquare, mySquare.piece]
  )
/*
  useEffect(() => {

    if (isOver) {
      if (action) {
        const enc = (action !== 'castle') ? undefined : {
          kingside: (mySquare.file === 'g'),
          color: origin.piece!.color
        }
        feedback.setAction(action, enc)
      }
      else {
        feedback.clear()
      }
    }
  }, [action, isOver])
*/

  useEffect(() => {
    if (feedback.action === 'castle') {

      const rookFiles = (feedback.note.from.file === 'g') ? ['h', 'f'] : ['a', 'd']  
      const rookRank = (feedback.note.from.piece?.color === 'white') ? 1 : 8
      
      if ((mySquare.rank === rookRank) && rookFiles.includes(mySquare.file)) {
        setRookSquareFlashing(feedback.fastTick ? 'from' : 'to') // alternate via tick 
      } 
      else {
        setRookSquareFlashing(undefined) 
      }
    } 
    else {
      setRookSquareFlashing(undefined) 
    }
  }, [feedback.action, mySquare.rank, mySquare.file, feedback.fastTick, mySquare.piece] )

  useEffect(() => {
    if (rookSquareFlashing) {
      setDimPiece(rookSquareFlashing === 'from' && !!mySquare.piece)
    }
    else {
      setDimPiece(!!feedback.action && feedback.fastTick) 
    }
  }, [rookSquareFlashing, !!feedback.action, !!mySquare.piece, feedback.fastTick])

  useEffect(() => {
    const kingInCheckHere_ = !!feedback.kingInCheck && (feedback.kingInCheck.file === mySquare.file && feedback.kingInCheck.rank === mySquare.rank)
    if (kingInCheckHere_ !== kingInCheckHere) {
      setKingInCheckHere(kingInCheckHere_)
    }
    const inCheckFromMe = !!feedback.inCheckFrom.find((e) => (e.file === mySquare.file && e.rank === mySquare.rank)) 
    if (inCheckFromHere != inCheckFromMe) {
      setInCheckFromHere(inCheckFromMe) 
    }
  },[feedback.inCheckFrom, feedback.kingInCheck])

  let borderStyle = 'none' 

  if (isOver) {
    if (feedback.action === 'capture') {
      borderStyle = `${(feedback.fastTick) ? '3' : '1'}px orange solid`  
    }
    else if (feedback.action && feedback.action.includes('promote')) {
      borderStyle = `${(feedback.fastTick) ? '3' : '1'}px yellow solid`  
    }
    else if (feedback.action === 'move' || feedback.action === 'castle') {
      borderStyle = '2px green solid'
    }
  }
    // Rook's to and from squares
  else if (feedback.action === 'castle' && rookSquareFlashing) {

    const amRookSquareFlashing = (
      mySquare.piece && rookSquareFlashing === 'from' 
      || 
      !mySquare.piece && rookSquareFlashing === 'to'
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
      className={`square rank-${mySquare.rank} rank-${(mySquare.rank % 2) ? 'odd' : 'even'} file-${mySquare.file} file-${(FILES.indexOf(mySquare.file) % 2) ? 'even' : 'odd'}`}
      style={{ border: borderStyle }}
    >
      {(mySquare.piece) && (
        <Piece square={mySquare} dimmed={dimPiece}/>  
      )}
    </div>  
  )
})

export default SquareComponent