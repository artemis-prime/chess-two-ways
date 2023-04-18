  // @ts-ignore
import React from 'react'
import { observer } from 'mobx-react'

import { styled } from '~/style/stitches.config'
import c from '~/style/colors'

import { Flex } from '~/primitives'

import registry from './pieceRegistry'
import { useChessDnD } from './ChessDnD'
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
          //filter: 'drop-shadow(1px 4px 3px rgb(0 0 0 / 0.45))'
        },
      },
      black: {
        '& svg': {
          fill: c.ui.piece.black,
          //filter: 'drop-shadow(2px 4px 2px rgb(0 0 0 / 0.3))'
        },
      },
    },
  }
})

  // Note that piece is not nullable, since this 
  // component should not be rendered in a square
  // that doesn't contain one.
const DraggingPiece: React.FC<{
  size: number
}> = observer(({
  size
}) => {

  const dnd = useChessDnD()

  if (dnd.payload) {
    const SpecificPiece = registry.get(dnd.payload.piece.type) as React.ComponentType<SpecificPieceProps>
    const pieceSize = dnd.payload.piece.type === 'pawn' ? size * .85 : size
    return (
      <PieceEffectsView 
        justify='center'
        direction='row'
        align='center'
        color={dnd.payload.piece.color}
        css={{
          //cursor: 'move' ,
        }}
      >
        <SpecificPiece size={pieceSize} />
      </PieceEffectsView>
    )
  }
  return null
})

export default DraggingPiece
