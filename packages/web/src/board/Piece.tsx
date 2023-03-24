  // @ts-ignore
import React from 'react'
import { observer } from 'mobx-react'
import { useDrag } from 'react-dnd'

import type { Square, Piece } from '@artemis-prime/chess-domain'

import { useGame } from './GameProvider'
import { type DnDPiece, DND_ITEM_NAME } from './DnDPiece'
import registry from './pieceRegistry'

export interface SpecificPieceProps {
  color: string
  size?: string 
}

const PieceComponent: React.FC<{
  piece: Piece,
  square: Square,
  dimmed: boolean
}> = observer(({
  piece,
  square,
  dimmed
}) => {
  const game = useGame()
  const [{ isDragging, canDrag }, drag] = useDrag(() => ({
    type: DND_ITEM_NAME,
    item: {piece, from: square} as DnDPiece,
    canDrag: (monitor) => (game.currentTurn === piece.color),
    end: (item, monitor) => { game.endResolution() },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
      canDrag: !!monitor.canDrag()
    }),
  }), [square, piece])

  const SpecificPiece = registry.get(piece.type) as React.ComponentType<SpecificPieceProps>

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
        color={(piece!.color === 'white') ? '#cbb' : '#322' } 
        size='85%'
      />
    </div>
  )
})

export default PieceComponent
