import React, { type ReactNode } from 'react'

import { ActionRecord, type AnnotatedResult, PIECETYPE_TO_UNICODE } from '@artemis-prime/chess-core'

import { styled } from '~/styles/stitches.config'

import SideSwatch from './SideSwatch'
import EMOJIS from './emojis'

const Outer = styled('span', {})

const Emoji = styled('span', {
  fontSize: '0.8rem',
  variants: {
    lighter: {
      true: {
        borderRadius: '$rounded',
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
      }
    },
    larger: {
      true: {
        fontSize: '0.9rem',
      }
    }
  }
})

const Text = styled('span', {
  fontSize: '0.8rem',
  color: 'inherit'
})

const getMoveComment = (rec: ActionRecord, previous: ActionRecord | undefined): ReactNode => {

  const result: ReactNode[] = [] 
  if (rec.annotatedResult === 'check') {
    result.push(
      <Outer css={{color: '$alert9'}} key='one'>
        <SideSwatch smaller side={rec.move.piece.side}/>
        <Text>:&nbsp;</Text>
        <Emoji>{EMOJIS.fist}</Emoji>
        <Text>!</Text>
      </Outer>
    )
  }
  if (previous?.annotatedResult === 'check') {
    result.push(
      <Outer key='two'>
        <SideSwatch smaller side={rec.move.piece.side}/>
        <Text>{': phew! '}</Text>
        <Emoji larger lighter>{EMOJIS.ninja}</Emoji>
      </Outer>
    )
  }
  if (rec.action.includes('capture')) {
    result.push(
      <Outer css={{color: rec.captured!.type === 'pawn' ? 'white' : '$alert8'}} key='three'>
        <SideSwatch smaller side={rec.captured!.side}/>
        <Text>
          :&nbsp;
          {rec.captured!.type === 'pawn' ? 
            `${EMOJIS.shrug} meh` 
            : 
            `${PIECETYPE_TO_UNICODE[rec.captured!.type]} ouch!`
          }
        </Text>
      </Outer>
    )
  }
  if (result.length === 1) {
    return result[0]
  }
  else if (result.length > 1) {
    return <>{result}</>
  }
  return ''
}

export default getMoveComment