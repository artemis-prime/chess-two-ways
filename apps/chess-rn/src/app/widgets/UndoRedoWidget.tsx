import React from 'react'
import { observer } from 'mobx-react-lite'

import { type CSS } from '~/style'
import { useChess } from '~/services'
import { GhostButton, Row } from '~/primatives'

const UndoRedoWidget: React.FC<{ 
  css?: CSS
}> = observer(({
  css
}) => {
  const game = useChess()
  return (
    <Row justify='end' align='stretch' css={css} >
      <GhostButton 
        menu
        disabled={!game.canUndo}
        onClick={game.undo}
        css={{ px: '$2' }}
        textCss={{fontSize: 40, top: 1}}
      >{'\u2039'}</GhostButton>
      <GhostButton 
        menu
        disabled={!game.canRedo}
        onClick={game.redo}
        css={{ px: '$2' }}
        textCss={{fontSize: 40, top: 1}}
      >{'\u203A'}</GhostButton>
    </Row>
  )
})

export default UndoRedoWidget
