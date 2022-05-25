import React, { useEffect, } from 'react'
import { observer } from 'mobx-react'
import { useDrop } from 'react-dnd'

import { useGame } from '../domain/GameProvider'
import { Square, FILES } from '../domain/types'
import Piece from './Piece'
import { useFeedback } from './Feedback'

const SquareComponent: React.FC<{ 
  square: Square
  flashingOn: boolean
  feedback: string | undefined
}> = observer(({ 
  square,
  flashingOn,
  feedback
}) => {

  const game = useGame()
  const feedbackService = useFeedback()
  const [{ isOver, moveType }, drop] = useDrop(
    () => ({
      accept: 'piece',
      drop: (item: Square, monitor) => { game.drop(item, square) },
      canDrop: (item : Square, monitor) => (game.canDrop(item, square)),
      collect: (monitor) => {
        const item = monitor.getItem() as Square
        return {
          moveType: !!monitor.isOver() ? game.moveType(item, square) : 'invalid',
          isOver: (!!monitor.isOver())
        }
      }
    }),
    [square]
  )

  useEffect(() => {

    if (isOver) {
      if (moveType !== 'invalid') {
        feedbackService.set(moveType)
      }
      else {
        feedbackService.clear()
      }
    }
  }, [moveType, isOver])

  let borderStyle = 'none' 
  if (isOver) {
    if (feedback === 'capture') {
      borderStyle = ((flashingOn) ? '3px blue solid' : '1px blue solid') // border flashes w existing pawn  
    }
    else if (feedback === 'convert') {
      borderStyle = ((flashingOn) ? '3px orange solid' : '1px orange solid') // border flashes   
    }
    else if (feedback === 'move') {
      borderStyle = '2px #2f2 solid'
    }
  }

  return (
    <div 
      ref={drop}
      className={`grid-square rank-${square.rank} rank-${(square.rank % 2) ? 'odd' : 'even'} file-${square.file} file-${(FILES.indexOf(square.file) % 2) ? 'even' : 'odd'}`}
      style={{ border: borderStyle }}
    >
      {(square.piece) && (
        <Piece square={square} flashingOn={!isOver || flashingOn}/>  
      )}
    </div>  
  )
})

export default SquareComponent