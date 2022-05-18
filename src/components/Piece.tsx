import React from 'react'
import { observer } from 'mobx-react'
import { useDrag } from 'react-dnd'

import { useGame } from '../domain/GameProvider'
import { Square } from '../domain/types'
import registry from './pieces/registry'

const Piece: React.FC<{
  square: Square
  flashingOn: boolean
}> = observer(({
  square,
  flashingOn
}) => {
  const game = useGame()
  const [{ isDragging, canDrag }, drag] = useDrag(() => ({
    type: 'piece',
    item: {...square},
    canDrag: (monitor) => (
      game.currentTurn() === square.piece!.color
    ),
    collect: (monitor) => ({
      isDragging: game.currentTurn() === square.piece!.color && !!monitor.isDragging(),
      canDrag: monitor.canDrag()
    }),
  }), [square])

  const pieceRenderer = registry.get(square.piece!.type)

  return (
    <div 
      ref={drag}
      style={{
        opacity: (flashingOn) ? (isDragging ? 0.5 : 1) : 0.3, 
        cursor: canDrag ? (isDragging ? 'move' : 'pointer') : 'default', 
      }}
    >
      {pieceRenderer && pieceRenderer(square.piece!.color)}
    </div>
  )
})

export default Piece
