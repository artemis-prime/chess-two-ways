import React from 'react'
import { computed } from 'mobx'
import { observer } from 'mobx-react-lite'

import { type CSS } from '~/style'
import { useChess } from '~/services'
import { GhostButton, Row, ChalkText } from '~/primatives'

const UndoRedoWidget: React.FC<{ 
  css?: CSS
}> = observer(({
  css
}) => {
  const game = useChess()

  const either = computed(() => (
    game.canUndo || game.canRedo
  ))

  return (
    <Row justify='end' css={css} >
      <GhostButton 
        disabled={!game.canUndo}
        onClick={game.undo.bind(game)}
        css={{ mr: !(either) ? 15 : 6 }}
      >Undo</GhostButton>
      {(either) && <ChalkText>|</ChalkText>}
      <GhostButton 
        disabled={!game.canRedo}
        onClick={game.redo.bind(game)}
        css={{ ml: !(either) ? 0 : 5 }}
      >Redo</GhostButton>
    </Row>
  )
})

export default UndoRedoWidget
