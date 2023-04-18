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
  type PositionStatus
} from '@artemis-prime/chess-core'

import { styled } from '~/conf/stitches.config'
import type * as Stitches from 'stitches-native'

import PieceComponent from './Piece'

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
    effect: {
      origin: {
        opacity: 0.75
      },
      move: {
        borderColor: 'green',
        ...BORDER_COMMON
      },
      promote: {
        borderColor: 'yellow',
        ...BORDER_COMMON
      },
      castleRookTo: {
        borderColor: 'darkgreen',
        ...BORDER_COMMON
      },
      castleRookFrom: {
        borderColor: 'darkgreen',
        ...BORDER_COMMON
      },
    }
  }
})
type EffectsViewVariants = Stitches.VariantProps<typeof StyledFeedbackView>
  // https://simondosda.github.io/posts/2021-06-17-interface-property-type.html
type EffectVariant = EffectsViewVariants['effect'] // includes undefined


const FeedbackView: React.FC<{
  status: PositionStatus,
  size: number 
} & PropsWithChildren> = observer(({
  status,
  size,
  children
}) => {

  const pulses = usePulses()

  const getEffectFromStatus = (s: PositionStatus): { effect: EffectVariant, style: any}  => {

    const style: any = {}
    let effect: EffectVariant = undefined

    if (status === 'move' || status === 'castle') {
      effect = 'move'
      style.borderRadius = size / 2
    }
    
    if (status.includes('romote')) {
      if (pulses.fast) {
        effect = 'promote'
      }
    }
    else if (status === 'castleRookFrom') {
      if (pulses.slow) {
        effect = 'castleRookFrom'
      }
    }
    else if (status === 'castleRookTo') {
        // alternate with from
      if (!pulses.slow) {
        effect = 'castleRookTo'
      }
    }
    else if ([
      'invalid',
      'none',
      'kingInCheck',
      'inCheckFrom',
      'capture'
    ].includes(s as string)) {
      return {
        effect: undefined,
        style: {}
      }
    }
    return {
      effect,
      style
    }
  }

  const { effect, style } = getEffectFromStatus(status)

  return (
    <StyledFeedbackView effect={effect} css={style} >
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

  const getPositionStatus = (p: Position): PositionStatus => {

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
            return 'castleRookFrom'
          }
          else if (positionsEqual(p, {rank: dnd.payload.from.rank, file: 'f'})) {
            return 'castleRookTo'
          }
        }
        else if (dnd.squareOver.file === 'c') {
          if (positionsEqual(p, {rank: dnd.payload.from.rank, file: 'a'})) {
            return 'castleRookFrom'
          }
          else if (positionsEqual(p, {rank: dnd.payload.from.rank, file: 'd'})) {
            return 'castleRookTo'
          }
        }
      }
    }
    else {
      const inCheckResult = game.inCheck
      if (inCheckResult) {
        if (piece && piece.type === 'king' && piece.color === inCheckResult.side) {
          return 'kingInCheck'
        }
        else if (inCheckResult.from.find((from) => (positionsEqual(pos, from)))) {
          return 'inCheckFrom'
        }
      }
    }
    return 'none'
  }

  const status = getPositionStatus(pos)

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
