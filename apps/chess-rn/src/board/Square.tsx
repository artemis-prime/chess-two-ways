import React from 'react'
import { 
  StyleProp,
  Text, 
  View,
  ViewStyle 
} from 'react-native'

import { styled } from '~/stitches.config'

import { type Position, type Piece, FILES } from '@artemis-prime/chess-core'
import { PIECETYPE_TO_UNICODE }  from '@artemis-prime/chess-core'

import { useGame } from './GameProvider'
import { type DraggingPiece, DRAGGING_PIECE } from './DraggingPiece'

const SquareInner = styled(View, {
  aspectRatio: 1,
  width: '12.5%',
  height: '12.5%',
  position: 'relative',
  variants: {
    brown: {
      true: {
        backgroundColor: '$boardSquareBrown'
      },
    }
  }
})

const shadowStyles = {
  position: 'absolute',
  top: 2,
  left: 2,
}

const PieceText = styled(Text, {

  fontSize: 35,
  fontWeight: '600', 
  textAlign: 'center',
  textAlignVertical: 'center',
  width: 40,
  height: 40,
  position: 'relative',
  variants: {
    color: {
      white: {
        color: '$pieceWhite'
      },
      black: {
        color: '$pieceBlack'
      },
      whiteShadow: {
        position: 'absolute',
        top: 2,
        left: 2,
        color: 'rgba(0, 0, 0, 0.3)',
      },
      blackShadow: {
        position: 'absolute',
        top: 2.5,
        left: 2.5,
        color: 'rgba(0, 0, 0, 0.5)',
      }
    }
  }
})

const Square: React.FC<{  
  position: Position
  piece: Piece | null
  style?: StyleProp<ViewStyle>
}> = ({
  position : pos,
  piece,
  style 
}) => {

  const game = useGame()

  const rankOdd = (pos.rank % 2)
  const fileOdd = (FILES.indexOf(pos.file) % 2)
  const brown = (rankOdd && fileOdd) || (!rankOdd && !fileOdd)

    // https://stackoverflow.com/questions/51611619/text-with-solid-shadow-in-react-native
  return (
    <SquareInner brown={brown ? 'true': undefined} >
      {piece && (<>
        <PieceText color={`${piece.color}Shadow`}>{PIECETYPE_TO_UNICODE[piece.type]}</PieceText>
        <PieceText color={piece.color}>{PIECETYPE_TO_UNICODE[piece.type]}</PieceText>
      </>)}  
    </SquareInner>
  )
}

export default Square
