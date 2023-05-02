import React from 'react'
import { observer } from 'mobx-react'
import { useDraggable } from '@dnd-kit/core'
import type { VariantProps } from '@stitches/react'

import { 
  type ObsSquare,
  type SquareState,
  positionToString, 
  pieceToString
} from '@artemis-prime/chess-core'

import { styled } from '~/styles/stitches.config'

import { Flex } from '~/primitives'
import { usePulses, useGame } from '~/services'

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
          fill: '$pieceWhite',
          filter: 'drop-shadow(1px 4px 3px rgb(0 0 0 / 0.45))'
        },
      },
      black: {
        '& svg': {
          fill: '$pieceBlack',
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
type EffectsViewVariants = VariantProps<typeof PieceEffectsView>
  // https://simondosda.github.io/posts/2021-06-17-interface-property-type.html
type EffectVariant = EffectsViewVariants['effect'] // includes undefined

const PieceComponent: React.FC<{
  square: ObsSquare 
}> = observer(({
  square
}) => {

  const game = useGame()
  const pulses = usePulses()

  if (!square.piece) {
    return null
  }

  const canDrag = square.piece && game.currentTurn === square.piece.color

  const getEffectFromState = (state: SquareState): EffectVariant => {
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

  const SpecificPiece = registry.get(square.piece.type) as React.ComponentType<SpecificPieceProps>

  return (
    <PieceEffectsView 
      justify='center'
      direction='row'
      align='center'
      color={square.piece.color}
      effect={getEffectFromState(square.squareState)}
      css={{
        opacity: (square.squareState === 'origin' ? 0.5 : 1), 
        cursor: canDrag ? (square.squareState === 'origin' ? 'move' : 'pointer') : 'default',
//        border: '0.5px red solid'
      }}
    >
      <SpecificPiece size={square.piece.type === 'pawn' ? '80%' :'94%'} />
    </PieceEffectsView>
  )
})


const PieceDnDWrapper: React.FC<{
  square: ObsSquare 
}> = observer(({
  square,
}) => {

  const game = useGame()
  const canDrag = square.piece && game.currentTurn === square.piece.color
  
  const {listeners, setNodeRef: draggableRef} = useDraggable({
    id: positionToString(square) + (square.piece ? pieceToString(square.piece) : ''), 
    disabled: !canDrag,
    data: {
      piece: square.piece,
      from: square
    }
  })
    // https://github.com/clauderic/dnd-kit/issues/389#issuecomment-1013324147
  return (
    <div ref={draggableRef}  {...listeners}>
      <PieceComponent square={square} />
    </div>
  )
})

export {
  type SpecificPieceProps,
  PieceDnDWrapper as default
} 
