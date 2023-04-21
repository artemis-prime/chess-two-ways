  // @ts-ignore
import React from 'react'
import { observer } from 'mobx-react'

import ScrollableFeed from 'react-scrollable-feed' 

import { PIECETYPE_TO_UNICODE }  from '@artemis-prime/chess-core'

import { useMessages, type ConsoleMessage } from '~/service'

import '~/style/messages.scss'
  // TS workaround for put in module
const Scrollable = ScrollableFeed as any

const EMOJIS = {
  ninja: '\u{1f977}',
  shrug: '\u{1F937}\u200D\u2642\uFE0F',
  ouch: '\u{1F64E}\u200D\u2642\uFE0F'
}

const Messages: React.FC<{
  showMoves: boolean
}> = observer(({
  showMoves
}) => {

  const messages = useMessages()

  const getIndentation = (m: ConsoleMessage): string => (
    m.type.includes('undo') || 
    m.type.includes('redo') || 
    (m.type === 'check') ||
    m.type.includes('transient')
    ? 'indent' : ''
  )

  const getMessagePrefix = (m: ConsoleMessage): React.ReactNode | null => {
    if (m.type.includes('undo')) return (<span className='prefix'>(undo:)</span>)
    if (m.type.includes('redo')) return (<span className='prefix'>(redo:)</span>)
    if (m.type.includes('check-message')) return (
      <span className='prefix'>
        <span className={`side-indicator ${m.note!.side}`} /><span className='loud'>in check</span>
      </span>)
    return null
  }

  const getMessagePostfixElement = (m: ConsoleMessage): React.ReactNode | null => {
      // not in check output takes precedence over capture!
    if (m.type.includes('out-of-check-move')) {
      // ninja emoji
      return m.type.includes('undo') ? null : (<span className='postfix'>(phew! <span className='emoji'>{EMOJIS.ninja}</span>)</span>)  
    }
    else if (m.type.includes('check-move')) {
      return <span className='postfix strong'>check!</span>   
    }
    else if (m.type.includes('capture')) {
      const pieceType = m.actionRecord!.captured!.type
      const colorCaptured = m.actionRecord!.captured!.color
      return (
        <span className='postfix'>
          <span className={`side-indicator ${colorCaptured}`} />
          <span>(<span className={`unicode-chess-piece ${colorCaptured}`}>{PIECETYPE_TO_UNICODE[pieceType]}</span>
            - {pieceType !== 'pawn' ? `${EMOJIS.ouch} ouch!` : `${EMOJIS.shrug} meh`})</span>
        </span>
      ) 
    }

    return null
  }

  const isMove = (m: ConsoleMessage) => (!!m.actionRecord)

  const getMessageElement = (m: ConsoleMessage): React.ReactNode | null => {
    if (isMove(m) && (m.message.startsWith('w') || m.message.startsWith('b'))) {
      const colorCode = m.message.slice(0, 1)  
      const rest = m.message.substring(1)
      return (<span className='message'><span className={`side-indicator ${colorCode === 'w' ? 'white' : 'black'}`} />{rest}</span>)
    }
  
    return <span className='message'>{m.message}</span>
  }


  return messages.length > 0 ? (
    <Scrollable className='messages-list'>
    {messages.map((m, i) => {
      if (m.type.includes('do-not-show') || (!showMoves && isMove(m))) return null
      const postFix = getMessagePostfixElement(m)
      return (
        <div key={i} className={`message-outer ${getIndentation(m)} ${postFix ? 'has-postfix' : 'no-postfix'} ${m.type}`}>
          <p className='message-and-prefix'>
            {getMessagePrefix(m)}
            {getMessageElement(m)}
          </p>
          {postFix && <p className='message-postfix'>{postFix}</p>}
        </div>
      )
    })}
    </Scrollable>
  ) : null
})

export default Messages
