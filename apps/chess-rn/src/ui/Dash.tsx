import React from 'react'
import { 
  View,
  StyleProp,
  ViewStyle
} from 'react-native'

import { styled } from '~/conf/stitches.config'
import ui from '~/conf/conf'

import BGImage from '~/primatives/BGImage'
import GhostButton from '~/primatives/GhostButton'
import UndoRedoWidget from './UndoRedoWidget'
import TurnIndicator from './TurnIndicator'
import InCheckIndicator from './InCheckIndicator'
import { useGame } from '~/board/GameProvider'

import toRestore from './gameDataForCastle'

const StyledBGImage = styled(BGImage, {

  flexGrow: 0,
  flexShrink: 1,
  backgroundColor: '#333',
  minHeight: 95,
  borderWidth: 4,
  borderTopLeftRadius: 17,
  borderTopRightRadius: 17,
  borderColor: '$dashBorder',
})

const Dash: React.FC<{
  style?: StyleProp<ViewStyle>
}> = ({
  style
}) => {
  
  const game = useGame()

  const restoreGame = () => {
    game.restoreFromGameData(toRestore)
  }

  return (
    <StyledBGImage imageURI={'slate_bg'}  style={style}>
      <View style={{ 
        padding: ui.layout.padding, 
        paddingTop: ui.layout.padding - 5,
        flexDirection: 'column', 
        justifyContent: 'flex-start', 
        alignItems: 'flex-start'
      }}>
        <View style={{
          flexDirection: 'row', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          alignSelf: 'stretch'
        }}>
          <TurnIndicator />
          <UndoRedoWidget />
        </View>
        <InCheckIndicator />
        {/*}
        <GhostButton 
          onClick={restoreGame}
          style={{ alignSelf: 'flex-end' }}
      >Restore</GhostButton> */}
      </View>
    </StyledBGImage>
  )
}

export default Dash
