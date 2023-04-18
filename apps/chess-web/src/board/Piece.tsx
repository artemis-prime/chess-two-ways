  // @ts-ignore
import React from 'react'
import { observer } from 'mobx-react'
import { useDraggable } from '@dnd-kit/core'
import type * as Stitches from '@stitches/react'

import { 
  type Position, 
  type Piece, 
  type PositionStatus,
  positionToString, 
  pieceToString
} from '@artemis-prime/chess-core'

import { styled } from '~/style/stitches.config'
import c from '~/style/colors'

import { Flex } from '~/primitives'

import { useGame } from './GameProvider'
import registry from './pieceRegistry'
import { usePulses } from './PulseProvider'
interface SpecificPieceProps {
  size?: string | number
}

const PieceEffectsView = styled(Flex, {
  '& svg': {
    display: 'block'
  },

  variants: {
    color: {
      white: {
        '& svg': {
          fill: c.ui.piece.white,
          filter: 'drop-shadow(1px 4px 3px rgb(0 0 0 / 0.45))'
        },
      },
      black: {
        '& svg': {
          fill: c.ui.piece.black,
          filter: 'drop-shadow(2px 4px 2px rgb(0 0 0 / 0.3))'
        },
      },
    },
    effect: {
      capture: {
      },
      capturePulse: {
      },
      kingInCheck: {
      },
      kingInCheckPulse: {
      },
      inCheckFrom: {
      },
      inCheckFromPulse: {
      },
    }
  },
  compoundVariants: [
    {
      color: 'black',
      effect: 'capture',
      css: {
        '& svg': {
          filter: 'drop-shadow(1px 4px 2px rgb(0 0 0 / 0.2))'
        }  
      }
    },
    {
      color: 'black',
      effect: 'capturePulse',
      css: {
        '& svg': {
          filter: 'drop-shadow(2px 4px 8px rgb(212, 104, 38))',
          transform: 'scale(1.1)'
        }  
      }
    },
    {
      color: 'black',
      effect: 'kingInCheck',
      css: {
        '& svg': {
          filter: 'drop-shadow(1px 4px 2px rgb(0 0 0 / 0.2))'
        }  
      }
    },
    {
      color: 'black',
      effect: 'kingInCheckPulse',
      css: {
        '& svg': {
          filter: 'drop-shadow(2px 4px 8px rgb(145, 23, 2))',
          transform: 'scale(1.1)'
        }  
      }
    },
    {
      color: 'black',
      effect: 'inCheckFrom',
      css: {
        '& svg': {
          filter: 'drop-shadow(1px 4px 2px rgb(0 0 0 / 0.2))'
        }  
      }
    },
    {
      color: 'black',
      effect: 'inCheckFromPulse',
      css: {
        '& svg': {
          filter: 'drop-shadow(2px 4px 8px rgb(145, 23, 2))',
          transform: 'scale(1.1)'
        }  
      }
    },
    {
      color: 'white',
      effect: 'capture',
      css: {
        '& svg': {
          filter: 'drop-shadow(1px 4px 2px rgb(0 0 0 / 0.35))'
        }  
      }
    },
    {
      color: 'white',
      effect: 'capturePulse',
      css: {
        '& svg': {
          filter: 'drop-shadow(2px 4px 8px rgb(212, 104, 38))',
          transform: 'scale(1.1)'
        }  
      }
    },
    {
      color: 'white',
      effect: 'kingInCheck',
      css: {
        '& svg': {
          filter: 'drop-shadow(1px 4px 2px rgb(0 0 0 / 0.35))'
        }  
      }
    },
    {
      color: 'white',
      effect: 'kingInCheckPulse',
      css: {
        '& svg': {
          filter: 'drop-shadow(2px 4px 8px rgb(145, 2, 2))',
          transform: 'scale(1.1)'
        }  
      }
    },
    {
      color: 'white',
      effect: 'inCheckFrom',
      css: {
        '& svg': {
          filter: 'drop-shadow(1px 4px 2px rgb(0 0 0 / 0.35))'
        }  
      }
    },
    {
      color: 'white',
      effect: 'inCheckFromPulse',
      css: {
        '& svg': {
          filter: 'drop-shadow(2px 4px 8px rgb(145, 2, 2))',
          transform: 'scale(1.1)'
        }  
      }
    },
  ]
})
type EffectsViewVariants = Stitches.VariantProps<typeof PieceEffectsView>
  // https://simondosda.github.io/posts/2021-06-17-interface-property-type.html
type EffectVariant = EffectsViewVariants['effect'] // includes undefined

  // Note that piece is not nullable, since this 
  // component should not be rendered in a square
  // that doesn't contain one.
const PieceComponent: React.FC<{
  piece: Piece,
  position: Position,
  status: PositionStatus
}> = observer(({
  piece,
  position,
  status
}) => {

  const game = useGame()
  const pulses = usePulses()

  const uniqueID = positionToString(position) + pieceToString(piece)
  const canDrag = game.currentTurn === piece.color
  const dragInProcess = status === 'origin'

  const {listeners, setNodeRef: draggableRef} = useDraggable({
    id: uniqueID, 
    disabled: !canDrag,
    data: {
      piece,
      from: position
    }
  })

  const getEffectFromStatus = (s: PositionStatus): EffectVariant   => {
    if (s.includes('capture')) {
      return pulses.fast ? 'capture' : 'capturePulse' 
    }
    else if (s === 'kingInCheck') {
      return pulses.slow ? s : 'kingInCheckPulse' 
    }
    else if (s === 'inCheckFrom') {
      return !pulses.slow ? s : 'inCheckFromPulse' 
    }
    return undefined 
  }

  const SpecificPiece = registry.get(piece.type) as React.ComponentType<SpecificPieceProps>
  const pieceSize = piece.type === 'pawn' ? '80%' :'94%'

  return (
    <PieceEffectsView 
      ref={draggableRef}
      {...listeners}
      justify='center'
      direction='row'
      align='center'
      color={piece.color}
      effect={getEffectFromStatus(status)}
      css={{
        opacity: (dragInProcess ? 0.5 : 1), 
        cursor: canDrag ? (dragInProcess ? 'move' : 'pointer') : 'default',
//        border: '0.5px red solid'
      }}
    >
      <SpecificPiece size={pieceSize} />
    </PieceEffectsView>
  )
})

export {
  type SpecificPieceProps,
  PieceComponent as default
} 
