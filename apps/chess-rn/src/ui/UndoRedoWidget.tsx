  // @ts-ignore
import React from 'react'
import {
  View, 
  StyleProp,
  Text,
  ViewStyle,
} from 'react-native'

import { observer } from 'mobx-react'

import { useGame } from '~/board/GameProvider'

import GhostButton from '~/primatives/GhostButton'
  
import ui from '~/conf/conf'
import { useTheme } from '~/conf/stitches.config'

const UndoRedoWidget: React.FC<{ 
  style?: StyleProp<ViewStyle> 
}> = observer(({
  style
}) => {

  const game = useGame()
  const theme = useTheme()

  return (
    <View style={[{flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }, style]} >
      <GhostButton 
        disabled={!game.canUndo}
        onClick={game.undo.bind(game)}
        style={{ marginRight: !(game.canUndo || game.canRedo) ? 15 : 6 }}
      >Undo</GhostButton>
      {(game.canUndo || game.canRedo) && <Text style={{...ui.typography.common, color: theme.colors.dashText }}>I</Text>}
      <GhostButton 
        disabled={!game.canRedo}
        onClick={game.redo.bind(game)}
        style={{ marginLeft: !(game.canUndo || game.canRedo) ? 0 : 5 }}
      >Redo</GhostButton>
    </View>
  )
})

export default UndoRedoWidget
