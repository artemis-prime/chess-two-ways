  // @ts-ignore
import React from 'react'
import { observer } from 'mobx-react'
import { useDrag  } from 'react-dnd'

import type { Position, Piece } from '@artemis-prime/chess-domain'

import { useGame } from './GameProvider'
import { type DnDPiece, DND_ITEM_NAME } from './DnDPiece'
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
    type: DND_ITEM_NAME,
    item: {piece, from: position} as DnDPiece,
    canDrag: (monitor) => (game.currentTurn === piece.color),
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
