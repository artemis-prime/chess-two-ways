import React from 'react'
import { observer } from 'mobx-react'
import { useDrop } from 'react-dnd'

import Pawn from './Pawn'
import { useGameService } from '../domain/GameServiceProvider'
import { SquareState } from '../domain/SquareState'


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
  const [{ isOver, canDrop, item }, drop] = useDrop(
    () => ({
      accept: 'Pawn',
      drop: (item, monitor) => { console.log('FOROP'); game.drop((item as any).row, (item as any).col, row, col) },
      canDrop: (item, monitor) => (game.canDrop((item as any).row, (item as any).col, row, col) ),
      collect: (monitor) => ({
        item: monitor.getItem(),
        isOver: !!monitor.isOver(),
        canDrop: !!monitor.canDrop()
      })
    }),
    [row, col]
  )

  return (
    <div 
      ref={drop}
      className={`grid-square row-${row} row-${(row % 2) ? 'even' : 'odd'} col-${col} col-${(col % 2) ? 'even' : 'odd'}`}
      style={{
        border: (canDrop && isOver) ? '2px blue solid' : 'none' 
      }}
    >
      {(state === SquareState.black) && (
        <Pawn row={row} col={col} state={state} height={75} color='#322' />  
      )}
      {(state === SquareState.white) && (
        <Pawn row={row} col={col} state={state} height={75} color='#cbb' />  
      )}
    </div>  
  )
})

export default Square