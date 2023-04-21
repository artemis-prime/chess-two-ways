  // @ts-ignore
import React from 'react'
import { observer } from 'mobx-react'
import { useDraggable } from '@dnd-kit/core'
import type * as Stitches from '@stitches/react'

import { 
  type SquareDesc,
  type PositionState,
  positionToString, 
  pieceToString
} from '@artemis-prime/chess-core'

import { styled } from '~/style/stitches.config'
import c from '~/style/colors'

import { Flex } from '~/primitives'
import { usePulses, useGame } from '~/service'

import registry from './pieceRegistry'

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

const PieceComponent: React.FC<{
  desc: SquareDesc 
}> = observer(({
  desc
}) => {

  const game = useGame()
  const pulses = usePulses()

  if (!desc.pieceRef.piece) {
    return null
  }

  const canDrag = desc.pieceRef.piece && game.currentTurn === desc.pieceRef.piece.color

  const getEffectFromState = (state: PositionState): EffectVariant => {
    if (state.includes('capture')) {
      return pulses.fast ? 'capture' : 'capturePulse' 
    }
    else if (state === 'kingInCheck') {
      return pulses.slow ? 'kingInCheck' : 'kingInCheckPulse' 
    }
    else if (state === 'inCheckFrom') {
      return !pulses.slow ? 'inCheckFrom' : 'inCheckFromPulse' 
    }
    return undefined 
  }

  const SpecificPiece = registry.get(desc.pieceRef.piece.type) as React.ComponentType<SpecificPieceProps>

  return (
    <PieceEffectsView 
      justify='center'
      direction='row'
      align='center'
      color={desc.pieceRef.piece.color}
      effect={getEffectFromState(desc.posStateRef.state)}
      css={{
        opacity: (desc.posStateRef.state === 'origin' ? 0.5 : 1), 
        cursor: canDrag ? (desc.posStateRef.state === 'origin' ? 'move' : 'pointer') : 'default',
//        border: '0.5px red solid'
      }}
    >
      <SpecificPiece size={desc.pieceRef.piece.type === 'pawn' ? '80%' :'94%'} />
    </PieceEffectsView>
  )
})


  // Note that piece is not nullable, since this 
  // component should not be rendered in a square
  // that doesn't contain one.
const PieceDnDWrapper: React.FC<{
  desc: SquareDesc 
}> = observer(({
  desc,
}) => {

  const game = useGame()
  const canDrag = desc.pieceRef.piece && game.currentTurn === desc.pieceRef.piece.color
  
  const {listeners, setNodeRef: draggableRef} = useDraggable({
    id: positionToString(desc.position) + (desc.pieceRef.piece ? pieceToString(desc.pieceRef.piece) : ''), 
    disabled: !canDrag,
    data: {
      piece: desc.pieceRef.piece,
      from: desc.position
    }
  })
    // https://github.com/clauderic/dnd-kit/issues/389#issuecomment-1013324147
  return (
    <div ref={draggableRef}  {...listeners}>
      <PieceComponent desc={desc} />
    </div>
  )
})

export {
  type SpecificPieceProps,
  PieceDnDWrapper as default
} 
