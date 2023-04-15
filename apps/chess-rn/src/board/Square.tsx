import React, { PropsWithChildren, useEffect, useRef, useState } from 'react'
import { 
  StyleProp,
  Text, 
  View,
  ViewStyle 
} from 'react-native'

import { styled } from '~/conf/stitches.config'

import { 
  type Position, 
  type Piece,
  FILES, 
  PIECETYPE_TO_UNICODE 
} from '@artemis-prime/chess-core'

import { type SquaresDndStatus } from './ChessDragAndDrop'

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
    },
  }
})

const StyledFeedbackView = styled(View, {

  position: 'absolute', 
  top: 0, 
  bottom: 0, 
  left: 0, 
  right: 0,
  justifyContent: 'center', 
  alignItems: 'center', 

  variants: {
    origin: {
      true: {
        opacity: 0.75
      },
    },
    validMove: {
      true: {
        borderColor: 'green',
        borderWidth: 1,
      }
    },
    validCapture: {
      true: {
        borderColor: 'orange',
        borderWidth: 1,
      }
    },
    validPromote: {
      true: {
        borderColor: 'yellow',
        borderWidth: 1,
      }
    }
  }
})


const PieceText = styled(Text, {

  fontWeight: '600', 
  textAlign: 'center',
  textAlignVertical: 'center',
  width: '90%',
  height: '90%',
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

const FeedbackView: React.FC<{
  status: SquaresDndStatus,
  size: number | string
} & PropsWithChildren> = ({
  status,
  size,
  children
}) => {
  const origin = (status === 'origin') ? {origin: true} : {}
  const move = (status === 'move' || status === 'castle') ? {validMove: true} : {}
  const capture = (status === 'capture') ? {validCapture: true} : {}
  const promote = (status.includes('promote')) ? {validPromote: true} : {}
  const toSpread = { ...origin, ...move, ...capture, ...promote}
  return (
    <StyledFeedbackView {...toSpread} style={{borderRadius: (typeof size === 'number') ? size / 2 : 20}} >
      <View style={{position: 'relative', width: '100%', height: '100%'}} >
        {children}
      </View>
    </StyledFeedbackView>
  )
}

/* See comments in Board.tsx re sizing changes */

const Square: React.FC<{  
  position: Position
  piece: Piece | null
  status: SquaresDndStatus
  sizeInLayout: number | undefined
  style?: StyleProp<ViewStyle>
}> = ({
  position : pos,
  piece,
  status,
  sizeInLayout,
  style 
}) => {

  const rankOdd = (pos.rank % 2)
  const fileOdd = (FILES.indexOf(pos.file) % 2)
  const brown = (rankOdd && fileOdd) || (!rankOdd && !fileOdd) ? {brown: true} : {}

    // Only do inner layout stuff if we have an accurate size available.
    // This avoids potentional jump after initial layout.
  return (
    <SquareInner {...brown} style={style}>
      {sizeInLayout && (
      <FeedbackView size={sizeInLayout} status={status} >
      {piece && (<>
        {/* https://stackoverflow.com/questions/51611619/text-with-solid-shadow-in-react-native */ }
        <PieceText style={{fontSize: sizeInLayout *.80}} color={`${piece.color}Shadow`}>{PIECETYPE_TO_UNICODE[piece.type]}</PieceText>
        <PieceText style={{fontSize: sizeInLayout *.80}} color={piece.color}>{PIECETYPE_TO_UNICODE[piece.type]}</PieceText>
      </>)}  
      </FeedbackView>
      )}
    </SquareInner>
  )
}

export default Square
