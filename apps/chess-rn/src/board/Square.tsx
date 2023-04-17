import React, { PropsWithChildren } from 'react'
import { 
  StyleProp,
  View,
  ViewStyle 
} from 'react-native'
import { observer } from 'mobx-react'

import { 
  type Position, 
  type Piece,
  type Action,
  positionsEqual,
  FILES, 
} from '@artemis-prime/chess-core'

import { styled } from '~/conf/stitches.config'
import PieceComponent from './Piece'

  // Should be enough for the UI to give feedback based on these values.
  // (TODO: Consider making this an array of possibly coincident statuses)
export type DnDRole = 
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
        // see shadows in Piece.tsx
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
        borderColor: 'darkgreen',
        ...BORDER_COMMON
      }
    },
    rookFrom: {
      true: {
        borderColor: 'darkgreen',
        ...BORDER_COMMON
      }
    },
    kingInCheck: {
      true: {
        // see shadows in Piece.tsx
      }
    },
    inCheckFrom: {
      true: {
        // see shadows in Piece.tsx
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
  /* see shadows in Piece.tsx
  else if (status === 'capture') {
  }
  */
  else if (status === 'castle-rook-from') {
    if (pulses.slow) {
      toStatusSpread.rookFrom = true
    }
  }
  else if (status === 'castle-rook-to') {
      // alternate with from
    if (!pulses.slow) {
      toStatusSpread.rookTo = true
    }
  }
  /* see shadows in Piece.tsx
  else if (status === 'king-in-check') {
  }
  /* see shadows in Piece.tsx
  else if (status === 'in-check-from') {
  }
  */
  return (
    <StyledFeedbackView {...toStatusSpread} style={styleToSpread} >
      {children}
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

  const status = getSquaresDnDStatus(pos)

    // Only do inner layout stuff if we have an accurate size available.
    // This avoids potentional jump after initial layout.
  return (
    <SquareInner {...brown} style={style}>
      {sizeInLayout && (
      <FeedbackView size={sizeInLayout} status={status} >
        <PieceComponent piece={piece} size={sizeInLayout} status={status} /> 
      </FeedbackView>
      )}
    </SquareInner>
  )
})

export default Square
