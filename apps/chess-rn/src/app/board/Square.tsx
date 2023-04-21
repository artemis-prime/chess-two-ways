import React, { PropsWithChildren } from 'react'
import { 
  StyleProp,
  View,
  ViewStyle 
} from 'react-native'
import { observer } from 'mobx-react'
import type * as Stitches from 'stitches-native'

import { 
  type PositionState, 
  type SquareDesc,
  type ObsPositionStateRef,
  FILES 
} from '@artemis-prime/chess-core'

import { styled } from '~/style/stitches.config'
import { usePulses } from '~/service'

import PieceComponent from './Piece'

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
  stateRef: ObsPositionStateRef,
  size: number 
} & PropsWithChildren> = observer(({
  stateRef,
  size,
  children
}) => {

  const pulses = usePulses()

  const getEffectFromPositionState = (s: PositionState): { effect: EffectVariant, style: StyleProp<ViewStyle>}  => {

    const style: StyleProp<ViewStyle> = {}
    let effect: EffectVariant = undefined

    if (s === 'move' || s === 'castle') {
      effect = 'move'
      style.borderRadius = size / 2
    }
    
    if (s.includes('romote')) {
      if (pulses.fast) {
        effect = 'promote'
      }
    }
    else if (s === 'castleRookFrom') {
      if (pulses.slow) {
        effect = 'castleRookFrom'
      }
    }
    else if (s === 'castleRookTo') {
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

  return (
    <StyledFeedbackView {...getEffectFromPositionState(stateRef.state)} >
      {children}
    </StyledFeedbackView>
  )
})

/* See comments in Board.tsx re sizing changes */
const Square: React.FC<{  
  desc: SquareDesc,
  sizeInLayout: number | undefined
  style?: StyleProp<ViewStyle>
}> = observer(({
  desc,
  sizeInLayout,
  style 
}) => {

  const rankOdd = (desc.position.rank % 2)
  const fileOdd = (FILES.indexOf(desc.position.file) % 2)
  const brown = (rankOdd && fileOdd) || (!rankOdd && !fileOdd) ? {brown: true} : {}

    // Only do inner layout stuff if we have an accurate size available.
    // This avoids potentional jump after initial layout.
  return (
    <SquareInner {...brown} style={style}>
      {sizeInLayout && (
      <FeedbackView size={sizeInLayout} stateRef={desc.posStateRef} >
        <PieceComponent desc={desc} size={sizeInLayout} /> 
      </FeedbackView>
      )}
    </SquareInner>
  )
})

export default Square
