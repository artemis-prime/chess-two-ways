import React from 'react'
import { observer } from 'mobx-react'
import { useDrag } from 'react-dnd'

import { useGame } from './GameProvider'
import { BoardSquare } from '../chess'
import registry from './pieceRegistry'

export interface PieceComponentProps {
  color: string
}

const PieceComponent: React.FC<{
  square: BoardSquare
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

  const SpecificPiece = registry.get(square.piece!.type) as React.ComponentType<PieceComponentProps>

  return (
    <div 
      ref={drag}
      style={{
        opacity: (flashingOn) ? (isDragging ? 0.5 : 1) : 0.3, 
        cursor: canDrag ? (isDragging ? 'move' : 'pointer') : 'default', 
      }}
    >
      <SpecificPiece color={(square.piece!.color === 'white') ? '#cbb' : '#322' } />
    </div>
  )
})

export default PieceComponent
