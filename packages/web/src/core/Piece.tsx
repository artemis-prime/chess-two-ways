  // @ts-ignore
import React from 'react'
import { observer } from 'mobx-react'
import { useDrag } from 'react-dnd'

import type { BoardSquare } from '@artemis-prime/chess-domain'

import { useGame } from './GameProvider'
import registry from './pieceRegistry'

export interface PieceComponentProps {
  color: string
  size?: string 
}

const PieceComponent: React.FC<{
  square: BoardSquare
  dimmed: boolean
}> = observer(({
  square,
  dimmed
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
        opacity: (dimmed) ?  0.3 : (isDragging ? 0.5 : 1), 
        cursor: canDrag ? (isDragging ? 'move' : 'pointer') : 'default',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center', 
      }}
    >
      <SpecificPiece 
        color={(square.piece!.color === 'white') ? '#cbb' : '#322' } 
        size='85%'
      />
    </div>
  )
})

export default PieceComponent
