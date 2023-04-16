import React, { PropsWithChildren } from 'react'
import { 
  StyleProp,
  Text, 
  View,
  ViewStyle 
} from 'react-native'
import { observer } from 'mobx-react'

import { styled } from '~/conf/stitches.config'

import { 
  type Position, 
  type Piece,
  type Action,
  positionsEqual,
  FILES, 
  PIECETYPE_TO_UNICODE 
} from '@artemis-prime/chess-core'

  // Should be enough for the UI to give feedback based on these values.
  // (TODO: Consider making this an array of possibly coincident statuses)
type DnDRole = 
  Action |                // current square resolves to the Action
  'origin' |              // origin of the drag
  'invalid' |             // over this square, but no valid move
  'castle-rook-from' |    // action is 'castle' and this square is the rook's origin in the castle
  'castle-rook-to' |      // action is 'castle' and this square is the rook's destination in the castle
  'none' |                // not under in the current drag or involved
  'king-in-check' | 
  'in-check-from'

import { useChessDnD } from './ChessDnD'
import { useGame } from './GameProvider'
import { usePulses } from './PulseProvider'

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

const BORDER_COMMON = {
  borderWidth: 1,
  borderRadius: 0,
}
 
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
    move: {
      true: {
        borderColor: 'green',
        ...BORDER_COMMON
      }
    },
    capture: {
      true: {
        borderColor: 'orange',
        ...BORDER_COMMON
      }
    },
    promote: {
      true: {
        borderColor: 'yellow',
        ...BORDER_COMMON
      }
    },
    rookTo: {
      true: {
        borderColor: 'green',
        ...BORDER_COMMON
      }
    },
    rookFrom: {
      true: {
        borderColor: 'green',
        ...BORDER_COMMON
      }
    },
    kingInCheck: {
      true: {
        borderColor: 'red',
        ...BORDER_COMMON
      }
    },
    inCheckFrom: {
      true: {
        borderColor: 'red',
        ...BORDER_COMMON
      }
    },
  }
})


const FeedbackView: React.FC<{
  status: DnDRole,
  size: number 
} & PropsWithChildren> = observer(({
  status,
  size,
  children
}) => {

  const pulses = usePulses()

  const toStatusSpread: any = {}
  const styleToSpread: any = {}
  if (status === 'origin') {
    toStatusSpread.origin = true
  }
  else if (status === 'move' || status === 'castle') {
    toStatusSpread.move = true
    styleToSpread.borderRadius = size / 2
  }
  else if (status.includes('promote')) {
    if (pulses.fast) {
      toStatusSpread.promote = true
    }
  }
  else if (status === 'capture') {
    if (pulses.fast) {
      toStatusSpread.capture = true
    }
  }
  else if (status === 'castle-rook-from') {
    if (pulses.fast) {
      toStatusSpread.rookFrom = true
    }
  }
  else if (status === 'castle-rook-to') {
      // alternate with from
    if (!pulses.fast) {
      toStatusSpread.rookTo = true
    }
  }
  else if (status === 'king-in-check') {
    if (pulses.slow) {
      toStatusSpread.kingInCheck = true
      styleToSpread.borderRadius = size / 2
    }
  }
    // alternate with king
  else if (status === 'in-check-from') {
    if (!pulses.slow) {
      toStatusSpread.inCheckFrom = true
      styleToSpread.borderRadius = size / 2
    }
  }
  return (
    <StyledFeedbackView {...toStatusSpread} style={styleToSpread} >
      <View style={{position: 'relative', width: '100%', height: '100%'}} >
        {children}
      </View>
    </StyledFeedbackView>
  )
})

/* See comments in Board.tsx re sizing changes */
const Square: React.FC<{  
  position: Position
  piece: Piece | null
  sizeInLayout: number | undefined
  style?: StyleProp<ViewStyle>
}> = observer(({
  position : pos,
  piece,
  sizeInLayout,
  style 
}) => {

  const rankOdd = (pos.rank % 2)
  const fileOdd = (FILES.indexOf(pos.file) % 2)
  const brown = (rankOdd && fileOdd) || (!rankOdd && !fileOdd) ? {brown: true} : {}

  const dnd = useChessDnD()
  const game = useGame()

  const getSquaresDnDStatus = (p: Position): DnDRole => {

    if (dnd.payload && positionsEqual(dnd.payload.from, p)) {
      return 'origin'
    }
    if (dnd.payload) {
      if (dnd.squareOver && positionsEqual(dnd.squareOver, p)) {
        if (dnd.resolvedAction) {
          return dnd.resolvedAction
        }
        else {
          return 'invalid'
        }
      }
      else if (dnd.squareOver && dnd.resolvedAction && dnd.resolvedAction === 'castle') {
        if (dnd.squareOver.file === 'g') {
          if (positionsEqual(p, {rank: dnd.payload.from.rank, file: 'h'})) {
            return 'castle-rook-from'
          }
          else if (positionsEqual(p, {rank: dnd.payload.from.rank, file: 'f'})) {
            return 'castle-rook-to'
          }
        }
        else if (dnd.squareOver.file === 'c') {
          if (positionsEqual(p, {rank: dnd.payload.from.rank, file: 'a'})) {
            return 'castle-rook-from'
          }
          else if (positionsEqual(p, {rank: dnd.payload.from.rank, file: 'd'})) {
            return 'castle-rook-to'
          }
        }
      }
    }
    else {
      const inCheckResult = game.inCheck
      if (inCheckResult) {
        if (piece && piece.type === 'king' && piece.color === inCheckResult.side) {
          return 'king-in-check'
        }
        else if (inCheckResult.from.find((from) => (positionsEqual(pos, from)))) {
          return 'in-check-from'
        }
      }
    }
    return 'none'
  }

    // Only do inner layout stuff if we have an accurate size available.
    // This avoids potentional jump after initial layout.
  return (
    <SquareInner {...brown} style={style}>
      {sizeInLayout && (
      <FeedbackView size={sizeInLayout} status={getSquaresDnDStatus(pos)} >
      {piece && (<>
        {/* https://stackoverflow.com/questions/51611619/text-with-solid-shadow-in-react-native */ }
        <PieceText style={{fontSize: sizeInLayout *.80}} color={`${piece.color}Shadow`}>{PIECETYPE_TO_UNICODE[piece.type]}</PieceText>
        <PieceText style={{fontSize: sizeInLayout *.80}} color={piece.color}>{PIECETYPE_TO_UNICODE[piece.type]}</PieceText>
      </>)}  
      </FeedbackView>
      )}
    </SquareInner>
  )
})

export default Square
