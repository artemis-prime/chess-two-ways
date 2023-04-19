  // @ts-ignore
import React from 'react'
import { observer } from 'mobx-react'
import { useDroppable } from '@dnd-kit/core'
import type * as Stitches from '@stitches/react'

import { 
  FILES,
  type Piece,
  type Position, 
  type PositionStatus,
  positionToString, 
  getPositionStatus
} from '@artemis-prime/chess-core'

import { styled } from '~/style/stitches.config'

import { useGame } from './GameProvider'
import PieceComponent from './Piece'
import { useChessDnD } from './ChessDnD'
import { usePulses } from './PulseProvider'


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
  position: Position
  piece: Piece | null
}> = observer(({ 
  position,
  piece
}) => {

  const game = useGame()
  const dnd = useChessDnD()
  const pulses = usePulses()

  const posString = positionToString(position)
  const {setNodeRef: droppableRef} = useDroppable({id: posString, data: {position}})

  const getEffectFromStatus = (s: PositionStatus): EffectVariant  => {
    if (s === 'castleRookFrom') {
      return pulses.slow ? s : 'castleRookFromPulse' 
    }
    else if (s === 'castleRookTo') {
      return !pulses.slow ? s : 'castleRookToPulse' 
    }
    else if (s.includes('romote')) {
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
    ].includes(s as string)) {
      return undefined
    }
    return s as EffectVariant 
  }

  const status = getPositionStatus(
    position,
    dnd.resolvedDrag,
    game.check
  )

  return (
    <div 
      ref={droppableRef}
      style={{ position: 'relative' }}
      className={`square rank-${position.rank} rank-${(position.rank % 2) ? 'odd' : 'even'} ` +
        `file-${position.file} file-${(FILES.indexOf(position.file) % 2) ? 'even' : 'odd'}` 
      }
    >
      <EffectsView effect={getEffectFromStatus(status)}>
      {(!!piece) && (
        <PieceComponent position={position} piece={piece} status={status} />  
      )}
      </EffectsView>
    </div>  
  )
})

export default SquareComponent
