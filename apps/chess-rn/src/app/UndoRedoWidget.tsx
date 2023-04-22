  // @ts-ignore
import React from 'react'
import {
  View, 
  StyleProp,
  Text,
  ViewStyle,
} from 'react-native'
import { observer } from 'mobx-react'

import { useGame } from '~/service'
import GhostButton from '~/primatives/GhostButton'
import { styled, common } from '~/style/stitches.config'

const PipeSymbolText = styled(Text, common.dashTextCommon)

const UndoRedoWidget: React.FC<{ 
  style?: StyleProp<ViewStyle> 
}> = observer(({
  style
}) => {

  const game = useGame()

  return (
    <View style={[{flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }, style]} >
      <GhostButton 
        disabled={!game.canUndo}
        onClick={game.undo.bind(game)}
        style={{ marginRight: !(game.canUndo || game.canRedo) ? 15 : 6 }}
      >Undo</GhostButton>
      {(game.canUndo || game.canRedo) && <PipeSymbolText>|</PipeSymbolText>}
      <GhostButton 
        disabled={!game.canRedo}
        onClick={game.redo.bind(game)}
        style={{ marginLeft: !(game.canUndo || game.canRedo) ? 0 : 5 }}
      >Redo</GhostButton>
    </View>
  )
})

export default UndoRedoWidget
