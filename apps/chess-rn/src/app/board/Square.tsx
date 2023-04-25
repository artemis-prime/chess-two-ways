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

import { styled } from '~/styles/stitches.config'
import { usePulses } from '~/services'

import PieceComponent from './Piece'

const SquareInner = styled(View, {
  aspectRatio: 1,
  width: '12.5%',
  height: '12.5%',
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
    effect: {
      origin: {
        opacity: 0.75
      },
      move: {
        borderColor: 'green',
        borderWidth: '$normal',
        borderRadius: '$rounded',
      },
      promote: {
        borderColor: 'yellow',
        borderWidth: '$normal',
      },
      castleRookTo: {
        borderColor: 'darkgreen',
        borderWidth: '$normal',
      },
      castleRookFrom: {
        borderColor: 'darkgreen',
        borderWidth: '$normal'
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

  const getEffectFromPositionState = (s: PositionState): EffectVariant  => {

    let effect: EffectVariant = undefined
    if (s === 'move' || s === 'castle') {
      effect = 'move'
    }
    else if (s.includes('romote') && pulses.fast) {
      effect = 'promote'
    }
    else if (s === 'castleRookFrom' && pulses.slow) {
      effect = 'castleRookFrom'
    }
      // // alternate with castleRookFrom
    else if (s === 'castleRookTo' && !pulses.slow) {
      effect = 'castleRookTo'
    }
    return effect
  }

  return (
    <StyledFeedbackView effect={getEffectFromPositionState(stateRef.state)} >
      {children}
    </StyledFeedbackView>
  )
})

  // See comments in Board.tsx re sizing changes 
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
