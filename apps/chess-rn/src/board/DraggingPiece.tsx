import React from 'react'
import { Text } from 'react-native'

import { styled } from '~/stitches.config'

import { type Piece, PIECETYPE_TO_UNICODE } from '@artemis-prime/chess-core'

const StyledText = styled(Text, {

  fontWeight: '600', 
  textAlign: 'center',
  textAlignVertical: 'center',
  position: 'absolute',
  opacity: 0.8,
  variants: {
    color: {
      white: {
        color: '$pieceWhite'
      },
      black: {
        color: '$pieceBlack'
      },
    }
  }
})

const DraggingPiece: React.FC<{  
  piece: Piece,
  size: number, 
  x: number
  y: number
}> = ({
  piece,
  size,
  x,
  y
}) =>  (
  <StyledText color={piece.color} style={{
    left: x - size / 2, 
    top: y - size / 2,
    fontSize: size * .8,
    width: size,
    height: size
  }}>{PIECETYPE_TO_UNICODE[piece.type]}</StyledText>
)

export default DraggingPiece
