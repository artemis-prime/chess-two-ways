import React, { useEffect, useRef, useState } from 'react'
import { observer } from 'mobx-react'
import { useDrop } from 'react-dnd'

import { useGame } from '../domain/GameProvider'
import { MoveType, PieceType, Square, FILES } from '../domain/types'
import Piece from './Piece'

const SquareComponent: React.FC<{ 
  square: Square
}> = observer(({ 
  square,
}) => {

  const game = useGame()
  const timeoutRef = useRef<any | undefined>(undefined)
  const [pieceFlashingOn, setPieceFlashingOn] = useState<boolean>(true)
  
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

    const clearMe = () => {
      if (timeoutRef.current) {
        clearInterval(timeoutRef.current)
        timeoutRef.current = undefined 
        setPieceFlashingOn(true)
      }
    }
    if (isOver && (moveType === 'capture' || moveType === 'convert') && !timeoutRef.current) {
      timeoutRef.current = setInterval(() => {
        setPieceFlashingOn((p) => (!p))
      }, 100)
    }
    else if (timeoutRef.current) {
      clearMe()
    }
    return clearMe
  }, [moveType, isOver])

  let borderStyle = 'none' 
  if (isOver) {
    if (moveType === 'capture') {
      borderStyle = ((pieceFlashingOn) ? '3px blue solid' : '1px blue solid') // border flashes w existing pawn  
    }
    else if (moveType === 'convert') {
      borderStyle = ((pieceFlashingOn) ? '3px orange solid' : '1px orange solid') // border flashes   
    }
    else if (moveType === 'move') {
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
        <Piece square={square} flashingOn={pieceFlashingOn}/>  
      )}
    </div>  
  )
})

export default SquareComponent