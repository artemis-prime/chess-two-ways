  // @ts-ignore
import React from 'react'
import { observer } from 'mobx-react'
import { useDrag  } from 'react-dnd'

import type { Position, Piece } from '@artemis-prime/chess-core'

import { useGame } from './GameProvider'
import { type DraggingPiece, DRAGGING_PIECE } from './DraggingPiece'
import registry from './pieceRegistry'
export interface SpecificPieceProps {
  size?: string 
}

const PieceComponent: React.FC<{
  piece: Piece,
  position: Position
}> = observer(({
  piece,
  position
}) => {

  const game = useGame()
  const [{ isDragging, canDrag }, drag] = useDrag(() => ({
    type: DRAGGING_PIECE,
    item: {piece, from: position} as DraggingPiece,
    canDrag: (monitor) => (game.currentTurn === piece.color && game.playing),
    end: (item, monitor) => { game.endResolution() },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
      canDrag: !!monitor.canDrag()
    }),
  }), [position, piece])

  const SpecificPiece = registry.get(piece.type) as React.ComponentType<SpecificPieceProps>
  const pieceSize = piece.type === 'pawn' ? '80%' :'94%'

  return (
    <div 
      ref={drag}
      style={{
        opacity: (isDragging ? 0.5 : 1), 
        cursor: canDrag ? (isDragging ? 'move' : 'pointer') : 'default',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center', 
        alignItems: 'center', 
//        border: '0.5px red solid'
      }}
      className={`piece ${piece!.color}-piece`}
    >
      <SpecificPiece size={pieceSize} />
    </div>
  )
})

export default PieceComponent
