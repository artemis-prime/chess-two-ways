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

const PieceText = styled(Text, {

  //backgroundColor: 'white',
  //backgroundColor: 'rgba(255, 255, 255,0)',
  fontSize: 35,
  //textShadowColor: 'rgba(255, 255, 255, 1)', // 'black', // '#000',
  //textShadowOffset: {width: 0, height: 0},
  //textShadowRadius: 4, 
  fontWeight: '600', 
  //elevation: 10,
  textAlign: 'center',
  textAlignVertical: 'center',
  width: 40,
  height: 40,
  position: 'relative',
  variants: {
    color: {
      white: {
          // @ts-ignore
        color: '$pieceWhite'
      },
      black: {
          // @ts-ignore
        color: '$pieceBlack'
      },
      shadow: {
        position: 'absolute',
        top: 2,
        left: 2,
        color: 'rgba(0, 0, 0, 0.3)',
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
  const rankOdd = (pos.rank % 2)
  const fileOdd = (FILES.indexOf(pos.file) % 2)
  const brown = (rankOdd && fileOdd) || (!rankOdd && !fileOdd)

  return (
    <SquareInner brown={brown ? 'true': undefined} >
      {piece && (<>
        <PieceText color='shadow'>{PIECETYPE_TO_UNICODE[piece.type]}</PieceText>
        <PieceText color={piece.color}>{PIECETYPE_TO_UNICODE[piece.type]}</PieceText>
      </>)}  
    </SquareInner>
  )
}

export default Square
