import React from 'react'
import { observer } from 'mobx-react'

import { styled } from '~/styles/stitches.config'
import c from '~/styles/colors'

import { Flex } from '~/primitives'

import registry from './pieceRegistry'
import { useDraggingPiece } from './ChessDnD'
import type { SpecificPieceProps } from './Piece'

const PieceEffectsView = styled(Flex, {
  '& svg': {
    display: 'block'
  },

  variants: {
    color: {
      white: {
        '& svg': {
          fill: c.ui.piece.white,
        },
      },
      black: {
        '& svg': {
          fill: c.ui.piece.black,
        },
      },
    },
  }
})

const DraggingPiece: React.FC<{
  size: number
}> = observer(({
  size
}) => {

  const pieceRef = useDraggingPiece()

  if (pieceRef.piece) {
    const SpecificPiece = registry.get(pieceRef.piece.type) as React.ComponentType<SpecificPieceProps>
    const pieceSize = pieceRef.piece.type === 'pawn' ? size * .85 : size
    return (
      <PieceEffectsView 
        justify='center'
        direction='row'
        align='center'
        color={pieceRef.piece.color}
      >
        <SpecificPiece size={pieceSize} />
      </PieceEffectsView>
    )
  }
  return null
})

export default DraggingPiece
