import React, { useEffect, } from 'react'
import { observer } from 'mobx-react'
import { useDrop } from 'react-dnd'

import { BoardSquare, Square, FILES } from '../chess'
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
  const [{ isOver, validAction }, drop] = useDrop(
    () => ({
      accept: 'piece',
      drop: (origin: Square, monitor) => { game.takeAction(origin, mySquare) },
      canDrop: (origin : Square, monitor) => (!!game.resolveAction(origin, mySquare)),
      collect: (monitor) => {
        const origin = monitor.getItem() as Square
        return {
          validAction: !!monitor.isOver() ? game.resolveAction(origin, mySquare) : undefined,
          isOver: (!!monitor.isOver())
        }
      }
    }),
    [mySquare]
  )

  useEffect(() => {

    if (isOver) {
      if (validAction) {
        feedback.setAction(validAction)
      }
      else {
        feedback.clear()
      }
    }
  }, [validAction, isOver])

  let borderStyle = 'none' 
  if (isOver) {
    if (feedback.action === 'capture') {
      borderStyle = ((feedback.tick) ? '3px blue solid' : '1px blue solid') // border flashes w existing pawn  
    }
    else if (feedback.action === 'convert') {
      borderStyle = ((feedback.tick) ? '3px orange solid' : '1px orange solid') // border flashes   
    }
    else if (feedback.action === 'move') {
      borderStyle = '2px #2f2 solid'
    }
  }

  return (
    <div 
      ref={drop}
      className={`grid-square rank-${mySquare.rank} rank-${(mySquare.rank % 2) ? 'odd' : 'even'} file-${mySquare.file} file-${(FILES.indexOf(mySquare.file) % 2) ? 'even' : 'odd'}`}
      style={{ border: borderStyle }}
    >
      {(mySquare.piece) && (
        <Piece square={mySquare} flashingOn={!isOver || feedback.tick}/>  
      )}
    </div>  
  )
})

export default SquareComponent