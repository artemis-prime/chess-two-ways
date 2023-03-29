  // @ts-ignore
import React from 'react'
import { observer } from 'mobx-react'

import type { ConsoleMessage } from '~/board/VisualFeedback'
import { useGame } from '~/board/GameProvider'

import { Button, Flex } from '~/primitives'

import { useVisualFeedback } from '~/board/VisualFeedback'
import unicodePieces from './pieceTypeToUnicode'


const Dash: React.FC<{}> = observer(() => {

  const game = useGame()
  const { messages } = useVisualFeedback()

  const getMessagePrefix = (m: ConsoleMessage): React.ReactNode | null => {
    if (m.type.includes('undo')) return (<span className='prefix'>&nbsp;&nbsp;(undo:)&nbsp;</span>)
    if (m.type.includes('redo')) return (<span className='prefix'>&nbsp;&nbsp;(redo:)&nbsp;</span>)
    if (m.type === 'check') return (<span className='prefix'><span className='loud'>&nbsp;&nbsp;Check!</span> (<span className={`side-indicator ${m.note!.side}`} >&nbsp;</span>&nbsp;</span>)
    return ''
  }

  const getMessagePostfixElement = (m: ConsoleMessage): React.ReactNode | null => {
      // not in check output takes precedence over capture!
    if (m.type.includes('not-in-check')) {
      // ninja emoji
      return m.type.includes('undo') ? null : (<span className='postfix'>(phew! <span className='emoji'>{'\u{1f977}'}</span>)</span>)  
    }
    else if (m.type.includes('capture')) {
      const pieceType = m.actionRecord!.captured!.type
      const colorCaptured = m.actionRecord!.captured!.color
      return (
        <span className='postfix'><span className={`side-indicator ${colorCaptured}`} >&nbsp;</span>&nbsp;(<span className={`unicode-chess-piece ${colorCaptured}`}>{(unicodePieces as any)[pieceType]}</span>- {pieceType !== 'pawn' ? '\u{1F64E}\u200D\u2642\uFE0F ouch!' : '\u{1F937}\u200D\u2642\uFE0F meh'})</span>
      ) 
    }
    return null
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
      {messages.length > 0 && (<>
          <p>----------------------</p>
          <div className='messages-list'>
        {messages.map((m, i) => {
          const postFix = getMessagePostfixElement(m)
          return (
            <div key={i} className={`message-outer ${postFix ? 'has-postfix' : 'no-postfix'} message ${m.type}`}>
              <p className='message-and-prefix'>
                <span className='prefix'>{getMessagePrefix(m)}</span>
                <span className='message'>{m.message}</span>
              </p>
              {postFix && <p className='message-postfix'>{postFix}</p>}
            </div>
          )
        })}
        </div>
      </>)}
    </div>
  )
})

export default Dash
