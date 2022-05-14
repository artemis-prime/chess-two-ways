import React, { useEffect, useRef, useState } from 'react'
import { observer } from 'mobx-react'
import { useDrop } from 'react-dnd'

import Pawn from './Pawn'
import type DnDPawn from './DnDPawn'
import { useGameService } from '../domain/GameServiceProvider'
import { SquareState } from '../domain/SquareState'
import { MoveType } from '../domain/MoveType'

const Square: React.FC<{ 
  state: SquareState,
  row: number,
  col: number 
}> = observer(({ 
  state,
  row,
  col 
}) => {

  const game = useGameService()
  const timeoutRef = useRef<any | undefined>(undefined)
  const [pawnVisible, setPawnVisible] = useState<boolean>(true)
  
  const [{ isOver, moveType }, drop] = useDrop(
    () => ({
      accept: 'Pawn',
      drop: (item: DnDPawn, monitor) => { game.drop(item.row, item.col, row, col) },
      canDrop: (item : DnDPawn, monitor) => (game.canDrop(item.row, item.col, row, col)),
      collect: (monitor) => {
        const item = monitor.getItem() as DnDPawn
        return {
          moveType: item ? game.moveType(item.row, item.col, row, col) : MoveType.invalid,
          isOver: (!!monitor.isOver())
        }
      }
    }),
    [row, col]
  )

  useEffect(() => {

    const clearMe = () => {
      if (timeoutRef.current) {
        clearInterval(timeoutRef.current)
        timeoutRef.current = undefined 
        setPawnVisible(true)
      }
    }
    if (isOver && moveType === MoveType.take && !timeoutRef.current) {
      timeoutRef.current = setInterval(() => {
        setPawnVisible((p) => (!p))
      }, 100)
    }
    else if (timeoutRef.current) {
      clearMe()
    }
    return clearMe
  }, [moveType, isOver])

  const borderStyle = (!isOver || moveType === MoveType.invalid) ? 
    'none' 
    : 
    (moveType === MoveType.take) ? 
      ((pawnVisible) ? '3px blue solid' : '1px blue solid') // border flashes w existing pawn
      : 
      '2px #2f2 solid' 



  return (
    <div 
      ref={drop}
      className={`grid-square row-${row} row-${(row % 2) ? 'even' : 'odd'} col-${col} col-${(col % 2) ? 'even' : 'odd'}`}
      style={{
        border: borderStyle 
      }}
    >
      {(state === SquareState.black) && (
        <Pawn row={row} col={col} state={state} height={75} color='#322' visible={pawnVisible}/>  
      )}
      {(state === SquareState.white) && (
        <Pawn row={row} col={col} state={state} height={75} color='#cbb' visible={pawnVisible}/>  
      )}
    </div>  
  )
})

export default Square