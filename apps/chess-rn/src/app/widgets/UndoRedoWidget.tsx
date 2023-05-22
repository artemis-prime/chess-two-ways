import React from 'react'
import type { StyleProp, ViewStyle } from 'react-native'
import { observer } from 'mobx-react-lite'
import { type CSS } from 'stitches-native'

import { useChess } from '~/services'
import { GhostButton, Row, ChalkText } from '~/primatives'

const UndoRedoWidget: React.FC<{ 
  style?: StyleProp<ViewStyle> 
  css?: CSS
}> = observer(({
  style,
  css
}) => {
  const game = useChess()
  return (
    <Row justify='end' style={style} css={css} >
      <GhostButton 
        disabled={!game.canUndo}
        onClick={game.undo.bind(game)}
        style={{ marginRight: !(game.canUndo || game.canRedo) ? 15 : 6 }}
      >Undo</GhostButton>
      {(game.canUndo || game.canRedo) && <ChalkText>|</ChalkText>}
      <GhostButton 
        disabled={!game.canRedo}
        onClick={game.redo.bind(game)}
        style={{ marginLeft: !(game.canUndo || game.canRedo) ? 0 : 5 }}
      >Redo</GhostButton>
    </Row>
  )
})

export default UndoRedoWidget
