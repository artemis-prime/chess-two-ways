  // @ts-ignore
import React from 'react'
import { observer } from 'mobx-react'

import { styled } from '~/style/stitches.config'
import c from '~/style/colors'

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

  const piece = useDraggingPiece()

  if (piece.pieceValue) {
    const SpecificPiece = registry.get(piece.pieceValue.type) as React.ComponentType<SpecificPieceProps>
    const pieceSize = piece.pieceValue.type === 'pawn' ? size * .85 : size
    return (
      <PieceEffectsView 
        justify='center'
        direction='row'
        align='center'
        color={piece.pieceValue.color}
      >
        <SpecificPiece size={pieceSize} />
      </PieceEffectsView>
    )
  }
  return null
})

export default DraggingPiece
