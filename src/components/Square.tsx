import React, { useEffect, useRef, useState } from 'react'
import { observer } from 'mobx-react'
import { useDrop } from 'react-dnd'

import Pawn from './Pawn'
import Queen from './Queen'
import { useGameService } from '../domain/GameServiceProvider'
import { MoveTypes, PieceTypes, Square } from '../domain/types'

const SquareComponent: React.FC<{ 
  square: Square
}> = observer(({ 
  square,
}) => {

  const game = useGameService()
  const timeoutRef = useRef<any | undefined>(undefined)
  const [pieceFlashingOn, setPieceFlashingOn] = useState<boolean>(true)
  
  const [{ isOver, moveType }, drop] = useDrop(
    () => ({
      accept: 'Pawn',
      drop: (item: Square, monitor) => { game.drop(item.row, item.col, square.row, square.col) },
      canDrop: (item : Square, monitor) => (game.canDrop(item.row, item.col, square.row, square.col)),
      collect: (monitor) => {
        const item = monitor.getItem() as Square
        return {
          moveType: item ? game.moveType(item.row, item.col, square.row, square.col) : MoveTypes.invalid,
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
    if (isOver && moveType === MoveTypes.take && !timeoutRef.current) {
      timeoutRef.current = setInterval(() => {
        setPieceFlashingOn((p) => (!p))
      }, 100)
    }
    else if (timeoutRef.current) {
      clearMe()
    }
    return clearMe
  }, [moveType, isOver])

  const borderStyle = (!isOver || moveType === MoveTypes.invalid) ? 
    'none' 
    : 
    (moveType === MoveTypes.take) ? 
      ((pieceFlashingOn) ? '3px blue solid' : '1px blue solid') // border flashes w existing pawn
      : 
      '2px #2f2 solid' 

  return (
    <div 
      ref={drop}
      className={`grid-square row-${square.row} row-${(square.row % 2) ? 'even' : 'odd'} col-${square.col} col-${(square.col % 2) ? 'even' : 'odd'}`}
      style={{ border: borderStyle }}
    >
      {(square.piece && square.piece.type === PieceTypes.pawn) && (
        <Pawn square={square} flashingOn={pieceFlashingOn}/>  
      )}
      {(square.piece && square.piece.type === PieceTypes.queen) && (
        <Queen square={square} flashingOn={pieceFlashingOn}/>  
      )}
    </div>  
  )
})

export default SquareComponent