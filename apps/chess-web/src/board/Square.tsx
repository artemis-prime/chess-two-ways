  // @ts-ignore
import React from 'react'
import { observer } from 'mobx-react'
import { useDroppable } from '@dnd-kit/core'
import type * as Stitches from '@stitches/react'

import { 
  FILES,
  type SquareDesc, 
  type PositionStatus,
  positionToString, 
} from '@artemis-prime/chess-core'

import { styled } from '~/style/stitches.config'

import PieceComponent from './Piece'
import { usePulses } from './UIStateProvider'

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

type EffectsViewVariants = Stitches.VariantProps<typeof EffectsView>
  // https://simondosda.github.io/posts/2021-06-17-interface-property-type.html
type EffectVariant = EffectsViewVariants['effect'] // includes undefined


const SquareComponent: React.FC<{
  desc: SquareDesc 
}> = observer(({
  desc
}) => {

  const pulses = usePulses()

  const getEffectFromStatus = (status: PositionStatus): EffectVariant  => {
    if (status === 'castleRookFrom') {
      return pulses.slow ? status : 'castleRookFromPulse' 
    }
    else if (status === 'castleRookTo') {
      return !pulses.slow ? status : 'castleRookToPulse' 
    }
    else if (status.includes('romote')) {
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
    ].includes(status as string)) {
      return undefined
    }
    return status as EffectVariant 
  }

  return (
    <EffectsView effect={getEffectFromStatus(desc.statusRef.status)} >
      <PieceComponent desc={desc} />  
    </EffectsView>
  )
})

const SquareDndWrapper: React.FC<{
  desc: SquareDesc 
}> = ({ 
  desc
}) => {

  const posString = positionToString(desc.position)
  const {setNodeRef: droppableRef} = useDroppable({
    id: posString, 
    data: {position: desc.position},
  })

    // https://github.com/clauderic/dnd-kit/issues/389#issuecomment-1013324147
  return (
    <div 
      ref={droppableRef}
      style={{ position: 'relative' }}
      className={`square rank-${desc.position.rank} rank-${(desc.position.rank % 2) ? 'odd' : 'even'} ` +
        `file-${desc.position.file} file-${(FILES.indexOf(desc.position.file) % 2) ? 'even' : 'odd'}` 
      }
    >
      <SquareComponent desc={desc} />
    </div>  
  )
}

export default SquareDndWrapper
