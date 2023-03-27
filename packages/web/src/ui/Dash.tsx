  // @ts-ignore
import React, { ReactHTMLElement } from 'react'
import { observer } from 'mobx-react'

import type { ConsoleMessage } from '~/board/VisualFeedback'
import { useGame } from '~/board/GameProvider'

import {
  Button,
  Flex,
} from '~/primitives'

import { useVisualFeedback } from '~/board/VisualFeedback'
import unicodePieces from './pieceTypeToUnicode'


const Dash: React.FC<{}> = observer(() => {

  const game = useGame()
  const { messages } = useVisualFeedback()

  const getMessagePrefix = (m: ConsoleMessage): string => {
    if (m.type === 'undo') return '  (undo:) '
    if (m.type === 'redo') return '  (redo:) '
    if (m.type === 'warning') return 'w: '
    return ''
  }

  const getMessagePostfixElement = (m: ConsoleMessage): React.ReactNode => {
    if (m.type?.includes('capture')) {
      const colorOfPieceThatTookAction = m.message.slice(0, 1)
      const colorCaptured = colorOfPieceThatTookAction === 'w' ? 'b' : 'w'
      const pieceType = m.message.slice(1, 2) // 'K', 'Q', etc
      return (
        <span className='postfix'>(<span className={`unicode-chess-piece ${colorCaptured}`}>{(unicodePieces as any)[pieceType]}</span>: Ouch!)</span>
      )
    }
    return <></>
  }

  return (
    <div className='dash'>
      <p className='turn-widget'>Who's turn: <span className={`turn-indicator ${game.currentTurn}`}>&nbsp;&nbsp;&nbsp;&nbsp;</span></p>
      <Flex direction='row' justify='start' align='center'>
        <Button 
          size='medium'  
          disabled={!game.canUndo}
          onClick={game.undo.bind(game)}
        >Undo</Button>
        &nbsp;{!(game.canUndo || game.canRedo) ? (<span style={{paddingRight: '2px'}} />) : 'I'}&nbsp;
        <Button 
          size='medium'  
          disabled={!game.canRedo}
          onClick={game.redo.bind(game)}
        >Redo</Button>
      </Flex>
      {messages.length > 0 && (
        <div className='messages-list'>
          <p>----------------------</p>
        {messages.map((m, i) => (
          <p key={i} className={`message-outer message-type-${m.type}`}>
            <span className='prefix'>{getMessagePrefix(m)}</span>
            <span className='message'>{m.message}</span>
            {getMessagePostfixElement(m)}
          </p> 
        ))}
        </div>
      )}
    </div>
  )
})

export default Dash
