import React, { useEffect, useState } from 'react'
import { observer } from 'mobx-react'
import { useDrop } from 'react-dnd'

import { BoardSquare, Square, FILES } from '../chess'
import { castleIsKingside } from '../chess/util'
import { useGame } from './GameProvider'
import Piece from './Piece'
import { useFeedback } from './Feedback'

const SquareComponent: React.FC<{ 
  square: BoardSquare
}> = observer(({ 
  square: mySquare
}) => {

  const game = useGame()
  const feedback = useFeedback()
  const [rookSquareFlashing, setRookSquareFlashing] = useState<'rook' | 'dest' | undefined>(undefined)
  const [dimPiece, setDimPiece] = useState<boolean>(false)

  const [{ isOver, action, origin }, drop] = useDrop(
    () => ({
      accept: 'piece',
      drop: (origin: Square, monitor) => { game.takeAction(origin, mySquare);  feedback.clear() },
      canDrop: (origin : Square, monitor) => (!!game.resolveAction(origin, mySquare)),
      collect: (monitor) => {
        const origin = monitor.getItem() as BoardSquare
        return {
          action: !!monitor.isOver() ? game.resolveAction(origin, mySquare) : undefined,
          isOver: (!!monitor.isOver()),
          origin: origin
        }
      }
    }),
    [mySquare, mySquare.piece]
  )

  useEffect(() => {

    if (isOver) {
      if (action) {
        const enc = (action !== 'castle') ? undefined : {
          kingside: castleIsKingside(mySquare),
          color: origin.piece!.color
        }
        feedback.setFeedback(action, enc)
      }
      else {
        feedback.clear()
      }
    }
  }, [action, isOver])

  useEffect(() => {
    if (feedback.action === 'castle') {

      const rookFiles = feedback.enclosure.kingside ? ['h', 'f'] : ['a', 'd']  
      const rookRank = (feedback.enclosure.color === 'white') ? 1 : 8
      
      if ((mySquare.rank === rookRank) && rookFiles.includes(mySquare.file)) {
        setRookSquareFlashing(feedback.tick ? 'rook' : 'dest') // source and dest will alternate 
      } 
      else {
        setRookSquareFlashing(undefined) 
      }
    } 
    else {
      setRookSquareFlashing(undefined) 
    }
  }, [feedback.action, mySquare.rank, mySquare.file, feedback.tick, mySquare.piece] )

  useEffect(() => {
    if (rookSquareFlashing) {
      setDimPiece(rookSquareFlashing === 'rook' && !!mySquare.piece)
    }
    else {
      setDimPiece(!!action && feedback.tick) 
    }
  }, [rookSquareFlashing, action, !!mySquare.piece, feedback.tick])


  let borderStyle = 'none' 

  if (isOver) {
    if (feedback.action === 'capture') {
      borderStyle = `${(feedback.tick) ? '3' : '1'}px orange solid`  
    }
    else if (feedback.action === 'convert') {
      borderStyle = `${(feedback.tick) ? '3' : '1'}px yellow solid`  
    }
    else if (feedback.action === 'move' || feedback.action === 'castle') {
      borderStyle = '2px green solid'
    }
  }
    // Rook's to and from squares
  else if (feedback.action === 'castle' && rookSquareFlashing) {

    const amRookSquareFlashing = (
      mySquare.piece && rookSquareFlashing === 'rook' 
      || 
      !mySquare.piece && rookSquareFlashing === 'dest'
    )
    borderStyle = `${(amRookSquareFlashing) ? '3' : '1'}px orange solid` 
  } 

  return (
    <div 
      ref={drop}
      className={`grid-square rank-${mySquare.rank} rank-${(mySquare.rank % 2) ? 'odd' : 'even'} file-${mySquare.file} file-${(FILES.indexOf(mySquare.file) % 2) ? 'even' : 'odd'}`}
      style={{ border: borderStyle }}
    >
      {(mySquare.piece) && (
        <Piece square={mySquare} dimmed={dimPiece}/>  
      )}
    </div>  
  )
})

export default SquareComponent