import React from 'react'
import { 
  View,
  StyleProp,
  ViewStyle,
  Text
} from 'react-native'

import { styled, useTheme } from '~/style/stitches.config'
import ui from '~/style/conf'

import BGImage from '~/primatives/BGImage'
//import GhostButton from '~/primatives/GhostButton'

import UndoRedoWidget from './UndoRedoWidget'
import TurnIndicator from './TurnIndicator'
import InCheckIndicator from './InCheckIndicator'
import { useGame } from '~/service'

import toRestore from '../gameDataForCastle'

const StyledBGImage = styled(BGImage, {

  flexGrow: 0,
  flexShrink: 1,
  backgroundColor: '#333',
  minHeight: 150,
  borderWidth: 2,
  borderRadius: 8,
  //borderTopRightRadius: 17,
  borderColor: '$dashBorder',
})

const Dash: React.FC<{
  style?: StyleProp<ViewStyle>
}> = ({
  style
}) => {
  
  const game = useGame()
  const theme = useTheme()

  const restoreGame = () => {
    //game.restoreFromSnapshot(toRestore)
  }

  return (
    <StyledBGImage imageURI={'slate_bg'}  style={style}>

      <View style={{
        flexDirection: 'row', 
        justifyContent: 'flex-start', 
        alignItems: 'center',

        height: 40, 
        width: '100%', 
        backgroundColor: theme.colors.headerBG,
        paddingLeft: 12,
        borderBottomWidth: 0.5,
        borderBottomColor: 'gray',
    }} >
        <Text style={{
          color: 'white',
          fontSize: 22,
          textAlignVertical: 'center',
          fontWeight: "900",
        }}>{'\u2630'}</Text>

      </View>
      <View style={{ 
        padding: ui.layout.padding, 
        //paddingTop: ui.layout.padding - 5,
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
