import React from 'react'
import { observer } from 'mobx-react'
import { useDroppable } from '@dnd-kit/core'
import type { VariantProps } from '@stitches/react'

import { 
  FILES,
  type ObsSquare, 
  type SquareState,
  positionToString, 
} from '@artemis-prime/chess-core'

import { styled } from '~/styles/stitches.config'
import { usePulses } from '~/services'

import PieceComponent from './Piece'

const EffectsView = styled('div', {
  position: 'absolute', 
  top: 0, 
  bottom: 0, 
  left: 0, 
  right: 0,
  display: 'flex',
  justifyContent: 'center', 
  alignItems: 'center', 
  variants: {
    effect: {
      move: {
        borderRadius: '50%',
        border: '2px green solid'
      },
      promote: {
        border: '1px yellow solid'
      },
      castle: {
        borderRadius: '50%',
        border: '2px green solid'
      },
      promoteCapture: {
        border: '1px yellow solid'
      },
      castleRookFrom: {
        border: '1px darkgreen solid' 
      },
      castleRookTo: {
        border: '1px darkgreen solid' 
      },
      castleRookFromPulse: {
        border: '3px darkgreen solid' 
      },
      castleRookToPulse: {
        border: '3px darkgreen solid' 
      },
    }
  }
})

type EffectsViewVariants = VariantProps<typeof EffectsView>
  // https://simondosda.github.io/posts/2021-06-17-interface-property-type.html
type EffectVariant = EffectsViewVariants['effect'] // includes undefined


const SquareComponent: React.FC<{
  square: ObsSquare 
}> = observer(({
  square
}) => {

  const pulses = usePulses()

  const getEffectFromState = (state: SquareState): EffectVariant  => {
    if (state === 'castleRookFrom') {
      return pulses.slow ? state : 'castleRookFromPulse' 
    }
    else if (state === 'castleRookTo') {
      return !pulses.slow ? state : 'castleRookToPulse' 
    }
    else if (state.includes('romote')) {
      if (pulses.fast) {
        return undefined
      }
    }
    else if ([
      'origin',
      'invalid',
      'none',
      'kingInCheck',
      'inCheckFrom',
      'capture'
    ].includes(state as string)) {
      return undefined
    }
    return state as EffectVariant 
  }

  return (
    <EffectsView effect={getEffectFromState(square.squareState)} >
      <PieceComponent square={square} />  
    </EffectsView>
  )
})

const SquareDndWrapper: React.FC<{
  square: ObsSquare 
}> = ({ 
  square
}) => {

  const {setNodeRef: ref} = useDroppable({
    id: positionToString(square), 
    data: { position: square },
  })

    // https://github.com/clauderic/dnd-kit/issues/389#issuecomment-1013324147
  return (
    <div 
      ref={ref}
      style={{ position: 'relative' }}
      className={`square rank-${square.rank} rank-${(square.rank % 2) ? 'odd' : 'even'} ` +
        `file-${square.file} file-${(FILES.indexOf(square.file) % 2) ? 'even' : 'odd'}` 
      }
    >
      <SquareComponent square={square} />
    </div>  
  )
}

export default SquareDndWrapper
